-- FIXED MIGRATION: Handles policies that block column type changes
-- JALANKAN INI DI SUPABASE SQL EDITOR

-- 1. Hapus semua policy yang menempel pada tabel users
DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;
DROP POLICY IF EXISTS "Public Read Access" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can manage everything" ON public.users;
DROP POLICY IF EXISTS "Enable all for all" ON public.users;

-- 2. Hapus primary key constraint
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_pkey;

-- 3. Ubah tipe kolom ID menjadi TEXT
ALTER TABLE public.users ALTER COLUMN id TYPE TEXT;

-- 4. Kembalikan primary key
ALTER TABLE public.users ADD PRIMARY KEY (id);

-- 5. Set default value untuk ID baru ke UUID string
ALTER TABLE public.users ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;

-- 6. Masukkan data admin awal jika belum ada
INSERT INTO public.users (id, email, full_name, role)
VALUES ('admin-123', 'admin@pentavalent.com', 'System Administrator', 'super_admin')
ON CONFLICT (id) DO NOTHING;

-- 7. Buat ulang policy dengan tipe data yang baru
-- A. Public Read
CREATE POLICY "Public Read Access" ON public.users
FOR SELECT USING (true);

-- B. Own Update (Gunakan casting cast ke text untuk keamanan)
CREATE POLICY "Users can update own profile" ON public.users
FOR UPDATE USING (auth.uid()::text = id) 
WITH CHECK (auth.uid()::text = id);

-- C. Admin Full Access (Menggunakan function check_is_admin yang sudah ada)
-- Jika function check_is_admin belum ada, abaikan atau buat dulu
CREATE POLICY "Admins can manage everything" ON public.users
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()::text
    AND role IN ('super_admin', 'admin')
  )
);
