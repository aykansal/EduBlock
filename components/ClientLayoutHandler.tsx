"use client";

import { usePathname } from "next/navigation";
import { useActiveAccount } from "thirdweb/react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

/**
 * ClientLayoutHandler
 * 
 * Handles conditional rendering of the application layout based on authentication status
 * and current route. Server components remain server components, and only client-specific
 * logic like auth checks are done in this component.
 */
export default function ClientLayoutHandler({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const account = useActiveAccount();
  const isLoginPage = pathname === "/";

  // If we're on the login page and user is not connected, render children directly
  if (isLoginPage && !account) {
    return <>{children}</>;
  }

  // Otherwise render the dashboard layout with sidebar and header
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
