
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus, Play } from 'lucide-react';
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
    <div className="glass-card rounded-2xl p-6 modern-shadow hover-lift">
      <h2 className="text-2xl font-display font-semibold mb-8 flex items-center text-foreground">
        <CalendarIcon className="mr-3 h-6 w-6 text-primary" />
        {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
      </h2>
      
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {todaysReminders.length > 0 ? (
          todaysReminders.map((reminder, index) => (
            <div key={index} className="glass-card p-4 rounded-xl hover:bg-white/[0.08] transition-all duration-300 group">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-lg mb-1">{reminder.time}</p>
                  {reminder.note && (
                    <p className="text-sm text-muted-foreground leading-relaxed">{reminder.note}</p>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => playReminder(reminder.audioUrl)} 
                  className="glass-button border-primary/20 text-primary hover:text-primary-foreground hover:bg-primary/90 ml-4 group-hover:scale-105 transition-all duration-300"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Play
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted/20 flex items-center justify-center mb-6">
              <CalendarIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-center font-medium mb-6 text-lg">
              No reminders for this date
            </p>
            <Button 
              variant="outline" 
              onClick={onAddReminderClick} 
              className="glass-button border-primary/30 text-primary hover:text-primary-foreground hover:bg-primary/90 transition-all duration-300 px-6 py-3 rounded-xl"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Reminder
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
