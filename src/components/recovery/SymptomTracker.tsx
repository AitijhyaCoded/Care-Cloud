
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { PlusCircle, Thermometer, Droplets, Activity } from "lucide-react";

const SYMPTOM_TYPES = [
  { id: "temperature", name: "Temperature", icon: Thermometer, color: "text-healing-dark" },
  { id: "hydration", name: "Hydration", icon: Droplets, color: "text-care-dark" },
  { id: "energy", name: "Energy Level", icon: Activity, color: "text-comfort-dark" },
];

interface SymptomTrackerProps {
  onSymptomChange?: (symptoms: Record<string, number>) => void;
}

export function SymptomTracker({ onSymptomChange }: SymptomTrackerProps) {
  const [activeSymptom, setActiveSymptom] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<Record<string, number>>({});

  // Report symptom changes to parent component
  useEffect(() => {
    if (onSymptomChange) {
      onSymptomChange(symptoms);
    }
  }, [symptoms, onSymptomChange]);

  const handleSymptomChange = (symptomId: string, value: number[]) => {
    setSymptoms(prev => ({
      ...prev,
      [symptomId]: value[0]
    }));
  };

  const toggleSymptom = (symptomId: string) => {
    setActiveSymptom(activeSymptom === symptomId ? null : symptomId);
  };

  return (
    <Card className="p-4 shadow-sm">
      <h3 className="text-lg font-medium mb-4 text-care-text">Track Your Symptoms</h3>
      
      <div className="space-y-4">
        {SYMPTOM_TYPES.map((symptom) => (
          <div key={symptom.id} className="space-y-2">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSymptom(symptom.id)}
            >
              <div className="flex items-center gap-2">
                <symptom.icon className={`h-5 w-5 ${symptom.color}`} />
                <span>{symptom.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {symptoms[symptom.id] !== undefined ? 
                  `${symptoms[symptom.id]}` : 
                  "Not recorded"}
              </span>
            </div>
            
            {activeSymptom === symptom.id && (
              <div className="py-2 animate-fade-in">
                <Slider
                  min={0}
                  max={10}
                  step={1}
                  value={[symptoms[symptom.id] || 5]}
                  onValueChange={(value) => handleSymptomChange(symptom.id, value)}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <Button 
        variant="ghost" 
        className="w-full mt-4 text-care-dark hover:text-care-dark hover:bg-care-lightest"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add another symptom
      </Button>
    </Card>
  );
}