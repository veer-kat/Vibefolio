import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  // Validate request
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return NextResponse.json(
      { error: 'Invalid content type' },
      { status: 400 }
    );
  }

  try {
    const { email } = await request.json();

    // Validate email input
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Simple email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('Missing email credentials in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Configure transporter (using Gmail as example)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection
    await transporter.verify();

    // Send email
    const info = await transporter.sendMail({
      from: `"Veer Katrodia" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Contact Details:',
      text: `Hello,\nI'm Veer,\nHere are my contact details:\n\nEmail: veerpkatrodia@gmail.com\nPhone: +91 9819015887\n\nBest regards,\nVeer Katrodia`,
      html: `
        <div>
          <h2>Hello,</h2>
          <p>I'm Veer Katrodia, aspiring Software Developer</p>
          <p>Here are my contact details:</p>
          <ul>
            <li>Email: veerpkatrodia@gmail.com</li>
            <li>Phone: +91 9819015887</li>
          </ul>
          <p>Best regards,<br/>Veer Katrodia</p>
        </div>
      `,
    });

    console.log('Email sent:', info.messageId);
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Email sending error:', error);
    
    // Handle specific error cases
    if (error.code === 'EAUTH') {
      return NextResponse.json(
        { error: 'Authentication failed. Check your email credentials.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to send email',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Add TypeScript types for response
export type SendEmailResponse = {
  success?: boolean;
  error?: string;
  details?: string;
};