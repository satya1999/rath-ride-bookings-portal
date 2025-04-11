
import { BookingHistoryItem } from "./BookingHistoryList";
import { CommissionHistoryItem } from "./CommissionHistory";

// Mock data types
export interface DashboardData {
  totalCommission: number;
  pendingCommission: number;
  totalBookings: number;
  walletBalance: number;
  recentBookings: BookingHistoryItem[];
  commissionHistory: CommissionHistoryItem[];
}

// Mock data for the dashboard
export const mockDashboardData: DashboardData = {
  totalCommission: 15840,
  pendingCommission: 3200,
  totalBookings: 47,
  walletBalance: 12640,
  recentBookings: [
    {
      id: "BK001",
      tripName: "Deluxe Trip to Puri",
      date: "15 Apr 2025",
      passengers: 3,
      amount: 7500,
      commission: 750,
      status: "completed" as const
    },
    {
      id: "BK002",
      tripName: "Premium Konark Tour",
      date: "16 Apr 2025",
      passengers: 2,
      amount: 6000,
      commission: 600,
      status: "completed" as const
    },
    {
      id: "BK003",
      tripName: "Royal Chilika Lake Trip",
      date: "17 Apr 2025",
      passengers: 1,
      amount: 3500,
      commission: 350,
      status: "pending" as const
    }
  ] as BookingHistoryItem[],
  commissionHistory: [
    {
      month: "April 2025",
      amount: 3200,
      bookings: 12,
      status: "available" as const
    },
    {
      month: "March 2025",
      amount: 4600,
      bookings: 18,
      status: "paid" as const,
      paidOn: "31 Mar 2025",
      transactionId: "TXN78912345"
    },
    {
      month: "February 2025",
      amount: 3900,
      bookings: 15,
      status: "paid" as const,
      paidOn: "28 Feb 2025",
      transactionId: "TXN45678901"
    }
  ] as CommissionHistoryItem[]
};
