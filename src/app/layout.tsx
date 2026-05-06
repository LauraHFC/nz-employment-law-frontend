import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "NZ Law Compass",
  description:
    "Free knowledge tool for NZ employment law, tax rules, and labour market data. Information from official government sources — IRD, Stats NZ, and legislation.govt.nz. General information only, not legal or tax advice.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
