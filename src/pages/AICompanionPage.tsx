
import { useState, useRef, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Mic, MicOff, Send, User } from "lucide-react";

const AICompanionPage = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>(() => {
    const saved = localStorage.getItem('aiCompanionMessages');
    return saved ? JSON.parse(saved) : [
      { role: 'assistant', content: 'Hello! I\'m your recovery companion. How are you feeling today?' }
    ];
  });
  
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Save messages to localStorage when they change
  useEffect(() => {
    localStorage.setItem('aiCompanionMessages', JSON.stringify(messages));
  }, [messages]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: inputText }]);
    setInputText("");
    
    // Simulate AI response (in a real app, this would call an AI API)
    setTimeout(() => {
      const responses = [
        "I'm here for you. How can I support you today?",
        "That sounds challenging. Would you like to talk more about it?",
        "I understand. Remember to be kind to yourself during recovery.",
        "Have you tried any of the meditations in the Calm section?",
        "It's important to track your symptoms regularly. Would you like me to remind you?",
        "Would you like me to suggest some entertainment options to help you feel better?",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { role: 'assistant', content: randomResponse }]);
    }, 1000);
  };
  
  const toggleRecording = () => {
    // In a real implementation, this would connect to the Web Speech API
    setIsRecording(!isRecording);
    
    if (isRecording) {
      // Simulating the end of recording with some text
      setInputText("I'm feeling a bit better today, but still a little tired.");
    }
  };
  
  return (
    <MainLayout pageTitle="AI Companion">
      <div className="space-y-6 py-4">
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat">Text Chat</TabsTrigger>
            <TabsTrigger value="voice">Voice Chat</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="space-y-4 pt-4">
            <Card className="p-4 shadow-sm h-[60vh] flex flex-col">
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-2 max-w-[80%]`}>
                      {message.role === 'assistant' && (
                        <div className="p-2 rounded-full bg-care-lightest">
                          <Bot size={16} className="text-care-dark" />
                        </div>
                      )}
                      <div 
                        className={`p-3 rounded-lg ${
                          message.role === 'user' 
                            ? 'bg-care-DEFAULT text-white' 
                            : 'bg-gray-100 text-care-text'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      {message.role === 'user' && (
                        <div className="p-2 rounded-full bg-healing-lightest">
                          <User size={16} className="text-healing-dark" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="flex gap-2 items-end">
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message here..."
                  className="resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="bg-care-DEFAULT hover:bg-care-dark"
                >
                  <Send size={16} />
                </Button>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="voice" className="space-y-4 pt-4">
            <Card className="p-6 text-center space-y-6">
              <div className="flex justify-center">
                <div 
                  className={`p-6 rounded-full ${
                    isRecording 
                      ? 'bg-healing-light animate-pulse' 
                      : 'bg-gray-100'
                  }`}
                >
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-16 w-16 rounded-full"
                    onClick={toggleRecording}
                  >
                    {isRecording ? (
                      <MicOff size={32} className="text-healing-dark" />
                    ) : (
                      <Mic size={32} className="text-care-dark" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-medium text-care-text mb-2">
                  {isRecording ? "Listening..." : "Press to speak"}
                </h2>
                <p className="text-muted-foreground">
                  {isRecording 
                    ? "I'm listening to you. Speak clearly." 
                    : "Tap the microphone and start speaking. I'm here to help."}
                </p>
              </div>
              
              {isRecording && (
                <div className="text-left bg-care-lightest p-4 rounded-lg">
                  <p className="text-sm text-care-text font-medium">Heard so far:</p>
                  <p className="text-sm text-muted-foreground italic mt-1">
                    "I'm feeling a bit better today..."
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AICompanionPage;
