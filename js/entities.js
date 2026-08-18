// ---------- MENU SIDEBAR (6 Modul) ----------
const MENU = [
  { page: 'dashboard', href: 'dashboard.html', icon: '&#9635;', label: 'Dashboard' },
  { page: 'profil-stasiun', href: 'profil-stasiun.html', icon: '&#9733;', label: 'Profil Stasiun' },
  { page: 'pegawai', href: 'pegawai.html', icon: '&#9787;', label: 'Data Pegawai' },
  { page: 'perka', href: 'perka.html', icon: '&#8594;', label: 'Data Perka' },
  { page: 'administrasi', href: 'administrasi.html', icon: '&#9873;', label: 'Administrasi &amp; K3' },
  { page: 'library', href: 'library.html', icon: '&#128218;', label: 'RailLibrary' },
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
    label: 'Fasilitas & Layanan', labelSingular: 'Fasilitas',
    searchKeys: ['nama', 'kategori', 'lokasi'],
    tableColumns: [
      { key: 'nama', label: 'Nama Fasilitas' },
      { key: 'kategori', label: 'Kategori' },
      { key: 'lokasi', label: 'Lokasi' },
      { key: 'keterangan', label: 'Keterangan' },
    ],
    fields: [
      { key: 'nama', label: 'Nama Fasilitas', type: 'text', required: true },
      { key: 'kategori', label: 'Kategori', type: 'select', options: ['Layanan Penumpang', 'Keamanan', 'Kebersihan', 'Teknis', 'Lainnya'] },
      { key: 'lokasi', label: 'Lokasi', type: 'text' },
      { key: 'keterangan', label: 'Keterangan', type: 'text' },
    ],
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
};
function badgeColor(value) {
  return BADGE_COLOR_MAP[value] || 'blue';
}
