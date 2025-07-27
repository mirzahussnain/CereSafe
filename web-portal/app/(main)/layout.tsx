import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ModeToggle } from "@/components/layout/theme-toggler";
import Footer from "@/components/layout/footer";
import { Toaster } from "sonner";
import { Suspense } from "react";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Loader } from "@/components/layout/loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CereSafe",
  description:
    "CereSafe is an intelligent, AI-powered platform designed to predict and monitor the risk of stroke before it happens. By analyzing key health metrics, medical history, and lifestyle factors, CereSafe empowers users and healthcare providers with early warnings, personalized insights, and preventative strategies — all aimed at safeguarding brain health.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased from-overlay-2/30 to-bg-background/60 bg-linear-to-br overflow-x-hidden overflow-y-auto `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<Loader/>}>
            <AuthProvider>
              <Navbar />
              {children}
              <Toaster />
              <Footer />
            </AuthProvider>
          </Suspense>
          <div className="fixed bottom-5 right-5 bg-primary/40 rounded-sm hover:bg-primary/30 hover:cursor-pointer z-20">
            <ModeToggle />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
