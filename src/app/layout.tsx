import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pokemon Card Designer - Create Custom Cards with AI",
  description: "Design your own custom Pokemon cards using AI. Create unique cards with custom abilities, attacks, and artwork descriptions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
