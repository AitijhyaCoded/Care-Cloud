import { GoogleGenerativeAI } from "@google/generative-ai";
import html2pdf from 'html2pdf.js'; // Import the html2pdf library

// Initialize the Gemini API
const API_KEY = "AIzaSyBOVifXaYYsv78ZUcoFEZ0_9SvfycvMd8s";
const genAI = new GoogleGenerativeAI(API_KEY);

// // Text chat function with fixed role order (no changes needed here)
// export const generateTextResponse = async (messages: { role: 'user' | 'assistant', content: string }[]) => {
//     try {
//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//         // Ensure the conversation has at least one user message
//         if (messages.length === 0 || messages.every(msg => msg.role !== 'user')) {
//             throw new Error("Conversation must include at least one user message");
//         }

//         // Get the last user message for sending to Gemini
//         const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');

//         if (!lastUserMessage) {
//             throw new Error("No user message found");
//         }

//         // Format conversation for Gemini
//         const chat = model.startChat();
//         const result = await chat.sendMessage(lastUserMessage.content);
//         const response = await result.response;
//         const text = response.text();

//         return text;
//     } catch (error) {
//         console.error("Error generating text response:", error);
//         throw error;
//     }
// };

// Text chat function with fixed role order and tone customization
export const generateTextResponse = async (messages: { role: 'user' | 'assistant', content: string }[]) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Ensure the conversation has at least one user message
        if (messages.length === 0 || messages.every(msg => msg.role !== 'user')) {
            throw new Error("Conversation must include at least one user message");
        }

        // Get the last user message
        const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');

        if (!lastUserMessage) {
            throw new Error("No user message found");
        }

        // System prompt to set tone
        const systemInstruction = `
You are a warm, empathetic, and friendly AI companion. Your responses should always sound supportive, kind, encouraging, and human — like a thoughtful friend who listens and cares deeply. Avoid robotic, clinical, or overly formal tones. Make the person feel heard and supported.
`;

        // Combine system prompt with the user's message
        const userPrompt = `${systemInstruction}\n\nUser: ${lastUserMessage.content}`;

        // Send to Gemini
        const chat = model.startChat();
        const result = await chat.sendMessage(userPrompt);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error("Error generating text response:", error);
        throw error;
    }
};


// Simulate transcribing audio to text (no changes needed here)
export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    return new Promise((resolve) => {
        setTimeout(() => {
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

// Generate PDF report with html2pdf
export const generatePDFReport = async (data: any): Promise<Blob> => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
      const prompt = `
        Create a professional medical report in structured format using the following patient data:
        ${JSON.stringify(data, null, 2)}
  
        Include:
        - Executive Summary
        - Symptom Analysis
        - Hydration Status
        - Medication Schedule
        - Recommendations
        - Next Steps
      `;
  
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
  
      // Define HTML with styling and structure
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Medical Health Report</title>
          <style>
            body {
              font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
              padding: 40px;
              color: #1e293b;
              background: #f8fafc;
            }
            h1, h2 {
              color: #1d4ed8;
              border-bottom: 2px solid #93c5fd;
              padding-bottom: 4px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }
            th, td {
              border: 1px solid #cbd5e1;
              padding: 10px;
              text-align: left;
            }
            th {
              background-color: #e0f2fe;
              color: #0f172a;
            }
            section {
              margin-bottom: 40px;
            }
            .footer {
              margin-top: 60px;
              font-size: 0.9em;
              color: #64748b;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <h1>Health Recovery Report</h1>
          <p><strong>Generated On:</strong> ${new Date().toLocaleString()}</p>
  
          <section>
            <h2>Executive Summary</h2>
            <p>This report outlines the patient's current health condition, self-medication actions, and hydration & symptom tracking data. The goal is to assist healthcare providers in reviewing patient-driven care outcomes.</p>
          </section>
  
          <section>
            <h2>Symptom Analysis</h2>
            <table>
              <thead>
                <tr><th>Symptom</th><th>Severity (0–10)</th></tr>
              </thead>
              <tbody>
                ${Object.entries(data.symptoms).map(([symptom, severity]) => `
                  <tr>
                    <td>${symptom}</td>
                    <td>${severity}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </section>
  
          <section>
            <h2>Hydration Status</h2>
            <table>
              <thead>
                <tr><th>Current Intake (ml)</th><th>Target Intake (ml)</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>${data.hydration.current}</td>
                  <td>${data.hydration.target}</td>
                </tr>
              </tbody>
            </table>
          </section>
  
          <section>
            <h2>Medication Schedule</h2>
            <table>
              <thead>
                <tr><th>Medicine</th><th>Dosage</th><th>Frequency</th></tr>
              </thead>
              <tbody>
                ${data.medications.map((med: any) => `
                  <tr>
                    <td>${med.name}</td>
                    <td>${med.dosage}</td>
                    <td>${med.frequency}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </section>
  
          <section>
            <h2>AI Recommendations</h2>
            ${text.split('\n').map(line => `<p>${line}</p>`).join('')}
          </section>
  
          <section>
            <h2>Next Steps</h2>
            <p>Please review this document with a certified medical professional. Follow up with any abnormal symptoms or inconsistencies in hydration or medication effectiveness.</p>
          </section>
  
          <div class="footer">
            <p>Note: This report was generated using AI and is not a substitute for professional medical advice.</p>
          </div>
        </body>
        </html>
      `;
  
      // Generate PDF
      const options = {
        margin: 10,
        filename: 'health_report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };
  
      return new Promise((resolve, reject) => {
        html2pdf()
          .from(htmlContent)
          .set(options)
          .outputPdf('blob')
          .then(resolve)
          .catch(reject);
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  };
  