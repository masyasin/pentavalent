-- FINAL FIX: Menangani Error Infinite Recursion & ID Format Mismatch
-- JALANKAN INI DI SUPABASE SQL EDITOR

-- 1. Bersihkan semua policy lama untuk menghindari konflik & rekursi
DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;
DROP POLICY IF EXISTS "Public Read Access" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can manage everything" ON public.users;
DROP POLICY IF EXISTS "Enable all for all" ON public.users;

-- 2. Pastikan tipe kolom ID adalah TEXT (untuk mendukung admin-123)
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE public.users ALTER COLUMN id TYPE TEXT;
ALTER TABLE public.users ADD PRIMARY KEY (id);

-- 3. Gunakan SECURITY DEFINER function untuk memutus rantai rekursi
-- Fungsi ini berjalan sebagai superuser dan tidak memicu RLS saat mengecek role
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()::text
    AND role IN ('super_admin', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Berikan izin eksekusi ke user yang login
GRANT EXECUTE ON FUNCTION public.check_is_admin() TO authenticated;

-- 5. Buat ulang policy yang AMAN (Tanpa Rekursi)
-- A. Read Access: Siapapun (termasuk publik) bisa melihat profil (untuk Dashboard/Logs)
CREATE POLICY "Public Read Access" ON public.users
FOR SELECT USING (true);

-- B. Own Update: User bisa update profil dirinya sendiri
CREATE POLICY "Users can update own profile" ON public.users
FOR UPDATE USING (auth.uid()::text = id) 
WITH CHECK (auth.uid()::text = id);

-- C. Admin Full Access: Menggunakan function untuk menghindari rekursi
CREATE POLICY "Admins can manage everything" ON public.users
FOR ALL USING (public.check_is_admin());

-- 6. Daftarkan admin-123 jika belum ada
INSERT INTO public.users (id, email, full_name, role)
VALUES ('admin-123', 'admin@pentavalent.com', 'Super Administrator', 'super_admin')
ON CONFLICT (id) DO UPDATE SET role = 'super_admin';
