import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Calendar as CalendarIcon, Mic, Square, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
interface Reminder {
  date: Date;
  time: string;
  audioUrl: string;
  note: string;
}
export function CalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [recording, setRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];
      recorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
      });
      recorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, {
          type: 'audio/mp3'
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        toast({
          title: "Recording saved",
          description: "Your reminder message has been recorded"
        });
      });
      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast({
        title: "Recording failed",
        description: "Could not access your microphone",
        variant: "destructive"
      });
    }
  };
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };
  const addReminder = () => {
    if (!date) {
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
      date: date,
      time: time,
      audioUrl: recordedAudio,
      note: note
    };
    setReminders([...reminders, newReminder]);
    setDialogOpen(false);
    setNote('');
    setTime('');
    setRecordedAudio(null);
    toast({
      title: "Reminder added",
      description: `Your reminder is set for ${format(date, 'PPP')} at ${time}`
    });
  };
  const getTodaysReminders = () => {
    if (!date) return [];
    return reminders.filter(reminder => format(reminder.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
  };
  const playReminder = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play();
  };
  return <div className="p-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-4 rounded-lg">
          <div className="flex justify-center items-center mb-6">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                      <Calendar mode="single" selected={date} onSelect={setDate} className="bg-transparent w-full" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Time</label>
                    <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full p-2 bg-secondary/30 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Note (optional)</label>
                    <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note" className="w-full p-2 bg-secondary/30 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Record Message</label>
                    <div className="flex gap-4">
                      {recording ? <Button onClick={stopRecording} variant="destructive" className="text-destructive-foreground w-full">
                          <Square className="mr-2 h-4 w-4" />
                          Stop Recording
                        </Button> : <Button onClick={startRecording} className="text-foreground w-full">
                          <Mic className="mr-2 h-4 w-4" />
                          Record Voice
                        </Button>}
                    </div>
                  </div>
                  
                  {recordedAudio && <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Preview Recording</label>
                      <audio controls src={recordedAudio} className="w-full rounded-md bg-secondary/20 border border-white/10" />
                    </div>}
                  
                  <Button onClick={addReminder} className="text-foreground w-full mt-2">
                    Add Reminder
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="bg-secondary/20 backdrop-blur-sm rounded-lg p-1">
            <Calendar mode="single" selected={date} onSelect={setDate} className="w-full" />
          </div>
        </div>
        
        <div className="glass-card rounded-lg p-4">
          <h2 className="text-xl font-display font-bold mb-6 flex items-center text-foreground">
            <CalendarIcon className="mr-2 h-5 w-5" />
            {date ? format(date, 'MMMM d, yyyy') : 'Select a date'}
          </h2>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
            {getTodaysReminders().length > 0 ? getTodaysReminders().map((reminder, index) => <div key={index} className="border border-white/20 rounded-md p-4 bg-secondary/30 backdrop-blur-sm hover:bg-secondary/40 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-foreground">{reminder.time}</p>
                      {reminder.note && <p className="text-sm text-muted-foreground">{reminder.note}</p>}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => playReminder(reminder.audioUrl)} className="text-foreground">
                      Play
                    </Button>
                  </div>
                </div>) : <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground text-center font-body mb-2">No reminders for this date</p>
                <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)} className="text-foreground">
                  <Plus className="mr-2 h-4 w-4" />
                  Add One
                </Button>
              </div>}
          </div>
        </div>
      </div>
    </div>;
}
