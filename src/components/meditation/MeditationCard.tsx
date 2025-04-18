
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, PauseCircle, Clock } from "lucide-react";

interface MeditationCardProps {
  title: string;
  duration: string;
  description?: string;
  imageSrc?: string;
  category: string;
}

export function MeditationCard({
  title,
  duration,
  description,
  imageSrc,
  category,
}: MeditationCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = () => {
    // In a real implementation, this would control audio playback
    setIsPlaying(!isPlaying);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <div
        className="h-32 bg-cover bg-center"
        style={{
          backgroundImage: imageSrc
            ? `url(${imageSrc})`
            : "linear-gradient(109.6deg, rgba(223,234,247,1) 11.2%, rgba(244,248,252,1) 91.1%)",
        }}
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium text-lg text-care-text">{title}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock size={14} className="mr-1" />
              <span>{duration}</span>
            </div>
          </div>
          <span className="text-xs px-2 py-1 bg-comfort-lightest text-comfort-dark rounded-full">
            {category}
          </span>
        </div>

        {description && (
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
        )}

        <Button
          onClick={togglePlayback}
          variant="ghost"
          className="w-full justify-start text-care-dark hover:text-care-dark hover:bg-care-lightest"
        >
          {isPlaying ? (
            <PauseCircle className="mr-2 h-5 w-5" />
          ) : (
            <PlayCircle className="mr-2 h-5 w-5" />
          )}
          {isPlaying ? "Pause" : "Play Meditation"}
        </Button>
      </div>
    </Card>
  );
}
