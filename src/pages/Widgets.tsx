import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Copy, Code } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ChatWidget } from "@/components/ChatWidget";
import type { Database } from "@/integrations/supabase/types";

type Website = Database['public']['Tables']['websites']['Row'];

const Widgets = () => {
  const { toast } = useToast();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [showSnippet, setShowSnippet] = useState(false);

  useEffect(() => {
    fetchWebsites();
  }, []);

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("websites")
      .insert([{ 
        url: newUrl,
        user_id: user.id
      }]);

    if (error) {
      toast({
        title: "Error adding website",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Website added successfully",
        description: "You can now generate a chat widget for this website.",
      });
      setNewUrl("");
      fetchWebsites();
    }
  };

  const fetchWebsites = async () => {
    const { data, error } = await supabase
      .from("websites")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching websites",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setWebsites(data || []);
    }
  };

  const copySnippet = (websiteId: string) => {
    const snippet = `<script src="https://cdn.chatly.ai/widget.js" data-website-id="${websiteId}"></script>`;
    navigator.clipboard.writeText(snippet);
    toast({
      title: "Copied to clipboard",
      description: "You can now paste the snippet into your website.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Chat Widgets</h1>
      </div>

      <Card className="p-6">
        <form onSubmit={handleAddWebsite} className="flex gap-4">
          <Input
            type="url"
            placeholder="Enter website URL"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            <Plus className="w-4 h-4 mr-2" />
            Add Website
          </Button>
        </form>
      </Card>

      <div className="grid gap-6">
        {websites.map((website) => (
          <Card key={website.id} className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">{website.url}</h3>
                <p className="text-sm text-gray-500">
                  Added on {new Date(website.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedWebsite(selectedWebsite?.id === website.id ? null : website);
                    setShowSnippet(false);
                  }}
                >
                  Test Widget
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedWebsite(website);
                    setShowSnippet(true);
                  }}
                >
                  <Code className="w-4 h-4 mr-2" />
                  Get Code
                </Button>
              </div>
            </div>
            
            {selectedWebsite?.id === website.id && (
              <div className="mt-4">
                {showSnippet ? (
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      {`<script src="https://cdn.chatly.ai/widget.js" data-website-id="${website.id}"></script>`}
                    </pre>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => copySnippet(website.id)}
                      className="mt-2"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Snippet
                    </Button>
                  </div>
                ) : (
                  <div className="relative h-[500px] border rounded-lg">
                    <ChatWidget url={website.url} websiteId={website.id} />
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Widgets;