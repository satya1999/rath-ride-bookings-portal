
import { Badge } from "@/components/ui/badge";

export interface CommissionHistoryItem {
  month: string;
  amount: number;
  bookings: number;
  status: "available" | "pending" | "paid";
  paidOn?: string;
  transactionId?: string;
}

interface CommissionHistoryProps {
  commissions: CommissionHistoryItem[];
  compact?: boolean;
}

const CommissionHistory = ({ commissions, compact = false }: CommissionHistoryProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Available</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
      case "paid":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Paid</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (commissions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No commission history available.
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
                Month
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bookings
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              {!compact && (
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {commissions.map((commission, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {commission.month}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  ₹{commission.amount.toLocaleString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {commission.bookings}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {getStatusBadge(commission.status)}
                </td>
                {!compact && (
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {commission.status === "paid" && (
                      <div>
                        <p>Paid on: {commission.paidOn}</p>
                        <p className="text-xs text-gray-400">Txn: {commission.transactionId}</p>
                      </div>
                    )}
                    {commission.status === "pending" && <p>Processing payment</p>}
                    {commission.status === "available" && <p>Ready to withdraw</p>}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommissionHistory;
