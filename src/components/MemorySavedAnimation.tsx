import { useEffect, useState } from "react";
import { Sparkles, Heart } from "lucide-react";

const MemorySavedAnimation = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none animate-fade-in-slow">
      <div className="relative">
        {/* Glowing background */}
        <div className="absolute inset-0 w-64 h-64 bg-primary/30 rounded-full blur-3xl animate-gentle-pulse" />
        
        {/* Main message */}
        <div className="relative glass-effect rounded-3xl px-12 py-8 shadow-elegant glow-romantic">
          <div className="flex items-center gap-4">
            <Heart className="h-12 w-12 text-primary fill-primary animate-heart-pulse" />
            <div>
              <h3 className="text-3xl font-title text-primary mb-1">✨ Memory Saved</h3>
              <p className="text-sm font-script text-muted-foreground">
                Another beautiful moment captured
              </p>
            </div>
            <Sparkles className="h-12 w-12 text-primary animate-sparkle" />
          </div>
        </div>

        {/* Floating sparkles */}
        <div className="absolute -top-8 -left-8 text-4xl animate-float">✨</div>
        <div className="absolute -top-8 -right-8 text-4xl animate-float" style={{ animationDelay: "0.5s" }}>💫</div>
        <div className="absolute -bottom-8 left-8 text-4xl animate-float" style={{ animationDelay: "1s" }}>🌟</div>
        <div className="absolute -bottom-8 right-8 text-4xl animate-float" style={{ animationDelay: "1.5s" }}>✨</div>
      </div>
    </div>
  );
};

export default MemorySavedAnimation;
