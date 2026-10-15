"use client";

import { useState } from "react";
import { isStaticExport } from "@/lib/asset";
import type { Dictionary } from "@/lib/i18n";
import { openEmail } from "@/lib/mailto";
import { useI18n } from "./I18nProvider";

type Status = "idle" | "sending" | "done" | "error";

async function submitInquiry(kind: string, data: Record<string, string>, t: Dictionary): Promise<boolean> {
  // The static site has no server: the message goes out through the visitor's email app.
  if (isStaticExport) {
    const subjects: Record<string, string> = {
      newsletter: t.byEmail.subscribe,
      notify: `${t.byEmail.notify}: ${data.product ?? ""}`,
      contact: `${t.contact.title} — ${data.name ?? ""}`,
      partnership: `${t.partners.title} — ${data.name ?? ""}`,
    };
    const labels: Record<string, string> = {
      name: t.partners.name, email: t.contact.email, company: t.partners.company, phone: t.partners.phone,
      country: t.partners.country, type: t.partners.type, product: t.finder.resultEyebrow, message: t.contact.message,
    };
    const lines = Object.entries(data)
      .filter(([k, v]) => v && k !== "website" && k !== "locale")
      .map(([k, v]) => (k === "message" ? `\n${v}` : `${labels[k] ?? k}: ${k === "type" ? (t.partners.types as Record<string, { title: string }>)[v]?.title ?? v : v}`));
    openEmail(subjects[kind] ?? "CAPRAVA", lines);
    return true;
  }
  try {
    const res = await fetch("/api/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, ...data }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function formData(form: HTMLFormElement): Record<string, string> {
  return Object.fromEntries(Array.from(new FormData(form).entries()).map(([k, v]) => [k, String(v)]));
}

// Hidden field that people never fill in; bots usually do.
function Honeypot() {
  return (
    <label className="hp" aria-hidden="true">
      Website
      <input name="website" tabIndex={-1} autoComplete="off" />
    </label>
  );
}

export function EmailCapture({ kind, product, placeholder, cta, thanks }: { kind: "newsletter" | "notify"; product?: string; placeholder: string; cta: string; thanks: string }) {
  const { locale, t } = useI18n();
  const [status, setStatus] = useState<Status>("idle");

  if (status === "done") return <p className="form-success">{isStaticExport ? t.byEmail.form : thanks}</p>;

  return (
    <form
      className="email-capture"
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("sending");
        const ok = await submitInquiry(kind, { ...formData(e.currentTarget), product: product ?? "", locale }, t);
        setStatus(ok ? "done" : "error");
      }}
    >
      <Honeypot />
      <input type="email" name="email" required placeholder={placeholder} aria-label={placeholder} />
      <button className="button" disabled={status === "sending"}>
        {status === "sending" ? t.common.sending : cta}
      </button>
      {status === "error" && <p className="form-error">{t.checkout.error}</p>}
    </form>
  );
}

export function ContactForm() {
  const { locale, t } = useI18n();
  const [status, setStatus] = useState<Status>("idle");
  if (status === "done") return <p className="form-success">{isStaticExport ? t.byEmail.form : t.contact.thanks}</p>;
  return (
    <form
      className="form"
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("sending");
        setStatus((await submitInquiry("contact", { ...formData(e.currentTarget), locale }, t)) ? "done" : "error");
      }}
    >
      <Honeypot />
      <div className="form-row">
        <label className="field">
          <span>{t.contact.name}</span>
          <input name="name" required autoComplete="name" />
        </label>
        <label className="field">
          <span>{t.contact.email}</span>
          <input name="email" type="email" required autoComplete="email" />
        </label>
      </div>
      <label className="field">
        <span>{t.contact.message}</span>
        <textarea name="message" required rows={6} />
      </label>
      <button className="button" disabled={status === "sending"}>
        {status === "sending" ? t.common.sending : t.common.send}
      </button>
      {status === "error" && <p className="form-error">{t.checkout.error}</p>}
    </form>
  );
}

export function PartnerForm({ initialType = "partner" }: { initialType?: string }) {
  const { locale, t } = useI18n();
  const [status, setStatus] = useState<Status>("idle");
  if (status === "done") return <p className="form-success">{isStaticExport ? t.byEmail.form : t.partners.thanks}</p>;
  const types = Object.entries(t.partners.types);
  return (
    <form
      className="form"
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("sending");
        setStatus((await submitInquiry("partnership", { ...formData(e.currentTarget), locale }, t)) ? "done" : "error");
      }}
    >
      <Honeypot />
      <label className="field">
        <span>{t.partners.type}</span>
        <select name="type" defaultValue={initialType}>
          {types.map(([key, v]) => (
            <option key={key} value={key}>
              {v.title}
            </option>
          ))}
        </select>
      </label>
      <div className="form-row">
        <label className="field">
          <span>{t.partners.name}</span>
          <input name="name" required autoComplete="name" />
        </label>
        <label className="field">
          <span>{t.partners.company}</span>
          <input name="company" autoComplete="organization" />
        </label>
      </div>
      <div className="form-row">
        <label className="field">
          <span>{t.partners.email}</span>
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label className="field">
          <span>{t.partners.phone}</span>
          <input name="phone" type="tel" autoComplete="tel" />
        </label>
      </div>
      <label className="field">
        <span>{t.partners.country}</span>
        <input name="country" required />
      </label>
      <label className="field">
        <span>{t.partners.message}</span>
        <textarea name="message" required rows={5} />
      </label>
      <button className="button" disabled={status === "sending"}>
        {status === "sending" ? t.common.sending : t.common.send}
      </button>
      {status === "error" && <p className="form-error">{t.checkout.error}</p>}
    </form>
  );
}
