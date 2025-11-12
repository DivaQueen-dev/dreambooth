import { Heart } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAestheticSounds } from "@/hooks/useAestheticSounds";
import { animate } from 'animejs';
import { ANIME_EASING, createAnimeOptions } from "@/hooks/useAnimeAnimations";
import { useAnimationConfig } from "@/hooks/useAnimationConfig";

interface PolaroidCardProps {
  image: string;
  caption: string;
  message?: string;
  tiltClass?: string;
}

const PolaroidCard = ({ image, caption, message = "our memory", tiltClass = "polaroid-tilt-1" }: PolaroidCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { playClick } = useAestheticSounds();
  const cardRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLButtonElement>(null);
  const animConfig = useAnimationConfig();

  useEffect(() => {
    if (cardRef.current) {
      animate(cardRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        rotate: [-2, 0],
      }, createAnimeOptions({
        duration: 800,
        easing: ANIME_EASING.outExpo,
      }, animConfig));
    }
  }, [animConfig]);

  const handleLike = () => {
    playClick();
    setIsLiked(!isLiked);
    
    if (heartRef.current) {
      animate(heartRef.current, {
        scale: [1, 1.3, 1],
      }, createAnimeOptions({
        duration: 600,
        easing: ANIME_EASING.outElastic(1, 0.5),
      }, animConfig));
    }
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "group relative perspective-1000",
        tiltClass
      )}
      style={{ opacity: 0 }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={cn(
          "relative w-full transition-all duration-700 transform-style-3d",
          isFlipped && "rotate-y-180"
        )}
      >
        {/* Front of card */}
        <div className="backface-hidden bg-card rounded-xl shadow-dreamy p-3 md:p-4 transform transition-all duration-500 ease-out group-hover:scale-[1.05] group-hover:-translate-y-2 group-hover:rotate-1 group-hover:shadow-elegant group-hover:glow-romantic">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-3 relative transition-all duration-500 group-hover:shadow-lg">
            <img
              src={image}
              alt={caption}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Victorian vignette overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.15) 100%)'
            }} />
          </div>
          
          <div className="flex items-center justify-between gap-2">
            <p className="handwritten text-base md:text-lg text-foreground/80 flex-1">
              {caption}
            </p>
            <button
              ref={heartRef}
              onClick={handleLike}
              className="transition-all duration-300"
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-colors",
                  isLiked ? "fill-primary text-primary" : "text-muted-foreground"
                )}
              />
            </button>
          </div>
        </div>

        {/* Back of card */}
        <div className="absolute inset-0 backface-hidden bg-primary/90 rounded-xl shadow-dreamy p-4 flex items-center justify-center rotate-y-180">
          <p className="handwritten text-xl md:text-2xl text-white text-center">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PolaroidCard;
