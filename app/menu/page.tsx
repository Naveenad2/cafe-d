import type { Metadata } from "next";
import MenuClient from "@/components/MenuClient";
import { MENU } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Full Menu — Thai, Chinese & Japanese",
  description:
    "The complete Café de Bangkok menu, Kochi — Tom Yum, hand-folded dim sum, baos, Thai curries with jasmine rice, ramen, sushi, bingsu and more. Search, filter veg/non-veg, and order at your table.",
  alternates: { canonical: "/menu" },
  openGraph: {
    title: "Full Menu — Café de Bangkok, Kochi",
    description:
      "Thai · Chinese · Japanese. Soups, dim sum, baos, curries, ramen, sushi and Korean bingsu. Tap to explore.",
    url: "/menu",
  },
};

/* JSON-LD Menu built from the real data — great for rich results */
function MenuJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "Café de Bangkok — Full Menu, Kochi",
    hasMenuSection: MENU.map((s) => ({
      "@type": "MenuSection",
      name: s.title,
      ...(s.blurb ? { description: s.blurb } : {}),
      hasMenuItem: s.items.map((d) => ({
        "@type": "MenuItem",
        name: d.name,
        ...(d.desc ? { description: d.desc } : {}),
        suitableForDiet:
          d.tag === "veg"
            ? "https://schema.org/VegetarianDiet"
            : undefined,
        offers: d.variants
          ? d.variants.map((v) => ({
              "@type": "Offer",
              price: v.p,
              priceCurrency: "INR",
              name: v.k,
            }))
          : {
              "@type": "Offer",
              price: d.price,
              priceCurrency: "INR",
              ...(d.unit ? { description: d.unit } : {}),
            },
      })),
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function MenuPage() {
  return (
    <>
      <MenuJsonLd />
      <MenuClient />
    </>
  );
}