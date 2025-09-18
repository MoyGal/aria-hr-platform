import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  createOrUpdateRetellAgent,
  createPhoneCall,
  createWebCall,
  getCallStatus,
  endCall,
  getCallTranscript,
  listAgents,
  deleteAgent,
  PREDEFINED_INTERVIEWERS,
} from '@/lib/retell';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener agentes disponibles
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');

    // Obtener agentes predefinidos
    if (action === 'predefined') {
      return NextResponse.json({ agents: PREDEFINED_INTERVIEWERS });
    }

    // Listar agentes de Retell
    if (action === 'list') {
      const agents = await listAgents();
      return NextResponse.json({ agents });
    }

    // Obtener estado de una llamada específica
    const callId = searchParams.get('callId');
    if (callId) {
      const status = await getCallStatus(callId);
      return NextResponse.json({ status });
    }

    // Obtener transcripción
    const transcriptCallId = searchParams.get('transcriptCallId');
    if (transcriptCallId) {
      const transcript = await getCallTranscript(transcriptCallId);
      return NextResponse.json({ transcript });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('GET /api/retell error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Crear agente o iniciar llamada
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    // Crear o actualizar agente
    if (action === 'create-agent') {
      const { interviewerId } = body;
      const interviewer = PREDEFINED_INTERVIEWERS.find(
        (i) => i.id === interviewerId
      );

      if (!interviewer) {
        return NextResponse.json(
          { error: 'Interviewer not found' },
          { status: 404 }
        );
      }

      const agent = await createOrUpdateRetellAgent(interviewer);
      
      // Guardar en base de datos
      const savedAgent = await prisma.interviewer.upsert({
        where: { externalId: agent.agent_id },
        update: {
          name: interviewer.name,
          language: interviewer.language,
          voiceId: interviewer.voice_id,
          description: interviewer.description,
        },
        create: {
          externalId: agent.agent_id,
          name: interviewer.name,
          language: interviewer.language,
          voiceId: interviewer.voice_id,
          voiceProvider: 'elevenlabs',
          description: interviewer.description,
          personality: interviewer.personality,
          instructions: interviewer.instructions,
          userId,
        },
      });

      return NextResponse.json({ agent, savedAgent });
    }

    // Iniciar llamada telefónica
    if (action === 'start-phone-call') {
      const { agentId, toNumber, fromNumber } = body;
      
      if (!agentId || !toNumber) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      const phoneCall = await createPhoneCall(agentId, toNumber, fromNumber);
      
      // Guardar llamada en base de datos
      const savedCall = await prisma.interview.create({
        data: {
          externalCallId: phoneCall.call_id,
          interviewerId: agentId,
          candidatePhone: toNumber,
          status: 'in_progress',
          startedAt: new Date(),
          userId,
        },
      });

      return NextResponse.json({ phoneCall, savedCall });
    }

    // Iniciar llamada web (para pruebas)
    if (action === 'start-web-call') {
      const { agentId } = body;
      
      if (!agentId) {
        return NextResponse.json(
          { error: 'Missing agent ID' },
          { status: 400 }
        );
      }

      const webCall = await createWebCall(agentId);
      
      // Guardar llamada en base de datos
      const savedCall = await prisma.interview.create({
        data: {
          externalCallId: webCall.call_id,
          interviewerId: agentId,
          candidatePhone: 'web-call',
          status: 'in_progress',
          startedAt: new Date(),
          userId,
        },
      });

      return NextResponse.json({ webCall, savedCall });
    }

    // Finalizar llamada
    if (action === 'end-call') {
      const { callId } = body;
      
      if (!callId) {
        return NextResponse.json(
          { error: 'Missing call ID' },
          { status: 400 }
        );
      }

      await endCall(callId);
      
      // Actualizar en base de datos
      await prisma.interview.updateMany({
        where: { externalCallId: callId },
        data: {
          status: 'completed',
          endedAt: new Date(),
        },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('POST /api/retell error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar agente
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');

    if (!agentId) {
      return NextResponse.json(
        { error: 'Missing agent ID' },
        { status: 400 }
      );
    }

    await deleteAgent(agentId);
    
    // Eliminar de base de datos
    await prisma.interviewer.deleteMany({
      where: { externalId: agentId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/retell error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}