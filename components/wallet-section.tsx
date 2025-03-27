"use client";
import { useEffect, useState, memo } from "react";

import { createWallet } from "thirdweb/wallets";
import { createThirdwebClient, defineChain } from "thirdweb";
import { ConnectButton, useActiveAccount, useActiveWallet, useDisconnect } from "thirdweb/react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { showErrorToast, showSuccessToast } from "@/lib/api-utils";
import { apiCache } from "@/lib/cache-utils";

interface WalletSectionProps {
  showText?: boolean;
}

export function WalletSection({ showText = false }: WalletSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const account = useActiveAccount();
  const { disconnect } = useDisconnect();
  const wallet = useActiveWallet();
  
  const chain = defineChain(656476);
  const client = createThirdwebClient({
    clientId:
      process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID ||
      "196a471aa5076370ba5f7b345402a37e",
  });

  useEffect(() => {
    if (account) {
      setIsLoading(true);
      handleOnConnect(account.address);
      setIsLoading(false);
    }
  }, [account]);

  const handleOnConnect = async (walletAddress: string | undefined) => {
    if (!walletAddress) {
      setError("Failed to get wallet address");
      showErrorToast(new Error("Failed to get wallet address"));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register user");
      }

      showSuccessToast("Wallet connected successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to connect wallet";
      setError(errorMessage);
      showErrorToast(new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    if (disconnect && wallet) {
      apiCache.clear();
      disconnect(wallet);
      showSuccessToast("Wallet disconnected");
    }
  };

  if (account) {
    return (
      <div className="px-2 py-3">
        {showText && <div className="mb-2 text-sm font-medium">Connected Wallet</div>}
        <div className="flex items-center justify-between">
          <div className="text-sm truncate max-w-[120px]" title={account.address}>
            {account.address.substring(0, 6)}...{account.address.substring(account.address.length - 4)}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDisconnect}
            className="ml-2"
          >
            Disconnect
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 py-3">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="w-full">
        <ConnectButton
          client={client}
          chain={chain}
          wallets={[createWallet("io.metamask")]}
        />
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(WalletSection);
