/**
 * Web Audio API synthesizer for theme musical motifs.
 * Provides instant, zero-dependency melodic signatures for each Farahna invitation theme.
 */

type ThemeSlug = 'royal-burgundy' | 'elegant-gold' | 'minimal-white' | 'romantic-floral' | 'egyptian-oriental' | 'emerald-palace';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playThemeMelody(slug: ThemeSlug, onFinished?: () => void): () => void {
  const ctx = getAudioContext();
  if (!ctx) {
    onFinished?.();
    return () => {};
  }

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.18, now);
  masterGain.connect(ctx.destination);

  let duration = 2.2;

  // Distinct harmonic motifs per theme
  switch (slug) {
    case 'royal-burgundy': {
      // Royal Stately Fanfare / Harp (C4, G4, C5, E5, G5)
      const freqs = [261.63, 392.00, 523.25, 659.25, 783.99];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.16);

        noteGain.gain.setValueAtTime(0.001, now + idx * 0.16);
        noteGain.gain.exponentialRampToValueAtTime(0.3, now + idx * 0.16 + 0.04);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.16 + 1.2);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(now + idx * 0.16);
        osc.stop(now + idx * 0.16 + 1.3);
      });
      duration = 2.1;
      break;
    }

    case 'elegant-gold': {
      // Nocturnal Romantic Piano & Shimmer (Eb4, Bb4, Eb5, G5)
      const freqs = [311.13, 466.16, 622.25, 783.99];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.18);

        noteGain.gain.setValueAtTime(0.001, now + idx * 0.18);
        noteGain.gain.exponentialRampToValueAtTime(0.35, now + idx * 0.18 + 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.18 + 1.4);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(now + idx * 0.18);
        osc.stop(now + idx * 0.18 + 1.5);
      });
      duration = 2.2;
      break;
    }

    case 'minimal-white': {
      // Gentle Glass Music Box / Pure Celesta (F4, A4, C5, E5, F5)
      const freqs = [349.23, 440.00, 523.25, 659.25, 698.46];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.14);

        noteGain.gain.setValueAtTime(0.001, now + idx * 0.14);
        noteGain.gain.exponentialRampToValueAtTime(0.25, now + idx * 0.14 + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.14 + 1.0);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(now + idx * 0.14);
        osc.stop(now + idx * 0.14 + 1.1);
      });
      duration = 1.9;
      break;
    }

    case 'romantic-floral': {
      // Sweet Romantic Harp Glissando (D4, F#4, A4, D5, F#5)
      const freqs = [293.66, 369.99, 440.00, 587.33, 739.99];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);

        noteGain.gain.setValueAtTime(0.001, now + idx * 0.15);
        noteGain.gain.exponentialRampToValueAtTime(0.28, now + idx * 0.15 + 0.03);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.15 + 1.1);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 1.2);
      });
      duration = 2.0;
      break;
    }

    case 'egyptian-oriental': {
      // Traditional Plucked Oud Flourish (D4, G4, A4, C5, D5)
      const freqs = [293.66, 392.00, 440.00, 523.25, 587.33];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.18);

        // Filter for warm woody oud resonance
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now + idx * 0.18);

        noteGain.gain.setValueAtTime(0.001, now + idx * 0.18);
        noteGain.gain.exponentialRampToValueAtTime(0.3, now + idx * 0.18 + 0.03);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.18 + 0.9);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(now + idx * 0.18);
        osc.stop(now + idx * 0.18 + 1.0);
      });
      duration = 2.1;
      break;
    }

    case 'emerald-palace': {
      // Imperial Palace Chimes / Royal Harp & Bells (E4, G#4, B4, E5, G#5)
      const freqs = [329.63, 415.30, 493.88, 659.25, 830.61];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);

        noteGain.gain.setValueAtTime(0.001, now + idx * 0.15);
        noteGain.gain.exponentialRampToValueAtTime(0.32, now + idx * 0.15 + 0.03);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.15 + 1.3);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 1.4);
      });
      duration = 2.2;
      break;
    }
  }

  const timer = setTimeout(() => {
    onFinished?.();
  }, duration * 1000);

  return () => {
    clearTimeout(timer);
    try {
      masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
    } catch {}
    onFinished?.();
  };
}
