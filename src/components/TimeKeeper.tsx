
import React from 'react';
import { AlarmClock } from './AlarmClock';
import { CalendarView } from './CalendarView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TimeKeeper() {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <Tabs defaultValue="alarm" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="alarm">Alarm Clock</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="alarm">
          <AlarmClock />
        </TabsContent>
        <TabsContent value="calendar">
          <CalendarView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
