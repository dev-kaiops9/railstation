// ---------- IKON FLAT SVG (dipakai di sidebar & tab) ----------
const ICON = {
  dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/></svg>',
  mapPin: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-7.2 7-12.2A7 7 0 1 0 5 8.8C5 13.8 12 21 12 21z"/><circle cx="12" cy="8.8" r="2.5"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.3"/><path d="M2.5 20.2c0-3.6 2.9-6.1 6.5-6.1s6.5 2.5 6.5 6.1"/><circle cx="17.3" cy="9" r="2.6"/><path d="M16 14.3c2.6.5 4.5 2.4 4.5 5.4"/></svg>',
  route: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6.5" r="2.4"/><circle cx="18" cy="17.5" r="2.4"/><path d="M8.2 6.5H15a3 3 0 0 1 3 3v.5a3 3 0 0 1-3 3H9a3 3 0 0 0-3 3v.3"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.2l7 2.9v5.4c0 4.6-3 8.5-7 9.6-4-1.1-7-5-7-9.6V6.1l7-2.9z"/><path d="M9 12.3l2 2.1 4-4.3"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6.6c-1.7-1.3-4.1-1.9-6.7-1.9v12.4c2.6 0 5 .6 6.7 1.9 1.7-1.3 4.1-1.9 6.7-1.9V4.7c-2.6 0-5 .6-6.7 1.9z"/><path d="M12 6.6v12.4"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 21H5.6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2H9.5"/><path d="M16 16.5l4.5-4.5-4.5-4.5"/><path d="M20.5 12H9.8"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.6"/><path d="M12 7.4V12l3.3 2"/></svg>',
  award: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8.3" r="5"/><path d="M8.6 12.7L7 21l5-2.7 5 2.7-1.6-8.3"/></svg>',
  building: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8.5" width="7.5" height="12.5" rx="1"/><rect x="12.5" y="3" width="7" height="18" rx="1"/><path d="M7 12.5h1.5M7 15.5h1.5M7 18.5h1.5M15.5 7h1.5M15.5 10h1.5M15.5 13h1.5M15.5 16h1.5"/></svg>',
  train: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="5" width="15" height="11.5" rx="4"/><path d="M4.5 11.2h15"/><path d="M9 16.5V20M15 16.5V20"/><path d="M7 20.5h2.6M14.4 20.5H17"/></svg>',
  clipboard: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4.2" width="14" height="16.8" rx="2"/><path d="M9 3.2h6a1 1 0 0 1 1 1V6H8V4.2a1 1 0 0 1 1-1z"/><path d="M8.5 11.2h7M8.5 14.6h7M8.5 18h4.5"/></svg>',
  fileText: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h6.5L18 7.5V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M13.5 3v4.5H18"/><path d="M8.5 12.5h7M8.5 15.5h7M8.5 9.5h3"/></svg>',
  wrench: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6.5a4 4 0 0 0-5.6 4.9L4 16.8V20h3.2l5.4-5.4a4 4 0 0 0 5-5.1l-2.7 2.7-2.1-2.1 2.2-2.6z"/></svg>',
  alertTriangle: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 4.6L2.9 18a1.6 1.6 0 0 0 1.4 2.4h15.4a1.6 1.6 0 0 0 1.4-2.4L13.7 4.6a1.6 1.6 0 0 0-2.8 0z"/><path d="M12 10v4"/><circle cx="12" cy="16.9" r="0.9" fill="currentColor" stroke="none"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M5 20.2c0-3.9 3.1-6.6 7-6.6s7 2.7 7 6.6"/></svg>',
  cloudSun: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.8" cy="7" r="2.6"/><path d="M7.8 2.6v1.2M7.8 9.7v1.2M3.5 7h1.2M10.9 7h1.2M4.9 3.9l.9.9M9.8 3.9l-.9.9"/><path d="M9.5 14.7a4 4 0 0 1 3.9-3.4c1.9 0 3.4 1.3 3.8 3.1a3 3 0 0 1-.4 6H9a2.9 2.9 0 0 1-.5-5.7z"/></svg>',
};

// ---------- MENU SIDEBAR (6 Modul) ----------
const MENU = [
  { page: 'dashboard', href: 'dashboard.html', icon: ICON.dashboard, label: 'Dashboard' },
  { page: 'profil-stasiun', href: 'profil-stasiun.html', icon: ICON.mapPin, label: 'Profil Stasiun' },
  { page: 'pegawai', href: 'pegawai.html', icon: ICON.users, label: 'Data Pegawai' },
  { page: 'perka', href: 'perka.html', icon: ICON.route, label: 'Data Perka' },
  { page: 'administrasi', href: 'administrasi.html', icon: ICON.shield, label: 'Administrasi &amp; K3' },
  { page: 'library', href: 'library.html', icon: ICON.book, label: 'RailLibrary' },
];

// ---------- KONFIGURASI ENTITAS UNTUK GENERIC CRUD ENGINE ----------
// type: text | number | date | time | select | textarea | file
const ENTITY_CONFIG = {
  pegawai: {
    label: 'Data Pegawai', labelSingular: 'Pegawai', hasFoto: true,
    searchKeys: ['nama', 'nipp', 'jabatan'],
    tableColumns: [
      { key: 'foto', label: '', isPhoto: true },
      { key: 'nama', label: 'Nama' },
      { key: 'nipp', label: 'NIPP' },
      { key: 'jabatan', label: 'Jabatan' },
      { key: 'unit', label: 'Unit' },
      { key: 'status', label: 'Status', isBadge: true },
    ],
    fields: [
      { key: 'nama', label: 'Nama Lengkap', type: 'text', required: true },
      { key: 'nipp', label: 'NIPP', type: 'text' },
      { key: 'jabatan', label: 'Jabatan', type: 'text' },
      { key: 'unit', label: 'Unit', type: 'text' },
      { key: 'noHp', label: 'No HP', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'status', label: 'Status', type: 'select', options: ['Aktif', 'Nonaktif'] },
    ],
  },
  jadwalDinas: {
    label: 'Jadwal Dinas', labelSingular: 'Jadwal Dinas',
    searchKeys: ['pegawaiNama', 'shift'],
    tableColumns: [
      { key: 'pegawaiNama', label: 'Nama Pegawai' },
      { key: 'tanggal', label: 'Tanggal' },
      { key: 'shift', label: 'Shift', isBadge: true },
      { key: 'keterangan', label: 'Keterangan' },
    ],
    fields: [
      { key: 'pegawaiNama', label: 'Nama Pegawai', type: 'text', required: true },
      { key: 'tanggal', label: 'Tanggal', type: 'date', required: true },
      { key: 'shift', label: 'Shift', type: 'select', options: ['Pagi', 'Siang', 'Malam', 'Libur'] },
      { key: 'keterangan', label: 'Keterangan', type: 'text' },
    ],
  },
  sertifikasi: {
    label: 'Sertifikasi & Tanda Kecakapan', labelSingular: 'Sertifikasi',
    searchKeys: ['pegawaiNama', 'namaSertifikasi'],
    tableColumns: [
      { key: 'pegawaiNama', label: 'Nama Pegawai' },
      { key: 'namaSertifikasi', label: 'Sertifikasi' },
      { key: 'tanggalKadaluarsa', label: 'Berlaku s.d.' },
      { key: 'status', label: 'Status', isBadge: true },
    ],
    fields: [
      { key: 'pegawaiNama', label: 'Nama Pegawai', type: 'text', required: true },
      { key: 'namaSertifikasi', label: 'Nama Sertifikasi / Tanda Kecakapan', type: 'text', required: true },
      { key: 'tanggalTerbit', label: 'Tanggal Terbit', type: 'date' },
      { key: 'tanggalKadaluarsa', label: 'Tanggal Kadaluarsa', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: ['Berlaku', 'Akan Habis', 'Kadaluarsa'] },
    ],
  },
  fasilitas: {
    label: 'Fasilitas & Layanan Stasiun', labelSingular: 'Fasilitas',
    searchKeys: ['nama', 'kategori', 'lokasi'],
    tableColumns: [
      { key: 'nama', label: 'Nama Fasilitas' },
      { key: 'kategori', label: 'Kategori', isBadge: true },
      { key: 'lokasi', label: 'Lokasi' },
      { key: 'keterangan', label: 'Keterangan' },
    ],
    fields: [
      { key: 'nama', label: 'Nama Fasilitas', type: 'text', required: true },
      { key: 'kategori', label: 'Kategori', type: 'select', options: ['Layanan Penumpang', 'Keamanan', 'Kebersihan', 'Teknis', 'Lainnya'] },
      { key: 'lokasi', label: 'Lokasi', type: 'text' },
      { key: 'keterangan', label: 'Keterangan', type: 'text' },
    ],
    compact: { primary: 'nama', badge: 'kategori', sub: 'lokasi' },
  },
  fasilitasUmum: {
    label: 'Fasilitas Umum Terdekat', labelSingular: 'Fasilitas Umum',
    searchKeys: ['nama', 'kategori', 'alamat'],
    tableColumns: [
      { key: 'nama', label: 'Nama' },
      { key: 'kategori', label: 'Kategori', isBadge: true },
      { key: 'jarak', label: 'Jarak' },
      { key: 'alamat', label: 'Alamat' },
      { key: 'keterangan', label: 'Keterangan' },
    ],
    fields: [
      { key: 'nama', label: 'Nama Fasilitas', type: 'text', required: true },
      { key: 'kategori', label: 'Kategori', type: 'select', options: ['ATM/Bank', 'SPBU', 'Rumah Sakit/Klinik', 'Minimarket', 'Kuliner', 'Masjid/Mushola', 'Penginapan', 'Lainnya'] },
      { key: 'jarak', label: 'Jarak dari Stasiun', type: 'text' },
      { key: 'alamat', label: 'Alamat', type: 'text' },
      { key: 'keterangan', label: 'Keterangan', type: 'text' },
    ],
    compact: { primary: 'nama', badge: 'kategori', sub: 'jarak' },
  },
  jadwalKA: {
    label: 'Jadwal KA Berhenti', labelSingular: 'Jadwal KA',
    searchKeys: ['nomorKA', 'rute'],
    tableColumns: [
      { key: 'nomorKA', label: 'Nomor KA' },
      { key: 'rute', label: 'Rute' },
      { key: 'jamDatang', label: 'Jam Datang' },
      { key: 'jamBerangkat', label: 'Jam Berangkat' },
    ],
    fields: [
      { key: 'nomorKA', label: 'Nomor KA', type: 'text', required: true },
      { key: 'rute', label: 'Rute', type: 'text' },
      { key: 'jamDatang', label: 'Jam Datang', type: 'time' },
      { key: 'jamBerangkat', label: 'Jam Berangkat', type: 'time' },
      { key: 'stasiunBerhenti', label: 'Berhenti di Stasiun', type: 'text' },
    ],
  },
  perka: {
    label: 'Perjalanan Kereta Api', labelSingular: 'Perka',
    searchKeys: ['nomorKA', 'rute'],
    tableColumns: [
      { key: 'nomorKA', label: 'Nomor KA' },
      { key: 'rute', label: 'Rute' },
      { key: 'tanggal', label: 'Tanggal' },
      { key: 'jamDatang', label: 'Jam Datang' },
      { key: 'jamBerangkat', label: 'Jam Berangkat' },
      { key: 'statusJalur', label: 'Status', isBadge: true },
    ],
    fields: [
      { key: 'nomorKA', label: 'Nomor KA', type: 'text', required: true },
      { key: 'rute', label: 'Rute', type: 'text' },
      { key: 'tanggal', label: 'Tanggal', type: 'date', required: true },
      { key: 'jamDatang', label: 'Jam Datang', type: 'time' },
      { key: 'jamBerangkat', label: 'Jam Berangkat', type: 'time' },
      { key: 'statusJalur', label: 'Status Jalur', type: 'select', options: ['Tepat Waktu', 'Terlambat', 'Dibatalkan'] },
    ],
  },
  jalur: {
    label: 'Jalur & Emplasemen', labelSingular: 'Jalur',
    searchKeys: ['namaJalur'],
    tableColumns: [
      { key: 'namaJalur', label: 'Nama Jalur' },
      { key: 'panjangM', label: 'Panjang (m)' },
      { key: 'kapasitas', label: 'Kapasitas' },
      { key: 'spesifikasi', label: 'Spesifikasi' },
    ],
    fields: [
      { key: 'namaJalur', label: 'Nama Jalur', type: 'text', required: true },
      { key: 'panjangM', label: 'Panjang (meter)', type: 'number' },
      { key: 'kapasitas', label: 'Kapasitas', type: 'text' },
      { key: 'spesifikasi', label: 'Spesifikasi Teknis', type: 'text' },
    ],
  },
  ibpr: {
    label: 'Identifikasi Bahaya & Penilaian Risiko (IBPR)', labelSingular: 'IBPR',
    searchKeys: ['aktivitas', 'bahaya'],
    tableColumns: [
      { key: 'aktivitas', label: 'Aktivitas' },
      { key: 'bahaya', label: 'Bahaya' },
      { key: 'dampak', label: 'Dampak', isBadge: true },
      { key: 'probabilitas', label: 'Probabilitas' },
      { key: 'tingkatRisiko', label: 'Tingkat Risiko', isBadge: true },
    ],
    fields: [
      { key: 'aktivitas', label: 'Aktivitas', type: 'text', required: true },
      { key: 'bahaya', label: 'Identifikasi Bahaya', type: 'text', required: true },
      { key: 'dampak', label: 'Dampak', type: 'select', options: ['Rendah', 'Sedang', 'Tinggi'] },
      { key: 'probabilitas', label: 'Probabilitas', type: 'select', options: ['Jarang', 'Kadang', 'Sering'] },
      { key: 'kontrol', label: 'Kontrol / Mitigasi', type: 'text' },
      { key: 'tingkatRisiko', label: 'Tingkat Risiko', type: 'select', options: ['Rendah', 'Sedang', 'Tinggi', 'Ekstrem'] },
    ],
  },
  formulirAdmin: {
    label: 'Penjagaan Bentuk-Bentuk (PTP / BH / BK / MS)', labelSingular: 'Formulir',
    searchKeys: ['jenis', 'nomor'],
    tableColumns: [
      { key: 'jenis', label: 'Jenis', isBadge: true },
      { key: 'nomor', label: 'Nomor' },
      { key: 'tanggal', label: 'Tanggal' },
      { key: 'fileUrl', label: 'File', isFile: true },
    ],
    fields: [
      { key: 'jenis', label: 'Jenis Formulir', type: 'select', options: ['PTP', 'BH', 'BK', 'MS'], required: true },
      { key: 'nomor', label: 'Nomor', type: 'text' },
      { key: 'tanggal', label: 'Tanggal', type: 'date' },
      { key: 'keterangan', label: 'Keterangan', type: 'text' },
    ],
    fileField: 'fileUrl', fileIdField: 'fileId', fileFolder: 'Formulir Administrasi',
  },
  penggunaanKRSI: {
    label: 'Penggunaan KR & SI', labelSingular: 'KR/SI',
    searchKeys: ['jenis', 'nomor', 'pegawaiNama'],
    tableColumns: [
      { key: 'jenis', label: 'Jenis', isBadge: true },
      { key: 'nomor', label: 'Nomor' },
      { key: 'tanggal', label: 'Tanggal' },
      { key: 'pegawaiNama', label: 'Pegawai' },
    ],
    fields: [
      { key: 'jenis', label: 'Jenis', type: 'select', options: ['KR', 'SI'], required: true },
      { key: 'nomor', label: 'Nomor', type: 'text' },
      { key: 'tanggal', label: 'Tanggal', type: 'date' },
      { key: 'pegawaiNama', label: 'Pegawai Terkait', type: 'text' },
      { key: 'keterangan', label: 'Keterangan', type: 'text' },
    ],
  },
  gangguan: {
    label: 'Gangguan Operasional', labelSingular: 'Gangguan',
    searchKeys: ['jenisGangguan', 'petugas'],
    tableColumns: [
      { key: 'jenisGangguan', label: 'Jenis Gangguan' },
      { key: 'tanggal', label: 'Tanggal' },
      { key: 'jam', label: 'Jam' },
      { key: 'petugas', label: 'Petugas' },
      { key: 'status', label: 'Status', isBadge: true },
    ],
    fields: [
      { key: 'jenisGangguan', label: 'Jenis Gangguan', type: 'text', required: true },
      { key: 'tanggal', label: 'Tanggal', type: 'date' },
      { key: 'jam', label: 'Jam', type: 'time' },
      { key: 'laporan', label: 'Isi Laporan', type: 'text' },
      { key: 'petugas', label: 'Petugas Penanggung Jawab', type: 'text' },
      { key: 'status', label: 'Status', type: 'select', options: ['Open', 'Dalam Penanganan', 'Selesai'] },
    ],
  },
  dokumen: {
    label: 'Pusat Dokumen', labelSingular: 'Dokumen',
    searchKeys: ['judul', 'kategori'],
    tableColumns: [
      { key: 'judul', label: 'Judul Dokumen' },
      { key: 'kategori', label: 'Kategori', isBadge: true },
      { key: 'tanggalUpload', label: 'Tanggal Upload' },
      { key: 'fileUrl', label: 'File', isFile: true },
    ],
    fields: [
      { key: 'judul', label: 'Judul Dokumen', type: 'text', required: true },
      { key: 'kategori', label: 'Kategori', type: 'select', options: ['Aturan', 'Panduan', 'Referensi Operasional', 'Lainnya'] },
      { key: 'tanggalUpload', label: 'Tanggal Upload', type: 'date' },
    ],
    fileField: 'fileUrl', fileIdField: 'fileId', fileFolder: 'RailLibrary Dokumen', fileRequired: true,
  },
};

const BADGE_COLOR_MAP = {
  Aktif: 'green', Nonaktif: 'red', Berlaku: 'green', 'Akan Habis': 'orange', Kadaluarsa: 'red',
  'Tepat Waktu': 'green', Terlambat: 'orange', Dibatalkan: 'red',
  Rendah: 'green', Sedang: 'orange', Tinggi: 'red', Ekstrem: 'red',
  Open: 'red', 'Dalam Penanganan': 'orange', Selesai: 'green',
  Pagi: 'blue', Siang: 'orange', Malam: 'purple', Libur: 'green',
  PTP: 'blue', BH: 'purple', BK: 'orange', MS: 'green', KR: 'blue', SI: 'purple',
  Aturan: 'blue', Panduan: 'purple', 'Referensi Operasional': 'orange',
  'Layanan Penumpang': 'blue', Keamanan: 'red', Kebersihan: 'green', Teknis: 'orange',
  'ATM/Bank': 'blue', SPBU: 'orange', 'Rumah Sakit/Klinik': 'red', Minimarket: 'green',
  Kuliner: 'purple', 'Masjid/Mushola': 'blue', Penginapan: 'purple',
};
function badgeColor(value) {
  return BADGE_COLOR_MAP[value] || 'blue';
}
