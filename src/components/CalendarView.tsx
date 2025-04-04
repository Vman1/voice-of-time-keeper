
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];
      
      recorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
      });
      
      recorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
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
    return reminders.filter(reminder => 
      format(reminder.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };
  
  const playReminder = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play();
  };
  
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Calendar</h2>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Reminder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Voice Reminder</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <div className="border rounded-md p-1">
                      <Calendar 
                        mode="single" 
                        selected={date} 
                        onSelect={setDate} 
                        className="pointer-events-auto"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Time</label>
                    <input 
                      type="time" 
                      value={time} 
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Note (optional)</label>
                    <input 
                      type="text" 
                      value={note} 
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Add a note"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Record Message</label>
                    <div className="flex gap-4">
                      {recording ? (
                        <Button onClick={stopRecording} variant="destructive">
                          <Square className="mr-2 h-4 w-4" />
                          Stop Recording
                        </Button>
                      ) : (
                        <Button onClick={startRecording}>
                          <Mic className="mr-2 h-4 w-4" />
                          Record Voice
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {recordedAudio && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Preview Recording</label>
                      <audio controls src={recordedAudio} className="w-full" />
                    </div>
                  )}
                  
                  <Button onClick={addReminder}>
                    Add Reminder
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <Calendar 
            mode="single" 
            selected={date} 
            onSelect={setDate} 
            className="rounded-md border pointer-events-auto"
          />
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5" />
            {date ? format(date, 'PPP') : 'Select a date'}
          </h2>
          
          <div className="space-y-4">
            {getTodaysReminders().length > 0 ? (
              getTodaysReminders().map((reminder, index) => (
                <div key={index} className="border rounded-md p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{reminder.time}</p>
                      {reminder.note && <p className="text-sm text-gray-600">{reminder.note}</p>}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => playReminder(reminder.audioUrl)}>
                      Play
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No reminders for this date</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
