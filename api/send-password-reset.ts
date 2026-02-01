
import nodemailer from 'nodemailer';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, token } = req.body;

  if (!email || !token) {
    return res.status(400).json({ error: 'Email and token are required' });
  }

  const GMAIL_USER = process.env.GMAIL_USER || 'banana196501@gmail.com';
  const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

  if (!GMAIL_APP_PASSWORD) {
    console.error('GMAIL_APP_PASSWORD is missing');
    return res.status(500).json({ error: 'Mail service configuration missing (App Password)' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Pentavalent Security" <${GMAIL_USER}>`,
      to: email,
      subject: "[Pentavalent] Password Reset Request",
      html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #f9fafb; border-radius: 24px; border: 1px solid #e5e7eb;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #0d2b5f; margin: 0; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: -0.025em;">Password Reset</h1>
              <p style="color: #64748b; font-size: 14px; margin-top: 8px;">PT. Penta Valent Tbk - Administrative Access</p>
            </div>
            
            <div style="background-color: white; padding: 32px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); text-align: center;">
              <p style="color: #1e293b; font-size: 16px; font-weight: 500; margin-bottom: 24px;">Use the following code to reset your password:</p>
              <div style="background-color: #f1f5f9; padding: 24px; border-radius: 12px; border: 2px dashed #cbd5e1;">
                <span style="font-size: 40px; font-weight: 800; color: #dc2626; letter-spacing: 12px; font-family: monospace;">${token}</span>
              </div>
              <p style="color: #64748b; font-size: 13px; margin-top: 24px;">This code is valid for a limited time only.</p>
            </div>

            <div style="margin-top: 32px; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 24px;">
              <p style="color: #94a3b8; font-size: 11px; margin: 0;">If you did not request a password reset, please secure your account immediately.</p>
              <p style="color: #94a3b8; font-size: 11px; margin-top: 8px;">© ${new Date().getFullYear()} PT. Penta Valent Tbk.</p>
            </div>
          </div>
        `,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('Gmail SMTP Error:', err);
    return res.status(500).json({ error: 'Failed to send reset email via Gmail', details: err.message });
  }
}
