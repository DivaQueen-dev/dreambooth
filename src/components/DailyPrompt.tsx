import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const prompts = [
  "What made you smile today?",
  "What are you proud of right now?",
  "What does your heart need today?",
  "What are you grateful for in this moment?",
  "How did you show yourself love today?",
  "What beauty did you notice today?",
  "What would you tell your younger self?",
];

const DailyPrompt = () => {
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    // Get day of year to have consistent daily prompt
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        86400000
    );
    setPrompt(prompts[dayOfYear % prompts.length]);
  }, []);

  return (
    <div className="glass-effect rounded-2xl p-6 max-w-2xl mx-auto mb-12 animate-fade-in-slow border border-primary/10">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-primary">Today's Reflection</h3>
      </div>
      <p className="text-foreground/80 italic text-lg">{prompt}</p>
    </div>
  );
};

export default DailyPrompt;
