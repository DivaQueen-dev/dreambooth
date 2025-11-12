const quotes = [
  "You are the poetry you've been seeking.",
  "Even starlight envies your softness.",
  "You are your own home.",
  "Soft doesn't mean small.",
  "I became the love I was waiting for.",
  "Every photo is proof that you were magic once.",
];

const FloatingQuotes = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden opacity-60">
      {quotes.slice(0, 4).map((quote, index) => (
        <div
          key={index}
          className="absolute animate-drift transition-all duration-1000"
          style={{
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 80 + 10}%`,
            animationDelay: `${index * 4}s`,
            animationDuration: `${30 + index * 5}s`,
          }}
        >
          <p className="relative text-base md:text-lg font-script text-primary/30 rotate-[-2deg] drop-shadow-sm">
            {quote}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FloatingQuotes;
