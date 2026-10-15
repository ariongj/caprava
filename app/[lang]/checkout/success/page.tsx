import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClearCart } from "@/components/ClearCart";
import { OrderDetails } from "@/components/OrderDetails";
import { SparkleIcon } from "@/components/Sparkle";
import { href } from "@/lib/format";
import { getDictionary, isLocale } from "@/lib/i18n";

export const metadata: Metadata = { robots: { index: false } };

export default async function Success({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <div className="container page page-narrow success">
      <ClearCart />
      <SparkleIcon className="success-star" />
      <h1>{t.success.title}</h1>
      <p className="lead">{t.success.text}</p>
      <OrderDetails />
      <Link href={href(lang)} className="button">
        {t.success.back}
      </Link>
    </div>
  );
}
