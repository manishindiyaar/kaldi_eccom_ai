/**
 * Centralized error handling for the Jarvis Shopping Assistant
 * 
 * This module provides a unified way to handle errors across the application,
 * ensuring consistent logging and user-friendly error messages.
 * 
 * Requirements:
 * - 10.4: Provide clear error messages without technical jargon
 * - 10.5: Log errors to the console for debugging purposes
 */

/**
 * Error context types for categorizing errors
 */
export type ErrorContext =
  | 'fetchProducts'
  | 'voiceSession'
  | 'cartOperation'
  | 'localStorage'
  | 'microphone'
  | 'ultravoxAPI'
  | 'navigation'
  | 'unknown';

/**
 * Error event detail interface
 */
export interface AppErrorDetail {
  message: string;
  context: ErrorContext;
  originalError?: Error;
  timestamp: string;
}

/**
 * User-friendly error messages mapped from technical contexts
 */
const USER_FRIENDLY_MESSAGES: Record<ErrorContext, string> = {
  fetchProducts: 'Unable to load products. Please try again.',
  voiceSession: 'Connection failed. Please try again.',
  cartOperation: 'Unable to update cart. Please try again.',
  localStorage: 'Unable to save your cart. Your items will be available during this session only.',
  microphone: 'Microphone access is required for voice commands. Please enable microphone permissions in your browser settings.',
  ultravoxAPI: 'Voice service is unavailable. Please try again later.',
  navigation: 'Unable to navigate products. Please try again.',
  unknown: 'Something went wrong. Please try again.',
};

/**
 * Centralized error handler
 * 
 * Logs errors to the console and dispatches custom events for UI components to handle.
 * Converts technical error messages into user-friendly messages.
 * 
 * @param error - The error object to handle
 * @param context - The context in which the error occurred
 * 
 * @example
 * ```typescript
 * try {
 *   await fetchProducts();
 * } catch (error) {
 *   handleError(error as Error, 'fetchProducts');
 * }
 * ```
 */
export function handleError(error: Error, context: ErrorContext): void {
  // Requirement 10.5: Log errors to the console for debugging
  console.error(`[${context}]`, error);
  
  // Get user-friendly message based on context
  const userMessage = USER_FRIENDLY_MESSAGES[context] || USER_FRIENDLY_MESSAGES.unknown;
  
  // Dispatch error event for UI components (only in browser environment)
  if (typeof window !== 'undefined') {
    const errorDetail: AppErrorDetail = {
      message: userMessage,
      context,
      originalError: error,
      timestamp: new Date().toISOString(),
    };
    
    window.dispatchEvent(
      new CustomEvent('appError', {
        detail: errorDetail,
      })
    );
  }
}

/**
 * Type guard to check if an unknown value is an Error
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

/**
 * Safely extract error message from unknown error type
 */
export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

/**
 * Create a typed error event listener
 * 
 * @example
 * ```typescript
 * useEffect(() => {
 *   const handleAppError = (event: CustomEvent<AppErrorDetail>) => {
 *     setErrorMessage(event.detail.message);
 *   };
 *   
 *   window.addEventListener('appError', handleAppError as EventListener);
 *   return () => window.removeEventListener('appError', handleAppError as EventListener);
 * }, []);
 * ```
 */
export type AppErrorEventListener = (event: CustomEvent<AppErrorDetail>) => void;
