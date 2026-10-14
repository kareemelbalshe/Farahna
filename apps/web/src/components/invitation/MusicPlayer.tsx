'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';

interface MusicPlayerProps {
  musicUrl?: string | null;
  musicTitle?: string | null;
  shouldAutoTrigger?: boolean;
  isPreview?: boolean;
}

export function MusicPlayer({
  musicUrl,
  musicTitle = 'موسيقى ليلة العمر الهادئة',
  shouldAutoTrigger = false,
  isPreview = false,
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioFailed, setAudioFailed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!musicUrl) return;
    setAudioFailed(false);

    try {
      const audio = new Audio(musicUrl);
      audio.loop = true;
      audio.onerror = () => {
        setIsPlaying(false);
        setAudioFailed(true);
      };
      audioRef.current = audio;

      if (shouldAutoTrigger) {
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Browser prevented autoplay before interaction
            setIsPlaying(false);
          });
      }
    } catch (e) {
      setAudioFailed(true);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [musicUrl, shouldAutoTrigger]);

  if (!musicUrl || audioFailed) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log('Audio playback prevented:', e));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div
      className={
        isPreview
          ? 'fixed bottom-3 left-3 z-30 max-w-[calc(100%-24px)] pointer-events-auto'
          : 'fixed bottom-20 left-4 sm:bottom-5 sm:left-5 z-40'
      }
    >
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900/95 text-white backdrop-blur-md border border-amber-500/40 shadow-xl transition-all ${
          isPreview
            ? 'max-w-[220px]'
            : 'sm:px-3.5 sm:py-2 max-w-[230px] sm:max-w-none'
        }`}
      >
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          className={`rounded-full bg-amber-500 text-stone-950 flex items-center justify-center hover:bg-amber-400 transition-colors shadow-xs active:scale-95 shrink-0 ${
            isPreview ? 'w-7 h-7' : 'w-7 h-7 sm:w-8 sm:h-8'
          }`}
          aria-label={isPlaying ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current mr-0.5" />
          )}
        </button>

        {/* Info & Animated Equalizer */}
        <div className="flex flex-col text-right pr-0.5 min-w-0">
          <span
            className={`font-bold text-amber-200 truncate ${
              isPreview
                ? 'text-[10px] max-w-[90px]'
                : 'text-[10px] sm:text-[11px] max-w-[100px] sm:max-w-[125px]'
            }`}
          >
            {musicTitle}
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <span
              className={`w-0.5 h-2 bg-amber-400 rounded-full ${
                isPlaying ? 'animate-pulse' : 'opacity-40'
              }`}
            />
            <span
              className={`w-0.5 h-3 bg-amber-400 rounded-full ${
                isPlaying ? 'animate-bounce' : 'opacity-40'
              }`}
            />
            <span
              className={`w-0.5 h-2 bg-amber-400 rounded-full ${
                isPlaying ? 'animate-pulse' : 'opacity-40'
              }`}
            />
            <span className="text-[9px] text-stone-400 mr-1 truncate">
              {isPlaying ? 'يعزف الآن 🎵' : 'متوقف'}
            </span>
          </div>
        </div>

        {/* Mute button */}
        {isPlaying && (
          <button
            type="button"
            onClick={toggleMute}
            className="text-stone-400 hover:text-white transition-colors p-1 shrink-0"
            aria-label={isMuted ? 'إلغاء الكتم' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}
