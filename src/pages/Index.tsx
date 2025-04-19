
import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { MoodSlider } from "@/components/ui/mood-slider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock, MessageSquareText, HeartPulse, Music, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { currentUser } = useAuth();
  const userName = currentUser?.displayName || "Friend";
  
  // State for mood and day of recovery
  const [currentMood, setCurrentMood] = useState<number>(() => {
    const saved = localStorage.getItem('currentMood');
    return saved ? parseInt(saved) : 2;
  });
  
  const [recoveryDay, setRecoveryDay] = useState<number>(() => {
    const saved = localStorage.getItem('recoveryDay');
    return saved ? parseInt(saved) : 1;
  });
  
  // Save to localStorage when values change
  useEffect(() => {
    localStorage.setItem('currentMood', currentMood.toString());
  }, [currentMood]);
  
  useEffect(() => {
    localStorage.setItem('recoveryDay', recoveryDay.toString());
  }, [recoveryDay]);
  
  // Increment recovery day
  useEffect(() => {
    const lastDate = localStorage.getItem('lastDate');
    const today = new Date().toDateString();
    
    if (lastDate !== today) {
      localStorage.setItem('lastDate', today);
      if (lastDate) { // Only increment if there was a previous date (not first visit)
        setRecoveryDay(prev => prev + 1);
      }
    }
  }, []);
  
  // Get time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  
  const QuickActionCard = ({ icon: Icon, title, description, to, color }: any) => (
    <Link to={to}>
      <Card className={`p-4 hover:shadow-md transition-all duration-300 border-l-4 ${color}`}>
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-full ${color.replace('border', 'bg')}/10`}>
            <Icon className={color.replace('border', 'text')} size={20} />
          </div>
          <div>
            <h3 className="font-medium text-care-text">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );

  return (
    <MainLayout>
      <div className="pt-6 pb-10 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-care-text animate-fade-in">
            {getGreeting()}, {userName} 👋
          </h1>
          <p className="text-muted-foreground">Welcome back! How are you feeling today?</p>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Card className="p-4 flex items-center gap-3 bg-care-lightest border-care-light md:w-1/3">
            <div className="p-2 rounded-full bg-white">
              <Sun className="h-5 w-5 text-care-dark" />
            </div>
            <div>
              <p className="text-sm text-care-text">Day of Recovery</p>
              <h3 className="text-2xl font-bold text-care-dark">{recoveryDay}</h3>
            </div>
          </Card>
          
          <div className="md:w-2/3">
            <MoodSlider 
              initialValue={currentMood}
              onChange={value => setCurrentMood(value)} 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-medium text-care-text">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <QuickActionCard 
              icon={CalendarClock}
              title="Track Recovery"
              description="Log your symptoms and medications"
              to="/tracker"
              color="border-care-dark"
            />
            <QuickActionCard 
              icon={MessageSquareText}
              title="Journal Your Thoughts"
              description="Record how you're feeling with voice or text"
              to="/journal"
              color="border-healing-dark"
            />
            <QuickActionCard 
              icon={HeartPulse}
              title="Find Calm"
              description="Guided meditations and breathing exercises"
              to="/calm"
              color="border-comfort-dark"
            />
            <QuickActionCard 
              icon={Music}
              title="Entertainment"
              description="Audiobooks, podcasts, and games to pass time"
              to="/entertain"
              color="border-care-dark"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="rounded-xl bg-gradient-to-r from-comfort-light to-comfort-lightest p-4 shadow-sm">
            <h3 className="font-medium text-care-text mb-2">Wellness Tip</h3>
            <p className="text-sm text-care-text">
              Staying hydrated is key to recovery. Try to drink a glass of water every hour while awake.
            </p>
          </div>
          
          <Link to="/calm">
            <Button 
              className="w-full bg-care-dark hover:bg-care-light text-white hover:text-care-dark transition-all duration-300"
            >
              <HeartPulse className="mr-2 h-5 w-5" />
              Need Calm Now
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
