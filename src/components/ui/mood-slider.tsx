
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";

const MOOD_EMOJIS = ["😔", "😕", "😐", "🙂", "😊"];
const MOOD_LABELS = ["Low", "Down", "Neutral", "Good", "Great"];

interface MoodSliderProps {
  onChange?: (value: number) => void;
  initialValue?: number;
}

export function MoodSlider({ onChange, initialValue = 2 }: MoodSliderProps) {
  const [value, setValue] = useState(initialValue);

  const handleValueChange = (newValue: number[]) => {
    setValue(newValue[0]);
    if (onChange) onChange(newValue[0]);
  };

  return (
    <div className="space-y-4 my-6 p-4 bg-white rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-care-text">How are you feeling today?</h3>
        <span className="text-3xl animate-pulse-soft">{MOOD_EMOJIS[value]}</span>
      </div>
      
      <Slider
        min={0}
        max={4}
        step={1}
        value={[value]}
        onValueChange={handleValueChange}
        className="py-4"
      />
      
      <div className="flex justify-between text-sm text-care-text/80">
        {MOOD_LABELS.map((label, index) => (
          <span 
            key={index} 
            className={value === index ? "font-medium text-care-dark" : ""}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
