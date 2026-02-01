/**
 * Ultravox-specific type definitions
 * 
 * This file contains types for Ultravox API integration, including tool definitions
 * and parameter specifications for voice-controlled UI interactions.
 * 
 * Based on the Ultravox API documentation and reference implementation.
 */

/**
 * Parameter location enum for Ultravox tool parameters
 */
export enum ParameterLocation {
  BODY = "PARAMETER_LOCATION_BODY",
  QUERY = "PARAMETER_LOCATION_QUERY",
  PATH = "PARAMETER_LOCATION_PATH",
  HEADER = "PARAMETER_LOCATION_HEADER",
}

/**
 * JSON schema type for parameter definitions
 */
export interface JsonSchema {
  type: string;
  description?: string;
  enum?: string[];
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  required?: string[];
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
}

/**
 * Dynamic parameter definition for Ultravox tools
 */
export interface DynamicParameter {
  name: string;
  location: ParameterLocation;
  schema: JsonSchema;
  required: boolean;
}

/**
 * Client-side tool configuration (empty object for client tools)
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ClientToolConfig {
  // Empty object indicates this is a client-side tool
}

/**
 * HTTP tool configuration for server-side tools
 */
export interface HttpToolConfig {
  baseUrlPattern: string;
  httpMethod: string;
}

/**
 * Temporary tool definition for Ultravox
 */
export interface TemporaryTool {
  modelToolName: string;
  description: string;
  dynamicParameters: DynamicParameter[];
  client?: ClientToolConfig;
  http?: HttpToolConfig;
}

/**
 * Selected tool wrapper for Ultravox API
 */
export interface SelectedTool {
  temporaryTool: TemporaryTool;
}

/**
 * Ultravox call configuration
 */
export interface UltravoxCallConfig {
  systemPrompt: string;
  model?: string;
  voice?: string;
  temperature?: number;
  selectedTools?: SelectedTool[];
  languageHint?: string;
}

/**
 * Ultravox API response for call creation
 */
export interface UltravoxCallResponse {
  callId: string;
  joinUrl: string;
}

/**
 * Tool invocation event from Ultravox
 */
export interface ToolInvocation {
  toolName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parameters: Record<string, any>;
  invocationId: string;
}

/**
 * Tool result to send back to Ultravox
 */
export interface ToolResult {
  invocationId: string;
  result: string;
  error?: string;
}

/**
 * Ultravox session status
 */
export type UltravoxStatus = 
  | 'disconnected'
  | 'connecting'
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'speaking';

/**
 * Ultravox transcript message
 */
export interface TranscriptMessage {
  role: 'user' | 'agent';
  text: string;
  timestamp: number;
}

/**
 * Ultravox error event
 */
export interface UltravoxError {
  message: string;
  code?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;
}
