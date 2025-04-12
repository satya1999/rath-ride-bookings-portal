import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Index from "@/pages/IndexPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import LoginPage from "@/pages/LoginPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import RegisterPage from "@/pages/RegisterPage";
import VerifyOtpPage from "@/pages/VerifyOtpPage";
import DashboardPage from "@/pages/DashboardPage";
import TripsPage from "@/pages/TripsPage";
import TripDetailPage from "@/pages/TripDetailPage";
import BookingDetailPage from "@/pages/BookingDetailPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AgentsPage from "@/pages/admin/AgentsPage";
import UsersPage from "@/pages/admin/UsersPage";
import BookingsPage from "@/pages/admin/BookingsPage";
import CommissionsPage from "@/pages/admin/CommissionsPage";
import BusLayoutsPage from "@/pages/admin/BusLayoutsPage";
import SettingsPage from "@/pages/admin/SettingsPage";
import NotFound from "@/pages/NotFoundPage";
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from './contexts/AuthContext';
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import AgentProfilePage from "@/pages/AgentProfilePage";

function App() {
  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey="vite-react-theme"
    >
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify" element={<VerifyOtpPage />} />
            
            {/* Agent Routes */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/trips/:id" element={<TripDetailPage />} />
            <Route path="/booking/:id" element={<BookingDetailPage />} />
            <Route path="/profile" element={<AgentProfilePage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/agents" element={<AgentsPage />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/bookings" element={<BookingsPage />} />
            <Route path="/admin/commissions" element={<CommissionsPage />} />
            <Route path="/admin/bus-layouts" element={<BusLayoutsPage />} />
            <Route path="/admin/settings/*" element={<SettingsPage />} />
            
            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
