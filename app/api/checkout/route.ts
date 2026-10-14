import { NextResponse } from "next/server";
import { site } from "@/lib/config";
import { isLocale, type Locale } from "@/lib/i18n";
import { notify, sendEmail } from "@/lib/notify";
import { newOrderId, orderSummaryText, parseCustomer, priceOrder, type Customer, type PricedOrder } from "@/lib/orders";

function customerText(c: Customer): Record<string, string> {
  return {
    customer: `${c.firstName} ${c.lastName}`,
    email: c.email,
    phone: c.phone,
    address: [c.address, c.postalCode, c.city, c.country].filter(Boolean).join(", "),
    note: c.note,
  };
}

async function createStripeSession(orderId: string, order: PricedOrder, customer: Customer, locale: Locale, origin: string) {
  const form = new URLSearchParams();
  form.set("mode", "payment");
  form.set("customer_email", customer.email);
  form.set("locale", locale === "sq" ? "auto" : "en");
  form.set("client_reference_id", orderId);
  form.set("success_url", `${origin}/${locale}/checkout/success?order=${orderId}&paid=1`);
  form.set("cancel_url", `${origin}/${locale}/checkout`);
  order.lines.forEach((l, i) => {
    form.set(`line_items[${i}][quantity]`, String(l.qty));
    form.set(`line_items[${i}][price_data][currency]`, "eur");
    form.set(`line_items[${i}][price_data][unit_amount]`, String(Math.round(l.unitPrice * 100)));
    form.set(`line_items[${i}][price_data][product_data][name]`, `CAPRAVA ${l.name}`);
  });
  if (order.shipping > 0) {
    const i = order.lines.length;
    form.set(`line_items[${i}][quantity]`, "1");
    form.set(`line_items[${i}][price_data][currency]`, "eur");
    form.set(`line_items[${i}][price_data][unit_amount]`, String(Math.round(order.shipping * 100)));
    form.set(`line_items[${i}][price_data][product_data][name]`, locale === "sq" ? "Transporti" : "Shipping");
  }
  // Stripe metadata values are limited to 500 characters each.
  const meta: Record<string, string> = {
    orderId,
    items: order.lines.map((l) => `${l.qty}x ${l.slug} ${l.ml}ml`).join(", "),
    total: order.total.toFixed(2),
    ...customerText(customer),
  };
  for (const [k, v] of Object.entries(meta)) if (v) form.set(`metadata[${k}]`, v.slice(0, 500));

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "stripe error");
  return data.url as string;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const locale: Locale = typeof body.locale === "string" && isLocale(body.locale) ? body.locale : "sq";
  const customer = parseCustomer(body.customer);
  if (typeof customer === "string") return NextResponse.json({ error: customer }, { status: 400 });
  const order = priceOrder(body.lines, customer.country, locale);
  if (typeof order === "string") return NextResponse.json({ error: order }, { status: 400 });
  const payment = body.payment === "card" ? "card" : "cod";
  const orderId = newOrderId();

  if (payment === "card") {
    if (!process.env.STRIPE_SECRET_KEY) return NextResponse.json({ error: "card payments are not enabled" }, { status: 400 });
    try {
      const origin = request.headers.get("origin") || site.url;
      const url = await createStripeSession(orderId, order, customer, locale, origin);
      return NextResponse.json({ url, orderId });
    } catch (err) {
      console.error("[checkout] stripe", err);
      return NextResponse.json({ error: "payment provider error" }, { status: 502 });
    }
  }

  const summary = orderSummaryText(order, locale);
  await notify({
    kind: "order",
    subject: `Porosi e re ${orderId} — ${order.total.toFixed(2)} € (pagesa në dorëzim)`,
    replyTo: customer.email,
    data: { orderId, payment: "cash on delivery", ...customerText(customer), items: summary, lines: order.lines, total: order.total },
  });
  const confirmation =
    locale === "sq"
      ? `<p>Përshëndetje ${customer.firstName},</p><p>Faleminderit për porosinë <strong>${orderId}</strong>. Do të të kontaktojmë së shpejti për të konfirmuar dërgesën. Pagesa bëhet në dorëzim.</p>`
      : `<p>Hello ${customer.firstName},</p><p>Thank you for your order <strong>${orderId}</strong>. We will contact you shortly to confirm delivery. Payment is due on delivery.</p>`;
  await sendEmail(
    customer.email,
    locale === "sq" ? `Porosia jote CAPRAVA ${orderId}` : `Your CAPRAVA order ${orderId}`,
    `${confirmation}<pre style="font-family:inherit">${summary.replace(/</g, "&lt;")}</pre><p>CAPRAVA</p>`,
  ).catch((err) => console.error("[checkout] confirmation email", err));

  return NextResponse.json({ orderId });
}
