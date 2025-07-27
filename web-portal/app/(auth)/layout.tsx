import { ThemeProvider } from '@/components/providers/theme-provider';
import '../globals.css';
import { ModeToggle } from '@/components/layout/theme-toggler';
import { Metadata } from 'next';
import { Toaster } from 'sonner';



export const metadata: Metadata = {
  title: 'CereSafe: Auth',
  description:
    'CereSafe is an intelligent, AI-powered platform designed to predict and monitor the risk of stroke before it happens.',
};

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-theme-image min-h-screen flex flex-col items-center justify-center relative gap-2 md:gap-5">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <div className="absolute top-5 left-0">
            <ModeToggle />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}