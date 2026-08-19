/**
 * Generic CRUD engine (tampilan card).
 * Tiap section menampilkan data secara read-only (tabel ringkas, tanpa aksi
 * per baris) dengan satu tombol "Edit Data" di kanan atas. Tombol itu membuka
 * modal pengelolaan (cari, tambah, edit, hapus) — jadi halaman utama tetap
 * ringkas tanpa daftar aksi memanjang ke bawah.
 * Dipakai berulang oleh semua modul (Pegawai, Perka, Administrasi, dst)
 * supaya tidak duplikasi kode.
 */
function mountCrudSection(containerId, entityKey, sectionTitle, opts = {}) {
  const cfg = ENTITY_CONFIG[entityKey];
  const container = document.getElementById(containerId);
  const title = sectionTitle || cfg.label;
  const compact = !!opts.compact;
  let allData = [];
  let editingId = null;
  let pendingFileUrl = '';
  let pendingFileId = '';

  const viewHtml = compact ? `
    <div class="info-card compact-card">
      <div class="compact-card-head">
        <h4>${title}</h4>
        <button class="btn-link" data-role="open-manage">Kelola</button>
      </div>
      <div class="mini-list" data-role="view-list"><div class="mini-empty">Memuat data...</div></div>
    </div>
  ` : `
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
  `;

  container.innerHTML = viewHtml + `
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
  const viewList = container.querySelector('[data-role="view-list"]');
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
    tbody.innerHTML = loadingRowManage;
    if (compact) viewList.innerHTML = `<div class="mini-empty">Memuat data...</div>`;
    else viewTbody.innerHTML = `<tr><td colspan="${cfg.tableColumns.length}" class="loading-text">Memuat data...</td></tr>`;

    const result = await API.list(entityKey);
    if (!result.ok) {
      tbody.innerHTML = `<tr><td colspan="${cfg.tableColumns.length + 1}" class="loading-text">Gagal memuat: ${escapeHtml(result.error)}</td></tr>`;
      if (compact) viewList.innerHTML = `<div class="mini-empty">Gagal memuat: ${escapeHtml(result.error)}</div>`;
      else viewTbody.innerHTML = `<tr><td colspan="${cfg.tableColumns.length}" class="loading-text">Gagal memuat: ${escapeHtml(result.error)}</td></tr>`;
      return;
    }
    allData = result.data;
    renderRows(allData);
    if (compact) renderViewList(allData);
    else renderViewRows(allData);
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

  function renderViewList(list) {
    if (list.length === 0) {
      viewList.innerHTML = `<div class="mini-empty">Belum ada data. Klik "Kelola" untuk mulai.</div>`;
      return;
    }
    const c = cfg.compact || {};
    viewList.innerHTML = list.map(row => {
      const primary = escapeHtml(formatCellValue(row[c.primary]));
      const badgeVal = c.badge ? row[c.badge] : null;
      const subVal = c.sub ? formatCellValue(row[c.sub]) : '';
      return `
        <div class="mini-item">
          <span class="mini-item-main">${primary}</span>
          <span class="mini-item-meta">
            ${badgeVal ? `<span class="badge badge-${badgeColor(badgeVal)}">${escapeHtml(badgeVal)}</span>` : ''}
            ${subVal ? `<span class="mini-item-sub">${escapeHtml(subVal)}</span>` : ''}
          </span>
        </div>
      `;
    }).join('');
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

/**
 * Kartu entitas dengan mode edit inline (tanpa modal). Dipakai untuk kartu
 * yang diedit bersamaan lewat satu tombol "Edit Data" di level halaman
 * (lihat profil-stasiun.html). Kartu ini TIDAK punya tombol sendiri —
 * dikontrol dari luar lewat objek yang dikembalikan: { enterEdit, exitEdit, save, reload }.
 * - enterEdit(): tampilkan baris-baris sebagai form (bisa diketik langsung di kartu).
 * - exitEdit(): batal, kembali ke tampilan baca tanpa menyimpan.
 * - save(): kirim semua perubahan (tambah/ubah/hapus baris) ke server, lalu reload.
 */
function mountInlineCard(containerId, entityKey, title) {
  const cfg = ENTITY_CONFIG[entityKey];
  const container = document.getElementById(containerId);
  let allData = [];     // data tersimpan di server (hasil load terakhir)
  let workingRows = []; // salinan yang sedang diedit di kartu

  container.innerHTML = `
    <div class="info-card compact-card">
      <div class="compact-card-head">
        <h4>${title}</h4>
      </div>
      <div class="mini-list" data-role="view-list"><div class="mini-empty">Memuat data...</div></div>
      <div class="edit-list" data-role="edit-list" style="display:none;"></div>
      <button type="button" class="btn-link add-row-btn" data-role="add-row" style="display:none;">+ Tambah Baris</button>
    </div>
  `;

  const viewList = container.querySelector('[data-role="view-list"]');
  const editList = container.querySelector('[data-role="edit-list"]');
  const addRowBtn = container.querySelector('[data-role="add-row"]');

  async function load() {
    viewList.innerHTML = `<div class="mini-empty">Memuat data...</div>`;
    const result = await API.list(entityKey);
    if (!result.ok) {
      allData = [];
      viewList.innerHTML = `<div class="mini-empty">Gagal memuat: ${escapeHtml(result.error)}</div>`;
      return;
    }
    allData = result.data;
    renderView();
  }

  function renderView() {
    if (allData.length === 0) {
      viewList.innerHTML = `<div class="mini-empty">Belum ada data.</div>`;
      return;
    }
    const c = cfg.compact || {};
    viewList.innerHTML = allData.map(row => {
      const primary = escapeHtml(formatCellValue(row[c.primary]));
      const badgeVal = c.badge ? row[c.badge] : null;
      const subVal = c.sub ? formatCellValue(row[c.sub]) : '';
      return `
        <div class="mini-item">
          <span class="mini-item-main">${primary}</span>
          <span class="mini-item-meta">
            ${badgeVal ? `<span class="badge badge-${badgeColor(badgeVal)}">${escapeHtml(badgeVal)}</span>` : ''}
            ${subVal ? `<span class="mini-item-sub">${escapeHtml(subVal)}</span>` : ''}
          </span>
        </div>
      `;
    }).join('');
  }

  function renderEditField(f, row, idx) {
    const id = `ef_${entityKey}_${idx}_${f.key}`;
    const val = row[f.key] !== undefined && row[f.key] !== null ? row[f.key] : '';
    if (f.type === 'select') {
      return `<div class="edit-field"><label for="${id}">${f.label}</label>
        <select id="${id}" data-idx="${idx}" data-field="${f.key}">
          ${f.options.map(o => `<option value="${o}" ${o === val ? 'selected' : ''}>${o}</option>`).join('')}
        </select></div>`;
    }
    const type = f.type === 'time' ? 'time' : f.type === 'date' ? 'date' : f.type === 'number' ? 'number' : 'text';
    const inputVal = f.type === 'date' ? formatDateForInput(val) : val;
    return `<div class="edit-field"><label for="${id}">${f.label}</label>
      <input type="${type}" id="${id}" data-idx="${idx}" data-field="${f.key}" value="${escapeAttr(inputVal)}"></div>`;
  }

  function renderEditList() {
    if (workingRows.length === 0) {
      editList.innerHTML = `<div class="mini-empty">Belum ada data. Klik "+ Tambah Baris" untuk mulai.</div>`;
      return;
    }
    editList.innerHTML = workingRows.map((row, idx) => `
      <div class="edit-row" data-idx="${idx}">
        <div class="edit-row-fields">${cfg.fields.map(f => renderEditField(f, row, idx)).join('')}</div>
        <button type="button" class="edit-row-remove" data-remove="${idx}" title="Hapus baris ini">&times;</button>
      </div>
    `).join('');

    editList.querySelectorAll('[data-field]').forEach(el => {
      const handler = (e) => {
        const idx = +e.target.dataset.idx;
        const field = e.target.dataset.field;
        workingRows[idx][field] = e.target.value;
      };
      el.addEventListener('input', handler);
      el.addEventListener('change', handler);
    });
    editList.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        workingRows.splice(+btn.dataset.remove, 1);
        renderEditList();
      });
    });
  }

  addRowBtn.addEventListener('click', () => {
    const emptyRow = {};
    cfg.fields.forEach(f => { emptyRow[f.key] = f.type === 'select' ? f.options[0] : ''; });
    workingRows.push(emptyRow);
    renderEditList();
  });

  function enterEdit() {
    workingRows = allData.map(r => ({ ...r }));
    viewList.style.display = 'none';
    editList.style.display = 'block';
    addRowBtn.style.display = 'inline-block';
    renderEditList();
  }

  function exitEdit() {
    viewList.style.display = 'block';
    editList.style.display = 'none';
    addRowBtn.style.display = 'none';
  }

  async function save() {
    const workingIds = new Set(workingRows.filter(r => r.id).map(r => r.id));
    const toDelete = allData.filter(r => !workingIds.has(r.id));
    for (const row of toDelete) {
      await API.remove(entityKey, row.id);
    }
    for (const row of workingRows) {
      const data = {};
      cfg.fields.forEach(f => { data[f.key] = (row[f.key] === undefined || row[f.key] === null) ? '' : row[f.key].toString().trim(); });
      if (row.id) await API.update(entityKey, row.id, data);
      else await API.create(entityKey, data);
    }
    await load();
    exitEdit();
  }

  load();

  return { enterEdit, exitEdit, save, reload: load };
}

/**
 * Kartu entitas berbentuk TABEL (bukan mini-list) dengan mode edit inline.
 * Sama seperti mountInlineCard, tapi tampilannya tabel penuh dengan kolom
 * sesuai cfg.tableColumns (mode baca) dan cfg.fields (mode edit, per sel).
 * Tidak punya tombol sendiri — dikontrol dari luar lewat wireEditToggle()
 * atau langsung lewat objek yang dikembalikan: { enterEdit, exitEdit, save, reload }.
 * opts.variant: 'card' (kartu kecil bertepi, default — untuk 2 kartu berdampingan)
 *               atau 'section' (lebar penuh dengan judul h3 — untuk tabel utama).
 */
function mountInlineTableCard(containerId, entityKey, title, opts = {}) {
  const cfg = ENTITY_CONFIG[entityKey];
  const container = document.getElementById(containerId);
  const variant = opts.variant || 'card';
  const colCount = cfg.tableColumns.length;
  let allData = [];
  let workingRows = [];

  const inner = `
    <div data-role="view-wrap">
      <table>
        <thead><tr>${cfg.tableColumns.map(c => `<th>${c.label}</th>`).join('')}</tr></thead>
        <tbody data-role="view-tbody"><tr><td colspan="${colCount}" class="loading-text">Memuat data...</td></tr></tbody>
      </table>
    </div>
    <div class="edit-table-wrap" data-role="edit-wrap" style="display:none;">
      <table>
        <thead><tr>${cfg.fields.map(f => `<th>${f.label}</th>`).join('')}<th></th></tr></thead>
        <tbody data-role="edit-tbody"></tbody>
      </table>
      <button type="button" class="btn-link add-row-btn" data-role="add-row">+ Tambah Baris</button>
    </div>
  `;

  container.innerHTML = variant === 'section' ? `
    <div class="section">
      <div class="section-head"><h3>${title}</h3></div>
      <div class="card-panel">${inner}</div>
    </div>
  ` : `
    <div class="info-card compact-card">
      <div class="compact-card-head"><h4>${title}</h4></div>
      ${inner}
    </div>
  `;

  const viewWrap = container.querySelector('[data-role="view-wrap"]');
  const viewTbody = container.querySelector('[data-role="view-tbody"]');
  const editWrap = container.querySelector('[data-role="edit-wrap"]');
  const editTbody = container.querySelector('[data-role="edit-tbody"]');
  const addRowBtn = container.querySelector('[data-role="add-row"]');

  function renderCellLocal(c, row) {
    const val = row[c.key];
    if (c.isPhoto) return `<td><img class="avatar" src="${row.fotoUrl || placeholderAvatar()}" alt=""></td>`;
    if (c.isDate) return `<td>${escapeHtml(formatDateShort(val))}</td>`;
    if (c.isBadge && val) return `<td><span class="badge badge-${badgeColor(val)}">${escapeHtml(val)}</span></td>`;
    return `<td>${escapeHtml(formatCellValue(val))}</td>`;
  }

  async function load() {
    viewTbody.innerHTML = `<tr><td colspan="${colCount}" class="loading-text">Memuat data...</td></tr>`;
    const result = await API.list(entityKey);
    if (!result.ok) {
      allData = [];
      viewTbody.innerHTML = `<tr><td colspan="${colCount}" class="loading-text">Gagal memuat: ${escapeHtml(result.error)}</td></tr>`;
      return;
    }
    allData = result.data;
    renderView();
  }

  function renderView() {
    if (allData.length === 0) {
      viewTbody.innerHTML = `<tr><td colspan="${colCount}"><div class="empty-state">Belum ada data.</div></td></tr>`;
      return;
    }
    viewTbody.innerHTML = allData.map(row => `<tr>${cfg.tableColumns.map(c => renderCellLocal(c, row)).join('')}</tr>`).join('');
  }

  function renderEditCell(f, row, idx) {
    const val = row[f.key] !== undefined && row[f.key] !== null ? row[f.key] : '';
    const id = `it_${entityKey}_${idx}_${f.key}`;
    if (f.type === 'select') {
      return `<td><select id="${id}" data-idx="${idx}" data-field="${f.key}">
        ${f.options.map(o => `<option value="${o}" ${o === val ? 'selected' : ''}>${o}</option>`).join('')}
      </select></td>`;
    }
    const type = f.type === 'time' ? 'time' : f.type === 'date' ? 'date' : f.type === 'number' ? 'number' : 'text';
    const inputVal = f.type === 'date' ? formatDateForInput(val) : val;
    return `<td><input type="${type}" id="${id}" data-idx="${idx}" data-field="${f.key}" value="${escapeAttr(inputVal)}"></td>`;
  }

  function renderEditTable() {
    if (workingRows.length === 0) {
      editTbody.innerHTML = `<tr><td colspan="${cfg.fields.length + 1}"><div class="empty-state">Belum ada data. Klik "+ Tambah Baris" untuk mulai.</div></td></tr>`;
      return;
    }
    editTbody.innerHTML = workingRows.map((row, idx) => `
      <tr data-idx="${idx}">
        ${cfg.fields.map(f => renderEditCell(f, row, idx)).join('')}
        <td><button type="button" class="edit-row-remove" data-remove="${idx}" title="Hapus baris ini">&times;</button></td>
      </tr>
    `).join('');

    editTbody.querySelectorAll('[data-field]').forEach(el => {
      const handler = (e) => {
        const idx = +e.target.dataset.idx;
        const field = e.target.dataset.field;
        workingRows[idx][field] = e.target.value;
      };
      el.addEventListener('input', handler);
      el.addEventListener('change', handler);
    });
    editTbody.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        workingRows.splice(+btn.dataset.remove, 1);
        renderEditTable();
      });
    });
  }

  addRowBtn.addEventListener('click', () => {
    const emptyRow = {};
    cfg.fields.forEach(f => { emptyRow[f.key] = f.type === 'select' ? f.options[0] : ''; });
    workingRows.push(emptyRow);
    renderEditTable();
  });

  function enterEdit() {
    workingRows = allData.map(r => ({ ...r }));
    viewWrap.style.display = 'none';
    editWrap.style.display = 'block';
    renderEditTable();
  }

  function exitEdit() {
    viewWrap.style.display = 'block';
    editWrap.style.display = 'none';
  }

  async function save() {
    const workingIds = new Set(workingRows.filter(r => r.id).map(r => r.id));
    const toDelete = allData.filter(r => !workingIds.has(r.id));
    for (const row of toDelete) await API.remove(entityKey, row.id);
    for (const row of workingRows) {
      const data = {};
      cfg.fields.forEach(f => { data[f.key] = (row[f.key] === undefined || row[f.key] === null) ? '' : row[f.key].toString().trim(); });
      if (row.id) await API.update(entityKey, row.id, data);
      else await API.create(entityKey, data);
    }
    await load();
    exitEdit();
  }

  load();

  return { enterEdit, exitEdit, save, reload: load };
}

/**
 * Menghubungkan satu set tombol "Edit Data" / "Batal" ke satu atau beberapa
 * kartu (hasil mountInlineCard / mountInlineTableCard / mountJadwalDinasMatrix).
 * Klik pertama: semua kartu masuk mode edit. Klik kedua (tombol jadi "Simpan"):
 * semua kartu disimpan bersamaan. Cocok untuk sub-menu yang punya 1-2 tabel
 * tapi hanya 1 tombol Edit Data di judul section.
 */
function wireEditToggle(editBtnId, cancelBtnId, errId, cards) {
  const editBtn = document.getElementById(editBtnId);
  const cancelBtn = document.getElementById(cancelBtnId);
  const errEl = errId ? document.getElementById(errId) : null;
  let editing = false;

  editBtn.addEventListener('click', async () => {
    if (!editing) {
      cards.forEach(c => c.enterEdit());
      editing = true;
      editBtn.textContent = 'Simpan';
      if (cancelBtn) cancelBtn.style.display = 'inline-flex';
      if (errEl) errEl.classList.remove('show');
      return;
    }
    editBtn.disabled = true;
    editBtn.textContent = 'Menyimpan...';
    try {
      await Promise.all(cards.map(c => c.save()));
      editing = false;
      editBtn.textContent = 'Edit Data';
      if (cancelBtn) cancelBtn.style.display = 'none';
    } catch (err) {
      if (errEl) { errEl.textContent = err.message; errEl.classList.add('show'); }
      editBtn.textContent = 'Simpan';
    } finally {
      editBtn.disabled = false;
    }
  });

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      cards.forEach(c => c.exitEdit());
      editing = false;
      editBtn.textContent = 'Edit Data';
      cancelBtn.style.display = 'none';
    });
  }
}

// ---------- Helpers ----------
function escapeHtml(str) {
  if (str === undefined || str === null) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escapeAttr(str) {
  if (str === undefined || str === null) return '';
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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
function formatDateShort(value) {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d)) return String(value);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
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
