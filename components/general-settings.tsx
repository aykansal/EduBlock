import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function GeneralSettings() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">General Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications">Enable Notifications</Label>
          <Switch id="notifications" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="darkMode">Dark Mode</Label>
          <Switch id="darkMode" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="soundEffects">Sound Effects</Label>
          <Switch id="soundEffects" />
        </div>
      </div>
    </div>
  )
}

