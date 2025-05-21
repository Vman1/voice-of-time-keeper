
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Clock, Bell, Mic, Square } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function AlarmClock() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarmTime, setAlarmTime] = useState('');
  const [recording, setRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [alarmSet, setAlarmSet] = useState(false);
  
  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      
      // Check if alarm should go off
      if (alarmSet && alarmTime) {
        const now = new Date();
        const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        if (timeString === alarmTime) {
          triggerAlarm();
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [alarmTime, alarmSet]);
  
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
          description: "Your alarm sound has been recorded"
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
  
  const setAlarm = () => {
    if (!alarmTime) {
      toast({
        title: "No time selected",
        description: "Please select a time for your alarm",
        variant: "destructive"
      });
      return;
    }
    
    if (!recordedAudio) {
      toast({
        title: "No recording",
        description: "Please record a voice message for your alarm",
        variant: "destructive"
      });
      return;
    }
    
    setAlarmSet(true);
    toast({
      title: "Alarm set",
      description: `Your alarm is set for ${alarmTime}`
    });
  };
  
  const cancelAlarm = () => {
    setAlarmSet(false);
    toast({
      title: "Alarm canceled",
      description: "Your alarm has been canceled"
    });
  };
  
  const triggerAlarm = () => {
    if (recordedAudio) {
      const audio = new Audio(recordedAudio);
      audio.play();
      setAlarmSet(false);
    }
  };
  
  return (
    <div className="p-6 flex flex-col items-center space-y-6">
      <div className="text-5xl font-bold flex items-center gap-3 text-gradient animate-scale-in">
        <Clock className="h-10 w-10" />
        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      
      <div className="flex flex-col items-center gap-6 w-full max-w-md animate-slide-in">
        <div className="w-full">
          <label className="block text-sm font-medium mb-2">Set Alarm Time</label>
          <input 
            type="time" 
            value={alarmTime} 
            onChange={(e) => setAlarmTime(e.target.value)}
            className="w-full p-2 border bg-secondary/30 border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            disabled={alarmSet}
          />
        </div>
        
        <div className="w-full">
          <label className="block text-sm font-medium mb-2">Record Alarm Sound</label>
          <div className="flex gap-4 justify-center">
            {recording ? (
              <Button onClick={stopRecording} variant="destructive" className="hover-scale text-destructive-foreground">
                <Square className="mr-2 h-4 w-4" />
                Stop Recording
              </Button>
            ) : (
              <Button onClick={startRecording} disabled={alarmSet} className="bg-secondary border border-primary/20 hover:bg-primary/20 hover-scale text-foreground">
                <Mic className="mr-2 h-4 w-4" />
                Record Voice
              </Button>
            )}
          </div>
        </div>
        
        {recordedAudio && (
          <div className="w-full animate-fade-in">
            <label className="block text-sm font-medium mb-2">Preview Recording</label>
            <audio controls src={recordedAudio} className="w-full bg-secondary/40 rounded-md" />
          </div>
        )}
        
        <div className="w-full flex gap-4">
          {alarmSet ? (
            <Button onClick={cancelAlarm} variant="destructive" className="w-full hover-scale text-destructive-foreground">
              Cancel Alarm
            </Button>
          ) : (
            <Button onClick={setAlarm} className="w-full bg-secondary border border-primary/20 hover:bg-primary/20 hover-scale text-foreground">
              <Bell className="mr-2 h-4 w-4" />
              Set Alarm
            </Button>
          )}
        </div>
        
        {alarmSet && (
          <div className="bg-secondary/40 p-4 rounded-lg w-full text-center animate-fade-in border border-primary/20">
            Alarm set for {alarmTime}
          </div>
        )}
      </div>
    </div>
  );
}
