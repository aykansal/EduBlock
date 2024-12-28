import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IndianRupee } from 'lucide-react'

export default function RupeeValue() {
  // This would typically come from an API or database
  const totalTokens = 1250
  const exchangeRate = 10 // Assuming 1 EduChain token = 10 rupees

  const rupeeValue = totalTokens * exchangeRate

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Value in Rupees
        </CardTitle>
        <IndianRupee className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">₹{rupeeValue.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">
          Based on current exchange rate
        </p>
      </CardContent>
    </Card>
  )
}

