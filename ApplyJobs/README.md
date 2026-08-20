# ApplyJobz

ApplyJobz adalah aplikasi React dan Firebase untuk mengelola lamaran kerja, tahapan rekrutmen, agenda, dan aktivitas pencarian kerja.

## Akses pengguna tertutup

Pendaftaran publik dinonaktifkan. Route `/register` diarahkan ke `/login`, dan akun customer hanya dapat dibuat oleh admin melalui `/admin`. Admin dapat melihat akun serta mengaktifkan atau menonaktifkan akses customer.

Operasi admin dijalankan oleh Netlify Function `admin-users`. Firebase Admin SDK tidak pernah dimuat ke browser. Setiap request diverifikasi menggunakan Firebase ID token dan custom claim `admin: true`.

### Environment variable Netlify

Atur salah satu konfigurasi berikut di Netlify Site configuration → Environment variables:

```text
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY
```

Atau gunakan satu variabel `FIREBASE_SERVICE_ACCOUNT_JSON` berisi JSON service account lengkap. Jangan memakai awalan `VITE_` untuk rahasia Admin SDK.

### Membuat admin pertama

1. Buat akun Email/Password admin melalui Firebase Console → Authentication → Users.
2. Simpan service account di luar repository.
3. Jalankan dari folder `ApplyJobs`:

```powershell
$env:FIREBASE_SERVICE_ACCOUNT_FILE='C:\path-aman\service-account.json'
npm run set-admin -- --email admin@example.com
```

4. Logout lalu login kembali melalui `/admin` agar token baru memuat claim admin.

### Keamanan

- Admin SDK hanya berjalan di Netlify Functions.
- Password awal dikirim langsung ke Firebase Authentication dan tidak disimpan di Firestore.
- Pengguna biasa tidak dapat membuat profil atau mengubah status akunnya sendiri.
- Status nonaktif diterapkan pada Firebase Authentication dan Firestore, lalu refresh token dicabut.
- Firestore Rules memeriksa status akun sebelum mengizinkan akses data.
- Akun lama tanpa field `status` tetap dianggap aktif selama migrasi.

## Menjalankan aplikasi

```bash
npm install
npm run dev
```

Gunakan `npx netlify dev` ketika menguji halaman admin secara lokal agar endpoint `/.netlify/functions/admin-users` tersedia.

## Pemeriksaan

```bash
npm run lint
npm run build
```
