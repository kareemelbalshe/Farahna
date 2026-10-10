'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';

interface MusicPlayerProps {
  musicUrl?: string | null;
  musicTitle?: string | null;
  shouldAutoTrigger?: boolean;
}

export function MusicPlayer({
  musicUrl,
  musicTitle = 'موسيقى ليلة العمر الهادئة',
  shouldAutoTrigger = false,
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
    <div className="fixed bottom-5 left-5 z-40">
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-stone-900/90 text-white backdrop-blur-md border border-amber-500/30 shadow-2xl transition-all">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center hover:bg-amber-400 transition-colors shadow-xs active:scale-95"
          aria-label={isPlaying ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current mr-0.5" />}
        </button>

        {/* Info & Animated Equalizer */}
        <div className="hidden sm:flex flex-col text-right pr-1">
          <span className="text-[11px] font-bold text-amber-200 truncate max-w-[120px]">
            {musicTitle}
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <span
              className={`w-1 h-2 bg-amber-400 rounded-full ${isPlaying ? 'animate-pulse' : 'opacity-40'}`}
            />
            <span
              className={`w-1 h-3.5 bg-amber-400 rounded-full ${isPlaying ? 'animate-bounce' : 'opacity-40'}`}
            />
            <span
              className={`w-1 h-2.5 bg-amber-400 rounded-full ${isPlaying ? 'animate-pulse' : 'opacity-40'}`}
            />
          </div>
        </div>

        {/* Mute button */}
        {isPlaying && (
          <button
            type="button"
            onClick={toggleMute}
            className="text-stone-400 hover:text-white transition-colors p-1"
            aria-label={isMuted ? 'إلغاء الكتم' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}
