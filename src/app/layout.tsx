import type { Metadata } from "next";
import { ScrollProgressBar } from "@/components/motion-primitives";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { company } from "@/lib/site-data";
import "./globals.css";

export const metadata: Metadata = {
  title: `${company.name} - Solar Installation in Sangli`,
  description: company.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ScrollProgressBar />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
