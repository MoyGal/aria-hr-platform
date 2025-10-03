import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const agentId = body.agent_id || body.agentId;
    
    const apiKey = process.env.RETELL_API_KEY;
    
    if (!apiKey) {
      console.error('RETELL_API_KEY not configured');
      return NextResponse.json(
        { error: 'Retell API key not configured' },
        { status: 500 }
      );
    }

    if (!agentId) {
      console.error('No agent_id provided');
      return NextResponse.json(
        { error: 'agent_id is required' },
        { status: 400 }
      );
    }

    console.log('Registering call for agent:', agentId);

    const response = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: agentId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Retell API error:', errorText);
      return NextResponse.json(
        { error: 'Retell API request failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    if (!data.access_token) {
      console.error('No access_token in response:', data);
      return NextResponse.json(
        { error: 'Invalid response from Retell API' },
        { status: 500 }
      );
    }

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
