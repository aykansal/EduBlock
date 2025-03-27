"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface LearningPreferencesProps {
  preferences: {
    sessionDuration?: number;
    breakDuration?: number;
    sessionsPerDay?: number;
  };
  updatePreferences: (prefs: {
    sessionDuration?: number;
    breakDuration?: number;
    sessionsPerDay?: number;
  }) => void;
}

export function LearningPreferences({ preferences, updatePreferences }: LearningPreferencesProps) {
  const [sessionDuration, setSessionDuration] = useState(preferences.sessionDuration || 40)
  const [breakDuration, setBreakDuration] = useState(preferences.breakDuration || 5)
  const [sessionsPerDay, setSessionsPerDay] = useState(preferences.sessionsPerDay || 4)

  // Update component state when props change
  useEffect(() => {
    setSessionDuration(preferences.sessionDuration || 40);
    setBreakDuration(preferences.breakDuration || 5);
    setSessionsPerDay(preferences.sessionsPerDay || 4);
  }, [preferences]);
  
  // Update parent state when local state changes
  const handleSessionDurationChange = (value: number) => {
    setSessionDuration(value);
    updatePreferences({
      ...preferences,
      sessionDuration: value
    });
  };

  const handleBreakDurationChange = (value: number) => {
    setBreakDuration(value);
    updatePreferences({
      ...preferences,
      breakDuration: value
    });
  };

  const handleSessionsPerDayChange = (value: number) => {
    setSessionsPerDay(value);
    updatePreferences({
      ...preferences,
      sessionsPerDay: value
    });
  };

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
              onValueChange={(value) => handleSessionDurationChange(value[0])}
              className="flex-grow"
            />
            <Input
              type="number"
              value={sessionDuration}
              onChange={(e) => handleSessionDurationChange(Number(e.target.value))}
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
              onValueChange={(value) => handleBreakDurationChange(value[0])}
              className="flex-grow"
            />
            <Input
              type="number"
              value={breakDuration}
              onChange={(e) => handleBreakDurationChange(Number(e.target.value))}
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
              onValueChange={(value) => handleSessionsPerDayChange(value[0])}
              className="flex-grow"
            />
            <Input
              type="number"
              value={sessionsPerDay}
              onChange={(e) => handleSessionsPerDayChange(Number(e.target.value))}
              className="w-20"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
