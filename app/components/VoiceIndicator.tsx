/**
 * VoiceIndicator Component
 * 
 * Displays visual indicator for voice session states (idle/listening/speaking)
 * with animated effects for premium user experience.
 * 
 * Requirements:
 * - 1.2: Display visual indicator showing listening state
 * - 7.2: Animated visual indicator while listening (pulsing orb)
 * - 7.3: Different animated indicator while speaking (waveform)
 */

'use client';

import { VoiceStatus } from '@/lib/types';

interface VoiceIndicatorProps {
  status: VoiceStatus;
  className?: string;
}

export default function VoiceIndicator({ status, className = '' }: VoiceIndicatorProps) {
  // Idle state - no indicator
  if (status === 'idle') {
    return null;
  }

  // Error state - red pulsing indicator
  if (status === 'error') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500 animate-pulse-glow" />
          <div className="absolute w-8 h-8 rounded-full bg-red-500" />
        </div>
      </div>
    );
  }

  // Connecting state - simple pulsing
  if (status === 'connecting') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[var(--primary)]/20 border-2 border-[var(--primary)] animate-pulse" />
          <div className="absolute w-8 h-8 rounded-full bg-[var(--primary)]" />
        </div>
      </div>
    );
  }

  // Listening state - pulsing orb with glow
  if (status === 'listening') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="relative flex items-center justify-center">
          {/* Outer ripple effect */}
          <div className="absolute w-24 h-24 rounded-full bg-[var(--primary)]/10 animate-ripple" />
          <div 
            className="absolute w-24 h-24 rounded-full bg-[var(--primary)]/10 animate-ripple" 
            style={{ animationDelay: '0.5s' }}
          />
          
          {/* Main pulsing orb */}
          <div className="w-16 h-16 rounded-full bg-[var(--primary)]/20 border-2 border-[var(--primary)] animate-pulse-glow" />
          <div className="absolute w-8 h-8 rounded-full bg-[var(--primary)]" />
        </div>
      </div>
    );
  }

  // Speaking state - waveform animation
  if (status === 'speaking') {
    return (
      <div className={`flex items-center justify-center gap-1 ${className}`}>
        {/* 5 bars with staggered wave animation */}
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="w-2 h-12 bg-[var(--accent)] rounded-full animate-wave"
            style={{
              animationDelay: `${index * 0.1}s`,
              height: index === 2 ? '3rem' : index === 1 || index === 3 ? '2.5rem' : '2rem',
            }}
          />
        ))}
      </div>
    );
  }

  return null;
}
