import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy } from 'lucide-react'

export default function RewardsDisplay() {
  // This would typically come from an API or database
  const totalTokens = 1250

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Total EduChain Tokens
        </CardTitle>
        <Trophy className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalTokens}</div>
        <p className="text-xs text-muted-foreground">
          Keep learning to earn more!
        </p>
      </CardContent>
    </Card>
  )
}

