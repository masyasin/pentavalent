
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required' });
  }

  if (!supabaseServiceKey) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // 1. Initialize Supabase Admin Client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // 2. Verify the Token
    // We try to get the user using the provided access token.
    // This verifies if the token is valid and belongs to a user.
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      console.error('Invalid Token:', userError);
      return res.status(401).json({ error: 'Invalid or expired reset token' });
    }

    console.log('Token verified for user:', user.email);

    // 3. Admin Force Update Password
    // Using service_role key to bypass any RLS or session restrictions
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (updateError) {
      console.error('Admin Update Error:', updateError);
      return res.status(500).json({ error: updateError.message });
    }

    return res.status(200).json({ success: true });

  } catch (err: any) {
    console.error('Confirm Reset API Error:', err);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}
