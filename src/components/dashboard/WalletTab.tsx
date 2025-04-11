
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import WithdrawalForm from "./WithdrawalForm";

interface WalletTabProps {
  walletBalance: number;
  pendingCommission: number;
  onWithdraw: () => void;
}

const WalletTab = ({ walletBalance, pendingCommission, onWithdraw }: WalletTabProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Withdrawal Request</CardTitle>
        </CardHeader>
        <CardContent>
          <WithdrawalForm onWithdraw={onWithdraw} availableBalance={walletBalance} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Wallet Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Wallet className="h-12 w-12 text-rath-red" />
            <p className="text-3xl font-bold">₹{walletBalance.toLocaleString()}</p>
            <p className="text-gray-500">Available Balance</p>
            <div className="w-full pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Pending Commission</span>
                <span className="font-medium">₹{pendingCommission.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Last Withdrawal</span>
                <span className="font-medium">31 Mar 2025</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletTab;
