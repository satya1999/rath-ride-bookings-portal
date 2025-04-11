
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, EyeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface BookingHistoryItem {
  id: string;
  tripName: string;
  date: string;
  passengers: number;
  amount: number;
  commission: number;
  status: "completed" | "pending" | "cancelled";
}

interface BookingHistoryListProps {
  bookings: BookingHistoryItem[];
  compact?: boolean;
}

const BookingHistoryList = ({ bookings, compact = false }: BookingHistoryListProps) => {
  const navigate = useNavigate();

  const viewBookingDetails = (bookingId: string) => {
    // In a real app, navigate to booking detail page
    navigate(`/bookings/${bookingId}`);
  };

  const downloadTicket = (bookingId: string) => {
    // In a real app, this would download the ticket
    alert(`Downloading ticket for booking ${bookingId}`);
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

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        You haven't made any bookings yet.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="min-w-full overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking ID
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trip
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Passengers
              </th>
              {!compact && (
                <>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                </>
              )}
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {booking.id}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.tripName}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.date}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.passengers}
                </td>
                {!compact && (
                  <>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{booking.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{booking.commission.toLocaleString()}
                    </td>
                  </>
                )}
                <td className="px-4 py-4 whitespace-nowrap">
                  {getStatusBadge(booking.status)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {compact ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => viewBookingDetails(booking.id)}
                      className="text-rath-red hover:text-rath-red/80"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewBookingDetails(booking.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" /> View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadTicket(booking.id)}
                        className="text-rath-red hover:text-rath-red/80"
                      >
                        <FileText className="h-4 w-4 mr-1" /> Ticket
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingHistoryList;
