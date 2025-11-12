import { Camera, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import AffirmationRotator from "./AffirmationRotator";
import heroImage from "@/assets/dreamy-hero.jpg";
import { useEffect } from "react";
import { animate } from 'animejs';
import { ANIME_EASING, createAnimeOptions } from "@/hooks/useAnimeAnimations";
import { useAnimationConfig } from "@/hooks/useAnimationConfig";

interface HeroSectionProps {
  onStartCapture: () => void;
}

const HeroSection = ({ onStartCapture }: HeroSectionProps) => {
  const animConfig = useAnimationConfig();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      animate('.hero-title', {
        opacity: [0, 1],
        translateY: [15, 0],
      }, createAnimeOptions({
        duration: 800,
        easing: ANIME_EASING.outExpo,
      }, animConfig));
      
      animate('.hero-subtitle', {
        opacity: [0, 1],
        translateY: [15, 0],
      }, createAnimeOptions({
        duration: 800,
        delay: 150,
        easing: ANIME_EASING.outExpo,
      }, animConfig));
      
      animate('.hero-affirmation', {
        opacity: [0, 1],
        scale: [0.95, 1],
      }, createAnimeOptions({
        duration: 600,
        delay: 300,
        easing: ANIME_EASING.outExpo,
      }, animConfig));
      
      animate('.hero-button', {
        opacity: [0, 1],
        scale: [0.95, 1],
      }, createAnimeOptions({
        duration: 600,
        delay: 450,
        easing: ANIME_EASING.outExpo,
      }, animConfig));
      
      animate('.hero-float', {
        translateY: [-5, 5],
      }, createAnimeOptions({
        duration: 4000,
        direction: 'alternate',
        loop: true,
        easing: ANIME_EASING.inOutSine,
      }, animConfig));
    }, 100);
    
    return () => clearTimeout(timer);
  }, [animConfig]);

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Dreamy bedroom with curtains and roses" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/20 to-white/70" />
      </div>
      
      {/* Subtle overlay elements */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full glass-effect animate-fade-in-slow">
          <Heart className="h-4 w-4 text-primary fill-primary animate-pulse" />
          <span className="text-sm text-foreground/80">Capture your golden moments</span>
          <Heart className="h-4 w-4 text-primary fill-primary animate-pulse" />
        </div>

        <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-bold text-primary mb-6 tracking-tight leading-tight" style={{ opacity: 0 }}>
          Born to Dream
        </h1>

        <p className="hero-subtitle text-2xl md:text-3xl text-foreground/80 mb-8 max-w-2xl mx-auto leading-relaxed" style={{ opacity: 0 }}>
          For the moments you find yourself again.
        </p>

        <div className="hero-affirmation max-w-2xl mx-auto mb-12" style={{ opacity: 0 }}>
          <AffirmationRotator />
        </div>

        <div className="hero-button flex flex-col sm:flex-row gap-4 justify-center items-center" style={{ opacity: 0 }}>
          <Button
            onClick={onStartCapture}
            className="bg-primary hover:bg-primary/90 text-white px-10 py-7 text-xl rounded-full shadow-dreamy transition-all duration-300 hover:scale-105 glow-romantic group"
          >
            <Camera className="mr-3 h-6 w-6 group-hover:animate-pulse" />
            Start Capturing
            <Sparkles className="ml-3 h-6 w-6" />
          </Button>
        </div>

        {/* Floating elements */}
        <div className="absolute -bottom-10 left-1/4 opacity-30">
          <div className="hero-float text-6xl">✨</div>
        </div>
        <div className="absolute -bottom-10 right-1/4 opacity-30">
          <div className="hero-float text-6xl">💕</div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
