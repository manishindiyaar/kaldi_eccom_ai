/**
 * VoiceButton Component
 * 
 * Provides activation/deactivation button for voice sessions with microphone
 * permission handling.
 * 
 * Requirements:
 * - 1.1: Start voice session and establish connection to Ultravox API
 * - 1.3: Terminate voice session and stop listening
 * - 10.3: Handle microphone permission requests
 */

'use client';

import { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { startCall, endCall } from '@/lib/voiceFunctions';
import { JARVIS_CONFIG } from '@/app/jarvis-config';
import { VoiceStatus } from '@/lib/types';

interface VoiceButtonProps {
  /** Current voice session status */
  status?: VoiceStatus;
  /** Callback when status changes */
  onStatusChange?: (status: VoiceStatus) => void;
  /** Whether to show debug messages in console */
  showDebugMessages?: boolean;
  /** Custom class name for styling */
  className?: string;
}

/**
 * VoiceButton Component
 * 
 * A button that controls voice session activation/deactivation with visual
 * feedback for different states (idle, connecting, listening, error).
 * Handles microphone permissions and provides user feedback.
 */
export default function VoiceButton({
  status = 'idle',
  onStatusChange,
  showDebugMessages = false,
  className = '',
}: VoiceButtonProps) {
  const [localStatus, setLocalStatus] = useState<VoiceStatus>(status);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isActivating, setIsActivating] = useState(false);

  // Sync local status with prop
  useEffect(() => {
    setLocalStatus(status);
  }, [status]);

  /**
   * Update status and notify parent component
   */
  const updateStatus = (newStatus: VoiceStatus) => {
    setLocalStatus(newStatus);
    onStatusChange?.(newStatus);
  };

  /**
   * Check and request microphone permissions
   * Requirement 10.3: Handle microphone permission requests
   */
  const checkMicrophonePermission = async (): Promise<boolean> => {
    try {
      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setPermissionError('Your browser does not support microphone access.');
        return false;
      }

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Stop the stream immediately - we just needed to check permission
      stream.getTracks().forEach(track => track.stop());
      
      setPermissionError(null);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          setPermissionError(
            'Microphone access denied. Please enable microphone permissions in your browser settings.'
          );
        } else if (error.name === 'NotFoundError') {
          setPermissionError('No microphone found. Please connect a microphone and try again.');
        } else {
          setPermissionError(`Microphone error: ${error.message}`);
        }
      } else {
        setPermissionError('Failed to access microphone.');
      }
      
      console.error('Microphone permission error:', error);
      return false;
    }
  };

  /**
   * Handle voice session activation
   * Requirement 1.1: Start voice session and establish connection
   */
  const handleActivate = async () => {
    // Prevent multiple simultaneous activation attempts
    if (isActivating) {
      console.log('[VoiceButton] Already activating, ignoring duplicate request');
      return;
    }

    try {
      setIsActivating(true);
      console.log('[VoiceButton] Starting voice activation...');
      updateStatus('connecting');
      setPermissionError(null);

      // Start the voice call (this will handle mic permissions internally)
      console.log('[VoiceButton] Starting voice call with config:', {
        model: JARVIS_CONFIG.model,
        voice: JARVIS_CONFIG.voice,
        toolCount: JARVIS_CONFIG.selectedTools?.length || 0,
      });
      
      await startCall(
        {
          onStatusChange: (newStatus) => {
            console.log('[VoiceButton] Status changed to:', newStatus);
            if (typeof newStatus === 'string') {
              updateStatus(newStatus as VoiceStatus);
            }
          },
        },
        JARVIS_CONFIG,
        true // Enable debug messages
      );

      console.log('[VoiceButton] Voice call started successfully');
      updateStatus('listening');
    } catch (error) {
      console.error('[VoiceButton] Failed to start voice session:', error);
      updateStatus('error');
      
      if (error instanceof Error) {
        const errorMsg = error.message;
        console.error('[VoiceButton]', errorMsg);
        
        // Check if it's a permission error
        if (errorMsg.includes('permission') || errorMsg.includes('NotAllowedError') || errorMsg.includes('microphone')) {
          setPermissionError('Microphone access denied. Please enable microphone permissions in your browser settings.');
        } else {
          setPermissionError(errorMsg);
        }
      } else {
        const errorMsg = 'Failed to start voice session. Please try again.';
        console.error('[VoiceButton]', errorMsg);
        setPermissionError(errorMsg);
      }
    } finally {
      setIsActivating(false);
    }
  };

  /**
   * Handle voice session deactivation
   * Requirement 1.3: Terminate voice session and stop listening
   */
  const handleDeactivate = async () => {
    try {
      await endCall();
      updateStatus('idle');
      setPermissionError(null);
    } catch (error) {
      console.error('Failed to end voice session:', error);
      // Still update to idle even if there's an error
      updateStatus('idle');
    }
  };

  /**
   * Toggle voice session on/off
   */
  const handleClick = async () => {
    // Prevent clicks during activation
    if (isActivating) {
      console.log('[VoiceButton] Click ignored - already activating');
      return;
    }

    if (localStatus === 'idle' || localStatus === 'error') {
      await handleActivate();
    } else if (localStatus === 'listening' || localStatus === 'speaking') {
      await handleDeactivate();
    }
    // Do nothing if connecting
  };

  /**
   * Determine button appearance based on status
   */
  const getButtonStyles = () => {
    const baseStyles = 'relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--background)]';
    
    switch (localStatus) {
      case 'idle':
        return `${baseStyles} bg-[var(--card-bg)] border-2 border-[var(--card-border)] hover:border-[var(--primary)] hover:bg-[var(--card-bg-hover)] focus:ring-[var(--primary)]`;
      
      case 'connecting':
        return `${baseStyles} bg-[var(--card-bg)] border-2 border-[var(--primary)] cursor-wait focus:ring-[var(--primary)]`;
      
      case 'listening':
      case 'speaking':
        return `${baseStyles} bg-[var(--primary)] border-2 border-[var(--primary-light)] hover:bg-[var(--primary-dark)] animate-pulse-glow focus:ring-[var(--primary-light)]`;
      
      case 'error':
        return `${baseStyles} bg-[var(--error)] border-2 border-red-600 hover:bg-red-600 focus:ring-red-500`;
      
      default:
        return `${baseStyles} bg-[var(--card-bg)] border-2 border-[var(--card-border)]`;
    }
  };

  /**
   * Get icon based on status
   */
  const getIcon = () => {
    const iconSize = 24;
    const iconColor = localStatus === 'idle' ? 'var(--foreground-muted)' : 'white';
    
    switch (localStatus) {
      case 'connecting':
        return <Loader2 size={iconSize} color={iconColor} className="animate-spin" />;
      
      case 'listening':
      case 'speaking':
        return <Mic size={iconSize} color={iconColor} />;
      
      case 'error':
        return <MicOff size={iconSize} color="white" />;
      
      case 'idle':
      default:
        return <Mic size={iconSize} color={iconColor} />;
    }
  };

  /**
   * Get tooltip text based on status
   */
  const getTooltipText = () => {
    switch (localStatus) {
      case 'idle':
        return 'Start voice session';
      case 'connecting':
        return 'Connecting...';
      case 'listening':
        return 'Listening - Click to stop';
      case 'speaking':
        return 'Speaking - Click to stop';
      case 'error':
        return 'Error - Click to retry';
      default:
        return 'Voice control';
    }
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <button
        onClick={handleClick}
        disabled={localStatus === 'connecting' || isActivating}
        className={getButtonStyles()}
        title={getTooltipText()}
        aria-label={getTooltipText()}
        aria-pressed={localStatus === 'listening' || localStatus === 'speaking'}
      >
        {getIcon()}
      </button>
      
      {/* Status text */}
      <span className="text-xs text-[var(--foreground-muted)] capitalize">
        {localStatus}
      </span>
      
      {/* Permission error message */}
      {permissionError && (
        <div className="mt-2 p-3 max-w-xs bg-[var(--error)] bg-opacity-10 border border-[var(--error)] rounded-lg animate-fade-in">
          <p className="text-xs text-[var(--error)] text-center">
            {permissionError}
          </p>
          {permissionError.includes('browser settings') && (
            <p className="text-xs text-[var(--foreground-muted)] text-center mt-2">
              Look for the microphone icon in your browser&apos;s address bar or check Settings → Privacy → Microphone
            </p>
          )}
        </div>
      )}
    </div>
  );
}
