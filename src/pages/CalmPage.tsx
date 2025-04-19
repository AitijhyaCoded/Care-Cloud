import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Wind, Sparkles } from "lucide-react";

const CalmPage = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [currentMood, setCurrentMood] = useState<number>(2); // Default to neutral

  useEffect(() => {
    const mood = localStorage.getItem("currentMood");
    if (mood) {
      setCurrentMood(parseInt(mood));
    }
  }, []);

  const toggleBreathing = () => {
    setIsBreathing(!isBreathing);
  };

  const allMeditations = [
    {
      title: "Gentle Body Scan",
      duration: "5 min",
      description: "A relaxing meditation to connect with your body.",
      category: "Relaxation",
      forMood: [0, 1, 2],
      embedUrl:
        "https://archive.org/embed/4GuidedMeditationsForEverydayUse",
    },
    {
      title: "Quick Calm",
      duration: "3 min",
      description: "A short practice for immediate stress relief.",
      category: "Stress",
      forMood: [0, 1],
      embedUrl:
        "https://archive.org/embed/calm-guided-meditation-to-gain-abundance-love-happines",
    },
    {
      title: "Healing Visualization",
      duration: "10 min",
      description: "Visualize your body's natural healing process.",
      category: "Healing",
      forMood: [1, 2, 3],
      embedUrl:
        "https://archive.org/embed/mindfulness-meditation-swami-sarvapriyananda",
    },
    {
      title: "Sleep Well",
      duration: "15 min",
      description: "A gentle meditation to help you fall asleep.",
      category: "Sleep",
      forMood: [0, 1, 2],
      embedUrl: "https://archive.org/embed/02-the-secret-meditation",
    },
    {
      title: "Energy Boost",
      duration: "7 min",
      description: "An uplifting meditation to boost your energy levels.",
      category: "Energy",
      forMood: [3, 4],
      embedUrl: "https://archive.org/embed/GuidedChristianMeditation",
    },
    {
      title: "Gratitude Practice",
      duration: "8 min",
      description: "Focus on things you're grateful for to enhance wellbeing.",
      category: "Gratitude",
      forMood: [2, 3, 4],
      embedUrl: "https://archive.org/embed/VisitTheAngelsGuidedMeditation",
    },
  ];

  const recommendedMeditations = allMeditations.filter((med) =>
    med.forMood.includes(currentMood)
  );
  const meditationsToShow =
    recommendedMeditations.length > 0
      ? recommendedMeditations
      : allMeditations;

  const getMoodLabel = () => {
    const labels = ["Low", "Down", "Neutral", "Good", "Great"];
    return labels[currentMood];
  };

  const getAffirmation = () => {
    const affirmations = [
      "My body knows how to heal, and I give it the time and care it needs.",
      "I am getting stronger and healthier each day.",
      "This too shall pass. I am resilient.",
      "I listen to my body and give it what it needs.",
      "Every day is a step towards feeling better.",
    ];

    if (currentMood <= 1) {
      return affirmations[2];
    } else if (currentMood === 2) {
      return affirmations[0];
    } else {
      return affirmations[1];
    }
  };

  return (
    <MainLayout pageTitle="Find Calm">
      <div className="space-y-6 py-4">
        {currentMood <= 2 && (
          <Card className="p-4 bg-care-lightest border-care-light mb-4">
            <p className="text-sm text-care-text">
              We noticed your mood is <strong>{getMoodLabel()}</strong>. Here are
              some meditations that might help you feel better.
            </p>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={toggleBreathing}
            className={`h-auto py-4 px-3 bg-care-lightest hover:bg-care-light text-care-dark ${
              isBreathing ? "bg-care-light ring-2 ring-care-DEFAULT" : ""
            }`}
          >
            <div className="flex flex-col items-center">
              <div
                className={`p-3 rounded-full bg-white mb-2 ${
                  isBreathing ? "animate-breathing" : ""
                }`}
              >
                <Wind className="h-5 w-5 text-care-dark" />
              </div>
              <span className="text-sm font-medium">Breathing</span>
            </div>
          </Button>

          <Button className="h-auto py-4 px-3 bg-healing-lightest hover:bg-healing-light text-healing-dark">
            <div className="flex flex-col items-center">
              <div className="p-3 rounded-full bg-white mb-2">
                <Heart className="h-5 w-5 text-healing-dark" />
              </div>
              <span className="text-sm font-medium">Self-Care</span>
            </div>
          </Button>
        </div>

        {isBreathing && (
          <Card className="p-6 bg-gradient-to-b from-care-lightest to-comfort-lightest border-care-light shadow-sm animate-fade-in">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center mb-4 animate-breathing">
                <div className="text-center text-care-dark">
                  <p className="text-lg font-medium">Breathe</p>
                  <p className="text-xs text-muted-foreground">in... out...</p>
                </div>
              </div>
              <p className="text-sm text-center text-care-text mb-3">
                Follow the circle's rhythm.
                <br />
                Breathe in as it expands, out as it contracts.
              </p>
              <Button
                onClick={toggleBreathing}
                variant="outline"
                size="sm"
                className="text-care-dark"
              >
                End Session
              </Button>
            </div>
          </Card>
        )}

        <div>
          <h2 className="text-lg font-medium text-care-text mb-3">
            {recommendedMeditations.length > 0
              ? "Recommended Meditations"
              : "Guided Meditations"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meditationsToShow.map((meditation, index) => (
              <Card
                key={index}
                className="p-4 bg-white shadow-md border border-gray-100 flex flex-col gap-2"
              >
                <div>
                  <h3 className="text-base font-semibold">{meditation.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {meditation.description}
                  </p>
                  <p className="text-xs mt-1 text-gray-500">
                    {meditation.duration} · {meditation.category}
                  </p>
                </div>
                {meditation.embedUrl && (
                  <Button
                    className="mt-2 text-sm"
                    variant="secondary"
                    onClick={() => window.open(meditation.embedUrl, "_blank")}
                  >
                    Listen
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </div>

        <Card className="p-4 bg-gradient-to-r from-comfort-light to-comfort-lightest shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-white">
              <Sparkles className="h-5 w-5 text-comfort-dark" />
            </div>
            <div>
              <h3 className="font-medium text-care-text">Daily Affirmation</h3>
              <p className="text-sm text-care-text mt-1">
                "{getAffirmation()}"
              </p>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CalmPage;
