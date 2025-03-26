"use client";
import { useEffect, useState } from "react";

import { createWallet } from "thirdweb/wallets";
import { createThirdwebClient, defineChain } from "thirdweb";
import { ConnectButton, useActiveAccount } from "thirdweb/react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { showErrorToast, showSuccessToast } from "@/lib/api-utils";

export function WalletSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chain = defineChain(656476);
  const client = createThirdwebClient({
    clientId:
      process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID ||
      "196a471aa5076370ba5f7b345402a37e",
  });

  const account = useActiveAccount();
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
        throw new Error(data.error || "Failed to process user");
      }

      showSuccessToast(
        "Wallet connected successfully",
        "Your account is now ready"
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to connect wallet"
      );
      showErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 p-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <div className="text-gray-500 text-sm animate-pulse">
          Setting up your account...
        </div>
      )}

      <ConnectButton
        autoConnect={true}
        wallets={[createWallet("io.metamask")]}
        onConnect={(wallet) => handleOnConnect(wallet.getAccount()?.address)}
        chain={chain}
        client={client}
      />
    </div>
  );
}

export default WalletSection;
