
-- Enable RLS on news table
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can view published news" ON public.news;
DROP POLICY IF EXISTS "Admins can view all news" ON public.news;
DROP POLICY IF EXISTS "Admins can insert news" ON public.news;
DROP POLICY IF EXISTS "Admins can update news" ON public.news;
DROP POLICY IF EXISTS "Admins can delete news" ON public.news;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.news;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.news;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.news;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.news;

-- Policy: Public can view published news, Admins (authenticated) can view all
CREATE POLICY "Public can view published news" ON public.news
    FOR SELECT
    USING (is_published = true OR auth.role() = 'authenticated');

-- Policy: Admins can insert news
CREATE POLICY "Admins can insert news" ON public.news
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Policy: Admins can update news
CREATE POLICY "Admins can update news" ON public.news
    FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Policy: Admins can delete news
CREATE POLICY "Admins can delete news" ON public.news
    FOR DELETE
    USING (auth.role() = 'authenticated');
