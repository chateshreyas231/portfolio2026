/**
 * Contact Form API Route
 * Handles contact form submissions with fallback to direct Resend
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { validateString, validateEmail } from '@/lib/api/validation';
import { formatErrorResponse, logError, ValidationError } from '@/lib/errors';

const EMAIL_SERVICE_URL = process.env.EMAIL_SERVICE_URL || process.env.NEXT_PUBLIC_EMAIL_SERVICE_URL || 'http://localhost:3005';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'connect@shreyaschate.dev';
const FROM_EMAIL = process.env.FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';

// Initialize Resend as fallback
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const body = await request.json();
    const { name, email, message } = body;

    // Validate inputs
    const validatedName = validateString(name, 'name', {
      minLength: 2,
      maxLength: 100,
      required: true,
    });

    const validatedEmail = validateEmail(email, 'email');

    const validatedMessage = validateString(message, 'message', {
      minLength: 10,
      maxLength: 2000,
      required: true,
    });

    // Get user IP and user agent
    const userIp = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Try Email Service first, fallback to direct Resend
    let emailSent = false;

    // Try microservice first
    try {
      const response = await fetch(`${EMAIL_SERVICE_URL}/api/email/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: validatedName,
          email: validatedEmail,
          message: validatedMessage,
          userIp,
          userAgent,
        }),
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        emailSent = true;
        return NextResponse.json({
          success: true,
          message: data.message || 'Your message has been sent successfully! I\'ll get back to you soon.',
        });
      }
    } catch (fetchError: any) {
      // If service is not available, fall through to direct Resend
      if (fetchError.name !== 'AbortError') {
        logError(fetchError, { context: 'Email Service Connection Error', level: 'warn' });
      }
    }

    // Fallback: Use Resend directly if microservice is unavailable
    if (!emailSent && resend) {
      try {
        // Escape HTML to prevent XSS
        const escapeHtml = (text: string) => {
          const map: Record<string, string> = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
          };
          return text.replace(/[&<>"']/g, (m) => map[m]);
        };

        const safeName = escapeHtml(validatedName);
        const safeEmail = escapeHtml(validatedEmail);
        const safeMessage = escapeHtml(validatedMessage).replace(/\n/g, '<br>');

        // Send notification email
        const emailResult = await resend.emails.send({
          from: FROM_EMAIL,
          to: [CONTACT_EMAIL],
          replyTo: validatedEmail,
          subject: `New Contact Form Submission from ${validatedName}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: #000; color: #fff; padding: 20px; text-align: center; }
                  .content { background: #f9f9f9; padding: 20px; margin-top: 20px; }
                  .field { margin-bottom: 15px; }
                  .label { font-weight: bold; color: #000; }
                  .value { margin-top: 5px; padding: 10px; background: #fff; border-left: 3px solid #000; }
                  .footer { margin-top: 20px; padding: 10px; text-align: center; font-size: 12px; color: #666; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>New Contact Form Submission</h1>
                  </div>
                  <div class="content">
                    <div class="field">
                      <div class="label">Name:</div>
                      <div class="value">${safeName}</div>
                    </div>
                    <div class="field">
                      <div class="label">Email:</div>
                      <div class="value">
                        <a href="mailto:${safeEmail}">${safeEmail}</a>
                      </div>
                    </div>
                    <div class="field">
                      <div class="label">Message:</div>
                      <div class="value">${safeMessage}</div>
                    </div>
                  </div>
                  <div class="footer">
                    <p>This email was sent from your portfolio contact form.</p>
                    <p>IP: ${userIp} | User Agent: ${userAgent.substring(0, 100)}</p>
                  </div>
                </div>
              </body>
            </html>
          `,
          text: `
New Contact Form Submission

Name: ${validatedName}
Email: ${validatedEmail}
Message: ${validatedMessage}

---
This email was sent from your portfolio contact form.
IP: ${userIp}
          `,
        });

        if (emailResult.error) {
          // Log detailed error for debugging
          logError(emailResult.error, { 
            context: 'Resend API Error',
            resendErrorCode: emailResult.error.name,
            resendErrorMessage: emailResult.error.message
          });
          throw new Error(emailResult.error.message || 'Failed to send email');
        }

        // Send confirmation email (non-blocking)
        resend.emails.send({
          from: FROM_EMAIL,
          to: [validatedEmail],
          subject: 'Thank you for contacting Shreyas Chate',
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: #000; color: #fff; padding: 20px; text-align: center; }
                  .content { background: #f9f9f9; padding: 20px; margin-top: 20px; }
                  .footer { margin-top: 20px; padding: 10px; text-align: center; font-size: 12px; color: #666; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>Thank You for Reaching Out!</h1>
                  </div>
                  <div class="content">
                    <p>Hi ${safeName},</p>
                    <p>Thank you for contacting me through my portfolio. I've received your message and will get back to you as soon as possible.</p>
                    <p>Best regards,<br>Shreyas Chate</p>
                  </div>
                  <div class="footer">
                    <p>This is an automated confirmation email.</p>
                  </div>
                </div>
              </body>
            </html>
          `,
        }).catch((err) => {
          logError(err, { context: 'Confirmation email failed', level: 'warn' });
        });

        return NextResponse.json({
          success: true,
          message: 'Your message has been sent successfully! I\'ll get back to you soon.',
        });

      } catch (resendError: any) {
        // Enhanced error logging
        const errorDetails = {
          context: 'Resend Direct Error',
          hasApiKey: !!RESEND_API_KEY,
          apiKeyLength: RESEND_API_KEY ? RESEND_API_KEY.length : 0,
          fromEmail: FROM_EMAIL,
          contactEmail: CONTACT_EMAIL,
          errorMessage: resendError?.message,
          errorName: resendError?.name,
          errorStack: resendError?.stack?.substring(0, 500),
        };
        logError(resendError, errorDetails);
        
        // Provide more helpful error message
        let userMessage = 'Failed to send email. Please try again or contact directly at connect@shreyaschate.dev';
        if (resendError?.message?.includes('domain')) {
          userMessage = 'Email service configuration error. Please contact directly at connect@shreyaschate.dev';
        } else if (resendError?.message?.includes('API key') || resendError?.message?.includes('Unauthorized')) {
          userMessage = 'Email service authentication error. Please contact directly at connect@shreyaschate.dev';
        }
        
        return NextResponse.json(
          {
            success: false,
            error: userMessage
          },
          { status: 500 }
        );
      }
    }

    // If neither service is available
    if (!resend) {
      logError(new Error('Resend not initialized'), { 
        context: 'Resend Not Configured',
        hasApiKey: !!RESEND_API_KEY,
        fromEmail: FROM_EMAIL,
        contactEmail: CONTACT_EMAIL
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Email service not configured. Please contact directly at connect@shreyaschate.dev'
        },
        { status: 503 }
      );
    }

    // Should not reach here, but just in case
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send message'
      },
      { status: 500 }
    );

  } catch (error) {
    logError(error, { context: 'Contact Form API Error' });
    
    if (error instanceof ValidationError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message
        },
        { status: 400 }
      );
    }

    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(
      {
        success: false,
        error: errorResponse.error || 'Failed to send message'
      },
      { status: errorResponse.statusCode || 500 }
    );
  }
}

