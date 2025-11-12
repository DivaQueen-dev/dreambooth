import { X, Star, Heart, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import MoodFilter from "./MoodFilter";

interface Memory {
  image: string;
  caption: string;
  reflection?: string;
  id: string;
  isFavorite?: boolean;
  mood?: string;
  timestamp: number;
}

interface JournalViewProps {
  memories: Memory[];
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
}

const JournalView = ({ memories, onClose, onToggleFavorite }: JournalViewProps) => {
  const [filter, setFilter] = useState<"all" | "favorites" | "reflections">("all");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const filteredMemories = memories
    .filter((memory) => {
      if (filter === "favorites") return memory.isFavorite;
      if (filter === "reflections") return memory.reflection && memory.reflection.trim() !== "";
      return true;
    })
    .filter((memory) => {
      if (selectedMood === null) return true;
      return memory.mood === selectedMood;
    })
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="fixed inset-0 bg-background/98 backdrop-blur-lg z-50 overflow-auto">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Your Journal
            </h2>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className="rounded-full"
            >
              All
            </Button>
            <Button
              variant={filter === "favorites" ? "default" : "outline"}
              onClick={() => setFilter("favorites")}
              className="rounded-full"
            >
              <Star className="h-4 w-4 mr-2" />
              Favorites
            </Button>
            <Button
              variant={filter === "reflections" ? "default" : "outline"}
              onClick={() => setFilter("reflections")}
              className="rounded-full"
            >
              <Heart className="h-4 w-4 mr-2" />
              Reflections
            </Button>
          </div>

          <MoodFilter selectedMood={selectedMood} onMoodChange={setSelectedMood} />
        </div>

        {/* Journal Entries */}
        {filteredMemories.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg mb-2">No memories found</p>
            <p className="text-muted-foreground text-sm italic">
              {filter === "favorites"
                ? "Star your favorite moments to see them here"
                : filter === "reflections"
                ? "Add reflections to your photos to see them here"
                : "Start capturing memories to build your journal"}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredMemories.map((memory, index) => (
              <div
                key={memory.id}
                className="glass-effect rounded-2xl p-6 md:p-8 shadow-soft animate-fade-in-slow"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="grid md:grid-cols-[300px,1fr] gap-6 items-start">
                  {/* Polaroid Photo */}
                  <div className="bg-white p-3 rounded-lg shadow-md">
                    <div className="aspect-square bg-muted rounded overflow-hidden mb-2">
                      <img
                        src={memory.image}
                        alt={memory.caption}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="handwritten text-primary text-center text-sm">
                      {memory.caption}
                    </p>
                  </div>

                  {/* Journal Entry */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {new Date(memory.timestamp).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleFavorite(memory.id)}
                        className="rounded-full"
                      >
                        <Star
                          className={`h-5 w-5 ${
                            memory.isFavorite
                              ? "fill-primary text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      </Button>
                    </div>

                    {memory.mood && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm capitalize">
                        {memory.mood}
                      </div>
                    )}

                    {memory.reflection && (
                      <div className="prose prose-sm max-w-none">
                        <p className="text-foreground/80 leading-relaxed italic">
                          {memory.reflection}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalView;
