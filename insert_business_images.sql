-- Insert Business Line Images (Slider Images)
-- This script adds 10 images for each business line category

-- First, get the business line IDs
-- Assuming:
-- 1. Distribusi Alat Kesehatan (Medical Equipment Distribution)
-- 2. Distribusi Farmasi (Pharmaceutical Distribution)
-- 3. Produk Konsumen & Kecantikan (Consumer & Beauty Products)

-- ============================================
-- DISTRIBUSI ALAT KESEHATAN (10 Images)
-- ============================================
INSERT INTO business_line_images (business_line_id, image_url, caption_id, caption_en, display_order)
VALUES
  -- Image 1: Modern Hospital Equipment
  (
    (SELECT id FROM business_lines WHERE name_id = 'Distribusi Alat Kesehatan' LIMIT 1),
    'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=1200&h=800&fit=crop',
    'Peralatan medis modern untuk rumah sakit',
    'Modern medical equipment for hospitals',
    1
  ),
  -- Image 2: Medical Devices
  (
    (SELECT id FROM business_lines WHERE name_id = 'Distribusi Alat Kesehatan' LIMIT 1),
    'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1200&h=800&fit=crop',
    'Teknologi diagnostik terkini',
    'Latest diagnostic technology',
    2
  ),
  -- Image 3: Laboratory Equipment
  (
    (SELECT id FROM business_lines WHERE name_id = 'Distribusi Alat Kesehatan' LIMIT 1),
    'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1200&h=800&fit=crop',
    'Peralatan laboratorium berkualitas tinggi',
    'High-quality laboratory equipment',
    3
  ),
  -- Image 4: Surgical Instruments
  (
    (SELECT id FROM business_lines WHERE name_id = 'Distribusi Alat Kesehatan' LIMIT 1),
    'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=1200&h=800&fit=crop',
    'Instrumen bedah presisi tinggi',
    'High-precision surgical instruments',
    4
  ),
  -- Image 5: Medical Monitoring Devices
  (
    (SELECT id FROM business_lines WHERE name_id = 'Distribusi Alat Kesehatan' LIMIT 1),
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=800&fit=crop',
    'Perangkat monitoring pasien canggih',
    'Advanced patient monitoring devices',
    5
  ),
  -- Image 6: Imaging Equipment
  (
    (SELECT id FROM business_lines WHERE name_id = 'Distribusi Alat Kesehatan' LIMIT 1),
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&h=800&fit=crop',
    'Peralatan pencitraan medis',
    'Medical imaging equipment',
    6
  ),
  -- Image 7: Clinic Equipment
  (
    (SELECT id FROM business_lines WHERE name_id = 'Distribusi Alat Kesehatan' LIMIT 1),
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=800&fit=crop',
    'Solusi lengkap untuk klinik modern',
    'Complete solutions for modern clinics',
    7
  ),
  -- Image 8: Sterilization Equipment
  (
    (SELECT id FROM business_lines WHERE name_id = 'Distribusi Alat Kesehatan' LIMIT 1),
    'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?w=1200&h=800&fit=crop',
    'Peralatan sterilisasi standar internasional',
    'International standard sterilization equipment',
    8
  ),
  -- Image 9: Rehabilitation Equipment
  (
    (SELECT id FROM business_lines WHERE name_id = 'Distribusi Alat Kesehatan' LIMIT 1),
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop',
    'Peralatan rehabilitasi dan fisioterapi',
    'Rehabilitation and physiotherapy equipment',
    9
  ),
  -- Image 10: Emergency Medical Equipment
  (
    (SELECT id FROM business_lines WHERE name_id = 'Distribusi Alat Kesehatan' LIMIT 1),
    'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=1200&h=800&fit=crop',
    'Peralatan medis darurat',
    'Emergency medical equipment',
    10
  );

-- ============================================
-- DISTRIBUSI FARMASI (10 Images)
-- ============================================
INSERT INTO business_line_images (business_line_id, image_url, caption_id, caption_en, display_order)
VALUES
  -- Image 1: Modern Pharmacy
  (
    (SELECT id FROM business_lines WHERE name_id = 'Distribusi Farmasi' LIMIT 1),
    'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=1200&h=800&fit=crop',
    'Distribusi farmasi modern dan terpercaya',
    'Modern and reliable pharmaceutical distribution',
    1
  ),
  -- Image 2: Pharmaceutical Products
  (
    (SELECT id FROM business_lines WHERE name_id = 'Distribusi Farmasi' LIMIT 1),
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1200&h=800&fit=crop',
    'Produk farmasi berkualitas tinggi',
    'High-quality pharmaceutical products',
    2
  ),
  -- Image 3: Medicine Storage
  (
    (SELECT id FROM business_lines WHERE name_id = 'Distribusi Farmasi' LIMIT 1),
    'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=1200&h=800&fit=crop',
    'Penyimpanan obat dengan cold chain management',
    'Medicine storage with cold chain management',
    3
  ),
  -- Image 4: Pharmaceutical Warehouse
  (
    (SELECT id FROM business_lines WHERE name_id = 'Distribusi Farmasi' LIMIT 1),
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=800&fit=crop',
    'Gudang farmasi berstandar GDP',
    'GDP-compliant pharmaceutical warehouse',
    4
  ),
  -- Image 5: Prescription Medicines
  (
    (SELECT id FROM business_lines WHERE name_id = 'Distribusi Farmasi' LIMIT 1),
    'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=1200&h=800&fit=crop',
    'Obat resep dan generik',
    'Prescription and generic medicines',
    5
  ),
  -- Image 6: Vaccine Distribution
  (
    (SELECT id FROM business_lines WHERE name_id = 'Distribusi Farmasi' LIMIT 1),
    'https://images.unsplash.com/photo-1632053002928-9e2e5c88e9b6?w=1200&h=800&fit=crop',
    'Distribusi vaksin dengan cold chain terjamin',
    'Vaccine distribution with guaranteed cold chain',
    6
  ),
  -- Image 7: Hospital Pharmacy
  (
    (SELECT id FROM business_lines WHERE name_id = 'Distribusi Farmasi' LIMIT 1),
    'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1200&h=800&fit=crop',
    'Solusi farmasi untuk rumah sakit',
    'Pharmaceutical solutions for hospitals',
    7
  ),
  -- Image 8: Quality Control
  (
    (SELECT id FROM business_lines WHERE name_id = 'Distribusi Farmasi' LIMIT 1),
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop',
    'Kontrol kualitas ketat untuk setiap produk',
    'Strict quality control for every product',
    8
  ),
  -- Image 9: Pharmaceutical Logistics
  (
    (SELECT id FROM business_lines WHERE name_id = 'Distribusi Farmasi' LIMIT 1),
    'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1200&h=800&fit=crop',
    'Logistik farmasi nasional',
    'National pharmaceutical logistics',
    9
  ),
  -- Image 10: Medicine Packaging
  (
    (SELECT id FROM business_lines WHERE name_id = 'Distribusi Farmasi' LIMIT 1),
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&h=800&fit=crop',
    'Pengemasan dan distribusi aman',
    'Safe packaging and distribution',
    10
  );

-- ============================================
-- PRODUK KONSUMEN & KECANTIKAN (10 Images)
-- ============================================
INSERT INTO business_line_images (business_line_id, image_url, caption_id, caption_en, display_order)
VALUES
  -- Image 1: Beauty Products Display
  (
    (SELECT id FROM business_lines WHERE name_id = 'Produk Konsumen & Kecantikan' LIMIT 1),
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=800&fit=crop',
    'Produk kecantikan premium',
    'Premium beauty products',
    1
  ),
  -- Image 2: Skincare Collection
  (
    (SELECT id FROM business_lines WHERE name_id = 'Produk Konsumen & Kecantikan' LIMIT 1),
    'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200&h=800&fit=crop',
    'Koleksi perawatan kulit terlengkap',
    'Complete skincare collection',
    2
  ),
  -- Image 3: Cosmetics Range
  (
    (SELECT id FROM business_lines WHERE name_id = 'Produk Konsumen & Kecantikan' LIMIT 1),
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=800&fit=crop',
    'Rangkaian kosmetik berkualitas',
    'Quality cosmetics range',
    3
  ),
  -- Image 4: Personal Care Products
  (
    (SELECT id FROM business_lines WHERE name_id = 'Produk Konsumen & Kecantikan' LIMIT 1),
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200&h=800&fit=crop',
    'Produk perawatan pribadi',
    'Personal care products',
    4
  ),
  -- Image 5: Health Supplements
  (
    (SELECT id FROM business_lines WHERE name_id = 'Produk Konsumen & Kecantikan' LIMIT 1),
    'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=1200&h=800&fit=crop',
    'Suplemen kesehatan dan vitamin',
    'Health supplements and vitamins',
    5
  ),
  -- Image 6: Natural Beauty Products
  (
    (SELECT id FROM business_lines WHERE name_id = 'Produk Konsumen & Kecantikan' LIMIT 1),
    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=1200&h=800&fit=crop',
    'Produk kecantikan alami',
    'Natural beauty products',
    6
  ),
  -- Image 7: Hair Care Products
  (
    (SELECT id FROM business_lines WHERE name_id = 'Produk Konsumen & Kecantikan' LIMIT 1),
    'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=1200&h=800&fit=crop',
    'Perawatan rambut profesional',
    'Professional hair care',
    7
  ),
  -- Image 8: Wellness Products
  (
    (SELECT id FROM business_lines WHERE name_id = 'Produk Konsumen & Kecantikan' LIMIT 1),
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&h=800&fit=crop',
    'Produk wellness dan kesehatan',
    'Wellness and health products',
    8
  ),
  -- Image 9: Luxury Beauty Brands
  (
    (SELECT id FROM business_lines WHERE name_id = 'Produk Konsumen & Kecantikan' LIMIT 1),
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200&h=800&fit=crop',
    'Brand kecantikan mewah',
    'Luxury beauty brands',
    9
  ),
  -- Image 10: Consumer Health Products
  (
    (SELECT id FROM business_lines WHERE name_id = 'Produk Konsumen & Kecantikan' LIMIT 1),
    'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&h=800&fit=crop',
    'Produk kesehatan konsumen',
    'Consumer health products',
    10
  );

-- Verify the insertions
SELECT 
  bl.name_id as business_line,
  COUNT(bli.id) as total_images
FROM business_lines bl
LEFT JOIN business_line_images bli ON bl.id = bli.business_line_id
GROUP BY bl.id, bl.name_id
ORDER BY bl.display_order;
