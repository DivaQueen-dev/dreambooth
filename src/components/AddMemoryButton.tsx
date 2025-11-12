import { Plus, Camera, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAestheticSounds } from "@/hooks/useAestheticSounds";
import { useEffect } from "react";
import { animate, stagger } from 'animejs';
import { ANIME_EASING, createAnimeOptions } from "@/hooks/useAnimeAnimations";
import { useAnimationConfig } from "@/hooks/useAnimationConfig";

interface AddMemoryButtonProps {
  onCapture: () => void;
  onViewBoard: () => void;
  memoriesCount: number;
}

const AddMemoryButton = ({ onCapture, onViewBoard, memoriesCount }: AddMemoryButtonProps) => {
  const { playClick } = useAestheticSounds();
  const animConfig = useAnimationConfig();

  useEffect(() => {
    animate('.memory-button', {
      opacity: [0, 1],
      scale: [0.9, 1],
    }, createAnimeOptions({
      duration: 600,
      delay: stagger(100),
      easing: ANIME_EASING.outExpo,
    }, animConfig));
  }, [memoriesCount, animConfig]);

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 my-12">
      <Button
        onClick={() => {
          playClick();
          onCapture();
        }}
        className="memory-button bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full shadow-dreamy transition-all duration-300 hover:scale-105 glow-romantic group"
        style={{ opacity: 0 }}
      >
        <Camera className="mr-2 h-5 w-5 group-hover:animate-pulse" />
        Capture New Memory
        <Plus className="ml-2 h-5 w-5" />
      </Button>
      
      {memoriesCount > 0 && (
        <Button
          onClick={() => {
            playClick();
            onViewBoard();
          }}
          variant="outline"
          className="memory-button border-primary text-primary hover:bg-primary/10 px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105"
          style={{ opacity: 0 }}
        >
          <Grid className="mr-2 h-5 w-5" />
          View Memories Board
          <span className="ml-2 px-2 py-1 bg-primary text-white rounded-full text-sm">
            {memoriesCount}
          </span>
        </Button>
      )}
    </div>
  );
};

export default AddMemoryButton;
