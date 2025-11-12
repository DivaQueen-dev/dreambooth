import { useRef, useState, useEffect } from "react";
import { Camera, X, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAestheticSounds } from "@/hooks/useAestheticSounds";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WebcamCaptureProps {
  onPhotosCapture: (photos: string[]) => void;
  onClose: () => void;
}

type FilterType = "golden-hour" | "soft-dream" | "blue-velvet" | "dusty-film" | "rose-glow" | "dreamy" | "warm-film" | "pink-haze" | "vintage-grain" | "angel-glow" | "moody-blue" | "lavender-dream" | "peach-cream" | "mint-frost" | "sunset-amber" | "velvet-noir" | "pearl-shimmer" | "cherry-blossom";

const filters = {
  "golden-hour": { name: "Golden Hour", description: "Warm glowing sunset tone" },
  "soft-dream": { name: "Soft Dream", description: "Creamy blur with haze" },
  "blue-velvet": { name: "Blue Velvet", description: "Cool moody lighting" },
  "dusty-film": { name: "Dusty Film", description: "Vintage fade with grain" },
  "rose-glow": { name: "Rose Glow", description: "Soft pink highlight" },
  "dreamy": { name: "Dreamy Soft", description: "Ethereal romantic glow" },
  "warm-film": { name: "Warm Vintage", description: "Sepia autumn warmth" },
  "pink-haze": { name: "Soft Pink", description: "Dreamy pink filter" },
  "vintage-grain": { name: "Film Grain", description: "Classic film texture" },
  "angel-glow": { name: "Angel Glow", description: "Heavenly soft light" },
  "moody-blue": { name: "Moody Blue", description: "Deep blue atmosphere" },
  "lavender-dream": { name: "Lavender Dream", description: "Soft purple romantic haze" },
  "peach-cream": { name: "Peach Cream", description: "Warm peachy glow" },
  "mint-frost": { name: "Mint Frost", description: "Cool mint fresh tone" },
  "sunset-amber": { name: "Sunset Amber", description: "Rich golden amber glow" },
  "velvet-noir": { name: "Velvet Noir", description: "Dramatic dark elegance" },
  "pearl-shimmer": { name: "Pearl Shimmer", description: "Iridescent pearl effect" },
  "cherry-blossom": { name: "Cherry Blossom", description: "Delicate spring pink" },
};

const WebcamCapture = ({ onPhotosCapture, onClose }: WebcamCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [currentShot, setCurrentShot] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("dreamy");
  const { playClick } = useAestheticSounds();

  useEffect(() => {
    startWebcam();
    return () => {
      stopWebcam();
    };
  }, []);

  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing webcam:", error);
      toast.error("Could not access camera. Please check permissions.");
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const playShutterSound = () => {
    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.frequency.value = 800;
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.1);
  };

  const applyFilter = (imageData: ImageData, filterType: FilterType): ImageData => {
    const data = imageData.data;

    switch (filterType) {
      case "golden-hour":
        // Warm glowing sunset - boost reds and yellows
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 1.25 + 25);
          data[i + 1] = Math.min(255, data[i + 1] * 1.15 + 15);
          data[i + 2] = Math.min(255, data[i + 2] * 0.75);
        }
        break;

      case "soft-dream":
        // Creamy blur with haze - soft focus effect
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 1.1 + 30);
          data[i + 1] = Math.min(255, data[i + 1] * 1.08 + 25);
          data[i + 2] = Math.min(255, data[i + 2] * 1.05 + 20);
          // Soften contrast
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = data[i] * 0.7 + avg * 0.3;
          data[i + 1] = data[i + 1] * 0.7 + avg * 0.3;
          data[i + 2] = data[i + 2] * 0.7 + avg * 0.3;
        }
        break;

      case "blue-velvet":
        // Cool moody lighting - deep blues
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 0.85);
          data[i + 1] = Math.min(255, data[i + 1] * 0.95 + 10);
          data[i + 2] = Math.min(255, data[i + 2] * 1.2 + 20);
        }
        break;

      case "dusty-film":
        // Vintage fade with grain - classic film look
        for (let i = 0; i < data.length; i += 4) {
          // Desaturate and warm
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg * 1.1 + 15;
          data[i + 1] = avg * 1.0 + 10;
          data[i + 2] = avg * 0.85;
          // Add grain
          const noise = (Math.random() - 0.5) * 25;
          data[i] = Math.max(0, Math.min(255, data[i] + noise));
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
        }
        break;

      case "rose-glow":
        // Soft pink highlight - romantic rose tones
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 1.2 + 30);
          data[i + 1] = Math.min(255, data[i + 1] * 1.0 + 10);
          data[i + 2] = Math.min(255, data[i + 2] * 1.05 + 15);
        }
        break;

      case "dreamy":
        // Ethereal romantic glow - soft and warm
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 1.12 + 20);
          data[i + 1] = Math.min(255, data[i + 1] * 1.05 + 12);
          data[i + 2] = Math.min(255, data[i + 2] * 0.95 + 8);
        }
        break;

      case "warm-film":
        // Sepia autumn warmth
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = Math.min(255, avg * 1.15 + 20);
          data[i + 1] = Math.min(255, avg * 1.0 + 10);
          data[i + 2] = Math.min(255, avg * 0.8);
        }
        break;

      case "pink-haze":
        // Dreamy pink filter
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 1.25 + 35);
          data[i + 1] = Math.min(255, data[i + 1] * 0.95 + 5);
          data[i + 2] = Math.min(255, data[i + 2] * 1.1 + 20);
        }
        break;

      case "vintage-grain":
        // Classic film texture
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg * 1.05;
          data[i + 1] = avg * 0.95;
          data[i + 2] = avg * 0.85;
          const grain = (Math.random() - 0.5) * 30;
          data[i] += grain;
          data[i + 1] += grain;
          data[i + 2] += grain;
        }
        break;

      case "angel-glow":
        // Heavenly soft light
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 1.3 + 40);
          data[i + 1] = Math.min(255, data[i + 1] * 1.25 + 35);
          data[i + 2] = Math.min(255, data[i + 2] * 1.2 + 30);
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = data[i] * 0.6 + avg * 0.4;
          data[i + 1] = data[i + 1] * 0.6 + avg * 0.4;
          data[i + 2] = data[i + 2] * 0.6 + avg * 0.4;
        }
        break;

      case "moody-blue":
        // Deep blue atmosphere
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 0.7);
          data[i + 1] = Math.min(255, data[i + 1] * 0.9 + 5);
          data[i + 2] = Math.min(255, data[i + 2] * 1.3 + 25);
        }
        break;

      case "lavender-dream":
        // Soft purple romantic haze
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 1.15 + 25);
          data[i + 1] = Math.min(255, data[i + 1] * 1.0 + 10);
          data[i + 2] = Math.min(255, data[i + 2] * 1.25 + 35);
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = data[i] * 0.75 + avg * 0.25;
          data[i + 1] = data[i + 1] * 0.75 + avg * 0.25;
          data[i + 2] = data[i + 2] * 0.75 + avg * 0.25;
        }
        break;

      case "peach-cream":
        // Warm peachy glow
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 1.2 + 30);
          data[i + 1] = Math.min(255, data[i + 1] * 1.1 + 20);
          data[i + 2] = Math.min(255, data[i + 2] * 0.9 + 5);
        }
        break;

      case "mint-frost":
        // Cool mint fresh tone
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 0.95 + 10);
          data[i + 1] = Math.min(255, data[i + 1] * 1.15 + 20);
          data[i + 2] = Math.min(255, data[i + 2] * 1.1 + 15);
        }
        break;

      case "sunset-amber":
        // Rich golden amber glow
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 1.3 + 35);
          data[i + 1] = Math.min(255, data[i + 1] * 1.15 + 20);
          data[i + 2] = Math.min(255, data[i + 2] * 0.6);
        }
        break;

      case "velvet-noir":
        // Dramatic dark elegance
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 0.6);
          data[i + 1] = Math.min(255, data[i + 1] * 0.65);
          data[i + 2] = Math.min(255, data[i + 2] * 0.7 + 10);
          // Increase contrast
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          if (avg > 128) {
            data[i] *= 1.1;
            data[i + 1] *= 1.1;
            data[i + 2] *= 1.1;
          } else {
            data[i] *= 0.8;
            data[i + 1] *= 0.8;
            data[i + 2] *= 0.8;
          }
        }
        break;

      case "pearl-shimmer":
        // Iridescent pearl effect
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 1.25 + 30);
          data[i + 1] = Math.min(255, data[i + 1] * 1.2 + 28);
          data[i + 2] = Math.min(255, data[i + 2] * 1.18 + 25);
          const shimmer = Math.sin(i * 0.01) * 15;
          data[i] += shimmer;
          data[i + 1] += shimmer;
          data[i + 2] += shimmer;
        }
        break;

      case "cherry-blossom":
        // Delicate spring pink
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 1.18 + 28);
          data[i + 1] = Math.min(255, data[i + 1] * 1.05 + 15);
          data[i + 2] = Math.min(255, data[i + 2] * 1.12 + 20);
        }
        break;
    }

    return imageData;
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const filteredData = applyFilter(imageData, selectedFilter);
    context.putImageData(filteredData, 0, 0);

    // Compress image to reduce size
    const photoData = canvas.toDataURL("image/jpeg", 0.7);
    return photoData;
  };

  const startPhotoSequence = async () => {
    setIsCapturing(true);
    const photos: string[] = [];

    for (let i = 0; i < 4; i++) {
      setCurrentShot(i + 1);
      
      for (let count = 3; count > 0; count--) {
        setCountdown(count);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      
      setCountdown(0);
      playShutterSound();
      
      const photo = capturePhoto();
      if (photo) {
        photos.push(photo);
        setCapturedPhotos([...photos]);
      }
      
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCountdown(null);
      
      if (i < 3) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    setIsCapturing(false);
    stopWebcam();
    onPhotosCapture(photos);
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            playClick();
            onClose();
          }}
          className="absolute -top-12 right-0 text-foreground hover:bg-primary/10"
        >
          <X className="h-6 w-6" />
        </Button>

        <div className="glass-effect rounded-2xl p-6 shadow-dreamy animate-fade-in-slow">
          <h2 className="text-3xl font-bold text-center mb-6 text-primary">
            {isCapturing ? `Shot ${currentShot} of 4` : "Get Ready! 📸"}
          </h2>

          {!isCapturing && (
            <div className="mb-4 flex items-center justify-center gap-3">
              <Wand2 className="h-5 w-5 text-primary" />
              <Select value={selectedFilter} onValueChange={(value) => {
                playClick();
                setSelectedFilter(value as FilterType);
              }}>
                <SelectTrigger className="w-[200px] glass-effect border-primary/20 font-serif">
                  <SelectValue placeholder="Select filter" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(filters).map(([key, filter]) => (
                    <SelectItem key={key} value={key} className="font-serif">
                      {filter.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground font-serif">
                {filters[selectedFilter].description}
              </p>
            </div>
          )}

          <div className="relative aspect-video bg-black rounded-xl overflow-hidden mb-6">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover mirror"
            />
            
            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="text-9xl font-bold text-white animate-pulse">
                  {countdown === 0 ? "✨" : countdown}
                </div>
              </div>
            )}

            {capturedPhotos.length > 0 && (
              <div className="absolute bottom-4 left-4 flex gap-2">
                {capturedPhotos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Captured ${index + 1}`}
                    className="w-16 h-16 object-cover rounded-lg border-2 border-white shadow-lg"
                  />
                ))}
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          <div className="flex justify-center">
            {!isCapturing && capturedPhotos.length === 0 && (
              <Button
                onClick={() => {
                  playClick();
                  startPhotoSequence();
                }}
                className="bg-primary hover:bg-primary/90 text-white px-12 py-6 text-lg rounded-full shadow-dreamy transition-all duration-300 hover:scale-105 glow-romantic"
              >
                <Camera className="mr-2 h-6 w-6" />
                Start Photo Session
              </Button>
            )}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            {isCapturing
              ? "Hold still! Taking 4 beautiful photos..."
              : "We'll take 4 photos automatically with a 3-second countdown"}
          </p>
        </div>
      </div>

      <style>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
};

export default WebcamCapture;
