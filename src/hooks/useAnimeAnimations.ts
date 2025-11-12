import { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import { useAnimationConfig } from './useAnimationConfig';

// Centralized easing constants for anime.js v4
export const ANIME_EASING = {
  // Exponential
  outExpo: 'out-expo',
  inExpo: 'in-expo',
  inOutExpo: 'inOut-expo',
  
  // Elastic
  outElastic: (amplitude = 1, period = 0.5) => `out-elastic(${amplitude}, ${period})`,
  inElastic: (amplitude = 1, period = 0.5) => `in-elastic(${amplitude}, ${period})`,
  inOutElastic: (amplitude = 1, period = 0.5) => `inOut-elastic(${amplitude}, ${period})`,
  
  // Sine
  outSine: 'out-sine',
  inSine: 'in-sine',
  inOutSine: 'inOut-sine',
  
  // Quad
  outQuad: 'out-quad',
  inQuad: 'in-quad',
  inOutQuad: 'inOut-quad',
  
  // Cubic
  outCubic: 'out-cubic',
  inCubic: 'in-cubic',
  inOutCubic: 'inOut-cubic',
  
  // Back
  outBack: (overshoot = 1.70158) => `out-back(${overshoot})`,
  inBack: (overshoot = 1.70158) => `in-back(${overshoot})`,
  inOutBack: (overshoot = 1.70158) => `inOut-back(${overshoot})`,
  
  // Linear
  linear: 'linear',
} as const;

// Helper to normalize animation options with global config
export const createAnimeOptions = (
  options: {
    duration?: number;
    delay?: number;
    easing?: string;
    direction?: 'normal' | 'reverse' | 'alternate';
    loop?: boolean | number;
    autoplay?: boolean;
  },
  config?: {
    shouldAnimate: boolean;
    adjustDuration: (duration: number) => number;
    adjustDelay: (delay: number) => number;
  }
) => {
  const { duration, delay, easing, direction, loop, autoplay } = options;
  const normalizedOptions: any = {};
  
  // If animations are disabled, return minimal options
  if (config && !config.shouldAnimate) {
    return {
      duration: 0,
      delay: 0,
      autoplay: autoplay ?? true,
    };
  }
  
  // Apply duration with config adjustments
  if (duration !== undefined) {
    normalizedOptions.duration = config ? config.adjustDuration(duration) : duration;
  }
  
  // Apply delay with config adjustments
  if (delay !== undefined) {
    normalizedOptions.delay = config ? config.adjustDelay(delay) : delay;
  }
  
  if (easing !== undefined) normalizedOptions.easing = easing;
  if (direction !== undefined) normalizedOptions.direction = direction;
  if (autoplay !== undefined) normalizedOptions.autoplay = autoplay;
  
  // Handle loop/repeat - v4 uses 'loop' property
  if (loop !== undefined) {
    normalizedOptions.loop = loop === true ? true : loop;
  }
  
  return normalizedOptions;
};

export const useAnimeOnMount = (
  selector: string, 
  keyframes: object,
  options?: Parameters<typeof createAnimeOptions>[0]
) => {
  const animConfig = useAnimationConfig();
  
  useEffect(() => {
    if (!animConfig.shouldAnimate && !options?.autoplay) {
      return; // Skip animation entirely if disabled
    }
    
    const timer = setTimeout(() => {
      const normalizedOptions = options ? createAnimeOptions(options, animConfig) : {};
      animate(selector as any, keyframes, normalizedOptions);
    }, 50);
    
    return () => clearTimeout(timer);
  }, [selector, keyframes, options, animConfig]);
};

export const useAnimeRef = () => {
  const ref = useRef<HTMLElement>(null);
  const animConfig = useAnimationConfig();

  const animateElement = (
    keyframes: object,
    options?: Parameters<typeof createAnimeOptions>[0]
  ) => {
    if (ref.current) {
      if (!animConfig.shouldAnimate && !options?.autoplay) {
        return; // Skip animation if disabled
      }
      const normalizedOptions = options ? createAnimeOptions(options, animConfig) : {};
      animate(ref.current as any, keyframes, normalizedOptions);
    }
  };

  return { ref, animate: animateElement };
};

// Preset animation configurations using normalized easing
export const animeAnimations = {
  fadeInUp: {
    keyframes: {
      opacity: [0, 1],
      translateY: [30, 0],
    },
    options: {
      duration: 1200,
      easing: ANIME_EASING.outExpo,
    },
  },
  
  scaleIn: {
    keyframes: {
      opacity: [0, 1],
      scale: [0.8, 1],
    },
    options: {
      duration: 800,
      easing: ANIME_EASING.outElastic(1, 0.8),
    },
  },
  
  slideInLeft: {
    keyframes: {
      opacity: [0, 1],
      translateX: [-50, 0],
    },
    options: {
      duration: 1000,
      easing: ANIME_EASING.outExpo,
    },
  },
  
  slideInRight: {
    keyframes: {
      opacity: [0, 1],
      translateX: [50, 0],
    },
    options: {
      duration: 1000,
      easing: ANIME_EASING.outExpo,
    },
  },
  
  float: {
    keyframes: {
      translateY: [-10, 10],
    },
    options: {
      duration: 3000,
      direction: 'alternate' as const,
      loop: true,
      easing: ANIME_EASING.inOutSine,
    },
  },
  
  pulse: {
    keyframes: {
      scale: [1, 1.05, 1],
    },
    options: {
      duration: 1500,
      loop: true,
      easing: ANIME_EASING.inOutQuad,
    },
  },
  
  heartPulse: {
    keyframes: {
      scale: [1, 1.3, 1],
    },
    options: {
      duration: 600,
      easing: ANIME_EASING.outElastic(1, 0.5),
    },
  },
};
