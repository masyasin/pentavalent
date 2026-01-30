-- First, let's check the current structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'business_lines'
ORDER BY ordinal_position;

-- If images column doesn't exist, we need to add it
ALTER TABLE business_lines 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- Now update with images
UPDATE business_lines
SET images = '[
  "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=1200&h=800&fit=crop"
]'::jsonb,
image_url = 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=1200&h=800&fit=crop'
WHERE title_id = 'Distribusi Alat Kesehatan';

UPDATE business_lines
SET images = '[
  "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1632053002928-9e2e5c88e9b6?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&h=800&fit=crop"
]'::jsonb,
image_url = 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=1200&h=800&fit=crop'
WHERE title_id = 'Distribusi Farmasi';

UPDATE business_lines
SET images = '[
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&h=800&fit=crop"
]'::jsonb,
image_url = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=800&fit=crop'
WHERE title_id = 'Produk Konsumen & Kecantikan';

-- Verify
SELECT 
  title_id,
  title_en,
  jsonb_array_length(images) as total_images,
  image_url as primary_image
FROM business_lines
ORDER BY sort_order;
