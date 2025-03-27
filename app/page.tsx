"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { HeroSection } from "@/components/landing/hero-section";
import { useActiveAccount } from "thirdweb/react";

export default function HomePage() {
  const account = useActiveAccount();
  const router = useRouter();

  // If user is already connected, redirect to dashboard
  useEffect(() => {
    if (account) {
      router.push("/dashboard");
    }
  }, [account, router]);

  // Only render landing page if user is not connected
  if (account) {
    return null; // Will redirect in the useEffect
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background">
      <HeroSection />
    </main>
  );
}
