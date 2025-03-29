"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useActiveAccount } from "thirdweb/react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

/**
 * LayoutProvider
 *
 * A unified component that handles both authentication and layout rendering.
 * This combines the functionality of the previous AuthProvider and ClientLayoutHandler.
 */
export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const account = useActiveAccount();
  const isLoginPage = pathname === "/";

  useEffect(() => {
    // Handle navigation based on authentication state
    if (isLoginPage && account) {
      router.push("/dashboard");
    } else if (!account && !isLoginPage) {
      router.push("/");
    }
  }, [isLoginPage, account, router]);

  // Show nothing while redirecting
  if ((isLoginPage && account) || (!account && !isLoginPage)) {
    return null;
  }

  // If we're on the login page and user is not connected, render landing page
  if (isLoginPage && !account) {
    return <>{children}</>;
  }

  // User is connected and not on login page - render dashboard layout
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
