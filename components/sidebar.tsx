"use client";

import {
  BarChart,
  BookOpen,
  Home,
  Layout,
  Settings,
  PlusCircle,
  LucideLoader,
  CalendarClock,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import { cn } from "@/lib/utils";
import { WalletSection } from "./wallet-section";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const account = useActiveAccount();
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentRoute, setCurrentRoute] = useState("");

  const links = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/courses", label: "Courses", icon: BookOpen },
    { href: "/progress", label: "Progress", icon: BarChart },
    { href: "/schedule", label: "Schedule", icon: CalendarClock },
    { href: "/leaderboard", label: "Leaderboard", icon: LucideLoader },
    { href: "/rewards", label: "Rewards", icon: Layout },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  // Reset navigation state when route changes
  useEffect(() => {
    setIsNavigating(false);
    setCurrentRoute(pathname);
  }, [pathname]);

  // Optimized navigation handler
  const handleNavigation = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Skip optimization for currently active route
    if (pathname === href) {
      return;
    }

    e.preventDefault();
    setIsNavigating(true);
    setCurrentRoute(href);
    
    // Use setTimeout to give time for loading indicator to appear
    // before starting navigation which could block the main thread
    setTimeout(() => {
      router.push(href);
    }, 10);
  }, [pathname, router]);

  return (
    <div className="flex flex-col bg-muted/50 border-r border-border w-64">
      <div className="flex justify-center items-center border-b border-border h-16">
        <span className="font-bold text-primary uppercase">EduBlock</span>
      </div>
      <nav className="flex-grow">
        <ul className="flex flex-col py-4">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={(e) => handleNavigation(e, link.href)}
                className={cn(
                  "flex items-center px-6 py-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors",
                  pathname === link.href && "bg-muted text-primary"
                )}
                prefetch={true}
              >
                <link.icon className="mr-3 w-5 h-5" />
                {link.label}
                {isNavigating && currentRoute === link.href && (
                  <span className="ml-auto">
                    <LucideLoader className="h-3 w-3 animate-spin" />
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-auto px-4 py-4">
          <WalletSection />
        </div>
      </nav>
    </div>
  );
}
