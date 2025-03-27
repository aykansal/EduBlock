import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdWebClientProvider } from "@/components/ThirdWebClientProvider";
import { ToastProvider } from "@/components/providers/toast-provider";
import LayoutProvider from "@/components/LayoutProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "EduBlock - Blockchain Learning Platform",
  description: "Learn blockchain and earn tokens",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThirdWebClientProvider>
          <ToastProvider>
            <LayoutProvider>{children}</LayoutProvider>
          </ToastProvider>
        </ThirdWebClientProvider>
      </body>
    </html>
  );
}
