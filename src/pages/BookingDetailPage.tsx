
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, ChevronLeft } from "lucide-react";

const BookingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Mock booking data - in a real app this would come from an API
  const booking = {
    id: id || "BK001",
    tripName: "Deluxe Trip to Puri",
    date: "15 Apr 2025",
    departureTime: "08:00 AM",
    from: "Bhubaneswar",
    to: "Puri",
    status: "completed",
    totalAmount: 7500,
    commission: 750,
    amountPaid: 6000,
    balanceDue: 1500,
    passengers: [
      {
        id: 1,
        name: "Rahul Sharma",
        age: 32,
        gender: "Male",
        seatNumber: "A1"
      },
      {
        id: 2,
        name: "Priya Sharma",
        age: 28,
        gender: "Female",
        seatNumber: "A2"
      },
      {
        id: 3,
        name: "Aarav Sharma",
        age: 5,
        gender: "Male",
        seatNumber: "A3"
      }
    ]
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <PageLayout>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mr-4">
          <ChevronLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="flex-1">Booking Details</h1>
        <Button className="flex items-center">
          <Download className="mr-2 h-4 w-4" /> Download Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Trip Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{booking.tripName}</h2>
                <div className="text-sm text-gray-500">{booking.date} | {booking.departureTime}</div>
              </div>
              <div>{getStatusBadge(booking.status)}</div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between bg-gray-50 p-4 rounded-md">
              <div className="mb-2 sm:mb-0">
                <p className="text-sm text-gray-500">From</p>
                <p className="font-medium">{booking.from}</p>
              </div>
              <div className="mb-2 sm:mb-0">
                <p className="text-sm text-gray-500">To</p>
                <p className="font-medium">{booking.to}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Booking ID</p>
                <p className="font-medium">{booking.id}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Passenger Details</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Age
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Gender
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Seat
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {booking.passengers.map((passenger) => (
                    <tr key={passenger.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {passenger.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {passenger.age}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {passenger.gender}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <Badge variant="outline">{passenger.seatNumber}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Fare</span>
              <span className="font-medium">₹{booking.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount Paid</span>
              <span className="text-green-700 font-medium">₹{booking.amountPaid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Balance Due</span>
              <span className="text-amber-700 font-medium">₹{booking.balanceDue.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-gray-600">Your Commission</span>
              <span className="text-blue-700 font-medium">₹{booking.commission.toLocaleString()}</span>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-gray-500 w-full">
              Balance amount is to be collected from passenger at the time of boarding.
            </p>
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
};

export default BookingDetailPage;
