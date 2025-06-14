
import React from 'react';
import { AlarmClock } from './AlarmClock';
import { CalendarView } from './CalendarView';
import { StopWatch } from './StopWatch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Timer, Calendar } from 'lucide-react';

export function TimeKeeper() {
  return (
    <div className="w-full max-w-5xl mx-auto glass-card modern-shadow animate-scale-in hover-lift">
      <Tabs defaultValue="alarm" className="w-full">
        <TabsList className="grid w-full grid-cols-3 p-2 bg-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/[0.05] mb-8">
          <TabsTrigger 
            value="alarm" 
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all duration-300 rounded-xl font-medium flex items-center gap-2 py-3"
          >
            <Clock className="w-4 h-4" />
            Alarm Clock
          </TabsTrigger>
          <TabsTrigger 
            value="stopwatch" 
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all duration-300 rounded-xl font-medium flex items-center gap-2 py-3"
          >
            <Timer className="w-4 h-4" />
            Stop Watch
          </TabsTrigger>
          <TabsTrigger 
            value="calendar" 
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all duration-300 rounded-xl font-medium flex items-center gap-2 py-3"
          >
            <Calendar className="w-4 h-4" />
            Calendar
          </TabsTrigger>
        </TabsList>
        <TabsContent value="alarm" className="animate-scale-in p-8">
          <AlarmClock />
        </TabsContent>
        <TabsContent value="stopwatch" className="animate-scale-in p-8">
          <StopWatch />
        </TabsContent>
        <TabsContent value="calendar" className="animate-scale-in p-8">
          <CalendarView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
