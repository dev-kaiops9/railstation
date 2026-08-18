# Panduan Deploy — RailStatiON

Arsitektur: **GitHub Pages** (frontend) → **Apps Script** (API generik untuk 6 modul) → **Google Sheets** (database) + **Google Drive** (file/foto).

## 1. Siapkan Google Sheet + Apps Script

1. Buka [sheets.google.com](https://sheets.google.com), buat spreadsheet baru — beri nama misalnya "DB RailStatiON".
2. Buka **Extensions > Apps Script**.
3. Hapus isi default `Code.gs`, copy-paste seluruh isi file `Code.gs` dari folder `apps-script/`.
4. Di dropdown fungsi (toolbar atas), pilih `setup`, klik **Run**.
   - Google akan minta izin akses Sheets + Drive → **Review permissions** → pilih akun kantor → **Allow**.
   - Ini otomatis membuat **15 sheet** (Users, Sessions, StasiunProfil, Pegawai, JadwalDinas, Sertifikasi, Fasilitas, JadwalKA, Perka, Jalur, IBPR, FormulirAdmin, PenggunaanKRSI, Gangguan, Dokumen), folder Drive, dan akun admin default:
     - **Username:** `admin` — **Password:** `admin123` (ganti setelah login pertama lewat menu RailLibrary > Manajemen Pengguna, atau lihat cara ganti password admin di bawah)

## 2. Deploy sebagai Web App

1. **Deploy > New deployment** → ikon gear → pilih **Web app**.
2. **Execute as:** Me — **Who has access:** Anyone.
3. **Deploy**, otorisasi lagi jika diminta.
4. Copy URL `.../exec` yang muncul.

   > Setiap kali `Code.gs` diubah: **Deploy > Manage deployments > Edit (pensil) > New version > Deploy** agar perubahan aktif di URL yang sama.

## 3. Hubungkan Frontend

Buka `web/js/api.js`, ganti:
```js
const BASE_URL = 'GANTI_DENGAN_URL_DEPLOYMENT_APPS_SCRIPT';
```
dengan URL `.../exec` dari langkah 2.

## 4. Upload ke GitHub Pages

1. Buat repo baru di GitHub.
2. Upload seluruh isi folder `web/` ke root repo (index.html, dashboard.html, dst + folder css/ & js/). Folder `apps-script/` **tidak** diupload ke GitHub — itu hanya untuk di-paste ke editor Apps Script.
3. **Settings > Pages** → source: branch `main`, folder `/ (root)`.
4. Tunggu 1-2 menit, buka URL yang diberikan GitHub → login dengan `admin` / `admin123`.

## 5. Struktur Modul yang Sudah Jadi

| Modul | Halaman | Isi |
|---|---|---|
| 1. Dashboard | `dashboard.html` | Ringkasan real-time (pegawai aktif, perjalanan hari ini, gangguan aktif) + status dinas |
| 2. Profil Stasiun | `profil-stasiun.html` | Info & lokasi stasiun (form singleton) + Fasilitas + Jadwal KA berhenti |
| 3. Data Pegawai | `pegawai.html` | Direktori Pegawai (+ foto) + Jadwal Dinas + Sertifikasi/Kecakapan |
| 4. Data Perka | `perka.html` | Perjalanan Kereta Api + Jalur & Emplasemen |
| 5. Administrasi & K3 | `administrasi.html` | IBPR + Formulir PTP/BH/BK/MS (+ lampiran file) + Penggunaan KR/SI + Gangguan Operasional |
| 6. RailLibrary | `library.html` | Pusat Dokumen (+ upload file) + Manajemen Pengguna |

Semua modul CRUD (kecuali Profil Stasiun & Manajemen Pengguna) dibangun dari **satu mesin generik** (`js/crud-page.js` + konfigurasi di `js/entities.js`), jadi menambah kolom baru atau entitas baru tidak perlu menulis ulang HTML/JS — cukup ubah konfigurasi di `entities.js` dan `Code.gs`.

## 6. Ganti password admin

Tempel fungsi ini sementara di `Code.gs`, jalankan sekali lewat Run, lalu boleh dihapus:
```js
function gantiPasswordAdmin() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Users');
  const salt = Utilities.getUuid();
  const hash = hashPassword('PASSWORD_BARU_DISINI', salt);
  sheet.getRange(2, 3).setValue(hash); // kolom passwordHash
  sheet.getRange(2, 4).setValue(salt); // kolom salt
}
```
Atau lebih mudah: tambah user admin baru lewat menu **RailLibrary > Manajemen Pengguna**, lalu hapus akun `admin` lama (catatan: akun bernama persis `admin` sengaja dikunci dari penghapusan di UI — kalau perlu, hapus manual dari sheet `Users`).

## 7. Catatan & Batasan (versi dasar ini)

- **Kuota Apps Script**: ±20.000 request/hari per akun Google — cukup untuk internal kantor skala kecil-menengah.
- **Belum ada** di versi dasar ini (bisa ditambah bertahap):
  - Export Excel/PDF untuk IBPR (baru CRUD dasar, belum filter dampak/probabilitas/kontrol yang bisa diekspor)
  - Grafik/gambar emplasemen visual (baru data teknis dalam bentuk tabel)
  - Ringkasan Jam Kerja (IJK) & analisis kebutuhan pegawai otomatis
  - Role-based permission (saat ini semua user yang login, baik admin maupun staff, punya akses setara ke semua modul — role tersimpan tapi belum membatasi akses)
  - Relasi data pegawai yang sesungguhnya (Jadwal Dinas/Sertifikasi/KR-SI masih memakai kolom nama pegawai berupa teks bebas, bukan dropdown terhubung ke tabel Pegawai)
  - Pagination tabel (saat ini memuat semua baris sekaligus — cukup untuk ratusan baris, mulai terasa lambat di ribuan baris)
- **Keamanan foto/file**: dishare sebagai "Anyone with link can view" agar bisa ditampilkan di web. Untuk dokumen sensitif, pertimbangkan proxy file lewat Apps Script alih-alih link langsung.

Beri tahu saya modul atau fitur mana yang mau diperdalam/dibuat lebih matang selanjutnya.
