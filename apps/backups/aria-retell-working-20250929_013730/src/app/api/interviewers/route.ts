// src/app/api/interviewers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createRetellAgent, INTERVIEWER_CONFIGS } from '@/lib/retell';

export async function GET() {
  try {
    const interviewers = await prisma.interviewer.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(interviewers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch interviewers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { interviewerId, jobId, candidateInfo } = body;

    // Get interviewer configuration
    const config = INTERVIEWER_CONFIGS[interviewerId as keyof typeof INTERVIEWER_CONFIGS];
    
    if (!config) {
      return NextResponse.json({ error: 'Invalid interviewer' }, { status: 400 });
    }

    // Find or create interviewer in DB
    let dbInterviewer = await prisma.interviewer.findFirst({
      where: { name: interviewerId }
    });

    if (!dbInterviewer) {
      // Create Retell agent
      const retellAgent = await createRetellAgent(interviewerId, {
        ...config,
        name: getInterviewerName(interviewerId),
        experience: getInterviewerExperience(interviewerId),
        personality: getInterviewerPersonality(interviewerId),
        specialties: getInterviewerSpecialties(interviewerId),
        language: getInterviewerLanguage(interviewerId)
      });

      // Save to database
      dbInterviewer = await prisma.interviewer.create({
        data: {
          name: getInterviewerName(interviewerId),
          language: getInterviewerLanguage(interviewerId),
          voice: config.voice_id,
          retellAgentId: retellAgent.agent_id,
          notes: JSON.stringify({
            personality: getInterviewerPersonality(interviewerId),
            specialties: getInterviewerSpecialties(interviewerId)
          })
        }
      });
    }

    return NextResponse.json({
      interviewer: dbInterviewer,
      message: 'Interviewer configured successfully'
    });
  } catch (error: any) {
    console.error('Error in POST /api/interviewers:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create interviewer' },
      { status: 500 }
    );
  }
}

// Helper functions
function getInterviewerName(id: string): string {
  const names: Record<string, string> = {
    'sophia-en': 'Sophia Anderson',
    'maria-es': 'María González',
    'james-en': 'James Mitchell',
    'carlos-es': 'Carlos Rodríguez'
  };
  return names[id] || 'AI Interviewer';
}

function getInterviewerLanguage(id: string): string {
  const languages: Record<string, string> = {
    'sophia-en': 'en-US',
    'maria-es': 'es-ES',
    'james-en': 'en-US',
    'carlos-es': 'es-MX'
  };
  return languages[id] || 'en-US';
}

function getInterviewerPersonality(id: string): string {
  const personalities: Record<string, string> = {
    'sophia-en': 'Professional & Warm',
    'maria-es': 'Empathetic & Detailed',
    'james-en': 'Direct & Analytical',
    'carlos-es': 'Friendly & Thorough'
  };
  return personalities[id] || 'Professional';
}

function getInterviewerSpecialties(id: string): string[] {
  const specialties: Record<string, string[]> = {
    'sophia-en': ['Technical', 'Leadership', 'Product'],
    'maria-es': ['Sales', 'Customer Service', 'Marketing'],
    'james-en': ['Engineering', 'Data Science', 'Finance'],
    'carlos-es': ['Operations', 'HR', 'General']
  };
  return specialties[id] || ['General'];
}

function getInterviewerExperience(id: string): string {
  const experience: Record<string, string> = {
    'sophia-en': '10+ years in tech recruiting',
    'maria-es': '8+ years in talent acquisition',
    'james-en': '15+ years Fortune 500',
    'carlos-es': '12+ years multinational'
  };
  return experience[id] || '5+ years';
}