// Delivers orders and form submissions to the store team. Configure email
// (Resend) and/or a JSON webhook through environment variables; everything is
// also written to the server log so nothing is lost while those are unset.

type Payload = { kind: string; subject: string; data: Record<string, unknown>; replyTo?: string };

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function toHtml(data: Record<string, unknown>): string {
  const rows = Object.entries(data)
    .map(([key, value]) => {
      const text = typeof value === "string" ? value : JSON.stringify(value, null, 2);
      return `<tr><td style="padding:6px 12px;vertical-align:top;color:#666">${escapeHtml(key)}</td><td style="padding:6px 12px"><pre style="margin:0;font-family:inherit;white-space:pre-wrap">${escapeHtml(text)}</pre></td></tr>`;
    })
    .join("");
  return `<table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${rows}</table>`;
}

export async function sendEmail(to: string, subject: string, html: string, replyTo?: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.NOTIFY_EMAIL_FROM || "CAPRAVA <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });
  if (!res.ok) console.error("[notify] email failed", res.status, await res.text());
}

export async function notify({ kind, subject, data, replyTo }: Payload): Promise<void> {
  console.log(`[notify] ${kind}: ${subject}`, JSON.stringify(data));
  const tasks: Promise<unknown>[] = [];
  const to = process.env.NOTIFY_EMAIL_TO;
  if (to) tasks.push(sendEmail(to, subject, toHtml(data), replyTo));
  const hook = process.env.NOTIFY_WEBHOOK_URL;
  if (hook) {
    tasks.push(
      fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, subject, ...data }),
      }).then((r) => {
        if (!r.ok) console.error("[notify] webhook failed", r.status);
      }),
    );
  }
  const results = await Promise.allSettled(tasks);
  for (const r of results) if (r.status === "rejected") console.error("[notify]", r.reason);
}
