
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CircleDollarSign } from "lucide-react";
import BookingHistoryList, { BookingHistoryItem } from "./BookingHistoryList";
import CommissionHistory, { CommissionHistoryItem } from "./CommissionHistory";

interface OverviewTabProps {
  recentBookings: BookingHistoryItem[];
  commissionHistory: CommissionHistoryItem[];
  onTabChange: (tab: string) => void;
}

const OverviewTab = ({ recentBookings, commissionHistory, onTabChange }: OverviewTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to Your Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          This is your agent dashboard where you can manage bookings, track commissions, and withdraw funds.
        </p>
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-rath-red" /> Recent Bookings
            </h3>
            <div className="overflow-x-auto">
              <BookingHistoryList bookings={recentBookings.slice(0, 3)} compact />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <CircleDollarSign className="mr-2 h-5 w-5 text-rath-red" /> Recent Commissions
            </h3>
            <div className="overflow-x-auto">
              <CommissionHistory commissions={commissionHistory.slice(0, 2)} compact />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-6">
          <Button 
            variant="outline" 
            onClick={() => onTabChange("bookings")}
          >
            View All Bookings
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onTabChange("commissions")}
          >
            Check All Commissions
          </Button>
          <Button
            variant="outline"
            onClick={() => onTabChange("wallet")}
          >
            Manage Wallet
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewTab;
