
import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleDollarSign, Ticket, BarChart3, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

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
    walletBalance: 12640
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
                For the MVP, this is a placeholder with mock data.
              </p>
              <p className="mb-6">
                Quick actions:
              </p>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("bookings")}
                >
                  View Recent Bookings
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("commissions")}
                >
                  Check Commissions
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
            <CardHeader>
              <CardTitle>My Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-12 text-gray-500">
                Your booking history will appear here.
                <br />
                This section will be implemented in Phase 2.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="commissions">
          <Card>
            <CardHeader>
              <CardTitle>Commission History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-12 text-gray-500">
                Your commission history will appear here.
                <br />
                This section will be implemented in Phase 2.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="wallet">
          <Card>
            <CardHeader>
              <CardTitle>Wallet & Withdrawals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Wallet className="h-12 w-12 text-rath-red" />
                <p className="text-3xl font-bold">₹{dashboardData.walletBalance.toLocaleString()}</p>
                <p className="text-gray-500">Available Balance</p>
                <Button onClick={handleWithdraw}>
                  Request Withdrawal
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default DashboardPage;
