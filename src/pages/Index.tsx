
import React from 'react';
import { TimeKeeper } from '@/components/TimeKeeper';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col items-center justify-center">
      <div className="w-full flex justify-end mb-4">
        <ThemeToggle />
      </div>
      <h1 className="text-4xl font-bold mb-10 text-center text-gradient font-display animate-fade-in">Voice of Time Keeper</h1>
      <TimeKeeper />
      <p className="text-muted-foreground text-sm mt-8 text-center animate-fade-in font-body">
        Record your voice as alarm sounds and reminders
      </p>
    </div>
  );
};

export default Index;
