import { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { ThirdWebClientProvider } from "@/components/ThirdWebClientProvider";
import AuthProvider from "@/components/AuthProvider";
import { ToastProvider } from "@/components/providers/toast-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EduBlock",
  description: "Blockchain learning platform",
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
          <AuthProvider>
            <ToastProvider>
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 overflow-y-auto p-6">{children}</main>
                </div>
              </div>
            </ToastProvider>
          </AuthProvider>
        </ThirdWebClientProvider>
      </body>
    </html>
  );
}
