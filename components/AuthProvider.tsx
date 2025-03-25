"use client";
import React from "react";
import { useActiveAccount } from "thirdweb/react";
import { WalletSection } from "./wallet-section";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const account = useActiveAccount();
  if (account) {
    return <>{children}</>;
  } else {
    return (
      <div className="flex justify-center items-center h-screen">
        <WalletSection />
        Please Connect Wallet to Access Content
      </div>
    );
  }
};

export default AuthProvider;
