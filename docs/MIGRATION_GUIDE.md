# 🔄 Migration Guide: Moving from Supabase to Local/Cloud Server

Panduan ini menjelaskan langkah-langkah teknis untuk memindahkan infrastruktur backend dari Supabase ke server mandiri (Self-Hosted) menggunakan PostgreSQL dan Node.js API.

---

## 1. Migrasi Database (PostgreSQL)
Aplikasi ini menggunakan fitur PostgreSQL standar, sehingga migrasi ke instance Postgres lain sangat memungkinkan.

### A. Ekspor Struktur & Data
1.  Buka Supabase Dashboard > SQL Editor.
2.  Gunakan menu **Backup** atau jalankan perintah SQL untuk melihat schema.
3.  Opsi terbaik: Gunakan `pg_dump` jika memiliki akses langsung:
    ```bash
    pg_dump -h db.your-project.supabase.co -U postgres -d postgres > database_dump.sql
    ```

### B. Setup Server Database Lokal/Cloud
1.  Install PostgreSQL v14+ di server baru.
2.  Buat database baru: `CREATE DATABASE pentavalent_db;`
3.  Import schema: `psql -d pentavalent_db -f database_dump.sql`
4.  **Penting:** Anda harus membuat ulang fungsi trigger (seperti `update_updated_at_column`) yang ada di `master_schema.sql`.

---

## 2. Penggantian Supabase Auth & Storage
Jika tidak menggunakan Supabase, Anda harus mengganti dua modul kritis ini:

### A. Alternatif Autentikasi
Anda perlu membangun REST API sederhana (misal: Node.js/Express) untuk menangani login:
-   **Library:** `jsonwebtoken` (JWT) dan `bcryptjs`.
-   **Endpoint:** `/api/auth/login`, `/api/auth/me`.
-   **Frontend:** Ganti pemanggilan `supabase.auth.signInWithPassword` dengan `fetch()` ke API baru Anda.

### B. Alternatif Storage (Media)
Untuk menyimpan file (Gambar/PDF) tanpa Supabase Storage:
-   **Opsi 1 (Cloud):** Gunakan **AWS S3** atau **Google Cloud Storage**.
-   **Opsi 2 (Lokal):** Simpan di folder `/public/uploads` di server API Anda.
-   **Frontend:** Update kolom `logo_url`, `file_url`, dll di database dengan URL absolut dari server baru.

---

## 3. Perubahan pada Source Code (Frontend)
Karena klien Supabase tidak lagi digunakan, Anda harus melakukan refactor pada folder `src/lib/supabase.ts`.

### A. Inisialisasi API Client
Ganti `supabase-js` dengan `axios` atau `fetch` standard:
```typescript
// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

export default api;
```

### B. Refactor Queries
Ganti query gaya Supabase ke panggil API:
-   **Lama:** `supabase.from('news').select('*')`
-   **Baru:** `api.get('/news')`

---

## 4. Arsitektur Server Mandiri (Recommended Stack)
Jika lepas dari Supabase, berikut susunan yang disarankan:
-   **Frontend:** Vercel / Nginx (Static Files).
-   **Backend:** Node.js (Express.js) + Prisma ORM (untuk komunikasi ke Postgres).
-   **Database:** PostgreSQL (Self-managed).
-   **Storage:** MinIO (Self-hosted S3) atau sistem file lokal.

---

## 5. Checklist Migrasi Berhasil
- [ ] Seluruh tabel dan ENUM terbuat di database baru.
- [ ] Data Rows (Isi tabel) berhasil di-import.
- [ ] File media (PDF/Gambar) terpindah ke sistem storage baru.
- [ ] Environment Variables diperbarui ke endpoint API yang baru.
- [ ] Row Level Security (RLS) diganti dengan Middleware Level Security di API Node.js.
