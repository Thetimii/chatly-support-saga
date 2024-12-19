import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import SupportBot from "./SupportBot";
import { supabase } from "@/integrations/supabase/client";

interface ChatWidgetProps {
  url?: string;
  websiteId?: string;
}

export const ChatWidget = ({ url, websiteId }: ChatWidgetProps) => {
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState<string | null>(null);
  const actualWebsiteId = websiteId || params.websiteId;

  useEffect(() => {
    const fetchWebsiteUrl = async () => {
      if (!actualWebsiteId) return;
      
      const { data, error } = await supabase
        .from("websites")
        .select("url")
        .eq("id", actualWebsiteId)
        .single();

      if (error) {
        console.error("Error fetching website:", error);
        return;
      }

      setWebsiteUrl(data?.url || null);
    };

    if (!url && actualWebsiteId) {
      fetchWebsiteUrl();
    }
  }, [actualWebsiteId, url]);

  const finalUrl = url || websiteUrl;

  if (!finalUrl && !isOpen) {
    return null;
  }

  return (
    <>
      {!isOpen ? (
        <Button
          className="fixed bottom-4 right-4 rounded-full p-4 shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      ) : (
        <div className="fixed bottom-4 right-4 w-[400px] shadow-lg bg-background border rounded-lg">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-semibold">Chat Support</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="p-4">
            <SupportBot websiteUrl={finalUrl || ""} websiteId={actualWebsiteId || ""} />
          </div>
        </div>
      )}
    </>
  );
};