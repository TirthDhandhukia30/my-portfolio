import { useState, useRef, useCallback } from 'react';

interface UseAudioPlayerOptions {
  volume?: number;
}

export function useAudioPlayer(src: string, options: UseAudioPlayerOptions = {}) {
  const { volume = 0.7 } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.volume = volume;
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
        }
      });
    }
    return audioRef.current;
  }, [src, volume]);

  const play = useCallback(() => {
    const audio = getAudio();
    audio.play().catch(console.error);
    setIsPlaying(true);
  }, [getAudio]);

  const pause = useCallback(() => {
    const audio = getAudio();
    audio.pause();
    setIsPlaying(false);
  }, [getAudio]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const playOnce = useCallback((audioSrc: string, vol = 0.3) => {
    const sound = new Audio(audioSrc);
    sound.volume = vol;
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }, []);

  return {
    isPlaying,
    play,
    pause,
    toggle,
    playOnce,
  };
}
