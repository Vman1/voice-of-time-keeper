
import React from 'react';
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export function ToastDemo() {
  const showToast = () => {
    toast({
      title: "Toast Notification",
      description: "This is a toast notification example",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-2xl font-bold">Toast Demo</h2>
      <p className="text-muted-foreground mb-4">Click the button below to show a toast notification</p>
      <Button onClick={showToast}>Show Toast</Button>
    </div>
  );
}
