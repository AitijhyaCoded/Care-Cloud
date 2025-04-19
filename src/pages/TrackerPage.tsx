import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SymptomTracker } from "@/components/recovery/SymptomTracker";
import { SymptomHistory } from "@/components/recovery/SymptomHistory";
import { ReportGenerator } from "@/components/recovery/ReportGenerator";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Pill, Bell, PlusCircle, Calendar as CalendarIcon, X, Droplet, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
}

interface Reminder {
  id: string;
  title: string;
  time: string;
}

interface HydrationGoal {
  current: number;
  target: number;
}

const TrackerPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem('medications');
    return saved ? JSON.parse(saved) : [
      { id: "1", name: "Ibuprofen", dosage: "400mg", frequency: "Every 6 hours", time: "8:00 AM, 2:00 PM, 8:00 PM" },
      { id: "2", name: "Vitamin C", dosage: "500mg", frequency: "Once daily", time: "9:00 AM" },
    ];
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('reminders');
    return saved ? JSON.parse(saved) : [
      { id: "1", title: "Drink water", time: "Hourly" },
      { id: "2", title: "Take temperature", time: "12:00 PM, 8:00 PM" },
      { id: "3", title: "Rest", time: "2:00 PM" },
    ];
  });
  
  const [newMedication, setNewMedication] = useState<Omit<Medication, 'id'>>({
    name: "",
    dosage: "",
    frequency: "",
    time: ""
  });
  
  const [newReminder, setNewReminder] = useState<Omit<Reminder, 'id'>>({
    title: "",
    time: ""
  });
  
  const [hydration, setHydration] = useState<HydrationGoal>(() => {
    const saved = localStorage.getItem('hydration');
    return saved ? JSON.parse(saved) : { current: 2, target: 8 };
  });
  
  const { toast } = useToast();
  
  const [symptoms, setSymptoms] = useState<Record<string, number>>({});
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications));
    
    const saveMedicationsToSupabase = async () => {
      try {
        await supabase
          .from('medications')
          .delete()
          .is('user_id', null);
          
        for (const med of medications) {
          await supabase
            .from('medications')
            .insert({
              name: med.name,
              dosage: med.dosage,
              frequency: med.frequency,
              time: med.time
            });
        }
      } catch (error) {
        console.error("Error saving medications to Supabase:", error);
      }
    };
    
    saveMedicationsToSupabase();
  }, [medications]);
  
  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders));
    
    const saveRemindersToSupabase = async () => {
      try {
        await supabase
          .from('reminders')
          .delete()
          .is('user_id', null);
          
        for (const reminder of reminders) {
          await supabase
            .from('reminders')
            .insert({
              title: reminder.title,
              time: reminder.time
            });
        }
      } catch (error) {
        console.error("Error saving reminders to Supabase:", error);
      }
    };
    
    saveRemindersToSupabase();
  }, [reminders]);
  
  useEffect(() => {
    localStorage.setItem('hydration', JSON.stringify(hydration));
    
    const saveHydrationToSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('hydration')
          .upsert({
            date: new Date().toISOString().split('T')[0],
            current: hydration.current,
            target: hydration.target
          }, {
            onConflict: 'date'
          });
          
        if (error) throw error;
      } catch (error) {
        console.error("Error saving hydration to Supabase:", error);
      }
    };
    
    saveHydrationToSupabase();
  }, [hydration]);
  
  const addMedication = () => {
    if (!newMedication.name || !newMedication.dosage) return;
    
    const medication: Medication = {
      id: Date.now().toString(),
      ...newMedication
    };
    
    setMedications([...medications, medication]);
    setNewMedication({ name: "", dosage: "", frequency: "", time: "" });
  };
  
  const addReminder = () => {
    if (!newReminder.title) return;
    
    const reminder: Reminder = {
      id: Date.now().toString(),
      ...newReminder
    };
    
    setReminders([...reminders, reminder]);
    setNewReminder({ title: "", time: "" });
  };
  
  const removeMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
  };
  
  const removeReminder = (id: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };
  
  // const increaseHydration = () => {
  //   if (hydration.current < hydration.target) {
  //     setHydration({...hydration, current: hydration.current + 1});
      
  //     toast({
  //       title: "Hydration updated",
  //       description: `${hydration.current + 1}/${hydration.target} glasses of water consumed.`,
  //     });
  //   }
  // };

  const increaseHydration = () => {
    if (hydration.current < hydration.target) {
      const newHydration = hydration.current + 1;
      setHydration({ ...hydration, current: newHydration });
  
      let description = "";
  
      if (newHydration === hydration.target) {
        description = "🎉 Yayyy! Goal reached! You've hit your hydration target!";
      } else if (newHydration >= hydration.target - 1) {
        description = `🥳 Almost there... Nice work! ${newHydration}/${hydration.target} glasses consumed.`;
      } else {
        description = `💧 ${newHydration}/${hydration.target} glasses of water consumed. Keep going!`;
      }
  
      toast({
        title: "Hydration updated",
        description: description,
      });
    }
  };
  
  
  const decreaseHydration = () => {
    if (hydration.current > 0) {
      setHydration({...hydration, current: hydration.current - 1});
    }
  };
  
  const handleSymptomUpdate = (updatedSymptoms: Record<string, number>) => {
    setSymptoms(updatedSymptoms);
    
    const saveSymptomToSupabase = async () => {
      try {
        await supabase
          .from('symptoms')
          .delete()
          .eq('date', new Date().toISOString().split('T')[0])
          .is('user_id', null);
          
        for (const [symptomType, value] of Object.entries(updatedSymptoms)) {
          await supabase
            .from('symptoms')
            .insert({
              symptom_type: symptomType,
              value: value,
              date: new Date().toISOString().split('T')[0]
            });
        }
      } catch (error) {
        console.error("Error saving symptoms to Supabase:", error);
      }
    };
    
    saveSymptomToSupabase();
  };

  return (
    <MainLayout pageTitle="Recovery Tracker">
      <div className="space-y-6 py-4">
        <Card className="p-4 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-medium text-care-text">
              {format(selectedDate, "MMMM d, yyyy")}
            </h2>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="text-care-dark w-full md:w-auto">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Select Date
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-4">
            <Card className="p-3 bg-care-lightest border-care-light">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-white">
                    <Bell className="h-4 w-4 text-care-dark" />
                  </div>
                  <span className="text-sm font-medium text-care-text">Today's Schedule</span>
                </div>
                <Badge variant="outline" className="text-xs bg-white">
                  {format(selectedDate, "EEE")}
                </Badge>
              </div>
            </Card>
          </div>
        </Card>
      
        <Tabs defaultValue="symptoms" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="symptoms" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-care-text">
                Today's Status
              </h2>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-care-dark"
                onClick={() => setShowHistory(!showHistory)}
              >
                <History className="mr-2 h-4 w-4" />
                History
              </Button>
            </div>
            
            {showHistory ? (
              <SymptomHistory onClose={() => setShowHistory(false)} />
            ) : (
              <>
                <SymptomTracker 
                  onSymptomChange={handleSymptomUpdate} 
                  date={selectedDate}
                />
                
                <Card className="p-4 shadow-sm">
                  <h3 className="text-lg font-medium mb-4 text-care-text">Hydration</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Daily Goal: {hydration.target} glasses</span>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 p-0" 
                        onClick={decreaseHydration}
                        disabled={hydration.current <= 0}
                      >
                        <Droplet className="h-4 w-4 rotate-180" strokeWidth={1.5} />
                      </Button>
                      <span className="font-medium text-care-dark min-w-[60px] text-center">
                        {hydration.current} / {hydration.target}
                      </span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 p-0" 
                        onClick={increaseHydration}
                        disabled={hydration.current >= hydration.target}
                      >
                        <Droplet className="h-4 w-4" strokeWidth={1.5} />
                      </Button>
                    </div>
                  </div>
                  <Progress 
                    value={Math.min(100, (hydration.current / hydration.target) * 100)} 
                    className="h-3 bg-gray-100"
                  />
                </Card>
                
                <Card className="p-4 shadow-sm bg-care-lightest border-care-light">
                  <h3 className="text-sm font-medium mb-2 text-care-text">
                    Export Health Data
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Generate a report for your doctor with your symptom history.
                  </p>
                  <ReportGenerator 
                    symptoms={symptoms} 
                    hydration={hydration} 
                    medications={medications.map(m => ({ 
                      name: m.name, 
                      dosage: m.dosage, 
                      frequency: m.frequency 
                    }))} 
                  />
                </Card>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="medications" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-care-text">
                My Medications
              </h2>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="text-care-dark">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-3">
                    <h3 className="font-medium">Add New Medication</h3>
                    <div className="space-y-2">
                      <Input 
                        placeholder="Medication name" 
                        value={newMedication.name}
                        onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                      />
                      <Input 
                        placeholder="Dosage (e.g. 400mg)" 
                        value={newMedication.dosage}
                        onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                      />
                      <Input 
                        placeholder="Frequency (e.g. Every 6 hours)" 
                        value={newMedication.frequency}
                        onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
                      />
                      <Input 
                        placeholder="Time (e.g. 8:00 AM)" 
                        value={newMedication.time}
                        onChange={(e) => setNewMedication({...newMedication, time: e.target.value})}
                      />
                      <Button 
                        className="w-full mt-2"
                        onClick={addMedication}
                        disabled={!newMedication.name || !newMedication.dosage}
                      >
                        Add Medication
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            {medications.map((med) => (
              <Card key={med.id} className="p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-healing-lightest">
                    <Pill className="h-5 w-5 text-healing-dark" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-care-text">{med.name}</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0"
                        onClick={() => removeMedication(med.id)}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {med.dosage} • {med.frequency}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {med.time}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="reminders" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-care-text">
                My Reminders
              </h2>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="text-care-dark">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-3">
                    <h3 className="font-medium">Add New Reminder</h3>
                    <div className="space-y-2">
                      <Input 
                        placeholder="Reminder title" 
                        value={newReminder.title}
                        onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                      />
                      <Input 
                        placeholder="Time (e.g. 8:00 AM)" 
                        value={newReminder.time}
                        onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                      />
                      <Button 
                        className="w-full mt-2"
                        onClick={addReminder}
                        disabled={!newReminder.title}
                      >
                        Add Reminder
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            {reminders.map((reminder) => (
              <Card key={reminder.id} className="p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-care-lightest">
                    <Bell className="h-5 w-5 text-care-dark" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-care-text">{reminder.title}</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0"
                        onClick={() => removeReminder(reminder.id)}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {reminder.time}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default TrackerPage;