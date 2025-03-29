"use client";

import { Bell, Settings, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { usePathname } from "next/navigation";
import { useActiveAccount } from "thirdweb/react";
import { useDataFetching } from "@/hooks/use-data-fetching";
import Link from "next/link";
import { getStreak } from "@/lib/streak-utils";

// Define which paths should show the streak
const STREAK_PATHS = [
  "/dashboard",
  "/courses",
  "/progress",
  "/schedule",
  "/leaderboard",
  "/rewards",
];

export function Header() {
  const pathname = usePathname();
  const account = useActiveAccount();
  const showStreak = STREAK_PATHS.some((path) => pathname.startsWith(path));

  const { data: streakData, isLoading } = useDataFetching(getStreak, {
    skipIfNoWallet: true,
    defaultValue: { currentStreak: 0, bestStreak: 0 },
  });

  return (
    <header className="bg-background border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="font-semibold text-xl">EduBlock</h2>
        <div className="flex items-center space-x-4">
          {showStreak && !isLoading && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Progress value={streakData.currentStreak} className="w-40" />
                <div className="flex items-center text-sm">
                  <Flame className="h-4 w-4 text-orange-500 mr-1" />
                  <span className="font-medium">
                    {streakData.currentStreak}
                  </span>
                  <span className="text-muted-foreground ml-1">day streak</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Best: {streakData.bestStreak}
              </div>
            </div>
          )}
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <Link href="/profile">My Account</Link>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/profile" className="w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings" className="w-full">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/help" className="w-full">
                  Help
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
