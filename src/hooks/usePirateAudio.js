import { useEffect, useMemo } from "react";

const DEFAULT_SOUNDS = {
  click: "/audio/click.wav",
  error: "/audio/error.wav",
  success: "/audio/success.wav",
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
