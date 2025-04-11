
import { Card, CardContent } from "@/components/ui/card";
import { CircleDollarSign, BarChart3, Ticket, Wallet } from "lucide-react";

interface DashboardStatsProps {
  totalCommission: number;
  pendingCommission: number;
  totalBookings: number;
  walletBalance: number;
}

const DashboardStats = ({
  totalCommission,
  pendingCommission,
  totalBookings,
  walletBalance,
}: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Commission</p>
              <p className="text-2xl font-bold">₹{totalCommission.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CircleDollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Commission</p>
              <p className="text-2xl font-bold">₹{pendingCommission.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Bookings</p>
              <p className="text-2xl font-bold">{totalBookings}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Ticket className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Wallet Balance</p>
              <p className="text-2xl font-bold">₹{walletBalance.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Wallet className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
