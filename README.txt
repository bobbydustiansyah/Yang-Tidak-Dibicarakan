YANG KITA BICARAKAN — V6
========================

Versi ini membuat website publik mengambil puisi langsung dari Supabase.

Alur:
Ruang Tulis → Supabase (status published) → Website publik

File utama:
- index.html       = homepage dinamis
- public.js        = mengambil puisi published dari Supabase
- puisi.html       = halaman baca puisi dinamis
- supabase-config.js = konfigurasi project
- admin.html       = dashboard lama
- style.css        = desain

CARA UPLOAD KE GITHUB
1. Upload/replace file berikut di repository:
   index.html
   public.js
   puisi.html
   supabase-config.js
2. Jangan hapus admin.html dan style.css.
3. Commit changes.
4. Tunggu GitHub Pages 1–2 menit.
5. Buka:
   https://bobbydustiansyah.github.io/Yang-Tidak-Dibicarakan/

Catatan:
RLS Supabase harus mengizinkan SELECT untuk baris status='published'.
