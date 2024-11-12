import nodemailer from 'nodemailer';
import { createTransport } from 'nodemailer';
import { config } from 'dotenv';

config();

const transporter = createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendInviteEmail(email, inviteToken) {
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const inviteUrl = `${appUrl}/invite/accept/${inviteToken}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || '"Chief Team" <noreply@chief.com>',
    to: email,
    subject: 'Invitation to Join Chief Project Management',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4F46E5; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Chief</h1>
        </div>
        <div style="padding: 20px; background-color: white; border-radius: 8px; margin-top: 20px;">
          <h2 style="color: #111827;">You've Been Invited!</h2>
          <p style="color: #4B5563; line-height: 1.5;">
            You've been invited to join the Chief project management platform. Click the button below to accept the invitation and join your team.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteUrl}" 
               style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Accept Invitation
            </a>
          </div>
          <p style="color: #6B7280; font-size: 14px;">
            If you're having trouble clicking the button, copy and paste this URL into your browser:
            <br>
            <a href="${inviteUrl}" style="color: #4F46E5; word-break: break-all;">${inviteUrl}</a>
          </p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #6B7280; font-size: 12px;">
          <p>If you didn't expect this invitation, you can safely ignore this email.</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}