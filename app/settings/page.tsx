import { Metadata } from "next"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProfileSection } from "@/components/profile-section"
import { LearningPreferences } from "@/components/learning-preferences"
import { WalletSection } from "@/components/wallet-section"
import { GeneralSettings } from "@/components/general-settings"
// import { ProfileSection } from "./profile-section"
// import { WalletSection } from "./wallet-section"
// import { GeneralSettings } from "./general-settings"
// import { LearningPreferences } from "./learning-preferences"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings and learning preferences.",
}

export default function SettingsPage() {
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
              src="https://i.pravatar.cc/150?img=12"
              alt="Profile Picture"
              width={80}
              height={80}
              className="rounded-full border-4 border-primary"
            />
          </div>
          
          <div className="space-y-8">
            <ProfileSection />
            <LearningPreferences />
            <GeneralSettings />
          </div>
          
          <div className="mt-8 flex justify-between">
            {/* <Button variant="destructive">Log Out</Button> */}
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

