
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const { toast } = useToast();
  
  // Apply theme on initial load and when theme changes
  useEffect(() => {
    applyTheme(isDarkMode);
  }, [isDarkMode]);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    toast({
      title: `Switched to ${!isDarkMode ? 'dark' : 'light'} mode`,
      duration: 2000,
    });
  };
  
  const applyTheme = (dark: boolean) => {
    // Apply theme by toggling CSS variables
    const root = document.documentElement;
    
    if (dark) {
      // Dark theme (existing theme)
      root.style.setProperty('--background', '240 10% 3.9%');
      root.style.setProperty('--foreground', '0 0% 98%');
      root.style.setProperty('--primary', '0 0% 98%');
      root.style.setProperty('--primary-foreground', '240 5.9% 10%');
      root.style.setProperty('--secondary', '240 3.7% 15.9%');
    } else {
      // Light theme
      root.style.setProperty('--background', '0 0% 100%');
      root.style.setProperty('--foreground', '240 10% 3.9%');
      root.style.setProperty('--primary', '240 5.9% 10%');
      root.style.setProperty('--primary-foreground', '0 0% 98%');
      root.style.setProperty('--secondary', '240 4.8% 95.9%');
    }
  };
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-9 h-9 hover-scale"
      aria-label="Toggle theme"
    >
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
