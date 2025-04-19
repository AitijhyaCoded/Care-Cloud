import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client"; // add at the top if not there

interface VoiceJournalProps {
  onSaveEntry?: (text: string) => void;
}

export function VoiceJournal({ onSaveEntry }: VoiceJournalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [displayText, setDisplayText] = useState(""); // Final + interim display
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef(""); // True accumulated transcript
  

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript.trim();

        if (event.results[i].isFinal) {
          finalTranscriptRef.current +=
            (finalTranscriptRef.current ? " " : "") + capitalize(transcript) + ".";
        } else {
          interimTranscript += transcript + " ";
        }
      }

      const cleanInterim = interimTranscript.trim();
      setDisplayText((finalTranscriptRef.current + " " + cleanInterim).trim());
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      finalTranscriptRef.current = ""; // Reset when starting fresh
      setDisplayText("");
      recognitionRef.current.start();
    }

    setIsRecording((prev) => !prev);
  };

  const handleSubmit = async () => {
    const text = displayText.trim();
    if (!text) return;
  
    // const language = "en";  or set dynamically if you support others
    const language = navigator.language || "en";

  
    const { error } = await supabase.from("journal_entries").insert([
      {
        content: text,
        language: language,
      },
    ]);
  
    if (error) {
      console.error("Error saving journal entry:", error.message);
      alert("Failed to save entry.");
    } else {
      alert("Entry saved successfully!");
      finalTranscriptRef.current = "";
      setDisplayText("");
    }
  
    if (onSaveEntry) {
      onSaveEntry(text);
    }
  };

  const capitalize = (s: string) =>
    s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-care-text">Voice Journal</h3>
        <Button
          onClick={toggleRecording}
          variant="outline"
          size="icon"
          className={`rounded-full ${isRecording ? "bg-red-200 text-red-600 animate-pulse" : ""}`}
        >
          {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
        </Button>
      </div>

      {isRecording && (
        <div className="py-2 px-3 text-sm text-gray-600 bg-orange-50 rounded mb-3 animate-pulse-soft">
          Listening... speak naturally.
        </div>
      )}

      <Textarea
        placeholder="How are you feeling today?"
        value={displayText}
        onChange={(e) => {
          finalTranscriptRef.current = e.target.value;
          setDisplayText(e.target.value);
        }}
        className="min-h-[120px] resize-none mb-3"
      />

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={!displayText.trim()}>
          <Send size={16} className="mr-2" />
          Save Entry
        </Button>
      </div>
    </Card>
  );
}
