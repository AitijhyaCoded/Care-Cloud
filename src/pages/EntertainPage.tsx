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
  imageSrc?: string;
}

const EntertainPage = () => {
  const [currentMood, setCurrentMood] = useState<number>(2);

  useEffect(() => {
    const mood = localStorage.getItem('currentMood');
    if (mood) {
      setCurrentMood(parseInt(mood));
    }
  }, []);

  // All entertainment items
  const allEntertainmentItems: EntertainmentItem[] = [
    // --- Books ---
    {
      id: "b1",
      title: "The Adventures of Sherlock Holmes",
      type: "book",
      description: "Detective short stories by Arthur Conan Doyle featuring the famous sleuth.",
      duration: "6-7 hours",
      embedUrl: "https://www.gutenberg.org/files/1661/1661-h/1661-h.htm",
      forMood: [1, 2, 3],
      imageSrc: "https://images.unsplash.com/photo-1594024561977-4774ad2e6eae?q=80&w=1927&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: "b2",
      title: "Frankenstein",
      type: "book",
      description: "Mary Shelley's Gothic masterpiece about creation and identity",
      duration: "4-6 hours",
      embedUrl: "https://www.gutenberg.org/files/84/84-h/84-h.htm",
      forMood: [0, 1, 2, 3, 4],
      imageSrc: "https://images.unsplash.com/photo-1605595988901-3d06601c38ad?q=80&w=2030&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: "b3",
      title: "Pride & Prejudice",
      type: "book",
      description: "Jane Austen's beloved novel of manners and romance",
      duration: "6-8 hours",
      embedUrl: "https://www.gutenberg.org/files/1342/1342-h/1342-h.htm",
      forMood: [2, 3, 4],
      imageSrc: "https://images.unsplash.com/photo-1675235099164-f2273d37feee?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: "b4",
      title: "The Secret Garden",
      type: "book",
      description: "A classic children's novel about growth and healing through nature and friendship.",
      duration: "5-6 hours",
      embedUrl: "https://www.gutenberg.org/files/113/113-h/113-h.htm",
      forMood: [0, 1, 2],
      imageSrc: "https://images.unsplash.com/photo-1689669405099-3576710d249d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: "b5",
      title: "Alice's Adventures in Wonderland",
      type: "book",
      description: "A fantastical journey through a whimsical and imaginative world.",
      duration: "3-5 hours",
      embedUrl: "https://www.gutenberg.org/files/11/11-h/11-h.htm",
      forMood: [2, 3, 4],
      imageSrc: "https://images.unsplash.com/photo-1697566389940-5365335ae1ca?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
  
    // --- Games ---
    {
      id: "g1",
      title: "Fill Up The Hole",
      type: "game",
      description: "Relaxing idle city builder game",
      duration: "Unlimited",
      embedUrl: "https://fluffy-lotus.itch.io/fillupthehole",
      forMood: [1, 2, 3],
      imageSrc: "https://plus.unsplash.com/premium_photo-1667539633338-5b7afd626193?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: "g2",
      title: "Burrilka",
      type: "game",
      description: "Engaging drilling simulation game",
      duration: "15-30 min",
      embedUrl: "https://echerryart.itch.io/burrilka",
      forMood: [2, 3, 4],
      imageSrc: "https://plus.unsplash.com/premium_photo-1677171381856-d05a49677cc0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
  
    // --- Podcasts (already added earlier) ---
    {
      id: "p1",
      title: "The Happiness Lab",
      type: "podcast",
      description: "Discover the science behind happiness with Dr. Laurie Santos.",
      duration: "30-40 min",
      embedUrl: "https://www.happinesslab.fm/",
      forMood: [0, 1, 2, 3],
      imageSrc: "https://images.unsplash.com/photo-1618316165991-80be84930cd1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: "p2",
      title: "Sleep With Me",
      type: "podcast",
      description: "A bedtime podcast designed to distract and help you fall asleep.",
      duration: "60 min",
      embedUrl: "https://www.sleepwithmepodcast.com/",
      forMood: [0, 1],
      imageSrc: "https://images.unsplash.com/photo-1613453646144-8f8bc16f898c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: "p4",
      title: "Good Life Project",
      type: "podcast",
      description: "Inspiring stories and ideas to live a meaningful life.",
      duration: "40-50 min",
      embedUrl: "https://www.goodlifeproject.com/podcast/",
      forMood: [1, 2, 3],
      imageSrc: "https://images.unsplash.com/photo-1744855162460-f4fb37bd2479?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
  ];




  const handleItemAction = (item: EntertainmentItem) => {
    if (item.embedUrl) {
      window.open(item.embedUrl, '_blank');
    }
  };

  const getFilteredItems = (type: "book" | "podcast" | "game") => {
    const allOfType = allEntertainmentItems.filter(item => item.type === type);
    const recommended = allOfType.filter(item => item.forMood?.includes(currentMood));
    return recommended.length > 0 ? recommended : allOfType;
  };

  const getMoodLabel = () => {
    const labels = ["Low", "Down", "Neutral", "Good", "Great"];
    return labels[currentMood];
  };

  const handleSurpriseMe = () => {
    const moodItems = allEntertainmentItems.filter(item => item.forMood?.includes(currentMood));
    const itemsToChooseFrom = moodItems.length > 0 ? moodItems : allEntertainmentItems;
    const randomItem = itemsToChooseFrom[Math.floor(Math.random() * itemsToChooseFrom.length)];

    toast({
      title: "How about this?",
      description: `Try "${randomItem.title}" (${randomItem.type}).`,
    });

    setTimeout(() => {
      handleItemAction(randomItem);
    }, 1500);
  };

  return (
    <MainLayout pageTitle="Entertainment">
      <div className="space-y-6 py-4 bg-cover bg-center min-h-screen"
        style={{
          backgroundImage: `url("https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/1280px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg")`,
          backgroundAttachment: "fixed",
        }}
      >
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 mx-4">
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

          <Tabs defaultValue="books" className="w-full pt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="books">Books</TabsTrigger>
              <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
              <TabsTrigger value="games">Games</TabsTrigger>
            </TabsList>

            <TabsContent value="books" className="space-y-4 pt-4">
              {getFilteredItems("book").map((book) => (
                <EntertainmentCard key={book.id} {...book} onAction={() => handleItemAction(book)} />
              ))}
            </TabsContent>

            <TabsContent value="games" className="space-y-4 pt-4">
              {getFilteredItems("game").map((game) => (
                <EntertainmentCard key={game.id} {...game} onAction={() => handleItemAction(game)} />
              ))}
            </TabsContent>

            <TabsContent value="podcasts" className="space-y-4 pt-4">
              {getFilteredItems("podcast").map((podcast) => (
                <EntertainmentCard key={podcast.id} {...podcast} onAction={() => handleItemAction(podcast)} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default EntertainPage;
