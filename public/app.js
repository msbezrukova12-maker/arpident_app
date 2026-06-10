/* === DATA === */
let DOCTORS = [
  {
    id: 1,
    name: "Фарманян Арпине Арташесовна",
    initials: "ФА",
    spec: "Стоматолог-терапевт, ортопед",
    exp: 12,
    rating: 4.9,
    reviews: 48,
    price: 1000,
    slot: "Сегодня, 16:30",
    services: ["Лечение кариеса", "Лечение пульпита", "Восстановление зуба", "Лечение каналов", "Коронки", "Виниры"],
    desc: "Специалист занимается диагностикой, лечением и профилактикой стоматологических заболеваний. Принимает пациентов по предварительной записи, составляет индивидуальный план лечения и даёт рекомендации по уходу за полостью рта. Совмещает терапевтические и ортопедические методы для комплексного восстановления зубов."
  },
  {
    id: 2,
    name: "Арутюнян Давид Каренович",
    initials: "АД",
    spec: "Хирург-имплантолог",
    exp: 10,
    rating: 4.8,
    reviews: 36,
    price: 1500,
    slot: "Завтра, 11:00",
    services: ["Удаление зубов", "Сложное удаление", "Удаление зуба мудрости", "Установка импланта", "Синус-лифтинг"],
    desc: "Специалист в области хирургической стоматологии и имплантологии. Проводит удаление зубов любой сложности, установку зубных имплантатов, синус-лифтинг. Работает с современными имплантационными системами, обеспечивает комфорт пациента на всех этапах лечения."
  },
  {
    id: 3,
    name: "Мелконян Мария Самвеловна",
    initials: "ММ",
    spec: "Терапевт-эндодонтист",
    exp: 8,
    rating: 4.7,
    reviews: 29,
    price: 1000,
    slot: "Сегодня, 18:00",
    services: ["Лечение кариеса", "Лечение каналов", "Эндодонтическое лечение", "Восстановление зуба", "Профилактика"],
    desc: "Специализируется на эндодонтическом лечении — терапии каналов корня зуба. Использует современные инструменты и материалы для точной и безболезненной обработки каналов. Помогает сохранить зубы, которые казались неизлечимыми."
  },
  {
    id: 4,
    name: "Петросян Анна Григорьевна",
    initials: "ПА",
    spec: "Ортодонт",
    exp: 9,
    rating: 4.9,
    reviews: 41,
    price: 1800,
    slot: "Пятница, 13:00",
    services: ["Консультация ортодонта", "Брекет-системы", "Элайнеры", "Коррекция прикуса", "Ретейнеры"],
    desc: "Врач-ортодонт с многолетним опытом исправления прикуса и выравнивания зубного ряда у взрослых и детей. Работает с современными брекет-системами и съёмными элайнерами. Составляет индивидуальные планы ортодонтического лечения."
  },
  {
    id: 5,
    name: "Саркисян Роберт Арменович",
    initials: "СР",
    spec: "Стоматолог-ортопед",
    exp: 11,
    rating: 4.8,
    reviews: 33,
    price: 1500,
    slot: "Завтра, 15:30",
    services: ["Металлокерамические коронки", "Керамические коронки", "Виниры", "Протезирование", "Мостовидные протезы"],
    desc: "Специалист в области зубного протезирования. Восстанавливает зубы с помощью коронок, виниров и мостовидных протезов. Помогает вернуть эстетику и функцию зубного ряда, подбирает материалы с учётом индивидуальных особенностей пациента."
  },
  {
    id: 6,
    name: "Григорян Лилит Ашотовна",
    initials: "ГЛ",
    spec: "Детский стоматолог, гигиенист",
    exp: 7,
    rating: 4.6,
    reviews: 22,
    price: 1200,
    slot: "Суббота, 10:30",
    services: ["Детская стоматология", "Профессиональная гигиена", "Ультразвуковая чистка", "Фторирование", "Лечение молочных зубов"],
    desc: "Детский стоматолог и специалист по профессиональной гигиене полости рта. Работает с детьми любого возраста, использует методики, снижающие страх перед визитом к стоматологу. Также проводит профессиональную чистку зубов для взрослых пациентов."
  }
];

let SERVICES = [
  {
    category: "Консультации",
    items: [
      { name: "Первичная консультация стоматолога", price: "1 000 ₽" },
      { name: "Консультация ортодонта", price: "1 800 ₽" },
      { name: "Консультация имплантолога", price: "1 500 ₽" }
    ]
  },
  {
    category: "Терапевтическая стоматология",
    items: [
      { name: "Лечение кариеса", price: "от 4 500 ₽" },
      { name: "Лечение пульпита", price: "от 8 000 ₽" },
      { name: "Восстановление зуба", price: "от 6 000 ₽" },
      { name: "Лечение каналов", price: "от 7 000 ₽" }
    ]
  },
  {
    category: "Профессиональная гигиена",
    items: [
      { name: "Профессиональная чистка зубов", price: "от 5 000 ₽" },
      { name: "Ультразвуковая чистка", price: "от 3 500 ₽" },
      { name: "Фторирование", price: "от 1 500 ₽" }
    ]
  },
  {
    category: "Хирургическая стоматология",
    items: [
      { name: "Удаление зуба", price: "от 4 000 ₽" },
      { name: "Сложное удаление зуба", price: "от 8 000 ₽" },
      { name: "Удаление зуба мудрости", price: "от 9 000 ₽" }
    ]
  },
  {
    category: "Ортопедия",
    items: [
      { name: "Металлокерамическая коронка", price: "от 15 000 ₽" },
      { name: "Керамическая коронка", price: "от 25 000 ₽" },
      { name: "Винир", price: "от 30 000 ₽" }
    ]
  },
  {
    category: "Имплантация",
    items: [
      { name: "Установка импланта", price: "от 35 000 ₽" },
      { name: "Синус-лифтинг", price: "от 25 000 ₽" },
      { name: "Протезирование на импланте", price: "от 30 000 ₽" }
    ]
  },
  {
    category: "Ортодонтия",
    items: [
      { name: "Консультация ортодонта", price: "1 800 ₽" },
      { name: "Установка брекет-системы", price: "от 60 000 ₽" },
      { name: "Коррекция брекет-системы", price: "от 3 500 ₽" },
      { name: "Элайнеры", price: "от 120 000 ₽" }
    ]
  }
];

const TIME_SLOTS = ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00"];

let INITIAL_REVIEWS = [
  { id: 1, name: "Наталья К.", doctor: "Фарманян Арпине Арташесовна", service: "Лечение кариеса", rating: 5, date: "02.06.2026", text: "Очень удобно, что можно выбрать врача и время онлайн. Записалась без звонка, всё быстро и понятно. Арпине Арташесовна очень внимательный врач, всё объяснила и провела лечение комфортно." },
  { id: 2, name: "Алексей В.", doctor: "Арутюнян Давид Каренович", service: "Удаление зуба", rating: 5, date: "28.05.2026", text: "Врач подробно объяснил план лечения, приём прошёл спокойно. Понравился внимательный подход — Давид Каренович всё сделал профессионально, минимум дискомфорта." },
  { id: 3, name: "Светлана М.", doctor: "Мелконян Мария Самвеловна", service: "Лечение каналов", rating: 4, date: "20.05.2026", text: "Хорошая клиника рядом с домом. Удобный график работы, есть вечерние окна. Мария Самвеловна опытный специалист, лечение каналов прошло быстро." },
  { id: 4, name: "Ирина Д.", doctor: "Григорян Лилит Ашотовна", service: "Профессиональная чистка зубов", rating: 5, date: "15.05.2026", text: "Записывала ребёнка к стоматологу, понравилось отношение и понятная система записи. Лилит Ашотовна отлично нашла контакт с ребёнком, никакого страха!" },
  { id: 5, name: "Михаил Р.", doctor: "Петросян Анна Григорьевна", service: "Консультация ортодонта", rating: 5, date: "10.05.2026", text: "Отличный ортодонт! Анна Григорьевна подробно объяснила варианты лечения, помогла выбрать между брекетами и элайнерами. Очень довольна результатом." }
];

const HISTORY = [
  { date: "12.06.2026", service: "Консультация стоматолога-терапевта", doctor: "Фарманян А.А." },
  { date: "18.06.2026", service: "Профессиональная гигиена полости рта", doctor: "Григорян Л.А." },
  { date: "25.06.2026", service: "Лечение кариеса (зуб 16)", doctor: "Фарманян А.А." }
];

// Занятые слоты по умолчанию (по докторам)
const BUSY_SLOTS = {
  1: { "09:00":1,"09:30":1,"10:00":1,"12:00":1,"12:30":1,"15:00":1,"17:00":1 },
  2: { "09:00":1,"10:30":1,"11:30":1,"14:00":1,"16:30":1,"17:30":1 },
  3: { "09:30":1,"10:00":1,"12:30":1,"14:30":1,"16:00":1,"19:00":1 },
  4: { "09:00":1,"09:30":1,"11:00":1,"14:00":1,"15:00":1,"18:00":1 },
  5: { "10:00":1,"11:30":1,"12:30":1,"15:30":1,"17:00":1,"18:30":1 },
  6: { "09:00":1,"10:30":1,"12:00":1,"14:30":1,"16:00":1,"17:30":1 }
};

/* === STATE === */
let currentSection = 'home';
let bookingState = {
  step: 1,
  serviceId: null,
  serviceName: null,
  servicePrice: null,
  doctorId: null,
  date: null,
  time: null
};
let calendarDate = new Date();
let selectedStar = 0;

/* === API STATE === */
const API_BASE = '';
let BOOKINGS = [];
let REVIEWS = [];
let IS_API_READY = false;

async function apiRequest(url, options = {}) {
  const response = await fetch(API_BASE + url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  let data = null;
  try { data = await response.json(); } catch (_) {}
  if (!response.ok) {
    throw new Error((data && data.error) || 'Ошибка сервера');
  }
  return data;
}

async function loadInitialData() {
  try {
    const [doctors, services, bookings, reviews] = await Promise.all([
      apiRequest('/api/doctors'),
      apiRequest('/api/services'),
      apiRequest('/api/bookings'),
      apiRequest('/api/reviews')
    ]);
    DOCTORS = doctors;
    SERVICES = services;
    BOOKINGS = bookings;
    REVIEWS = reviews.length ? reviews : INITIAL_REVIEWS;
    IS_API_READY = true;
  } catch (error) {
    console.error(error);
    IS_API_READY = false;
    BOOKINGS = [];
    REVIEWS = INITIAL_REVIEWS;
    showToast('Сервер недоступен. Открыт демо-режим фронтенда.', 'error');
  }
}

async function refreshBookings() {
  BOOKINGS = await apiRequest('/api/bookings');
  return BOOKINGS;
}

async function refreshReviews() {
  REVIEWS = await apiRequest('/api/reviews');
  return REVIEWS;
}

/* === DATA HELPERS === */
function getBookings() {
  return BOOKINGS;
}
function saveBookings(b) {
  BOOKINGS = b;
}
function getReviews() {
  return REVIEWS && REVIEWS.length ? REVIEWS : INITIAL_REVIEWS;
}
function saveReviews(r) {
  REVIEWS = r;
}
function getBookedSlots() {
  const slots = {};
  BOOKINGS
    .filter(b => b.status !== 'cancelled' && b.status !== 'done')
    .forEach(b => {
      const key = `${b.doctorId}_${b.date}`;
      if (!slots[key]) slots[key] = {};
      slots[key][b.time] = 1;
    });
  return slots;
}
function addBookedSlot(doctorId, dateStr, time) {
  const key = `${doctorId}_${dateStr}`;
  // Больше не сохраняем слоты в localStorage: они приходят с backend.
  return key && time;
}
function isSlotBooked(doctorId, dateStr, time) {
  const s = getBookedSlots();
  const key = `${doctorId}_${dateStr}`;
  return s[key] && s[key][time];
}

/* === NAVIGATION === */
function showSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  const el = document.getElementById('section-' + name);
  if (el) {
    el.classList.remove('hidden');
    currentSection = name;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateNavActive(name);
    if (name === 'doctors') renderDoctors();
    if (name === 'home') renderHomePreview();
    if (name === 'services') renderServices();
    if (name === 'booking') initBooking();
    if (name === 'reviews') renderReviews();
    if (name === 'cabinet') renderCabinet();
    if (name === 'admin') { /* admin handled separately */ }
  }
}

function updateNavActive(name) {
  document.querySelectorAll('.nav__link').forEach(l => l.classList.remove('active'));
}

function toggleMobile() {
  document.getElementById('nav').classList.toggle('open');
}

function closeMobile() {
  document.getElementById('nav').classList.remove('open');
}

/* === RENDER DOCTORS === */
function getAvatarColor(idx) {
  const colors = [
    'linear-gradient(135deg,#eff6ff,#bfdbfe)',
    'linear-gradient(135deg,#dbeafe,#93c5fd)',
    'linear-gradient(135deg,#fce7f3,#fbcfe8)',
    'linear-gradient(135deg,#ede9fe,#ddd6fe)',
    'linear-gradient(135deg,#fef3c7,#fde68a)',
    'linear-gradient(135deg,#dcfce7,#bbf7d0)'
  ];
  return colors[idx % colors.length];
}

function renderStars(rating) {
  const full = Math.floor(rating);
  let s = '';
  for (let i = 0; i < 5; i++) s += `<span style="color:${i < full ? '#f59e0b' : '#d1d5db'}">★</span>`;
  return s;
}

function doctorCardHTML(d, idx, showActions = true) {
  return `
    <div class="doctor-card" onclick="openDoctorModal(${d.id})">
      <div class="doctor-card__avatar" style="background:${getAvatarColor(idx)}">${d.initials}</div>
      <div class="doctor-card__name">${d.name}</div>
      <div class="doctor-card__spec">${d.spec}</div>
      <div class="doctor-card__meta">
        <div class="doctor-card__rating">
          <span class="doctor-card__rating-star">★</span>${d.rating}
          <span class="doctor-card__reviews">(${d.reviews} отз.)</span>
        </div>
        <span class="doctor-card__exp">${d.exp} лет</span>
      </div>
      <div class="doctor-card__slot">
        <div class="doctor-card__slot-label">Ближайшее окно</div>
        <div class="doctor-card__slot-time">${d.slot}</div>
      </div>
      <div class="doctor-card__price">Консультация: <strong>${d.price.toLocaleString('ru-RU')} ₽</strong></div>
      <div class="doctor-card__actions" onclick="event.stopPropagation()">
        <button class="btn btn--primary btn--sm" onclick="bookDoctor(${d.id})">Записаться</button>
        <button class="btn btn--ghost btn--sm" onclick="openDoctorModal(${d.id})">Подробнее</button>
      </div>
    </div>
  `;
}

function renderHomePreview() {
  const el = document.getElementById('doctors-preview');
  if (!el) return;
  el.innerHTML = DOCTORS.slice(0, 3).map((d, i) => doctorCardHTML(d, i)).join('');
}

function renderDoctors() {
  const grid = document.getElementById('doctors-grid');
  if (!grid) return;
  const search = (document.getElementById('doctor-search')?.value || '').toLowerCase();
  const spec = document.getElementById('filter-spec')?.value || '';
  const sort = document.getElementById('filter-sort')?.value || '';

  let docs = DOCTORS.filter(d => {
    const nameMatch = d.name.toLowerCase().includes(search);
    const specMatch = !spec || d.spec.toLowerCase().includes(spec);
    return nameMatch && specMatch;
  });

  if (sort === 'rating') docs = [...docs].sort((a,b) => b.rating - a.rating);
  else if (sort === 'price-asc') docs = [...docs].sort((a,b) => a.price - b.price);
  else if (sort === 'price-desc') docs = [...docs].sort((a,b) => b.price - a.price);

  grid.innerHTML = docs.length
    ? docs.map((d, i) => doctorCardHTML(d, i)).join('')
    : '<div class="empty-state" style="grid-column:1/-1"><h3>Врачи не найдены</h3><p>Попробуйте изменить фильтры</p></div>';
}

function filterDoctors() { renderDoctors(); }

/* === DOCTOR MODAL === */
function openDoctorModal(id) {
  const d = DOCTORS.find(x => x.id === id);
  if (!d) return;
  const idx = DOCTORS.indexOf(d);

  const slots = TIME_SLOTS.map(t => {
    const busyDefault = BUSY_SLOTS[d.id] && BUSY_SLOTS[d.id][t];
    const cls = busyDefault ? 'modal-slot busy' : 'modal-slot';
    return `<div class="${cls}" onclick="selectModalSlot(this,'${t}')">${t}</div>`;
  }).join('');

  document.getElementById('doctor-modal-content').innerHTML = `
    <div class="modal-doctor">
      <div class="modal-doctor__top">
        <div class="modal-doctor__avatar" style="background:${getAvatarColor(idx)}">${d.initials}</div>
        <div>
          <h2 class="modal-doctor__name">${d.name}</h2>
          <div class="modal-doctor__spec">${d.spec}</div>
          <div class="modal-doctor__badges">
            <span class="badge badge--teal">Стаж ${d.exp} лет</span>
            <span class="badge badge--yellow">${d.rating} (${d.reviews} отзывов)</span>
            <span class="badge badge--teal">от ${d.price.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>
      </div>
      <div class="modal-doctor__desc">${d.desc}</div>
      <div class="modal-doctor__section-title">Услуги врача</div>
      <div class="modal-doctor__services">${d.services.map(s => `<span class="modal-doctor__service-tag">${s}</span>`).join('')}</div>
      <div class="modal-doctor__section-title">Свободные окна на сегодня</div>
      <div class="modal-calendar">${slots}</div>
      <div style="display:flex;gap:10px">
        <button class="btn btn--primary" onclick="bookDoctor(${d.id});closeDoctorModal()">Записаться онлайн</button>
        <button class="btn btn--ghost" onclick="closeDoctorModal()">Закрыть</button>
      </div>
    </div>
  `;
  document.getElementById('doctor-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function selectModalSlot(el, time) {
  if (el.classList.contains('busy')) return;
  document.querySelectorAll('.modal-slot').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
}

function closeDoctorModal(e) {
  if (e && e.target !== document.getElementById('doctor-modal')) return;
  document.getElementById('doctor-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

/* === SERVICES === */
function renderServices() {
  const el = document.getElementById('services-list');
  if (!el) return;
  el.innerHTML = SERVICES.map(cat => `
    <div class="services-category">
      <div class="services-category__title">${cat.category}</div>
      <div class="services-table">
        ${cat.items.map(item => `
          <div class="services-row">
            <span class="services-row__name">${item.name}</span>
            <span class="services-row__price">${item.price}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

/* === BOOKING === */
function initBooking() {
  renderServicePicker();
  renderDoctorPicker();
  renderCalendar();
  renderTimeSlots();
  showBookingStep(bookingState.step);
}

function renderServicePicker() {
  const el = document.getElementById('service-picker');
  if (!el) return;
  const allServices = SERVICES.flatMap(c => c.items.map(i => ({ ...i, cat: c.category })));
  el.innerHTML = allServices.map((srv, i) => `
    <div class="service-pick-item ${bookingState.serviceId === srv.id || bookingState.serviceName === srv.name ? 'selected' : ''}" onclick="selectService(${srv.id || i + 1}, '${String(srv.name).replace(/'/g,"\'")}', '${String(srv.price).replace(/'/g,"\'")}')">
      <div class="service-pick-item__name">${srv.name}</div>
      <div class="service-pick-item__price">${srv.price}</div>
    </div>
  `).join('');
}

function selectService(id, name, price) {
  bookingState.serviceId = id;
  bookingState.serviceName = name;
  bookingState.servicePrice = price;
  document.querySelectorAll('.service-pick-item').forEach(el => {
    el.classList.toggle('selected', el.querySelector('.service-pick-item__name').textContent === name);
  });
}

function renderDoctorPicker() {
  const el = document.getElementById('doctor-picker');
  if (!el) return;
  el.innerHTML = DOCTORS.map((d, i) => `
    <div class="doctor-pick-item ${bookingState.doctorId === d.id ? 'selected' : ''}" onclick="selectBookingDoctor(${d.id})">
      <div class="doctor-pick-avatar" style="background:${getAvatarColor(i)}">${d.initials}</div>
      <div>
        <div class="doctor-pick-name">${d.name}</div>
        <div class="doctor-pick-spec">${d.spec} · ${d.rating}</div>
      </div>
    </div>
  `).join('');
}

function selectBookingDoctor(id) {
  bookingState.doctorId = id;
  document.querySelectorAll('.doctor-pick-item').forEach((el, i) => {
    el.classList.toggle('selected', DOCTORS[i].id === id);
  });
  renderTimeSlots();
}

function bookDoctor(id) {
  bookingState.doctorId = id;
  showSection('booking');
  bookingState.step = 2;
  showBookingStep(2);
}

/* === CALENDAR === */
function renderCalendar() {
  const el = document.getElementById('date-picker');
  if (!el) return;
  const y = calendarDate.getFullYear();
  const m = calendarDate.getMonth();
  const today = new Date();
  const monthNames = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  const dayNames = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
  const firstDay = new Date(y, m, 1).getDay();
  const offset = (firstDay === 0) ? 6 : firstDay - 1;
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  let cells = '';
  for (let i = 0; i < offset; i++) cells += '<div class="date-cell empty"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(y, m, d);
    const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dateStr = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isToday = date.toDateString() === today.toDateString();
    const isSelected = bookingState.date === dateStr;
    let cls = 'date-cell';
    if (isPast) cls += ' disabled';
    if (isToday) cls += ' today';
    if (isSelected) cls += ' selected';
    const onclick = isPast ? '' : `onclick="selectDate('${dateStr}')"`;
    cells += `<div class="${cls}" ${onclick}>${d}</div>`;
  }

  el.innerHTML = `
    <div class="date-picker-header">
      <button class="date-picker-nav" onclick="changeMonth(-1)">‹</button>
      <span>${monthNames[m]} ${y}</span>
      <button class="date-picker-nav" onclick="changeMonth(1)">›</button>
    </div>
    <div class="date-grid">
      ${dayNames.map(d => `<div class="date-day-label">${d}</div>`).join('')}
      ${cells}
    </div>
  `;
}

function changeMonth(dir) {
  calendarDate.setMonth(calendarDate.getMonth() + dir);
  renderCalendar();
}

function selectDate(dateStr) {
  bookingState.date = dateStr;
  bookingState.time = null;
  renderCalendar();
  renderTimeSlots();
}

function renderTimeSlots() {
  const el = document.getElementById('time-slots');
  if (!el) return;
  const dId = bookingState.doctorId;
  const dateStr = bookingState.date;

  el.innerHTML = TIME_SLOTS.map(t => {
    const busyDefault = dId && BUSY_SLOTS[dId] && BUSY_SLOTS[dId][t];
    const userBooked = dId && dateStr && isSlotBooked(dId, dateStr, t);
    const busy = busyDefault || userBooked;
    const selected = bookingState.time === t;
    let cls = 'time-slot';
    if (busy) cls += ' busy';
    else if (selected) cls += ' selected';
    return `<div class="${cls}" onclick="selectTime('${t}')">${t}</div>`;
  }).join('');
}

function selectTime(t) {
  const dId = bookingState.doctorId;
  const dateStr = bookingState.date;
  if (dId && BUSY_SLOTS[dId] && BUSY_SLOTS[dId][t]) return;
  if (dId && dateStr && isSlotBooked(dId, dateStr, t)) return;
  bookingState.time = t;
  renderTimeSlots();
}

/* === BOOKING STEPS === */
function showBookingStep(step) {
  bookingState.step = step;
  for (let i = 1; i <= 4; i++) {
    document.getElementById('bp-' + i)?.classList.add('hidden');
    const numEl = document.getElementById('bnum-' + i);
    if (numEl) {
      numEl.classList.remove('active', 'done');
      if (i < step) numEl.classList.add('done');
      else if (i === step) numEl.classList.add('active');
    }
  }
  document.getElementById('bp-success')?.classList.add('hidden');
  document.getElementById('bp-' + step)?.classList.remove('hidden');
  if (step === 4) renderBookingSummary();
}

function bookingNext(step) {
  if (step === 1) {
    if (!bookingState.serviceName) { showToast('Выберите услугу', 'error'); return; }
    showBookingStep(2);
  } else if (step === 2) {
    if (!bookingState.doctorId) { showToast('Выберите врача', 'error'); return; }
    showBookingStep(3);
    renderCalendar();
    renderTimeSlots();
  } else if (step === 3) {
    if (!bookingState.date) { showToast('Выберите дату', 'error'); return; }
    if (!bookingState.time) { showToast('Выберите время', 'error'); return; }
    showBookingStep(4);
  }
}

function bookingPrev(step) {
  showBookingStep(step - 1);
}

function renderBookingSummary() {
  const el = document.getElementById('booking-summary');
  if (!el) return;
  const d = DOCTORS.find(x => x.id === bookingState.doctorId);
  el.innerHTML = `
    <div class="booking-summary-row"><span>Услуга:</span><span>${bookingState.serviceName || '—'}</span></div>
    <div class="booking-summary-row"><span>Врач:</span><span>${d ? d.name : '—'}</span></div>
    <div class="booking-summary-row"><span>Дата:</span><span>${formatDate(bookingState.date)}</span></div>
    <div class="booking-summary-row"><span>Время:</span><span>${bookingState.time || '—'}</span></div>
  `;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-');
  const months = ['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
  return `${parseInt(d)} ${months[parseInt(m)-1]} ${y}`;
}

async function submitBooking() {
  const name = document.getElementById('p-name').value.trim();
  const phone = document.getElementById('p-phone').value.trim();
  const agree = document.getElementById('p-agree').checked;

  if (!bookingState.serviceId && !bookingState.serviceName) { showToast('Выберите услугу', 'error'); return; }
  if (!bookingState.doctorId) { showToast('Выберите врача', 'error'); return; }
  if (!bookingState.date) { showToast('Выберите дату', 'error'); return; }
  if (!bookingState.time) { showToast('Выберите время', 'error'); return; }
  if (!name) { showToast('Введите имя', 'error'); document.getElementById('p-name').classList.add('error'); return; }
  if (!phone) { showToast('Введите телефон', 'error'); document.getElementById('p-phone').classList.add('error'); return; }
  if (!agree) { showToast('Необходимо согласие на обработку данных', 'error'); return; }

  try {
    const booking = await apiRequest('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        patient_name: name,
        phone,
        email: document.getElementById('p-email').value.trim(),
        comment: document.getElementById('p-comment').value.trim(),
        doctor_id: bookingState.doctorId,
        service_id: bookingState.serviceId,
        service_name: bookingState.serviceName,
        service_price: bookingState.servicePrice,
        date: bookingState.date,
        time: bookingState.time
      })
    });
    BOOKINGS.unshift(booking);

    for (let i = 1; i <= 4; i++) document.getElementById('bp-' + i)?.classList.add('hidden');
    document.getElementById('bp-success').classList.remove('hidden');
    document.getElementById('success-detail').innerHTML = `
      <div class="booking-summary-row"><span>Пациент:</span><span>${booking.name}</span></div>
      <div class="booking-summary-row"><span>Услуга:</span><span>${booking.service}</span></div>
      <div class="booking-summary-row"><span>Врач:</span><span>${booking.doctorName}</span></div>
      <div class="booking-summary-row"><span>Дата:</span><span>${formatDate(booking.date)}, ${booking.time}</span></div>
    `;
    for (let i = 1; i <= 4; i++) {
      const n = document.getElementById('bnum-' + i);
      if (n) { n.classList.remove('active'); n.classList.add('done'); }
    }
    showToast('Запись создана! Ждём вас в клинике', 'success');
  } catch (error) {
    showToast(error.message || 'Не удалось создать запись', 'error');
    await refreshBookings().catch(() => null);
    renderTimeSlots();
  }
}

function resetBooking() {
  bookingState = { step: 1, serviceId: null, serviceName: null, servicePrice: null, doctorId: null, date: null, time: null };
  document.getElementById('p-name').value = '';
  document.getElementById('p-phone').value = '';
  document.getElementById('p-email').value = '';
  document.getElementById('p-comment').value = '';
  document.getElementById('p-agree').checked = false;
  document.querySelectorAll('.form-input.error').forEach(e => e.classList.remove('error'));
  initBooking();
}

/* === REVIEWS === */
function allServiceItems() {
  return SERVICES.flatMap(group => group.items || []);
}

function fillSelectOptions(selectId, placeholder, values, currentValue = '') {
  const select = document.getElementById(selectId);
  if (!select) return;
  const previous = currentValue || select.value || '';
  select.innerHTML = `<option value="">${placeholder}</option>` + values.map(v => `<option value="${v}">${v}</option>`).join('');
  if (previous && values.includes(previous)) select.value = previous;
}

function prepareReviewControls() {
  const doctorNames = DOCTORS.map(d => d.name);
  const serviceNames = allServiceItems().map(s => s.name);

  fillSelectOptions('rev-doctor', 'Выберите врача', doctorNames);
  fillSelectOptions('rev-filter-doctor', 'Все врачи', doctorNames);
  fillSelectOptions('rev-service', 'Выберите услугу', serviceNames);
  fillSelectOptions('rev-filter-service', 'Все услуги', serviceNames);
}

function filteredReviews() {
  const doctorFilter = document.getElementById('rev-filter-doctor')?.value || '';
  const serviceFilter = document.getElementById('rev-filter-service')?.value || '';
  return getReviews().filter(r => {
    const doctorOk = !doctorFilter || r.doctor === doctorFilter;
    const serviceOk = !serviceFilter || r.service === serviceFilter;
    return doctorOk && serviceOk;
  });
}

function updateRatingStats(reviews) {
  const total = reviews.length;
  const avg = total ? reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / total : 0;
  const avgEl = document.getElementById('rating-average');
  const starsEl = document.getElementById('rating-stars');
  const labelEl = document.getElementById('rating-label');

  if (avgEl) avgEl.textContent = total ? avg.toFixed(1) : '0.0';
  if (starsEl) {
    const rounded = Math.round(avg);
    starsEl.textContent = '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
  }
  if (labelEl) labelEl.textContent = total ? `Средняя оценка на основе ${total} отзывов` : 'Отзывов пока нет';

  for (let rating = 1; rating <= 5; rating++) {
    const row = document.querySelector(`.rbar[data-rating="${rating}"]`);
    if (!row) continue;
    const count = reviews.filter(r => Number(r.rating) === rating).length;
    const percent = total ? Math.round((count / total) * 100) : 0;
    const fill = row.querySelector('.rbar__fill');
    const percentEl = row.querySelector('.rbar__percent');
    if (fill) fill.style.width = percent + '%';
    if (percentEl) percentEl.textContent = percent + '%';
  }
}

function renderReviews() {
  prepareReviewControls();
  const reviews = filteredReviews();
  updateRatingStats(reviews);

  const list = document.getElementById('reviews-list');
  if (!list) return;
  if (!reviews.length) {
    list.innerHTML = '<div class="empty-state"><h3>Отзывов по выбранным фильтрам нет</h3><p>Измените врача или услугу.</p></div>';
    return;
  }
  list.innerHTML = reviews.map(r => {
    const meta = [r.date, r.doctor, r.service].filter(Boolean).join(' · ');
    return `
    <div class="review-card">
      <div class="review-card__header">
        <div class="review-card__name">${r.name}</div>
        <div class="review-card__stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
      </div>
      <div class="review-card__meta">${meta}</div>
      <div class="review-card__text">${r.text}</div>
    </div>
  `;
  }).join('');
}

function setStar(val) {
  selectedStar = val;
  document.querySelectorAll('.star').forEach((s, i) => {
    s.classList.toggle('active', i < val);
  });
}

async function submitReview() {
  const name = document.getElementById('rev-name').value.trim();
  const text = document.getElementById('rev-text').value.trim();
  if (!name) { showToast('Введите имя', 'error'); return; }
  if (!selectedStar) { showToast('Поставьте оценку', 'error'); return; }
  if (!text) { showToast('Напишите отзыв', 'error'); return; }

  const doctorName = document.getElementById('rev-doctor').value;
  const serviceName = document.getElementById('rev-service')?.value || '';
  const doctor = DOCTORS.find(d => d.name === doctorName);

  try {
    const review = await apiRequest('/api/reviews', {
      method: 'POST',
      body: JSON.stringify({
        patient_name: name,
        doctor_id: doctor ? doctor.id : null,
        doctor_name: doctorName,
        service_name: serviceName,
        rating: selectedStar,
        text
      })
    });
    REVIEWS.unshift(review);

    document.getElementById('rev-name').value = '';
    document.getElementById('rev-text').value = '';
    document.getElementById('rev-doctor').value = '';
    if (document.getElementById('rev-service')) document.getElementById('rev-service').value = '';
    selectedStar = 0;
    document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));

    renderReviews();
    showToast('Спасибо за отзыв!', 'success');
  } catch (error) {
    showToast(error.message || 'Не удалось добавить отзыв', 'error');
  }
}

/* === CABINET === */
function renderCabinet() {
  const el = document.getElementById('cabinet-content');
  if (!el) return;
  const bookings = getBookings();
  const active = bookings.filter(b => b.status !== 'cancelled' && b.status !== 'done');

  el.innerHTML = `
    <div class="cabinet-layout">
      <div class="cabinet-header">
        <div class="cabinet-avatar">ЛК</div>
        <div>
          <div class="cabinet-name">Личный кабинет</div>
          <div class="cabinet-meta">Управление записями · Данные демонстрационные</div>
        </div>
      </div>
      <div class="cabinet-grid">
        <div>
          <div class="cabinet-section">
            <h3>Активные записи</h3>
            ${active.length
              ? active.map(b => bookingItemHTML(b)).join('')
              : `<div class="empty-state">
                  
                  <h3>Нет активных записей</h3>
                  <p>У вас пока нет активных записей. Выберите врача и удобное время.</p>
                  <button class="btn btn--primary" onclick="showSection('booking')">Записаться на приём</button>
                </div>`
            }
          </div>
        </div>
        <div>
          <div class="cabinet-section">
            <h3>История посещений</h3>
            ${HISTORY.map(h => `
              <div class="history-item">
                <span class="history-item__date">${h.date}</span>
                <div>
                  <div class="history-item__text">${h.service}</div>
                  <div style="font-size:0.8rem;color:var(--teal-dark)">${h.doctor}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function bookingItemHTML(b) {
  const statusMap = { new: 'Новая', confirmed: 'Подтверждена', cancelled: 'Отменена', done: 'Завершена' };
  const statusCls = { new: 'status--new', confirmed: 'status--confirmed', cancelled: 'status--cancelled', done: 'status--done' };
  return `
    <div class="booking-item" id="bitem-${b.id}">
      <div class="booking-item__head">
        <span class="booking-item__date">${formatDate(b.date)}, ${b.time}</span>
        <span class="booking-item__status ${statusCls[b.status] || 'status--new'}">${statusMap[b.status] || 'Новая'}</span>
      </div>
      <div class="booking-item__doctor">${b.doctorName}</div>
      <div class="booking-item__service">${b.service}</div>
      <div class="booking-item__actions">
        <button class="btn btn--ghost btn--sm" onclick="cancelBooking(${b.id})">Отменить</button>
        <button class="btn btn--outline btn--sm" onclick="repeatBooking(${b.id})">Повторить</button>
      </div>
    </div>
  `;
}

async function cancelBooking(id) {
  try {
    const updated = await apiRequest(`/api/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'cancelled' })
    });
    BOOKINGS = BOOKINGS.map(b => b.id === id ? updated : b);
    renderCabinet();
    showToast('Запись отменена', 'success');
  } catch (error) {
    showToast(error.message || 'Не удалось отменить запись', 'error');
  }
}

function repeatBooking(id) {
  const bookings = getBookings();
  const b = bookings.find(x => x.id === id);
  if (b) {
    bookingState.doctorId = b.doctorId;
    bookingState.serviceName = b.service;
    showSection('booking');
    bookingState.step = 3;
    showBookingStep(3);
  }
}

/* === ADMIN === */
async function enterAdmin() {
  const login = prompt('Логин администратора', 'admin');
  if (login === null) return;
  const password = prompt('Пароль администратора', 'admin123');
  if (password === null) return;
  try {
    await apiRequest('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ login, password })
    });
    document.getElementById('admin-login').classList.add('hidden');
    await refreshBookings();
    renderAdminPanel();
    showToast('Вход выполнен', 'success');
  } catch (error) {
    showToast(error.message || 'Неверный логин или пароль', 'error');
  }
}

function renderAdminPanel() {
  const el = document.getElementById('admin-panel');
  const bookings = getBookings();
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCount = bookings.filter(b => b.date === todayStr).length;
  const avgRating = (DOCTORS.reduce((s, d) => s + d.rating, 0) / DOCTORS.length).toFixed(1);

  el.innerHTML = `
    <div class="admin-stats">
      <div class="admin-stat"><div class="admin-stat__val">${bookings.length}</div><div class="admin-stat__label">Всего записей</div></div>
      <div class="admin-stat"><div class="admin-stat__val">${todayCount}</div><div class="admin-stat__label">Записей сегодня</div></div>
      <div class="admin-stat"><div class="admin-stat__val">${avgRating}</div><div class="admin-stat__label">Средний рейтинг</div></div>
      <div class="admin-stat"><div class="admin-stat__val">${DOCTORS.length}</div><div class="admin-stat__label">Врачей</div></div>
    </div>
    <div class="admin-tabs">
      <button class="admin-tab active" onclick="showAdminTab('bookings',this)">Записи пациентов</button>
      <button class="admin-tab" onclick="showAdminTab('doctors',this)">Врачи</button>
    </div>
    <div id="admin-tab-bookings">${renderAdminBookings(bookings)}</div>
    <div id="admin-tab-doctors" class="hidden">${renderAdminDoctors()}</div>
    <div class="admin-panel-footer">
      <button class="logout-btn" onclick="logoutAdmin()">Выйти из панели администратора</button>
    </div>
  `;
  el.classList.remove('hidden');
}

function showAdminTab(tab, btn) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('admin-tab-bookings').classList.toggle('hidden', tab !== 'bookings');
  document.getElementById('admin-tab-doctors').classList.toggle('hidden', tab !== 'doctors');
}

function renderAdminBookings(bookings) {
  const statusMap = { new: 'Новая', confirmed: 'Подтверждена', cancelled: 'Отменена', done: 'Завершена' };
  const statusCls = { new: 'status--new', confirmed: 'status--confirmed', cancelled: 'status--cancelled', done: 'status--done' };
  if (!bookings.length) {
    return '<div class="empty-state"><h3>Нет записей</h3><p>Записи пациентов появятся здесь</p></div>';
  }
  return `
    <div class="admin-table">
      <div class="admin-table-header cols-bookings">
        <span>Пациент</span><span>Дата/Время</span><span>Врач</span><span>Услуга</span><span>Статус</span><span>Действия</span>
      </div>
      ${bookings.map(b => `
        <div class="admin-table-row cols-bookings" id="arow-${b.id}">
          <div>
            <div style="font-weight:600;color:var(--gray-900)">${b.name}</div>
            <div style="font-size:0.8rem;color:var(--gray-500)">${b.phone}</div>
          </div>
          <div>
            <div style="font-weight:600">${formatDate(b.date)}</div>
            <div style="font-size:0.8rem;color:var(--gray-500)">${b.time}</div>
          </div>
          <div style="font-size:0.88rem">${b.doctorName}</div>
          <div style="font-size:0.85rem;color:var(--gray-600)">${b.service}</div>
          <div><span class="booking-item__status ${statusCls[b.status] || 'status--new'}">${statusMap[b.status] || 'Новая'}</span></div>
          <div class="admin-actions">
            <button class="btn btn--sm" style="background:#d1fae5;color:#065f46;border-color:#a7f3d0" onclick="adminConfirm(${b.id})">✓</button>
            <button class="btn btn--sm btn--ghost" onclick="adminCancel(${b.id})">✕</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderAdminDoctors() {
  return `
    <div class="admin-table">
      <div class="admin-table-header" style="grid-template-columns:2fr 1.5fr 60px 80px 80px">
        <span>Врач</span><span>Специализация</span><span>Стаж</span><span>Рейтинг</span><span>Отзывы</span>
      </div>
      ${DOCTORS.map((d, i) => `
        <div class="admin-table-row" style="grid-template-columns:2fr 1.5fr 60px 80px 80px">
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:36px;height:36px;border-radius:50%;background:${getAvatarColor(i)};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;color:var(--teal-dark)">${d.initials}</div>
            <span style="font-weight:600">${d.name}</span>
          </div>
          <span style="font-size:0.88rem;color:var(--gray-600)">${d.spec}</span>
          <span>${d.exp} л.</span>
          <span style="font-weight:700;color:var(--teal-dark)">${d.rating}</span>
          <span style="color:var(--gray-500)">${d.reviews}</span>
        </div>
      `).join('')}
    </div>
  `;
}

async function adminConfirm(id) {
  try {
    const updated = await apiRequest(`/api/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'confirmed' })
    });
    BOOKINGS = BOOKINGS.map(b => b.id === id ? updated : b);
    renderAdminPanel();
    showToast('Запись подтверждена', 'success');
  } catch (error) {
    showToast(error.message || 'Не удалось подтвердить запись', 'error');
  }
}

async function adminCancel(id) {
  try {
    const updated = await apiRequest(`/api/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'cancelled' })
    });
    BOOKINGS = BOOKINGS.map(b => b.id === id ? updated : b);
    renderAdminPanel();
    showToast('Запись отменена', 'success');
  } catch (error) {
    showToast(error.message || 'Не удалось отменить запись', 'error');
  }
}

function logoutAdmin() {
  document.getElementById('admin-login').classList.remove('hidden');
  document.getElementById('admin-panel').classList.add('hidden');
  document.getElementById('admin-panel').innerHTML = '';
}

/* === TOAST === */
function showToast(msg, type = 'success') {
  let t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.className = `toast toast--${type}`;
  t.textContent = msg;
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* === INIT === */
document.addEventListener('DOMContentLoaded', async () => {
  await loadInitialData();
  showSection('home');
  renderHomePreview();

  // Close modal on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeDoctorModal();
  });
});
