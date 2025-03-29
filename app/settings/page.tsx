"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileSection } from "@/components/profile-section";
import { LearningPreferences } from "@/components/learning-preferences";
import { GeneralSettings } from "@/components/general-settings";
import { Loader2 } from "lucide-react";
import { getUserSettings, updateUserSettings, DEFAULT_WALLET_ID } from "@/lib/api";
import { toast } from "sonner";

// Define the shape of our user data
interface UserData {
  walletId?: string;
  username?: string;
  email?: string;
  avatar?: string;
  preferences?: {
    sessionDuration?: number;
    breakDuration?: number;
    sessionsPerDay?: number;
    notifications?: boolean;
    darkMode?: boolean;
    soundEffects?: boolean;
  };
}

export default function SettingsPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const user = await getUserSettings(DEFAULT_WALLET_ID);
        setUserData(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user settings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      await updateUserSettings(userData, DEFAULT_WALLET_ID);
      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const updateUserData = (field: string, value: any) => {
    setUserData((prev: UserData | null) => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <p className="text-lg text-gray-600">Loading your settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-8">
            <Image
              src="https://api.dicebear.com/6.x/bottts/svg?seed=Buddy&eyes=bulging&mouth=smile01&backgroundColor=ffadad"
              alt="Coder Dog Avatar"
              width={80}
              height={80}
              className="rounded-full border-4 border-primary"
            />
            <h1 className="text-3xl font-bold">Settings</h1>
            <Image
              src={userData?.avatar || "https://api.dicebear.com/6.x/bottts/svg?seed=Buddy"}
              alt="Profile Picture"
              width={80}
              height={80}
              className="rounded-full border-4 border-primary"
            />
          </div>
          
          <div className="space-y-8">
            <ProfileSection 
              userData={userData || {}}
              updateUserData={updateUserData}
            />
            <LearningPreferences 
              preferences={userData?.preferences || {}}
              updatePreferences={(prefs) => updateUserData('preferences', prefs)}
            />
            <GeneralSettings 
              settings={userData?.preferences || {}}
              updateSettings={(settings) => updateUserData('preferences', settings)}
            />
          </div>
          
          <div className="mt-8 flex justify-end">
            <Button onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
