
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { generatePDFReport } from "@/utils/geminiApi";
import { useToast } from "@/hooks/use-toast";

interface ReportGeneratorProps {
  symptoms: Record<string, number>;
  hydration: { current: number; target: number };
  medications: Array<{ name: string; dosage: string; frequency: string }>;
}

export function ReportGenerator({ symptoms, hydration, medications }: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

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
      const a = document.createElement('a');
      a.href = url;
      a.download = `health-report-${new Date().toLocaleDateString().replace(/\//g, '-')}.txt`;
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

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="text-care-dark w-full"
      onClick={handleGenerateReport}
      disabled={isGenerating}
    >
      <ExternalLink className="mr-2 h-4 w-4" />
      {isGenerating ? "Generating..." : "Generate Report"}
    </Button>
  );
}