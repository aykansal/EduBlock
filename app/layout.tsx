import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { ThirdWebClientProvider } from "@/components/ThirdWebClientProvider";
import AuthProvider from "@/components/AuthProvider";
import { ToastProvider } from "@/components/providers/toast-provider";
import ClientLayoutHandler from "@/components/ClientLayoutHandler";

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
            <AuthProvider>
              <ClientLayoutHandler>
                {children}
              </ClientLayoutHandler>
            </AuthProvider>
          </ToastProvider>
        </ThirdWebClientProvider>
      </body>
    </html>
  );
}
