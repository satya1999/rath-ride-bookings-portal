
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
  MoreHorizontal, 
  Search, 
  FileText,
  Ban,
  CheckCircle2,
  Printer,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data
const bookings = [
  {
    id: "B1001",
    customer: "Vishal Mehta",
    agent: "Amit Kumar",
    date: "2025-04-12",
    trip: "Delhi to Varanasi",
    amount: "₹4,250",
    status: "confirmed"
  },
  {
    id: "B1002",
    customer: "Neha Reddy",
    agent: "Sneha Desai",
    date: "2025-04-11",
    trip: "Mumbai to Goa",
    amount: "₹3,800",
    status: "confirmed"
  },
  {
    id: "B1003",
    customer: "Rajan Patel",
    agent: "Rajiv Singh",
    date: "2025-04-10",
    trip: "Chennai to Madurai",
    amount: "₹2,600",
    status: "pending"
  },
  {
    id: "B1004",
    customer: "Geeta Sharma",
    agent: "Kavita Sharma",
    date: "2025-04-09",
    trip: "Kolkata to Puri",
    amount: "₹3,100",
    status: "cancelled"
  },
  {
    id: "B1005",
    customer: "Arvind Singh",
    agent: "Prakash Joshi",
    date: "2025-04-08",
    trip: "Bangalore to Mysore",
    amount: "₹1,950",
    status: "confirmed"
  }
];

const BookingsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.trip.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && booking.status === statusFilter;
  });

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Bookings Management</h1>
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
              variant={statusFilter === "confirmed" ? "default" : "outline"}
              className={statusFilter === "confirmed" ? "bg-green-600" : ""}
              onClick={() => setStatusFilter("confirmed")}
            >
              Confirmed
            </Button>
            <Button 
              variant={statusFilter === "pending" ? "default" : "outline"}
              className={statusFilter === "pending" ? "bg-amber-500" : ""}
              onClick={() => setStatusFilter("pending")}
            >
              Pending
            </Button>
            <Button 
              variant={statusFilter === "cancelled" ? "default" : "outline"}
              className={statusFilter === "cancelled" ? "bg-red-500" : ""}
              onClick={() => setStatusFilter("cancelled")}
            >
              Cancelled
            </Button>
          </div>
          
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trip Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
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
              <TableHead>Booking ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Trip</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>{booking.customer}</TableCell>
                  <TableCell>{booking.agent}</TableCell>
                  <TableCell>{booking.trip}</TableCell>
                  <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                  <TableCell>{booking.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        booking.status === "confirmed" ? "bg-green-600 text-white border-green-600" :
                        booking.status === "pending" ? "bg-amber-500 text-white border-amber-500" :
                        "bg-red-500 text-white border-red-500"
                      }
                    >
                      {booking.status}
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
                          <Printer className="mr-2 h-4 w-4" />
                          <span>Print Ticket</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          <span>Invoice</span>
                        </DropdownMenuItem>
                        {booking.status === "pending" && (
                          <DropdownMenuItem className="text-green-600">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            <span>Confirm</span>
                          </DropdownMenuItem>
                        )}
                        {booking.status !== "cancelled" && (
                          <DropdownMenuItem className="text-red-600">
                            <Ban className="mr-2 h-4 w-4" />
                            <span>Cancel</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No bookings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </AdminLayout>
  );
};

export default BookingsPage;
