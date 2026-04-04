import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Loader2 } from "lucide-react";
import * as authService from "@/services/authService";

// Lazy load modules
const LoginPage = lazy(() => import("@/modules/auth/pages/LoginPage"));
const DashboardPage = lazy(() => import("@/modules/dashboard/pages/DashboardPage"));
const ClientsList = lazy(() => import("@/modules/clients/pages/ClientsList"));
const LeadsList = lazy(() => import("@/modules/leads/pages/LeadsList"));
const ServicesList = lazy(() => import("@/modules/services/pages/ServicesList"));
const BlogList = lazy(() => import("@/modules/blogs/pages/BlogList"));
const CreateBlog = lazy(() => import("@/modules/blogs/pages/CreateBlog"));
const EditBlog = lazy(() => import("@/modules/blogs/pages/EditBlog"));
const InvoicesList = lazy(() => import("@/modules/billing/pages/InvoicesList"));
const PaymentsList = lazy(() => import("@/modules/billing/pages/PaymentsList"));

// Remaining pages (to be moved eventually)
const ReviewsPage = lazy(() => import("@/modules/reviews/pages/ReviewsList"));
const AnalyticsPage = lazy(() => import("@/modules/analytics/pages/AnalyticsPage"));
const SettingsPage = lazy(() => import("@/modules/settings/pages/SettingsPage"));
const IndustriesPage = lazy(() => import("@/modules/services/pages/IndustriesList"));
const NotFound = lazy(() => import("@/modules/dashboard/pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex h-[400px] w-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" closeButton richColors />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            
            <Route 
              path="/" 
              element={
                authService.isAuthenticated() ? (
                  <DashboardLayout />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            >
              <Route index element={<DashboardPage />} />
              
              {/* Clients Module */}
              <Route path="clients" element={<ClientsList />} />
              
              {/* Leads Module */}
              <Route path="leads" element={<LeadsList />} />
              
              {/* Services Module */}
              <Route path="services" element={<ServicesList />} />
              <Route path="industries" element={<IndustriesPage />} />
              
              {/* Blogs Module */}
              <Route path="blogs">
                <Route index element={<BlogList />} />
                <Route path="create" element={<CreateBlog />} />
                <Route path="edit/:id" element={<EditBlog />} />
              </Route>
              
              {/* Billing Module */}
              <Route path="billing">
                <Route path="invoices" element={<InvoicesList />} />
                <Route path="payments" element={<PaymentsList />} />
                <Route index element={<Navigate to="/billing/invoices" replace />} />
              </Route>
              <Route path="invoices" element={<Navigate to="/billing/invoices" replace />} />
              <Route path="payments" element={<Navigate to="/billing/payments" replace />} />
              
              {/* Other Pages */}
              <Route path="reviews" element={<ReviewsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
