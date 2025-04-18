
import { useState, useRef, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Mic, MicOff, Send, User } from "lucide-react";
import { generateTextResponse, transcribeAudio } from "@/utils/geminiApi";
import { useToast } from "@/hooks/use-toast";

const AICompanionPage = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>(() => {
    const saved = localStorage.getItem('aiCompanionMessages');
    return saved ? JSON.parse(saved) : [
      { role: 'assistant', content: 'Hello! I\'m your recovery companion. How are you feeling today?' }
    ];
  });
  
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcription, setTranscription] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  // const [transcription, setTranscription] = useState("");
  const [botResponse, setBotResponse] = useState("");
  // const [isRecording, setIsRecording] = useState(false);

  
  // Save messages to localStorage when they change
  useEffect(() => {
    localStorage.setItem('aiCompanionMessages', JSON.stringify(messages));
  }, [messages]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    // Add user message
    const userMessage = { role: 'user' as const, content: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    
    try {
      // Get all messages including the new user message
      const updatedMessages = [...messages, userMessage];
      
      // Generate AI response
      const aiResponse = await generateTextResponse(updatedMessages);
      
      // Add AI response to messages
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVoiceSubmit = async () => {
    if (!transcription) return;
    
    setInputText(transcription);
    const userMessage = { role: 'user' as const, content: transcription };
    setMessages(prev => [...prev, userMessage]);
    setTranscription("");
    setIsLoading(true);
    
    try {
      // Get all messages including the new user message
      const updatedMessages = [...messages, userMessage];
      
      // Generate AI response
      const aiResponse = await generateTextResponse(updatedMessages);
      
      // Add AI response to messages
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error("Error sending voice message:", error);
      toast({
        title: "Error",
        description: "Failed to get a response for your voice message.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // const toggleRecording = async () => {
  //   if (!isRecording) {
  //     // Start recording
  //     setIsRecording(true);
  //     setTranscription("");
      
  //     try {
  //       // Request microphone access
  //       await navigator.mediaDevices.getUserMedia({ audio: true });
        
  //       toast({
  //         title: "Recording started",
  //         description: "Speak clearly into your microphone.",
  //       });
        
  //       // In a real implementation, we would start recording here
  //       // For now, we'll simulate recording with a timeout
  //       setTimeout(async () => {
  //         // Simulate recording for 3 seconds
  //         toast({
  //           title: "Processing speech",
  //           description: "Converting your speech to text...",
  //         });
          
  //         // After 3 seconds, stop recording
  //         setTimeout(async () => {
  //           setIsRecording(false);
  //           // Simulate transcription
  //           try {
  //             const mockAudioBlob = new Blob([], { type: 'audio/webm' });
  //             const transcribedText = await transcribeAudio(mockAudioBlob);
  //             setTranscription(transcribedText);
  //           } catch (error) {
  //             console.error("Error transcribing audio:", error);
  //             toast({
  //               title: "Transcription Error",
  //               description: "Could not transcribe your speech. Please try again.",
  //               variant: "destructive",
  //             });
  //             setIsRecording(false);
  //           }
  //         }, 3000);
  //       }, 2000);
        
  //     } catch (error) {
  //       console.error("Error accessing microphone:", error);
  //       setIsRecording(false);
  //       toast({
  //         title: "Microphone Error",
  //         description: "Could not access your microphone. Please check permissions.",
  //         variant: "destructive",
  //       });
  //     }
  //   } else {
  //     // Stop recording
  //     setIsRecording(false);
  //     toast({
  //       title: "Recording stopped",
  //       description: "Processing your speech...",
  //     });
  //   }
  // };

  const toggleRecording = async () => {
    if (!isRecording) {
        setIsRecording(true);
        setTranscription(""); // Clear previous transcription

        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });

            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = "en-US";
            recognition.interimResults = true;
            recognition.maxAlternatives = 1;

            let finalTranscript = ""; // Store final transcript

            recognition.onresult = (event) => {
                const lastResult = event.results[event.resultIndex];
                const transcript = lastResult[0].transcript;

                // Update transcription state (interim or final)
                setTranscription(transcript);

                // If it's the final result
                if (lastResult.isFinal) {
                    finalTranscript = transcript;
                }
            };

            recognition.onstart = () => {
                toast({
                    title: "Listening...",
                    description: "I'm listening to you. Speak clearly!",
                });
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error:", event);
                toast({
                    title: "Error",
                    description: "There was an error with speech recognition. Please try again.",
                    variant: "destructive",
                });
            };

            recognition.onend = async () => {
                setIsRecording(false);
                toast({
                    title: "Recording stopped",
                    description: "Processing your speech...",
                });

                if (finalTranscript.trim() !== "") {
                    // Send transcript to Gemini
                    try {
                        const response = await generateTextResponse([
                            { role: "user", content: finalTranscript }
                        ]);
                        // Set the response to UI
                        setBotResponse(response); // 👈 You'll need this state
                    } catch (err) {
                        toast({
                            title: "Error",
                            description: "Failed to get response from Gemini.",
                            variant: "destructive",
                        });
                    }
                }
            };

            recognition.start();
        } catch (error) {
            console.error("Error accessing microphone:", error);
            setIsRecording(false);
            toast({
                title: "Microphone Error",
                description: "Could not access your microphone. Please check permissions.",
                variant: "destructive",
            });
        }
    } else {
        setIsRecording(false);
        toast({
            title: "Recording stopped",
            description: "Processing your speech...",
        });
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
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-2 max-w-[80%]">
                      <div className="p-2 rounded-full bg-care-lightest">
                        <Bot size={16} className="text-care-dark" />
                      </div>
                      <div className="p-3 rounded-lg bg-gray-100 text-care-text">
                        <p className="text-sm">Thinking...</p>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="flex gap-2 items-end">
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message here..."
                  className="resize-none"
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className="bg-care-DEFAULT hover:bg-care-dark"
                >
                  <Send size={16} />
                </Button>
              </div>
            </Card>
          </TabsContent>
          
          {/* <TabsContent value="voice" className="space-y-4 pt-4">
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
                    disabled={isLoading}
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
              
              {(isRecording || transcription) && (
                <div className="text-left bg-care-lightest p-4 rounded-lg">
                  <p className="text-sm text-care-text font-medium">Heard so far:</p>
                  <p className="text-sm text-muted-foreground italic mt-1">
                    {transcription || "\"Speaking...\""}
                  </p>
                </div>
              )}
              
              {transcription && (
                <div className="flex justify-center">
                  <Button 
                    onClick={handleVoiceSubmit}
                    className="bg-care-DEFAULT hover:bg-care-dark"
                    disabled={isLoading}
                  >
                    <Send size={16} className="mr-2" />
                    Send Voice Message
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent> */}

<TabsContent value="voice" className="space-y-4 pt-4">
            <Card className="p-4 shadow-sm min-h-[30vh] flex flex-col justify-between">
              <div className="space-y-4 mb-4">
                {transcription && (
                  <div className="bg-gray-100 p-3 rounded-lg text-care-text">
                    <p className="text-sm italic">🗣️ You said: {transcription}</p>
                  </div>
                )}
                {botResponse && (
                  <div className="bg-care-lightest p-3 rounded-lg text-care-dark">
                    <p className="text-sm"><Bot className="inline mr-2" size={14} />{botResponse}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={toggleRecording} 
                  variant={isRecording ? "destructive" : "secondary"}
                >
                  {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                  <span className="ml-2">{isRecording ? "Stop" : "Start"} Listening</span>
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AICompanionPage;