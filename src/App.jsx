import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminProtectedRoute from "./auth/AdminProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import PlaceholderPage from "./components/PlaceholderPage";
import { NORMAL_USER_ROLES, USER_ROLES } from "./services/roles";

import Dashboard from "./screens/Dashboard";
import Login from "./screens/Login";
import VerifyEmail from "./screens/VerifyEmail";
import VerifyPhone from "./screens/VerifyPhone";
import AdminLogin from "./screens/AdminLogin";
import SuperAdminTwoFactor from "./screens/SuperAdminTwoFactor";
import SuperAdminDashboard from "./screens/SuperAdminDashboard";
import AdminDashboard from "./screens/AdminDashboard";
import AdminRoles from "./screens/AdminRoles";
import AdminUsers from "./screens/AdminUsers";
import Unauthorized from "./screens/Unauthorized";
import Profile from "./screens/Profile";
import Feed from "./screens/Feed";
import EventMemories from "./screens/EventMemories";
import Landing from "./screens/Landing";
import Events from "./screens/Events";
import Bookings from "./screens/Bookings";
import BookingDetails from "./screens/BookingDetails";
import EVoucher from "./screens/EVoucher";
import EventWebsite from "./screens/EventWebsite";
import GuestManagement from "./screens/GuestManagement";
import Guests from "./screens/Guests";
import Analytics from "./screens/Analytics";
import TemplateGallery from "./screens/TemplateGallery";
import Templates from "./screens/Templates";
import Withdrawals from "./screens/Withdrawals";
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
import MarketplaceDetails from "./screens/MarketplaceDetails";
import MarketplaceStorefront, { StorefrontModeration } from "./screens/MarketplaceStorefront";
import CreateMarketplaceListing from "./screens/CreateMarketplaceListing";
import VendorReview from "./screens/VendorReview";
import VendorPortfolio from "./screens/VendorPortfolio";
import VendorWallet from "./screens/VendorWallet";
import AdminVendorManagement from "./screens/AdminVendorManagement";
import VendorInsights from "./screens/VendorInsights";
import VendorBooking from "./screens/VendorBooking";
import AIMarketingStudio from "./screens/AIMarketingStudio";
import VendorGenie from "./screens/VendorGenie";
import Wallet from "./screens/Wallet";
import Pricing from "./screens/Pricing";
import Checkout from "./screens/Checkout";
import SharedMemoryPreview from "./screens/SharedMemoryPreview";
import Points from "./screens/Points";
import Wish from "./screens/Wish";
import SummonGenie from "./screens/SummonGenie";
import Gallery from "./screens/Gallery";
import Financials from "./screens/Financials";
import Help from "./screens/Help";
import Support from "./screens/Support";
import Notifications from "./screens/Notifications";
import NotificationSettings from "./screens/NotificationSettings";
import Tasks from "./screens/Tasks";
import Meetings from "./screens/Meetings";
import WhatsNew from "./screens/WhatsNew";
import Invoices from "./screens/Invoices";
import MyTickets from "./screens/MyTickets";
import SeatSelection from "./screens/SeatSelection";
import CreationSuccess from "./screens/CreationSuccess";
import MyAccount from "./screens/MyAccount";
import MyTemplates from "./screens/MyTemplates";
import PaymentMethods from "./screens/PaymentMethods";
import Billing from "./screens/Billing";
import SeatingPlanner from "./screens/SeatingPlanner";
import VenueBuilder from "./screens/VenueBuilder";
import AvailabilityCalendar from "./screens/AvailabilityCalendar";
import ProviderAvailability from "./screens/ProviderAvailability";
import AIEventPlanner from "./screens/AIEventPlanner";
import VendorCRM from "./components/VendorCRM";
import CRMCustomerDetails from "./components/CRMCustomerDetails";
import CRMLeadDetails from "./components/CRMLeadDetails";
import CRMInvoiceDetails from "./components/CRMInvoiceDetails";
import StorefrontSettings from "./screens/StorefrontSettings";
import StorefrontThemeEditor from "./screens/StorefrontThemeEditor";
import StorefrontAnalytics from "./screens/StorefrontAnalytics";
import EventOperationsDashboard from "./screens/EventOperationsDashboard";
import EventCommandCenter from "./screens/EventCommandCenter";
import StaffCoordinationBoard from "./screens/StaffCoordinationBoard";
import VendorCheckinScreen from "./screens/VendorCheckinScreen";
import EventCheckout from "./screens/EventCheckout";
import EventLive from "./screens/EventLive";
import EventSponsorManagement from "./screens/EventSponsorManagement";
import AdminSponsorships from "./screens/AdminSponsorships";
import PaymentStatus from "./screens/PaymentStatus";
import AdminPayments from "./screens/AdminPayments";
import AdminFinanceSettings from "./screens/AdminFinanceSettings";
import BetaLaunchBanner from "./components/BetaLaunchBanner";

function AdminModulePlaceholder({ title, description, icon }) {
  return (
    <PlaceholderPage
      title={title}
      description={description || "This admin module is routed and ready for Supabase-backed data."}
      icon={icon}
      backLink={{ path: "/admin", label: "Back to Admin" }}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BetaLaunchBanner />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verify-phone" element={<VerifyPhone />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/shared/event/:eventId" element={<SharedMemoryPreview />} />
          <Route path="/shared/event/:eventId/website" element={<EventWebsite />} />
          <Route path="/event-site/:eventId" element={<EventWebsite />} />
          <Route path="/events/:eventId/website" element={<EventWebsite />} />
          <Route path="/shared/memory/:memoryId" element={<SharedMemoryPreview />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          <Route path="/payment/success" element={<PaymentStatus status="success" />} />
          <Route path="/payment/failed" element={<PaymentStatus status="failed" />} />
          <Route path="/payment/pending" element={<PaymentStatus status="pending" />} />
          <Route path="/payments/:paymentId" element={<PaymentStatus />} />

          <Route
            path="/admin/2fa"
            element={
              <AdminProtectedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN]} requireSuperAdmin2FA={false}>
                <SuperAdminTwoFactor />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route
              path="super"
              element={
                <AdminProtectedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN]}>
                  <SuperAdminDashboard />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="roles"
              element={
                <AdminProtectedRoute requiredPermission="manage_roles">
                  <AdminRoles />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="users"
              element={
                <AdminProtectedRoute requiredPermission="view_all_users">
                  <AdminUsers />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="permissions"
              element={
                <AdminProtectedRoute requiredPermission="assign_permissions">
                  <AdminModulePlaceholder
                    title="Permissions"
                    description="Create and manage the permission catalog used by custom admin roles."
                    icon="key"
                  />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="feed"
              element={
                <AdminProtectedRoute requiredPermission="moderate_feed">
                  <AdminModulePlaceholder
                    title="Feed Moderation"
                    description="Review event memories, comments, shared previews, and reported feed activity."
                    icon="dynamic_feed"
                  />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="marketplace"
              element={
                <AdminProtectedRoute requiredPermission="moderate_storefronts">
                  <StorefrontModeration />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="vendors"
              element={
                <AdminProtectedRoute requiredPermission="manage_vendors">
                  <AdminVendorManagement />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="vendor-reviews"
              element={
                <AdminProtectedRoute requiredPermission="moderate_vendor_reviews">
                  <AdminModulePlaceholder
                    title="Vendor Reviews Moderation"
                    description="Review and moderate vendor reviews."
                    icon="reviews"
                  />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="vendor-wallets"
              element={
                <AdminProtectedRoute requiredPermission="manage_all_vendor_wallets">
                  <AdminModulePlaceholder
                    title="Vendor Wallets"
                    description="Manage all vendor wallets and platform commissions."
                    icon="account_balance_wallet"
                  />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="vendor-profiles"
              element={
                <AdminProtectedRoute requiredPermission="manage_all_vendor_profiles">
                  <AdminModulePlaceholder
                    title="Vendor Profiles"
                    description="Moderate and manage all vendor profiles."
                    icon="store"
                  />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="events"
              element={
                <AdminProtectedRoute requiredPermission="view_all_events">
                  <AdminModulePlaceholder title="Events" description="View and manage events across InviteGenie." icon="event_available" />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="sponsorships"
              element={
                <AdminProtectedRoute requiredPermission="moderate_event_sponsors">
                  <AdminSponsorships />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="payments"
              element={
                <AdminProtectedRoute requiredPermission="view_all_payments">
                  <AdminPayments />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="finance-settings"
              element={
                <AdminProtectedRoute requiredPermission="manage_platform_settings">
                  <AdminFinanceSettings />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="financials"
              element={
                <AdminProtectedRoute requiredPermission="view_all_financials">
                  <AdminModulePlaceholder
                    title="Financials"
                    description="Monitor platform financials, fees, payouts, and commission policies."
                    icon="payments"
                  />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="withdrawals"
              element={
                <AdminProtectedRoute requiredPermission="manage_payouts">
                  <Withdrawals />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="pricing"
              element={
                <AdminProtectedRoute requiredPermission="manage_pricing">
                  <AdminModulePlaceholder
                    title="Pricing"
                    description="Manage local demo pricing plans before Supabase billing is connected."
                    icon="sell"
                  />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="audit-logs"
              element={
                <AdminProtectedRoute requiredPermission="view_audit_logs">
                  <AdminModulePlaceholder
                    title="Audit Logs"
                    description="Review sensitive admin actions and security events."
                    icon="manage_search"
                  />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="platform-settings"
              element={
                <AdminProtectedRoute requiredPermission="manage_platform_settings">
                  <AdminModulePlaceholder
                    title="Platform Settings"
                    description="Manage platform configuration, commission rates, and 2FA settings."
                    icon="settings"
                  />
                </AdminProtectedRoute>
              }
            />
          </Route>

          <Route element={<AdminProtectedRoute><Outlet /></AdminProtectedRoute>}>
            <Route path="/users-management" element={<Navigate to="/admin/users" replace />} />
            <Route path="/events-management" element={<Navigate to="/admin/events" replace />} />
            <Route path="/vendors-management" element={<Navigate to="/admin/marketplace" replace />} />
            <Route path="/finance-management" element={<Navigate to="/admin/financials" replace />} />
            <Route path="/content-moderation" element={<Navigate to="/admin/marketplace" replace />} />
            <Route path="/support-management" element={<Navigate to="/admin/users" replace />} />
            <Route path="/platform-settings" element={<Navigate to="/admin/platform-settings" replace />} />
            <Route path="/system-audit-log" element={<Navigate to="/admin/audit-logs" replace />} />
          </Route>

          <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/s/:slug" element={<MarketplaceStorefront />} />
            <Route path="/store/:slug" element={<MarketplaceStorefront />} />
            <Route
              path="/marketplace/new"
              element={
                <ProtectedRoute requiredAnyPermissions={["create_marketplace_listing", "create_marketplace_product", "manage_all_storefronts"]}>
                  <CreateMarketplaceListing />
                </ProtectedRoute>
              }
            />
            <Route path="/marketplace/:providerId/storefront" element={<MarketplaceStorefront />} />
            <Route path="/marketplace/:providerId/book" element={<ProtectedRoute requiredAnyPermissions={["book_vendor", "browse_marketplace", "buy_marketplace_item", "manage_all_storefronts"]}><VendorBooking /></ProtectedRoute>} />
            <Route path="/marketplace/:providerId/review" element={<ProtectedRoute requiredAnyPermissions={["review_vendor", "browse_marketplace"]}><VendorReview /></ProtectedRoute>} />
            <Route path="/marketplace/:providerId/portfolio" element={<VendorPortfolio />} />
            <Route path="/marketplace/vendor/:vendorId" element={<MarketplaceDetails />} />
            <Route path="/marketplace/:providerId" element={<MarketplaceDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/marketplace/:providerId/availability" element={<ProviderAvailability />} />
            <Route path="/storefront/settings" element={<ProtectedRoute requiredAnyPermissions={["manage_own_storefront", "manage_all_storefronts", "vendorMode", "create_marketplace_listing"]}><StorefrontSettings /></ProtectedRoute>} />
            <Route path="/storefront/theme" element={<ProtectedRoute requiredAnyPermissions={["edit_storefront_theme", "manage_all_storefronts", "vendorMode", "create_marketplace_listing"]}><StorefrontThemeEditor /></ProtectedRoute>} />
            <Route path="/storefront/analytics" element={<ProtectedRoute requiredAnyPermissions={["view_storefront_analytics", "manage_all_storefronts", "vendorMode", "create_marketplace_listing"]}><StorefrontAnalytics /></ProtectedRoute>} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={NORMAL_USER_ROLES}><Outlet /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ai-planner" element={<AIEventPlanner />} />
            <Route path="/ai-planner/:planId" element={<AIEventPlanner />} />
            <Route path="/events/:eventId/operations" element={<ProtectedRoute requiredPermission="view_event_operations_dashboard"><EventOperationsDashboard /></ProtectedRoute>} />
            <Route path="/events/:eventId/command-center" element={<ProtectedRoute requiredPermission="view_command_center"><EventCommandCenter /></ProtectedRoute>} />
            <Route path="/events/:eventId/staff" element={<ProtectedRoute requiredPermission="manage_staff_coordination"><StaffCoordinationBoard /></ProtectedRoute>} />
            <Route path="/events/:eventId/checkins" element={<ProtectedRoute requiredPermission="manage_vendor_checkin"><VendorCheckinScreen /></ProtectedRoute>} />
            <Route path="/vendor-crm" element={<ProtectedRoute requiredAnyPermissions={["view_vendor_crm"]}><VendorCRM /></ProtectedRoute>} />
            <Route path="/vendor-crm/customers/:customerId" element={<ProtectedRoute requiredAnyPermissions={["view_vendor_crm"]}><CRMCustomerDetails /></ProtectedRoute>} />
            <Route path="/vendor-crm/leads/:leadId" element={<ProtectedRoute requiredAnyPermissions={["manage_leads"]}><CRMLeadDetails /></ProtectedRoute>} />
            <Route path="/vendor-crm/invoices/:invoiceId" element={<ProtectedRoute requiredAnyPermissions={["create_invoices", "view_vendor_crm"]}><CRMInvoiceDetails /></ProtectedRoute>} />
            <Route path="/availability" element={<ProtectedRoute requiredAnyPermissions={["manage_availability", "manage_time_slots", "manage_staff_schedule", "manage_multi_location_availability", "vendorMode", "plannerMode", "taskerMode"]}><AvailabilityCalendar /></ProtectedRoute>} />
            <Route path="/home" element={<Dashboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/new" element={<ProtectedRoute requiredPermission="create_event"><CreateEvent /></ProtectedRoute>} />
            <Route path="/events/:eventId" element={<EventDetails />} />
            <Route path="/events/:eventId/checkout" element={<EventCheckout />} />
            <Route path="/events/:eventId/live" element={<EventLive />} />
            <Route path="/events/:eventId/sponsors/manage" element={<ProtectedRoute requiredPermission="manage_event_sponsors"><EventSponsorManagement /></ProtectedRoute>} />
            <Route path="/creation-success/:eventId" element={<CreationSuccess />} />
            <Route path="/withdrawals" element={<ProtectedRoute requiredAnyPermissions={["view_own_withdrawals", "view_company_withdrawals", "view_withdrawals", "manage_payouts"]}><Withdrawals /></ProtectedRoute>} />
            <Route path="/create-event" element={<ProtectedRoute requiredPermission="create_event"><CreateEvent /></ProtectedRoute>} />
            <Route path="/create-invitation" element={<ProtectedRoute requiredPermission="create_event"><CreateEvent /></ProtectedRoute>} />
            <Route path="/invitations/templates" element={<TemplateGallery />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/my-templates" element={<MyTemplates />} />
            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/feed/upload" element={<WhatsNew />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/gallery/upload/:eventId" element={<Gallery />} />
            <Route path="/events/:eventId/memories" element={<EventMemories />} />
            <Route path="/memories/:eventId" element={<EventMemories />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/guests" element={<Guests />} />
            <Route path="/guest-management" element={<GuestManagement />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/payment-methods" element={<PaymentMethods />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/financials" element={<Financials />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/venue-builder" element={<VenueBuilder />} />
            <Route path="/events/:eventId/venue-builder" element={<VenueBuilder />} />
            <Route path="/convert-points" element={<Points />} />
            <Route path="/make-a-wish" element={<Wish />} />
            <Route path="/summon-genie" element={<SummonGenie />} />
            <Route path="/genie" element={<SummonGenie />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-account" element={<MyAccount />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/notification-settings" element={<NotificationSettings />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
            <Route path="/support" element={<Support />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/bookings/:bookingId" element={<BookingDetails />} />
            <Route path="/bookings/:bookingId/voucher" element={<EVoucher />} />
            <Route path="/evoucher" element={<EVoucher />} />
            <Route path="/seat-selection/:eventId" element={<SeatSelection />} />
            <Route path="/seating-planner/:eventId" element={<SeatingPlanner />} />
            <Route path="/vendor-wallet" element={<ProtectedRoute requiredPermission="view_vendor_wallet"><VendorWallet /></ProtectedRoute>} />
            <Route path="/vendor-portfolio" element={<ProtectedRoute requiredPermission="manage_vendor_portfolio"><VendorPortfolio /></ProtectedRoute>} />
            <Route path="/vendor-insights" element={<ProtectedRoute requiredAnyPermissions={["view_vendor_insights", "advanced_vendor_insights"]}><VendorInsights /></ProtectedRoute>} />
            <Route path="/ai-marketing-studio" element={<ProtectedRoute requiredPermission="use_ai_marketing_studio"><AIMarketingStudio /></ProtectedRoute>} />
            <Route path="/vendor-genie" element={<ProtectedRoute requiredAnyPermissions={["use_ai_marketing_studio", "use_vendor_genie", "manage_ai_vendor_tools"]}><VendorGenie /></ProtectedRoute>} />
            <Route path="/wallet" element={<ProtectedRoute requiredAnyPermissions={["view_wallet", "view_vendor_wallet", "view_all_wallets"]}><Wallet /></ProtectedRoute>} />
            <Route path="/tickets/buy/:eventId" element={<EventDetails />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
