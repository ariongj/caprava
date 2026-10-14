import Link from "next/link";
import { getDictionary, defaultLocale } from "@/lib/i18n";

export default function NotFound() {
  const t = getDictionary(defaultLocale);
  const en = getDictionary("en");
  return (
    <div className="container page page-narrow success">
      <h1>{t.notFound.title}</h1>
      <p className="lead">
        {t.notFound.text} / {en.notFound.text}
      </p>
      <Link href="/" className="button">
        CAPRAVA
      </Link>
    </div>
  );
}
