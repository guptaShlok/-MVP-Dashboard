import React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";


export const metadata: Metadata = {
  title: "MVP Dashboard",
  description:
    "Core layout for the MVP Dashboard used to create, track, and review optimization requests.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
