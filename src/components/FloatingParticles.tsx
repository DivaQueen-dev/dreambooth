const FloatingParticles = () => {
  const particles = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
      {particles.map((i) => (
        <div
          key={i}
          className="absolute w-0.5 h-0.5 bg-primary/10 rounded-full animate-float"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${12 + Math.random() * 15}s`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;
