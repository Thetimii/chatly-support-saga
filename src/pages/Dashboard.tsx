import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  MessageSquare,
  Users,
  CreditCard,
  ChartBar,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [chatCredits, setChatCredits] = useState(0);

  useEffect(() => {
    // Fetch initial chat credits
    fetchChatCredits();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_credits'
        },
        () => {
          fetchChatCredits();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchChatCredits = async () => {
    const { count } = await supabase
      .from('chat_credits')
      .select('*', { count: 'exact', head: true });
    
    setChatCredits(count || 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Chat Credits Used</p>
              <h3 className="text-2xl font-bold">{chatCredits}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold">1,234</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <h3 className="text-2xl font-bold">$2.4k</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <ChartBar className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Conversion Rate</p>
              <h3 className="text-2xl font-bold">12%</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">New chat started</p>
                <p className="text-sm text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-full">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">New user registered</p>
                <p className="text-sm text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-4">
            <Link
              to="/dashboard/widgets"
              className="flex items-center gap-2 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium">Add Chat Widget</p>
                <p className="text-sm text-gray-500">
                  Deploy a new chat widget to your website
                </p>
              </div>
            </Link>
            <Link
              to="/dashboard/analytics"
              className="flex items-center gap-2 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <ChartBar className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium">View Analytics</p>
                <p className="text-sm text-gray-500">
                  Check your chat performance metrics
                </p>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
