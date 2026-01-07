/**
 * Email Service
 * Handles sending emails via Resend
 */

import { Resend } from 'resend';
import { createLogger } from '../utils/logger';

const logger = createLogger('email-service');

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'connect@shreyaschate.dev';
const FROM_EMAIL = process.env.FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';

// Initialize Resend
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

if (!resend) {
  logger.warn('Resend API key not configured. Email service will not work.');
}

interface ContactEmailData {
  name: string;
  email: string;
  message: string;
  userIp: string;
  userAgent: string;
}

interface ConfirmationEmailData {
  name: string;
  email: string;
}

export async function sendContactEmail(data: ContactEmailData): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    return {
      success: false,
      error: 'Email service not configured'
    };
  }

  try {
    // Escape HTML in user input to prevent XSS
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

    const safeName = escapeHtml(data.name);
    const safeEmail = escapeHtml(data.email);
    const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br>');

    const emailResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: [CONTACT_EMAIL],
      replyTo: data.email,
      subject: `New Contact Form Submission from ${data.name}`,
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
                <p>IP: ${data.userIp} | User Agent: ${data.userAgent}</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Message: ${data.message}

---
This email was sent from your portfolio contact form.
IP: ${data.userIp}
      `,
    });

    if (emailResult.error) {
      logger.error('Resend API error', emailResult.error);
      return {
        success: false,
        error: emailResult.error.message || 'Failed to send email'
      };
    }

    logger.info('Contact email sent successfully', { 
      to: CONTACT_EMAIL,
      from: data.email 
    });

    return { success: true };

  } catch (error) {
    logger.error('Error sending contact email', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function sendConfirmationEmail(data: ConfirmationEmailData): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const emailResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: [data.email],
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
                <p>Hi ${data.name},</p>
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
      text: `
Thank You for Reaching Out!

Hi ${data.name},

Thank you for contacting me through my portfolio. I've received your message and will get back to you as soon as possible.

Best regards,
Shreyas Chate

This is an automated confirmation email.
      `,
    });

    if (emailResult.error) {
      logger.warn('Failed to send confirmation email', { error: emailResult.error });
      return { success: false, error: emailResult.error.message };
    }

    return { success: true };

  } catch (error) {
    logger.warn('Error sending confirmation email', { error });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

