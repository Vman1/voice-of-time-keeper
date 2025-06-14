
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { toast } = useToast();
  
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
    const root = document.documentElement;
    
    if (dark) {
      root.style.setProperty('--background', '240 6% 8%');
      root.style.setProperty('--foreground', '0 0% 98%');
      root.style.setProperty('--primary', '217 91% 60%');
      root.style.setProperty('--primary-foreground', '0 0% 98%');
      root.style.setProperty('--secondary', '240 4% 16%');
    } else {
      root.style.setProperty('--background', '0 0% 100%');
      root.style.setProperty('--foreground', '240 10% 3.9%');
      root.style.setProperty('--primary', '217 91% 60%');
      root.style.setProperty('--primary-foreground', '0 0% 98%');
      root.style.setProperty('--secondary', '240 4.8% 95.9%');
    }
  };
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="glass-button w-12 h-12 hover:scale-105 transition-all duration-300"
      aria-label="Toggle theme"
    >
      {isDarkMode ? 
        <Sun className="h-5 w-5 text-primary" /> : 
        <Moon className="h-5 w-5 text-primary" />
      }
    </Button>
  );
}
