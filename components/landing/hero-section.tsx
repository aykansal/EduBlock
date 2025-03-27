"use client";

import { WalletSection } from "../wallet-section";

export function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center px-4 py-16">
      <h1 className="mb-6 text-4xl font-bold tracking-tight text-center">
        Welcome to <span className="text-blue-600">EduBlock</span>
      </h1>
      <p className="mb-8 text-center text-gray-600 max-w-md">
        Connect your wallet to access blockchain learning resources and start earning rewards.
      </p>
      <div className="w-full max-w-sm">
        <WalletSection />
      </div>
    </section>
  );
}
