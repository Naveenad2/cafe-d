"use client";

import { useReveal } from "@/lib/hooks";
import { Cursor, Loader, Progress, Rail } from "@/components/Chrome";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import Signatures from "@/components/Signatures";
import Gallery from "@/components/Gallery";
import Chef from "@/components/Chef";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import Visit from "@/components/Visit";
import Footer from "@/components/Footer";

export default function Page() {
  useReveal();

  return (
    <>
      {/* ambient layers */}
      <div className="lightfield" aria-hidden />
      <div className="gridlines" aria-hidden />

      {/* chrome */}
      <Loader />
      <Cursor />
      <Progress />
      <Rail />
      <Navbar />

      <main>
        <Hero />
        <Manifesto />
        <Signatures />
        <Gallery />
        <Chef />
        <Reviews />
        <Faq />
        <Visit />
      </main>

      <Footer />
    </>
  );
}