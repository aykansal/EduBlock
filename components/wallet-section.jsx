import { Button } from "@/components/ui/button";
import { ConnectButton } from "thirdweb/react";
import { createThirdwebClient, defineChain } from "thirdweb";

export function WalletSection() {
  const chain = defineChain(656476);
  const client = createThirdwebClient({
    clientId: "196a471aa5076370ba5f7b345402a37e",
  });

  return (
    <div className="flex justify-center items-center">
      <ConnectButton chain={chain} client={client} />
    </div>
  );
}
