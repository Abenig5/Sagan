import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sagan Beauty — Hair & Beauty Studio",
  description: "Hair and beauty studio in Switzerland. Book cuts, colour, styling, make-up and brow care online.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
