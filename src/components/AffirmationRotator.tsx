import { useState, useEffect } from "react";

const affirmations = [
  "You are art.",
  "You are allowed to be both soft and strong.",
  "The way you love yourself teaches the world how to love you.",
  "Even broken things reflect light.",
  "Healing is not linear but it's beautiful.",
  "You are becoming someone you'd be proud to know.",
];

const AffirmationRotator = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % affirmations.length);
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-8 overflow-hidden">
      {affirmations.map((affirmation, index) => (
        <p
          key={index}
          className={`absolute inset-0 text-lg md:text-xl text-foreground/80 italic transition-all duration-1000 ${
            index === currentIndex
              ? "opacity-100 translate-y-0"
              : index < currentIndex
              ? "opacity-0 -translate-y-8"
              : "opacity-0 translate-y-8"
          }`}
        >
          {affirmation}
        </p>
      ))}
    </div>
  );
};

export default AffirmationRotator;
