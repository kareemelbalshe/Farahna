'use client';

import React, { useMemo } from 'react';

interface FloatingParticlesProps {
  type?: 'none' | 'golden-dust' | 'rose-petals' | 'sparkles' | string;
  count?: number;
}

export function FloatingParticles({
  type = 'golden-dust',
  count = 14,
}: FloatingParticlesProps) {
  if (!type || type === 'none') return null;

  // Generate deterministic particle configurations based on index
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const left = ((i * 100) / count + (i % 3) * 5) % 96;
      const delay = (i * 0.7) % 6;
      const duration = 9 + (i % 5) * 2;
      const size = type === 'rose-petals' ? 14 + (i % 4) * 4 : 4 + (i % 4) * 2.5;
      const opacity = 0.45 + (i % 3) * 0.2;
      return { id: i, left, delay, duration, size, opacity };
    });
  }, [count, type]);

  if (type === 'rose-petals') {
    return (
      <div className="pointer-events-none fixed inset-0 z-15 overflow-hidden select-none" aria-hidden="true">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute -top-8 animate-petal-sway"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              width: `${p.size}px`,
              height: `${p.size * 1.3}px`,
              opacity: p.opacity,
            }}
          >
            {/* Elegant SVG Rose Petal */}
            <svg
              viewBox="0 0 24 32"
              className="w-full h-full drop-shadow-xs"
              style={{
                transform: `rotate(${p.id * 35}deg)`,
              }}
            >
              <path
                d="M12 0 C18 6, 24 16, 20 26 C16 32, 8 32, 4 26 C0 16, 6 6, 12 0 Z"
                fill="url(#petalGradient)"
              />
              <defs>
                <linearGradient id="petalGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FDA4AF" />
                  <stop offset="60%" stopColor="#F43F5E" />
                  <stop offset="100%" stopColor="#BE123C" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        ))}
      </div>
    );
  }

  // Golden Dust & Sparkles
  return (
    <div className="pointer-events-none fixed inset-0 z-15 overflow-hidden select-none" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-particle-float"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: p.opacity,
            background:
              type === 'sparkles'
                ? 'radial-gradient(circle, #FFF9D2 0%, #FFD700 60%, transparent 100%)'
                : 'radial-gradient(circle, #FFFDF0 0%, #D4AF37 70%, rgba(212,175,55,0.2) 100%)',
            boxShadow: '0 0 8px rgba(212, 175, 55, 0.75)',
          }}
        />
      ))}
    </div>
  );
}
