
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Commission } from "@/hooks/useCommissions";

interface CommissionStatsCardsProps {
  commissions: Commission[];
}

const CommissionStatsCards = ({ commissions }: CommissionStatsCardsProps) => {
  // Calculate totals for stats
  const totals = {
    paid: commissions
      .filter(c => c.status === "paid")
      .reduce((sum, c) => sum + parseFloat(c.amount.replace("₹", "")), 0),
    pending: commissions
      .filter(c => c.status === "pending")
      .reduce((sum, c) => sum + parseFloat(c.amount.replace("₹", "")), 0),
    rejected: commissions
      .filter(c => c.status === "rejected")
      .reduce((sum, c) => sum + parseFloat(c.amount.replace("₹", "")), 0)
  };

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
          <div className="h-4 w-4 rounded-full bg-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{totals.paid.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
          <div className="h-4 w-4 rounded-full bg-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{totals.pending.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rejected Amount</CardTitle>
          <div className="h-4 w-4 rounded-full bg-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{totals.rejected.toFixed(2)}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommissionStatsCards;
