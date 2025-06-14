
import React from 'react';
import { TimeKeeper } from '@/components/TimeKeeper';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute top-1/4 -right-48 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-6 py-12 min-h-screen flex flex-col items-center justify-center relative z-10">
        <div className="w-full flex justify-end mb-8">
          <ThemeToggle />
        </div>
        
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text font-display">
            Voice of Time
          </h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
            Elevate your time management with personalized voice reminders and intelligent scheduling
          </p>
        </div>
        
        <div className="w-full max-w-6xl animate-slide-up">
          <TimeKeeper />
        </div>
        
        <p className="text-muted-foreground text-sm mt-12 text-center animate-fade-in font-body opacity-60">
          Crafted for productivity • Designed for simplicity
        </p>
      </div>
    </div>
  );
};

export default Index;
