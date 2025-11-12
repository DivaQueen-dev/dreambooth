import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X, RotateCw, Crop, Save } from "lucide-react";
import { toast } from "sonner";

interface PhotoEditorProps {
  imageUrl: string;
  onSave: (editedImage: string) => void;
  onClose: () => void;
}

export const PhotoEditor = ({ imageUrl, onSave, onClose }: PhotoEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [cropMode, setCropMode] = useState(false);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 100, height: 100 });

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageRef.current = img;
      renderCanvas();
    };
    img.src = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    renderCanvas();
  }, [rotation, brightness, contrast, saturation]);

  const renderCanvas = () => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imageRef.current;
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleCrop = () => {
    if (!canvasRef.current) return;
    setCropMode(!cropMode);
    toast.info(cropMode ? "Crop mode disabled" : "Drag to crop the image");
  };

  const handleSave = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    let finalCanvas = canvas;

    if (cropMode) {
      const cropCanvas = document.createElement("canvas");
      const ctx = cropCanvas.getContext("2d");
      if (!ctx) return;

      const scaleX = canvas.width / 100;
      const scaleY = canvas.height / 100;
      
      cropCanvas.width = cropArea.width * scaleX;
      cropCanvas.height = cropArea.height * scaleY;
      
      ctx.drawImage(
        canvas,
        cropArea.x * scaleX,
        cropArea.y * scaleY,
        cropArea.width * scaleX,
        cropArea.height * scaleY,
        0,
        0,
        cropCanvas.width,
        cropCanvas.height
      );
      
      finalCanvas = cropCanvas;
    }

    const editedImage = finalCanvas.toDataURL("image/jpeg", 0.9);
    onSave(editedImage);
    toast.success("Photo edited successfully!");
  };

  return (
    <div className="fixed inset-0 bg-background/98 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute -top-12 right-0 hover:bg-accent"
        >
          <X className="h-6 w-6" />
        </Button>

        <div className="glass-effect rounded-2xl p-6 shadow-elegant">
          <h2 className="text-3xl font-bold text-center mb-6 text-primary">
            Edit Your Photo ✨
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Canvas Area */}
            <div className="lg:col-span-2 flex items-center justify-center bg-muted/30 rounded-xl p-4">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
              />
            </div>

            {/* Controls */}
            <div className="space-y-6">
              <div className="glass-effect p-4 rounded-xl space-y-4">
                <h3 className="font-semibold text-lg text-foreground mb-4">Adjustments</h3>
                
                <div className="space-y-3">
                  <label className="text-sm text-muted-foreground">Brightness</label>
                  <Slider
                    value={[brightness]}
                    onValueChange={([value]) => setBrightness(value)}
                    min={0}
                    max={200}
                    step={1}
                    className="w-full"
                  />
                  <span className="text-xs text-muted-foreground">{brightness}%</span>
                </div>

                <div className="space-y-3">
                  <label className="text-sm text-muted-foreground">Contrast</label>
                  <Slider
                    value={[contrast]}
                    onValueChange={([value]) => setContrast(value)}
                    min={0}
                    max={200}
                    step={1}
                    className="w-full"
                  />
                  <span className="text-xs text-muted-foreground">{contrast}%</span>
                </div>

                <div className="space-y-3">
                  <label className="text-sm text-muted-foreground">Saturation</label>
                  <Slider
                    value={[saturation]}
                    onValueChange={([value]) => setSaturation(value)}
                    min={0}
                    max={200}
                    step={1}
                    className="w-full"
                  />
                  <span className="text-xs text-muted-foreground">{saturation}%</span>
                </div>
              </div>

              <div className="glass-effect p-4 rounded-xl space-y-3">
                <h3 className="font-semibold text-lg text-foreground mb-4">Tools</h3>
                
                <Button
                  onClick={handleRotate}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <RotateCw className="h-4 w-4 mr-2" />
                  Rotate 90°
                </Button>

                <Button
                  onClick={handleCrop}
                  variant={cropMode ? "default" : "outline"}
                  className="w-full justify-start"
                >
                  <Crop className="h-4 w-4 mr-2" />
                  {cropMode ? "Crop Active" : "Crop Image"}
                </Button>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
