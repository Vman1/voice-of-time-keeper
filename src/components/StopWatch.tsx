
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Clock, Play, Pause, Timer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function StopWatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [targetTime, setTargetTime] = useState(60); // Default 60 seconds
  const [useCustomSound, setUseCustomSound] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const intervalRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Format time in MM:SS.ms format
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    const milliseconds = Math.floor((time % 1) * 100).toString().padStart(2, '0');
    return `${minutes}:${seconds}.${milliseconds}`;
  };

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio();
    
    return () => {
      // Clean up timer on component unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Stop any ongoing recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // Check if target time is reached
  useEffect(() => {
    if (isRunning && elapsedTime >= targetTime) {
      stopTimer();
      playAlarmSound();
      toast({
        title: "Time's up!",
        description: `Your ${targetTime} second timer has finished.`,
      });
    }
  }, [elapsedTime, isRunning, targetTime]);

  const startTimer = () => {
    if (!isRunning) {
      const startTime = Date.now() - elapsedTime * 1000;
      intervalRef.current = window.setInterval(() => {
        setElapsedTime((Date.now() - startTime) / 1000);
      }, 10); // Update every 10ms for smoother display
      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  };

  const stopTimer = () => {
    pauseTimer();
    setElapsedTime(0);
  };

  const resetTimer = () => {
    stopTimer();
    setElapsedTime(0);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
        audioChunksRef.current.push(event.data);
      });
      
      mediaRecorderRef.current.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        setAudioBlob(audioBlob);
        
        // Clean up stream tracks
        stream.getTracks().forEach(track => track.stop());
        
        toast({
          title: "Recording completed",
          description: "Your custom alarm sound has been saved",
        });
      });
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak now to create your custom alarm sound",
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Error",
        description: "Could not access your microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playAlarmSound = () => {
    if (useCustomSound && audioBlob) {
      // Play custom recorded sound
      const audioUrl = URL.createObjectURL(audioBlob);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    } else {
      // Play default alarm sound
      if (audioRef.current) {
        audioRef.current.src = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';
        audioRef.current.play();
      }
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col items-center space-y-8">
        <div className="text-5xl font-mono tracking-wider text-primary font-bold animate-scale-in">
          {formatTime(elapsedTime)}
        </div>
        
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Target time: {targetTime} seconds</span>
          </div>
          <Slider
            value={[targetTime]}
            min={5}
            max={300}
            step={5}
            onValueChange={(value) => setTargetTime(value[0])}
            disabled={isRunning}
            className="my-4"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={isRunning ? pauseTimer : startTimer}
            className="w-full flex items-center gap-2 hover-scale"
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={resetTimer}
            className="w-full flex items-center gap-2 hover-scale"
          >
            <Timer className="h-4 w-4" />
            Reset
          </Button>
        </div>
        
        <div className="mt-8 p-4 border border-border rounded-lg w-full max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Custom Alarm Sound</h3>
            <div className="flex items-center space-x-2">
              <Switch
                id="custom-sound"
                checked={useCustomSound}
                onCheckedChange={setUseCustomSound}
              />
              <label htmlFor="custom-sound" className="text-sm">
                {useCustomSound ? 'Using custom sound' : 'Using default sound'}
              </label>
            </div>
          </div>
          
          {useCustomSound && (
            <div className="space-y-4">
              <div className="flex justify-center">
                {!isRecording ? (
                  <Button 
                    onClick={startRecording} 
                    variant="secondary"
                    disabled={audioBlob !== null}
                    className="w-full"
                  >
                    Record Custom Sound
                  </Button>
                ) : (
                  <Button 
                    onClick={stopRecording} 
                    variant="destructive"
                    className="w-full animate-pulse"
                  >
                    Stop Recording
                  </Button>
                )}
              </div>
              
              {audioBlob && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-center">
                    <Button 
                      onClick={() => {
                        if (audioRef.current && audioBlob) {
                          const url = URL.createObjectURL(audioBlob);
                          audioRef.current.src = url;
                          audioRef.current.play();
                        }
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Test Sound
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={() => {
                      setAudioBlob(null);
                    }}
                    variant="ghost"
                    className="w-full text-sm"
                  >
                    Delete Recording
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
