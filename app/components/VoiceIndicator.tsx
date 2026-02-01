/**
 * VoiceIndicator Component
 * 
 * Beautiful gradient animation for voice AI status
 * Inspired by modern voice assistant UIs
 */

'use client';

import { VoiceStatus } from '@/lib/types';

interface VoiceIndicatorProps {
  status: VoiceStatus;
  className?: string;
}

export default function VoiceIndicator({ status, className = '' }: VoiceIndicatorProps) {
  const isActive = status === 'listening' || status === 'speaking';
  
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Gradient Background Blur */}
      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-full blur-3xl opacity-40 animate-pulse-slow" />
        </div>
      )}
      
      {/* Animated Rings */}
      {isActive && (
        <>
          <div className="absolute w-64 h-64 rounded-full border-2 border-cyan-400 opacity-20 animate-ping-slow" />
          <div className="absolute w-80 h-80 rounded-full border border-blue-400 opacity-10 animate-ping-slower" />
        </>
      )}
      
      {/* Center Circle */}
      <div className="relative z-10">
        {status === 'idle' && (
          <div className="w-32 h-32 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
            <div className="text-gray-500 text-sm">Ready</div>
          </div>
        )}
        
        {status === 'connecting' && (
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center animate-pulse">
            <div className="text-white text-sm font-medium">Connecting...</div>
          </div>
        )}
        
        {status === 'listening' && (
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-cyan-500/50 animate-pulse-glow">
            <div className="text-white text-sm font-medium">Listening</div>
          </div>
        )}
        
        {status === 'speaking' && (
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-purple-500/50 animate-pulse-glow">
            <div className="text-white text-sm font-medium">Speaking</div>
          </div>
        )}
        
        {status === 'error' && (
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
            <div className="text-white text-sm font-medium">Error</div>
          </div>
        )}
      </div>
    </div>
  );
}
