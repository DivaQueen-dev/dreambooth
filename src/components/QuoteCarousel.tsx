import { useState, useEffect } from "react";

const quotes = [
  "Even broken things reflect light.",
  "Healing is not linear but it's beautiful.",
  "You are becoming someone you'd be proud to know.",
  "The way you love yourself teaches the world how to love you.",
  "You are allowed to take up space.",
  "Your softness is your strength.",
];

const QuoteCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-20 left-0 right-0 z-20 pointer-events-none">
      <div className="container mx-auto px-4">
        <div className="relative h-12 overflow-hidden">
          {quotes.map((quote, index) => (
            <p
              key={index}
              className={`absolute inset-0 text-center text-sm md:text-base text-foreground/60 italic transition-all duration-1000 ${
                index === currentIndex
                  ? "opacity-100 translate-y-0"
                  : index < currentIndex
                  ? "opacity-0 -translate-y-12"
                  : "opacity-0 translate-y-12"
              }`}
            >
              {quote}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuoteCarousel;
