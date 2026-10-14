import { shipping, site } from "./config";
import type { Locale } from "./i18n";

type Doc = { title: string; sections: { heading: string; body: string[] }[] };

// TODO: draft texts — have them reviewed by a lawyer and fill in the company's
// legal name, business number and address before launch.
export const legalDocs: Record<string, Record<Locale, Doc>> = {
  shipping: {
    sq: {
      title: "Dërgesa & kthimet",
      sections: [
        {
          heading: "Ku dërgojmë",
          body: [
            "Aktualisht dërgojmë në Kosovë, Shqipëri, Maqedoni të Veriut dhe Mal të Zi.",
            `Transporti është falas për porosi mbi ${shipping.freeFrom} €. Për porositë më të vogla, kostoja llogaritet në pagesë sipas shtetit.`,
          ],
        },
        {
          heading: "Afati i dërgesës",
          body: ["Porositë në Kosovë arrijnë zakonisht brenda 1–3 ditëve të punës; në shtetet e tjera brenda 3–6 ditëve të punës."],
        },
        {
          heading: "Kthimet",
          body: [
            "Mund ta kthesh një produkt të pahapur dhe në paketimin origjinal brenda 14 ditëve nga pranimi.",
            "Për arsye higjienike, parfumet e hapura nuk mund të kthehen, përveç nëse produkti ka defekt.",
            `Për të nisur një kthim, na shkruaj në ${site.email} me numrin e porosisë.`,
          ],
        },
      ],
    },
    en: {
      title: "Shipping & returns",
      sections: [
        {
          heading: "Where we ship",
          body: [
            "We currently ship to Kosovo, Albania, North Macedonia and Montenegro.",
            `Shipping is free on orders over €${shipping.freeFrom}. For smaller orders the cost is calculated at checkout based on the country.`,
          ],
        },
        {
          heading: "Delivery times",
          body: ["Orders within Kosovo usually arrive in 1–3 working days; other countries in 3–6 working days."],
        },
        {
          heading: "Returns",
          body: [
            "You can return an unopened product in its original packaging within 14 days of receiving it.",
            "For hygiene reasons opened perfumes cannot be returned unless the product is faulty.",
            `To start a return, email ${site.email} with your order number.`,
          ],
        },
      ],
    },
  },
  terms: {
    sq: {
      title: "Kushtet e shitjes",
      sections: [
        { heading: "Shitësi", body: ["Produktet në këtë faqe shiten nga CAPRAVA, me seli në Kosovë."] },
        { heading: "Çmimet", body: ["Të gjitha çmimet janë në euro dhe përfshijnë TVSH-në. Kostoja e transportit shfaqet para përfundimit të porosisë."] },
        {
          heading: "Porosia dhe pagesa",
          body: [
            "Porosia konsiderohet e pranuar pasi të marrësh konfirmimin me numrin e porosisë.",
            "Pagesa bëhet në dorëzim ose me kartelë përmes ofruesit tonë të sigurt të pagesave.",
          ],
        },
        { heading: "Dërgesa dhe kthimet", body: ["Kushtet e dërgesës dhe të kthimit përshkruhen në faqen “Dërgesa & kthimet”."] },
      ],
    },
    en: {
      title: "Terms of sale",
      sections: [
        { heading: "Seller", body: ["Products on this site are sold by CAPRAVA, based in Kosovo."] },
        { heading: "Prices", body: ["All prices are in euro and include VAT. Shipping costs are shown before you place your order."] },
        {
          heading: "Orders and payment",
          body: [
            "An order is accepted once you receive the confirmation with your order number.",
            "Payment is made on delivery or by card through our secure payment provider.",
          ],
        },
        { heading: "Shipping and returns", body: ["Shipping and return conditions are described on the “Shipping & returns” page."] },
      ],
    },
  },
  privacy: {
    sq: {
      title: "Politika e privatësisë",
      sections: [
        {
          heading: "Çfarë të dhënash mbledhim",
          body: ["Emrin, të dhënat e kontaktit dhe adresën e dërgesës që na jep gjatë porosisë ose në formularë."],
        },
        {
          heading: "Pse i përdorim",
          body: ["Për të përpunuar dhe dërguar porositë, për t’iu përgjigjur mesazheve dhe — vetëm nëse abonohesh — për të të dërguar lajme nga CAPRAVA."],
        },
        {
          heading: "Pagesat",
          body: ["Pagesat me kartelë përpunohen nga Stripe. CAPRAVA nuk i ruan të dhënat e kartelës."],
        },
        { heading: "Të drejtat e tua", body: [`Mund të kërkosh qasje, korrigjim ose fshirje të të dhënave të tua duke na shkruar në ${site.email}.`] },
      ],
    },
    en: {
      title: "Privacy policy",
      sections: [
        { heading: "What we collect", body: ["Your name, contact details and delivery address, provided when you order or use our forms."] },
        {
          heading: "Why we use it",
          body: ["To process and deliver orders, reply to messages and — only if you subscribe — send you news from CAPRAVA."],
        },
        { heading: "Payments", body: ["Card payments are processed by Stripe. CAPRAVA never stores your card details."] },
        { heading: "Your rights", body: [`You can request access to, correction of or deletion of your data by emailing ${site.email}.`] },
      ],
    },
  },
};
