import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Bricolage_Grotesque, Charm, DM_Mono } from "next/font/google";
import "./globals.css";

/* Type for the "Night Market" sections below the hero (the hero and
   navbar keep their own stack). Exposed as CSS variables that the
   --nm-* tokens in globals.css read. */
const nmDisp = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-nm-disp",
  display: "swap",
});
const nmSerif = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-nm-serif",
  display: "swap",
});
const nmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-nm-mono",
  display: "swap",
});
const nmThai = Charm({
  subsets: ["thai"],
  weight: ["400", "700"],
  variable: "--font-nm-thai",
  display: "swap",
  preload: false,
});

const SITE_URL = "https://cafedebangkok-kochi.example.com"; // ← set your real domain

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Café de Bangkok · Kochi — Authentic Thai Restaurant",
    template: "%s · Café de Bangkok Kochi",
  },
  description:
    "Bangkok after dark, served in Kochi. Thai SELECT certified Thai, Chinese & Japanese dining on MP Pylee Road, Kadavanthra — hand-folded dim sum, Tom Yum, crab lollipop, wok-fired mains, sushi and mango sticky rice. Open daily 11:30 AM–11 PM. Rated 4.5 across 2,900+ reviews.",
  keywords: [
    "Café de Bangkok Kochi",
    "Thai restaurant Kochi",
    "Thai SELECT Kerala",
    "best Thai food Kerala",
    "Kadavanthra restaurants",
    "dim sum Kochi",
    "Tom Yum Kochi",
    "Japanese food Kochi",
    "sushi Kochi",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Café de Bangkok Kochi",
    title: "Café de Bangkok · Kochi — Bangkok After Dark",
    description:
      "Thai SELECT certified Thai, Chinese & Japanese dining in Kadavanthra, Kochi. Open daily 11:30 AM–11 PM.",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Café de Bangkok · Kochi",
    description: "Bangkok after dark, served in Kochi.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#060505",
  width: "device-width",
  initialScale: 1,
};

/* Schema.org Restaurant — rich results for search engines */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Café de Bangkok",
  url: SITE_URL,
  telephone: "+918075092609",
  servesCuisine: ["Thai", "Chinese", "Japanese", "Seafood"],
  priceRange: "₹₹",
  award: "Thai SELECT — certified authentic Thai cuisine",
  address: {
    "@type": "PostalAddress",
    streetAddress: "54/1285, MP Pylee Road, Kadavanthra",
    addressLocality: "Kochi",
    addressRegion: "Kerala",
    postalCode: "682020",
    addressCountry: "IN",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
    ],
    opens: "11:30",
    closes: "23:00",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.5",
    bestRating: "5",
    reviewCount: "2900",
  },
  sameAs: ["https://www.instagram.com/cafedebangkok.kochi/"],
  acceptsReservations: "True",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${nmDisp.variable} ${nmSerif.variable} ${nmMono.variable} ${nmThai.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}