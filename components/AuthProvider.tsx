"use client";
import React from "react";
import { useActiveAccount, useDisconnect } from "thirdweb/react";
import { WalletSection } from "./wallet-section";
import { Loader2 } from "lucide-react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const account = useActiveAccount();

  if (!account) {
    return (
      <div className="flex flex-col gap-6 justify-center items-center h-screen">
        <div className="text-2xl font-bold text-primary">EduBlock</div>
        <div className="p-6 bg-card border rounded-lg shadow-sm max-w-md w-full">
          <h2 className="text-xl font-semibold mb-4 text-center">Connect Your Wallet</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Please connect your wallet to access the learning platform
          </p>
          <WalletSection showText={true} />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
