YANG KITA BICARAKAN — V5 ONLINE

Isi:
- index.html        website publik
- login.html        login Supabase Auth
- admin.html        Ruang Tulis (protected by Supabase session)
- supabase-config.js konfigurasi Supabase public URL + publishable key
- app.js / style.css desain
- poem/              contoh halaman puisi

PENTING:
1. Database `public.poems` dan RLS harus sudah dibuat di Supabase.
2. Jangan pernah memasukkan Secret Key / Service Role Key ke file frontend.
3. Upload seluruh isi folder ini ke repository GitHub, menggantikan versi lama.
4. Setelah GitHub Pages selesai deploy, buka /login.html untuk menguji login.
