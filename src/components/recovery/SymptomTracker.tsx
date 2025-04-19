import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { PlusCircle, Activity, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_SYMPTOM_TYPES = [
  { id: "temperature", name: "Temperature (°F)", icon: Activity, color: "text-healing-dark" },
  { id: "energy", name: "Energy Level", icon: Activity, color: "text-comfort-dark" },
];

interface SymptomTrackerProps {
  onSymptomChange?: (symptoms: Record<string, number>) => void;
  date?: Date;
}

export function SymptomTracker({ onSymptomChange, date = new Date() }: SymptomTrackerProps) {
  const [activeSymptom, setActiveSymptom] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<Record<string, number>>({});
  const [customSymptoms, setCustomSymptoms] = useState<Array<{id: string, name: string}>>([]);
  const [newSymptom, setNewSymptom] = useState("");
  const [isAddingSymptom, setIsAddingSymptom] = useState(false);
  const { toast } = useToast();
  
  const dateKey = date.toISOString().split('T')[0];
  const storageKey = `symptoms_${dateKey}`;
  const customSymptomsKey = 'custom_symptoms';

  useEffect(() => {
    const savedSymptoms = localStorage.getItem(storageKey);
    if (savedSymptoms) {
      setSymptoms(JSON.parse(savedSymptoms));
    } else {
      setSymptoms({});
    }
    
    const savedCustomSymptoms = localStorage.getItem(customSymptomsKey);
    if (savedCustomSymptoms) {
      setCustomSymptoms(JSON.parse(savedCustomSymptoms));
    }
  }, [storageKey]);

  useEffect(() => {
    if (Object.keys(symptoms).length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(symptoms));
      
      if (onSymptomChange) {
        onSymptomChange(symptoms);
      }
    }
  }, [symptoms, onSymptomChange, storageKey]);

  const handleSymptomChange = (symptomId: string, value: number[]) => {
    const finalValue = symptomId === 'temperature' ? (value[0] * 9/5) + 32 : value[0];
    
    setSymptoms(prev => ({
      ...prev,
      [symptomId]: finalValue
    }));
  };

  const toggleSymptom = (symptomId: string) => {
    setActiveSymptom(activeSymptom === symptomId ? null : symptomId);
  };
  
  const addCustomSymptom = () => {
    if (!newSymptom.trim()) return;
    
    const id = `custom_${Date.now()}`;
    const newCustomSymptoms = [...customSymptoms, { id, name: newSymptom.trim() }];
    
    setCustomSymptoms(newCustomSymptoms);
    localStorage.setItem(customSymptomsKey, JSON.stringify(newCustomSymptoms));
    setNewSymptom("");
    setIsAddingSymptom(false);
    
    toast({
      title: "Symptom Added",
      description: `"${newSymptom.trim()}" has been added to your symptoms.`,
    });
  };
  
  const removeCustomSymptom = (id: string) => {
    const updatedCustomSymptoms = customSymptoms.filter(symptom => symptom.id !== id);
    setCustomSymptoms(updatedCustomSymptoms);
    localStorage.setItem(customSymptomsKey, JSON.stringify(updatedCustomSymptoms));
    
    const updatedSymptoms = { ...symptoms };
    delete updatedSymptoms[id];
    setSymptoms(updatedSymptoms);
    
    if (activeSymptom === id) {
      setActiveSymptom(null);
    }
  };
  
  const getSliderValue = (symptomId: string, value?: number) => {
    if (!value) return [5];
    return [symptomId === 'temperature' ? (value - 32) * 5/9 : value];
  };

  const allSymptomTypes = [
    ...DEFAULT_SYMPTOM_TYPES,
    ...customSymptoms.map(s => ({ 
      id: s.id, 
      name: s.name, 
      icon: Activity, 
      color: "text-healing-dark" 
    }))
  ];

  return (
    <Card className="p-4 shadow-sm">
      <h3 className="text-lg font-medium mb-4 text-care-text">Track Your Symptoms</h3>
      
      <div className="space-y-4">
        {allSymptomTypes.map((symptom) => (
          <div key={symptom.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div 
                className="flex items-center gap-2 cursor-pointer flex-1"
                onClick={() => toggleSymptom(symptom.id)}
              >
                <symptom.icon className={`h-5 w-5 ${symptom.color}`} />
                <span>{symptom.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {symptoms[symptom.id] !== undefined ? 
                    `${symptoms[symptom.id]}` : 
                    "Not recorded"}
                </span>
                {symptom.id.startsWith('custom_') && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCustomSymptom(symptom.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            {activeSymptom === symptom.id && (
              <div className="py-2 animate-fade-in">
                <Slider
                  min={symptom.id === 'temperature' ? 35 : 0}
                  max={symptom.id === 'temperature' ? 42 : 10}
                  step={symptom.id === 'temperature' ? 0.1 : 1}
                  value={getSliderValue(symptom.id, symptoms[symptom.id])}
                  onValueChange={(value) => handleSymptomChange(symptom.id, value)}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{symptom.id === 'temperature' ? '95°F' : 'Low'}</span>
                  <span>{symptom.id === 'temperature' ? '107.6°F' : 'High'}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <Dialog open={isAddingSymptom} onOpenChange={setIsAddingSymptom}>
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full mt-4 text-care-dark hover:text-care-dark hover:bg-care-lightest"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add another symptom
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Symptom</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input 
              placeholder="Enter symptom name" 
              value={newSymptom}
              onChange={(e) => setNewSymptom(e.target.value)}
            />
            <Button onClick={addCustomSymptom} disabled={!newSymptom.trim()}>
              Add Symptom
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}