import { useState, useEffect } from "react";

interface AnimatedCurtainsProps {
  onHover?: boolean;
}

const AnimatedCurtains = ({ onHover = false }: AnimatedCurtainsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [leftCurtainOpen, setLeftCurtainOpen] = useState(false);
  const [rightCurtainOpen, setRightCurtainOpen] = useState(false);

  // Remove auto-open on mount - curtains should start closed and open on scroll
  // useEffect(() => {
  //   const timer = setTimeout(() => setIsOpen(true), 500);
  //   return () => clearTimeout(timer);
  // }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Open when user scrolls a bit, close when back to top
      if (currentScrollY >= 20) {
        setScrollDirection('down');
        setIsOpen(true);
      } else {
        setScrollDirection('up');
        setIsOpen(false);
        // Ensure both curtains fully close
        setLeftCurtainOpen(false);
        setRightCurtainOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initialize state based on current position
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Enhanced edge detection - 30% from edges for better responsiveness
      const leftEdgeThreshold = windowWidth * 0.3;
      const rightEdgeThreshold = windowWidth * 0.7;
      
      // Calculate proximity to edges (0 = far, 1 = at edge)
      const leftProximity = e.clientX < leftEdgeThreshold 
        ? 1 - (e.clientX / leftEdgeThreshold)
        : 0;
      const rightProximity = e.clientX > rightEdgeThreshold 
        ? (e.clientX - rightEdgeThreshold) / (windowWidth - rightEdgeThreshold)
        : 0;
      
      // Vertical position influence (top 30% of screen)
      const topProximity = e.clientY / windowHeight;
      const isInTopArea = topProximity < 0.3;
      
      // Open curtains based on cursor position with lower threshold for better response
      // Left curtain opens when cursor is on left side
      if (leftProximity > 0.1 || (isInTopArea && e.clientX < windowWidth * 0.4)) {
        setLeftCurtainOpen(true);
      } else {
        setLeftCurtainOpen(false);
      }
      
      // Right curtain opens when cursor is on right side
      if (rightProximity > 0.1 || (isInTopArea && e.clientX > windowWidth * 0.6)) {
        setRightCurtainOpen(true);
      } else {
        setRightCurtainOpen(false);
      }
      
      // Open both curtains completely when in center top area
      if (isInTopArea && e.clientX > windowWidth * 0.35 && e.clientX < windowWidth * 0.65) {
        setLeftCurtainOpen(true);
        setRightCurtainOpen(true);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const curtainBaseClass = "absolute top-0 h-full w-1/2 transition-all duration-700 ease-out";
  const curtainGradient = "bg-gradient-to-b from-white/20 via-white/15 to-white/10 dark:from-black/20 dark:via-black/15 dark:to-black/10";
  const curtainShimmer = "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:animate-[shimmer_3s_ease-in-out_infinite]";
  const shouldOpen = isOpen || (onHover && isHovered);
  const shouldOpenLeft = shouldOpen || leftCurtainOpen;
  const shouldOpenRight = shouldOpen || rightCurtainOpen;

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[5] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left curtain */}
      <div
        className={`${curtainBaseClass} ${curtainGradient} ${curtainShimmer} left-0 border-r border-primary/10 animate-curtain-sway ${
          shouldOpenLeft ? "-translate-x-full" : ""
        }`}
        style={{
          boxShadow: "10px 0 30px rgba(0,0,0,0.05)",
          animationDelay: "0s",
        }}
      >
        {/* Curtain folds */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute h-full w-[2px] bg-gradient-to-b from-foreground/5 to-transparent"
              style={{ left: `${(i + 1) * 12}%` }}
            />
          ))}
        </div>
      </div>

      {/* Right curtain */}
      <div
        className={`${curtainBaseClass} ${curtainGradient} ${curtainShimmer} right-0 border-l border-primary/10 animate-curtain-sway ${
          shouldOpenRight ? "translate-x-full" : ""
        }`}
        style={{
          boxShadow: "-10px 0 30px rgba(0,0,0,0.05)",
          animationDelay: "1s",
        }}
      >
        {/* Curtain folds */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute h-full w-[2px] bg-gradient-to-b from-foreground/5 to-transparent"
              style={{ right: `${(i + 1) * 12}%` }}
            />
          ))}
        </div>
      </div>

      {/* Curtain rod */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
    </div>
  );
};

export default AnimatedCurtains;
