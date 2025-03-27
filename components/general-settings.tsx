"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface GeneralSettingsProps {
  settings: {
    notifications?: boolean;
    darkMode?: boolean;
    soundEffects?: boolean;
  };
  updateSettings: (settings: {
    notifications?: boolean;
    darkMode?: boolean;
    soundEffects?: boolean;
  }) => void;
}

export function GeneralSettings({ settings, updateSettings }: GeneralSettingsProps) {
  const [notifications, setNotifications] = useState(settings?.notifications ?? true);
  const [darkMode, setDarkMode] = useState(settings?.darkMode ?? false);
  const [soundEffects, setSoundEffects] = useState(settings?.soundEffects ?? true);

  // Update component state when props change
  useEffect(() => {
    setNotifications(settings?.notifications ?? true);
    setDarkMode(settings?.darkMode ?? false);
    setSoundEffects(settings?.soundEffects ?? true);
  }, [settings]);

  // Update settings when toggles change
  const handleNotificationsChange = (checked: boolean) => {
    setNotifications(checked);
    updateSettings({
      ...settings,
      notifications: checked
    });
  };

  const handleDarkModeChange = (checked: boolean) => {
    setDarkMode(checked);
    updateSettings({
      ...settings,
      darkMode: checked
    });
  };

  const handleSoundEffectsChange = (checked: boolean) => {
    setSoundEffects(checked);
    updateSettings({
      ...settings,
      soundEffects: checked
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">General Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications">Enable Notifications</Label>
          <Switch 
            id="notifications" 
            checked={notifications}
            onCheckedChange={handleNotificationsChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="darkMode">Dark Mode</Label>
          <Switch 
            id="darkMode" 
            checked={darkMode}
            onCheckedChange={handleDarkModeChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="soundEffects">Sound Effects</Label>
          <Switch 
            id="soundEffects" 
            checked={soundEffects}
            onCheckedChange={handleSoundEffectsChange}
          />
        </div>
      </div>
    </div>
  )
}
