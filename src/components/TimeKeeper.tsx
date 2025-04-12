
import React from 'react';
import { AlarmClock } from './AlarmClock';
import { CalendarView } from './CalendarView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TimeKeeper() {
  return (
    <div className="w-full max-w-4xl mx-auto glass-card rounded-lg animate-fade-in">
      <Tabs defaultValue="alarm" className="w-full">
        <TabsList className="grid w-full grid-cols-2 p-1 bg-secondary/20 backdrop-blur-sm rounded-t-lg">
          <TabsTrigger value="alarm" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">Alarm Clock</TabsTrigger>
          <TabsTrigger value="calendar" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">Calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="alarm" className="animate-scale-in">
          <AlarmClock />
        </TabsContent>
        <TabsContent value="calendar" className="animate-scale-in">
          <CalendarView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
