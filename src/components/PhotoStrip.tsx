import { Download, Heart, Sparkles, Sticker, Flower2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PhotoStripProps {
  photos: string[];
  onSave: (photos: { image: string; caption: string; reflection: string; mood?: string }[]) => void;
  onClose: () => void;
  currentMood?: string;
}

type BouquetTheme = "vintage-rose" | "lavender-dreams" | "wildflower" | "garden-party" | "cherry-blossom";

interface ThemeStyles {
  name: string;
  emoji: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  captionSuggestions: string[];
}

const bouquetThemes: Record<BouquetTheme, ThemeStyles> = {
  "vintage-rose": {
    name: "Vintage Rose",
    emoji: "🌹",
    bgGradient: "from-rose-50 via-pink-50 to-red-50",
    borderColor: "border-rose-300",
    textColor: "text-rose-900",
    captionSuggestions: [
      "like a rose in bloom 🌹",
      "timeless beauty",
      "vintage hearts forever",
      "romantic memories",
      "in full bloom"
    ]
  },
  "lavender-dreams": {
    name: "Lavender Dreams",
    emoji: "💜",
    bgGradient: "from-purple-50 via-lavender-50 to-violet-50",
    borderColor: "border-purple-300",
    textColor: "text-purple-900",
    captionSuggestions: [
      "dreaming in lavender 💜",
      "soft purple haze",
      "ethereal moments",
      "gentle dreams",
      "lavender fields forever"
    ]
  },
  "wildflower": {
    name: "Wildflower",
    emoji: "🌼",
    bgGradient: "from-yellow-50 via-amber-50 to-orange-50",
    borderColor: "border-yellow-300",
    textColor: "text-amber-900",
    captionSuggestions: [
      "wild & free 🌼",
      "sunshine moments",
      "golden hour magic",
      "blooming beautiful",
      "free spirit energy"
    ]
  },
  "garden-party": {
    name: "Garden Party",
    emoji: "🌸",
    bgGradient: "from-pink-50 via-fuchsia-50 to-purple-50",
    borderColor: "border-pink-300",
    textColor: "text-fuchsia-900",
    captionSuggestions: [
      "garden of dreams 🌸",
      "floral fantasy",
      "blooming together",
      "petal perfect",
      "in the garden"
    ]
  },
  "cherry-blossom": {
    name: "Cherry Blossom",
    emoji: "🌸",
    bgGradient: "from-pink-100 via-rose-100 to-pink-50",
    borderColor: "border-pink-400",
    textColor: "text-pink-900",
    captionSuggestions: [
      "cherry blossom dreams 🌸",
      "sakura season",
      "fleeting beauty",
      "spring forever",
      "under the blossoms"
    ]
  }
};

const PhotoStrip = ({ photos, onSave, onClose, currentMood }: PhotoStripProps) => {
  const [selectedTheme, setSelectedTheme] = useState<BouquetTheme>("vintage-rose");
  const [captions, setCaptions] = useState<string[]>(
    photos.map(() => "a beautiful moment ✨")
  );
  const [reflections, setReflections] = useState<string[]>(
    photos.map(() => "")
  );
  const [likedPhotos, setLikedPhotos] = useState<boolean[]>(
    photos.map(() => false)
  );
  const [selectedStickers, setSelectedStickers] = useState<string[][]>(
    photos.map(() => ["💗", "✨"])
  );

  // Play aesthetic click sound
  const playClick = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRhYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQIAAAAAAA==');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const availableStickers = [
    "💗", "💕", "💖", "💝", "✨", "⭐", "🌟", "💫",
    "🦋", "🌸", "🌺", "🌼", "🌻", "🌷", "🌹", "🎀",
    "🌙", "☁️", "🌈", "🧚", "🍒", "🍓", "🎨", "📷",
    "💐", "🌿", "🍃", "🦄", "👑", "💎", "🎭", "🎪"
  ];

  const updateCaption = (index: number, value: string) => {
    playClick();
    const newCaptions = [...captions];
    newCaptions[index] = value;
    setCaptions(newCaptions);
  };

  const applySuggestion = (index: number, suggestion: string) => {
    playClick();
    const newCaptions = [...captions];
    newCaptions[index] = suggestion;
    setCaptions(newCaptions);
    toast.success("Caption applied! ✨");
  };

  const updateReflection = (index: number, value: string) => {
    const newReflections = [...reflections];
    newReflections[index] = value;
    setReflections(newReflections);
  };

  const toggleLike = (index: number) => {
    playClick();
    const newLikes = [...likedPhotos];
    newLikes[index] = !newLikes[index];
    setLikedPhotos(newLikes);
  };

  const toggleSticker = (photoIndex: number, sticker: string) => {
    playClick();
    const newStickers = [...selectedStickers];
    if (newStickers[photoIndex].includes(sticker)) {
      newStickers[photoIndex] = newStickers[photoIndex].filter(s => s !== sticker);
    } else {
      newStickers[photoIndex] = [...newStickers[photoIndex], sticker];
    }
    setSelectedStickers(newStickers);
  };

  const handleSave = () => {
    playClick();
    const photosWithData = photos.map((photo, index) => ({
      image: photo,
      caption: captions[index],
      reflection: reflections[index],
      mood: currentMood,
    }));
    onSave(photosWithData);
  };

  const downloadPhotoStrip = () => {
    playClick();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const stripWidth = 800;
    const photoHeight = 600;
    const padding = 40;
    const captionHeight = 80;
    
    canvas.width = stripWidth;
    canvas.height = photos.length * (photoHeight + captionHeight + padding) + padding;

    // Get current theme
    const appliedTheme = bouquetThemes[selectedTheme];

    // Background with theme-based gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    const themeColors: Record<BouquetTheme, { start: string; end: string }> = {
      "vintage-rose": { start: "#fff5f5", end: "#ffe4e6" },
      "lavender-dreams": { start: "#faf5ff", end: "#f3e8ff" },
      "wildflower": { start: "#fffbeb", end: "#fef3c7" },
      "garden-party": { start: "#fdf4ff", end: "#fae8ff" },
      "cherry-blossom": { start: "#fce7f3", end: "#fbcfe8" }
    };
    gradient.addColorStop(0, themeColors[selectedTheme].start);
    gradient.addColorStop(1, themeColors[selectedTheme].end);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add theme emoji watermarks in corners
    ctx.font = "40px Arial";
    ctx.globalAlpha = 0.15;
    ctx.fillText(appliedTheme.emoji, 20, 50);
    ctx.fillText(appliedTheme.emoji, canvas.width - 60, 50);
    ctx.fillText(appliedTheme.emoji, 20, canvas.height - 20);
    ctx.fillText(appliedTheme.emoji, canvas.width - 60, canvas.height - 20);
    ctx.globalAlpha = 1.0;

    // Draw aesthetic stickers helper function
    const drawSticker = (x: number, y: number, emoji: string, size: number = 30) => {
      ctx.font = `${size}px Arial`;
      ctx.fillText(emoji, x, y);
    };

    // Draw user-selected top stickers
    const topStickers = selectedStickers[0] || [];
    topStickers.slice(0, 4).forEach((sticker, i) => {
      const x = 50 + (i * 200);
      drawSticker(x, 30, sticker, 25);
    });

    photos.forEach((photo, index) => {
      const img = new Image();
      img.src = photo;
      
      const yPos = padding + index * (photoHeight + captionHeight + padding);
      
      // Draw polaroid frame with shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(
        padding / 2,
        yPos,
        stripWidth - padding,
        photoHeight + captionHeight
      );
      ctx.shadowColor = "transparent";
      
      // Draw photo
      ctx.drawImage(
        img,
        padding / 2 + 10,
        yPos + 10,
        stripWidth - padding - 20,
        photoHeight - 20
      );
      
      // Draw user-selected stickers for this photo
      const photoSelectedStickers = selectedStickers[index] || [];
      photoSelectedStickers.forEach((sticker, stickerIndex) => {
        const positions = [
          { x: padding / 2 - 15, y: yPos + 40 },
          { x: stripWidth - padding / 2 + 5, y: yPos + 60 },
          { x: padding / 2 - 10, y: yPos + 150 },
          { x: stripWidth - padding / 2 + 8, y: yPos + 200 },
          { x: padding / 2 - 12, y: yPos + 300 },
          { x: stripWidth - padding / 2 + 10, y: yPos + 350 },
          { x: padding / 2 - 8, y: yPos + photoHeight - 50 },
          { x: stripWidth - padding / 2 + 5, y: yPos + photoHeight - 80 },
        ];
        if (stickerIndex < positions.length) {
          drawSticker(positions[stickerIndex].x, positions[stickerIndex].y, sticker, 25);
        }
      });

      // Add cute doodle hearts near corners
      ctx.strokeStyle = "#f4a6c1";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(padding / 2 + 25, yPos + 25, 8, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw caption with handwritten style
      ctx.fillStyle = "#8b5a6b";
      ctx.font = "24px 'Dancing Script', cursive";
      ctx.textAlign = "center";
      ctx.fillText(
        captions[index],
        stripWidth / 2,
        yPos + photoHeight + 45
      );

      // Add small decorative hearts after caption
      drawSticker(stripWidth / 2 - 150, yPos + photoHeight + 48, "💕", 18);
      drawSticker(stripWidth / 2 + 140, yPos + photoHeight + 48, "💕", 18);
    });

    // Add bottom decorative stickers from last photo's selection
    const bottomY = canvas.height - 20;
    const lastPhotoStickers = selectedStickers[photos.length - 1] || [];
    lastPhotoStickers.slice(0, 4).forEach((sticker, i) => {
      const x = 100 + (i * 200);
      drawSticker(x, bottomY, sticker, 25);
    });

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `memories-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Photo strip downloaded! 📸");
      }
    });
  };

  const currentTheme = bouquetThemes[selectedTheme];

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-lg z-50 overflow-auto py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className={`glass-effect rounded-2xl p-6 md:p-8 shadow-dreamy bg-gradient-to-br ${currentTheme.bgGradient} border-2 ${currentTheme.borderColor} transition-all duration-500`}>
          <div className="text-center mb-8">
            <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${currentTheme.textColor}`}>
              Your Golden Moments ✨
            </h2>
            <p className="text-muted-foreground mb-4">
              Choose your bouquet style and add captions
            </p>
            
            {/* Bouquet Theme Selector */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <Flower2 className="h-5 w-5 text-primary" />
              <Select value={selectedTheme} onValueChange={(value: BouquetTheme) => {
                playClick();
                setSelectedTheme(value);
                toast.success(`${bouquetThemes[value].emoji} ${bouquetThemes[value].name} theme selected!`);
              }}>
                <SelectTrigger className="w-[220px] bg-white/80 backdrop-blur-sm hover:bg-white transition-colors border-2">
                  <SelectValue placeholder="Select a bouquet">
                    {currentTheme.emoji} {currentTheme.name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white backdrop-blur-lg border-2 z-[200] shadow-2xl">
                  {Object.entries(bouquetThemes).map(([key, theme]) => (
                    <SelectItem 
                      key={key} 
                      value={key}
                      className="cursor-pointer hover:bg-pink-100 focus:bg-pink-100 transition-colors"
                    >
                      {theme.emoji} {theme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {photos.map((photo, index) => (
              <div
                key={index}
                className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-soft p-4 animate-fade-in-slow border-2 ${currentTheme.borderColor}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-3 relative group">
                  <img
                    src={photo}
                    alt={`Memory ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Victorian vignette overlay */}
                  <div className="absolute inset-0 pointer-events-none" style={{
                    background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.15) 100%)'
                  }} />
                  <div className="absolute top-2 right-2 flex gap-2 z-10">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="p-2 bg-white/80 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110">
                          <Sticker className="h-5 w-5 text-pink-400" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-3 bg-white/95 backdrop-blur-lg border-pink-200">
                        <p className="text-xs font-semibold mb-2 text-center">Decorate your photo</p>
                        <div className="grid grid-cols-8 gap-1">
                          {availableStickers.map((sticker) => (
                            <button
                              key={sticker}
                              onClick={() => toggleSticker(index, sticker)}
                              className={`text-2xl p-1 rounded transition-all ${
                                selectedStickers[index]?.includes(sticker)
                                  ? "bg-pink-100 scale-110"
                                  : "hover:bg-pink-50"
                              }`}
                            >
                              {sticker}
                            </button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <button
                      onClick={() => toggleLike(index)}
                      className="p-2 bg-white/80 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
                    >
                      <Heart
                        className={`h-5 w-5 transition-colors ${
                          likedPhotos[index]
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  </div>
                </div>
                
                <div className="mb-3">
                  <Input
                    value={captions[index]}
                    onChange={(e) => updateCaption(index, e.target.value)}
                    className={`handwritten text-lg bg-white/70 border-2 ${currentTheme.borderColor} focus:border-primary mb-2`}
                    placeholder="write a caption..."
                  />
                  
                  {/* Caption Suggestions */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {currentTheme.captionSuggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => applySuggestion(index, suggestion)}
                     className={`text-[11px] px-3 py-1.5 rounded-full bg-white/70 ${currentTheme.textColor} hover:bg-white transition-all hover:scale-105 border border-current/20 font-medium whitespace-nowrap flex-shrink-0`}
                        style={{ lineHeight: '1.2' }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
                
                <Input
                  value={reflections[index]}
                  onChange={(e) => updateReflection(index, e.target.value)}
                  className="text-sm bg-white/50 border-primary/10 focus:border-primary/50 italic"
                  placeholder="add a reflection (optional)..."
                />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full shadow-dreamy transition-all duration-300 hover:scale-105 glow-romantic"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Save to Memories
            </Button>
            
            <Button
              onClick={downloadPhotoStrip}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 px-8 py-6 text-lg rounded-full transition-all duration-300"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Strip
            </Button>
            
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-muted-foreground hover:bg-muted px-8 py-6 text-lg rounded-full"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoStrip;
