
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar as CalendarIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface SymptomHistoryProps {
  onClose: () => void;
}

export function SymptomHistory({ onClose }: SymptomHistoryProps) {
  const [dates, setDates] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<Record<string, Record<string, number>>>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load all symptoms from localStorage
    const savedDates: string[] = [];
    const savedSymptoms: Record<string, Record<string, number>> = {};
    
    // Get all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('symptoms_')) {
        const date = key.replace('symptoms_', '');
        savedDates.push(date);
        savedSymptoms[date] = JSON.parse(localStorage.getItem(key) || '{}');
      }
    }
    
    // Sort dates in descending order
    savedDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    setDates(savedDates);
    setSymptoms(savedSymptoms);
    
    // Also fetch data from Supabase if available
    const fetchSupabaseData = async () => {
      try {
        const { data, error } = await supabase
          .from('symptoms')
          .select('*')
          .order('date', { ascending: false });
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Group symptoms by date
          const supabaseSymptoms: Record<string, Record<string, number>> = {};
          
          data.forEach(item => {
            const dateStr = item.date;
            if (!supabaseSymptoms[dateStr]) {
              supabaseSymptoms[dateStr] = {};
            }
            supabaseSymptoms[dateStr][item.symptom_type] = item.value;
            
            // Add to dates if not already present
            if (!savedDates.includes(dateStr)) {
              savedDates.push(dateStr);
            }
          });
          
          // Merge with localStorage data
          const mergedSymptoms = { ...supabaseSymptoms };
          Object.keys(savedSymptoms).forEach(date => {
            if (!mergedSymptoms[date]) {
              mergedSymptoms[date] = {};
            }
            mergedSymptoms[date] = { 
              ...mergedSymptoms[date], 
              ...savedSymptoms[date] 
            };
          });
          
          // Re-sort dates
          savedDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
          
          setDates(savedDates);
          setSymptoms(mergedSymptoms);
        }
      } catch (error) {
        console.error("Error fetching symptoms from Supabase:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSupabaseData();
  }, []);
  
  // Function to get symptom names from a date's symptoms
  const getSymptomNames = (dateSymptoms: Record<string, number>) => {
    return Object.keys(dateSymptoms).map(key => {
      // Convert symptom keys to readable names
      if (key === "temperature") return "Temperature";
      if (key === "hydration") return "Hydration";
      if (key === "energy") return "Energy Level";
      
      // For custom symptoms
      if (key.startsWith('custom_')) {
        // Try to find the custom symptom name from localStorage
        const customSymptoms = JSON.parse(localStorage.getItem('custom_symptoms') || '[]');
        const customSymptom = customSymptoms.find((s: any) => s.id === key);
        return customSymptom ? customSymptom.name : key.replace('custom_', '');
      }
      
      return key;
    });
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-care-text">Symptom History</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-6">Loading history...</div>
      ) : dates.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          No symptom history found.
        </div>
      ) : (
        <div className="space-y-4">
          {dates.map(date => (
            <Card key={date} className="p-3 border-muted">
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium">{format(new Date(date), "MMMM d, yyyy")}</h4>
              </div>
              
              {Object.entries(symptoms[date] || {}).map(([symptomId, value]) => {
                // Convert symptom ID to readable name
                let symptomName = symptomId;
                if (symptomId === "temperature") symptomName = "Temperature";
                if (symptomId === "hydration") symptomName = "Hydration";
                if (symptomId === "energy") symptomName = "Energy Level";
                
                // For custom symptoms
                if (symptomId.startsWith('custom_')) {
                  // Try to find the custom symptom name from localStorage
                  const customSymptoms = JSON.parse(localStorage.getItem('custom_symptoms') || '[]');
                  const customSymptom = customSymptoms.find((s: any) => s.id === symptomId);
                  symptomName = customSymptom ? customSymptom.name : symptomId.replace('custom_', '');
                }
                
                return (
                  <div key={symptomId} className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">{symptomName}</span>
                      <span className="text-sm font-medium">{value}/10</span>
                    </div>
                    <Progress value={value * 10} className="h-2" />
                  </div>
                );
              })}
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
}