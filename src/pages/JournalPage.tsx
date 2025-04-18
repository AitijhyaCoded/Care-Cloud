
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { VoiceJournal } from "@/components/journal/VoiceJournal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Bookmark, MessageSquareText } from "lucide-react";

interface JournalEntry {
  id: string;
  date: string;
  preview: string;
  content: string;
}

const JournalPage = () => {
  // Sample journal prompts
  const journalPrompts = [
    "What made you smile today, even briefly?",
    "What's one small thing you're looking forward to?",
    "What's something you're grateful for right now?",
    "If you could do anything today (despite being sick), what would it be?",
    "What's a memory that brings you comfort?",
  ];
  
  const [currentPrompt, setCurrentPrompt] = useState("");
  
  // State for journal entries with localStorage persistence
  const [pastEntries, setPastEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('journalEntries');
    return saved ? JSON.parse(saved) : [
      { id: "1", date: "Yesterday", preview: "Started feeling a bit better today. My temperature...", content: "Started feeling a bit better today. My temperature is coming down and I managed to eat a full meal." },
      { id: "2", date: "2 days ago", preview: "The headache is still there but not as intense as...", content: "The headache is still there but not as intense as yesterday. I'm trying to stay hydrated." },
      { id: "3", date: "3 days ago", preview: "I feel exhausted today. Had trouble sleeping last...", content: "I feel exhausted today. Had trouble sleeping last night due to the cough. Taking my medications regularly." },
    ];
  });
  
  // Save entries to localStorage when they change
  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(pastEntries));
  }, [pastEntries]);
  
  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * journalPrompts.length);
    setCurrentPrompt(journalPrompts[randomIndex]);
  };
  
  const saveJournalEntry = (text: string) => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: "Today",
      preview: text.length > 100 ? text.substring(0, 97) + "..." : text,
      content: text
    };
    
    // Update past entries
    const updatedEntries = [newEntry, ...pastEntries];
    setPastEntries(updatedEntries);
  };

  return (
    <MainLayout pageTitle="Voice Journal">
      <div className="space-y-6 py-4">
        <div className="space-y-2">
          <p className="text-muted-foreground">
            Record your thoughts and feelings to track your emotional recovery.
          </p>
          
          <Card className="p-4 bg-comfort-lightest border-comfort-light">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="font-medium text-care-text">Need inspiration?</h3>
                {currentPrompt ? (
                  <p className="text-sm text-care-text">{currentPrompt}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Tap the button for a journal prompt.
                  </p>
                )}
              </div>
              <Button 
                onClick={getRandomPrompt}
                variant="ghost" 
                size="sm" 
                className="text-comfort-dark hover:text-comfort-dark hover:bg-comfort-lightest"
              >
                <MessageSquareText className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
        
        <VoiceJournal onSaveEntry={saveJournalEntry} />
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-care-text">
              Previous Entries
            </h2>
            <Button variant="outline" size="sm" className="text-care-dark">
              <Calendar className="mr-2 h-4 w-4" />
              View All
            </Button>
          </div>
          
          {pastEntries.map((entry) => (
            <Card key={entry.id} className="p-4 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-care-text">{entry.date}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {entry.content}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-care-dark hover:text-care-dark hover:bg-care-lightest"
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default JournalPage;
