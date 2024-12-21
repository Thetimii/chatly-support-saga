import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, DollarSign } from "lucide-react";

const Billing = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Billing</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Free Trial</p>
                <p className="text-sm text-gray-500">100 chats/month</p>
              </div>
              <Button>Upgrade</Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <div className="space-y-4">
            <Button variant="outline" className="w-full">
              <CreditCard className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Usage</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Chats Used</p>
              <p className="text-sm text-gray-500">50/100 this month</p>
            </div>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Billing;