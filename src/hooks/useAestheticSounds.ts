import { useCallback } from 'react';

export const useAestheticSounds = () => {
  const playClick = useCallback(() => {
    const audio = new Audio('data:audio/wav;base64,UklGRhYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQIAAAAAAA==');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  }, []);

  const playSuccess = useCallback(() => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFgYJ8gHuCfYKAgH9+gH+AgICAgICAf39+f3+AgICBgoGBgYGBgYGBgYGBgYKBgYGCgYGBgYGBgYGAgICAgIB/f39/gH+AgICAgICAgH9/f39/f4CAgICAgICAgICAgIB/f39/f3+AgH+Af39/f39/f39/gICAgICAgH9/f39/f39/gICAgICAgICAgICAgICAgICAgH9/f39/f39/f39/f4CAgICAgICAgICAgICAgICAf39/f39/f39/f39/f39/f39/gICAgICAgICAgICAgICAgICAgICAf39/f39/f39/f39/f39/f39/f39/f4CAgICAgICAgICAgICAgICAgICAgICAf39/f39/f39/f39/f39/f39/f39/f39/f39/f39/gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgH9/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgH9/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgH9/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f4CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgA==');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  }, []);

  const playHover = useCallback(() => {
    const audio = new Audio('data:audio/wav;base64,UklGRhYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQIAAAAAAA==');
    audio.volume = 0.15;
    audio.play().catch(() => {});
  }, []);

  return { playClick, playSuccess, playHover };
};
