import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { MessageSquare, ChartBar, CreditCard } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text">
            SimpleSupport
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Features
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Pricing
            </a>
            <a href="#analytics" className="text-gray-600 hover:text-blue-600 flex items-center gap-2">
              <ChartBar className="w-4 h-4" />
              Analytics
            </a>
            <Link to="/auth">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};