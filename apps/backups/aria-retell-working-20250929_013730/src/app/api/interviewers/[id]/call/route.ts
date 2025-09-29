// src/app/api/interviewers/[id]/call/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { retellClient } from '@/lib/retell';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { phoneNumber, candidateName, jobTitle } = body;

    // Get interviewer from database
    const interviewer = await prisma.interviewer.findUnique({
      where: { id: params.id }
    });

    if (!interviewer || !interviewer.retellAgentId) {
      return NextResponse.json(
        { error: 'Interviewer not found or not configured' },
        { status: 404 }
      );
    }

    // Create phone call with Retell - Usando createPhoneCall en lugar de call.create
    const phoneCall = await retellClient.createPhoneCall({
      agent_id: interviewer.retellAgentId,
      from_number: process.env.RETELL_PHONE_NUMBER || '+14155551234',
      to_number: phoneNumber,
      metadata: {
        candidate_name: candidateName,
        job_title: jobTitle,
        interviewer_id: params.id
      },
      retell_llm_dynamic_variables: {
        candidate_name: candidateName,
        job_title: jobTitle
      }
    });

    // Save interview record
    await prisma.interview.create({
      data: {
        interviewerId: params.id,
        candidateId: body.candidateId,
        jobId: body.jobId,
        scheduledAt: new Date(),
        mode: 'phone',
        notes: JSON.stringify({
          retell_call_id: phoneCall.call_id,
          phone_number: phoneNumber
        })
      }
    });

    return NextResponse.json({
      success: true,
      callId: phoneCall.call_id,
      message: 'Interview call initiated'
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to initiate call';
    console.error('Error initiating call:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}