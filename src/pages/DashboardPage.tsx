import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleDollarSign, Ticket, BarChart3, Wallet, Calendar, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import BookingHistoryList, { BookingHistoryItem } from "@/components/dashboard/BookingHistoryList";
import CommissionHistory, { CommissionHistoryItem } from "@/components/dashboard/CommissionHistory";
import WithdrawalForm from "@/components/dashboard/WithdrawalForm";

// This is just a placeholder for the MVP
// In a real app, this would be connected to an auth system
const DashboardPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  // Mock data for the dashboard
  const dashboardData = {
    totalCommission: 15840,
    pendingCommission: 3200,
    totalBookings: 47,
    walletBalance: 12640,
    recentBookings: [
      {
        id: "BK001",
        tripName: "Deluxe Trip to Puri",
        date: "15 Apr 2025",
        passengers: 3,
        amount: 7500,
        commission: 750,
        status: "completed" as const
      },
      {
        id: "BK002",
        tripName: "Premium Konark Tour",
        date: "16 Apr 2025",
        passengers: 2,
        amount: 6000,
        commission: 600,
        status: "completed" as const
      },
      {
        id: "BK003",
        tripName: "Royal Chilika Lake Trip",
        date: "17 Apr 2025",
        passengers: 1,
        amount: 3500,
        commission: 350,
        status: "pending" as const
      }
    ] as BookingHistoryItem[],
    commissionHistory: [
      {
        month: "April 2025",
        amount: 3200,
        bookings: 12,
        status: "available" as const
      },
      {
        month: "March 2025",
        amount: 4600,
        bookings: 18,
        status: "paid" as const,
        paidOn: "31 Mar 2025",
        transactionId: "TXN78912345"
      },
      {
        month: "February 2025",
        amount: 3900,
        bookings: 15,
        status: "paid" as const,
        paidOn: "28 Feb 2025",
        transactionId: "TXN45678901"
      }
    ] as CommissionHistoryItem[]
  };
  
  const handleWithdraw = () => {
    toast({
      title: "Withdrawal Request Sent",
      description: "Your withdrawal request has been submitted and is pending approval."
    });
  };

  return (
    <PageLayout>
      <h1 className="mb-2">Agent Dashboard</h1>
      <p className="text-gray-600 mb-6">Manage your bookings and commissions</p>
      
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Commission</p>
                <p className="text-2xl font-bold">₹{dashboardData.totalCommission.toLocaleString()}</p>
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
                <p className="text-2xl font-bold">₹{dashboardData.pendingCommission.toLocaleString()}</p>
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
                <p className="text-2xl font-bold">{dashboardData.totalBookings}</p>
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
                <p className="text-2xl font-bold">₹{dashboardData.walletBalance.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Wallet className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
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
                    <BookingHistoryList bookings={dashboardData.recentBookings.slice(0, 3)} compact />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <CircleDollarSign className="mr-2 h-5 w-5 text-rath-red" /> Recent Commissions
                  </h3>
                  <div className="overflow-x-auto">
                    <CommissionHistory commissions={dashboardData.commissionHistory.slice(0, 2)} compact />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("bookings")}
                >
                  View All Bookings
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("commissions")}
                >
                  Check All Commissions
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("wallet")}
                >
                  Manage Wallet
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bookings">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Bookings</CardTitle>
              <Button variant="outline" size="sm" className="flex items-center">
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </CardHeader>
            <CardContent>
              <BookingHistoryList bookings={dashboardData.recentBookings} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="commissions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Commission History</CardTitle>
              <Button variant="outline" size="sm" className="flex items-center">
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </CardHeader>
            <CardContent>
              <CommissionHistory commissions={dashboardData.commissionHistory} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="wallet">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Withdrawal Request</CardTitle>
              </CardHeader>
              <CardContent>
                <WithdrawalForm onWithdraw={handleWithdraw} availableBalance={dashboardData.walletBalance} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Wallet Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <Wallet className="h-12 w-12 text-rath-red" />
                  <p className="text-3xl font-bold">₹{dashboardData.walletBalance.toLocaleString()}</p>
                  <p className="text-gray-500">Available Balance</p>
                  <div className="w-full pt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-500">Pending Commission</span>
                      <span className="font-medium">₹{dashboardData.pendingCommission.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Last Withdrawal</span>
                      <span className="font-medium">31 Mar 2025</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default DashboardPage;
