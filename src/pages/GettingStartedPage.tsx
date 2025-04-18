
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, CheckCircle, Sparkles, Calendar, Mic, HeartPulse, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GettingStartedPage = () => {
  const navigate = useNavigate();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const toggleStep = (stepIndex: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepIndex) 
        ? prev.filter(step => step !== stepIndex)
        : [...prev, stepIndex]
    );
  };
  
  const onboardingSteps = [
    {
      title: "Track your recovery",
      description: "Log your symptoms, medications, and reminders daily to monitor your progress.",
      icon: Calendar,
      color: "text-care-dark",
      link: "/tracker"
    },
    {
      title: "Journal your thoughts",
      description: "Record how you're feeling with voice or text entries in the journal.",
      icon: Mic,
      color: "text-healing-dark",
      link: "/journal"
    },
    {
      title: "Find calmness",
      description: "Explore meditations and breathing exercises to help you relax and find peace.",
      icon: HeartPulse,
      color: "text-comfort-dark",
      link: "/calm"
    },
    {
      title: "Stay entertained",
      description: "Discover books, podcasts, and games to keep yourself entertained during recovery.",
      icon: Music,
      color: "text-care-dark",
      link: "/entertain"
    }
  ];
  
  const handleComplete = () => {
    localStorage.setItem("onboardingCompleted", "true");
    navigate("/");
  };

  return (
    <MainLayout pageTitle="Welcome to CareCloud" hideNavigation>
      <div className="space-y-6 py-4">
        <Card className="p-6 bg-gradient-to-br from-care-lightest to-healing-lightest border-care-light">
          <div className="flex flex-col items-center text-center">
            <Sparkles className="h-12 w-12 text-care-dark mb-4" />
            <h1 className="text-2xl font-semibold text-care-text mb-2">
              Your recovery companion
            </h1>
            <p className="text-muted-foreground">
              CareCloud is here to support you during your isolation and recovery journey. Let's get you set up with a few simple steps.
            </p>
          </div>
        </Card>
        
        <div className="space-y-4">
          <h2 className="text-xl font-medium text-care-text">Getting Started</h2>
          
          {onboardingSteps.map((step, index) => (
            <Card 
              key={index} 
              className={`p-4 transition-all duration-300 hover:shadow-md cursor-pointer ${
                completedSteps.includes(index) ? "bg-care-lightest border-care-light" : ""
              }`}
              onClick={() => toggleStep(index)}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full bg-white shadow-sm`}>
                  <step.icon className={`h-5 w-5 ${step.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-care-text">{step.title}</h3>
                    {completedSteps.includes(index) && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
          >
            Skip for now
          </Button>
          <Button 
            onClick={handleComplete}
            className="bg-care-DEFAULT hover:bg-care-dark text-white"
          >
            Continue to app
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default GettingStartedPage;
