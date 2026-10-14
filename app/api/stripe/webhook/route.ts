import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { notify } from "@/lib/notify";

// Verifies the Stripe-Signature header (see Stripe docs: "Check the webhook signatures").
function verify(payload: string, header: string, secret: string): boolean {
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=") as [string, string]));
  const timestamp = parts.t;
  const signatures = header
    .split(",")
    .filter((p) => p.startsWith("v1="))
    .map((p) => p.slice(3));
  if (!timestamp || signatures.length === 0) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
  return signatures.some((sig) => sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected)));
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "webhook not configured" }, { status: 501 });
  const payload = await request.text();
  const header = request.headers.get("stripe-signature") ?? "";
  if (!verify(payload, header, secret)) return NextResponse.json({ error: "bad signature" }, { status: 400 });

  const event = JSON.parse(payload);
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const meta = session.metadata ?? {};
    await notify({
      kind: "order",
      subject: `Porosi e re ${meta.orderId ?? session.client_reference_id} — ${(session.amount_total / 100).toFixed(2)} € (paguar me kartelë)`,
      replyTo: meta.email,
      data: { ...meta, payment: "card (paid)", stripeSession: session.id, amountTotal: session.amount_total / 100 },
    });
  }
  return NextResponse.json({ received: true });
}
