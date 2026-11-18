import type { Metadata } from "next";
import SiteFooter from "./site-footer";
import SiteHeader from "./site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lulu Kaya",
  description: "Lulu Kaya website rebuild",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}