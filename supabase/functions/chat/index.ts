import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { CohereClient } from "npm:cohere-ai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message, url, history } = await req.json();
    console.log("Received request:", { message, url });

    const cohere = new CohereClient({
      token: Deno.env.get("COHERE_API_KEY") || "",
    });

    try {
      const response = await cohere.chat({
        message,
        model: "command",
        temperature: 0.7,
        chatHistory: history?.map((msg: any) => ({
          role: msg.role === "user" ? "USER" : "CHATBOT",
          message: msg.content,
        })) || [],
        connectors: [{
          id: "web-search",
          options: {
            site: url,
            search_results_count: 3
          }
        }],
        preamble: `You are a website specialist AI trained to analyze and provide accurate context-aware answers based strictly on the content of the given webpage ${url}. Your primary role is to act as a representative for the organization, business, or entity described on the page, answering questions as if you are speaking on their behalf based solely on the information visible on that page.`
      });

      console.log("Cohere API Response:", response);

      return new Response(
        JSON.stringify({
          response: response.text,
          confidence: 0.85
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Cohere API Error:", error);
      let errorMessage = "An unknown error occurred";
      
      if (error instanceof Error) {
        if (error.message.includes("401")) {
          errorMessage = "Invalid API key. Please check your Cohere API key configuration.";
        } else if (error.message.includes("429")) {
          errorMessage = "Rate limit exceeded. Please try again in a moment.";
        }
      }
      
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unknown error occurred",
        details: error instanceof Error ? error.stack : undefined
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});