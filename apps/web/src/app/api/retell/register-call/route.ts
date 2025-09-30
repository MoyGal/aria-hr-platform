// src/app/api/retell/register-call/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Retell from 'retell-sdk';

const retell = new Retell({
  apiKey: process.env.RETELL_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { agentId } = await request.json();
    
    if (!process.env.RETELL_API_KEY) {
      console.error('RETELL_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Retell API key not configured' },
        { status: 500 }
      );
    }

    const webCall = await retell.call.createWebCall({
      agent_id: agentId || process.env.RETELL_DEFAULT_AGENT_ID,
    });

    return NextResponse.json({
      access_token: webCall.access_token,
      call_id: webCall.call_id,
    });
  } catch (error) {
    console.error('Error registering call:', error);
    return NextResponse.json(
      { error: 'Failed to register call' },
      { status: 500 }
    );
  }
}

// Necesario para App Router
export const runtime = 'nodejs';