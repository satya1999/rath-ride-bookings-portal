
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface WithdrawalFormProps {
  onWithdraw: () => void;
  availableBalance: number;
}

const WithdrawalForm = ({ onWithdraw, availableBalance }: WithdrawalFormProps) => {
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("upi");
  const [accountDetails, setAccountDetails] = useState<string>("");
  const [errors, setErrors] = useState<{
    amount?: string;
    details?: string;
  }>({});

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and validate max amount
    if (/^\d*$/.test(value)) {
      setWithdrawalAmount(value);
      
      if (parseInt(value) > availableBalance) {
        setErrors((prev) => ({ ...prev, amount: "Amount exceeds available balance" }));
      } else {
        setErrors((prev) => ({ ...prev, amount: undefined }));
      }
    }
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAccountDetails(value);
    
    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, details: "This field is required" }));
    } else if (paymentMethod === "upi" && !value.includes("@")) {
      setErrors((prev) => ({ ...prev, details: "Invalid UPI ID" }));
    } else {
      setErrors((prev) => ({ ...prev, details: undefined }));
    }
  };

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
    setAccountDetails(""); // Reset account details when payment method changes
    setErrors((prev) => ({ ...prev, details: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: {amount?: string, details?: string} = {};
    
    // Validate amount
    if (!withdrawalAmount || parseInt(withdrawalAmount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    } else if (parseInt(withdrawalAmount) > availableBalance) {
      newErrors.amount = "Amount exceeds available balance";
    }
    
    // Validate account details
    if (!accountDetails.trim()) {
      newErrors.details = "This field is required";
    } else if (paymentMethod === "upi" && !accountDetails.includes("@")) {
      newErrors.details = "Invalid UPI ID";
    }
    
    if (Object.keys(newErrors).length === 0) {
      // Proceed with withdrawal
      onWithdraw();
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="withdrawal-amount">Withdrawal Amount (₹)</Label>
        <Input
          id="withdrawal-amount"
          type="text"
          placeholder="Enter amount"
          value={withdrawalAmount}
          onChange={handleAmountChange}
          className={errors.amount ? "border-red-500" : ""}
        />
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount}</p>
        )}
        <p className="text-xs text-gray-500">
          Available balance: ₹{availableBalance.toLocaleString()}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment-method">Payment Method</Label>
        <Select value={paymentMethod} onValueChange={handlePaymentMethodChange}>
          <SelectTrigger id="payment-method">
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upi">UPI</SelectItem>
            <SelectItem value="bank">Bank Transfer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {paymentMethod === "upi" && (
          <>
            <Label htmlFor="upi-id">UPI ID</Label>
            <Input
              id="upi-id"
              type="text"
              placeholder="username@bank"
              value={accountDetails}
              onChange={handleDetailsChange}
              className={errors.details ? "border-red-500" : ""}
            />
            {errors.details && (
              <p className="text-sm text-red-500">{errors.details}</p>
            )}
          </>
        )}

        {paymentMethod === "bank" && (
          <>
            <div className="space-y-4">
              <Label htmlFor="account-details">Bank Account Details</Label>
              <Card className="border border-gray-200">
                <CardContent className="p-4 space-y-4">
                  <div>
                    <Label htmlFor="account-number">Account Number</Label>
                    <Input 
                      id="account-number" 
                      placeholder="Enter account number"
                      value={accountDetails}
                      onChange={handleDetailsChange}
                      className={errors.details ? "border-red-500" : ""} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="ifsc">IFSC Code</Label>
                    <Input id="ifsc" placeholder="Enter IFSC code" />
                  </div>
                  <div>
                    <Label htmlFor="account-name">Account Holder Name</Label>
                    <Input id="account-name" placeholder="Enter name as per bank records" />
                  </div>
                </CardContent>
              </Card>
              {errors.details && (
                <p className="text-sm text-red-500">{errors.details}</p>
              )}
            </div>
          </>
        )}
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full"
          disabled={!withdrawalAmount || parseInt(withdrawalAmount) <= 0 || !accountDetails || Object.keys(errors).length > 0}
        >
          Request Withdrawal
        </Button>
        <p className="text-xs text-center mt-2 text-gray-500">
          Withdrawal requests are processed within 2-3 business days
        </p>
      </div>
    </form>
  );
};

export default WithdrawalForm;
