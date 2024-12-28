import DailyEarnings from "@/components/DailyEarnings";
import EarningsChart from "@/components/EarningsChart";
import RewardsDisplay from "@/components/RewardsDisplay";
import RupeeValue from "@/components/RupeeValue";

export default function RewardsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your EduChain Rewards</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <RewardsDisplay />
        <DailyEarnings />
        <RupeeValue />

      </div>
      <div className="mt-12">
        <EarningsChart />
      </div>
    </div>
  )
}

