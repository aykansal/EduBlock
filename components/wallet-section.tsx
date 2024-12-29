import { Button } from "@/components/ui/button";
import { ConnectButton } from "thirdweb/react";
import { createThirdwebClient, defineChain } from "thirdweb";

export function WalletSection() {
  const chain = defineChain(656476);
  const client = createThirdwebClient({
    clientId: "196a471aa5076370ba5f7b345402a37e",
  });

  return (
    // <Button
    //   className=" mx-4 px-14" // Add padding on left and right
    //   variant="default"
    // >
    //   <span className="relative z-10">Connect Wallet</span> 
    // </Button>
    <div className="flex items-center justify-center">

      <ConnectButton chain={chain} client={client} />
    </div>
  );
}
