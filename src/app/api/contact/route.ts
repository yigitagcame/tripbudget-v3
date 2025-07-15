import { NextRequest, NextResponse } from 'next/server';
import * as SibApiV3Sdk from '@getbrevo/brevo';

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, subject, message } = await request.json();
    
    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if support email is configured
    const supportEmail = process.env.SUPPORT_EMAIL_ADDRESS;
    if (!supportEmail) {
      console.error('SUPPORT_EMAIL_ADDRESS not configured');
      return NextResponse.json(
        { error: 'Contact form is not configured. Please try again later.' },
        { status: 500 }
      );
    }

    // Initialize Brevo API client
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);

    // Create email content
    const emailContent = `
**Name:** ${firstName} ${lastName}
**Email:** ${email}
**Subject:** ${subject}

**Message:**
${message}
    `.trim();

    // Create send email request
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email: supportEmail }];
    sendSmtpEmail.sender = { email: supportEmail, name: 'Trip Budget Contact Form' };
    sendSmtpEmail.replyTo = { email: email, name: `${firstName} ${lastName}` };
    sendSmtpEmail.subject = `Contact Form: ${subject}`;
    sendSmtpEmail.htmlContent = emailContent.replace(/\n/g, '<br>');
    sendSmtpEmail.textContent = emailContent;

    // Send email
    await apiInstance.sendTransacEmail(sendSmtpEmail);

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.'
    });

  } catch (error: any) {
    console.error('Contact form error:', error);
    
    // Handle specific Brevo API errors
    if (error.response?.body?.code === 'invalid_parameter') {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
} 