
import { useState, useEffect } from "react";
import { Booking } from "@/hooks/useBookings";

export interface DashboardData {
  totalCommission: number;
  pendingCommission: number;
  totalBookings: number;
  walletBalance: number;
  commissionHistory: {
    month: string;
    amount: number;
    bookings: number;
    status: 'available' | 'pending' | 'paid';
    paidOn?: string;
    transactionId?: string;
  }[];
}

export function useDashboardData(bookings: Booking[]) {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalCommission: 0,
    pendingCommission: 0,
    totalBookings: 0,
    walletBalance: 0,
    commissionHistory: []
  });

  useEffect(() => {
    // Calculate dashboard stats from real booking data
    if (bookings.length > 0) {
      const totalBookingsCount = bookings.length;
      
      // Assuming each booking has a commission of 10% of the amount
      const bookingsWithAmount = bookings.map(booking => {
        const amount = parseInt(booking.amount.replace('₹', '').replace(',', ''), 10) || 0;
        return {
          ...booking,
          numericAmount: amount,
          commission: Math.round(amount * 0.1) // 10% commission
        };
      });
      
      const totalCommission = bookingsWithAmount.reduce((sum, booking) => sum + booking.commission, 0);
      
      // Assuming pending commissions are from bookings with "pending" status
      const pendingCommission = bookingsWithAmount
        .filter(booking => booking.status === "pending")
        .reduce((sum, booking) => sum + booking.commission, 0);
        
      // Wallet balance is total commission minus pending
      const walletBalance = totalCommission - pendingCommission;
      
      // Generate commission history from booking data
      // Group by month for simplicity
      const commissionsByMonth: {[key: string]: any} = {};
      bookingsWithAmount.forEach(booking => {
        const date = new Date(booking.date);
        const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
        
        if (!commissionsByMonth[monthYear]) {
          commissionsByMonth[monthYear] = {
            month: monthYear,
            amount: 0,
            bookings: 0,
            status: 'available'
          };
        }
        
        commissionsByMonth[monthYear].amount += booking.commission;
        commissionsByMonth[monthYear].bookings += 1;
      });
      
      const commissionHistory = Object.values(commissionsByMonth);
      
      setDashboardData({
        totalCommission,
        pendingCommission,
        totalBookings: totalBookingsCount,
        walletBalance,
        commissionHistory
      });
    }
  }, [bookings]);

  return dashboardData;
}
