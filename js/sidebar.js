function renderSidebar(activePage) {
  const menuHtml = MENU.map(m => `
    <a href="${m.href}" class="${m.page === activePage ? 'active' : ''}">
      <span class="icon">${m.icon}</span><span class="label-text">${m.label}</span>
    </a>
  `).join('');

  return `
    <aside class="sidebar">
      <div class="brand">
        <div class="mark">RS</div>
        <span>RailStatiON</span>
      </div>
      <nav>${menuHtml}</nav>
      <div class="bottom">
        <button id="logoutBtn"><span class="icon">&#8630;</span><span class="label-text">Keluar</span></button>
      </div>
    </aside>
  `;
}

function renderTopbar(title, sub) {
  const user = API.getUserInfo();
  const initial = (user.nama || user.username || '?').charAt(0).toUpperCase();
  return `
    <div class="topbar">
      <div>
        <h1>${title}</h1>
        <div class="sub">${sub || ''}</div>
      </div>
      <div class="user-chip">
        <div class="avatar-circle">${initial}</div>
        <div class="who">${user.nama || user.username || ''}<small>${user.role || ''}</small></div>
      </div>
    </div>
  `;
}

async function initPage(activePage, title, sub) {
  // Guard cepat: kalau tidak ada token sama sekali, langsung tendang ke login
  // tanpa menunggu network — tidak ada yang perlu dirender.
  if (!API.getToken()) {
    window.location.href = 'index.html';
    return null;
  }

  // Render sidebar & topbar SEGERA dari data sesi lokal (localStorage), tanpa
  // menunggu round-trip ke server. Ini menghilangkan efek "flash" saat pindah
  // halaman, karena sidebar tidak lagi menunggu jaringan sebelum muncul.
  document.getElementById('sidebarMount').innerHTML = renderSidebar(activePage);
  document.getElementById('topbarMount').innerHTML = renderTopbar(title, sub);

  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await API.logout();
    window.location.href = 'index.html';
  });

  // Validasi sesi ke server berjalan di belakang layar. Kalau ternyata token
  // sudah tidak valid (expired / logout dari perangkat lain), baru redirect.
  API.checkSession().then((check) => {
    if (!check.ok) {
      API.clearToken();
      window.location.href = 'index.html';
    }
  }).catch(() => {
    // Kegagalan jaringan sesaat tidak langsung melempar user ke login;
    // biarkan mereka tetap bekerja, request API lain akan menangani jika
    // token benar-benar tidak valid.
  });

  return { ok: true };
}
