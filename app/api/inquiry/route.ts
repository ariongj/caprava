import { NextResponse } from "next/server";
import { notify } from "@/lib/notify";

const kinds = new Set(["newsletter", "notify", "contact", "partnership"]);
const allowed = ["email", "name", "company", "phone", "country", "message", "type", "product", "locale"];

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const kind = String(body.kind ?? "");
  if (!kinds.has(kind)) return NextResponse.json({ error: "unknown form" }, { status: 400 });
  // Honeypot filled in: pretend success so bots don't retry.
  if (body.website) return NextResponse.json({ ok: true });

  const data: Record<string, string> = {};
  for (const key of allowed) {
    const v = body[key];
    if (typeof v === "string" && v.trim()) data[key] = v.trim().slice(0, key === "message" ? 5000 : 200);
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }
  if ((kind === "contact" || kind === "partnership") && (!data.name || !data.message)) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const subjects: Record<string, string> = {
    newsletter: `Abonim i ri: ${data.email}`,
    notify: `Më njofto për ${data.product ?? "fragrancë"}: ${data.email}`,
    contact: `Mesazh nga ${data.name}`,
    partnership: `Bashkëpunim (${data.type ?? "—"}) nga ${data.name}`,
  };
  await notify({ kind, subject: subjects[kind], data, replyTo: data.email });
  return NextResponse.json({ ok: true });
}
