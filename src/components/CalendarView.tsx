
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
    <div className="p-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-4 rounded-lg">
          <div className="flex justify-center items-center mb-6">
            <ReminderDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              selectedDate={date}
              onDateSelect={setDate}
              onAddReminder={handleAddReminder}
            />
          </div>
          
          <div className="bg-secondary/20 backdrop-blur-sm rounded-lg p-1">
            <Calendar mode="single" selected={date} onSelect={setDate} className="w-full" />
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
