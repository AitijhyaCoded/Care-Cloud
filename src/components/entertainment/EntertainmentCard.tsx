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
    book: "bg-care-lightest text-care-dark hover:bg-care-dark hover:text-white",
    podcast: "bg-comfort-lightest text-comfort-dark hover:bg-comfort-dark hover:text-white",
    game: "bg-healing-lightest text-healing-dark hover:bg-healing-dark hover:text-white",
  };

  const actionLabel = {
    book: "Read",
    podcast: "Listen",
    game: "Play",
  };

  return (
    <Card className="flex flex-col sm:flex-row gap-4 p-4 items-center shadow-md bg-white/90">
      {imageSrc && (
        <img
          src={imageSrc}
          alt={title}
          className="w-full sm:w-40 h-40 object-cover rounded-lg border"
        />
      )}
      <div className="flex flex-col justify-between w-full">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TypeIcon className="h-5 w-5" />
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-muted-foreground">{duration}</span>
          <Button
            onClick={onAction}
            size="sm"
            className={`border ${typeColors[type]}`}
          >
            {actionLabel[type]}
          </Button>
        </div>
      </div>
    </Card>
  );
}