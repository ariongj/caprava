import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Sora } from "next/font/google";
import { notFound } from "next/navigation";
import { CartDrawer } from "@/components/CartDrawer";
import { CartProvider } from "@/components/CartProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { I18nProvider } from "@/components/I18nProvider";
import { Reveal } from "@/components/Reveal";
import { ScentMist } from "@/components/ScentMist";
import { site } from "@/lib/config";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import "../globals.css";

const display = Sora({ subsets: ["latin", "latin-ext"], weight: ["400", "600", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-body" });
const serif = Cormorant_Garamond({ subsets: ["latin", "latin-ext"], weight: ["400", "500"], style: ["italic", "normal"], variable: "--font-serif" });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    metadataBase: new URL(site.url),
    title: { default: t.meta.title, template: "%s · CAPRAVA" },
    description: t.meta.description,
    alternates: { canonical: `/${lang}`, languages: { sq: "/sq", en: "/en" } },
    openGraph: { type: "website", siteName: "CAPRAVA", title: t.meta.title, description: t.meta.description, locale: lang === "sq" ? "sq_AL" : "en_GB" },
  };
}

export const viewport: Viewport = { themeColor: "#050505", colorScheme: "dark" };

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <html lang={lang} className={`${display.variable} ${body.variable} ${serif.variable}`}>
      <body>
        <I18nProvider locale={lang} t={t}>
          <CartProvider>
            <a href="#main" className="skip-link">
              Skip to content
            </a>
            <Header />
            <main id="main">{children}</main>
            <Footer locale={lang} t={t} />
            <CartDrawer />
            <ScentMist />
            <Reveal />
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
