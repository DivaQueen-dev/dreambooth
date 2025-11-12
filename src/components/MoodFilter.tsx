import { Heart, Sun, Moon, Flower } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MoodFilterProps {
  selectedMood: string | null;
  onMoodChange: (mood: string | null) => void;
}

const moods = [
  { name: "calm", icon: Moon, color: "text-blue-400" },
  { name: "joyful", icon: Sun, color: "text-yellow-400" },
  { name: "nostalgic", icon: Heart, color: "text-pink-400" },
  { name: "peaceful", icon: Flower, color: "text-purple-400" },
];

const MoodFilter = ({ selectedMood, onMoodChange }: MoodFilterProps) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-8">
      <Button
        variant={selectedMood === null ? "default" : "outline"}
        onClick={() => onMoodChange(null)}
        className="rounded-full"
      >
        All Moods
      </Button>
      {moods.map((mood) => {
        const Icon = mood.icon;
        return (
          <Button
            key={mood.name}
            variant={selectedMood === mood.name ? "default" : "outline"}
            onClick={() => onMoodChange(mood.name)}
            className="rounded-full capitalize"
          >
            <Icon className={`h-4 w-4 mr-2 ${mood.color}`} />
            {mood.name}
          </Button>
        );
      })}
    </div>
  );
};

export default MoodFilter;
