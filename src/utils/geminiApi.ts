
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Initialize the Gemini API
const API_KEY = "AIzaSyBOVifXaYYsv78ZUcoFEZ0_9SvfycvMd8s";
const genAI = new GoogleGenerativeAI(API_KEY);

// Set up the model configuration
const modelConfig = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
};

// Text chat function
export const generateTextResponse = async (messages: {role: 'user' | 'assistant', content: string}[]) => {
  try {
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Format the conversation history for Gemini API
    const chatHistory = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));
    
    // Get the latest user message
    const lastMessage = messages[messages.length - 1];
    
    // Start a chat session with history
    const chat = model.startChat({
      generationConfig: modelConfig,
      history: chatHistory,
    });
    
    // Send the latest message and get the response
    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Error generating text response:", error);
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    }
    return "I'm having trouble connecting to the AI service. Please check your internet connection and try again.";
  }
};

// Voice transcription function - simulate real transcription
export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  // This is a simulated function since we're not actually recording audio
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("How are you feeling today?");
    }, 1500);
  });
};

// Generate health report with Gemini
export const generateHealthReport = async (symptoms: any): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Format the symptoms data into a prompt
    const prompt = `
      Generate a comprehensive health report based on the following symptoms:
      ${JSON.stringify(symptoms, null, 2)}
      
      Format the report in a professional, accessible manner with the following sections:
      1. Symptom Summary
      2. Possible Interpretations
      3. Recommended Actions
      4. Self-Care Suggestions
      5. When to Seek Professional Help
      
      Make the report easy to understand and maintain a supportive, encouraging tone.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Error generating health report:", error);
    if (error instanceof Error) {
      return `Error generating report: ${error.message}`;
    }
    return "I'm having trouble generating your health report right now. Please try again later.";
  }
};

// Export a function to generate PDF report
export const generatePDFReport = async (symptoms: any): Promise<Blob> => {
  try {
    // Get the health report text
    const reportText = await generateHealthReport(symptoms);
    
    // Mock PDF generation (in a real app, you'd use a PDF library)
    const pdfBlob = new Blob([reportText], { type: 'text/plain' });
    return pdfBlob;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF report");
  }
};