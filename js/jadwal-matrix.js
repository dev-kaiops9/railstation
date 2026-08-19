/**
 * Komponen khusus untuk sub-menu "Jadwal Dinas": matrix Pegawai x Tanggal
 * (1 bulan penuh), meniru format rekap dinasan manual. Baris = pegawai
 * (diambil dari entitas 'pegawai'), kolom = tanggal 1..akhir bulan dengan
 * dua baris header (nomor tanggal + nama hari SB/MG/SN/SL/RB/KM/JM). Isi sel
 * disimpan sebagai record di entitas generic 'jadwalDinas' (pegawaiNama,
 * tanggal, shift) — satu baris data per sel yang terisi.
 *
 * Sama seperti mountInlineTableCard, komponen ini TIDAK punya tombol Edit
 * Data sendiri — dikontrol dari luar lewat wireEditToggle() atau langsung
 * lewat objek yang dikembalikan: { enterEdit, exitEdit, save, reload }.
 */
function mountJadwalDinasMatrix(containerId) {
  const container = document.getElementById(containerId);
  const DAY_ABBR = ['MG', 'SN', 'SL', 'RB', 'KM', 'JM', 'SB']; // index = Date.getDay()

  let pegawaiList = [];
  let jadwalMap = {};   // key `nama|yyyy-mm-dd` -> { id, shift }
  let workingMap = {};  // perubahan yang sedang diedit (key yang sama)
  let isEditing = false;

  const today = new Date();
  let curYear = today.getFullYear();
  let curMonth = today.getMonth(); // 0-based

  container.innerHTML = `
    <div class="section">
      <div class="section-head">
        <h3>Jadwal Dinas</h3>
        <div class="section-head-actions">
          <input type="month" data-role="month-picker" class="inline-input" style="width:150px;">
        </div>
      </div>
      <div class="card-panel matrix-wrap">
        <table class="matrix-table">
          <thead data-role="thead"></thead>
          <tbody data-role="tbody"><tr><td class="loading-text">Memuat data...</td></tr></tbody>
        </table>
      </div>
    </div>
  `;

  const monthPicker = container.querySelector('[data-role="month-picker"]');
  const thead = container.querySelector('[data-role="thead"]');
  const tbody = container.querySelector('[data-role="tbody"]');

  function pad(n) { return String(n).padStart(2, '0'); }
  monthPicker.value = `${curYear}-${pad(curMonth + 1)}`;

  function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
  function dateKey(y, m, d) { return `${y}-${pad(m + 1)}-${pad(d)}`; }

  async function load() {
    tbody.innerHTML = `<tr><td class="loading-text">Memuat data...</td></tr>`;
    const [pegRes, jadwalRes] = await Promise.all([API.list('pegawai'), API.list('jadwalDinas')]);
    pegawaiList = pegRes.ok ? pegRes.data : [];
    const jadwalList = jadwalRes.ok ? jadwalRes.data : [];
    jadwalMap = {};
    jadwalList.forEach(row => {
      const tgl = formatDateForInput(row.tanggal);
      if (!tgl) return;
      jadwalMap[`${row.pegawaiNama}|${tgl}`] = { id: row.id, shift: row.shift || '' };
    });
    render();
  }

  function render() {
    const nDays = daysInMonth(curYear, curMonth);
    const days = [];
    for (let d = 1; d <= nDays; d++) {
      const dow = new Date(curYear, curMonth, d).getDay();
      days.push({ d, dow, key: dateKey(curYear, curMonth, d) });
    }

    thead.innerHTML = `
      <tr>
        <th rowspan="2">NO</th>
        <th rowspan="2">NAMA</th>
        <th rowspan="2">GRADE</th>
        <th rowspan="2">NIPP</th>
        <th rowspan="2">JABATAN</th>
        ${days.map(day => `<th>${day.d}</th>`).join('')}
      </tr>
      <tr>
        ${days.map(day => `<th class="${day.dow === 0 ? 'day-sunday' : ''}">${DAY_ABBR[day.dow]}</th>`).join('')}
      </tr>
    `;

    if (pegawaiList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="${5 + nDays}"><div class="empty-state">Belum ada data pegawai. Tambahkan dulu di tab "Pegawai".</div></td></tr>`;
      return;
    }

    tbody.innerHTML = pegawaiList.map((p, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td class="name-col">${escapeHtml(p.nama || '')}</td>
        <td>${escapeHtml(p.grade || '')}</td>
        <td>${escapeHtml(p.nipp || '')}</td>
        <td>${escapeHtml(p.jabatan || '')}</td>
        ${days.map(day => renderCell(p, day)).join('')}
      </tr>
    `).join('');

    if (isEditing) {
      tbody.querySelectorAll('[data-cellkey]').forEach(inp => {
        inp.addEventListener('input', (e) => {
          workingMap[e.target.dataset.cellkey] = e.target.value;
        });
      });
    }
  }

  function renderCell(p, day) {
    const mapKey = `${p.nama}|${day.key}`;
    if (isEditing) {
      const val = workingMap[mapKey] !== undefined ? workingMap[mapKey] : (jadwalMap[mapKey] ? jadwalMap[mapKey].shift : '');
      return `<td><input type="text" data-cellkey="${escapeAttr(mapKey)}" value="${escapeAttr(val)}"></td>`;
    }
    const val = jadwalMap[mapKey] ? jadwalMap[mapKey].shift : '';
    let cls = '';
    const up = val.toUpperCase();
    if (up === 'CT') cls = 'cell-ct';
    else if (up === 'R') cls = 'cell-rest';
    else if (up === 'L') cls = 'cell-libur';
    return `<td class="${cls}">${escapeHtml(val)}</td>`;
  }

  monthPicker.addEventListener('change', () => {
    const [y, m] = monthPicker.value.split('-').map(Number);
    if (!y || !m) return;
    curYear = y; curMonth = m - 1;
    workingMap = {};
    render();
  });

  function enterEdit() {
    isEditing = true;
    workingMap = {};
    render();
  }

  function exitEdit() {
    isEditing = false;
    workingMap = {};
    render();
  }

  async function save() {
    const nDays = daysInMonth(curYear, curMonth);
    const ops = [];
    for (const p of pegawaiList) {
      for (let d = 1; d <= nDays; d++) {
        const key = dateKey(curYear, curMonth, d);
        const mapKey = `${p.nama}|${key}`;
        if (!(mapKey in workingMap)) continue;
        const newVal = workingMap[mapKey].trim();
        const existing = jadwalMap[mapKey];
        if (!newVal) {
          if (existing) ops.push(API.remove('jadwalDinas', existing.id));
          continue;
        }
        if (existing) {
          if (existing.shift !== newVal) ops.push(API.update('jadwalDinas', existing.id, { pegawaiNama: p.nama, tanggal: key, shift: newVal, keterangan: '' }));
        } else {
          ops.push(API.create('jadwalDinas', { pegawaiNama: p.nama, tanggal: key, shift: newVal, keterangan: '' }));
        }
      }
    }
    await Promise.all(ops);
    await load();
    exitEdit();
  }

  load();

  return { enterEdit, exitEdit, save, reload: load };
}
