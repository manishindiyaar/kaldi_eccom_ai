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

import { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { startCall, endCall, addStatusListener, getSessionStatus, isSessionActive } from '@/lib/voiceFunctions';
import { KALDI_CONFIG } from '@/app/jarvis-config';
import { VoiceStatus, Product, ProductCategory, CartItem } from '@/lib/types';
import { useProductContext } from '@/lib/useProductContext';

interface VoiceButtonProps {
  /** Current voice session status */
  status?: VoiceStatus;
  /** Callback when status changes */
  onStatusChange?: (status: VoiceStatus) => void;
  /** Whether to show debug messages in console */
  showDebugMessages?: boolean;
  /** Custom class name for styling */
  className?: string;
  /** Current products being displayed */
  currentProducts?: Product[];
  /** Currently selected product */
  selectedProduct?: Product | null;
  /** Active category filter */
  activeCategory?: ProductCategory | 'all';
  /** Cart items */
  cartItems?: CartItem[];
  /** Cart subtotal */
  cartSubtotal?: number;
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
  className = '',
  currentProducts = [],
  selectedProduct = null,
  activeCategory = 'all',
  cartItems = [],
  cartSubtotal = 0,
}: VoiceButtonProps) {
  const [localStatus, setLocalStatus] = useState<VoiceStatus>(status);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isActivating, setIsActivating] = useState(false);

  // Get dynamic system prompt with product context
  const { systemPrompt } = useProductContext({
    currentProducts,
    selectedProduct,
    activeCategory,
    cartItems,
    cartSubtotal,
  });

  // Sync local status with prop
  useEffect(() => {
    setLocalStatus(status);
  }, [status]);

  /**
   * Update status and notify parent component
   */
  const updateStatus = useCallback((newStatus: VoiceStatus) => {
    setLocalStatus(newStatus);
    onStatusChange?.(newStatus);
  }, [onStatusChange]);

  /**
   * Monitor Ultravox session status changes
   */
  useEffect(() => {
    // Poll for status changes every 300ms for more responsive updates
    const statusInterval = setInterval(() => {
      const sessionActive = isSessionActive();
      
      if (!sessionActive && (localStatus === 'listening' || localStatus === 'speaking')) {
        // Session ended but UI still shows active - reset to idle
        console.log('[VoiceButton] Session inactive but UI shows active, resetting to idle');
        updateStatus('idle');
        return;
      }
      
      if (sessionActive) {
        const currentStatus = getSessionStatus();
        
        if (currentStatus) {
          // Map Ultravox status to our VoiceStatus
          let newStatus: VoiceStatus | null = null;
          
          if (currentStatus === 'listening' && localStatus !== 'listening') {
            newStatus = 'listening';
          } else if (currentStatus === 'speaking' && localStatus !== 'speaking') {
            newStatus = 'speaking';
          } else if ((currentStatus === 'idle' || currentStatus === 'disconnected') && 
                     (localStatus === 'listening' || localStatus === 'speaking')) {
            newStatus = 'idle';
          }
          
          if (newStatus) {
            console.log('[VoiceButton] Status changed from', localStatus, 'to', newStatus);
            updateStatus(newStatus);
          }
        }
      }
    }, 300); // Check every 300ms for responsive updates

    // Also set up event listener for immediate updates
    const cleanup = addStatusListener?.((status: string) => {
      console.log('[VoiceButton] Status event received:', status);
      
      if (status === 'listening') {
        updateStatus('listening');
      } else if (status === 'speaking') {
        updateStatus('speaking');
      } else if (status === 'idle' || status === 'disconnected') {
        if (localStatus === 'listening' || localStatus === 'speaking') {
          updateStatus('idle');
        }
      }
    });

    return () => {
      clearInterval(statusInterval);
      if (cleanup) cleanup();
    };
  }, [localStatus, updateStatus]);

  /**
   * Check and request microphone permissions
   * Requirement 10.3: Handle microphone permission requests
   * Note: Currently not used as Ultravox handles permissions internally
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        model: KALDI_CONFIG.model,
        voice: KALDI_CONFIG.voice,
        toolCount: KALDI_CONFIG.selectedTools?.length || 0,
        systemPromptLength: systemPrompt.length,
      });
      
      // Create config with dynamic system prompt
      const callConfig = {
        ...KALDI_CONFIG,
        systemPrompt,
      };
      
      await startCall(
        {
          onStatusChange: (newStatus) => {
            console.log('[VoiceButton] Status changed to:', newStatus);
            if (typeof newStatus === 'string') {
              updateStatus(newStatus as VoiceStatus);
            }
          },
        },
        callConfig,
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
    const baseStyles = 'relative flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 focus:outline-none';
    
    switch (localStatus) {
      case 'idle':
        return `${baseStyles} bg-gray-800 border-2 border-gray-700 hover:border-cyan-500 hover:bg-gray-700`;
      
      case 'connecting':
        return `${baseStyles} bg-gradient-to-br from-cyan-500 to-blue-600 border-2 border-cyan-400 cursor-wait animate-pulse`;
      
      case 'listening':
        return `${baseStyles} bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 border-2 border-cyan-300 shadow-lg shadow-cyan-500/50 animate-pulse-glow`;
      
      case 'speaking':
        return `${baseStyles} bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 border-2 border-purple-300 shadow-lg shadow-purple-500/50 animate-pulse-glow`;
      
      case 'error':
        return `${baseStyles} bg-gradient-to-br from-red-500 to-red-700 border-2 border-red-400`;
      
      default:
        return `${baseStyles} bg-gray-800 border-2 border-gray-700`;
    }
  };

  /**
   * Get icon based on status
   */
  const getIcon = () => {
    const iconSize = 28;
    const iconColor = 'white';
    
    switch (localStatus) {
      case 'connecting':
        return <Loader2 size={iconSize} color={iconColor} className="animate-spin" />;
      
      case 'listening':
      case 'speaking':
        return <Mic size={iconSize} color={iconColor} />;
      
      case 'error':
        return <MicOff size={iconSize} color={iconColor} />;
      
      case 'idle':
      default:
        return <Mic size={iconSize} color="rgb(156, 163, 175)" />;
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
    <div className={`flex flex-col items-center gap-3 ${className}`}>
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
