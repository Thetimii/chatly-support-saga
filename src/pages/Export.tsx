import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Website {
  id: string;
  url: string;
  name: string | null;
}

const Export = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState<string>("");
  const [newWebsiteUrl, setNewWebsiteUrl] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("websites")
      .select("*")
      .eq("user_id", user.id)
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

  const handleAddWebsite = async () => {
    if (!newWebsiteUrl) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("websites")
      .insert([{ url: newWebsiteUrl, user_id: user.id }])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error adding website",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Website added successfully",
        description: "You can now generate the embed code for this website.",
      });
      setNewWebsiteUrl("");
      fetchWebsites();
      setSelectedWebsite(data.id);
    }
  };

  const copyEmbedCode = () => {
    if (!selectedWebsite) return;

    const embedCode = `<script src="https://simplesupportbot.com/widget.js" data-website-id="${selectedWebsite}"></script>`;

    navigator.clipboard.writeText(embedCode);
    toast({
      title: "Copied to clipboard",
      description: "You can now paste the embed code into your website.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Export Widget</h1>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Select Website</h2>
            <div className="space-y-4">
              <Select
                value={selectedWebsite}
                onValueChange={setSelectedWebsite}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a website" />
                </SelectTrigger>
                <SelectContent>
                  {websites.map((website) => (
                    <SelectItem key={website.id} value={website.id}>
                      {website.url}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Add New Website</h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="website-url">Website URL</Label>
                <Input
                  id="website-url"
                  placeholder="https://example.com"
                  value={newWebsiteUrl}
                  onChange={(e) => setNewWebsiteUrl(e.target.value)}
                />
              </div>
              <Button
                className="mt-8"
                onClick={handleAddWebsite}
                disabled={!newWebsiteUrl}
              >
                Add Website
              </Button>
            </div>
          </div>

          {selectedWebsite && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Embed Code</h3>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                  {`<script src="https://simplesupportbot.com/widget.js" data-website-id="${selectedWebsite}"></script>`}
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyEmbedCode}
                  className="mt-2"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Code
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Export;