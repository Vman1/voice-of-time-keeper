
import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Plus } from 'lucide-react';
import { VoiceRecorder } from './VoiceRecorder';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Reminder {
  date: Date;
  time: string;
  audioUrl: string;
  note: string;
}

interface ReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onAddReminder: (reminder: Reminder) => void;
}

export function ReminderDialog({ 
  open, 
  onOpenChange, 
  selectedDate, 
  onDateSelect, 
  onAddReminder 
}: ReminderDialogProps) {
  const [time, setTime] = React.useState('');
  const [note, setNote] = React.useState('');
  const [recording, setRecording] = React.useState(false);
  const [recordedAudio, setRecordedAudio] = React.useState<string | null>(null);

  const resetForm = () => {
    setTime('');
    setNote('');
    setRecordedAudio(null);
    setRecording(false);
  };

  const handleAddReminder = () => {
    if (!selectedDate) {
      toast({
        title: "No date selected",
        description: "Please select a date for your reminder",
        variant: "destructive"
      });
      return;
    }

    if (!time) {
      toast({
        title: "No time selected",
        description: "Please select a time for your reminder",
        variant: "destructive"
      });
      return;
    }

    if (!recordedAudio) {
      toast({
        title: "No recording",
        description: "Please record a voice message for your reminder",
        variant: "destructive"
      });
      return;
    }

    const newReminder: Reminder = {
      date: selectedDate,
      time: time,
      audioUrl: recordedAudio,
      note: note
    };

    onAddReminder(newReminder);
    onOpenChange(false);
    resetForm();
    
    toast({
      title: "Reminder added",
      description: `Your reminder is set for ${format(selectedDate, 'PPP')} at ${time}`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-foreground gap-2">
          <Plus className="h-4 w-4" />
          Add Reminder
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Add Voice Reminder</DialogTitle>
          <DialogDescription className="text-foreground/70">
            Create a voice reminder for your calendar.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Date</label>
            <div className="rounded-md bg-secondary/10 overflow-hidden">
              <Calendar mode="single" selected={selectedDate} onSelect={onDateSelect} className="bg-transparent w-full" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Time</label>
            <input 
              type="time" 
              value={time} 
              onChange={e => setTime(e.target.value)} 
              className="w-full p-2 bg-secondary/30 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Note (optional)</label>
            <input 
              type="text" 
              value={note} 
              onChange={e => setNote(e.target.value)} 
              placeholder="Add a note" 
              className="w-full p-2 bg-secondary/30 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground" 
            />
          </div>
          
          <VoiceRecorder
            recording={recording}
            recordedAudio={recordedAudio}
            onStartRecording={() => setRecording(true)}
            onStopRecording={() => setRecording(false)}
            onRecordingComplete={setRecordedAudio}
          />
          
          <Button onClick={handleAddReminder} className="text-foreground w-full mt-2">
            Add Reminder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
