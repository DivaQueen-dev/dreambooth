import { Heart, Instagram, Music } from "lucide-react";

const DreamyFooter = () => {
  return (
    <footer className="relative z-20 glass-effect border-t border-white/20 py-8 mt-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <Heart className="h-4 w-4 fill-primary" />
            <p className="handwritten text-lg">some memories never fade.</p>
            <Heart className="h-4 w-4 fill-primary" />
          </div>
          
          <div className="flex gap-6">
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:scale-110 transform"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:scale-110 transform"
            >
              <Music className="h-5 w-5" />
            </a>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            ✦ crafted with love ✦
          </p>
        </div>
      </div>
    </footer>
  );
};

export default DreamyFooter;
