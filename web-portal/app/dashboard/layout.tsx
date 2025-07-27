import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ModeToggle } from "@/components/layout/theme-toggler";
import SideNav from "@/components/layout/side-nav";
import DashboardHeader from "@/components/layout/dashboard-header";
import { Toaster } from "sonner";
import { Suspense } from "react";
import { Loader } from "@/components/layout/loader";
import { AuthProvider } from "@/components/providers/auth-provider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CereSafe: Dashboard",
  description:
    "CereSafe is an intelligent, AI-powered platform designed to predict and monitor the risk of stroke before it happens.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased from-overlay-2/30 to-bg-background/60 bg-linear-to-br flex justify-start gap-1 overflow-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<Loader />}>
            <AuthProvider>
              <SideNav />
              <main className="w-full h-screen flex flex-col justify-start gap-2 overflow-y-auto pb-20">
                <DashboardHeader />
                {children}
              </main>
              <Toaster />
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
