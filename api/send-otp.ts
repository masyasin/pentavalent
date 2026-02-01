
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: 'Email and code are required' });
  }

  // NOTE: Gunakan BREVO_API_KEY di environment variables Vercel
  // Dapatkan di: https://app.brevo.com/settings/keys/api
  const BREVO_API_KEY = process.env.BREVO_API_KEY;

  if (!BREVO_API_KEY) {
    console.error('BREVO_API_KEY is missing');
    return res.status(500).json({ error: 'Mail service configuration missing' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: "Pentavalent Security",
          email: "banana196501@gmail.com" // WAJIB SAMA dengan email login Brevo (sebelum verifikasi domain)
        },
        to: [{ email: email }],
        subject: "[Pentavalent] Verification Code",
        htmlContent: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #f9fafb; border-radius: 24px; border: 1px solid #e5e7eb;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #0d2b5f; margin: 0; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: -0.025em;">Secure Verification</h1>
              <p style="color: #64748b; font-size: 14px; margin-top: 8px;">PT. Penta Valent Tbk - Administrative Access</p>
            </div>
            
            <div style="background-color: white; padding: 32px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); text-align: center;">
              <p style="color: #1e293b; font-size: 16px; font-weight: 500; margin-bottom: 24px;">Your verification code is:</p>
              <div style="background-color: #f1f5f9; padding: 24px; border-radius: 12px; border: 2px dashed #cbd5e1;">
                <span style="font-size: 40px; font-weight: 800; color: #3b82f6; letter-spacing: 12px; font-family: monospace;">${code}</span>
              </div>
              <p style="color: #64748b; font-size: 13px; margin-top: 24px;">This code will remain valid for the next 5 minutes.</p>
            </div>

            <div style="margin-top: 32px; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 24px;">
              <p style="color: #94a3b8; font-size: 11px; margin: 0;">If you did not request this code, please ignore this email.</p>
              <p style="color: #94a3b8; font-size: 11px; margin-top: 8px;">© ${new Date().getFullYear()} PT. Penta Valent Tbk.</p>
            </div>
          </div>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Brevo Error:', data);
      return res.status(400).json({ error: data.message || 'Failed to send email' });
    }

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('Server side Error:', err);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}
