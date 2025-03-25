"use client";

import {
  BarChart,
  BookOpen,
  Home,
  Layout,
  Settings,
  PlusCircle,
  LucideLoader,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { WalletSection } from "./wallet-section";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/courses", label: "Courses", icon: BookOpen },
    { href: "/progress", label: "Progress", icon: BarChart },
    { href: "/leaderboard", label: "Leaderboard", icon: LucideLoader },
    { href: "/rewards", label: "Rewards", icon: Layout },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

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
                className={cn(
                  "flex items-center px-6 py-2 text-muted-foreground hover:bg-muted hover:text-primary",
                  pathname === link.href && "bg-muted text-primary"
                )}
              >
                <link.icon className="mr-3 w-5 h-5" />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <WalletSection />
      </nav>
    </div>
  );
}
