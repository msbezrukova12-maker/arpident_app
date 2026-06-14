const API_BASE = '';
let ADMIN_BOOKINGS = [];
let ADMIN_DOCTORS = [];
let ADMIN_REVIEWS = [];
async function apiRequest(url, options = {}) {
  const response = await fetch(API_BASE + url, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options });
  let data = null;
  try { data = await response.json(); } catch (_) {}
  if (!response.ok) throw new Error((data && data.error) || 'Ошибка сервера');
  return data;
}
function showToast(msg, type = 'success') {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.className = `toast toast--${type}`; t.textContent = msg;
  setTimeout(() => t.classList.add('show'), 10); setTimeout(() => t.classList.remove('show'), 3000);
}
function formatDate(dateStr) { if (!dateStr) return '—'; const [y,m,d] = dateStr.split('-'); return `${d}.${m}.${y}`; }
function statusLabel(status) { return ({new:'Новая', confirmed:'Подтверждена', cancelled:'Отменена', done:'Завершена'}[status] || 'Новая'); }
async function adminLogin() {
  try {
    await apiRequest('/api/admin/login', { method: 'POST', body: JSON.stringify({ login: document.getElementById('admin-login-input').value.trim(), password: document.getElementById('admin-password-input').value.trim() }) });
    document.getElementById('admin-login-box').classList.add('hidden');
    document.getElementById('admin-panel-box').classList.remove('hidden');
    await loadAdminData();
    showToast('Вход выполнен', 'success');
  } catch (e) { showToast(e.message || 'Не удалось войти', 'error'); }
}
async function loadAdminData() {
  [ADMIN_BOOKINGS, ADMIN_DOCTORS, ADMIN_REVIEWS] = await Promise.all([apiRequest('/api/bookings'), apiRequest('/api/doctors'), apiRequest('/api/reviews')]);
  renderAdmin();
}
function renderAdmin() {
  const today = new Date().toISOString().slice(0,10);
  const active = ADMIN_BOOKINGS.filter(b => b.status === 'new' || b.status === 'confirmed');
  const avg = ADMIN_REVIEWS.length ? (ADMIN_REVIEWS.reduce((s,r)=>s+Number(r.rating||0),0)/ADMIN_REVIEWS.length).toFixed(1) : '0.0';
  document.getElementById('admin-panel-box').innerHTML = `
    <div class="admin-stats">
      <div class="admin-stat"><div class="admin-stat__val">${ADMIN_BOOKINGS.length}</div><div class="admin-stat__label">Всего записей</div></div>
      <div class="admin-stat"><div class="admin-stat__val">${ADMIN_BOOKINGS.filter(b=>b.date===today).length}</div><div class="admin-stat__label">Сегодня</div></div>
      <div class="admin-stat"><div class="admin-stat__val">${active.length}</div><div class="admin-stat__label">Активных</div></div>
      <div class="admin-stat"><div class="admin-stat__val">${avg}</div><div class="admin-stat__label">Средний рейтинг</div></div>
    </div>
    <div class="admin-table">
      <div class="admin-table-header cols-bookings"><div>Пациент</div><div>Дата</div><div>Врач</div><div>Услуга</div><div>Статус</div><div>Действия</div></div>
      ${ADMIN_BOOKINGS.length ? ADMIN_BOOKINGS.map(b => `
        <div class="admin-table-row cols-bookings">
          <div><strong>${b.name}</strong><br><small>${b.phone || ''}</small></div>
          <div>${formatDate(b.date)}<br><strong>${b.time}</strong></div>
          <div>${b.doctorName || '—'}</div><div>${b.service || '—'}</div>
          <div><span class="booking-item__status status--${b.status}">${statusLabel(b.status)}</span></div>
          <div class="admin-actions"><button class="btn btn--sm btn--outline" onclick="setStatus(${b.id},'confirmed')">Подтв.</button><button class="btn btn--sm btn--ghost" onclick="setStatus(${b.id},'done')">Заверш.</button><button class="btn btn--sm btn--danger" onclick="setStatus(${b.id},'cancelled')">Отм.</button></div>
        </div>`).join('') : '<div class="empty-state"><h3>Записей пока нет</h3></div>'}
    </div>`;
}
async function setStatus(id, status) {
  try { await apiRequest(`/api/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }); await loadAdminData(); showToast('Статус обновлён', 'success'); }
  catch(e) { showToast(e.message || 'Не удалось обновить статус', 'error'); }
}
