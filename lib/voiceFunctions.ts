/**
 * Voice Session Management Functions for Jarvis Shopping Assistant
 * 
 * This file provides utilities for managing Ultravox voice sessions including
 * starting calls, ending calls, and toggling mute states.
 * 
 * Requirements: 1.1, 1.3 - Voice Session Management
 */

'use client';

import { 
  UltravoxSession, 
  UltravoxSessionStatus, 
  Transcript, 
  UltravoxDataMessageEvent,
  Role 
} from 'ultravox-client';
import { UltravoxCallConfig, UltravoxCallResponse } from './ultravox-types';
import { 
  updateCartToolImplementation,
  navigateProductToolImplementation,
  filterCategoryToolImplementation,
  readProductDetailsToolImplementation,
  readCartSummaryToolImplementation,
  closeProductToolImplementation,
  openCartToolImplementation
} from './clientTools';

/**
 * Global Ultravox session instance
 * Maintained as a module-level variable for session lifecycle management
 */
let uvSession: UltravoxSession | null = null;

/**
 * Flag to prevent multiple simultaneous call creation attempts
 */
let isCreatingCall = false;

/**
 * Callback functions for voice session events
 */
export interface VoiceCallbacks {
  onStatusChange?: (status: UltravoxSessionStatus | string | undefined) => void;
  onTranscriptChange?: (transcripts: Transcript[] | undefined) => void;
  onDebugMessage?: (message: UltravoxDataMessageEvent) => void;
}

/**
 * Create a new Ultravox call via the API route
 * 
 * @param callConfig - Configuration for the Ultravox call
 * @param showDebugMessages - Whether to log debug messages to console
 * @returns Promise resolving to call response with joinUrl
 * @throws Error if API call fails
 * 
 * Requirement 1.1: Establish connection to Ultravox API
 */
async function createCall(
  callConfig: UltravoxCallConfig, 
  showDebugMessages?: boolean
): Promise<UltravoxCallResponse> {
  try {
    if (showDebugMessages) {
      console.log(`[createCall] Creating Ultravox call with model: ${callConfig.model || 'default'}`);
      console.log('[createCall] Config:', JSON.stringify({
        model: callConfig.model,
        voice: callConfig.voice,
        temperature: callConfig.temperature,
        languageHint: callConfig.languageHint,
        toolCount: callConfig.selectedTools?.length || 0,
        systemPromptLength: callConfig.systemPrompt?.length || 0,
      }, null, 2));
    }

    const response = await fetch('/api/ultravox', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...callConfig }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[createCall] HTTP error:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data: UltravoxCallResponse = await response.json();

    if (showDebugMessages) {
      console.log(`[createCall] Call created successfully. Join URL: ${data.joinUrl}`);
    }

    return data;
  } catch (error) {
    console.error('[createCall] Error creating Ultravox call:', error);
    throw error;
  }
}

/**
 * Start a new voice call session
 * 
 * Creates an Ultravox call, initializes the session, registers client tools,
 * and joins the call with the provided configuration.
 * 
 * @param callbacks - Callback functions for session events
 * @param callConfig - Configuration for the Ultravox call
 * @param showDebugMessages - Whether to log debug messages to console
 * @returns Promise that resolves when call is started
 * @throws Error if call creation or joining fails
 * 
 * Requirement 1.1: Start voice session and establish connection
 * Requirement 1.3: Begin listening for voice commands
 */
export async function startCall(
  callbacks: VoiceCallbacks,
  callConfig: UltravoxCallConfig,
  showDebugMessages?: boolean
): Promise<void> {
  // Prevent multiple simultaneous call creation attempts
  if (isCreatingCall) {
    console.warn('[startCall] Call creation already in progress, ignoring duplicate request');
    return;
  }

  try {
    isCreatingCall = true;
    console.log('[startCall] Starting voice call...');
    
    // End any existing call first
    if (uvSession) {
      console.warn('[startCall] Ending existing call before starting new one');
      await endCall();
      // Wait a bit to ensure cleanup is complete
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Create the call via API
    console.log('[startCall] Creating call via API...');
    const callData = await createCall(callConfig, showDebugMessages);
    const joinUrl = callData.joinUrl;

    if (!joinUrl) {
      throw new Error('Join URL is required but was not returned from API');
    }

    if (showDebugMessages) {
      console.log('[startCall] Joining call:', joinUrl);
    }

    // Initialize Ultravox Session with event callbacks
    console.log('[startCall] Initializing Ultravox session...');
    uvSession = new UltravoxSession();

    // Set up status change listener
    uvSession.addEventListener('status', (event) => {
      const status = (event as CustomEvent).detail;
      console.log('[Ultravox] Status changed:', status);
      
      // Map Ultravox status to our VoiceStatus
      if (callbacks.onStatusChange) {
        if (status === 'idle') {
          callbacks.onStatusChange('idle');
        } else if (status === 'listening') {
          callbacks.onStatusChange('listening');
        } else if (status === 'speaking') {
          callbacks.onStatusChange('speaking');
        } else if (status === 'disconnected') {
          callbacks.onStatusChange('idle');
        }
      }
    });

    // Set up transcript listener for additional status tracking
    uvSession.addEventListener('transcripts', (event) => {
      const transcripts = (event as CustomEvent).detail;
      if (showDebugMessages) {
        console.log('[Ultravox] Transcripts updated:', transcripts);
      }
      if (callbacks.onTranscriptChange) {
        callbacks.onTranscriptChange(transcripts);
      }
    });

    // Register client tool implementations
    console.log('[startCall] Registering client tool implementations...');
    uvSession.registerToolImplementation('updateCart', updateCartToolImplementation);
    uvSession.registerToolImplementation('navigateProduct', navigateProductToolImplementation);
    uvSession.registerToolImplementation('filterCategory', filterCategoryToolImplementation);
    uvSession.registerToolImplementation('readProductDetails', readProductDetailsToolImplementation);
    uvSession.registerToolImplementation('readCartSummary', readCartSummaryToolImplementation);
    uvSession.registerToolImplementation('closeProduct', closeProductToolImplementation);
    uvSession.registerToolImplementation('openCart', openCartToolImplementation);

    if (showDebugMessages) {
      console.log('[startCall] Ultravox session created and tools registered');
    }

    // Join the call
    console.log('[startCall] Joining call...');
    try {
      await uvSession.joinCall(joinUrl);
      console.log('[startCall] Successfully joined call');
    } catch (joinError) {
      console.error('[startCall] Failed to join call:', joinError);
      throw new Error(`Failed to join call: ${joinError instanceof Error ? joinError.message : 'Unknown error'}`);
    }
    
    console.log('[startCall] Voice call started successfully');

    // Initial status notification
    if (callbacks.onStatusChange) {
      callbacks.onStatusChange('listening');
    }
  } catch (error) {
    console.error('[startCall] Failed to start voice call:', error);
    
    // Clean up on error
    if (uvSession) {
      console.log('[startCall] Cleaning up session after error...');
      uvSession.leaveCall();
      uvSession = null;
    }
    
    throw error;
  } finally {
    isCreatingCall = false;
  }
}

/**
 * End the current voice call session
 * 
 * Leaves the Ultravox call, cleans up the session, and dispatches
 * a custom event to notify UI components.
 * 
 * @returns Promise that resolves when call is ended
 * 
 * Requirement 1.3: Terminate voice session and stop listening
 */
export async function endCall(): Promise<void> {
  console.log('Ending voice call');

  if (uvSession) {
    try {
      uvSession.leaveCall();
    } catch (error) {
      console.error('Error leaving call:', error);
    } finally {
      uvSession = null;
    }
  }

  // Dispatch custom event to notify UI components that call has ended
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('jarvis:call:ended');
    window.dispatchEvent(event);
  }
}

/**
 * Toggle mute state for microphone or speaker
 * 
 * Toggles the mute state for either the user's microphone (input)
 * or the agent's speaker (output).
 * 
 * @param role - Role to toggle mute for (USER for mic, AGENT for speaker)
 * 
 * Requirement 1.3: Control microphone state during voice session
 */
export function toggleMute(role: Role): void {
  if (!uvSession) {
    console.error('Cannot toggle mute: voice session is not initialized');
    return;
  }

  try {
    if (role === Role.USER) {
      // Toggle user microphone
      if (uvSession.isMicMuted) {
        uvSession.unmuteMic();
        console.log('Microphone unmuted');
      } else {
        uvSession.muteMic();
        console.log('Microphone muted');
      }
    } else if (role === Role.AGENT) {
      // Toggle agent speaker
      if (uvSession.isSpeakerMuted) {
        uvSession.unmuteSpeaker();
        console.log('Speaker unmuted');
      } else {
        uvSession.muteSpeaker();
        console.log('Speaker muted');
      }
    } else {
      console.warn(`Unknown role for mute toggle: ${role}`);
    }
  } catch (error) {
    console.error('Error toggling mute:', error);
  }
}

/**
 * Get the current Ultravox session instance
 * 
 * @returns The current UltravoxSession or null if no session exists
 */
export function getSession(): UltravoxSession | null {
  return uvSession;
}

/**
 * Check if a voice session is currently active
 * 
 * @returns true if a session exists and is connected, false otherwise
 */
export function isSessionActive(): boolean {
  return uvSession !== null;
}

/**
 * Get the current microphone mute state
 * 
 * @returns true if microphone is muted, false otherwise
 */
export function isMicMuted(): boolean {
  return uvSession?.isMicMuted ?? false;
}

/**
 * Get the current speaker mute state
 * 
 * @returns true if speaker is muted, false otherwise
 */
export function isSpeakerMuted(): boolean {
  return uvSession?.isSpeakerMuted ?? false;
}

/**
 * Get the current session status
 * 
 * @returns The current UltravoxSessionStatus or null if no session exists
 */
export function getSessionStatus(): UltravoxSessionStatus | null {
  return uvSession?.status ?? null;
}

/**
 * Add a status change listener to the current session
 * 
 * @param callback - Function to call when status changes
 * @returns Cleanup function to remove the listener
 */
export function addStatusListener(callback: (status: UltravoxSessionStatus) => void): (() => void) | null {
  if (!uvSession) {
    console.warn('[addStatusListener] No active session');
    return null;
  }

  const handler = (event: Event) => {
    const status = (event as CustomEvent).detail;
    callback(status);
  };

  uvSession.addEventListener('status', handler);

  // Return cleanup function
  return () => {
    if (uvSession) {
      uvSession.removeEventListener('status', handler);
    }
  };
}
