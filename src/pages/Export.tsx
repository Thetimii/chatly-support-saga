import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChatWidget } from "@/components/ChatWidget";

const Export = () => {
  const [websiteId, setWebsiteId] = useState<string>();
  const [error, setError] = useState<string>();
  const { toast } = useToast();

  useEffect(() => {
    const fetchWebsite = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('Please sign in to access your website settings.');
          return;
        }

        // Get current user's website
        const { data: website, error: websiteError } = await supabase
          .from('websites')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (websiteError) {
          if (websiteError.code === 'PGRST116') {
            // No website found
            setError('No website found. Please create one in the Chat Widgets section first.');
          } else {
            throw websiteError;
          }
        } else if (website) {
          setWebsiteId(website.id);
        }
      } catch (error: any) {
        console.error('Export', 'Failed to load website', error);
        setError(`Failed to load website: ${error.message}`);
      }
    };

    fetchWebsite();
  }, []);

  const copyToClipboard = () => {
    if (!websiteId) {
      setError('No embed code available.');
      return;
    }
    const scriptCode = `<script src="${window.location.origin}/widget.js" data-website-id="${websiteId}"></script>`;
    navigator.clipboard.writeText(scriptCode);
    toast({
      title: "Copied to clipboard",
      description: "You can now paste the code into your website.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Export Widget</h1>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Embed Code</h2>
        {error ? (
          <div className="text-red-500 mb-4">{error}</div>
        ) : websiteId ? (
          <div className="space-y-4">
            <p className="text-gray-600">
              Copy and paste this code into your website's HTML, just before the closing &lt;/body&gt; tag:
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                {`<script src="${window.location.origin}/widget.js" data-website-id="${websiteId}"></script>`}
              </pre>
            </div>
            <Button onClick={copyToClipboard}>
              <Copy className="w-4 h-4 mr-2" />
              Copy to Clipboard
            </Button>
          </div>
        ) : (
          <div className="text-gray-600">
            No website found. Please create one in the Chat Widgets section first.
          </div>
        )}
      </Card>

      {websiteId && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <div className="relative h-[500px] border rounded-lg">
            <ChatWidget websiteId={websiteId} />
          </div>
        </Card>
      )}
    </div>
  );
};

export default Export;