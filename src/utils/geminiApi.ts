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
// export const generatePDFReport = async (data: any): Promise<Blob> => {
//     try {
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
//       const prompt = `
//         Create a professional medical report in structured format using the following patient data:
//         ${JSON.stringify(data, null, 2)}
  
//         Include:
//         - Executive Summary
//         - Symptom Analysis
//         - Hydration Status
//         - Medication Schedule
//         - Recommendations
//         - Next Steps
//         Use clear and concise language, and ensure the report is easy to read and understand. 
//         Give enough spacing after each section and use proper headings.
//         Avoid using any unnecessary jargon or complex terms. use colorful headings and tables.
//         Make sure to include a disclaimer at the end of the report stating that this is an AI-generated document and should not be used as a substitute for professional medical advice.
//         Don't use * or any other special characters in the report. Use proper saccing not dashes. Bold the headings and use a sans-serif font for the text.
//         Use a light background color and dark text for better readability. Don't use ** or any other special characters in the report. Use proper saccing not dashes. Bold the headings and use a sans-serif font for the text.
//         In the Recommendations part of the report, provide a list of suggestions based on the patient's symptoms and hydration status. Include at least 3 recommendations. Don't just repeat the symptoms or hydration status in the recommendations.
//         Don't repeat the same information in different sections. Make sure each section is unique and provides new information.
//         Use a professional tone and avoid using any slang or informal language. Make sure the report is suitable for a medical professional to review.
//       `;
  
//       const result = await model.generateContent(prompt);
//       const response = await result.response;
//       const text = response.text();
  
//       // Define HTML with styling and structure
//       const htmlContent = `
//         <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Medical Health Report</title>
//   <style>
//     body {
//       font-family: 'Arial', sans-serif; /* More widely supported sans-serif font */
//       padding: 50px; /* Slightly increased padding for better spacing */
//       color: #333; /* Darker, more readable text color */
//       background-color: #f4f4f4; /* Light gray background for better contrast */
//       line-height: 1.6; /* Improved line height for readability */
//     }
//     .container {
//       max-width: 960px; /* Standard max-width for comfortable reading on larger screens */
//       margin: 0 auto; /* Center the content */
//       background-color: #fff; /* White container background */
//       padding: 40px;
//       border-radius: 8px; /* Soft rounded corners for a modern look */
//       box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle box shadow for depth */
//     }
//     h1, h2 {
//       color: #007bff; /* Standard blue for headings */
//       border-bottom: 2px solid #ccc; /* Light gray bottom border */
//       padding-bottom: 10px; /* More padding below headings */
//       margin-top: 30px; /* More top margin for spacing sections */
//     }
//     h1 {
//       font-size: 2.5em; /* Larger main title */
//       text-align: center; /* Center the main title */
//       margin-bottom: 20px;
//     }
//     h2 {
//       font-size: 1.8em;
//       margin-bottom: 15px;
//     }
//     p {
//       margin-bottom: 15px;
//       color: #555; /* Slightly lighter paragraph text */
//     }
//     strong {
//       font-weight: bold;
//       color: #333; /* Emphasized text remains dark */
//     }
//     table {
//       width: 100%;
//       border-collapse: collapse;
//       margin-top: 20px;
//       margin-bottom: 30px;
//       border: 1px solid #ddd; /* Light gray table border */
//       border-radius: 4px; /* Rounded corners for the table */
//       overflow: hidden; /* Ensures rounded corners are applied */
//     }
//     th, td {
//       border: 1px solid #eee; /* Lighter cell borders */
//       padding: 12px; /* More padding for cell content */
//       text-align: left;
//     }
//     th {
//       background-color: #f8f8f8; /* Light background for table headers */
//       color: #333;
//       font-weight: bold;
//     }
//     tbody tr:nth-child(even) {
//       background-color: #f9f9f9; /* Light gray for even rows for better readability */
//     }
//     .recommendations {
//       margin-top: 20px;
//       margin-bottom: 30px;
//     }
//     .recommendations h2 {
//       margin-bottom: 10px;
//     }
//     .recommendations ol {
//       list-style-type: decimal; /* Use numbered list */
//       padding-left: 20px;
//     }
//     .recommendations li {
//       margin-bottom: 10px;
//       color: #555;
//     }
//     .footer {
//       margin-top: 50px;
//       font-size: 0.9em;
//       color: #777;
//       text-align: center;
//       border-top: 1px solid #eee; /* Light top border for the footer */
//       padding-top: 20px;
//     }
//     .note {
//       font-style: italic; /* Italicize the note for emphasis */
//       color: #888;
//     }
//   </style>
// </head>
// <body>
//   <div class="container">
//     <h1>Medical Health Report</h1>
//     <p><strong>Generated On:</strong> ${new Date().toLocaleString()}</p>

//     <section>
//       <h2>Executive Summary</h2>
//       <p>This report outlines the patient's current health condition, self-medication actions, and hydration & symptom tracking data. The goal is to assist healthcare providers in reviewing patient-driven care outcomes and facilitating informed medical decisions.</p>
//     </section>

//     <section>
//       <h2>Symptom Analysis</h2>
//       <table>
//         <thead>
//           <tr><th>Symptom</th><th>Severity (0–10)</th></tr>
//         </thead>
//         <tbody>
//           ${Object.entries(data.symptoms).map(([symptom, severity]) => `
//             <tr>
//               <td>${symptom}</td>
//               <td>${severity}</td>
//             </tr>
//           `).join('')}
//         </tbody>
//       </table>
//     </section>

//     <section>
//       <h2>Hydration Status</h2>
//       <table>
//         <thead>
//           <tr><th>Current Intake (ml)</th><th>Target Intake (ml)</th></tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td>${data.hydration.current}</td>
//             <td>${data.hydration.target}</td>
//           </tr>
//         </tbody>
//       </table>
//     </section>

//     <section>
//       <h2>Medication Schedule</h2>
//       <table>
//         <thead>
//           <tr><th>Medicine</th><th>Dosage</th><th>Frequency</th></tr>
//         </thead>
//         <tbody>
//           ${data.medications.map((med: any) => `
//             <tr>
//               <td>${med.name}</td>
//               <td>${med.dosage}</td>
//               <td>${med.frequency}</td>
//             </tr>
//           `).join('')}
//         </tbody>
//       </table>
//     </section>

//     <section class="recommendations">
//       <h2>AI Recommendations</h2>
//       <ol>
//         ${text
//           .split('\n')
//           .filter(line => line.trim() !== '')
//           .map(line => `<li>${line.trim()}</li>`)
//           .join('')}
//       </ol>
//     </section>

//     <section>
//       <h2>Next Steps</h2>
//       <p>Please review this document with a certified medical professional. Follow up with any abnormal symptoms or inconsistencies in hydration or medication effectiveness for appropriate medical guidance.</p>
//     </section>

//     <div class="footer">
//       <p class="note">Note: This report was generated using AI and is not a substitute for professional medical advice.</p>
//     </div>
//   </div>
// </body>
// </html>
//       `;
  
//       // // Generate PDF
//       // const options = {
//       //   margin: 10,
//       //   filename: 'health_report.pdf',
//       //   image: { type: 'jpeg', quality: 0.98 },
//       //   html2canvas: { scale: 2 },
//       //   jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
//       // };
  
//       const options = {
//         margin: 20, // Increased margin to ensure more space around the content
//         filename: 'health_report.pdf',
//         image: { 
//           type: 'txt', 
//           quality: 1.0  // Ensure best quality for images if any
//         },
//         html2canvas: { 
//           scale: 2.5, // Increased scale for sharper text rendering
//           useCORS: true, // Allow CORS for external content
//           letterRendering: true, // Make sure letters render clearly, avoiding blurry text
//         },
//         jsPDF: { 
//           unit: 'mm', 
//           format: 'a4', 
//           orientation: 'portrait', 
//           // compress: true // This will compress the file size but keep text clarity
//         },
//       };

      
//       return new Promise((resolve, reject) => {
//         html2pdf()
//           .from(htmlContent)
//           .set(options)
//           .outputPdf('blob')
//           .then(resolve)
//           .catch(reject);
//       });
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//       throw error;
//     }
//   };
  
// Generate PDF report with html2pdf
export const generatePDFReport = async (data: any): Promise<Blob> => {
  try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
    Create a professional medical report in structured format using the following patient data:
    ${JSON.stringify(data, null, 2)}

    Include:
    
    - Recommendations
    - Next Steps
    Use clear and concise language, and ensure the report is easy to read and understand. 
    Give enough spacing after each section and use proper headings.
    Avoid using any unnecessary jargon or complex terms. use colorful headings and tables.
    Make sure to include a disclaimer at the end of the report stating that this is an AI-generated document and should not be used as a substitute for professional medical advice.
    Don't use * or any other special characters in the report. Use proper saccing not dashes. Bold the headings and use a sans-serif font for the text.
    Use a light background color and dark text for better readability. Don't use ** or any other special characters in the report. Use proper saccing not dashes. Bold the headings and use a sans-serif font for the text.
    In the Recommendations part of the report, provide a list of suggestions based on the patient's symptoms and hydration status. Include at least 3 recommendations. Don't just repeat the symptoms or hydration status in the recommendations.
    Don't repeat the same information in different sections. Make sure each section is unique and provides new information.
    Use a professional tone and avoid using any slang or informal language. Make sure the report is suitable for a medical professional to review.
    provide a section for siging the report and a section for the doctor to add their notes. and in ai recomendatipon part remove executive summary, medication schedule and next steps. 
  `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Define HTML with styling and structure
      const htmlContent = `
      <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Medical Health Report</title>
<style>
  body {
    font-family: 'Arial', sans-serif;
    padding: 50px;
    color: #333;
    background-color: #f4f4f4;
    line-height: 1.6;
  }
  .container {
    max-width: 960px;
    margin: 0 auto;
    background-color: #fff;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  h1, h2 {
    color: #007bff;
    border-bottom: 2px solid #ccc;
    padding-bottom: 10px;
    margin-top: 30px;
  }
  h1 {
    font-size: 2.5em;
    text-align: center;
    margin-bottom: 20px;
  }
  h2 {
    font-size: 1.8em;
    margin-bottom: 15px;
  }
  p {
    margin-bottom: 15px;
    color: #555;
  }
  strong {
    font-weight: bold;
    color: #333;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    margin-bottom: 30px;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
  }
  th, td {
    border: 1px solid #eee;
    padding: 12px;
    text-align: left;
  }
  th {
    background-color: #f8f8f8;
    color: #333;
    font-weight: bold;
  }
  tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  .recommendations {
    margin-top: 20px;
    margin-bottom: 30px;
  }
  .recommendations h2 {
    margin-bottom: 10px;
  }
  .recommendations div { /* Changed to div */
    padding-left: 0; /* Remove left padding */
    list-style-type: none;  /* Remove bullets */
  }
  .recommendations p{
    margin-bottom: 10px;
    color: #555;
  }
  .footer {
    margin-top: 50px;
    font-size: 0.9em;
    color: #777;
    text-align: center;
    border-top: 1px solid #eee;
    padding-top: 20px;
  }
  .note {
    font-style: italic;
    color: #888;
  }
</style>
</head>
<body>
<div class="container">
  

  <section class="recommendations">
    <h2>AI Recommendations</h2>
    <div>
      ${text
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => `<p>${line.trim()}</p>`)
        .join('')}
    </div>
  </section>

  <section>
    <h2>Next Steps</h2>
    <p>Please review this document with a certified medical professional. Follow up with any abnormal symptoms or inconsistencies in hydration or medication effectiveness for appropriate medical guidance.</p>
  </section>

  <div class="footer">
    <p class="note">Note: This report was generated using AI and is not a substitute for professional medical advice.</p>
  </div>
</div>
</body>
</html>
      `;

      const options = {
          margin: 20,
          filename: 'health_report.pdf',
          image: {
              type: 'txt',
              quality: 1.0
          },
          html2canvas: {
              scale: 2.5,
              useCORS: true,
              letterRendering: true,
          },
          jsPDF: {
              unit: 'mm',
              format: 'a4',
              orientation: 'portrait',
              compress: true
          },
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
