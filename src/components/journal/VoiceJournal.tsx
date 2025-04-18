
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, Send } from "lucide-react";

interface VoiceJournalProps {
  onSaveEntry?: (text: string) => void;
}

export function VoiceJournal({ onSaveEntry }: VoiceJournalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [journalText, setJournalText] = useState("");
  
  const toggleRecording = () => {
    // In a real implementation, this would connect to the Web Speech API
    setIsRecording(!isRecording);
    
    if (isRecording) {
      // Simulating the end of recording with some text
      setJournalText(prev => 
        prev + (prev ? ' ' : '') + 
        "Today I'm feeling a bit better than yesterday. My temperature is down and I had a good breakfast."
      );
    }
  };
  
  const handleSubmit = () => {
    // In a real implementation, this would save to the database
    if (onSaveEntry) {
      onSaveEntry(journalText);
    }
    setJournalText("");
  };
  
  return (
    <Card className="p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-care-text">Voice Journal</h3>
        <Button 
          onClick={toggleRecording}
          variant="outline" 
          size="icon" 
          className={`rounded-full ${isRecording ? 'bg-healing-light text-healing-dark animate-pulse' : ''}`}
        >
          {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
        </Button>
      </div>
      
      {isRecording && (
        <div className="py-3 px-4 bg-healing-lightest rounded-lg mb-4 animate-pulse-soft">
          <p className="text-sm text-care-text">Listening... speak your thoughts</p>
        </div>
      )}
      
      <Textarea
        placeholder="How are you feeling today? Tap the microphone or type here..."
        value={journalText}
        onChange={(e) => setJournalText(e.target.value)}
        className="min-h-[120px] resize-none mb-3"
      />
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit}
          disabled={!journalText.trim()}
          className="bg-care-DEFAULT hover:bg-care-dark"
        >
          <Send size={16} className="mr-2" />
          Save Entry
        </Button>
      </div>
    </Card>
  );
}
