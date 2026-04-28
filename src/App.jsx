import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import { USER_ROLES } from "./auth/roles";

import Layout from "./components/Layout";
import PlaceholderPage from "./screens/PlaceholderPage";
import RoleDashboard from "./screens/dashboard/RoleDashboard";
import Login from "./screens/Login";
import Unauthorized from "./screens/auth/Unauthorized";
import Profile from "./screens/Profile";
import Feed from "./screens/Feed";
import EventMemories from "./screens/EventMemories";
import Landing from "./screens/Landing";
import Events from "./screens/Events";
import Bookings from "./screens/Bookings";
import EVoucher from "./screens/EVoucher";
import GuestManagement from "./screens/GuestManagement";
import Analytics from "./screens/Analytics";
import TemplateGallery from "./screens/TemplateGallery";
import Scanner from "./screens/Scanner";
import CreateEvent from "./screens/CreateEvent";
import Settings from "./screens/Settings";
import Calendar from "./screens/Calendar";
import Inbox from "./screens/Inbox";
import Payments from "./screens/Payments"; 
import Reports from "./screens/Reports";
import Integrations from "./screens/Integrations";
import EventDetails from "./screens/EventDetails";
import Marketplace from "./screens/Marketplace";
import Points from "./screens/Points";
import Wish from "./screens/Wish";
import Genie from "./screens/Genie";
import Gallery from "./screens/Gallery";
import Financials from "./screens/Financials";
import Help from "./screens/Help";
import Support from "./screens/Support";
import Notifications from "./screens/Notifications";
import Tasks from "./screens/Tasks";
import Meetings from "./screens/Meetings";
import WhatsNew from "./screens/WhatsNew"; 
import Invoices from "./screens/Invoices";
import MyTickets from "./screens/MyTickets";
import UsersManagement from "./screens/management/UsersManagement";
import EventsManagement from "./screens/management/EventsManagement";
import VendorsManagement from "./screens/management/VendorsManagement";
import PlatformSettings from "./screens/management/PlatformSettings";

// Placeholder wrapper for title prop
const PlaceholderPageWrapper = ({ title }) => <PlaceholderPage title={title} />;

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            {/* Main Navigation */}
            <Route path="/dashboard" element={<RoleDashboard />} />
            <Route path="/home" element={<RoleDashboard />} /> {/* Same as dashboard */}
            <Route path="/events" element={<Events />} />
            <Route path="/events/:eventId" element={<EventDetails />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/create-invitation" element={<CreateEvent />} />
            <Route path="/invitations/templates" element={<TemplateGallery />} />
            <Route path="/my-templates" element={<PlaceholderPage title="My Templates" />} />
            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/feed/upload" element={<WhatsNew />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/gallery/upload/:eventId" element={<Gallery />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/inbox" element={<Inbox />} />

            {/* Business */}
            <Route path="/payments" element={<Payments />} />
            <Route path="/payment-methods" element={<PlaceholderPage title="Payment Methods" />} />
            <Route path="/billing" element={<PlaceholderPage title="Subscription & Billing" />} />
            <Route path="/financials" element={<Financials />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/integrations" element={<Integrations />} />

            {/* Admin */}
            <Route path="/users-management" element={<UsersManagement />} />
            <Route path="/events-management" element={<EventsManagement />} />
            <Route path="/vendors-management" element={<VendorsManagement />} />
            <Route path="/finance-management" element={<Financials />} />
            <Route path="/content-moderation" element={<WhatsNew />} />
            <Route path="/support-management" element={<Support />} />
            <Route path="/platform-settings" element={<PlatformSettings />} />

            {/* Genie / Fun */}
            <Route path="/convert-points" element={<Points />} />
            <Route path="/make-a-wish" element={<Wish />} />
            <Route path="/summon-genie" element={<Genie />} />

            {/* Account */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/notification-settings" element={<PlaceholderPage title="Notification Settings" />} />
            <Route path="/settings" element={<Settings />} />

            {/* Legacy/Fallback routes */}
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/evoucher" element={<EVoucher />} />
            <Route path="/tickets/buy/:eventId" element={<EventDetails />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}