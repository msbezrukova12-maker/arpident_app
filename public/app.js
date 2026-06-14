let state = {
  doctors: [],
  services: [],
  reviews: [],
  bookings: [],
  currentUser: JSON.parse(localStorage.getItem('arpident_user') || 'null'),
  booking: { step: 1, service: null, doctor: null, date: null, time: null },
  authMode: 'login'
};

const directions = [
  { key: 'therapy', title: 'Терапия', desc: 'Лечение кариеса и заболеваний зубов', tint: '#eaf9ff', accessory: 'glass', serviceMatch: 'кариес' },
  { key: 'implant', title: 'Имплантация', desc: 'Надёжные импланты и восстановление зубов', tint: '#eefbf2', accessory: 'implant', serviceMatch: 'имплант' },
  { key: 'ortho', title: 'Ортодонтия', desc: 'Исправление прикуса и выравнивание зубов', tint: '#f3f0ff', accessory: 'braces', serviceMatch: 'ортодонт' },
  { key: 'prosthetics', title: 'Протезирование', desc: 'Эстетика и функция в гармонии', tint: '#fff3f6', accessory: '', serviceMatch: 'коронк' },
  { key: 'whitening', title: 'Отбеливание', desc: 'Безопасное отбеливание и сияющая улыбка', tint: '#effaff', accessory: 'sparkles', serviceMatch: 'чистк' },
  { key: 'kids', title: 'Детская стоматология', desc: 'Забота и лечение без страха', tint: '#fff0fb', accessory: 'baby-heart', serviceMatch: 'дет' }
];

const week = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const month = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

function qs(id) { return document.getElementById(id); }
async function api(url, options = {}) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Ошибка запроса');
  return data;
}

function svgTooth(extraClass = '') {
  return `<div class="tooth-icon ${extraClass}">
    <svg class="tooth-svg" viewBox="0 0 100 115" aria-hidden="true">
      <defs><linearGradient id="toothGrad" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#dff8ff"/></linearGradient></defs>
      <path d="M50 14C40 5 20 5 11 19 0 37 11 59 24 73c5 5 6 13 8 22 2 8 5 16 11 16 7 0 8-13 10-21 .8-3 1.3-5 2-5s1.2 2 2 5c2 8 3 21 10 21 6 0 9-8 11-16 2-9 3-17 8-22 13-14 24-36 13-54C80 5 60 5 50 14Z"/>
    </svg>
  </div>`;
}

function treatmentCard(d) {
  const face = d.key === 'therapy' || d.key === 'kids' ? 'tooth-face' : '';
  return `<article class="treatment-card" style="--tint:${d.tint}">
    <div class="treatment-visual">${svgTooth(face)}${d.accessory ? `<span class="service-accessory ${d.accessory}"></span>` : ''}</div>
    <h3>${d.title}</h3>
    <p>${d.desc}</p>
    <a onclick="selectDirection('${d.serviceMatch}')">Подробнее</a>
  </article>`;
}

function allServices() { return state.services.flatMap(group => group.items.map(item => ({ ...item, category: group.category }))); }
function findService(id) { return allServices().find(s => Number(s.id) === Number(id)); }
function findDoctor(id) { return state.doctors.find(d => Number(d.id) === Number(id)); }
function initials(name) { return String(name || '').split(/\s+/).slice(0,2).map(s => s[0]).join('').toUpperCase(); }
function stars(rating = 5) { const n = Math.round(Number(rating) || 0); return '★★★★★'.slice(0,n) + '<span style="opacity:.25">' + '★★★★★'.slice(n) + '</span>'; }
function fmtDate(dateStr) { const d = new Date(`${dateStr}T12:00:00`); return `${d.getDate()} ${month[d.getMonth()]} ${d.getFullYear()}`; }
function statusText(status) { return ({ new: 'новая', confirmed: 'подтверждена', cancelled: 'отменена', done: 'завершена' })[status] || status; }

async function init() {
  try {
    const [doctors, services, reviews] = await Promise.all([api('/api/doctors'), api('/api/services'), api('/api/reviews')]);
    state.doctors = doctors;
    state.services = services;
    state.reviews = reviews;
  } catch (e) { toast('Не удалось загрузить данные сайта', 'error'); }
  updateLoginLabel();
  renderHome(); renderServices(); renderDoctors(); prepareReviews(); renderReviews(); renderCabinet(); initBooking();
}

document.addEventListener('DOMContentLoaded', init);

function showSection(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const section = qs(`section-${name}`);
  if (section) section.classList.add('active');
  document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === name));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (name === 'cabinet') renderCabinet();
  if (name === 'booking') renderBookingStep();
  if (name === 'reviews') renderReviews();
}

function toggleMobile(force) {
  const nav = qs('mobileNav');
  const next = typeof force === 'boolean' ? force : !nav.classList.contains('open');
  nav.classList.toggle('open', next);
}

function renderHome() {
  qs('homeTreatments').innerHTML = directions.map(treatmentCard).join('');
  qs('homeDoctors').innerHTML = state.doctors.slice(0,4).map(doctorCard).join('');
  qs('homeReviews').innerHTML = state.reviews.slice(0,3).map(reviewCard).join('');
}

function doctorCard(d) {
  const exp = d.exp || d.experience || '';
  return `<article class="doctor-card">
    <div class="doctor-photo"></div>
    <div class="doctor-info">
      <h3>${d.name}</h3>
      <p>${d.spec || d.specialization || ''}</p>
      <div class="meta doctor-meta"><span class="rating-pill"><span class="stars">★</span>${d.rating || '4.8'}</span><span class="experience-pill">Стаж ${exp} лет</span></div>
      <button class="btn btn-secondary full" style="margin-top:14px" onclick="bookDoctor(${d.id})">Записаться</button>
    </div>
  </article>`;
}

function reviewCard(r) {
  return `<article class="review-card">
    <div class="stars">${stars(r.rating)}</div>
    <p>${r.text}</p>
    <div class="review-author"><b>${r.name || r.patient_name}</b><span>${r.date || ''}</span></div>
  </article>`;
}

function selectDirection(match) {
  showSection('services');
  setTimeout(() => {
    const item = allServices().find(s => String(s.name).toLowerCase().includes(match));
    if (item) { state.booking.service = item; }
  }, 0);
}

function renderServices() {
  qs('serviceDirections').innerHTML = directions.map(treatmentCard).join('');
  qs('priceList').innerHTML = state.services.map(group => `
    <section class="price-group">
      <h3>${group.category}</h3>
      ${group.items.map(item => `<div class="price-row"><span>${item.name}</span><b>${item.price}</b></div>`).join('')}
    </section>`).join('');
}

function renderDoctors() {
  const q = String(qs('doctorSearch')?.value || '').toLowerCase();
  const list = state.doctors.filter(d => `${d.name} ${d.spec || ''}`.toLowerCase().includes(q));
  qs('doctorsGrid').innerHTML = list.map(doctorCard).join('') || '<p>Врачи не найдены.</p>';
}

function bookDoctor(id) {
  state.booking.doctor = findDoctor(id);
  showSection('booking');
  state.booking.step = state.booking.service ? 3 : 1;
  renderBookingStep();
}

function initBooking() {
  if (!state.booking.date) {
    const d = new Date(); d.setDate(d.getDate() + 1);
    state.booking.date = d.toISOString().slice(0,10);
  }
  renderBookingStep();
}

function setStep(step) {
  state.booking.step = step;
  renderBookingStep();
}

function markSteps() {
  for (let i=1;i<=4;i++) qs(`step-${i}`)?.classList.toggle('active', i === state.booking.step);
}

function renderBookingStep() {
  const box = qs('bookingStepContent'); if (!box) return;
  markSteps();
  const s = state.booking.step;
  if (s === 1) return renderBookingServices(box);
  if (s === 2) return renderBookingDoctors(box);
  if (s === 3) return renderBookingSlots(box);
  if (s === 4) return renderBookingForm(box);
}

function renderBookingServices(box) {
  const items = allServices();
  box.innerHTML = `<h2>Выберите услугу</h2><div class="option-grid">
    ${items.map(item => `<button class="option-card ${state.booking.service?.id === item.id ? 'selected' : ''}" onclick="chooseService(${item.id})"><b>${item.name}</b><span>${item.price}</span></button>`).join('')}
    </div>`;
}
function chooseService(id) { state.booking.service = findService(id); setStep(2); }

function renderBookingDoctors(box) {
  box.innerHTML = `<h2>Выберите врача</h2><div class="option-grid">
    ${state.doctors.map(d => `<button class="option-card ${state.booking.doctor?.id === d.id ? 'selected' : ''}" onclick="chooseDoctor(${d.id})"><b>${d.name}</b><span>${d.spec || ''}</span></button>`).join('')}
    </div><div class="booking-actions"><button class="btn btn-secondary" onclick="setStep(1)">Назад</button></div>`;
}
function chooseDoctor(id) { state.booking.doctor = findDoctor(id); setStep(3); }

function nextDates() {
  const out = [];
  for (let i=1;i<=7;i++) { const d = new Date(); d.setDate(d.getDate()+i); out.push(d); }
  return out;
}
async function renderBookingSlots(box) {
  const dates = nextDates();
  box.innerHTML = `<h2>Выберите дату и время</h2>
    <div class="date-grid">${dates.map(d => { const iso = d.toISOString().slice(0,10); return `<button class="date-chip ${state.booking.date === iso ? 'selected' : ''}" onclick="chooseDate('${iso}')"><small>${week[d.getDay()]}</small>${d.getDate()}<small>${month[d.getMonth()]}</small></button>`; }).join('')}</div>
    <div class="time-grid" id="timeGrid"><p>Загружаем свободные окна...</p></div>
    <div class="booking-actions"><button class="btn btn-secondary" onclick="setStep(2)">Назад</button><button class="btn btn-primary" ${state.booking.time ? '' : 'disabled'} onclick="setStep(4)">Далее</button></div>`;
  await loadSlots();
}
function chooseDate(iso) { state.booking.date = iso; state.booking.time = null; renderBookingStep(); }
async function loadSlots() {
  const grid = qs('timeGrid');
  if (!state.booking.doctor) { grid.innerHTML = '<p>Сначала выберите врача.</p>'; return; }
  try {
    const slots = await api(`/api/slots?doctorId=${state.booking.doctor.id}&date=${state.booking.date}`);
    grid.innerHTML = slots.map(slot => `<button class="time-chip ${slot.status === 'busy' ? 'busy' : ''} ${state.booking.time === slot.time ? 'selected' : ''}" ${slot.status === 'busy' ? 'disabled' : ''} onclick="chooseTime('${slot.time}')">${slot.time}</button>`).join('');
  } catch (e) { grid.innerHTML = `<p>${e.message}</p>`; }
}
function chooseTime(time) { state.booking.time = time; renderBookingStep(); }

function renderBookingForm(box) {
  const user = state.currentUser || {};
  box.innerHTML = `<h2>Ваши данные</h2>
    <div class="summary-card">
      <b>${state.booking.service?.name || ''}</b><br>
      ${state.booking.doctor?.name || ''}<br>${fmtDate(state.booking.date)}, ${state.booking.time || ''}
    </div>
    <form class="form-grid" onsubmit="submitBooking(event)">
      <div class="form-grid two"><input id="patientName" placeholder="Имя и фамилия" value="${user.name || ''}" required><input id="patientPhone" placeholder="Телефон" value="${user.phone || ''}" required></div>
      <input id="patientEmail" placeholder="Email" value="${user.email || ''}">
      <textarea id="patientComment" placeholder="Комментарий к записи"></textarea>
      <label style="display:flex;gap:10px;align-items:flex-start;color:var(--muted);font-size:14px"><input type="checkbox" id="agree" required style="width:auto;margin-top:4px"> Я согласен(на) на обработку персональных данных</label>
      <div class="booking-actions"><button type="button" class="btn btn-secondary" onclick="setStep(3)">Назад</button><button class="btn btn-primary">Подтвердить запись</button></div>
    </form>`;
}

async function submitBooking(e) {
  e.preventDefault();
  try {
    const body = {
      patient_name: qs('patientName').value.trim(), phone: qs('patientPhone').value.trim(), email: qs('patientEmail').value.trim(), comment: qs('patientComment').value.trim(),
      doctor_id: state.booking.doctor.id, service_id: state.booking.service.id, date: state.booking.date, time: state.booking.time,
      user_id: state.currentUser?.id || null
    };
    const booking = await api('/api/bookings', { method: 'POST', body: JSON.stringify(body) });
    await refreshBookings();
    qs('bookingStepContent').innerHTML = `<div class="success"><div class="success-mark">✓</div><h2>Запись создана</h2><p>${booking.service}<br>${booking.doctorName}<br>${fmtDate(booking.date)}, ${booking.time}</p><button class="btn btn-primary" onclick="showSection('cabinet')">В личный кабинет</button></div>`;
    toast('Запись успешно создана');
    state.booking = { step: 1, service: null, doctor: null, date: state.booking.date, time: null };
  } catch (err) { toast(err.message, 'error'); }
}

async function refreshBookings() {
  if (!state.currentUser) { state.bookings = []; return; }
  state.bookings = await api(`/api/bookings?userId=${state.currentUser.id}`);
}

function prepareReviews() {
  const doctorOptions = '<option value="">Все врачи</option>' + state.doctors.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
  const serviceOptions = '<option value="">Все услуги</option>' + allServices().map(s => `<option value="${s.name}">${s.name}</option>`).join('');
  ['reviewDoctorFilter','reviewDoctor'].forEach(id => { if (qs(id)) qs(id).innerHTML = id.includes('Filter') ? doctorOptions : '<option value="">Выберите врача</option>' + state.doctors.map(d => `<option value="${d.id}">${d.name}</option>`).join(''); });
  ['reviewServiceFilter','reviewService'].forEach(id => { if (qs(id)) qs(id).innerHTML = id.includes('Filter') ? serviceOptions : '<option value="">Выберите услугу</option>' + allServices().map(s => `<option value="${s.name}">${s.name}</option>`).join(''); });
}
function filteredReviews() {
  const d = qs('reviewDoctorFilter')?.value || '';
  const s = qs('reviewServiceFilter')?.value || '';
  return state.reviews.filter(r => (!d || Number(r.doctorId) === Number(d)) && (!s || r.service === s));
}
function renderReviews() {
  const list = filteredReviews();
  qs('reviewsList').innerHTML = list.map(reviewCard).join('') || '<p>По выбранному фильтру отзывов пока нет.</p>';
  updateRating(list);
}
function updateRating(list) {
  const avg = list.length ? list.reduce((a,r) => a + Number(r.rating || 0), 0) / list.length : 0;
  qs('avgRating').textContent = avg.toFixed(1);
  qs('avgStars').innerHTML = stars(avg);
  qs('ratingCount').textContent = `${list.length} отзывов`;
  const bars = [5,4,3,2,1].map(n => {
    const count = list.filter(r => Number(r.rating) === n).length;
    const pct = list.length ? Math.round(count / list.length * 100) : 0;
    return `<div class="bar-row"><span>${n}</span><div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div><span>${pct}%</span></div>`;
  }).join('');
  qs('ratingBars').innerHTML = bars;
}
async function submitReview(e) {
  e.preventDefault();
  try {
    const doc = findDoctor(qs('reviewDoctor').value);
    const body = { patient_name: qs('reviewName').value.trim(), name: qs('reviewName').value.trim(), doctor_id: doc.id, doctorId: doc.id, doctor_name: doc.name, service: qs('reviewService').value, rating: Number(qs('reviewRating').value), text: qs('reviewText').value.trim() };
    await api('/api/reviews', { method: 'POST', body: JSON.stringify(body) });
    state.reviews = await api('/api/reviews');
    e.target.reset(); prepareReviews(); renderReviews(); renderHome(); toast('Отзыв добавлен');
  } catch (err) { toast(err.message, 'error'); }
}
function scrollToReviewForm() { qs('reviewForm')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }

function updateLoginLabel() { qs('loginLabel').textContent = state.currentUser ? 'Кабинет' : 'Войти'; }
function saveUser(user) { state.currentUser = user; localStorage.setItem('arpident_user', JSON.stringify(user)); updateLoginLabel(); }
function logout() { state.currentUser = null; localStorage.removeItem('arpident_user'); updateLoginLabel(); renderCabinet(); }
async function renderCabinet() {
  const box = qs('cabinetContent'); if (!box) return;
  if (!state.currentUser) { return renderAuth(box); }
  await refreshBookings().catch(() => {});
  box.innerHTML = `<div class="page-card"><div class="page-title-row"><div><div class="eyebrow">Личный кабинет</div><h1>${state.currentUser.name}</h1></div><button class="btn btn-secondary" onclick="logout()">Выйти</button></div>
    <p>${state.currentUser.phone || ''} ${state.currentUser.email ? ' · ' + state.currentUser.email : ''}</p>
    <h2>Мои записи</h2>
    ${state.bookings.length ? state.bookings.map(bookingItem).join('') : '<p>Активных записей пока нет.</p>'}
    <button class="btn btn-primary" onclick="showSection('booking')">Записаться на приём</button></div>`;
}
function renderAuth(box) {
  const isLogin = state.authMode === 'login';
  box.innerHTML = `<div class="page-card"><div class="eyebrow">Личный кабинет</div><h1>${isLogin ? 'Вход' : 'Регистрация'}</h1><p>Для просмотра личного кабинета войдите или зарегистрируйтесь.</p>
    <div class="auth-tabs"><button class="btn ${isLogin ? 'btn-primary' : 'btn-secondary'}" onclick="state.authMode='login';renderCabinet()">Вход</button><button class="btn ${!isLogin ? 'btn-primary' : 'btn-secondary'}" onclick="state.authMode='register';renderCabinet()">Регистрация</button></div>
    ${isLogin ? loginForm() : registerForm()}</div>`;
}
function loginForm() { return `<form class="auth-box" onsubmit="loginUser(event)"><input id="loginValue" placeholder="Телефон или email" required><input id="loginPassword" type="password" placeholder="Пароль" required><button class="btn btn-primary">Войти</button></form>`; }
function registerForm() { return `<form class="auth-box" onsubmit="registerUser(event)"><input id="regName" placeholder="Имя и фамилия" required><input id="regPhone" placeholder="Телефон" required><input id="regEmail" placeholder="Email"><input id="regPassword" type="password" placeholder="Пароль" required><button class="btn btn-primary">Зарегистрироваться</button></form>`; }
async function loginUser(e) { e.preventDefault(); try { const user = await api('/api/users/login', { method:'POST', body: JSON.stringify({ login: qs('loginValue').value, password: qs('loginPassword').value }) }); saveUser(user); renderCabinet(); toast('Вы вошли в кабинет'); } catch(err) { toast(err.message,'error'); } }
async function registerUser(e) { e.preventDefault(); try { const user = await api('/api/users/register', { method:'POST', body: JSON.stringify({ name: qs('regName').value, phone: qs('regPhone').value, email: qs('regEmail').value, password: qs('regPassword').value }) }); saveUser(user); renderCabinet(); toast('Регистрация выполнена'); } catch(err) { toast(err.message,'error'); } }
function bookingItem(b) { return `<div class="booking-item"><div class="booking-item-head"><b>${fmtDate(b.date)}, ${b.time}</b><span class="status ${b.status}">${statusText(b.status)}</span></div><p>${b.service}<br>${b.doctorName}</p>${b.status === 'new' || b.status === 'confirmed' ? `<button class="btn btn-secondary" onclick="cancelBooking(${b.id})">Отменить</button>` : ''}</div>`; }
async function cancelBooking(id) { try { await api(`/api/bookings/${id}/status`, { method:'PATCH', body: JSON.stringify({ status:'cancelled' }) }); await refreshBookings(); renderCabinet(); toast('Запись отменена'); } catch(err) { toast(err.message, 'error'); } }

function toast(text, type='success') {
  const el = qs('toast'); el.textContent = text; el.style.background = type === 'error' ? '#9b1c31' : '#0f2342'; el.classList.add('show');
  clearTimeout(window.__toast); window.__toast = setTimeout(() => el.classList.remove('show'), 3200);
}
