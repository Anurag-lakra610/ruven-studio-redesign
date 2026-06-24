import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.includes('your_')) {
    return NextResponse.json(
      { error: 'Resend API key is not configured.' },
      { status: 500 }
    );
  }

  try {
    const { type, email, link } = await request.json();

    if (!email || !link || !type) {
      return NextResponse.json(
        { error: 'Missing required parameters: type, email, or link' },
        { status: 400 }
      );
    }

    const resend = new Resend(apiKey);
    let subject = '';
    let htmlContent = '';

    if (type === 'verify') {
      subject = 'Verify your Ruven Studio account';
      htmlContent = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #F5F3EE; color: #1A1A18;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 24px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin: 0; color: #670000;">RUVEN STUDIO</h1>
          </div>
          <div style="background-color: #FFFFFF; padding: 40px; border: 1px solid #C8C5BE; border-radius: 0;">
            <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #888880; margin: 0 0 16px 0;">Studio Membership</p>
            <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 20px 0; color: #1A1A18; line-height: 1.2;">Verify your account.</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #555555; margin: 0 0 24px 0;">
              Thank you for registering an account with Ruven Studio. Please click the button below to confirm your email and activate your membership.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${link}" style="display: inline-block; background-color: #1A1A18; color: #FFFFFF; text-decoration: none; padding: 12px 36px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.08em; border-radius: 0;">Verify Email Address</a>
            </div>
            <hr style="border: 0; border-top: 1px solid #EAEAEA; margin: 32px 0;" />
            <blockquote style="margin: 0; padding: 0 0 0 16px; border-left: 2px solid #1A1A18; font-style: italic; color: #555555; font-size: 13px;">
              &ldquo;Therefore, if anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come.&rdquo;
              <footer style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #888880; margin-top: 8px;">&mdash; 2 Corinthians 5:17</footer>
            </blockquote>
          </div>
          <div style="text-align: center; margin-top: 40px; font-size: 11px; color: #888880;">
            <p style="margin: 0;">Ruven Studio &bull; Made with Purpose</p>
          </div>
        </div>
      `;
    } else if (type === 'reset') {
      subject = 'Reset your Ruven Studio password';
      htmlContent = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #F5F3EE; color: #1A1A18;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 24px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin: 0; color: #670000;">RUVEN STUDIO</h1>
          </div>
          <div style="background-color: #FFFFFF; padding: 40px; border: 1px solid #C8C5BE; border-radius: 0;">
            <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #888880; margin: 0 0 16px 0;">Account Recovery</p>
            <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 20px 0; color: #1A1A18; line-height: 1.2;">Reset your password.</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #555555; margin: 0 0 24px 0;">
              We received a request to reset the password for your Ruven Studio account. Click the button below to set a new password. This link expires in 1 hour.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${link}" style="display: inline-block; background-color: #1A1A18; color: #FFFFFF; text-decoration: none; padding: 12px 36px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.08em; border-radius: 0;">Reset Password</a>
            </div>
            <p style="font-size: 12px; color: #888880; margin: 24px 0 0 0;">
              If you did not request a password reset, you can safely ignore this email.
            </p>
            <hr style="border: 0; border-top: 1px solid #EAEAEA; margin: 32px 0;" />
            <blockquote style="margin: 0; padding: 0 0 0 16px; border-left: 2px solid #1A1A18; font-style: italic; color: #555555; font-size: 13px;">
              &ldquo;Keep your heart with all vigilance, for from it flow the springs of life.&rdquo;
              <footer style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #888880; margin-top: 8px;">&mdash; Proverbs 4:23</footer>
            </blockquote>
          </div>
          <div style="text-align: center; margin-top: 40px; font-size: 11px; color: #888880;">
            <p style="margin: 0;">Ruven Studio &bull; Made with Purpose</p>
          </div>
        </div>
      `;
    } else {
      return NextResponse.json(
        { error: 'Invalid email type. Supported values: verify, reset' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'hello@ruvenstudio.in',
      to: email.trim(),
      subject: subject,
      html: htmlContent,
    });

    if (error) throw error;

    return NextResponse.json({ success: true, messageId: data?.id });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'An error occurred while sending the email.' },
      { status: 500 }
    );
  }
}
