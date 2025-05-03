
import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Eye, 
  Download,
  MoreHorizontal, 
  Search, 
  CheckCircle2,
  XCircle,
  FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCommissions } from "@/hooks/useCommissions";
import { Skeleton } from "@/components/ui/skeleton";

const CommissionsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { commissions, loading, handleStatusChange } = useCommissions();
  
  const filteredCommissions = commissions.filter(commission => {
    const matchesSearch = 
      commission.agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commission.booking.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && commission.status === statusFilter;
  });

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
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Commissions Management</h1>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
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

      <div className="mb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button 
              variant={statusFilter === "paid" ? "default" : "outline"}
              className={statusFilter === "paid" ? "bg-green-600" : ""}
              onClick={() => setStatusFilter("paid")}
            >
              Paid
            </Button>
            <Button 
              variant={statusFilter === "pending" ? "default" : "outline"}
              className={statusFilter === "pending" ? "bg-amber-500" : ""}
              onClick={() => setStatusFilter("pending")}
            >
              Pending
            </Button>
            <Button 
              variant={statusFilter === "rejected" ? "default" : "outline"}
              className={statusFilter === "rejected" ? "bg-red-500" : ""}
              onClick={() => setStatusFilter("rejected")}
            >
              Rejected
            </Button>
          </div>
          
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search commissions..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Commission ID</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Booking</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(5).fill(0).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[40px]" /></TableCell>
                </TableRow>
              ))
            ) : filteredCommissions.length > 0 ? (
              filteredCommissions.map((commission) => (
                <TableRow key={commission.id}>
                  <TableCell className="font-medium">{commission.id.substring(0, 8)}</TableCell>
                  <TableCell>
                    <div>
                      <div>{commission.agent.name}</div>
                      <div className="text-xs text-muted-foreground">{commission.agent.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{commission.booking}</TableCell>
                  <TableCell>{commission.amount}</TableCell>
                  <TableCell>{commission.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        commission.status === "paid" ? "bg-green-600 text-white border-green-600" :
                        commission.status === "pending" ? "bg-amber-500 text-white border-amber-500" :
                        "bg-red-500 text-white border-red-500"
                      }
                    >
                      {commission.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          <span>Invoice</span>
                        </DropdownMenuItem>
                        {commission.status === "pending" && (
                          <>
                            <DropdownMenuItem 
                              className="text-green-600"
                              onClick={() => handleStatusChange(commission.id, "paid")}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              <span>Approve</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleStatusChange(commission.id, "rejected")}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              <span>Reject</span>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No commissions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </AdminLayout>
  );
};

export default CommissionsPage;
