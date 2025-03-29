"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileSectionProps {
  userData: {
    username?: string;
    email?: string;
  };
  updateUserData: (field: string, value: any) => void;
}

export function ProfileSection({ userData, updateUserData }: ProfileSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Profile Information</h2>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input 
            id="username" 
            placeholder="Your username" 
            value={userData?.username || ""}
            onChange={(e) => updateUserData('username', e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="Your email"
            value={userData?.email || ""} 
            onChange={(e) => updateUserData('email', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
