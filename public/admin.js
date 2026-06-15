const API_BASE = '';
let BOOKINGS = [];
let DOCTORS = [];
let REVIEWS = [];
let currentTab = 'bookings';
let filters = { search: '', status: '', date: '' };

async function apiRequest(url, options = {}) {
  const response = await fetch(API_BASE + url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  let data = null;
  try { data = await response.json(); } catch (_) {}
  if (!response.ok) throw new Error((data && data.error) || 'Ошибка сервера');
  return data;
}

function showToast(message, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.className = `toast ${type === 'error' ? 'error' : ''}`;
  toast.textContent = message;
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => toast.classList.remove('show'), 3200);
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatDate(dateStr) {
  if (!dateStr || !String(dateStr).includes('-')) return '—';
  const [y, m, d] = String(dateStr).split('-');
  return `${d}.${m}.${y}`;
}

function statusLabel(status) {
  return ({
    new: 'Новая',
    confirmed: 'Подтверждена',
    cancelled: 'Отменена',
    done: 'Завершена'
  }[status] || 'Новая');
}

function statusClass(status) {
  return ({
    new: 'status-new',
    confirmed: 'status-confirmed',
    cancelled: 'status-cancelled',
    done: 'status-done'
  }[status] || 'status-new');
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function getBookingPatient(booking) {
  return booking.name || booking.patient_name || booking.patientName || 'Пациент';
}

function getBookingDoctor(booking) {
  return booking.doctorName || booking.doctor_name || booking.doctor || '—';
}

function getBookingService(booking) {
  return booking.service || booking.serviceName || booking.service_name || '—';
}

async function adminLogin() {
  const login = document.getElementById('adminLoginInput').value.trim();
  const password = document.getElementById('adminPasswordInput').value.trim();
  try {
    await apiRequest('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ login, password })
    });
    sessionStorage.setItem('arpidentAdmin', '1');
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('adminApp').classList.remove('hidden');
    await loadAdminData();
    showToast('Вход выполнен');
  } catch (error) {
    showToast(error.message || 'Не удалось войти', 'error');
  }
}

function logoutAdmin() {
  sessionStorage.removeItem('arpidentAdmin');
  document.getElementById('adminApp').classList.add('hidden');
  document.getElementById('loginPage').classList.remove('hidden');
}

async function loadAdminData() {
  try {
    const [bookings, doctors, reviews] = await Promise.all([
      apiRequest('/api/bookings'),
      apiRequest('/api/doctors'),
      apiRequest('/api/reviews')
    ]);
    BOOKINGS = Array.isArray(bookings) ? bookings : [];
    DOCTORS = Array.isArray(doctors) ? doctors : [];
    REVIEWS = Array.isArray(reviews) ? reviews : [];
    renderStats();
    renderTab();
  } catch (error) {
    showToast(error.message || 'Не удалось загрузить данные', 'error');
  }
}

function renderStats() {
  const today = todayISO();
  const active = BOOKINGS.filter(item => item.status === 'new' || item.status === 'confirmed');
  const newCount = BOOKINGS.filter(item => item.status === 'new').length;
  const todayCount = BOOKINGS.filter(item => item.date === today).length;
  const avgRating = REVIEWS.length
    ? (REVIEWS.reduce((sum, item) => sum + Number(item.rating || 0), 0) / REVIEWS.length).toFixed(1)
    : '0.0';

  document.getElementById('statsGrid').innerHTML = `
    <article class="stat-card accent"><span>Всего записей</span><b>${BOOKINGS.length}</b><small>за всё время</small></article>
    <article class="stat-card"><span>Новые заявки</span><b>${newCount}</b><small>требуют обработки</small></article>
    <article class="stat-card"><span>Записи сегодня</span><b>${todayCount}</b><small>${formatDate(today)}</small></article>
    <article class="stat-card"><span>Рейтинг</span><b>${avgRating}</b><small>${REVIEWS.length} отзывов</small></article>
  `;
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.admin-nav button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  const titles = {
    bookings: 'Заявки пациентов и оперативное управление статусами записей.',
    doctors: 'Список специалистов клиники и основные показатели.',
    reviews: 'Отзывы пациентов, оценки и обратная связь.'
  };
  document.getElementById('adminSubtext').textContent = titles[tab] || titles.bookings;
  renderTab();
}

function renderTab() {
  if (currentTab === 'doctors') return renderDoctorsTab();
  if (currentTab === 'reviews') return renderReviewsTab();
  return renderBookingsTab();
}

function filteredBookings() {
  return BOOKINGS.filter(booking => {
    const search = filters.search.toLowerCase();
    const haystack = [
      getBookingPatient(booking), booking.phone, booking.email,
      getBookingDoctor(booking), getBookingService(booking), booking.comment
    ].join(' ').toLowerCase();
    const bySearch = !search || haystack.includes(search);
    const byStatus = !filters.status || booking.status === filters.status;
    const byDate = !filters.date || booking.date === filters.date;
    return bySearch && byStatus && byDate;
  });
}

function renderBookingsTab() {
  const rows = filteredBookings();
  document.getElementById('tabContent').innerHTML = `
    <section class="panel">
      <div class="panel-head">
        <div><h2>Записи пациентов</h2><p>Можно подтвердить, завершить или отменить запись.</p></div>
        <button class="refresh-btn" onclick="loadAdminData()">Обновить список</button>
      </div>
      <div class="filters">
        <input id="bookingSearch" placeholder="Поиск: пациент, врач, услуга, телефон" value="${escapeHtml(filters.search)}" oninput="updateBookingFilter('search', this.value)">
        <select id="bookingStatus" onchange="updateBookingFilter('status', this.value)">
          <option value="">Все статусы</option>
          <option value="new" ${filters.status === 'new' ? 'selected' : ''}>Новые</option>
          <option value="confirmed" ${filters.status === 'confirmed' ? 'selected' : ''}>Подтверждённые</option>
          <option value="done" ${filters.status === 'done' ? 'selected' : ''}>Завершённые</option>
          <option value="cancelled" ${filters.status === 'cancelled' ? 'selected' : ''}>Отменённые</option>
        </select>
        <input type="date" value="${escapeHtml(filters.date)}" onchange="updateBookingFilter('date', this.value)">
      </div>
      ${rows.length ? `
        <div class="table-wrap">
          <table class="admin-table">
            <thead><tr><th>Пациент</th><th>Дата и время</th><th>Врач</th><th>Услуга</th><th>Статус</th><th>Действия</th></tr></thead>
            <tbody>${rows.map(renderBookingRow).join('')}</tbody>
          </table>
        </div>` : '<div class="empty">По выбранным условиям записей нет.</div>'}
    </section>
  `;
}

function updateBookingFilter(key, value) {
  filters[key] = value;
  renderBookingsTab();
}

function renderBookingRow(booking) {
  return `
    <tr>
      <td class="patient">
        <b>${escapeHtml(getBookingPatient(booking))}</b>
        <span>${escapeHtml(booking.phone || 'телефон не указан')}</span>
        ${booking.email ? `<span>${escapeHtml(booking.email)}</span>` : ''}
      </td>
      <td class="date-cell"><span>${formatDate(booking.date)}</span><br><b>${escapeHtml(booking.time || '—')}</b></td>
      <td class="doctor-cell"><b>${escapeHtml(getBookingDoctor(booking))}</b><span>${escapeHtml(booking.doctorSpec || '')}</span></td>
      <td class="service-cell"><b>${escapeHtml(getBookingService(booking))}</b>${booking.servicePrice ? `<span>${escapeHtml(booking.servicePrice)}</span>` : ''}</td>
      <td><span class="status ${statusClass(booking.status)}">${statusLabel(booking.status)}</span></td>
      <td>
        <div class="row-actions">
          <button class="mini-btn confirm" onclick="setStatus(${booking.id}, 'confirmed')">Подтвердить</button>
          <button class="mini-btn done" onclick="setStatus(${booking.id}, 'done')">Завершить</button>
          <button class="mini-btn cancel" onclick="setStatus(${booking.id}, 'cancelled')">Отменить</button>
        </div>
      </td>
    </tr>
  `;
}

function renderDoctorsTab() {
  document.getElementById('tabContent').innerHTML = `
    <section class="panel">
      <div class="panel-head"><div><h2>Врачи клиники</h2><p>Карточки специалистов, которые используются на сайте.</p></div></div>
      <div class="cards-grid">
        ${DOCTORS.map(doctor => `
          <article class="doctor-admin-card">
            <b>${escapeHtml(doctor.name)}</b>
            <p>${escapeHtml(doctor.spec || doctor.specialization || 'Специалист')}</p>
            <div class="pill-row">
              <span class="pill">★ ${escapeHtml(doctor.rating || '—')}</span>
              <span class="pill">Стаж ${escapeHtml(doctor.exp || doctor.experience || '—')} лет</span>
              <span class="pill">${escapeHtml((doctor.reviews || doctor.reviews_count || 0))} отзывов</span>
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderReviewsTab() {
  document.getElementById('tabContent').innerHTML = `
    <section class="panel">
      <div class="panel-head"><div><h2>Отзывы пациентов</h2><p>Последние оценки, которые видны в публичном разделе отзывов.</p></div></div>
      <div class="cards-grid">
        ${REVIEWS.length ? REVIEWS.map(review => `
          <article class="review-admin-card">
            <div class="review-stars">${'★'.repeat(Number(review.rating || 0))}${'☆'.repeat(5 - Number(review.rating || 0))}</div>
            <p>${escapeHtml(review.text || '')}</p>
            <div class="pill-row">
              <span class="pill">${escapeHtml(review.name || 'Пациент')}</span>
              ${review.doctor ? `<span class="pill">${escapeHtml(review.doctor)}</span>` : ''}
              ${review.service ? `<span class="pill">${escapeHtml(review.service)}</span>` : ''}
            </div>
          </article>
        `).join('') : '<div class="empty">Отзывов пока нет.</div>'}
      </div>
    </section>
  `;
}

async function setStatus(id, status) {
  try {
    await apiRequest(`/api/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    await loadAdminData();
    showToast('Статус обновлён');
  } catch (error) {
    showToast(error.message || 'Не удалось обновить статус', 'error');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('arpidentAdmin') === '1') {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('adminApp').classList.remove('hidden');
    loadAdminData();
  }
});
