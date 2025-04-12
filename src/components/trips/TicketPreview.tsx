
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Trip, Passenger } from "@/types/trip";
import { Download, Share2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface TicketPreviewProps {
  trip: Trip;
  passenger: Passenger;
}

const TicketPreview = ({ trip, passenger }: TicketPreviewProps) => {
  const { toast } = useToast();
  const ticketRef = useRef<HTMLDivElement>(null);

  const downloadTicket = async () => {
    if (!ticketRef.current) return;
    
    try {
      const canvas = await html2canvas(ticketRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${trip.id}-${passenger.name}-ticket.pdf`);
      
      toast({
        title: "Ticket Downloaded",
        description: "Your ticket has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error downloading your ticket. Please try again.",
        variant: "destructive",
      });
    }
  };

  const shareTicket = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${trip.title} Ticket`,
          text: `${passenger.name}'s ticket for ${trip.title} on ${trip.formattedDate}`,
          url: window.location.href,
        });
      } catch (error) {
        toast({
          title: "Share Failed",
          description: "There was an error sharing your ticket. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Share Not Supported",
        description: "Web Share API is not supported on your browser. Please download the ticket instead.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Ticket</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={shareTicket}>
            <Share2 className="h-4 w-4 mr-2" /> Share
          </Button>
          <Button onClick={downloadTicket}>
            <Download className="h-4 w-4 mr-2" /> Download
          </Button>
        </div>
      </div>

      {/* Ticket Container */}
      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="p-0">
          <div ref={ticketRef} className="p-6 bg-white">
            {/* Ticket Header */}
            <div className="bg-purple-600 text-white p-4 rounded-t-lg">
              <div className="flex justify-between">
                <h3 className="text-xl font-bold">E-Ticket</h3>
                <p className="text-sm">{trip.formattedDate}</p>
              </div>
            </div>
            
            {/* Trip Details */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-xl font-bold mb-2">{trip.title}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="font-medium">{trip.from}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">To</p>
                  <p className="font-medium">{trip.to}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Departure</p>
                  <p className="font-medium">{trip.departureTime}, {trip.formattedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bus Type</p>
                  <p className="font-medium">{trip.busType}</p>
                </div>
              </div>
            </div>
            
            {/* Passenger Details */}
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-medium mb-2">Passenger Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{passenger.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mobile</p>
                  <p className="font-medium">{passenger.mobile}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-medium">{passenger.age}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Seat Number</p>
                  <p className="font-medium">{passenger.seatNumber}</p>
                </div>
                {passenger.bloodGroup && (
                  <div>
                    <p className="text-sm text-gray-500">Blood Group</p>
                    <p className="font-medium">{passenger.bloodGroup}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Fare & Barcode */}
            <div className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Fare</p>
                <p className="text-xl font-bold">₹{trip.fare}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Ticket ID</p>
                <div className="bg-gray-200 py-2 px-4 rounded font-mono text-sm">
                  {`TKT${trip.id}${passenger.seatNumber}`}
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="bg-gray-50 p-4 text-center text-xs text-gray-500 rounded-b-lg">
              This e-ticket is valid with a photo ID. Please be at the pick-up point 30 minutes before departure.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketPreview;
