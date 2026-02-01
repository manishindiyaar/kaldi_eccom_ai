/**
 * VoiceAssistant Component
 * 
 * Main voice interface component that combines VoiceIndicator and VoiceButton
 * to provide a complete voice interaction experience. Manages the Ultravox
 * session lifecycle, registers client tools, and handles connection errors.
 * 
 * Requirements:
 * - 1.1: Start voice session and establish connection to Ultravox API
 * - 1.2: Display visual indicator showing listening state
 * - 1.3: Terminate voice session and stop listening
 * - 1.4: Display error message and allow retry on connection failure
 * - 1.5: Process user speech in real-time and respond with synthesized speech
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import VoiceIndicator from './VoiceIndicator';
import VoiceButton from './VoiceButton';
import { VoiceStatus } from '@/lib/types';

interface VoiceAssistantProps {
  /** Custom class name for styling */
  className?: string;
  /** Whether to show debug messages in console */
  showDebugMessages?: boolean;
  /** Callback when voice status changes */
  onStatusChange?: (status: VoiceStatus) => void;
}

/**
 * VoiceAssistant Component
 * 
 * Provides a complete voice interaction interface by combining visual indicators
 * with control buttons. Manages the entire voice session lifecycle including
 * connection, error handling, and status updates.
 * 
 * The component:
 * - Displays current voice status with animated indicators
 * - Provides button to start/stop voice sessions
 * - Handles connection errors with retry capability
 * - Monitors Ultravox session status changes
 * - Registers client tools for voice-controlled UI
 */
export default function VoiceAssistant({
  className = '',
  showDebugMessages = false,
  onStatusChange,
}: VoiceAssistantProps) {
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Handle voice status changes from VoiceButton
   * Requirement 1.1, 1.3: Track session lifecycle state changes
   */
  const handleStatusChange = useCallback((newStatus: VoiceStatus) => {
    if (showDebugMessages) {
      console.log(`Voice status changed: ${voiceStatus} -> ${newStatus}`);
    }

    setVoiceStatus(newStatus);
    
    // Clear error message when status changes to non-error state
    if (newStatus !== 'error') {
      setErrorMessage(null);
    }

    // Notify parent component
    onStatusChange?.(newStatus);
  }, [voiceStatus, showDebugMessages, onStatusChange]);

  /**
   * Monitor Ultravox session status changes
   * Requirement 1.5: Process user speech in real-time
   * 
   * Note: Status changes are handled by VoiceButton component which passes
   * them up via the onStatusChange callback. The Ultravox session status
   * is managed through the callbacks passed to startCall() in voiceFunctions.ts.
   * 
   * This component receives status updates from VoiceButton and doesn't need
   * to directly monitor the Ultravox session.
   */

  /**
   * Listen for call ended events
   * Requirement 1.3: Handle session termination
   */
  useEffect(() => {
    const handleCallEnded = () => {
      if (showDebugMessages) {
        console.log('Voice call ended event received');
      }
      handleStatusChange('idle');
    };

    window.addEventListener('jarvis:call:ended', handleCallEnded);

    return () => {
      window.removeEventListener('jarvis:call:ended', handleCallEnded);
    };
  }, [handleStatusChange, showDebugMessages]);

  /**
   * Listen for application errors
   * Requirement 1.4: Display error messages
   */
  useEffect(() => {
    const handleAppError = (event: Event) => {
      const customEvent = event as CustomEvent<{ message: string; context: string }>;
      const { message, context } = customEvent.detail;

      if (showDebugMessages) {
        console.error(`App error in ${context}:`, message);
      }

      // Only show voice-related errors
      if (context.includes('voice') || context.includes('ultravox') || context.includes('call')) {
        setErrorMessage(message);
        handleStatusChange('error');
      }
    };

    window.addEventListener('appError', handleAppError);

    return () => {
      window.removeEventListener('appError', handleAppError);
    };
  }, [handleStatusChange, showDebugMessages]);

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      {/* Voice Status Indicator */}
      {/* Requirement 1.2: Display visual indicator showing listening state */}
      <VoiceIndicator status={voiceStatus} className="min-h-[100px]" />

      {/* Voice Control Button */}
      {/* Requirement 1.1, 1.3: Start and stop voice sessions */}
      <VoiceButton
        status={voiceStatus}
        onStatusChange={handleStatusChange}
        showDebugMessages={showDebugMessages}
      />

      {/* Error Message Display */}
      {/* Requirement 1.4: Display error message and allow retry */}
      {errorMessage && voiceStatus === 'error' && (
        <div className="max-w-md p-4 bg-[var(--error)] bg-opacity-10 border border-[var(--error)] rounded-lg animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--error)] flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-[var(--error)] mb-1">
                Connection Error
              </h3>
              <p className="text-xs text-[var(--foreground-muted)]">
                {errorMessage}
              </p>
              <p className="text-xs text-[var(--foreground-muted)] mt-2">
                Click the microphone button to retry.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status Description */}
      {voiceStatus !== 'idle' && voiceStatus !== 'error' && (
        <div className="text-center">
          <p className="text-sm text-[var(--foreground-muted)]">
            {voiceStatus === 'connecting' && 'Connecting to voice assistant...'}
            {voiceStatus === 'listening' && 'Listening... Speak your command'}
            {voiceStatus === 'speaking' && 'Jarvis is speaking...'}
          </p>
        </div>
      )}
    </div>
  );
}
