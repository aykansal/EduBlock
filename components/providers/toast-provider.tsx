"use client";

import { Toaster } from "sonner";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        expand={true}
        richColors
        closeButton
        theme="light"
        className="font-sans"
      />
    </>
  );
} 