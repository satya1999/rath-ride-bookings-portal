
import { QrCode } from "lucide-react";

const TicketFooter = () => {
  return (
    <div className="bg-gray-50 p-4 rounded-b-lg">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="text-xs text-gray-500 text-center md:text-left mb-3 md:mb-0">
          <p className="font-medium mb-1">Important Information:</p>
          <ul className="list-disc list-inside">
            <li>This e-ticket is valid with a photo ID.</li>
            <li>Please be at the pick-up point 30 minutes before departure.</li>
            <li>The balance amount is to be paid on the day of journey before boarding.</li>
            <li>Luggage limit: 20kg per passenger.</li>
          </ul>
        </div>
        <div className="flex flex-col items-center">
          <QrCode className="h-20 w-20 text-gray-400" />
          <p className="text-xs text-gray-500 mt-1">Scan for verification</p>
        </div>
      </div>
    </div>
  );
};

export default TicketFooter;
