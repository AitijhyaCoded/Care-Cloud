
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API
const API_KEY = "AIzaSyBOVifXaYYsv78ZUcoFEZ0_9SvfycvMd8s";
const genAI = new GoogleGenerativeAI(API_KEY);

// Text chat function with fixed role order
export const generateTextResponse = async (messages: {role: 'user' | 'assistant', content: string}[]) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Ensure the conversation has at least one user message
    if (messages.length === 0 || messages.every(msg => msg.role !== 'user')) {
      throw new Error("Conversation must include at least one user message");
    }
    
    // Get the last user message for sending to Gemini
    const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
    
    if (!lastUserMessage) {
      throw new Error("No user message found");
    }
    
    // Format conversation for Gemini
    const chat = model.startChat();
    const result = await chat.sendMessage(lastUserMessage.content);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Error generating text response:", error);
    throw error;
  }
};

// Simulate transcribing audio to text (since we don't have actual transcription API yet)
export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  // For now, we'll return mock text to simulate transcription
  // In a real implementation, you would send the audioBlob to a speech-to-text API
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Return a random sample response based on simulated context
      const sampleResponses = [
        "How am I feeling today?",
        "What's a good way to manage my pain?",
        "I'm having trouble sleeping. Do you have any suggestions?",
        "Can you recommend some relaxation techniques?",
        "I'm feeling much better today."
      ];
      const randomIndex = Math.floor(Math.random() * sampleResponses.length);
      resolve(sampleResponses[randomIndex]);
    }, 1000);
  });
};

// Generate PDF report with enhanced formatting
export const generatePDFReport = async (data: any): Promise<Blob> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
      Create a detailed health report based on the following data:
      ${JSON.stringify(data, null, 2)}
      
      Format the report professionally with these sections:
      1. Executive Summary
      2. Symptom Analysis
      3. Hydration Status
      4. Medication Schedule
      5. Recommendations
      6. Next Steps
      
      Make the report easy to understand and maintain a supportive tone.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Convert text to PDF format using a basic HTML structure
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Health Report</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 40px; }
          h1 { color: #2563eb; }
          h2 { color: #4b5563; margin-top: 20px; }
          p { margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <h1>Health Recovery Report</h1>
        <hr/>
        ${text.split('\n').map(line => 
          line.startsWith('#') ? 
            `<h2>${line.replace('#', '').trim()}</h2>` : 
            `<p>${line}</p>`
        ).join('')}
      </body>
      </html>
    `;
    
    // Create PDF blob
    const blob = new Blob([htmlContent], { type: 'application/pdf' });
    return blob;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};