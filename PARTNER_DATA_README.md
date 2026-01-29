# Partner Logo Data - PT Penta Valent Tbk

## Overview
Data partner logo telah berhasil dibuat dan dimasukkan ke database. Total ada **12 partner** yang terdiri dari:
- **7 Partner Internasional** (International)
- **5 Prinsipal Nasional** (Principal)

## Partner List

### International Partners (7)

1. **Pfizer Indonesia**
   - Type: International
   - Description (ID): Perusahaan farmasi global terkemuka yang mengembangkan obat-obatan inovatif untuk berbagai penyakit.
   - Description (EN): Leading global pharmaceutical company developing innovative medicines for various diseases.
   - Website: https://www.pfizer.com

2. **Johnson & Johnson**
   - Type: International
   - Description (ID): Konglomerat multinasional yang bergerak di bidang farmasi, alat kesehatan, dan produk konsumen.
   - Description (EN): Multinational conglomerate in pharmaceuticals, medical devices, and consumer products.
   - Website: https://www.jnj.com

3. **Siemens Healthineers**
   - Type: International
   - Description (ID): Penyedia teknologi medis terdepan untuk diagnostik dan terapi.
   - Description (EN): Leading medical technology provider for diagnostics and therapy.
   - Website: https://www.siemens-healthineers.com

4. **Novartis Indonesia**
   - Type: International
   - Description (ID): Perusahaan farmasi global yang fokus pada inovasi kesehatan.
   - Description (EN): Global pharmaceutical company focused on healthcare innovation.
   - Website: https://www.novartis.com

5. **Roche Indonesia**
   - Type: International
   - Description (ID): Pemimpin global dalam diagnostik dan farmasi.
   - Description (EN): Global leader in diagnostics and pharmaceuticals.
   - Website: https://www.roche.com

6. **AstraZeneca Indonesia**
   - Type: International
   - Description (ID): Perusahaan biofarmasi global dengan fokus pada inovasi.
   - Description (EN): Global biopharmaceutical company focused on innovation.
   - Website: https://www.astrazeneca.com

7. **Merck Indonesia**
   - Type: International
   - Description (ID): Perusahaan sains dan teknologi terkemuka di bidang kesehatan.
   - Description (EN): Leading science and technology company in healthcare.
   - Website: https://www.merck.com

### National Principals (5)

1. **PT Kalbe Farma Tbk**
   - Type: Principal
   - Description (ID): Perusahaan farmasi terbesar di Indonesia dengan portofolio produk yang lengkap.
   - Description (EN): Indonesia's largest pharmaceutical company with comprehensive product portfolio.
   - Website: https://www.kalbe.co.id

2. **PT Kimia Farma Tbk**
   - Type: Principal
   - Description (ID): BUMN farmasi terpercaya dengan jaringan apotek terluas di Indonesia.
   - Description (EN): Trusted state-owned pharmaceutical company with Indonesia's widest pharmacy network.
   - Website: https://www.kimiafarma.co.id

3. **PT Sanbe Farma**
   - Type: Principal
   - Description (ID): Produsen farmasi nasional berkualitas dengan standar internasional.
   - Description (EN): Quality national pharmaceutical manufacturer with international standards.
   - Website: https://www.sanbe.co.id

4. **PT Dexa Medica**
   - Type: Principal
   - Description (ID): Perusahaan farmasi nasional dengan produk berkualitas tinggi.
   - Description (EN): National pharmaceutical company with high-quality products.
   - Website: https://www.dexa-medica.com

5. **PT Tempo Scan Pacific Tbk**
   - Type: Principal
   - Description (ID): Produsen farmasi dan consumer health terkemuka di Indonesia.
   - Description (EN): Leading pharmaceutical and consumer health manufacturer in Indonesia.
   - Website: https://www.tempo.co.id

## Database Schema

### Partners Table Structure
```sql
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    partner_type partner_type NOT NULL DEFAULT 'principal',
    description_id TEXT,
    description_en TEXT,
    website TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

### Partner Type Enum
```sql
CREATE TYPE partner_type AS ENUM ('principal', 'international');
```

## Files Created

1. **seed_partners_complete.js** - Script untuk seeding data partner
2. **add_partner_descriptions.sql** - Migration untuk menambahkan kolom description
3. **seed_complete_v10.js** - Updated dengan data partner yang lengkap

## How to Use

### Seed Partners Data
```bash
node seed_partners_complete.js
```

### Run Complete Seeding (Including Partners)
```bash
node seed_complete_v10.js
```

### Add Description Columns (if needed)
Execute the SQL migration:
```sql
-- Run in Supabase SQL Editor
\i add_partner_descriptions.sql
```

## Display on Website

Partner logos akan ditampilkan di halaman utama website dengan:
- Logo berbentuk rounded square badge
- Warna yang berbeda untuk setiap partner (sesuai brand identity)
- Tooltip/hover effect menampilkan deskripsi partner
- Filter berdasarkan tipe (All Partners, National Principals, Global Manufacturers)

## Notes

- Semua partner data sudah bilingual (Indonesia & English)
- Logo menggunakan placeholder dari Unsplash (dapat diganti dengan logo asli)
- Data sudah terurut berdasarkan `sort_order`
- Semua partner dalam status `is_active = true`
