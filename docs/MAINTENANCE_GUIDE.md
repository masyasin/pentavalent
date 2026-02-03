# 🚀 Maintenance & Infrastructure Guide (4 Pillars)

## 1. Deployment & DevOps (Runbook)
Langkah untuk memindahkan kode ke server produksi.

### A. Environment Variables
Aset yang diperlukan di platform hosting (Vercel):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### B. Prosedur Update
Setiap perubahan pada branch `main` akan dideploy secara otomatis oleh Vercel. Pastikan `npm run build` berhasil di lokal sebelum melakukan push.

---

## 2. Keamanan & Autentikasi

### A. Mekanisme Login
- Menggunakan Supabase Auth dengan JWT.
- Proteksi brute-force dan rate-limiting di sisi Supabase.

### B. Row Level Security (RLS)
- **Select:** Terbuka untuk publik pada tabel konten.
- **Insert/Update/Delete:** Hanya user dengan role admin yang valid.

### C. Roles (RBAC)
- **Super Admin:** Akses penuh seluruh modul dan manajemen user.
- **Admin:** Akses penuh konten publik dan investor.
- **Editor:** Fokus pada pengelolaan berita dan artikel.

---

## 3. Media Storage (Aset Digital)

### A. Struktur Storage
- `/logos/`
- `/news-featured/`
- `/management/`
- `/investor-docs/`

### B. Standar Optimasi
- **Gambar:** Format WebP, maks 500KB.
- **Dokumen:** PDF, maks 10MB.

---

## 4. Integrasi & API

### A. Map Integration
- Menggunakan **Leaflet.js** untuk peta interaktif.
- Data bersumber dari tabel `branches`.

### B. Sistem Email
- Terhubung dengan **Brevo** atau **SMTP Relay** untuk pengiriman notifikasi form kontak dan OTP.

### C. Sistem Bilingual
- Logic ganda bahasa menggunakan `translation.json` untuk teks statis dan kolom `_id`/`_en` di database untuk teks dinamis.
