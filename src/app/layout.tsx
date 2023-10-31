import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Buy NFTs via stripe checkout | thirdweb Engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
