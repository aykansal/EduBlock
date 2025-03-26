"use client"

import { Bell, Settings } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { usePathname } from "next/navigation"

export function Header() {
  const pathname = usePathname()
  const showProgress = pathname.startsWith("/courses")

  return (
    <header className="bg-background border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="font-semibold text-xl">EduBlock</h2>
        <div className="flex items-center space-x-4">
          {showProgress && (
            <div className="flex items-center space-x-2">
              <Progress value={33} className="w-40" />
              <span className="text-sm text-muted-foreground">Daily Streak</span>
              {/* <span className="text-sm text-muted-foreground">33% complete</span> */}
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
              <DropdownMenuLabel><a href="">My Account</a></DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem><a href="">Settings</a></DropdownMenuItem>
              <DropdownMenuItem>Help</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

