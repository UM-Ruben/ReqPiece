import { useEffect, useMemo } from "react";

const DEFAULT_SOUNDS = {
  click: "/audio/click.wav",
  error: "/audio/error.wav",
  success: "/audio/success.wav",
  background: "/audio/MusicaDeFondo.mp3",
};

function safePlay(audioInstance) {
  if (!audioInstance) return;
  audioInstance.currentTime = 0;
  audioInstance.play().catch(() => {

  });
}

export function usePirateAudio(customUrls = {}) {
  const urls = useMemo(() => ({ ...DEFAULT_SOUNDS, ...customUrls }), [customUrls]);

  const clickAudio = useMemo(() => new Audio(urls.click), [urls.click]);
  const errorAudio = useMemo(() => new Audio(urls.error), [urls.error]);
  const successAudio = useMemo(() => new Audio(urls.success), [urls.success]);
  const backgroundAudio = useMemo(() => new Audio(urls.background), [urls.background]);

  useEffect(() => {
    clickAudio.preload = "auto";
    errorAudio.preload = "auto";
    successAudio.preload = "auto";
    backgroundAudio.preload = "auto";
    backgroundAudio.loop = true;
    backgroundAudio.volume = 0.2;

    const startBackgroundMusic = () => {
      backgroundAudio.play().catch(() => {
        // Ignore autoplay errors; we'll retry on user gesture.
      });
    };

    startBackgroundMusic();

    const handleUserGesture = () => {
      if (backgroundAudio.paused) {
        startBackgroundMusic();
      }
    };

    window.addEventListener("pointerdown", handleUserGesture, { passive: true });
    window.addEventListener("keydown", handleUserGesture);

    return () => {
      clickAudio.pause();
      errorAudio.pause();
      successAudio.pause();
      backgroundAudio.pause();
      window.removeEventListener("pointerdown", handleUserGesture);
      window.removeEventListener("keydown", handleUserGesture);
    };
  }, [backgroundAudio, clickAudio, errorAudio, successAudio]);

  const playClick = () => safePlay(clickAudio);
  const playError = () => safePlay(errorAudio);
  const playSuccess = () => safePlay(successAudio);

  return {
    playClick,
    playError,
    playSuccess,
  };
}
