/**
 * Wrapper komunikasi ke Apps Script Web App.
 * GANTI BASE_URL dengan URL hasil "Deploy > New deployment > Web app".
 */
const API = (() => {
  const BASE_URL = 'https://script.google.com/macros/s/AKfycbyKIX5h8Rl1Ivo5_FMeK-5jc1i6PVjDV0ZXSXv9K6Z1JrFMFKH2D9UBTnvYW3wH64ptKg/exec';

  const getToken = () => localStorage.getItem('rail_token');
  const setToken = (t) => localStorage.setItem('rail_token', t);
  const clearToken = () => localStorage.removeItem('rail_token');
  const setUserInfo = (info) => localStorage.setItem('rail_user', JSON.stringify(info));
  const getUserInfo = () => JSON.parse(localStorage.getItem('rail_user') || '{}');

  async function post(action, payload = {}) {
    const body = JSON.stringify({ action, token: getToken(), ...payload });
    let res;
    try {
      res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body,
      });
    } catch (err) {
      return { ok: false, error: 'Tidak bisa terhubung ke server. Cek koneksi internet Anda.' };
    }
    // Apps Script kadang membalas HTML (bukan JSON) — mis. URL deployment salah,
    // deployment belum di-authorize ulang, atau kuota terlampaui. res.json()
    // langsung akan melempar error mentah dari browser kalau ini dibiarkan,
    // jadi di sini responsnya dibaca sebagai teks dulu lalu di-parse manual
    // supaya bisa ditampilkan pesan yang jelas ke pengguna.
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (err) {
      return { ok: false, error: 'Server tidak membalas dengan format yang benar. Kemungkinan URL API di js/api.js salah atau deployment Apps Script perlu di-update ulang (Deploy > Manage deployments > New version).' };
    }
  }

  async function login(username, password) {
    const result = await post('login', { username, password });
    if (result.ok) {
      setToken(result.token);
      setUserInfo({ username, nama: result.nama, role: result.role });
    }
    return result;
  }

  async function logout() {
    await post('logout', {});
    clearToken();
  }

  const checkSession = () => post('checkSession');
  const dashboardStats = () => post('dashboardStats');
  const getProfil = () => post('getProfil');
  const saveProfil = (data) => post('saveProfil', { data });

  // ---- Generic CRUD ----
  const list = (entity) => post('list', { entity });
  const create = (entity, data) => post('create', { entity, data });
  const update = (entity, id, data) => post('update', { entity, id, data });
  const remove = (entity, id) => post('remove', { entity, id });

  // ---- Users ----
  const listUsers = () => post('listUsers');
  const addUser = (data) => post('addUser', { data });
  const removeUser = (username) => post('removeUser', { username });

  // ---- File upload ----
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  async function uploadFile(file, folder) {
    const base64Data = await fileToBase64(file);
    return post('uploadFile', { filename: file.name, mimeType: file.type, base64Data, folder });
  }

  return {
    login, logout, checkSession, getToken, clearToken, getUserInfo,
    dashboardStats, getProfil, saveProfil,
    list, create, update, remove,
    listUsers, addUser, removeUser,
    uploadFile,
  };
})();

// Guard: redirect ke login kalau sesi tidak valid. Dipanggil di setiap halaman modul.
async function requireAuth() {
  if (!API.getToken()) {
    window.location.href = 'index.html';
    return null;
  }
  const check = await API.checkSession();
  if (!check.ok) {
    API.clearToken();
    window.location.href = 'index.html';
    return null;
  }
  return check;
}
