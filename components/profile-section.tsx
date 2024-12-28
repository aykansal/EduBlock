import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ProfileSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Profile Information</h2>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" placeholder="Your username" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Your name" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Your email" />
        </div>
      </div>
    </div>
  )
}

