
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { Mic, Upload, Square, Volume2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { generateRandomAudioLevel } from "@/lib/audioAnalyzer";

interface AudioRecorderProps {
  onAudioCaptured: (audio: Blob) => void;
  isAnalyzing: boolean;
}

const AudioRecorder = ({ onAudioCaptured, isAnalyzing }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevels, setAudioLevels] = useState<number[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const visualizerTimerRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      if (visualizerTimerRef.current) {
        window.clearInterval(visualizerTimerRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);
  
  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        onAudioCaptured(audioBlob);
        
        // Stop all microphone tracks
        stream.getTracks().forEach(track => track.stop());
        
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        if (visualizerTimerRef.current) {
          window.clearInterval(visualizerTimerRef.current);
          visualizerTimerRef.current = null;
        }
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start recording timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Start audio visualizer animation
      visualizerTimerRef.current = window.setInterval(() => {
        setAudioLevels(generateRandomAudioLevel(0.8));
      }, 100);
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        onAudioCaptured(file);
      } else {
        toast.error("Please upload an audio file");
        event.target.value = '';
      }
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto">
      <div className={`audio-visualizer h-16 w-full ${isRecording ? 'recording-visualizer' : ''}`}>
        {isRecording && audioLevels.map((level, index) => (
          <div 
            key={index} 
            className="bar h-full transition-all duration-100 ease-in-out"
            style={{ 
              height: `${level * 100}%`,
              animation: `wave-${(index % 5) + 1} 1s infinite ease-in-out`
            }}
          />
        ))}
        {!isRecording && !isAnalyzing && (
          <div className="text-center text-muted-foreground">
            {audioLevels.length > 0 ? 'Audio captured' : 'No audio recorded yet'}
          </div>
        )}
        {isAnalyzing && (
          <div className="flex items-center gap-2 text-baby-purple animate-pulse">
            <Volume2 className="animate-pulse" />
            <span>Analyzing audio...</span>
          </div>
        )}
      </div>
      
      {isRecording && (
        <div className="flex flex-col items-center gap-2">
          <div className="text-baby-pink font-medium animate-pulse-gentle">
            Recording... {formatTime(recordingTime)}
          </div>
          <Button 
            variant="destructive" 
            size="lg" 
            className="rounded-full px-6"
            onClick={stopRecording}
            disabled={isAnalyzing}
          >
            <Square className="mr-2 h-4 w-4" /> Stop Recording
          </Button>
        </div>
      )}
      
      {!isRecording && (
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={startRecording}
            className="bg-baby-blue-light hover:bg-baby-blue text-foreground rounded-full px-6"
            disabled={isAnalyzing}
          >
            <Mic className="mr-2 h-4 w-4" /> Record Cry
          </Button>
          
          <div className="relative">
            <Button 
              variant="outline" 
              size="lg"
              className="bg-baby-purple-light hover:bg-baby-purple text-foreground rounded-full px-6"
              disabled={isAnalyzing}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="mr-2 h-4 w-4" /> Upload Audio
            </Button>
            <input 
              type="file"
              id="file-upload"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isAnalyzing}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
