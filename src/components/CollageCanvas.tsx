import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, FabricImage, Rect, Circle, Text, Shadow } from "fabric";
import { X, Download, RotateCw, Trash2, Grid2X2, Grid3X3, Sparkles, Smile, Heart, Star, Sun, Moon, Flower2, Camera, Music, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAestheticSounds } from "@/hooks/useAestheticSounds";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CollageCanvasProps {
  memories: Array<{ image: string; caption: string; id: string }>;
  onClose: () => void;
  onSave: (collageImage: string, caption: string) => void;
}

type LayoutType = "freeform" | "grid2x2" | "grid3x3" | "scrapbook";

const STICKERS = [
  { emoji: "❤️", label: "Heart" },
  { emoji: "⭐", label: "Star" },
  { emoji: "✨", label: "Sparkle" },
  { emoji: "🌸", label: "Flower" },
  { emoji: "🌙", label: "Moon" },
  { emoji: "☀️", label: "Sun" },
  { emoji: "💕", label: "Hearts" },
  { emoji: "🎀", label: "Ribbon" },
  { emoji: "🦋", label: "Butterfly" },
  { emoji: "🌺", label: "Hibiscus" },
  { emoji: "🌼", label: "Blossom" },
  { emoji: "🌻", label: "Sunflower" },
  { emoji: "💫", label: "Dizzy" },
  { emoji: "🌈", label: "Rainbow" },
  { emoji: "☁️", label: "Cloud" },
  { emoji: "💖", label: "Sparkling Heart" },
  { emoji: "🎵", label: "Music" },
  { emoji: "📷", label: "Camera" },
  { emoji: "✿", label: "Flower" },
  { emoji: "♡", label: "Heart Outline" },
];

const CollageCanvas = ({ memories, onClose, onSave }: CollageCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [selectedMemories, setSelectedMemories] = useState<string[]>([]);
  const [layout, setLayout] = useState<LayoutType>("freeform");
  const { playClick, playSuccess } = useAestheticSounds();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 800,
      backgroundColor: "#e8dcd9",
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  const addImageToCanvas = async (imageUrl: string, x?: number, y?: number, scale?: number) => {
    if (!fabricCanvas) return;

    try {
      const img = await FabricImage.fromURL(imageUrl, {
        crossOrigin: "anonymous",
      });

      img.set({
        left: x || Math.random() * 400 + 100,
        top: y || Math.random() * 400 + 100,
        scaleX: scale || 0.3,
        scaleY: scale || 0.3,
        shadow: new Shadow({
          color: "rgba(0,0,0,0.2)",
          blur: 20,
          offsetX: 0,
          offsetY: 10,
        }),
        cornerColor: "#f9b4c1",
        cornerStyle: "circle",
        transparentCorners: false,
        borderColor: "#f9b4c1",
        borderScaleFactor: 2,
      });

      fabricCanvas.add(img);
      fabricCanvas.setActiveObject(img);
      fabricCanvas.renderAll();
      playClick();
    } catch (error) {
      console.error("Error adding image:", error);
      toast.error("Could not add image to canvas");
    }
  };

  const addStickerToCanvas = (emoji: string) => {
    if (!fabricCanvas) return;

    const text = new Text(emoji, {
      left: 400 + Math.random() * 100 - 50,
      top: 400 + Math.random() * 100 - 50,
      fontSize: 60,
      fontFamily: "Arial",
      shadow: new Shadow({
        color: "rgba(0,0,0,0.15)",
        blur: 10,
        offsetX: 0,
        offsetY: 5,
      }),
    });

    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.renderAll();
    playClick();
    toast.success("Sticker added! ✨", { description: "Drag to move, resize with corners" });
  };

  const handleMemorySelect = (memoryId: string, imageUrl: string) => {
    if (selectedMemories.includes(memoryId)) {
      setSelectedMemories(selectedMemories.filter((id) => id !== memoryId));
    } else {
      setSelectedMemories([...selectedMemories, memoryId]);
      addImageToCanvas(imageUrl);
    }
  };

  const applyLayout = (layoutType: LayoutType) => {
    if (!fabricCanvas) return;
    
    playClick();
    setLayout(layoutType);
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#e8dcd9";

    const selected = memories.filter((m) => selectedMemories.includes(m.id));
    if (selected.length === 0) {
      toast("Select memories first", { description: "Choose photos to add to your collage" });
      return;
    }

    switch (layoutType) {
      case "grid2x2":
        applyGrid2x2(selected);
        break;
      case "grid3x3":
        applyGrid3x3(selected);
        break;
      case "scrapbook":
        applyScrapbook(selected);
        break;
      default:
        selected.forEach((memory) => addImageToCanvas(memory.image));
    }
  };

  const applyGrid2x2 = (selected: typeof memories) => {
    const cellSize = 350;
    const padding = 50;
    const positions = [
      { x: padding, y: padding },
      { x: padding + cellSize, y: padding },
      { x: padding, y: padding + cellSize },
      { x: padding + cellSize, y: padding + cellSize },
    ];
    selected.slice(0, 4).forEach((memory, i) => {
      addImageToCanvas(memory.image, positions[i].x, positions[i].y, 0.42);
    });
  };

  const applyGrid3x3 = (selected: typeof memories) => {
    const cellSize = 233;
    const padding = 50;
    const positions = [
      { x: padding, y: padding }, 
      { x: padding + cellSize, y: padding }, 
      { x: padding + cellSize * 2, y: padding },
      { x: padding, y: padding + cellSize }, 
      { x: padding + cellSize, y: padding + cellSize }, 
      { x: padding + cellSize * 2, y: padding + cellSize },
      { x: padding, y: padding + cellSize * 2 }, 
      { x: padding + cellSize, y: padding + cellSize * 2 }, 
      { x: padding + cellSize * 2, y: padding + cellSize * 2 },
    ];
    selected.slice(0, 9).forEach((memory, i) => {
      addImageToCanvas(memory.image, positions[i].x, positions[i].y, 0.27);
    });
  };

  const applyScrapbook = (selected: typeof memories) => {
    const rotations = [-8, 5, -3, 7, -5, 4, -6, 3];
    selected.forEach((memory, i) => {
      const x = Math.random() * 500 + 100;
      const y = Math.random() * 500 + 100;
      addImageToCanvas(memory.image, x, y, 0.25 + Math.random() * 0.15);
      setTimeout(() => {
        const objects = fabricCanvas?.getObjects();
        if (objects && objects[i]) {
          objects[i].rotate(rotations[i % rotations.length]);
          fabricCanvas?.renderAll();
        }
      }, 100);
    });
  };

  const handleRotate = () => {
    if (!fabricCanvas) return;
    const active = fabricCanvas.getActiveObject();
    if (active) {
      playClick();
      active.rotate((active.angle || 0) + 15);
      fabricCanvas.renderAll();
    } else {
      toast("Select an item first", { description: "Click on a photo or sticker to rotate it" });
    }
  };

  const handleDelete = () => {
    if (!fabricCanvas) return;
    const active = fabricCanvas.getActiveObject();
    if (active) {
      playClick();
      fabricCanvas.remove(active);
      fabricCanvas.renderAll();
      toast("Item removed");
    } else {
      toast("Select an item first", { description: "Click on a photo or sticker to delete it" });
    }
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    playClick();
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#e8dcd9";
    fabricCanvas.renderAll();
    toast("Canvas cleared! 🎨");
  };

  const handleShare = async () => {
    if (!fabricCanvas) return;
    
    try {
      playSuccess();
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();

      // Export for Instagram (1080x1080)
      const dataURL = fabricCanvas.toDataURL({
        format: 'jpeg',
        quality: 0.9,
        multiplier: 2,
      });

      const blob = await (await fetch(dataURL)).blob();
      const file = new File([blob], "collage.jpg", { type: "image/jpeg" });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "My Memory Collage",
          text: "Check out my beautiful memory collage!",
          files: [file],
        });
        toast.success("Collage shared successfully!");
      } else {
        const link = document.createElement('a');
        link.download = `collage-${Date.now()}.jpg`;
        link.href = dataURL;
        link.click();
        toast.success("Collage downloaded for sharing!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share collage");
    }
  };

  const handleDownload = () => {
    if (!fabricCanvas) return;
    
    playSuccess();
    fabricCanvas.discardActiveObject();
    fabricCanvas.renderAll();

    const dataURL = fabricCanvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2,
    });

    const link = document.createElement("a");
    link.download = `collage-${Date.now()}.png`;
    link.href = dataURL;
    link.click();

    toast.success("Collage downloaded! 🎨", {
      description: "Your beautiful creation is saved",
    });
  };

  const handleSaveCollage = () => {
    if (!fabricCanvas) return;

    playSuccess();
    fabricCanvas.discardActiveObject();
    fabricCanvas.renderAll();

    const dataURL = fabricCanvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2,
    });

    onSave(dataURL, "My Beautiful Collage");
    toast.success("Collage saved to memories! ✨");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-2 md:p-4">
      <div className="bg-gradient-to-br from-secondary/95 to-accent/95 backdrop-blur-xl rounded-3xl shadow-elegant max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col border border-primary/20">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-primary/20 bg-background/40 backdrop-blur-sm">
          <div>
            <h2 className="text-2xl md:text-3xl font-title text-foreground">Collage Maker ✨</h2>
            <p className="text-xs md:text-sm text-muted-foreground font-sans">Create your artistic memory collage with photos & stickers</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-destructive/20">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4 p-4 md:p-6">
            {/* Left Sidebar */}
            <div className="space-y-4">
              <Tabs defaultValue="photos" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-background/60">
                  <TabsTrigger value="photos" className="text-xs">Photos</TabsTrigger>
                  <TabsTrigger value="stickers" className="text-xs">Stickers</TabsTrigger>
                  <TabsTrigger value="layouts" className="text-xs">Layouts</TabsTrigger>
                </TabsList>

                {/* Photos Tab */}
                <TabsContent value="photos" className="space-y-3 mt-4">
                  <div className="flex items-center gap-2 text-sm font-serif text-foreground">
                    <Camera className="h-4 w-4 text-primary" />
                    Select Your Photos
                  </div>
                  <ScrollArea className="h-[300px] rounded-xl border border-border/50 bg-background/40 p-2">
                    <div className="grid grid-cols-2 gap-2">
                      {memories.slice(0, 20).map((memory) => (
                        <button
                          key={memory.id}
                          onClick={() => handleMemorySelect(memory.id, memory.image)}
                          className={`relative rounded-lg overflow-hidden transition-all hover:scale-105 ${
                            selectedMemories.includes(memory.id)
                              ? "ring-4 ring-primary shadow-lg scale-105"
                              : "ring-1 ring-border/50 opacity-80 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={memory.image}
                            alt={memory.caption}
                            className="w-full h-24 object-cover"
                          />
                          {selectedMemories.includes(memory.id) && (
                            <div className="absolute inset-0 bg-primary/30 flex items-center justify-center backdrop-blur-[1px]">
                              <div className="bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
                                <Sparkles className="h-4 w-4" />
                              </div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                  <p className="text-xs text-muted-foreground text-center">
                    {selectedMemories.length} photo{selectedMemories.length !== 1 ? 's' : ''} selected
                  </p>
                </TabsContent>

                {/* Stickers Tab */}
                <TabsContent value="stickers" className="space-y-3 mt-4">
                  <div className="flex items-center gap-2 text-sm font-serif text-foreground">
                    <Smile className="h-4 w-4 text-primary" />
                    Add Fun Stickers
                  </div>
                  <ScrollArea className="h-[300px] rounded-xl border border-border/50 bg-background/40 p-3">
                    <div className="grid grid-cols-4 gap-2">
                      {STICKERS.map((sticker, index) => (
                        <button
                          key={index}
                          onClick={() => addStickerToCanvas(sticker.emoji)}
                          className="aspect-square rounded-lg bg-background/60 hover:bg-primary/20 border border-border/50 hover:border-primary/50 transition-all hover:scale-110 flex items-center justify-center text-3xl shadow-sm hover:shadow-md"
                          title={sticker.label}
                        >
                          {sticker.emoji}
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                  <p className="text-xs text-muted-foreground text-center">
                    Click any sticker to add it to your collage
                  </p>
                </TabsContent>

                {/* Layouts Tab */}
                <TabsContent value="layouts" className="space-y-3 mt-4">
                  <div className="flex items-center gap-2 text-sm font-serif text-foreground">
                    <Grid2X2 className="h-4 w-4 text-primary" />
                    Choose Layout Style
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={layout === "freeform" ? "default" : "outline"}
                      onClick={() => applyLayout("freeform")}
                      className="h-24 flex-col gap-2 text-xs"
                    >
                      <Sparkles className="h-6 w-6" />
                      Freeform
                      <span className="text-[10px] opacity-70">Artistic chaos</span>
                    </Button>
                    <Button
                      variant={layout === "grid2x2" ? "default" : "outline"}
                      onClick={() => applyLayout("grid2x2")}
                      className="h-24 flex-col gap-2 text-xs"
                    >
                      <Grid2X2 className="h-6 w-6" />
                      2×2 Grid
                      <span className="text-[10px] opacity-70">Classic quad</span>
                    </Button>
                    <Button
                      variant={layout === "grid3x3" ? "default" : "outline"}
                      onClick={() => applyLayout("grid3x3")}
                      className="h-24 flex-col gap-2 text-xs"
                    >
                      <Grid3X3 className="h-6 w-6" />
                      3×3 Grid
                      <span className="text-[10px] opacity-70">Instagram style</span>
                    </Button>
                    <Button
                      variant={layout === "scrapbook" ? "default" : "outline"}
                      onClick={() => applyLayout("scrapbook")}
                      className="h-24 flex-col gap-2 text-xs"
                    >
                      <Sparkles className="h-6 w-6" />
                      Scrapbook
                      <span className="text-[10px] opacity-70">Random tilts</span>
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Tools */}
              <div className="space-y-2 bg-background/40 rounded-xl p-3 border border-border/50">
                <h3 className="text-sm font-serif text-foreground mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Tools
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={handleRotate}
                    size="sm"
                    className="justify-start gap-2"
                  >
                    <RotateCw className="h-3 w-3" />
                    Rotate
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDelete}
                    size="sm"
                    className="justify-start gap-2"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
                <Button
                  variant="outline"
                  onClick={handleClear}
                  size="sm"
                  className="w-full justify-center gap-2 border-destructive/50 text-destructive hover:bg-destructive/10"
                >
                  <X className="h-3 w-3" />
                  Clear Canvas
                </Button>
              </div>
            </div>

            {/* Canvas Area */}
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-4 md:p-6 border-2 border-primary/30 shadow-dreamy">
                <div className="bg-gradient-to-br from-white to-secondary/30 rounded-xl p-2 shadow-inner">
                  <canvas ref={canvasRef} className="max-w-full rounded-lg" style={{ maxHeight: '600px' }} />
                </div>
              </div>
              <div className="text-center space-y-1">
                <p className="text-xs text-muted-foreground font-sans">
                  💡 <span className="font-semibold">Drag</span> to move • <span className="font-semibold">Corners</span> to resize • <span className="font-semibold">Click</span> to select
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 p-4 md:p-6 border-t border-primary/20 bg-background/40 backdrop-blur-sm">
          <Button variant="outline" onClick={onClose} className="gap-2">
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare} className="gap-2">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button variant="outline" onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </Button>
            <Button onClick={handleSaveCollage} className="gap-2 bg-primary hover:bg-primary/90 shadow-lg">
              <Sparkles className="h-4 w-4" />
              Save to Memories
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollageCanvas;