
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectTrigger, 
  SelectItem, 
  SelectValue 
} from "@/components/ui/select";
import { useState } from "react";

// Mock data
const overviewData = [
  { name: "Jan", bookings: 400, revenue: 24000 },
  { name: "Feb", bookings: 300, revenue: 18500 },
  { name: "Mar", bookings: 500, revenue: 28500 },
  { name: "Apr", bookings: 280, revenue: 15900 },
  { name: "May", bookings: 650, revenue: 32500 },
  { name: "Jun", bookings: 700, revenue: 36000 },
  { name: "Jul", bookings: 630, revenue: 31500 },
  { name: "Aug", bookings: 470, revenue: 26000 },
  { name: "Sep", bookings: 580, revenue: 29800 },
  { name: "Oct", bookings: 620, revenue: 32000 },
  { name: "Nov", bookings: 750, revenue: 38000 },
  { name: "Dec", bookings: 820, revenue: 42500 }
];

const bookings = [
  {
    id: "B0012",
    customer: "Raj Sharma",
    date: "2025-04-10",
    amount: "₹3,999",
    status: "completed"
  },
  {
    id: "B0011",
    customer: "Priya Patel",
    date: "2025-04-09",
    amount: "₹2,850",
    status: "pending"
  },
  {
    id: "B0010",
    customer: "Vikram Singh",
    date: "2025-04-08",
    amount: "₹5,200",
    status: "completed"
  },
  {
    id: "B0009",
    customer: "Ananya Gupta",
    date: "2025-04-07",
    amount: "₹4,100",
    status: "cancelled"
  },
  {
    id: "B0008",
    customer: "Mohammed Khan",
    date: "2025-04-06",
    amount: "₹3,200",
    status: "completed"
  }
];

export const Overview = () => {
  const [selectedView, setSelectedView] = useState("bookings");

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={selectedView} onValueChange={setSelectedView}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bookings">Bookings</SelectItem>
            <SelectItem value="revenue">Revenue</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={overviewData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          {selectedView === "bookings" && (
            <Area
              type="monotone"
              dataKey="bookings"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorBookings)"
            />
          )}
          {selectedView === "revenue" && (
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#82ca9d"
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const RecentBookings = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Booking</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell className="font-medium">
              <div className="space-y-1">
                <div>{booking.id}</div>
                <div className="text-xs text-muted-foreground">{booking.date}</div>
              </div>
            </TableCell>
            <TableCell>{booking.customer}</TableCell>
            <TableCell>{booking.amount}</TableCell>
            <TableCell>
              <Badge
                variant={
                  booking.status === "completed" ? "default" :
                  booking.status === "pending" ? "outline" : "destructive"
                }
              >
                {booking.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
