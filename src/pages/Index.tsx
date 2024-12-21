import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatWidget } from "@/components/ChatWidget";
import { ArrowRight, MessageSquare, Shield, Zap } from "lucide-react";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PricingSection } from "@/components/PricingSection";

const Index = () => {
  const [url, setUrl] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [websiteId, setWebsiteId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "Please sign in to try the chat widget",
          variant: "destructive",
        });
        return;
      }

      const { data: website, error } = await supabase
        .from("websites")
        .insert([{ 
          url: url,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setWebsiteId(website.id);
      setShowChat(true);
    } catch (error) {
      console.error("Error creating website:", error);
      toast({
        title: "Error",
        description: "Failed to create website entry",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16 space-y-8 animate-fade-in">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text">
            We don't talk much, but our bot does
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Add AI-powered customer support to your website in minutes. Let Chatly handle your customer queries while you focus on growing your business.
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg">
            <div className="flex gap-4">
              <Input
                type="url"
                placeholder="Enter your website URL to try it out"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 text-lg h-12"
              />
              <Button type="submit" size="lg" className="gap-2">
                Try Now <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </form>
        </div>

        {/* Features Section */}
        <div id="features" className="py-24">
          <h2 className="text-4xl font-bold text-center mb-16">Features</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8 bg-white rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Smart AI Responses</h3>
              <p className="text-gray-600">
                Powered by Cohere AI for accurate, context-aware answers that feel human
              </p>
            </div>
            
            <div className="p-8 bg-white rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Easy Integration</h3>
              <p className="text-gray-600">
                Add our chat widget to your site with a single line of code
              </p>
            </div>
            
            <div className="p-8 bg-white rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Enterprise Security</h3>
              <p className="text-gray-600">
                Bank-grade encryption and compliance with data protection regulations
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <PricingSection />

        {/* Analytics Preview Section */}
        <div id="analytics" className="py-24">
          <h2 className="text-4xl font-bold text-center mb-16">Powerful Analytics</h2>
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <img 
              src="/placeholder.svg" 
              alt="Analytics Dashboard Preview" 
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </div>

      {showChat && websiteId && <ChatWidget url={url} websiteId={websiteId} />}
    </div>
  );
};

export default Index;