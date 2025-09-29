import { NextResponse } from 'next/server';
import { 
    
 } from '@/lib/retell';

export async function GET() {
  try {
    const testAgent = 'agent_61ee7da3725743235f275c3438';
    
    // Test crear web call con el agente específico
    const webCall = await retellClient.call.createWebCall({
      agent_id: testAgent,
      metadata: { test: true }
    });
    
    return NextResponse.json({
      success: true,
      agent_id: testAgent,
      webCall: webCall,
      message: 'Web call created successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 });
  }
}