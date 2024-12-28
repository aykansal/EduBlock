"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export function LearningPreferences() {
  const [sessionDuration, setSessionDuration] = useState(40)
  const [breakDuration, setBreakDuration] = useState(5)
  const [sessionsPerDay, setSessionsPerDay] = useState(4)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Learning Preferences</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sessionDuration">Session Duration (minutes)</Label>
          <div className="flex items-center space-x-4">
            <Slider
              id="sessionDuration"
              min={10}
              max={120}
              step={5}
              value={[sessionDuration]}
              onValueChange={(value) => setSessionDuration(value[0])}
              className="flex-grow"
            />
            <Input
              type="number"
              value={sessionDuration}
              onChange={(e) => setSessionDuration(Number(e.target.value))}
              className="w-20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
          <div className="flex items-center space-x-4">
            <Slider
              id="breakDuration"
              min={1}
              max={30}
              step={1}
              value={[breakDuration]}
              onValueChange={(value) => setBreakDuration(value[0])}
              className="flex-grow"
            />
            <Input
              type="number"
              value={breakDuration}
              onChange={(e) => setBreakDuration(Number(e.target.value))}
              className="w-20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sessionsPerDay">Sessions Per Day</Label>
          <div className="flex items-center space-x-4">
            <Slider
              id="sessionsPerDay"
              min={1}
              max={10}
              step={1}
              value={[sessionsPerDay]}
              onValueChange={(value) => setSessionsPerDay(value[0])}
              className="flex-grow"
            />
            <Input
              type="number"
              value={sessionsPerDay}
              onChange={(e) => setSessionsPerDay(Number(e.target.value))}
              className="w-20"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

