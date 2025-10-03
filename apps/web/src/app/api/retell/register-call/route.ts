import { NextRequest, NextResponse } from 'next/server';
import Retell from 'retell-sdk';

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

    console.log('Creating web call for agent:', agentId);

    const client = new Retell({
      apiKey: apiKey,
    });

    const webCallResponse = await client.call.createWebCall({
      agent_id: agentId,
    });

    console.log('Web call created successfully:', webCallResponse.call_id);

    return NextResponse.json({
      access_token: webCallResponse.access_token,
      call_id: webCallResponse.call_id,
    });

  } catch (error) {
    console.error('Error creating web call:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create web call',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
