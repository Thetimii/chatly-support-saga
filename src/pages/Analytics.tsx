import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ChartBar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Analytics = () => {
  const [totalChats, setTotalChats] = useState(0);

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
    
    setTotalChats(count || 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ChartBar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Chats</p>
              <h3 className="text-2xl font-bold">{totalChats}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <ChartBar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Response Rate</p>
              <h3 className="text-2xl font-bold">95%</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ChartBar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Response Time</p>
              <h3 className="text-2xl font-bold">2.5s</h3>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Chat History</h2>
        <div className="space-y-4">
          <p className="text-gray-500">Coming soon...</p>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
