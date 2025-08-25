import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Amine's Code Chronicles | Welcome",
  description:
    "Here you'll find a variety of articles and tutorials on topics such as web development, software engineering, and programming languages.",
  icons: {
    icon: [
      { url: "/AppLogo-dark.svg", type: "image/svg+xml" },
      { url: "/AppLogo-white.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased container mx-auto px-10 `}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
