import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "SpaceBase", template: "%s · SpaceBase" },
  description: "Find and book the perfect space for your next event.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
