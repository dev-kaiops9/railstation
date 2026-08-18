/**
 * Generic CRUD engine (tampilan card).
 * Tiap section menampilkan data secara read-only (tabel ringkas, tanpa aksi
 * per baris) dengan satu tombol "Edit Data" di kanan atas. Tombol itu membuka
 * modal pengelolaan (cari, tambah, edit, hapus) — jadi halaman utama tetap
 * ringkas tanpa daftar aksi memanjang ke bawah.
 * Dipakai berulang oleh semua modul (Pegawai, Perka, Administrasi, dst)
 * supaya tidak duplikasi kode.
 */
function mountCrudSection(containerId, entityKey, sectionTitle) {
  const cfg = ENTITY_CONFIG[entityKey];
  const container = document.getElementById(containerId);
  const title = sectionTitle || cfg.label;
  let allData = [];
  let editingId = null;
  let pendingFileUrl = '';
  let pendingFileId = '';

  container.innerHTML = `
    <div class="section">
      <div class="section-head">
        <h3>${title}</h3>
        <button class="btn btn-primary btn-sm" data-role="open-manage">Edit Data</button>
      </div>
      <div class="card-panel">
        <table>
          <thead><tr>${cfg.tableColumns.map(c => `<th>${c.label}</th>`).join('')}</tr></thead>
          <tbody data-role="view-tbody"><tr><td colspan="${cfg.tableColumns.length}" class="loading-text">Memuat data...</td></tr></tbody>
        </table>
      </div>
    </div>

    <div class="modal-backdrop manage-backdrop" data-role="manage-backdrop">
      <div class="modal manage-modal">
        <div class="modal-head">
          <h3>Kelola ${title}</h3>
          <button class="modal-close" data-role="manage-close" aria-label="Tutup">&times;</button>
        </div>
        <div class="toolbar">
          <input type="search" placeholder="Cari ${cfg.labelSingular.toLowerCase()}..." data-role="search">
          <button class="btn btn-primary" data-role="add">+ Tambah ${cfg.labelSingular}</button>
        </div>
        <div class="card-panel">
          <table>
            <thead><tr>${cfg.tableColumns.map(c => `<th>${c.label}</th>`).join('')}<th></th></tr></thead>
            <tbody data-role="manage-tbody"><tr><td colspan="${cfg.tableColumns.length + 1}" class="loading-text">Memuat data...</td></tr></tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="modal-backdrop" data-role="modal-backdrop">
      <div class="modal">
        <h3 data-role="modal-title">Tambah ${cfg.labelSingular}</h3>
        <div class="error-msg" data-role="modal-error"></div>
        <img data-role="foto-preview" class="foto-preview" style="display:none;">
        <form data-role="form">
          ${cfg.hasFoto ? `<div class="field"><label>Foto</label><input type="file" accept="image/*" data-role="foto-input"></div>` : ''}
          ${cfg.fileField ? `<div class="field"><label>File / Lampiran ${cfg.fileRequired ? '(wajib)' : ''}</label><input type="file" data-role="file-input"><div data-role="file-current" style="font-size:12px;margin-top:4px;color:var(--text-muted);"></div></div>` : ''}
          <div class="grid-2">
            ${cfg.fields.map(f => renderFieldInput(f)).join('')}
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" data-role="cancel">Batal</button>
            <button type="submit" class="btn btn-primary" data-role="save">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  `;

  const viewTbody = container.querySelector('[data-role="view-tbody"]');
  const tbody = container.querySelector('[data-role="manage-tbody"]');
  const manageBackdrop = container.querySelector('[data-role="manage-backdrop"]');
  const modalBackdrop = container.querySelector('[data-role="modal-backdrop"]');
  const modalError = container.querySelector('[data-role="modal-error"]');
  const modalTitle = container.querySelector('[data-role="modal-title"]');
  const fotoPreview = container.querySelector('[data-role="foto-preview"]');
  const form = container.querySelector('[data-role="form"]');

  function renderFieldInput(f) {
    const id = `f_${entityKey}_${f.key}`;
    if (f.type === 'select') {
      return `<div class="field"><label for="${id}">${f.label}</label>
        <select id="${id}" data-field="${f.key}">${f.options.map(o => `<option value="${o}">${o}</option>`).join('')}</select></div>`;
    }
    const type = f.type === 'time' ? 'time' : f.type === 'date' ? 'date' : f.type === 'number' ? 'number' : 'text';
    return `<div class="field"><label for="${id}">${f.label}</label>
      <input type="${type}" id="${id}" data-field="${f.key}" ${f.required ? 'required' : ''}></div>`;
  }

  function getFieldEl(key) { return form.querySelector(`[data-field="${key}"]`); }

  async function load() {
    const loadingRowManage = `<tr><td colspan="${cfg.tableColumns.length + 1}" class="loading-text">Memuat data...</td></tr>`;
    const loadingRowView = `<tr><td colspan="${cfg.tableColumns.length}" class="loading-text">Memuat data...</td></tr>`;
    tbody.innerHTML = loadingRowManage;
    viewTbody.innerHTML = loadingRowView;
    const result = await API.list(entityKey);
    if (!result.ok) {
      tbody.innerHTML = `<tr><td colspan="${cfg.tableColumns.length + 1}" class="loading-text">Gagal memuat: ${escapeHtml(result.error)}</td></tr>`;
      viewTbody.innerHTML = `<tr><td colspan="${cfg.tableColumns.length}" class="loading-text">Gagal memuat: ${escapeHtml(result.error)}</td></tr>`;
      return;
    }
    allData = result.data;
    renderRows(allData);
    renderViewRows(allData);
  }

  function renderRows(list) {
    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="${cfg.tableColumns.length + 1}"><div class="empty-state">Belum ada data. Klik "+ Tambah ${cfg.labelSingular}" untuk mulai.</div></td></tr>`;
      return;
    }
    tbody.innerHTML = list.map(row => `
      <tr>
        ${cfg.tableColumns.map(c => renderCell(c, row)).join('')}
        <td>
          <div class="row-actions">
            <button data-edit="${row.id}">Edit</button>
            <button class="danger" data-delete="${row.id}">Hapus</button>
          </div>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-edit]').forEach(btn => btn.addEventListener('click', () => openEdit(btn.dataset.edit)));
    tbody.querySelectorAll('[data-delete]').forEach(btn => btn.addEventListener('click', () => handleDelete(btn.dataset.delete)));
  }

  function renderViewRows(list) {
    if (list.length === 0) {
      viewTbody.innerHTML = `<tr><td colspan="${cfg.tableColumns.length}"><div class="empty-state">Belum ada data. Klik "Edit Data" untuk mulai.</div></td></tr>`;
      return;
    }
    viewTbody.innerHTML = list.map(row => `<tr>${cfg.tableColumns.map(c => renderCell(c, row)).join('')}</tr>`).join('');
  }

  function renderCell(c, row) {
    if (c.isPhoto) return `<td><img class="avatar" src="${row.fotoUrl || placeholderAvatar()}" alt=""></td>`;
    if (c.isFile) return `<td>${row[c.key] ? `<a class="file-link" href="${row[c.key]}" target="_blank">Lihat File</a>` : '—'}</td>`;
    const val = row[c.key];
    if (c.isBadge && val) return `<td><span class="badge badge-${badgeColor(val)}">${escapeHtml(val)}</span></td>`;
    return `<td>${escapeHtml(formatCellValue(val))}</td>`;
  }

  function openAdd() {
    editingId = null;
    pendingFileUrl = ''; pendingFileId = '';
    modalTitle.textContent = `Tambah ${cfg.labelSingular}`;
    form.reset();
    fotoPreview.style.display = 'none';
    modalError.classList.remove('show');
    const fc = container.querySelector('[data-role="file-current"]');
    if (fc) fc.textContent = '';
    modalBackdrop.classList.add('show');
  }

  function openEdit(id) {
    const row = allData.find(r => r.id === id);
    if (!row) return;
    editingId = id;
    pendingFileUrl = row[cfg.fileField] || ''; pendingFileId = row[cfg.fileIdField] || '';
    modalTitle.textContent = `Edit ${cfg.labelSingular}`;
    cfg.fields.forEach(f => {
      const el = getFieldEl(f.key);
      if (el) el.value = f.type === 'date' ? formatDateForInput(row[f.key]) : (row[f.key] || '');
    });
    if (cfg.hasFoto) {
      if (row.fotoUrl) { fotoPreview.src = row.fotoUrl; fotoPreview.style.display = 'block'; }
      else fotoPreview.style.display = 'none';
    }
    const fc = container.querySelector('[data-role="file-current"]');
    if (fc) fc.textContent = pendingFileUrl ? 'File saat ini tersimpan — upload baru untuk mengganti.' : '';
    modalError.classList.remove('show');
    modalBackdrop.classList.add('show');
  }

  function closeModal() { modalBackdrop.classList.remove('show'); }
  function openManage() { manageBackdrop.classList.add('show'); }
  function closeManage() { manageBackdrop.classList.remove('show'); }

  async function handleDelete(id) {
    const row = allData.find(r => r.id === id);
    const label = row ? (row.nama || row.judul || row.nomorKA || row.aktivitas || row.jenisGangguan || cfg.labelSingular) : cfg.labelSingular;
    if (!confirm(`Hapus "${label}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    const result = await API.remove(entityKey, id);
    if (!result.ok) { alert('Gagal menghapus: ' + result.error); return; }
    await load();
  }

  container.querySelector('[data-role="open-manage"]').addEventListener('click', openManage);
  container.querySelector('[data-role="manage-close"]').addEventListener('click', closeManage);
  manageBackdrop.addEventListener('click', (e) => { if (e.target === manageBackdrop) closeManage(); });

  container.querySelector('[data-role="add"]').addEventListener('click', openAdd);
  container.querySelector('[data-role="cancel"]').addEventListener('click', closeModal);

  const fotoInput = container.querySelector('[data-role="foto-input"]');
  if (fotoInput) {
    fotoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => { fotoPreview.src = reader.result; fotoPreview.style.display = 'block'; };
      reader.readAsDataURL(file);
    });
  }

  container.querySelector('[data-role="search"]').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = allData.filter(row => cfg.searchKeys.some(k => String(row[k] || '').toLowerCase().includes(q)));
    renderRows(filtered);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = container.querySelector('[data-role="save"]');
    saveBtn.disabled = true; saveBtn.textContent = 'Menyimpan...';
    modalError.classList.remove('show');

    try {
      const data = {};
      cfg.fields.forEach(f => { data[f.key] = getFieldEl(f.key).value.trim(); });

      if (cfg.hasFoto) {
        const file = fotoInput.files[0];
        if (file) {
          const up = await API.uploadFile(file, 'Foto Pegawai');
          if (!up.ok) throw new Error(up.error || 'Gagal upload foto');
          data.fotoUrl = up.data.url; data.fotoFileId = up.data.fileId;
        } else {
          data.fotoUrl = pendingFileUrl || undefined;
        }
      }

      if (cfg.fileField) {
        const fInput = container.querySelector('[data-role="file-input"]');
        const file = fInput.files[0];
        if (file) {
          const up = await API.uploadFile(file, cfg.fileFolder);
          if (!up.ok) throw new Error(up.error || 'Gagal upload file');
          data[cfg.fileField] = up.data.url; data[cfg.fileIdField] = up.data.fileId;
        } else {
          if (cfg.fileRequired && !pendingFileUrl && !editingId) throw new Error('File wajib diunggah');
          data[cfg.fileField] = pendingFileUrl;
          data[cfg.fileIdField] = pendingFileId;
        }
      }

      const result = editingId ? await API.update(entityKey, editingId, data) : await API.create(entityKey, data);
      if (!result.ok) throw new Error(result.error || 'Gagal menyimpan data');

      closeModal();
      await load();
    } catch (err) {
      modalError.textContent = err.message;
      modalError.classList.add('show');
    } finally {
      saveBtn.disabled = false; saveBtn.textContent = 'Simpan';
    }
  });

  load();
}

// ---------- Helpers ----------
function escapeHtml(str) {
  if (str === undefined || str === null) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function formatCellValue(val) {
  if (val === undefined || val === null) return '';
  if (val instanceof Date) return val.toLocaleDateString('id-ID');
  const asDate = typeof val === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(val) ? new Date(val) : null;
  if (asDate && !isNaN(asDate)) return asDate.toLocaleDateString('id-ID');
  return val;
}
function formatDateForInput(value) {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d)) return '';
  return d.toISOString().split('T')[0];
}
function placeholderAvatar() {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="%23ECEDF3"/></svg>');
}

// ---------- Tab switcher (untuk halaman modul dengan beberapa entitas) ----------
function initTabs(tabsContainerId) {
  const tabsEl = document.getElementById(tabsContainerId);
  const buttons = tabsEl.querySelectorAll('.tab-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.target).classList.add('active');
    });
  });
}
