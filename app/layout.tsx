import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next.js App Starter | Your Custom Title",
  description: "A modern Next.js starter template for building high-performance web applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // ⭐️ UPDATED: Setting the theme to follow the system preference
    // The 'dark' class will be applied if the user's system preference is dark.
    <html lang="en" suppressHydrationWarning className="dark:bg-gray-900">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        // Ensure the entire body height is covered
      >
        {children}
      </body>
    </html>
  );
}