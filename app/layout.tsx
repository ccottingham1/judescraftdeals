import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jude’s Craft Deals | Yarn & Bead Savings",
  description: "Handpicked crochet, yarn, and bead deals online and near Edmond, Oklahoma.",
  applicationName: "Jude’s Craft Deals",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/app-icon-512.png", type: "image/png", sizes: "512x512" }],
    shortcut: "/app-icon-512.png",
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    title: "Jude’s Craft Deals",
    statusBarStyle: "black-translucent",
  },
  metadataBase: new URL("https://judes-craft-deals.connorcottingham10.chatgpt.site"),
  openGraph: {
    title: "Jude’s Craft Deals",
    description: "Yarn, beads & better prices near Edmond and online.",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Jude’s Craft Deals" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jude’s Craft Deals",
    description: "Yarn, beads & better prices near Edmond and online.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
