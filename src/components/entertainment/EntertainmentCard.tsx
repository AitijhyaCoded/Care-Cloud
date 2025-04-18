
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, BookOpen, Headphones, GamepadIcon } from "lucide-react";

interface EntertainmentCardProps {
  id?: string;
  title: string;
  type: "book" | "podcast" | "game";
  description?: string;
  imageSrc?: string;
  duration?: string;
  forMood?: number[];
  onAction: () => void;
}

export function EntertainmentCard({
  title,
  type,
  description,
  imageSrc,
  duration,
  onAction,
}: EntertainmentCardProps) {
  
  const typeIcons = {
    book: BookOpen,
    podcast: Headphones,
    game: GamepadIcon,
  };
  
  const TypeIcon = typeIcons[type];
  
  const typeColors = {
    book: "bg-care-lightest text-care-dark",
    podcast: "bg-comfort-lightest text-comfort-dark",
    game: "bg-healing-lightest text-healing-dark",
  };
  
  const actionLabel = {
    book: "Read",
    podcast: "Listen",
    game: "Play",
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300">
      <div 
        className="h-28 bg-cover bg-center"
        style={{ 
          backgroundImage: imageSrc 
            ? `url(${imageSrc})` 
            : "linear-gradient(180deg, rgb(254,100,121) 0%, rgb(251,221,186) 100%)" 
        }}
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg text-care-text">{title}</h3>
          <span className={`text-xs px-2 py-1 rounded-full flex items-center ${typeColors[type]}`}>
            <TypeIcon size={12} className="mr-1" />
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        </div>
        
        {description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {description}
          </p>
        )}
        
        <div className="flex justify-between items-center">
          {duration && (
            <span className="text-xs text-muted-foreground">{duration}</span>
          )}
          
          <Button 
            onClick={onAction}
            size="sm"
            className="ml-auto bg-care-DEFAULT hover:bg-care-dark"
          >
            <Play size={14} className="mr-1" />
            {actionLabel[type]}
          </Button>
        </div>
      </div>
    </Card>
  );
}
