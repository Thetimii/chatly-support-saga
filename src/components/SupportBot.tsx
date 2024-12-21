import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  text: string;
  isBot: boolean;
  confidence?: number;
}

interface SupportBotProps {
  websiteUrl: string;
  websiteId: string;
}

const SupportBot = ({ websiteUrl, websiteId }: SupportBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { text: `Hi! I'm your AI assistant. How can I help you with ${websiteUrl}?`, isBot: true },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const trackChatCredit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('No authenticated user found');
        return;
      }

      const { error } = await supabase
        .from('chat_credits')
        .insert([{ 
          website_id: websiteId,
          user_id: user.id
        }]);
      
      if (error) throw error;
    } catch (err) {
      console.error('Error tracking chat credit:', err);
      toast({
        title: "Error",
        description: "Failed to track chat credit",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Track credit when chat session starts
    trackChatCredit();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { text: input, isBot: false };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: {
          message: input,
          url: websiteUrl,
          history: messages.map(m => ({
            role: m.isBot ? "assistant" : "user",
            content: m.text
          }))
        }
      });

      if (error) throw error;

      setMessages((prev) => [...prev, { 
        text: data.response, 
        isBot: true,
        confidence: data.confidence || 0.85 
      }]);
    } catch (err) {
      console.error("Chat error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble connecting right now. Please try again later.",
          isBot: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Website Assistant</h2>
        </div>

        <div className="h-[400px] overflow-y-auto space-y-4 mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isBot
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                <p>{message.text}</p>
                {message.isBot && message.confidence && (
                  <div className="mt-2 text-xs opacity-70">
                    Confidence: {(message.confidence * 100).toFixed(1)}%
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about this website..."
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            {loading ? "Sending..." : "Send"}
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default SupportBot;