import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "facebook",
  description:
    "A 2008 Facebook-style wall. Share a message and see it appear in the feed.",
  openGraph: {
    title: "facebook",
    description: "A 2008 Facebook-style wall.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-fb-bg text-fb-text antialiased">
        {children}
      </body>
    </html>
  );
}
