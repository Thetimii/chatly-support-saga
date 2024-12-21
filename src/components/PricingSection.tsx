import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface PricingPlan {
  id: string;
  name: string;
  free_credits: number;
  price_per_chat: number;
  created_at: string;
}

export const PricingSection = () => {
  const [plan, setPlan] = useState<PricingPlan | null>(null);

  useEffect(() => {
    const fetchPricingPlan = async () => {
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .single();
      
      if (error) {
        console.error('Error fetching pricing plan:', error);
        return;
      }
      
      if (data) {
        setPlan(data as PricingPlan);
      }
    };

    fetchPricingPlan();
  }, []);

  if (!plan) return null;

  return (
    <div id="pricing" className="py-24">
      <h2 className="text-4xl font-bold text-center mb-16">Simple, Transparent Pricing</h2>
      <div className="max-w-md mx-auto">
        <div className="p-8 bg-blue-50 rounded-2xl shadow-lg relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
            Current Plan
          </div>
          <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between">
              <span className="text-lg">Free Credits</span>
              <span className="text-2xl font-bold">{plan.free_credits}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg">Price per Chat</span>
              <span className="text-2xl font-bold">${plan.price_per_chat.toFixed(2)}</span>
            </div>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span>{plan.free_credits} free conversations</span>
            </li>
            <li className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span>Pay as you go pricing</span>
            </li>
            <li className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span>24/7 AI support</span>
            </li>
          </ul>
          <Link to="/auth">
            <Button className="w-full">Get Started Now</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};