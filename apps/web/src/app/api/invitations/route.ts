import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { candidateEmail, candidateName, jobTitle, companyName, invitationLink } = body;

    if (!candidateEmail || !candidateName || !jobTitle || !invitationLink) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Sending invitation to:', candidateEmail);

    const { data, error } = await resend.emails.send({
      from: 'ARIA HR Platform <onboarding@resend.dev>',
      to: [candidateEmail],
      subject: `${companyName || 'ARIA'} invites you to an interview - ${jobTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
                  <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">🎯 Interview Invitation</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px;">
                  <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                    Hello <strong>${candidateName}</strong>,
                  </p>
                  <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                    ${companyName || 'Our company'} invites you to complete a voice interview powered by artificial intelligence for the <strong>${jobTitle}</strong> position.
                  </p>
                  <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.6;">
                    The interview is completely voice-based and will take approximately 15-20 minutes. You can complete it from any device with a microphone.
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="text-align: center; padding: 20px 0;">
                        <a href="${invitationLink}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                          Start Interview
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin: 30px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                    💡 <strong>Tip:</strong> Make sure you're in a quiet place with a good internet connection.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px 40px; background: #f9fafb; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                    This is an automated email from ARIA HR Platform<br>
                    If you didn't request this interview, you can ignore this message
                  </p>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send invitation email', details: error },
        { status: 500 }
      );
    }

    console.log('Invitation sent successfully:', data);

    return NextResponse.json({
      success: true,
      emailId: data?.id,
    });

  } catch (error) {
    console.error('Error sending invitation:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send invitation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
