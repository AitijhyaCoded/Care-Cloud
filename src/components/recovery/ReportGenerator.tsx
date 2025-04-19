
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Printer, Send } from "lucide-react";
import { generatePDFReport } from "@/utils/geminiApi";
import { useToast } from "@/hooks/use-toast";
// import emailjs from "@emailjs/browser";
import { supabase } from "@/integrations/supabase/client";

interface ReportGeneratorProps {
  symptoms: Record<string, number>;
  hydration: { current: number; target: number };
  medications: Array<{ name: string; dosage: string; frequency: string }>;
}

export function ReportGenerator({ symptoms, hydration, medications }: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const uploadPDFToSupabase = async (pdfBlob: Blob, filename: string): Promise<string | null> => {
    const { error } = await supabase.storage
      .from("reports") // your bucket name
      .upload(`pdfs/${filename}`, pdfBlob, {
        contentType: "application/pdf",
        upsert: true,
      });
  
    if (error) {
      console.error("Upload error:", error);
      return null;
    }
  
    const { data: { publicUrl } } = supabase.storage
      .from("reports")
      .getPublicUrl(`pdfs/${filename}`);
  
    return publicUrl;
  };

  // const handleGenerateReport = async () => {
  //   setIsGenerating(true);
  //   try {
  //     const reportData = {
  //       symptoms,
  //       hydration,
  //       medications,
  //       date: new Date().toISOString(),
  //     };
  
  //     const pdfBlob = await generatePDFReport(reportData);
  //     const filename = `health-report-${Date.now()}.pdf`;
  
  //     const publicUrl = await uploadPDFToSupabase(pdfBlob, filename);
  //     if (!publicUrl) throw new Error("Upload failed");
  
  //     setPdfUrl(publicUrl);
  
  //     toast({
  //       title: "Report Ready",
  //       description: "PDF uploaded successfully!",
  //     });
  
  //     // Optional: trigger download too
  //     const a = document.createElement("a");
  //     a.href = publicUrl;
  //     a.download = filename;
  //     a.target = "_blank";
  //     a.click();
  //   } catch (err) {
  //     console.error("Error generating report:", err);
  //     toast({
  //       title: "Failed",
  //       description: "Could not generate or upload report.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };
  

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      // Prepare data for the report
      const reportData = {
        symptoms,
        hydration,
        medications,
        date: new Date().toISOString(),
      };
      
      // Generate the PDF report
      const pdfBlob = await generatePDFReport(reportData);
      
      
      
      // Create a download link
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      const a = document.createElement('a');
      a.href = url;
      a.download = `health-report-${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Report Generated",
        description: "Your health report has been downloaded.",
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error",
        description: "Could not generate your health report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // const handlePrint = () => {
  //   window.print();
  // };

  const handlePrint = () => {
    if (!pdfUrl) return toast({
      title: "No Report Found",
      description: "Please generate the report first.",
      variant: "destructive",
    });

    const win = window.open(pdfUrl, "_blank");
    if (win) {
      win.addEventListener("load", () => {
        win.focus();
        win.print();
      });
    }
  };

  const handleSendEmail = async () => {
    try {
      await emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
        to_email: "doctor@example.com",
        message: "Please find the health report attached.",
      }, "YOUR_USER_ID");

      toast({
        title: "Email Sent",
        description: "Your report was sent to the doctor via email.",
      });
    } catch (error) {
      console.error("Email send error:", error);
      toast({
        title: "Error Sending Email",
        description: "Something went wrong while sending the email.",
        variant: "destructive",
      });
    }
  };

  // const handleSendWhatsApp = () => {
  //   const message = encodeURIComponent("Hi, please find my latest health report.");
  //   window.open(`https://wa.me/?text=${message}`, "_blank");
  // };

  // const handleSendWhatsApp = () => {
  //   if (!pdfUrl) return toast({
  //     title: "No Report Found",
  //     description: "Please generate the report first.",
  //     variant: "destructive",
  //   });

  //   const message = encodeURIComponent(`Hi, please find my latest health report:\n${pdfUrl}`);
  //   window.open(`https://wa.me/?text=${message}`, "_blank");
  // };

  const handleSendWhatsApp = () => {
    if (!pdfUrl) {
      toast({
        title: "No Report",
        description: "Please generate the report first.",
        variant: "destructive",
      });
      return;
    }
  
    const message = encodeURIComponent(
      `Hi, please find my latest health report:\n${pdfUrl}`
    );
  
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };
  


  return (
    // <Button 
    //   variant="outline" 
    //   size="sm" 
    //   className="text-care-dark w-full"
    //   onClick={handleGenerateReport}
    //   disabled={isGenerating}
    // >
    //   <ExternalLink className="mr-2 h-4 w-4" />
    //   {isGenerating ? "Generating..." : "Generate Report"}
    //   </Button>

    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        size="sm"
        className="text-care-dark"
        onClick={handleGenerateReport}
        disabled={isGenerating}
      >
        <ExternalLink className="mr-2 h-4 w-4" />
        {isGenerating ? "Generating..." : "Download Report"}
      </Button>

      <Button variant="outline" size="sm" onClick={handlePrint}>
        <Printer className="mr-2 h-4 w-4" /> Print Report
      </Button>

      <Button variant="outline" size="sm" onClick={handleSendEmail}>
        <Send className="mr-2 h-4 w-4" /> Email to Doctor
      </Button>

      <Button variant="outline" size="sm" onClick={handleSendWhatsApp}>
        <Send className="mr-2 h-4 w-4" /> Send via WhatsApp
      </Button>
    </div>

  );
}