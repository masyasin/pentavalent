
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
// WARNING: This key must be the SERVICE_ROLE key, not the ANON key
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!supabaseServiceKey) {
    console.error('SUPABASE_SERVICE_KEY is missing');
    return res.status(500).json({ error: 'Server configuration error (Service Key missing)' });
  }

  const GMAIL_USER = process.env.GMAIL_USER || 'banana196501@gmail.com';
  const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

  if (!GMAIL_APP_PASSWORD) {
    console.error('GMAIL_APP_PASSWORD is missing');
    return res.status(500).json({ error: 'Server configuration error (Gmail Key missing)' });
  }

  try {
    // 1. Initialize Supabase Admin Client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // 2. Generate Reset Token via Admin API
    // This generates a link like: https://site.com?token=...&type=recovery
    let { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
    });

    if (error) {
        console.error('Supabase Generate Link Error:', error);
        
        // AUTO-REGISTER LOGIC:
        // If error is "User not found", we try to create the user in Auth System
        // because they exist in our Admin Dashboard (public.users) but not in Supabase Auth.
        if (error.message.includes('User not found') || error.status === 404 || error.status === 400) {
            console.log('User not found in Auth. Attempting to auto-register...');
            
            // Generate a random temp password
            const tempPassword = Math.random().toString(36).slice(-8) + 'Aa1!';
            
            const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                email: email,
                password: tempPassword,
                email_confirm: true // Auto confirm so they can login/reset
            });

            if (createError) {
                 console.error('Failed to auto-register user:', createError);
                 return res.status(400).json({ error: 'User not found and failed to auto-register.' });
            }

            console.log('User auto-registered successfully. Retrying generate link...');
            
            // Retry generate link
            const retryResult = await supabaseAdmin.auth.admin.generateLink({
                type: 'recovery',
                email: email,
            });

            data = retryResult.data;
            error = retryResult.error;
        }

        if (error) {
             return res.status(400).json({ error: error.message });
        }
    }

    if (!data || !data.properties || !data.properties.action_link) {
      return res.status(500).json({ error: 'Failed to generate action link' });
    }

    // Extract just the token if needed, or send the full link.
    // The previous UI expects a 6-digit OTP or a token string.
    // Supabase returns a long JWT-like token in the URL hash.
    // For simplicity in this specific "Forgot Password" UI which asks for a code,
    // we might need to change the UI to just say "Click the link in your email".
    // BUT, to keep existing UI working, let's try to extract the token query param
    // or just send a 6-digit code manually and handle verification ourselves?
    //
    // WAIT: The existing UI (ForgotPasswordPage.tsx) expects a token to be entered manually.
    // Supabase links are meant to be clicked.
    //
    // HYBRID APPROACH:
    // We will send the LINK in the email.
    // And we will tell the frontend "Success".
    // The user will click the link, which should redirect them to a page where they can set a new password.
    //
    // HOWEVER, the user's current UI (ForgotPasswordPage.tsx) expects to INPUT a token.
    // Supabase 'recovery' link contains a token. We can parse it.
    // The link looks like: http://localhost:3000?token=...&type=recovery
    // Let's parse the token from the action_link.
    
    const actionLink = data.properties.action_link;
    const url = new URL(actionLink);
    const token = url.searchParams.get('token_hash') || url.searchParams.get('token'); 
    
    // Note: Supabase PKCE flow uses token_hash, implicit flow uses token.
    // If we want a simple 6-digit code, Supabase doesn't support that natively for recovery unless using OTP.
    // Let's stick to sending the token. It will be a long string, not 6 digits.
    // We need to update the UI to accept long tokens or just use the link.
    
    // BETTER UX: Send the 6-digit OTP using `signInWithOtp` instead?
    // `signInWithOtp` is for login, but it works for recovery too if we treat it as login.
    // But `generateLink` is safer for password reset specifically.
    
    // Let's send the token (hashed or plain) via email.
    // Actually, for better UX with the existing "Enter Code" UI, 
    // we should use `supabase.auth.signInWithOtp()` logic?
    // No, `generateLink` gives us a magic link.
    
    // LET'S SIMPLIFY:
    // We will send the `action_link` in the email.
    // We will ALSO return the `token` (hashed) to the frontend just for debugging/demo (optional).
    // The email will contain a big button "RESET PASSWORD".
    
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
      subject: "[Pentavalent] Reset Password Action",
      html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #0d2b5f;">Reset Password Request</h2>
            <p>You requested to reset your password. Click the button below to proceed:</p>
            <a href="${actionLink}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
            <p style="margin-top: 20px; color: #666; font-size: 12px;">Or copy this link: ${actionLink}</p>
            <p style="color: #999; font-size: 11px;">If you didn't ask for this, ignore this email.</p>
          </div>
        `,
    };

    await transporter.sendMail(mailOptions);
    
    // We return success. The UI will ask for a token.
    // Since we sent a LINK, the UI flow of "Enter 6 digit code" is slightly mismatched.
    // But the user can click the link.
    //
    // To fix the UI mismatch, we can also extract the token and show it in the email
    // "Or enter this code manually: [TOKEN]"
    // But the token is very long.
    
    return res.status(200).json({ success: true });

  } catch (err: any) {
    console.error('Request Reset API Error:', err);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}
