-- Update corporate visual image with a grand building dummy
UPDATE public.company_info 
SET image_url = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000'
WHERE id = (SELECT id FROM public.company_info LIMIT 1);
