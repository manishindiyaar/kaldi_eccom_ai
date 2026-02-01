/**
 * VoiceWaveform Component
 * 
 * Animated waveform bars to indicate speaking/listening state
 */

'use client';

interface VoiceWaveformProps {
  isActive: boolean;
  isSpeaking?: boolean;
  className?: string;
}

export default function VoiceWaveform({ 
  isActive, 
  isSpeaking = false, 
  className = '' 
}: VoiceWaveformProps) {
  if (!isActive) return null;

  const barCount = 5;
  const bars = Array.from({ length: barCount }, (_, i) => i);
  
  const baseColor = isSpeaking ? 'bg-purple-400' : 'bg-cyan-400';
  const glowColor = isSpeaking ? 'shadow-purple-400/50' : 'shadow-cyan-400/50';

  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      {bars.map((i) => (
        <div
          key={i}
          className={`w-1 ${baseColor} rounded-full ${glowColor} shadow-lg animate-wave`}
          style={{
            height: '24px',
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1s',
          }}
        />
      ))}
    </div>
  );
}
