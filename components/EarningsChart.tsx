'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Mon', tokens: 20 },
  { name: 'Tue', tokens: 40 },
  { name: 'Wed', tokens: 30 },
  { name: 'Thu', tokens: 50 },
  { name: 'Fri', tokens: 40 },
  { name: 'Sat', tokens: 60 },
  { name: 'Sun', tokens: 40 },
]

export default function EarningsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Earnings</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="tokens" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

