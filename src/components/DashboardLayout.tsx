import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  CreditCard,
  ChartBar,
  LogOut,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const mainNavItems: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    title: "Chat Widgets",
    href: "/dashboard/widgets",
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: <ChartBar className="w-5 h-5" />,
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    title: "Export",
    href: "/dashboard/export",
    icon: <Share2 className="w-5 h-5" />,
  },
];

const bottomNavItems: NavItem[] = [
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="w-5 h-5" />,
  },
];

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden lg:block">
        <div className="h-full px-3 py-4 flex flex-col">
          <Link to="/dashboard" className="flex items-center mb-8 px-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text">
              SimpleSupport
            </span>
          </Link>
          
          <nav className="space-y-1 flex-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg",
                  location.pathname === item.href
                    ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                    : "text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </Link>
            ))}
          </nav>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <nav className="space-y-1">
              {bottomNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg",
                    location.pathname === item.href
                      ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                      : "text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
                <span className="ml-3">Log Out</span>
              </button>
            </nav>
          </div>
        </div>
      </aside>

      {/* Mobile menu */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75">
            <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800">
              <div className="h-full px-3 py-4 overflow-y-auto">
                <Link
                  to="/dashboard"
                  className="flex items-center mb-8 px-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text">
                    SimpleSupport
                  </span>
                </Link>
                <nav className="space-y-1">
                  {mainNavItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg",
                        location.pathname === item.href
                          ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                          : "text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      )}
                    >
                      {item.icon}
                      <span className="ml-3">{item.title}</span>
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="ml-3">Log Out</span>
                  </button>
                </nav>
              </div>
            </aside>
          </div>
        )}
      </div>

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
};
