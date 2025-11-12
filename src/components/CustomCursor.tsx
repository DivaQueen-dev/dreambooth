import { useEffect, useState } from "react";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    let trailId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Add pixel trail
      setTrail((prev) => {
        const newTrail = [
          ...prev,
          { x: e.clientX, y: e.clientY, id: trailId++ }
        ];
        return newTrail.slice(-6);
      });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    const interval = setInterval(() => {
      setTrail((prev) => prev.slice(1));
    }, 80);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {/* Main pixel cursor */}
      <div
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" className={`transition-transform ${isClicking ? 'scale-90' : ''}`}>
          {/* Outer glow */}
          <rect x="10" y="8" width="4" height="4" fill="#ffc0cb" opacity="0.3" />
          <rect x="18" y="8" width="4" height="4" fill="#ffc0cb" opacity="0.3" />
          <rect x="6" y="12" width="4" height="4" fill="#ffc0cb" opacity="0.3" />
          <rect x="22" y="12" width="4" height="4" fill="#ffc0cb" opacity="0.3" />
          <rect x="6" y="16" width="4" height="4" fill="#ffc0cb" opacity="0.3" />
          <rect x="22" y="16" width="4" height="4" fill="#ffc0cb" opacity="0.3" />
          <rect x="10" y="20" width="4" height="4" fill="#ffc0cb" opacity="0.3" />
          <rect x="18" y="20" width="4" height="4" fill="#ffc0cb" opacity="0.3" />
          <rect x="14" y="24" width="4" height="4" fill="#ffc0cb" opacity="0.3" />
          
          {/* Main heart shape - pixel art */}
          <rect x="10" y="10" width="4" height="4" fill="#ff69b4" />
          <rect x="18" y="10" width="4" height="4" fill="#ff69b4" />
          <rect x="6" y="14" width="4" height="4" fill="#ff69b4" />
          <rect x="10" y="14" width="4" height="4" fill="#ffb6c1" />
          <rect x="14" y="14" width="4" height="4" fill="#ffb6c1" />
          <rect x="18" y="14" width="4" height="4" fill="#ffb6c1" />
          <rect x="22" y="14" width="4" height="4" fill="#ff69b4" />
          <rect x="6" y="18" width="4" height="4" fill="#ff69b4" />
          <rect x="10" y="18" width="4" height="4" fill="#ffc0cb" />
          <rect x="14" y="18" width="4" height="4" fill="#ffb6c1" />
          <rect x="18" y="18" width="4" height="4" fill="#ffc0cb" />
          <rect x="22" y="18" width="4" height="4" fill="#ff69b4" />
          <rect x="10" y="22" width="4" height="4" fill="#ff69b4" />
          <rect x="14" y="22" width="4" height="4" fill="#ffb6c1" />
          <rect x="18" y="22" width="4" height="4" fill="#ff69b4" />
          <rect x="14" y="26" width="4" height="4" fill="#ff1493" />
          
          {/* Pixel sparkle top-right */}
          <rect x="24" y="6" width="2" height="2" fill="#fff" opacity="0.9" />
          <rect x="22" y="8" width="2" height="2" fill="#ffb6c1" opacity="0.8" />
          <rect x="26" y="8" width="2" height="2" fill="#ffb6c1" opacity="0.8" />
          
          {/* Pixel sparkle bottom-left */}
          <rect x="6" y="24" width="2" height="2" fill="#fff" opacity="0.9" />
          <rect x="4" y="26" width="2" height="2" fill="#ffb6c1" opacity="0.8" />
          <rect x="8" y="26" width="2" height="2" fill="#ffb6c1" opacity="0.8" />
        </svg>
      </div>

      {/* Pixel trail */}
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="fixed pointer-events-none z-[9998]"
          style={{
            left: `${point.x}px`,
            top: `${point.y}px`,
            transform: "translate(-50%, -50%)",
            opacity: ((index + 1) / trail.length) * 0.6,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <rect x="4" y="4" width="8" height="8" fill="#ffb6c1" opacity="0.7" />
            <rect x="6" y="6" width="4" height="4" fill="#ffc0cb" />
          </svg>
        </div>
      ))}
    </>
  );
};

export default CustomCursor;
