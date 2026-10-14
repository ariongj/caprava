import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClearCart } from "@/components/ClearCart";
import { SparkleIcon } from "@/components/Sparkle";
import { href } from "@/lib/format";
import { getDictionary, isLocale } from "@/lib/i18n";

export const metadata: Metadata = { robots: { index: false } };

export default async function Success({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ order?: string; paid?: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const { order, paid } = await searchParams;
  const orderId = order && /^CPR-[0-9A-Z-]{4,20}$/.test(order) ? order : undefined;

  return (
    <div className="container page page-narrow success">
      <ClearCart />
      <SparkleIcon className="success-star" />
      <h1>{t.success.title}</h1>
      <p className="lead">{t.success.text}</p>
      {paid && <p>{t.success.paid}</p>}
      {orderId && (
        <p className="order-id">
          {t.success.order}: <strong>{orderId}</strong>
        </p>
      )}
      <Link href={href(lang)} className="button">
        {t.success.back}
      </Link>
    </div>
  );
}
