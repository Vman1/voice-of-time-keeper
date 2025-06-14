
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { ReminderDialog } from './ReminderDialog';
import { RemindersList } from './RemindersList';

interface Reminder {
  date: Date;
  time: string;
  audioUrl: string;
  note: string;
}

export function CalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddReminder = (newReminder: Reminder) => {
    setReminders([...reminders, newReminder]);
  };

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6 rounded-2xl modern-shadow hover-lift">
          <div className="flex justify-center items-center mb-8">
            <ReminderDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              selectedDate={date}
              onDateSelect={setDate}
              onAddReminder={handleAddReminder}
            />
          </div>
          
          <div className="bg-white/[0.02] backdrop-blur-sm rounded-2xl p-4 border border-white/[0.05]">
            <Calendar 
              mode="single" 
              selected={date} 
              onSelect={setDate} 
              className="w-full [&_.rdp-day_selected]:bg-primary [&_.rdp-day_selected]:text-primary-foreground [&_.rdp-day_today]:bg-accent/20 [&_.rdp-day_today]:text-accent [&_.rdp-day:hover]:bg-white/[0.05] [&_.rdp-day]:transition-colors [&_.rdp-day]:duration-200 [&_.rdp-day]:rounded-lg" 
            />
          </div>
        </div>
        
        <RemindersList
          selectedDate={date}
          reminders={reminders}
          onAddReminderClick={() => setDialogOpen(true)}
        />
      </div>
    </div>
  );
}
