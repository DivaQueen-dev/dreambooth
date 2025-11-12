import { Music, Volume2, VolumeX, Play, Pause, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAestheticSounds } from "@/hooks/useAestheticSounds";

type SongType = "young-beautiful" | "brooklyn-baby" | "video-games" | "lofi-piano" | "vintage-jazz" | "summertime-sadness" | "born-to-die" | "ride" | "chill-lofi" | "dreamy-indie";

type SourceType = "youtube" | "spotify";

interface Song {
  name: string;
  artist: string;
  url: string;
  source: SourceType;
}

const songs: Record<SongType, Song> = {
  "young-beautiful": { 
    name: "Young and Beautiful", 
    artist: "Lana Del Rey",
    url: "https://www.youtube.com/embed/o_1aF54DO60?autoplay=1&mute=0&controls=1&loop=1&playlist=o_1aF54DO60&enablejsapi=1",
    source: "youtube"
  },
  "brooklyn-baby": { 
    name: "Brooklyn Baby", 
    artist: "Lana Del Rey",
    url: "https://www.youtube.com/embed/T5xcnjAG8pM?autoplay=1&mute=0&controls=1&loop=1&playlist=T5xcnjAG8pM&enablejsapi=1",
    source: "youtube"
  },
  "video-games": { 
    name: "Video Games", 
    artist: "Lana Del Rey",
    url: "https://www.youtube.com/embed/cE6wxDqdOV0?autoplay=1&mute=0&controls=1&loop=1&playlist=cE6wxDqdOV0&enablejsapi=1",
    source: "youtube"
  },
  "summertime-sadness": { 
    name: "Summertime Sadness", 
    artist: "Lana Del Rey",
    url: "https://www.youtube.com/embed/nVjsGKrE6E8?autoplay=1&mute=0&controls=1&loop=1&playlist=nVjsGKrE6E8&enablejsapi=1",
    source: "youtube"
  },
  "born-to-die": { 
    name: "Born to Die", 
    artist: "Lana Del Rey",
    url: "https://www.youtube.com/embed/9NxvMPittxg?autoplay=1&mute=0&controls=1&loop=1&playlist=9NxvMPittxg&enablejsapi=1",
    source: "youtube"
  },
  "ride": { 
    name: "Ride", 
    artist: "Lana Del Rey",
    url: "https://www.youtube.com/embed/Py_-3di1yx0?autoplay=1&mute=0&controls=1&loop=1&playlist=Py_-3di1yx0&enablejsapi=1",
    source: "youtube"
  },
  "lofi-piano": { 
    name: "Lofi Piano", 
    artist: "Dreamy Instrumentals",
    url: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=0&controls=1&loop=1&playlist=jfKfPfyJRdk&enablejsapi=1",
    source: "youtube"
  },
  "vintage-jazz": { 
    name: "Soft Vintage Jazz", 
    artist: "Classic Jazz",
    url: "https://www.youtube.com/embed/Dx5qFachd3A?autoplay=1&mute=0&controls=1&loop=1&playlist=Dx5qFachd3A&enablejsapi=1",
    source: "youtube"
  },
  "chill-lofi": { 
    name: "Chill Lofi Beats", 
    artist: "Study Vibes",
    url: "https://www.youtube.com/embed/lTRiuFIWV54?autoplay=1&mute=0&controls=1&loop=1&playlist=lTRiuFIWV54&enablejsapi=1",
    source: "youtube"
  },
  "dreamy-indie": { 
    name: "Dreamy Indie", 
    artist: "Various Artists",
    url: "https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1&mute=0&controls=1&loop=1&playlist=5qap5aO4i9A&enablejsapi=1",
    source: "youtube"
  },
};

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [showControls, setShowControls] = useState(false);
  const [currentSong, setCurrentSong] = useState<SongType>("young-beautiful");
  const [fadeOut, setFadeOut] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { playClick } = useAestheticSounds();
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const togglePlay = () => {
    playClick();
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      toast.success("♫ Music playing", { description: songs[currentSong].name });
    } else {
      toast("Music paused", { description: "Tap to continue" });
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const handleSongChange = (value: SongType) => {
    playClick();
    setFadeOut(true);
    setTimeout(() => {
      setCurrentSong(value);
      setIframeKey(prev => prev + 1); // Force iframe reload
      setFadeOut(false);
      if (isPlaying) {
        toast.success("♫ Song changed", { description: songs[value].name });
      }
    }, 500);
  };

  const skipToNext = () => {
    playClick();
    const songKeys = Object.keys(songs) as SongType[];
    const currentIndex = songKeys.indexOf(currentSong);
    const nextIndex = (currentIndex + 1) % songKeys.length;
    handleSongChange(songKeys[nextIndex]);
  };

  return (
    <>
      {/* Hidden iframe for music playback - always present but controlled by display */}
      <iframe
        key={iframeKey}
        ref={iframeRef}
        src={isPlaying ? songs[currentSong].url : "about:blank"}
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        style={{ 
          display: isPlaying ? 'block' : 'none',
          opacity: fadeOut ? 0 : 1,
          transition: 'opacity 0.5s ease',
          pointerEvents: 'none',
          position: 'fixed',
          bottom: '-1000px',
          left: '-1000px',
          width: '1px',
          height: '1px',
          zIndex: -1
        }}
        title="Music Player"
      />

      <div 
        className="fixed bottom-6 right-6 z-[100] rounded-2xl transition-all duration-300 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-primary/20 shadow-xl hover:shadow-primary/20"
        onMouseEnter={() => {
          setShowControls(true);
        }}
        onMouseLeave={() => {
          if (!isSelectOpen) setShowControls(false);
        }}
      >
        {showControls ? (
          <div className="flex flex-col gap-3 p-4 w-[280px]">
            <div className="flex items-center gap-3 justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlay}
                  className="h-9 w-9 hover:bg-primary/10 rounded-full transition-all hover:scale-105"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5 text-primary" />
                  ) : (
                    <Play className="h-5 w-5 text-primary" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={skipToNext}
                  className="h-9 w-9 hover:bg-primary/10 rounded-full transition-all hover:scale-105"
                  disabled={!isPlaying}
                >
                  <SkipForward className="h-5 w-5 text-primary" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2 flex-1">
                {volume > 0 ? (
                  <Volume2 className="h-4 w-4 text-primary flex-shrink-0" />
                ) : (
                  <VolumeX className="h-4 w-4 text-primary/50 flex-shrink-0" />
                )}
                <Slider
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            <Select value={currentSong} onValueChange={handleSongChange} onOpenChange={setIsSelectOpen}>
              <SelectTrigger className="h-9 text-xs bg-white/60 dark:bg-gray-800/60 border-primary/30 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                <SelectValue placeholder="Select a song">
                  {songs[currentSong].name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-[200px] bg-white dark:bg-gray-900 border-primary/30 z-[150] shadow-xl" position="popper" sideOffset={5}>
                {Object.entries(songs).map(([key, value]) => (
                  <SelectItem 
                    key={key} 
                    value={key} 
                    className="text-xs cursor-pointer hover:bg-primary/10 dark:hover:bg-primary/20 focus:bg-primary/10 dark:focus:bg-primary/20 transition-colors"
                  >
                    {value.name} - {value.artist}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {isPlaying && (
              <div className="text-xs text-center text-primary/70 font-serif animate-pulse px-2 py-1">
                Now playing: {songs[currentSong].name}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={togglePlay}
            className="flex items-center justify-center p-4 hover:scale-105 transition-transform duration-300 group"
          >
            <Music className={`h-6 w-6 text-primary ${isPlaying ? 'animate-pulse' : ''}`} />
          </button>
        )}
      </div>
    </>
  );
};

export default MusicPlayer;
