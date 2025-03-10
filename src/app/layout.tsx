import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/navbar";
import Nprogress from "@/components/nprogress";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "ImDoubt - Share and Discuss Your Doubts",
    template: "%s | ImDoubt",
  },
  description:
    "Join ImDoubt to share your doubts, get perspectives, and engage in meaningful discussions. A platform for collaborative learning and understanding.",
  keywords: [
    "doubts",
    "discussion",
    "learning",
    "perspectives",
    "knowledge sharing",
  ],
  authors: [{ name: "ImDoubt Team" }],
  creator: "ImDoubt",
  publisher: "ImDoubt",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://imdoubt-app.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://imdoubt-app.vercel.app/",
    title: "ImDoubt - Share and Discuss Your Doubts",
    description:
      "Join ImDoubt to share your doubts, get perspectives, and engage in meaningful discussions.",
    siteName: "ImDoubt",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ImDoubt - Share and Discuss Your Doubts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ImDoubt - Share and Discuss Your Doubts",
    description:
      "Join ImDoubt to share your doubts, get perspectives, and engage in meaningful discussions.",
    creator: "@imdoubt",
    images: ["/twitter-image.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: [{ url: "/apple-icon.png" }],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Nprogress />
            <Navbar />
            <main className="p-3 mt-[80px]">{children}</main>
          </ThemeProvider>
          <Script src="/service-worker.js" />
        </body>
      </html>
    </ClerkProvider>
  );
}
