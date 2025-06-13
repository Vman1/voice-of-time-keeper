
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';

interface Reminder {
  date: Date;
  time: string;
  audioUrl: string;
  note: string;
}

interface RemindersListProps {
  selectedDate: Date | undefined;
  reminders: Reminder[];
  onAddReminderClick: () => void;
}

export function RemindersList({ selectedDate, reminders, onAddReminderClick }: RemindersListProps) {
  const getTodaysReminders = () => {
    if (!selectedDate) return [];
    return reminders.filter(reminder => 
      format(reminder.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    );
  };

  const playReminder = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  const todaysReminders = getTodaysReminders();

  return (
    <div className="glass-card rounded-lg p-4">
      <h2 className="text-xl font-display font-bold mb-6 flex items-center text-foreground">
        <CalendarIcon className="mr-2 h-5 w-5" />
        {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
      </h2>
      
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
        {todaysReminders.length > 0 ? (
          todaysReminders.map((reminder, index) => (
            <div key={index} className="border border-white/20 rounded-md p-4 bg-secondary/30 backdrop-blur-sm hover:bg-secondary/40 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-foreground">{reminder.time}</p>
                  {reminder.note && <p className="text-sm text-muted-foreground">{reminder.note}</p>}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => playReminder(reminder.audioUrl)} 
                  className="text-foreground"
                >
                  Play
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-center font-body mb-2">No reminders for this date</p>
            <Button variant="outline" size="sm" onClick={onAddReminderClick} className="text-foreground">
              <Plus className="mr-2 h-4 w-4" />
              Add One
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
