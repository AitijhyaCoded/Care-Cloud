
import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { EntertainmentCard } from "@/components/entertainment/EntertainmentCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface EntertainmentItem {
  id: string;
  title: string;
  type: "book" | "podcast" | "game";
  description: string;
  duration: string;
  forMood?: number[]; // Mood indexes (0-4) this content is good for
}

const EntertainPage = () => {
  const [currentMood, setCurrentMood] = useState<number>(2); // Default to neutral
  
  // Load user's mood from localStorage
  useEffect(() => {
    const mood = localStorage.getItem('currentMood');
    if (mood) {
      setCurrentMood(parseInt(mood));
    }
  }, []);
  
  // All entertainment items
  const allEntertainmentItems: EntertainmentItem[] = [
    {
      id: "b1",
      title: "The Comfort Book",
      type: "book",
      description: "A collection of consolations and thoughts for hard times.",
      duration: "4 hours",
      forMood: [0, 1, 2], // For low, down, neutral moods
    },
    {
      id: "b2",
      title: "Tiny Beautiful Things",
      type: "book",
      description: "Advice on love and life from Dear Sugar.",
      duration: "6 hours",
      forMood: [1, 2, 3], // For down, neutral, good moods
    },
    {
      id: "b3",
      title: "The Boy, the Mole, the Fox and the Horse",
      type: "book",
      description: "A heartwarming illustrated book with simple messages of hope.",
      duration: "1 hour",
      forMood: [0, 1, 2, 3, 4], // For all moods
    },
    {
      id: "p1",
      title: "Nothing Much Happens",
      type: "podcast",
      description: "Bedtime stories for adults, where nothing much happens.",
      duration: "30 min episodes",
      forMood: [0, 1, 2], // For low, down, neutral moods
    },
    {
      id: "p2",
      title: "Slow Radio",
      type: "podcast",
      description: "Immerse yourself in the sounds of nature and gentle music.",
      duration: "Various lengths",
      forMood: [1, 2], // For down, neutral moods
    },
    {
      id: "p3",
      title: "Funny Stories to Brighten Your Day",
      type: "podcast",
      description: "Light-hearted stories to make you smile and laugh.",
      duration: "20 min episodes",
      forMood: [2, 3, 4], // For neutral, good, great moods
    },
    {
      id: "g1",
      title: "Word Search",
      type: "game",
      description: "Find hidden words in a grid of letters.",
      duration: "Play anytime",
      forMood: [1, 2, 3, 4], // For down, neutral, good, great moods
    },
    {
      id: "g2",
      title: "Memory Match",
      type: "game",
      description: "Test your memory by matching pairs of cards.",
      duration: "5-10 min rounds",
      forMood: [2, 3, 4], // For neutral, good, great moods
    },
    {
      id: "g3",
      title: "Peaceful Puzzles",
      type: "game",
      description: "Simple jigsaw puzzles with calming scenes.",
      duration: "10-20 min",
      forMood: [0, 1, 2], // For low, down, neutral moods
    },
  ];
  
  // Filter items by mood
  const getFilteredItems = (type: "book" | "podcast" | "game") => {
    // Get all items of this type
    const allOfType = allEntertainmentItems.filter(item => item.type === type);
    
    // Get recommended items for current mood
    const recommended = allOfType.filter(item => 
      item.forMood && item.forMood.includes(currentMood)
    );
    
    // If we have recommendations, return those, otherwise return all of this type
    return recommended.length > 0 ? recommended : allOfType;
  };
  
  const handleItemAction = (item: EntertainmentItem) => {
    // In a real implementation, this would open the specific content
    const messages = {
      book: `Opening "${item.title}" for reading...`,
      podcast: `Playing "${item.title}"...`,
      game: `Loading "${item.title}"...`
    };
    
    toast({
      title: messages[item.type],
      description: "In a full implementation, this would open the content.",
    });
  };
  
  const getMoodLabel = () => {
    const labels = ["Low", "Down", "Neutral", "Good", "Great"];
    return labels[currentMood];
  };
  
  const handleSurpriseMe = () => {
    // First, get items appropriate for current mood
    const moodItems = allEntertainmentItems.filter(item => 
      item.forMood && item.forMood.includes(currentMood)
    );
    
    // If no mood-specific items, use all items
    const itemsToChooseFrom = moodItems.length > 0 ? moodItems : allEntertainmentItems;
    
    // Select random item
    const randomItem = itemsToChooseFrom[Math.floor(Math.random() * itemsToChooseFrom.length)];
    
    // Show toast with suggestion
    toast({
      title: "How about this?",
      description: `Try "${randomItem.title}" (${randomItem.type}).`,
    });
    
    // After a short delay, activate the item
    setTimeout(() => {
      handleItemAction(randomItem);
    }, 1500);
  };

  return (
    <MainLayout pageTitle="Entertainment">
      <div className="space-y-6 py-4">
        <p className="text-muted-foreground">
          Distract yourself with soothing and light-hearted content.
        </p>
        
        {currentMood <= 2 && (
          <Card className="p-4 bg-care-lightest border-care-light mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-care-dark mt-0.5" />
              <div>
                <p className="text-sm text-care-text">
                  We noticed your mood is <strong>{getMoodLabel()}</strong>. We've suggested some content that might help you feel better.
                </p>
              </div>
            </div>
          </Card>
        )}
        
        <Button 
          onClick={handleSurpriseMe}
          className="w-full bg-gradient-to-r from-healing-light to-care-light text-care-dark border-0"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Surprise Me
        </Button>
        
        <Tabs defaultValue="books" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="books">Books</TabsTrigger>
            <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
            <TabsTrigger value="games">Games</TabsTrigger>
          </TabsList>
          
          <TabsContent value="books" className="space-y-4 pt-4">
            {getFilteredItems("book").map((book) => (
              <EntertainmentCard 
                key={book.id} 
                {...book} 
                onAction={() => handleItemAction(book)}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="podcasts" className="space-y-4 pt-4">
            {getFilteredItems("podcast").map((podcast) => (
              <EntertainmentCard 
                key={podcast.id} 
                {...podcast} 
                onAction={() => handleItemAction(podcast)}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="games" className="space-y-4 pt-4">
            {getFilteredItems("game").map((game) => (
              <EntertainmentCard 
                key={game.id} 
                {...game} 
                onAction={() => handleItemAction(game)}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default EntertainPage;
