import PolaroidCard from "@/components/PolaroidCard";
import CustomCursor from "@/components/CustomCursor";
import FloatingQuotes from "@/components/FloatingQuotes";
import EnhancedFloatingParticles from "@/components/EnhancedFloatingParticles";
import AnimatedCurtains from "@/components/AnimatedCurtains";
import FloatingHearts from "@/components/FloatingHearts";
import MusicPlayer from "@/components/MusicPlayer";
import AuroraEffect from "@/components/AuroraEffect";
import AddMemoryButton from "@/components/AddMemoryButton";
import DreamyFooter from "@/components/DreamyFooter";
import WebcamCapture from "@/components/WebcamCapture";
import PhotoStrip from "@/components/PhotoStrip";
import MemoriesBoard from "@/components/MemoriesBoard";
import HeroSection from "@/components/HeroSection";
import JournalView from "@/components/JournalView";
import DailyPrompt from "@/components/DailyPrompt";
import QuoteCarousel from "@/components/QuoteCarousel";
import AnimationSettings from "@/components/AnimationSettings";
import { PhotoEditor } from "@/components/PhotoEditor";
import { useState, useEffect } from "react";
import { saveMemories, loadMemories, deleteMemory, updateMemory } from "@/lib/indexedDB";
import { toast } from "sonner";
import { Book, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import MemorySavedAnimation from "@/components/MemorySavedAnimation";
import CollageCanvas from "@/components/CollageCanvas";

import memory1 from "@/assets/vintage-moment-1.jpg";
import memory2 from "@/assets/vintage-moment-2.jpg";
import memory3 from "@/assets/vintage-moment-3.jpg";
import memory4 from "@/assets/vintage-moment-4.jpg";
import memory5 from "@/assets/vintage-moment-5.jpg";
import memory6 from "@/assets/vintage-moment-6.jpg";

interface Memory {
  image: string;
  caption: string;
  reflection?: string;
  id: string;
  isFavorite?: boolean;
  mood?: string;
  timestamp: number;
}

const defaultMemories = [
  { image: memory1, caption: "golden hour forever", message: "our memory", tiltClass: "polaroid-tilt-1" },
  { image: memory2, caption: "blooming together", message: "summer 2025", tiltClass: "polaroid-tilt-2" },
  { image: memory3, caption: "sunset dreams", message: "you & me", tiltClass: "polaroid-tilt-3" },
  { image: memory4, caption: "our favorite song", message: "timeless", tiltClass: "polaroid-tilt-4" },
  { image: memory5, caption: "magic nights", message: "forever young", tiltClass: "polaroid-tilt-5" },
  { image: memory6, caption: "endless summer", message: "we were golden", tiltClass: "polaroid-tilt-6" },
];

const Index = () => {
  const [showWebcam, setShowWebcam] = useState(false);
  const [showPhotoStrip, setShowPhotoStrip] = useState(false);
  const [showMemoriesBoard, setShowMemoriesBoard] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [showHearts, setShowHearts] = useState(false);
  const [savedMemories, setSavedMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMood, setCurrentMood] = useState<string | undefined>(undefined);
  const [showMemorySaved, setShowMemorySaved] = useState(false);
  const [showCollageCanvas, setShowCollageCanvas] = useState(false);
  const [showPhotoEditor, setShowPhotoEditor] = useState(false);
  const [editingPhotoIndex, setEditingPhotoIndex] = useState<number>(0);

  useEffect(() => {
    loadSavedMemories();
  }, []);

  const loadSavedMemories = async () => {
    try {
      const memories = await loadMemories();
      setSavedMemories(memories);
    } catch (error) {
      console.error("Error loading memories:", error);
      toast.error("Could not load saved memories");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotosCapture = (photos: string[]) => {
    setCapturedPhotos(photos);
    setShowWebcam(false);
    // Show photo editor for first photo
    setEditingPhotoIndex(0);
    setShowPhotoEditor(true);
    setShowHearts(true);
    setTimeout(() => setShowHearts(false), 3000);
  };

  const handlePhotoEdited = (editedImage: string) => {
    // Replace the photo at the current index with the edited version
    const newPhotos = [...capturedPhotos];
    newPhotos[editingPhotoIndex] = editedImage;
    setCapturedPhotos(newPhotos);
    
    // Move to next photo or finish editing
    if (editingPhotoIndex < capturedPhotos.length - 1) {
      setEditingPhotoIndex(editingPhotoIndex + 1);
    } else {
      // All photos edited, show photo strip
      setShowPhotoEditor(false);
      setShowPhotoStrip(true);
    }
  };

  const handleSkipEditing = () => {
    setShowPhotoEditor(false);
    setShowPhotoStrip(true);
  };

  const handleSavePhotos = async (photos: { image: string; caption: string; reflection: string; mood?: string }[]) => {
    try {
      const newMemories = photos.map((photo) => ({
        ...photo,
        id: `${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
      }));
      
      await saveMemories(newMemories);
      setSavedMemories([...newMemories, ...savedMemories]);
      setShowPhotoStrip(false);
      
      // Show memory saved animation
      setShowMemorySaved(true);
      setTimeout(() => setShowMemorySaved(false), 3000);
      
      toast.success("Memories saved! ✨", {
        description: "Your beautiful moments are now in your collection",
      });
    } catch (error) {
      console.error("Error saving memories:", error);
      toast.error("Could not save memories. Please try again.");
    }
  };

  const handleDeleteMemory = async (id: string) => {
    try {
      await deleteMemory(id);
      setSavedMemories(savedMemories.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Error deleting memory:", error);
      toast.error("Could not delete memory");
    }
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      const memory = savedMemories.find((m) => m.id === id);
      if (!memory) return;
      
      await updateMemory(id, { isFavorite: !memory.isFavorite });
      setSavedMemories(
        savedMemories.map((m) =>
          m.id === id ? { ...m, isFavorite: !m.isFavorite } : m
        )
      );
    } catch (error) {
      console.error("Error updating favorite:", error);
      toast.error("Could not update favorite");
    }
  };

  const handleSaveCollage = async (collageImage: string, caption: string) => {
    try {
      const newMemory = {
        image: collageImage,
        caption: caption,
        reflection: "Created with Collage Maker ✨",
        id: `collage-${Date.now()}`,
        timestamp: Date.now(),
      };
      
      await saveMemories([newMemory]);
      setSavedMemories([newMemory, ...savedMemories]);
      
      toast.success("Collage saved! 🎨", {
        description: "Your beautiful creation is now in your memories",
      });
    } catch (error) {
      console.error("Error saving collage:", error);
      toast.error("Could not save collage. Please try again.");
    }
  };

  const allMemories = [
    ...savedMemories,
    ...defaultMemories.map((m, i) => ({
      image: m.image,
      caption: m.caption,
      id: `default-${i}`,
      timestamp: Date.now() - i * 1000,
    })),
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Custom cursor */}
      <CustomCursor />
      
      {/* Animated curtains */}
      <AnimatedCurtains />
      
      {/* Background effects */}
      <AuroraEffect />
      <EnhancedFloatingParticles />
      <FloatingQuotes />
      {showHearts && <FloatingHearts />}
      <QuoteCarousel />
      
      {/* Main content */}
      
      {/* Action Buttons */}
      <div className="fixed top-8 right-4 md:right-8 z-30 flex gap-3">
        <Button
          onClick={() => setShowCollageCanvas(true)}
          className="rounded-full shadow-elegant hover:scale-110 transition-all duration-300 font-script text-base"
          size="lg"
          variant="outline"
        >
          <Sparkles className="h-5 w-5 mr-2" />
          Collage Maker
        </Button>
        <Button
          onClick={() => setShowJournal(true)}
          className="rounded-full shadow-elegant glow-lavender hover:scale-110 transition-all duration-300 font-script text-base"
          size="lg"
        >
          <Book className="h-5 w-5 mr-2" />
          My Journal
        </Button>
      </div>
      
      <main className="relative z-10">
        {/* Hero Section */}
        <HeroSection onStartCapture={() => setShowWebcam(true)} />

        <div className="container mx-auto px-4 md:px-6 py-16">
          {/* Daily Prompt */}
          <DailyPrompt />
          {/* Section Title */}
          <div className="text-center mb-16 animate-fade-in-slow">
            <div className="inline-flex items-center gap-2 mb-4 px-6 py-3 rounded-full glass-effect shadow-soft">
              <span className="text-sm font-sans text-primary tracking-wide">✨ Featured Memories ✨</span>
            </div>
            <h2 className="font-title text-4xl md:text-6xl font-bold text-primary mb-6 tracking-wider uppercase">
              Recent Captures
            </h2>
            <p className="text-lg font-sans text-foreground/70 italic max-w-2xl mx-auto leading-relaxed">
              Every polaroid tells a story, every caption holds a memory
            </p>
          </div>

          {/* Polaroid grid with stagger animation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto">
            {/* Show user's saved memories first */}
            {savedMemories.slice(0, 6).map((memory, index) => (
              <div 
                key={memory.id}
                className="animate-fade-in-slow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PolaroidCard
                  image={memory.image}
                  caption={memory.caption}
                  message={memory.reflection || "precious memory"}
                  tiltClass={`polaroid-tilt-${(index % 6) + 1}`}
                />
              </div>
            ))}
            
            {/* Fill remaining spots with default memories */}
            {defaultMemories.slice(0, Math.max(0, 6 - savedMemories.length)).map((memory, index) => (
              <div 
                key={`default-${index}`}
                className="animate-fade-in-slow"
                style={{ animationDelay: `${(savedMemories.length + index) * 0.1}s` }}
              >
                <PolaroidCard
                  image={memory.image}
                  caption={memory.caption}
                  message={memory.message}
                  tiltClass={memory.tiltClass}
                />
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <AddMemoryButton
            onCapture={() => setShowWebcam(true)}
            onViewBoard={() => setShowMemoriesBoard(true)}
            memoriesCount={savedMemories.length}
          />
        </div>
      </main>

      {/* Footer */}
      <DreamyFooter />

      {/* Music player */}
      <MusicPlayer />

      {/* Modals */}
      {showWebcam && (
        <WebcamCapture
          onPhotosCapture={handlePhotosCapture}
          onClose={() => setShowWebcam(false)}
        />
      )}

      {showPhotoEditor && capturedPhotos.length > 0 && (
        <PhotoEditor
          imageUrl={capturedPhotos[editingPhotoIndex]}
          onSave={handlePhotoEdited}
          onClose={handleSkipEditing}
        />
      )}

      {showPhotoStrip && (
        <PhotoStrip
          photos={capturedPhotos}
          onSave={handleSavePhotos}
          onClose={() => setShowPhotoStrip(false)}
          currentMood={currentMood}
        />
      )}

      {showMemoriesBoard && (
        <MemoriesBoard
          memories={allMemories}
          onClose={() => setShowMemoriesBoard(false)}
          onDelete={handleDeleteMemory}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {showJournal && (
        <JournalView
          memories={savedMemories}
          onClose={() => setShowJournal(false)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {showCollageCanvas && (
        <CollageCanvas
          memories={savedMemories}
          onClose={() => setShowCollageCanvas(false)}
          onSave={handleSaveCollage}
        />
      )}

      {/* Memory saved animation */}
      {showMemorySaved && <MemorySavedAnimation />}
      
      {/* Animation Settings */}
      <AnimationSettings />
    </div>
  );
};

export default Index;
