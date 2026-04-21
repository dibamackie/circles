import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_test123');

const SENDER_EMAIL = 'The Fly Bottle <no-reply@theflybottle.org>';

export async function sendConfirmationEmail(toEmail, name, circleName) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('Simulating confirmation email... missing RESEND_API_KEY');
      return true;
    }
    await resend.emails.send({
      from: SENDER_EMAIL,
      to: [toEmail],
      subject: `Registration Confirmed: ${circleName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #00d2ff;">Registration Successful</h2>
          <p>Dear ${name},</p>
          <p>We have successfully received your registration for <strong>${circleName}</strong>.</p>
          <p>If applicable, you will receive a Telegram invite link shortly once the group is finalized.</p>
          <br/>
          <p>Best regards,<br/>The Fly Bottle Team</p>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
}

export async function sendTelegramInviteEmail(toEmail, name, circleName, telegramLink) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('Simulating telegram email... missing RESEND_API_KEY');
      return true;
    }
    await resend.emails.send({
      from: SENDER_EMAIL,
      to: [toEmail],
      subject: `Telegram Invite: ${circleName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #10b981;">Join the Telegram Group</h2>
          <p>Dear ${name},</p>
          <p>The Telegram group for <strong>${circleName}</strong> is now available.</p>
          <p>Please click the link below to join the discussion:</p>
          <div style="margin: 30px 0;">
            <a href="${telegramLink}" style="background-color: #3a7bd5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Join Telegram Group
            </a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser: <br/> ${telegramLink}</p>
          <br/>
          <p>Best regards,<br/>The Fly Bottle Team</p>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
}
