/**
 * VoiceAssistant Component
 * 
 * Futuristic Jarvis-style voice interface with animated background
 */

'use client';

import { useState, useCallback } from 'react';
import VoiceIndicator from './VoiceIndicator';
import VoiceButton from './VoiceButton';
import VoiceWaveform from './VoiceWaveform';
import JarvisBackground from './JarvisBackground';
import { VoiceStatus, Product, ProductCategory, CartItem } from '@/lib/types';

interface VoiceAssistantProps {
  className?: string;
  showDebugMessages?: boolean;
  currentProducts?: Product[];
  selectedProduct?: Product | null;
  activeCategory?: ProductCategory | 'all';
  cartItems?: CartItem[];
  cartSubtotal?: number;
}

export default function VoiceAssistant({
  className = '',
  showDebugMessages = false,
  currentProducts = [],
  selectedProduct = null,
  activeCategory = 'all',
  cartItems = [],
  cartSubtotal = 0,
}: VoiceAssistantProps) {
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('idle');

  const handleStatusChange = useCallback((newStatus: VoiceStatus) => {
    setVoiceStatus(newStatus);
  }, []);

  const isActive = voiceStatus === 'listening' || voiceStatus === 'speaking';

  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center ${className}`}>
      {/* Jarvis Background */}
      <JarvisBackground isActive={isActive} />

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center gap-12">
        {/* Status Badge - Always Visible */}
        <div className="absolute top-8 right-8">
          {voiceStatus === 'listening' && (
            <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-400 rounded-full backdrop-blur-sm animate-pulse">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-cyan-400 text-sm font-semibold">Listening</span>
            </div>
          )}
          {voiceStatus === 'speaking' && (
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-400 rounded-full backdrop-blur-sm animate-pulse">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <span className="text-purple-400 text-sm font-semibold">Speaking</span>
            </div>
          )}
          {voiceStatus === 'connecting' && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400 rounded-full backdrop-blur-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-blue-400 text-sm font-semibold">Connecting...</span>
            </div>
          )}
        </div>

        {/* Gradient Animation */}
        <VoiceIndicator status={voiceStatus} />

        {/* Voice Button */}
        <VoiceButton
          status={voiceStatus}
          onStatusChange={handleStatusChange}
          showDebugMessages={showDebugMessages}
          currentProducts={currentProducts}
          selectedProduct={selectedProduct}
          activeCategory={activeCategory}
          cartItems={cartItems}
          cartSubtotal={cartSubtotal}
        />

        {/* Status Text */}
        <div className="text-center space-y-4">
          {/* Waveform Indicator */}
          <VoiceWaveform 
            isActive={isActive} 
            isSpeaking={voiceStatus === 'speaking'} 
          />
          
          {voiceStatus === 'idle' && (
            <p className="text-gray-400 text-sm">Click the button to start</p>
          )}
          {voiceStatus === 'connecting' && (
            <p className="text-cyan-400 text-sm animate-pulse">Connecting to AI...</p>
          )}
          {voiceStatus === 'listening' && (
            <p className="holographic-text text-sm font-semibold">I&apos;m listening... speak now</p>
          )}
          {voiceStatus === 'speaking' && (
            <p className="holographic-text text-sm font-semibold">AI is speaking...</p>
          )}
          {voiceStatus === 'error' && (
            <p className="text-red-400 text-sm">Connection error - try again</p>
          )}
        </div>

        {/* Voice Commands Help */}
        {voiceStatus === 'idle' && (
          <div className="mt-8 p-6 bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-cyan-500/30 max-w-sm">
            <h3 className="text-cyan-400 text-sm font-semibold mb-3">Voice Commands:</h3>
            <ul className="text-gray-400 text-xs space-y-2">
              <li>• &quot;Show trending items&quot;</li>
              <li>• &quot;Next product&quot;</li>
              <li>• &quot;Is this a bestseller?&quot;</li>
              <li>• &quot;Add to watchlist&quot;</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
