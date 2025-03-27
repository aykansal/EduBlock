"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { DEFAULT_WALLET_ID } from "@/lib/api";

interface AuthContextType {
  isAuthenticated: boolean;
  walletId: string;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  walletId: "",
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ 
  children 
}: { 
  children: React.ReactNode 
}) => {
  const [loading, setLoading] = useState(true);
  const [walletId, setWalletId] = useState<string>("");
  const account = useActiveAccount();

  useEffect(() => {
    // Check local storage first for persisted auth
    const savedWalletId = localStorage.getItem("edublock_wallet_id");
    
    if (account) {
      // User is logged in with thirdweb
      const currentWalletId = account.address;
      setWalletId(currentWalletId);
      localStorage.setItem("edublock_wallet_id", currentWalletId);
    } else if (savedWalletId) {
      // Use previously stored wallet ID for persistence
      setWalletId(savedWalletId);
    } else {
      // Use default wallet ID for development/demo purposes
      // In production, this should be removed
      setWalletId(DEFAULT_WALLET_ID);
      localStorage.setItem("edublock_wallet_id", DEFAULT_WALLET_ID);
    }
    
    setLoading(false);
  }, [account]);

  const value = {
    isAuthenticated: !!walletId,
    walletId,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
