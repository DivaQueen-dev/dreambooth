import { Settings, Zap, ZapOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAnimationConfigStore, usePrefersReducedMotion } from "@/hooks/useAnimationConfig";
import { Badge } from "@/components/ui/badge";

const AnimationSettings = () => {
  const {
    enabled,
    speedMultiplier,
    respectReducedMotion,
    setEnabled,
    setSpeedMultiplier,
    setRespectReducedMotion,
    reset,
  } = useAnimationConfigStore();
  
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-4 left-4 z-50 rounded-full glass-effect"
          title="Animation Settings"
        >
          {enabled ? (
            <Zap className="h-5 w-5 text-primary" />
          ) : (
            <ZapOff className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" side="top" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Animation Settings
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={reset}
              className="h-7 text-xs"
            >
              Reset
            </Button>
          </div>

          {/* System Preference Indicator */}
          {prefersReducedMotion && (
            <div className="p-2 rounded-md bg-muted">
              <p className="text-xs text-muted-foreground">
                <Badge variant="secondary" className="text-xs mb-1">
                  System Preference
                </Badge>
                <br />
                Your system is set to reduce motion
              </p>
            </div>
          )}

          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="animation-enabled" className="text-sm">
              Enable Animations
            </Label>
            <Switch
              id="animation-enabled"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </div>

          {/* Respect Reduced Motion Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="respect-reduced-motion" className="text-sm">
                Respect System Preference
              </Label>
              <p className="text-xs text-muted-foreground">
                Honor prefers-reduced-motion
              </p>
            </div>
            <Switch
              id="respect-reduced-motion"
              checked={respectReducedMotion}
              onCheckedChange={setRespectReducedMotion}
              disabled={!enabled}
            />
          </div>

          {/* Speed Multiplier */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="speed-multiplier" className="text-sm">
                Animation Speed
              </Label>
              <span className="text-xs text-muted-foreground">
                {speedMultiplier.toFixed(1)}x
              </span>
            </div>
            <Slider
              id="speed-multiplier"
              min={0.5}
              max={2}
              step={0.1}
              value={[speedMultiplier]}
              onValueChange={(value) => setSpeedMultiplier(value[0])}
              disabled={!enabled}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Slower</span>
              <span>Faster</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            These settings help customize the animation experience for your comfort and accessibility needs.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AnimationSettings;
