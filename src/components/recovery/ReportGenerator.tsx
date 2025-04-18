import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Printer, Send } from "lucide-react";
import { generatePDFReport } from "@/utils/geminiApi";
import { useToast } from "@/hooks/use-toast";
// import emailjs from "@emailjs/browser";

interface ReportGeneratorProps {
  symptoms: Record<string, number>;
  hydration: { current: number; target: number };
  medications: Array<{ name: string; dosage: string; frequency: string }>;
}

export function ReportGenerator({ symptoms, hydration, medications }: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const printableRef = useRef(null);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const reportData = {
        symptoms,
        hydration,
        medications,
        date: new Date().toISOString(),
      };

      const pdfBlob = await generatePDFReport(reportData);
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `health-report-${new Date().toLocaleDateString().replace(/\//g, "-")}.pdf`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Report Generated",
        description: "Your health report has been downloaded as a PDF.",
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

  const handlePrint = () => {
    window.print();
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

  const handleSendWhatsApp = () => {
    const message = encodeURIComponent("Hi, please find my latest health report.");
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  return (
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
