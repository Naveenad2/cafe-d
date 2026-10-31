import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Dev only: Next blocks dev assets for any origin other than localhost,
     so a phone or tablet opening http://192.168.x.x:3000 got the HTML but
     none of the JS — and sat on the splash screen at 000% forever. These
     patterns let devices on the local network load the dev server. */
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "*.local"],
};

export default nextConfig;
