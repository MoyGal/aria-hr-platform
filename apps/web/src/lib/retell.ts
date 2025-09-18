import Retell from 'retell-sdk';

// Inicializar cliente de Retell
export const retellClient = new Retell({
  apiKey: process.env.RETELL_API_KEY || '',
});

// Tipos para los agentes
export interface InterviewerAgent {
  id: string;
  name: string;
  language: string;
  voice_id: string;
  voice_provider: 'elevenlabs';
  description: string;
  personality: string;
  instructions: string;
}

// Configuración de los 4 entrevistadores predefinidos con voces de ElevenLabs
export const PREDEFINED_INTERVIEWERS: InterviewerAgent[] = [
  {
    id: 'sophia-anderson',
    name: 'Sophia Anderson',
    language: 'en-US',
    voice_id: '21m00Tcm4TlvDq8ikWAM', // Rachel voice from ElevenLabs
    voice_provider: 'elevenlabs',
    description: 'Senior HR Manager with 15+ years of experience',
    personality: 'Professional, warm, and encouraging. Focuses on cultural fit and soft skills.',
    instructions: `You are Sophia Anderson, a senior HR manager conducting a professional interview. 
    Be warm but professional. Ask follow-up questions based on responses. 
    Focus on cultural fit, teamwork, and communication skills.
    Keep responses concise and natural.`
  },
  {
    id: 'maria-gonzalez',
    name: 'María González',
    language: 'es-ES',
    voice_id: 'MF3mGyEYCl7XYWbV9V6O', // Elli voice from ElevenLabs
    voice_provider: 'elevenlabs',
    description: 'Directora de Recursos Humanos especializada en talento latino',
    personality: 'Cálida, profesional y detallista. Se enfoca en competencias y experiencia.',
    instructions: `Eres María González, una directora de RRHH realizando una entrevista profesional en español.
    Sé cálida pero profesional. Haz preguntas de seguimiento basadas en las respuestas.
    Enfócate en competencias técnicas y experiencia relevante.
    Mantén las respuestas concisas y naturales.`
  },
  {
    id: 'james-mitchell',
    name: 'James Mitchell',
    language: 'en-US',
    voice_id: 'pNInz6obpgDQGcFmaJgB', // Adam voice from ElevenLabs
    voice_provider: 'elevenlabs',
    description: 'Technical Recruiter specializing in engineering roles',
    personality: 'Direct, analytical, and detail-oriented. Focuses on technical skills.',
    instructions: `You are James Mitchell, a technical recruiter conducting an interview for an engineering position.
    Be direct and focused on technical competencies. Ask specific questions about technologies and methodologies.
    Evaluate problem-solving skills and technical knowledge.
    Keep responses professional and to the point.`
  },
  {
    id: 'carlos-rodriguez',
    name: 'Carlos Rodríguez',
    language: 'es-ES',
    voice_id: 'ErXwobaYiN019PkySvjV', // Antoni voice from ElevenLabs
    voice_provider: 'elevenlabs',
    description: 'Gerente de Talento enfocado en startups y tecnología',
    personality: 'Dinámico, innovador y orientado a resultados. Busca pensamiento creativo.',
    instructions: `Eres Carlos Rodríguez, un gerente de talento entrevistando para una startup tecnológica.
    Sé dinámico y entusiasta. Evalúa la capacidad de adaptación y pensamiento innovador.
    Pregunta sobre experiencias en ambientes ágiles y capacidad de trabajar bajo presión.
    Mantén un tono profesional pero cercano.`
  }
];

// Configuración de los agentes en Retell
export async function createOrUpdateRetellAgent(interviewer: InterviewerAgent) {
  try {
    const agentConfig = {
      agent_name: interviewer.name,
      voice_id: interviewer.voice_id,
      voice_provider: 'elevenlabs' as const,
      language: interviewer.language as any, // Acepta 'en-US' o 'es-ES'
      response_engine: {
        type: 'retell-llm' as const,
        llm_id: null, // Se creará automáticamente
        system_prompt: interviewer.instructions,
      },
      general_prompt: interviewer.instructions,
      boosted_keywords: ['interview', 'experience', 'skills', 'team', 'company'],
      enable_backchannel: true,
      backchannel_frequency: 0.8,
      backchannel_words: ['yeah', 'uh-huh', 'I see', 'right', 'interesting'],
      reminder_trigger_ms: 10000,
      reminder_max_count: 2,
    };

    // Crear o actualizar el agente
    const agent = await retellClient.agent.create(agentConfig);
    return agent;
  } catch (error) {
    console.error('Error creating/updating Retell agent:', error);
    throw error;
  }
}

// Crear una llamada telefónica
export async function createPhoneCall(
  agentId: string,
  toNumber: string,
  fromNumber?: string
) {
  try {
    const callConfig = {
      agent_id: agentId,
      to_number: toNumber,
      from_number: fromNumber || process.env.RETELL_PHONE_NUMBER || '+14155551234',
      metadata: {
        platform: 'aria-hr',
        timestamp: new Date().toISOString(),
      },
    };

    const phoneCall = await retellClient.call.createPhoneCall(callConfig);
    return phoneCall;
  } catch (error) {
    console.error('Error creating phone call:', error);
    throw error;
  }
}

// Crear una llamada web (para pruebas en navegador)
export async function createWebCall(agentId: string) {
  try {
    const webCallConfig = {
      agent_id: agentId,
      metadata: {
        platform: 'aria-hr',
        type: 'web-interview',
        timestamp: new Date().toISOString(),
      },
    };

    const webCall = await retellClient.call.createWebCall(webCallConfig);
    return webCall;
  } catch (error) {
    console.error('Error creating web call:', error);
    throw error;
  }
}

// Obtener el estado de una llamada
export async function getCallStatus(callId: string) {
  try {
    const call = await retellClient.call.retrieve(callId);
    return call;
  } catch (error) {
    console.error('Error getting call status:', error);
    throw error;
  }
}

// Finalizar una llamada
export async function endCall(callId: string) {
  try {
    // Usar el método correcto para terminar llamadas
    const call = await retellClient.call.retrieve(callId);
    // Si la llamada existe y está activa, terminarla
    if (call && call.status === 'ongoing') {
      // Retell SDK no tiene un método directo para terminar, usar API directamente
      const response = await fetch(`https://api.retellai.com/v1/calls/${callId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${process.env.RETELL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to end call');
      }
    }
    return { success: true };
  } catch (error) {
    console.error('Error ending call:', error);
    throw error;
  }
}

// Obtener transcripción de una llamada
export async function getCallTranscript(callId: string) {
  try {
    const call = await retellClient.call.retrieve(callId);
    return call.transcript;
  } catch (error) {
    console.error('Error getting transcript:', error);
    throw error;
  }
}

// Configuración de webhook para recibir eventos
export const WEBHOOK_EVENTS = {
  CALL_STARTED: 'call_started',
  CALL_ENDED: 'call_ended',
  CALL_ANALYZED: 'call_analyzed',
  TRANSCRIPT_READY: 'transcript_ready',
};

// Validar webhook signature (seguridad)
export function validateWebhookSignature(
  payload: string,
  signature: string
): boolean {
  // Implementar validación de firma de Retell
  // Por ahora retornamos true para desarrollo
  return true;
}

// Obtener todos los agentes disponibles
export async function listAgents() {
  try {
    const agents = await retellClient.agent.list();
    return agents;
  } catch (error) {
    console.error('Error listing agents:', error);
    throw error;
  }
}

// Eliminar un agente
export async function deleteAgent(agentId: string) {
  try {
    await retellClient.agent.delete(agentId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting agent:', error);
    throw error;
  }
}