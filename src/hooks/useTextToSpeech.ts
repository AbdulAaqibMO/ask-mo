'use client';

import { useCallback } from 'react';

interface UseTextToSpeechReturn {
  speak: (text: string) => void;
  cancel: () => void;
  hasSupport: boolean;
}

export const useTextToSpeech = (): UseTextToSpeechReturn => {
  const hasSupport = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const speak = useCallback((text: string) => {
    if (!hasSupport) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  }, [hasSupport]);

  const cancel = useCallback(() => {
    if (hasSupport) {
      window.speechSynthesis.cancel();
    }
  }, [hasSupport]);

  return {
    speak,
    cancel,
    hasSupport,
  };
};
