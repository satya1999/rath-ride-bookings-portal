
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Trip, Passenger } from "@/types/trip";
import { Download, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import TicketCard from "./ticket/TicketCard";

interface TicketPreviewProps {
  trip: Trip;
  passengers: Passenger[];
}

const TicketPreview = ({ trip, passengers }: TicketPreviewProps) => {
  const { toast } = useToast();
  const ticketRef = useRef<HTMLDivElement>(null);
  const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0);
  const currentPassenger = passengers[currentPassengerIndex];

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
      pdf.save(`${trip.id}-${currentPassenger.name}-ticket.pdf`);
      
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

  const downloadAllTickets = async () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      
      for (let i = 0; i < passengers.length; i++) {
        setCurrentPassengerIndex(i);
        
        // Wait for render
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (!ticketRef.current) continue;
        
        const canvas = await html2canvas(ticketRef.current, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        if (i > 0) {
          pdf.addPage();
        }
        
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      }
      
      pdf.save(`${trip.id}-all-tickets.pdf`);
      
      toast({
        title: "All Tickets Downloaded",
        description: "All tickets have been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error downloading tickets. Please try again.",
        variant: "destructive",
      });
    }
  };

  const shareTicket = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${trip.title} Ticket`,
          text: `${currentPassenger.name}'s ticket for ${trip.title} on ${trip.formattedDate}`,
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
        <h2 className="text-2xl font-bold">Your Tickets</h2>
        <div className="flex gap-2">
          {passengers.length > 1 && (
            <Button variant="outline" onClick={downloadAllTickets}>
              <Download className="h-4 w-4 mr-2" /> Download All
            </Button>
          )}
          <Button variant="outline" onClick={shareTicket}>
            <Share2 className="h-4 w-4 mr-2" /> Share
          </Button>
          <Button onClick={downloadTicket}>
            <Download className="h-4 w-4 mr-2" /> Download
          </Button>
        </div>
      </div>

      {passengers.length > 1 && (
        <div className="flex items-center justify-center gap-4 mb-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPassengerIndex(prev => (prev > 0 ? prev - 1 : prev))}
            disabled={currentPassengerIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            Ticket {currentPassengerIndex + 1} of {passengers.length} - {currentPassenger.name} (Seat {currentPassenger.seatNumber})
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPassengerIndex(prev => (prev < passengers.length - 1 ? prev + 1 : prev))}
            disabled={currentPassengerIndex === passengers.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <TicketCard 
        trip={trip} 
        passenger={currentPassenger} 
        innerRef={ticketRef} 
      />
    </div>
  );
};

export default TicketPreview;
