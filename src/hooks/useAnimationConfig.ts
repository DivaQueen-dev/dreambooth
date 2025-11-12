import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect, useState } from 'react';

interface AnimationConfig {
  enabled: boolean;
  speedMultiplier: number;
  respectReducedMotion: boolean;
}

interface AnimationConfigStore extends AnimationConfig {
  setEnabled: (enabled: boolean) => void;
  setSpeedMultiplier: (multiplier: number) => void;
  setRespectReducedMotion: (respect: boolean) => void;
  reset: () => void;
}

const DEFAULT_CONFIG: AnimationConfig = {
  enabled: true,
  speedMultiplier: 1,
  respectReducedMotion: true,
};

export const useAnimationConfigStore = create<AnimationConfigStore>()(
  persist(
    (set) => ({
      ...DEFAULT_CONFIG,
      setEnabled: (enabled) => set({ enabled }),
      setSpeedMultiplier: (multiplier) => set({ speedMultiplier: Math.max(0.1, Math.min(3, multiplier)) }),
      setRespectReducedMotion: (respect) => set({ respectReducedMotion: respect }),
      reset: () => set(DEFAULT_CONFIG),
    }),
    {
      name: 'animation-config',
    }
  )
);

// Hook to check if user prefers reduced motion
export const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Main hook that combines store and system preferences
export const useAnimationConfig = () => {
  const config = useAnimationConfigStore();
  const prefersReducedMotion = usePrefersReducedMotion();

  const shouldAnimate = config.enabled && !(config.respectReducedMotion && prefersReducedMotion);
  
  return {
    ...config,
    prefersReducedMotion,
    shouldAnimate,
    // Adjusted duration based on speed multiplier (lower multiplier = faster)
    adjustDuration: (duration: number) => {
      if (!shouldAnimate) return 0;
      return Math.round(duration / config.speedMultiplier);
    },
    // Adjusted delay based on speed multiplier
    adjustDelay: (delay: number) => {
      if (!shouldAnimate) return 0;
      return Math.round(delay / config.speedMultiplier);
    },
  };
};
