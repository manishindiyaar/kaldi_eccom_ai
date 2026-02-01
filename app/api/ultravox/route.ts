import { NextResponse, NextRequest } from 'next/server';
import { UltravoxCallConfig } from '@/lib/ultravox-types';

/**
 * POST /api/ultravox
 * 
 * Creates a new Ultravox call session and returns the join URL.
 * This endpoint proxies requests to the Ultravox API with authentication.
 * 
 * @param request - NextRequest containing UltravoxCallConfig in body
 * @returns NextResponse with call details including joinUrl
 */
export async function POST(request: NextRequest) {
  try {
    const body: UltravoxCallConfig = await request.json();
    console.log('[API] Attempting to call Ultravox API...');
    console.log('[API] Request body summary:', {
      model: body.model,
      voice: body.voice,
      temperature: body.temperature,
      languageHint: body.languageHint,
      toolCount: body.selectedTools?.length || 0,
      systemPromptLength: body.systemPrompt?.length || 0,
    });
    
    // Validate API key is configured
    if (!process.env.ULTRAVOX_API_KEY) {
      console.error('[API] ULTRAVOX_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Server configuration error: ULTRAVOX_API_KEY not set' },
        { status: 500 }
      );
    }
    
    const response = await fetch('https://api.ultravox.ai/api/calls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.ULTRAVOX_API_KEY,
      },
      body: JSON.stringify({ ...body }),
    });

    console.log('[API] Ultravox API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] Ultravox API error:', errorText);
      throw new Error(`Ultravox API error: ${response.status}, ${errorText}`);
    }

    const data = await response.json();
    console.log('[API] Call created successfully');
    return NextResponse.json(data);
  } catch (error) {
    console.error('[API] Error in API route:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Error calling Ultravox API', details: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: 'An unknown error occurred.' },
        { status: 500 }
      );
    }
  }
}
