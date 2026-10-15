"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { isStaticExport } from "@/lib/asset";
import { site } from "@/lib/config";
import { fill } from "@/lib/i18n";
import { useI18n } from "./I18nProvider";

function Details() {
  const { t } = useI18n();
  const params = useSearchParams();
  const order = params.get("order");
  const orderId = order && /^CPR-[0-9A-Z-]{4,20}$/.test(order) ? order : undefined;
  return (
    <>
      {isStaticExport && <p className="order-note">{fill(t.byEmail.order, { email: site.email })}</p>}
      {params.get("paid") && <p>{t.success.paid}</p>}
      {orderId && (
        <p className="order-id">
          {t.success.order}: <strong>{orderId}</strong>
        </p>
      )}
    </>
  );
}

export function OrderDetails() {
  return (
    <Suspense fallback={null}>
      <Details />
    </Suspense>
  );
}
