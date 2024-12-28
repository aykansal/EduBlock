import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins } from 'lucide-react'

export default function DailyEarnings() {
  // This would typically come from an API or database
  const todaysEarnings = 40

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Today's Earnings
        </CardTitle>
        <Coins className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{todaysEarnings}</div>
        <p className="text-xs text-muted-foreground">
          Great job on your learning sessions!
        </p>
      </CardContent>
    </Card>
  )
}

