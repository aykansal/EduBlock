"use client";

import { ThirdwebProvider } from "thirdweb/react";

export const ThirdWebClientProvider=({children}:{
    children:React.ReactNode
})=>{
return <ThirdwebProvider>{children}</ThirdwebProvider>
}