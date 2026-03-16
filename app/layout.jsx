import { Manrope } from "next/font/google";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata = {
  title: "Tradein Agent",
  description: "Collect and manage premium second-hand tech trade-in requests."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={manrope.variable}>{children}</body>
    </html>
  );
}
