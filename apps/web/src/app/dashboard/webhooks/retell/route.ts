import { NextRequest, NextResponse } from 'next/server';
import { validateWebhookSignature, WEBHOOK_EVENTS } from '@/lib/retell';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Webhook para recibir eventos de Retell
export async function POST(request: NextRequest) {
  try {
    // Obtener el payload y la firma
    const payload = await request.text();
    const signature = request.headers.get('x-retell-signature') || '';

    // Validar firma (importante para producción)
    if (!validateWebhookSignature(payload, signature)) {
      console.warn('Invalid webhook signature');
      // En desarrollo podemos continuar, en producción deberíamos retornar 401
      // return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(payload);
    console.log('Retell webhook event:', event);

    // Procesar según el tipo de evento
    switch (event.type) {
      case WEBHOOK_EVENTS.CALL_STARTED:
        await handleCallStarted(event);
        break;

      case WEBHOOK_EVENTS.CALL_ENDED:
        await handleCallEnded(event);
        break;

      case WEBHOOK_EVENTS.CALL_ANALYZED:
        await handleCallAnalyzed(event);
        break;

      case WEBHOOK_EVENTS.TRANSCRIPT_READY:
        await handleTranscriptReady(event);
        break;

      default:
        console.log('Unhandled webhook event type:', event.type);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Manejar inicio de llamada
async function handleCallStarted(event: any) {
  const { call_id, agent_id, from_number, to_number, start_timestamp } = event.data;

  try {
    // Actualizar estado en base de datos
    await prisma.interview.updateMany({
      where: { externalCallId: call_id },
      data: {
        status: 'active',
        startedAt: new Date(start_timestamp),
      },
    });

    console.log(`Call started: ${call_id}`);
  } catch (error) {
    console.error('Error handling call started:', error);
  }
}

// Manejar fin de llamada
async function handleCallEnded(event: any) {
  const {
    call_id,
    agent_id,
    end_timestamp,
    duration_seconds,
    end_reason,
    recording_url,
    transcript,
    summary,
  } = event.data;

  try {
    // Actualizar entrevista en base de datos
    const interview = await prisma.interview.updateMany({
      where: { externalCallId: call_id },
      data: {
        status: 'completed',
        endedAt: new Date(end_timestamp),
        duration: duration_seconds,
        recordingUrl: recording_url,
        transcript: transcript ? JSON.stringify(transcript) : null,
        summary,
        endReason: end_reason,
      },
    });

    // Si hay transcripción, procesarla
    if (transcript && Array.isArray(transcript)) {
      await processTranscript(call_id, transcript);
    }

    console.log(`Call ended: ${call_id}, duration: ${duration_seconds}s`);
  } catch (error) {
    console.error('Error handling call ended:', error);
  }
}

// Manejar análisis de llamada
async function handleCallAnalyzed(event: any) {
  const {
    call_id,
    analysis,
    sentiment_score,
    key_points,
    action_items,
    evaluation,
  } = event.data;

  try {
    // Guardar análisis en base de datos
    await prisma.interviewAnalysis.create({
      data: {
        interviewId: call_id,
        sentimentScore: sentiment_score,
        keyPoints: key_points ? JSON.stringify(key_points) : null,
        actionItems: action_items ? JSON.stringify(action_items) : null,
        evaluation: evaluation ? JSON.stringify(evaluation) : null,
        fullAnalysis: JSON.stringify(analysis),
      },
    });

    console.log(`Call analyzed: ${call_id}, sentiment: ${sentiment_score}`);
  } catch (error) {
    console.error('Error handling call analysis:', error);
  }
}

// Manejar transcripción lista
async function handleTranscriptReady(event: any) {
  const { call_id, transcript, transcript_url } = event.data;

  try {
    // Actualizar entrevista con transcripción
    await prisma.interview.updateMany({
      where: { externalCallId: call_id },
      data: {
        transcript: JSON.stringify(transcript),
        transcriptUrl: transcript_url,
      },
    });

    // Procesar transcripción para extraer información relevante
    if (transcript && Array.isArray(transcript)) {
      await processTranscript(call_id, transcript);
    }

    console.log(`Transcript ready for call: ${call_id}`);
  } catch (error) {
    console.error('Error handling transcript ready:', error);
  }
}

// Procesar transcripción para extraer información
async function processTranscript(callId: string, transcript: any[]) {
  try {
    // Extraer preguntas y respuestas
    const questions: string[] = [];
    const answers: string[] = [];
    
    transcript.forEach((entry) => {
      if (entry.role === 'agent') {
        // Es una pregunta del entrevistador
        if (entry.content.includes('?')) {
          questions.push(entry.content);
        }
      } else if (entry.role === 'user') {
        // Es una respuesta del candidato
        answers.push(entry.content);
      }
    });

    // Calcular duración total de respuestas
    const totalWords = answers.join(' ').split(' ').length;
    const avgWordsPerAnswer = answers.length > 0 ? totalWords / answers.length : 0;

    // Guardar métricas
    await prisma.interviewMetrics.create({
      data: {
        interviewId: callId,
        totalQuestions: questions.length,
        totalAnswers: answers.length,
        avgAnswerLength: avgWordsPerAnswer,
        questions: JSON.stringify(questions),
        answers: JSON.stringify(answers),
      },
    });

    console.log(`Processed transcript: ${questions.length} questions, ${answers.length} answers`);
  } catch (error) {
    console.error('Error processing transcript:', error);
  }
}

// GET para verificar que el webhook está activo
export async function GET() {
  return NextResponse.json({ status: 'Webhook is active' }, { status: 200 });
}