import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const SITE_URL = "https://nzlaw.linkiwise.com";
const SITE_NAME = "NZ Law Compass";
const SITE_DESCRIPTION =
  "Free AI guide to NZ employment law, tax law, and labour market statistics. Cites every answer from official government sources — IRD, Stats NZ, and legislation.govt.nz. Refuses cleanly when it shouldn't answer. General information only, not legal or tax advice.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "NZ employment law",
    "NZ tax law",
    "New Zealand labour market",
    "employment law chatbot",
    "IRD",
    "legislation.govt.nz",
    "Stats NZ",
    "PAYE",
    "GST",
    "KiwiSaver",
  ],
  authors: [{ name: "Laura Cai" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    locale: "en_NZ",
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
