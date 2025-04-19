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
  embedUrl?: string;
  forMood?: number[];
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
      title: "Frankenstein",
      type: "book",
      description: "Mary Shelley's Gothic masterpiece about creation and identity",
      duration: "4-6 hours",
      embedUrl: "https://www.gutenberg.org/files/84/84-h/84-h.htm",
      forMood: [0, 1, 2, 3, 4],
    },
    {
      id: "b2",
      title: "Pride & Prejudice",
      type: "book",
      description: "Jane Austen's beloved novel of manners and romance",
      duration: "6-8 hours",
      embedUrl: "https://www.gutenberg.org/files/1342/1342-h/1342-h.htm",
      forMood: [2, 3, 4],
    },
    {
      id: "g1",
      title: "Fill Up The Hole",
      type: "game",
      description: "Relaxing idle city builder game",
      duration: "Unlimited",
      embedUrl: "https://fluffy-lotus.itch.io/fillupthehole",
      forMood: [1, 2, 3],
    },
    {
      id: "g2",
      title: "Burrilka",
      type: "game",
      description: "Engaging drilling simulation game",
      duration: "15-30 min",
      embedUrl: "https://echerryart.itch.io/burrilka",
      forMood: [2, 3, 4],
    },
  ];

  const handleItemAction = (item: EntertainmentItem) => {
    if (item.embedUrl) {
      window.open(item.embedUrl, '_blank');
    }
  };

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
              <div key={book.id} className="space-y-4">
                <EntertainmentCard 
                  {...book}
                  onAction={() => handleItemAction(book)}
                />
                {book.embedUrl && (
                  <div className="w-full h-[600px] border border-border rounded-lg overflow-hidden">
                    <iframe 
                      src={book.embedUrl} 
                      width="100%" 
                      height="100%" 
                      title={book.title}
                      className="w-full h-full"
                    />
                  </div>
                )}
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="games" className="space-y-4 pt-4">
            {getFilteredItems("game").map((game) => (
              <div key={game.id} className="space-y-4">
                <EntertainmentCard 
                  {...game}
                  onAction={() => handleItemAction(game)}
                />
                {/* {game.embedUrl && (
                  <div className="w-full h-[600px] border border-border rounded-lg overflow-hidden">
                    <iframe 
                      src={game.embedUrl} 
                      width="800" 
                      height="600" 
                      title={game.title}
                      className="w-full h-full"
                    />
                  </div>
                )} */}
              </div>
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
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default EntertainPage;