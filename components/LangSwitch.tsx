"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { locales } from "@/lib/i18n";
import { useI18n } from "./I18nProvider";

function Switch() {
  const { locale } = useI18n();
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const rest = pathname.replace(/^\/(sq|en)(?=\/|$)/, "");
  return (
    <div className="lang-switch">
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest}${search ? `?${search}` : ""}`}
          className={l === locale ? "is-active" : undefined}
          aria-current={l === locale ? "true" : undefined}
          onClick={() => {
            document.cookie = `lang=${l}; path=/; max-age=31536000; samesite=lax`;
          }}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}

export function LangSwitch() {
  return (
    <Suspense fallback={<div className="lang-switch" />}>
      <Switch />
    </Suspense>
  );
}
