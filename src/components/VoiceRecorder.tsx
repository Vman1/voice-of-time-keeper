
import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VoiceRecorderProps {
  recording: boolean;
  recordedAudio: string | null;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onRecordingComplete: (audioUrl: string) => void;
}

export function VoiceRecorder({ 
  recording, 
  recordedAudio, 
  onStartRecording, 
  onStopRecording,
  onRecordingComplete 
}: VoiceRecorderProps) {
  const [mediaRecorder, setMediaRecorder] = React.useState<MediaRecorder | null>(null);

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
        onRecordingComplete(audioUrl);
        toast({
          title: "Recording saved",
          description: "Your reminder message has been recorded"
        });
      });

      recorder.start();
      setMediaRecorder(recorder);
      onStartRecording();
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
      onStopRecording();
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-foreground">Record Message</label>
      <div className="flex gap-4">
        {recording ? (
          <Button onClick={stopRecording} variant="destructive" className="text-destructive-foreground w-full">
            <Square className="mr-2 h-4 w-4" />
            Stop Recording
          </Button>
        ) : (
          <Button onClick={startRecording} className="text-foreground w-full">
            <Mic className="mr-2 h-4 w-4" />
            Record Voice
          </Button>
        )}
      </div>
      
      {recordedAudio && (
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2 text-foreground">Preview Recording</label>
          <audio controls src={recordedAudio} className="w-full rounded-md bg-secondary/20 border border-white/10" />
        </div>
      )}
    </div>
  );
}
