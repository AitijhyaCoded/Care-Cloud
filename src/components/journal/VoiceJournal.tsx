import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface VoiceJournalProps {
  onSaveEntry?: (text: string) => void;
}

const LANGUAGES = [
  { label: "English", code: "en-US" },
  { label: "Hindi", code: "hi-IN" },
  { label: "Bengali", code: "bn-IN" },
  { label: "German", code: "de-DE" },
  { label: "French", code: "fr-FR" },
];

export function VoiceJournal({ onSaveEntry }: VoiceJournalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef("");

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = selectedLanguage;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript.trim();
        if (event.results[i].isFinal) {
          finalTranscriptRef.current +=
            (finalTranscriptRef.current ? " " : "") + transcript + ".";
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
  }, [selectedLanguage]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      finalTranscriptRef.current = "";
      setDisplayText("");
      recognitionRef.current!.lang = selectedLanguage;
      recognitionRef.current.start();
    }

    setIsRecording((prev) => !prev);
  };

  const handleSubmit = async () => {
    const text = displayText.trim();
    if (!text) return;

    const languageLabel =
      LANGUAGES.find((lang) => lang.code === selectedLanguage)?.label || "Unknown";

    const { error } = await supabase.from("journal_entries").insert([
      {
        content: text,
        language: languageLabel,
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

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-care-text">Voice Journal</h3>
        <Button
          onClick={toggleRecording}
          variant="outline"
          size="icon"
          className={`rounded-full ${
            isRecording ? "bg-red-200 text-red-600 animate-pulse" : ""
          }`}
        >
          {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
        </Button>
      </div>

      <div className="mb-3">
        <label className="text-sm font-medium text-gray-700">Select Language:</label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {isRecording && (
        <div className="py-2 px-3 text-sm text-gray-600 bg-orange-50 rounded mb-3 animate-pulse-soft">
          Listening in <strong>{LANGUAGES.find(l => l.code === selectedLanguage)?.label}</strong>...
        </div>
      )}

      <Textarea
        placeholder="Speak your thoughts..."
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
