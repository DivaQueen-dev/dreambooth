import { X, Heart, Share2, Download, ImageIcon, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useAestheticSounds } from "@/hooks/useAestheticSounds";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import MoodFilter from "./MoodFilter";

interface Memory {
  image: string;
  caption: string;
  reflection?: string;
  id: string;
  isFavorite?: boolean;
  mood?: string;
}

interface MemoriesBoardProps {
  memories: Memory[];
  onClose: () => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const MemoriesBoard = ({ memories, onClose, onDelete, onToggleFavorite }: MemoriesBoardProps) => {
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const { playClick } = useAestheticSounds();

  const toggleLike = (id: string) => {
    playClick();
    setLikedPhotos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleDeleteConfirm = () => {
    playClick();
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
      toast.success("Memory released ✨");
    }
  };

  const filteredMemories = memories.filter((memory) => {
    if (selectedMood === null) return true;
    return memory.mood === selectedMood;
  });

  const shareMemory = async (memory: Memory) => {
    playClick();
    try {
      // Create a canvas for social media optimized export
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Instagram post format (1080x1080)
      canvas.width = 1080;
      canvas.height = 1080;

      // Load and draw image
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = async () => {
        // Draw background
        ctx.fillStyle = "#f5f0ed";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw image centered
        const size = Math.min(img.width, img.height);
        const x = (img.width - size) / 2;
        const y = (img.height - size) / 2;
        ctx.drawImage(img, x, y, size, size, 100, 100, 880, 880);

        // Add caption at bottom
        if (memory.caption) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
          ctx.fillRect(100, 900, 880, 100);
          ctx.fillStyle = "#4a3f35";
          ctx.font = "28px serif";
          ctx.textAlign = "center";
          ctx.fillText(memory.caption, 540, 960);
        }

        canvas.toBlob(async (blob) => {
          if (!blob) return;
          
          const file = new File([blob], "memory.jpg", { type: "image/jpeg" });
          
          if (navigator.share && navigator.canShare?.({ files: [file] })) {
            await navigator.share({
              title: memory.caption,
              text: memory.reflection || memory.caption,
              files: [file],
            });
            toast.success("Memory shared successfully!");
          } else {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `memory-${Date.now()}.jpg`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("Memory downloaded for sharing!");
          }
        }, "image/jpeg", 0.9);
      };
      img.src = memory.image;
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share memory");
    }
  };

  const downloadMemory = (memory: Memory) => {
    playClick();
    const a = document.createElement("a");
    a.href = memory.image;
    a.download = `memory-${Date.now()}.png`;
    a.click();
    toast.success("Memory downloaded! 📸");
  };

  if (filteredMemories.length === 0 && selectedMood === null && memories.length === 0) {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-lg z-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">
            No Memories Yet
          </h2>
          <p className="text-muted-foreground mb-6">
            Start capturing beautiful moments to see them here
          </p>
          <Button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="bg-primary hover:bg-primary/90 text-white rounded-full"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-lg z-50 overflow-auto py-8">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            Your Memories
          </h2>
          <Button
            onClick={() => {
              playClick();
              onClose();
            }}
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <MoodFilter selectedMood={selectedMood} onMoodChange={setSelectedMood} />

        {filteredMemories.length === 0 && selectedMood !== null ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No memories found for this mood
            </p>
          </div>
        ) : null}

        {/* Masonry Grid */}
        {filteredMemories.length > 0 && (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {filteredMemories.map((memory, index) => (
              <div
                key={memory.id}
                className="break-inside-avoid animate-fade-in-slow"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
              <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 break-inside-avoid animate-fade-in-slow">
                <div className="relative group">
                  <img
                    src={memory.image}
                    alt={memory.caption}
                    className="w-full h-auto rounded-lg mb-3"
                  />
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full backdrop-blur-sm"
                      onClick={() => {
                        playClick();
                        onToggleFavorite(memory.id);
                      }}
                    >
                      <Star
                        className={`h-5 w-5 ${
                          memory.isFavorite
                            ? "fill-primary text-primary"
                            : ""
                        }`}
                      />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full backdrop-blur-sm"
                      onClick={() => toggleLike(memory.id)}
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          likedPhotos.has(memory.id)
                            ? "fill-primary text-primary"
                            : ""
                        }`}
                      />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full backdrop-blur-sm"
                      onClick={() => shareMemory(memory)}
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full backdrop-blur-sm"
                      onClick={() => downloadMemory(memory)}
                    >
                      <Download className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="rounded-full backdrop-blur-sm"
                      onClick={() => {
                        playClick();
                        setDeleteId(memory.id);
                      }}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="handwritten text-primary text-center">
                    {memory.caption}
                  </p>
                  {memory.reflection && (
                    <p className="text-xs text-muted-foreground italic text-center">
                      {memory.reflection}
                    </p>
                  )}
                  {memory.mood && (
                    <div className="flex justify-center">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary capitalize">
                        {memory.mood}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Release this memory?</AlertDialogTitle>
            <AlertDialogDescription>
              This memory will be gently released from your collection. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Release
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MemoriesBoard;
