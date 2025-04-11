
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import BookingHistoryList, { BookingHistoryItem } from "./BookingHistoryList";

interface BookingsTabProps {
  bookings: BookingHistoryItem[];
}

const BookingsTab = ({ bookings }: BookingsTabProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>My Bookings</CardTitle>
        <Button variant="outline" size="sm" className="flex items-center">
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
      </CardHeader>
      <CardContent>
        <BookingHistoryList bookings={bookings} />
      </CardContent>
    </Card>
  );
};

export default BookingsTab;
