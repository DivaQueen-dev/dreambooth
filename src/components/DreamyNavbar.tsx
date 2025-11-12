import { Moon, Sun, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAestheticSounds } from "@/hooks/useAestheticSounds";

const DreamyNavbar = () => {
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { playClick } = useAestheticSounds();

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? "glass-effect shadow-elegant border-b border-primary/10 py-4" : "bg-gradient-to-b from-background/80 to-transparent backdrop-blur-sm py-5"
    }`}>
      <div className="container mx-auto px-6 flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-3 w-24 animate-fade-in-slow">
          <Sparkles className="h-5 w-5 text-primary animate-gentle-pulse" />
        </div>
        
        <div className="text-center flex-1">
          <h1 className="font-title text-3xl md:text-5xl font-bold text-primary tracking-widest animate-fade-in-slow uppercase">
            Born to Dream
          </h1>
          <p className="font-sans text-xs md:text-sm mt-2 text-foreground/70 italic tracking-wide animate-fade-in-slow" style={{ animationDelay: "0.2s" }}>
            for the moments you find yourself again
          </p>
        </div>
        
        <div className="flex items-center gap-2 w-24 justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              playClick();
              setIsDark(!isDark);
            }}
            className="hover:bg-primary/10 hover:glow-romantic transition-all duration-300 hover:scale-110 rounded-full"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-primary" />
            ) : (
              <Moon className="h-5 w-5 text-primary" />
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default DreamyNavbar;
