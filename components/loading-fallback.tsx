"use client";

import { Loader2 } from "lucide-react";

export function LoadingFallback() {
  return (
    <div className="flex justify-center items-center w-full h-[70vh]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
