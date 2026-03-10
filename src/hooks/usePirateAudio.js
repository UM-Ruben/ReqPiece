import { useEffect, useMemo } from "react";

const DEFAULT_SOUNDS = {
  click: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=click-124467.mp3",
  error: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_8f0f8d1f6f.mp3?filename=error-126627.mp3",
  success: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_5f60365aa0.mp3?filename=success-1-6297.mp3",
};

function safePlay(audioInstance) {
  if (!audioInstance) return;
  audioInstance.currentTime = 0;
  audioInstance.play().catch(() => {
    // Avoid unhandled promise rejection if browser blocks autoplay.
  });
}

export function usePirateAudio(customUrls = {}) {
  const urls = useMemo(() => ({ ...DEFAULT_SOUNDS, ...customUrls }), [customUrls]);

  const clickAudio = useMemo(() => new Audio(urls.click), [urls.click]);
  const errorAudio = useMemo(() => new Audio(urls.error), [urls.error]);
  const successAudio = useMemo(() => new Audio(urls.success), [urls.success]);

  useEffect(() => {
    clickAudio.preload = "auto";
    errorAudio.preload = "auto";
    successAudio.preload = "auto";

    return () => {
      clickAudio.pause();
      errorAudio.pause();
      successAudio.pause();
    };
  }, [clickAudio, errorAudio, successAudio]);

  const playClick = () => safePlay(clickAudio);
  const playError = () => safePlay(errorAudio);
  const playSuccess = () => safePlay(successAudio);

  return {
    playClick,
    playError,
    playSuccess,
  };
}
