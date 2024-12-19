import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { DashboardLayout } from "@/components/DashboardLayout";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Widgets from "@/pages/Widgets";
import Analytics from "@/pages/Analytics";
import Billing from "@/pages/Billing";
import Settings from "@/pages/Settings";
import Export from "@/pages/Export";
import Auth from "@/pages/Auth";
import { ChatWidget } from "@/components/ChatWidget"; // Add this import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/dashboard/widgets" element={<DashboardLayout><Widgets /></DashboardLayout>} />
        <Route path="/dashboard/analytics" element={<DashboardLayout><Analytics /></DashboardLayout>} />
        <Route path="/dashboard/billing" element={<DashboardLayout><Billing /></DashboardLayout>} />
        <Route path="/dashboard/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
        <Route path="/dashboard/export" element={<DashboardLayout><Export /></DashboardLayout>} />
        <Route path="/widget/:websiteId" element={<ChatWidget />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;