import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { agentId } = await request.json();
    
    const apiKey = process.env.RETELL_API_KEY;
    const defaultAgentId = process.env.RETELL_DEFAULT_AGENT_ID;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Retell API key not configured' },
        { status: 500 }
      );
    }

    // Llamada directa a la API de Retell sin SDK
    const response = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: agentId || defaultAgentId,
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      access_token: data.access_token,
      call_id: data.call_id,
    });
  } catch (error) {
    console.error('Error registering call:', error);
    return NextResponse.json(
      { error: 'Failed to register call' },
      { status: 500 }
    );
  }
}