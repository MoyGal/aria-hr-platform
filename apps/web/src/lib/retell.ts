import Retell from 'retell-sdk';
import { AgentResponse, Agent } from 'retell-sdk/resources';

const RETELL_API_KEY = process.env.RETELL_API_KEY;
const RETELL_BASE_URL = 'https://api.retellai.com';

// Inicializamos Retell
export const retellClient = new Retell({
  apiKey: RETELL_API_KEY,
});

export const PREDEFINED_INTERVIEWERS = [
  {
    id: 'sophia-interviewer',
    name: 'Sophia',
    voice: 'eleven_labs:5f05b82d-80f2-45e0-a4f6-7b89f816c7c6',
    description: 'Expert on Software Development.',
    prompt: `You are Sophia, an expert software development interviewer.
You will evaluate the candidate's skills in a conversational way.
Ask about their projects, technical stacks, and problem-solving abilities.
Be professional, friendly, and encouraging.`,
    language: 'en-US',
    personality: 'Professional, friendly, and encouraging',
    instructions: 'Be professional, friendly, and encouraging during the interview. Ask questions about projects, technical skills, and problem-solving.',
  },
  {
    id: 'james-interviewer',
    name: 'James',
    voice: 'eleven_labs:59b720b0-a887-43c2-b5e0-9430c51e031a',
    description: 'Specialist in Data Science and AI.',
    prompt: `You are James, a specialist in Data Science and AI.
Your role is to assess the candidate's knowledge of machine learning, data manipulation, and statistical analysis.
Maintain a curious and inquisitive tone.`,
    language: 'en-US',
    personality: 'Curious and inquisitive',
    instructions: 'Assess the candidate\'s knowledge of machine learning, data manipulation, and statistical analysis. Be curious and inquisitive.',
  },
  {
    id: 'maria-interviewer',
    name: 'Maria',
    voice: 'eleven_labs:54d3e8ed-7195-46c2-849c-f481001f3f4c',
    description: 'Talent Acquisition Manager.',
    prompt: `You are Maria, a talent acquisition manager.
Focus on behavioral questions, team collaboration, and cultural fit.
Your tone should be warm, empathetic, and professional.`,
    language: 'en-US',
    personality: 'Warm, empathetic, and professional',
    instructions: 'Focus on behavioral questions, team collaboration, and cultural fit. Be warm, empathetic, and professional.',
  },
  {
    id: 'carlos-interviewer',
    name: 'Carlos',
    voice: 'eleven_labs:b89e92c2-8051-409e-b9b0-9076edc97a5c',
    description: 'General HR and Project Management.',
    prompt: `You are Carlos, a general HR and project manager.
Your task is to evaluate the candidate's project management skills, communication, and adaptability.
Be direct, clear, and efficient in your questions.`,
    language: 'en-US',
    personality: 'Direct, clear, and efficient',
    instructions: 'Evaluate project management skills, communication, and adaptability. Be direct, clear, and efficient.',
  },
];

export async function createOrUpdateRetellAgent(agent: any): Promise<AgentResponse> {
  const existingAgents = await retellClient.agent.list();
  const agentExists = existingAgents.agents.find(a => a.agent_name === agent.name);

  if (agentExists) {
    console.log(`Agent ${agent.name} already exists. Updating...`);
    return retellClient.agent.update(agentExists.agent_id, {
      prompt: agent.prompt,
      voiceEngine: 'elevenlabs',
      voiceId: agent.voice.split(':')[1],
    });
  } else {
    console.log(`Agent ${agent.name} does not exist. Creating...`);
    return retellClient.agent.create({
      agentName: agent.name,
      prompt: agent.prompt,
      voiceEngine: 'elevenlabs',
      voiceId: agent.voice.split(':')[1],
    });
  }
}

export async function listAgents(): Promise<Agent[]> {
  const { agents } = await retellClient.agent.list();
  return agents;
}

export async function deleteAgent(agentId: string): Promise<void> {
  await retellClient.agent.delete(agentId);
}

export async function createPhoneCall(agentId: string, to: string, from?: string): Promise<any> {
  const call = await retellClient.call.create({
    agentId,
    from: from || process.env.RETELL_PHONE_NUMBER,
    to,
  });
  return call;
}

export async function createWebCall(agentId: string): Promise<any> {
  const call = await retellClient.call.create({
    agentId,
    // La API de Retell usa un esquema diferente para llamadas web
    // Podrías necesitar un endpoint específico o un campo de configuración
  });
  return call;
}

export async function getCallStatus(callId: string): Promise<any> {
  return retellClient.call.retrieve(callId);
}

export async function getCallTranscript(callId: string): Promise<any> {
  const callDetail = await retellClient.call.retrieve(callId);
  return callDetail.transcript;
}

export async function endCall(callId: string): Promise<void> {
  await retellClient.call.end(callId);
}