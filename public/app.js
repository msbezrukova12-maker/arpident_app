/* ArpiDent public frontend redesign */
const TIME_SLOTS = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00'];

let DOCTORS = [];
let SERVICES = [];
let BOOKINGS = [];
let REVIEWS = [];
let selectedStar = 0;
let currentSection = 'home';
let quickDate = '';
let CURRENT_USER = loadCurrentUser();

const FALLBACK_DOCTORS = [
  {id:1,name:'Фарманян Арпине Арташесовна',initials:'ФА',spec:'Стоматолог-терапевт, ортопед',exp:12,rating:4.9,reviews:48,price:1000,slot:'Сегодня, 16:30',services:['Лечение кариеса','Лечение каналов','Коронки','Виниры'],desc:'Специалист занимается диагностикой, лечением и профилактикой стоматологических заболеваний. Составляет понятный план лечения и бережно сопровождает пациента.'},
  {id:2,name:'Арутюнян Давид Каренович',initials:'АД',spec:'Хирург-имплантолог',exp:10,rating:4.8,reviews:36,price:1500,slot:'Завтра, 11:00',services:['Удаление зубов','Установка импланта','Синус-лифтинг'],desc:'Специалист в области хирургической стоматологии и имплантологии. Работает с современными протоколами и комфортным обезболиванием.'},
  {id:3,name:'Мелконян Мария Самвеловна',initials:'ММ',spec:'Стоматолог-терапевт, лечение каналов',exp:8,rating:4.7,reviews:29,price:1000,slot:'Сегодня, 18:00',services:['Лечение кариеса','Лечение каналов','Восстановление зуба'],desc:'Специализируется на лечении корневых каналов и сохранении сложных зубов.'},
  {id:4,name:'Петросян Анна Григорьевна',initials:'ПА',spec:'Ортодонт',exp:9,rating:4.9,reviews:41,price:1800,slot:'Пятница, 13:00',services:['Брекет-системы','Элайнеры','Коррекция прикуса'],desc:'Врач-ортодонт, занимается исправлением прикуса у взрослых и детей.'},
  {id:5,name:'Саркисян Роберт Арменович',initials:'СР',spec:'Стоматолог-ортопед',exp:11,rating:4.8,reviews:33,price:1500,slot:'Завтра, 15:30',services:['Коронки','Виниры','Протезирование'],desc:'Восстанавливает эстетику и функцию зубного ряда с помощью коронок, виниров и протезирования.'},
  {id:6,name:'Григорян Лилит Ашотовна',initials:'ГЛ',spec:'Детский стоматолог, гигиенист',exp:7,rating:4.6,reviews:22,price:1200,slot:'Суббота, 10:30',services:['Детская стоматология','Профессиональная гигиена','Фторирование'],desc:'Работает с детьми и взрослыми, проводит бережную гигиену и профилактику.'}
];
const FALLBACK_SERVICES = [
  {category:'Консультации',items:[{id:1,name:'Первичная консультация стоматолога',price:'1 000 ₽'},{id:2,name:'Консультация ортодонта',price:'1 800 ₽'},{id:3,name:'Консультация имплантолога',price:'1 500 ₽'}]},
  {category:'Терапевтическая стоматология',items:[{id:4,name:'Лечение кариеса',price:'от 4 500 ₽'},{id:5,name:'Лечение пульпита',price:'от 8 000 ₽'},{id:6,name:'Восстановление зуба',price:'от 6 000 ₽'},{id:7,name:'Лечение каналов',price:'от 7 000 ₽'}]},
  {category:'Профессиональная гигиена',items:[{id:8,name:'Профессиональная чистка зубов',price:'от 5 000 ₽'},{id:9,name:'Ультразвуковая чистка',price:'от 3 500 ₽'}]},
  {category:'Ортопедия',items:[{id:14,name:'Металлокерамическая коронка',price:'от 15 000 ₽'},{id:16,name:'Винир',price:'от 30 000 ₽'}]},
  {category:'Имплантация',items:[{id:17,name:'Установка импланта',price:'от 35 000 ₽'},{id:19,name:'Протезирование на импланте',price:'от 30 000 ₽'}]},
  {category:'Ортодонтия',items:[{id:20,name:'Консультация ортодонта',price:'1 800 ₽'},{id:21,name:'Установка брекет-системы',price:'от 60 000 ₽'}]}
];
const FALLBACK_REVIEWS = [
  {id:1,name:'Анна П.',doctor:'Фарманян Арпине Арташесовна',service:'Лечение кариеса',rating:5,date:'12.06.2026',text:'Замечательная клиника! Врачи профессионалы, всё объясняют и делают аккуратно. Рекомендую.'},
  {id:2,name:'Игорь С.',doctor:'Арутюнян Давид Каренович',service:'Имплантация',rating:5,date:'03.06.2026',text:'Делал имплантацию, результатом очень доволен. Спасибо всей команде.'},
  {id:3,name:'Светлана М.',doctor:'Григорян Лилит Ашотовна',service:'Детская стоматология',rating:5,date:'28.05.2026',text:'Лечим зубки у дочки только здесь. Доброжелательная атмосфера и отличный подход к детям.'}
];

const SERVICE_CARDS = [
  {key:'therapy',title:'Терапия',desc:'Лечение кариеса и заболеваний зубов',category:'Терапевтическая стоматология'},
  {key:'implant',title:'Имплантация',desc:'Надёжные импланты и восстановление зубов',category:'Имплантация'},
  {key:'ortho',title:'Ортодонтия',desc:'Исправление прикуса и выравнивание зубов',category:'Ортодонтия'},
  {key:'prosthetic',title:'Протезирование',desc:'Эстетика и функции в гармонии',category:'Ортопедия'},
  {key:'white',title:'Отбеливание',desc:'Безопасное отбеливание и сияющая улыбка',category:'Профессиональная гигиена'},
  {key:'kids',title:'Детская стоматология',desc:'Забота и лечение без страха',category:'Детская стоматология'}
];

let bookingState = { step: 1, serviceId: null, serviceName: '', servicePrice: '', doctorId: null, date: '', time: '' };

function loadCurrentUser(){ try { return JSON.parse(localStorage.getItem('arpidentUser') || 'null'); } catch { return null; } }
function saveCurrentUser(user){ CURRENT_USER = user; user ? localStorage.setItem('arpidentUser', JSON.stringify(user)) : localStorage.removeItem('arpidentUser'); }
function apiRequest(url, options = {}){ return fetch(url,{ headers:{'Content-Type':'application/json', ...(options.headers||{})}, ...options }).then(async r=>{ let data=null; try{ data=await r.json(); }catch{} if(!r.ok) throw new Error((data&&data.error)||'Ошибка сервера'); return data; }); }
function escapeHTML(str=''){ return String(str).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch])); }
function fmtPrice(n){ return Number(n||0).toLocaleString('ru-RU') + ' ₽'; }
function formatDate(dateStr){ if(!dateStr) return '—'; const [y,m,d]=dateStr.split('-'); return `${d}.${m}.${y}`; }
function toISO(date){ return date.toISOString().slice(0,10); }
function clinicToday(){ const p=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Moscow',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).reduce((a,p)=>{a[p.type]=p.value;return a;},{}); return `${p.year}-${p.month}-${p.day}`; }
function allServices(){ return SERVICES.flatMap(g => g.items.map(item => ({...item, category:g.category}))); }
function getDoctor(id){ return DOCTORS.find(d => Number(d.id) === Number(id)); }
function serviceById(id){ return allServices().find(s => Number(s.id) === Number(id)); }
function getShortName(name=''){ const parts=String(name).split(' '); return parts.length>2 ? `${parts[0]} ${parts[1][0]}.${parts[2][0]}.` : name; }
function serviceIcon(key){ return `<div class="service-art service-art--${key}"><span class="tooth-shape"></span><span class="art-extra a1"></span><span class="art-extra a2"></span></div>`; }

async function loadInitialData(){
  try{
    const [doctors, services, bookings, reviews] = await Promise.all([apiRequest('/api/doctors'), apiRequest('/api/services'), apiRequest('/api/bookings'), apiRequest('/api/reviews')]);
    DOCTORS = doctors.length ? doctors : FALLBACK_DOCTORS;
    SERVICES = services.length ? services : FALLBACK_SERVICES;
    BOOKINGS = bookings || [];
    REVIEWS = reviews.length ? reviews : FALLBACK_REVIEWS;
  } catch(e){
    DOCTORS = FALLBACK_DOCTORS; SERVICES = FALLBACK_SERVICES; BOOKINGS = []; REVIEWS = FALLBACK_REVIEWS;
    showToast('Сервер не ответил, открыт демо-режим', 'error');
  }
}
async function refreshBookings(params=''){ try { BOOKINGS = await apiRequest('/api/bookings' + params); return BOOKINGS; } catch { return BOOKINGS; } }
async function refreshReviews(){ try { REVIEWS = await apiRequest('/api/reviews'); return REVIEWS; } catch { return REVIEWS; } }

function showSection(name){
  document.querySelectorAll('.section').forEach(s => { s.classList.add('hidden'); s.classList.remove('section-enter'); });
  const section = document.getElementById('section-' + name);
  if(!section) return;
  section.classList.remove('hidden'); requestAnimationFrame(()=>section.classList.add('section-enter'));
  currentSection = name; closeMobile(); updateNavActive(name); window.scrollTo({top:0,behavior:'smooth'});
  if(name==='home'){ renderHome(); }
  if(name==='services'){ renderServices(); }
  if(name==='doctors'){ renderDoctors(); }
  if(name==='booking'){ initBooking(); }
  if(name==='reviews'){ renderReviews(); }
  if(name==='cabinet'){ renderCabinet(); }
}
function updateNavActive(name){ document.querySelectorAll('.nav__link').forEach(a => a.classList.toggle('active', a.dataset.section === name)); }
function toggleMobile(){ document.getElementById('nav').classList.toggle('open'); }
function closeMobile(){ document.getElementById('nav')?.classList.remove('open'); }

function renderHome(){ renderHomeServiceGallery(); renderHomePreview(); renderQuickBooking(); renderReviewsPreview(); }
function renderHomeServiceGallery(){
  const targets = [document.getElementById('home-service-gallery'), document.getElementById('services-gallery-page')].filter(Boolean);
  const html = SERVICE_CARDS.map(c => `<button class="service-card service-card--${c.key}" onclick="showSection('services')">${serviceIcon(c.key)}<b>${c.title}</b><span>${c.desc}</span><small>Подробнее</small></button>`).join('');
  targets.forEach(t => t.innerHTML = html);
}
function doctorAvatar(d, idx=0){ return `<div class="doctor-avatar doctor-avatar--${(idx%4)+1}"><span>${escapeHTML(d.initials || getShortName(d.name).slice(0,2))}</span></div>`; }
function doctorCardHTML(d, idx=0){
  return `<article class="doctor-card" onclick="openDoctorModal(${d.id})">${doctorAvatar(d, idx)}<div class="doctor-card__body"><h3>${escapeHTML(getShortName(d.name))}</h3><p>${escapeHTML(d.spec)}</p><div class="doctor-card__meta"><span>★ ${d.rating}</span><span>${d.exp} лет опыта</span></div></div><button class="card-mini-btn" onclick="event.stopPropagation(); bookDoctor(${d.id})">Записаться</button></article>`;
}
function renderHomePreview(){ const el=document.getElementById('doctors-preview'); if(el) el.innerHTML = DOCTORS.slice(0,4).map(doctorCardHTML).join(''); }
function renderDoctors(){
  const grid=document.getElementById('doctors-grid'); if(!grid) return;
  const search=(document.getElementById('doctor-search')?.value||'').toLowerCase();
  const spec=document.getElementById('filter-spec')?.value||''; const sort=document.getElementById('filter-sort')?.value||'';
  let docs=DOCTORS.filter(d => d.name.toLowerCase().includes(search) && (!spec || d.spec.toLowerCase().includes(spec)));
  if(sort==='rating') docs.sort((a,b)=>b.rating-a.rating); if(sort==='price-asc') docs.sort((a,b)=>(a.price||0)-(b.price||0)); if(sort==='price-desc') docs.sort((a,b)=>(b.price||0)-(a.price||0));
  grid.innerHTML = docs.length ? docs.map(doctorCardHTML).join('') : '<div class="empty-state"><h3>Врачи не найдены</h3><p>Измените фильтры.</p></div>';
}
function filterDoctors(){ renderDoctors(); }
function openDoctorModal(id){
  const d=getDoctor(id); if(!d) return;
  document.getElementById('doctor-modal-content').innerHTML = `<div class="modal-doctor">${doctorAvatar(d, DOCTORS.indexOf(d))}<div><h2>${escapeHTML(d.name)}</h2><p class="modal-spec">${escapeHTML(d.spec)}</p><div class="modal-badges"><span>${d.exp} лет опыта</span><span>★ ${d.rating}</span><span>от ${fmtPrice(d.price)}</span></div></div><p class="modal-desc">${escapeHTML(d.desc||'Специалист клиники ArpiDent. Консультирует пациентов, составляет план лечения и отвечает на вопросы перед процедурой.')}</p><h4>Услуги врача</h4><div class="modal-tags">${(d.services||[]).map(s=>`<span>${escapeHTML(s)}</span>`).join('')}</div><div class="modal-actions"><button class="btn btn--primary" onclick="bookDoctor(${d.id}); closeDoctorModal();">Записаться онлайн</button><button class="btn btn--soft" onclick="closeDoctorModal()">Закрыть</button></div></div>`;
  document.getElementById('doctor-modal').classList.remove('hidden'); document.body.style.overflow='hidden';
}
function closeDoctorModal(e){ if(e && e.target.id !== 'doctor-modal') return; document.getElementById('doctor-modal').classList.add('hidden'); document.body.style.overflow=''; }
function bookDoctor(id){ bookingState.doctorId=id; bookingState.step=1; showSection('booking'); }

function renderServices(){
  renderHomeServiceGallery();
  const list=document.getElementById('services-list'); if(!list) return;
  list.innerHTML = SERVICES.map(group => `<section class="price-group panel"><h2>${escapeHTML(group.category)}</h2>${group.items.map(item => `<div class="price-row"><span>${escapeHTML(item.name)}</span><b>${escapeHTML(item.price)}</b></div>`).join('')}</section>`).join('');
}

function renderQuickBooking(){
  const serviceSelect=document.getElementById('quick-service-select'); if(serviceSelect){ serviceSelect.innerHTML = allServices().slice(0,8).map(s => `<option value="${s.id}">${escapeHTML(s.name)}</option>`).join(''); }
  const row=document.getElementById('quick-date-row'); if(row){
    const today=new Date(clinicToday() + 'T12:00:00');
    row.innerHTML = Array.from({length:5},(_,i)=>{ const d=new Date(today); d.setDate(d.getDate()+i); const iso=toISO(d); if(!quickDate) quickDate=iso; return `<button type="button" class="${iso===quickDate?'selected':''}" onclick="selectQuickDate('${iso}')"><small>${d.toLocaleDateString('ru-RU',{weekday:'short'})}</small><b>${d.getDate()}</b></button>`; }).join('');
  }
}
function selectQuickDate(iso){ quickDate=iso; renderQuickBooking(); }
function quickStartBooking(){
  const id=Number(document.getElementById('quick-service-select')?.value || 0); const srv=serviceById(id);
  if(srv){ bookingState.serviceId=srv.id; bookingState.serviceName=srv.name; bookingState.servicePrice=srv.price; }
  bookingState.date = quickDate || clinicToday(); bookingState.step=2; showSection('booking');
}

function initBooking(){
  if(!bookingState.date) bookingState.date = clinicToday();
  renderServicePicker(); renderDoctorPicker(); renderDatePicker(); renderTimeSlots(); showBookingStep(bookingState.step || 1); prefillPatientFields();
}
function showBookingStep(step){
  bookingState.step=step; [1,2,3,4].forEach(i=>{ document.getElementById('bp-'+i)?.classList.toggle('hidden', i!==step); document.getElementById('bnum-'+i)?.classList.toggle('active', i===step); document.getElementById('bnum-'+i)?.classList.toggle('done', i<step); });
  document.getElementById('bp-success')?.classList.add('hidden');
  if(step===3) renderTimeSlots(); if(step===4) renderBookingSummary();
}
function bookingNext(step){
  if(step===1 && !bookingState.serviceName) return showToast('Выберите услугу', 'error');
  if(step===2 && !bookingState.doctorId) return showToast('Выберите врача', 'error');
  if(step===3 && (!bookingState.date || !bookingState.time)) return showToast('Выберите дату и время', 'error');
  showBookingStep(step+1);
}
function bookingPrev(step){ showBookingStep(step-1); }
function renderServicePicker(){
  const el=document.getElementById('service-picker'); if(!el) return;
  el.innerHTML = allServices().map(s => `<button class="service-pick-item ${bookingState.serviceId===s.id?'selected':''}" onclick="selectService(${s.id})"><b>${escapeHTML(s.name)}</b><span>${escapeHTML(s.price)}</span><small>${escapeHTML(s.category)}</small></button>`).join('');
}
function selectService(id){ const s=serviceById(id); if(!s) return; bookingState.serviceId=s.id; bookingState.serviceName=s.name; bookingState.servicePrice=s.price; renderServicePicker(); }
function renderDoctorPicker(){
  const el=document.getElementById('doctor-picker'); if(!el) return;
  el.innerHTML = DOCTORS.map((d,i) => `<button class="doctor-pick-item ${bookingState.doctorId===d.id?'selected':''}" onclick="selectDoctor(${d.id})">${doctorAvatar(d,i)}<span><b>${escapeHTML(getShortName(d.name))}</b><small>${escapeHTML(d.spec)}</small></span></button>`).join('');
}
function selectDoctor(id){ bookingState.doctorId=id; bookingState.time=''; renderDoctorPicker(); renderTimeSlots(); }
function renderDatePicker(){
  const el=document.getElementById('date-picker'); if(!el) return;
  const today=new Date(clinicToday() + 'T12:00:00');
  el.innerHTML = `<div class="date-chip-grid">${Array.from({length:10},(_,i)=>{ const d=new Date(today); d.setDate(d.getDate()+i); const iso=toISO(d); return `<button type="button" class="date-chip ${bookingState.date===iso?'selected':''}" onclick="selectDate('${iso}')"><small>${d.toLocaleDateString('ru-RU',{weekday:'short'})}</small><b>${d.getDate()}</b><span>${d.toLocaleDateString('ru-RU',{month:'short'}).replace('.','')}</span></button>`; }).join('')}</div>`;
}
function selectDate(iso){ bookingState.date=iso; bookingState.time=''; renderDatePicker(); renderTimeSlots(); }
async function renderTimeSlots(){
  const el=document.getElementById('time-slots'); if(!el) return;
  if(!bookingState.doctorId){ el.innerHTML='<div class="slot-empty">Сначала выберите врача</div>'; return; }
  let slots=[];
  try{ slots = await apiRequest(`/api/slots?doctorId=${bookingState.doctorId}&date=${bookingState.date}`); }
  catch{ slots = TIME_SLOTS.map(time=>({time,status:'free'})); }
  el.innerHTML = slots.map(s => `<button type="button" class="time-slot ${s.status==='busy'?'busy':''} ${bookingState.time===s.time?'selected':''}" ${s.status==='busy'?'disabled':''} onclick="selectTime('${s.time}')">${s.time}</button>`).join('');
}
function selectTime(time){ bookingState.time=time; renderTimeSlots(); }
function renderBookingSummary(){
  const doc=getDoctor(bookingState.doctorId);
  const el=document.getElementById('booking-summary'); if(!el) return;
  el.innerHTML = `<div><span>Услуга</span><b>${escapeHTML(bookingState.serviceName)}</b></div><div><span>Врач</span><b>${escapeHTML(doc?.name || '')}</b></div><div><span>Дата</span><b>${formatDate(bookingState.date)}, ${bookingState.time}</b></div>`;
  prefillPatientFields();
}
function prefillPatientFields(){ if(!CURRENT_USER) return; const n=document.getElementById('p-name'), p=document.getElementById('p-phone'), e=document.getElementById('p-email'); if(n&&!n.value)n.value=CURRENT_USER.name||''; if(p&&!p.value)p.value=CURRENT_USER.phone||''; if(e&&!e.value)e.value=CURRENT_USER.email||''; }
async function submitBooking(){
  const name=document.getElementById('p-name').value.trim(); const phone=document.getElementById('p-phone').value.trim(); const email=document.getElementById('p-email').value.trim(); const comment=document.getElementById('p-comment').value.trim();
  if(!name || !phone) return showToast('Заполните имя и телефон', 'error'); if(!document.getElementById('p-agree').checked) return showToast('Подтвердите согласие на обработку данных', 'error');
  try{
    const booking = await apiRequest('/api/bookings',{method:'POST',body:JSON.stringify({patient_name:name,phone,email,comment,doctor_id:bookingState.doctorId,service_id:bookingState.serviceId,service_name:bookingState.serviceName,service_price:bookingState.servicePrice,date:bookingState.date,time:bookingState.time,user_id:CURRENT_USER?.id||null})});
    BOOKINGS.unshift(booking); document.querySelectorAll('.booking-panel').forEach(p=>p.classList.add('hidden')); document.getElementById('bp-success').classList.remove('hidden');
    document.getElementById('success-detail').innerHTML = `<div><span>Пациент</span><b>${escapeHTML(booking.name)}</b></div><div><span>Услуга</span><b>${escapeHTML(booking.service)}</b></div><div><span>Врач</span><b>${escapeHTML(booking.doctorName)}</b></div><div><span>Дата</span><b>${formatDate(booking.date)}, ${booking.time}</b></div>`;
    showToast('Запись успешно создана', 'success');
  } catch(e){ showToast(e.message || 'Не удалось создать запись', 'error'); }
}
function resetBooking(){ bookingState={step:1,serviceId:null,serviceName:'',servicePrice:'',doctorId:null,date:clinicToday(),time:''}; showSection('booking'); }

function populateReviewSelects(){
  const docOptions = '<option value="">Все врачи</option>' + DOCTORS.map(d=>`<option value="${escapeHTML(d.name)}">${escapeHTML(getShortName(d.name))}</option>`).join('');
  ['review-filter-doctor'].forEach(id=>{ const el=document.getElementById(id); if(el && !el.dataset.ready){ el.innerHTML=docOptions; el.dataset.ready='1'; }});
  const all = allServices().map(s=>s.name); const unique=[...new Set(all.concat(REVIEWS.map(r=>r.service).filter(Boolean)))];
  const srvOptions = '<option value="">Все услуги</option>' + unique.map(s=>`<option value="${escapeHTML(s)}">${escapeHTML(s)}</option>`).join('');
  ['review-filter-service'].forEach(id=>{ const el=document.getElementById(id); if(el && !el.dataset.ready){ el.innerHTML=srvOptions; el.dataset.ready='1'; }});
  const revDoc=document.getElementById('rev-doctor'); if(revDoc) revDoc.innerHTML='<option value="">Выберите врача</option>'+DOCTORS.map(d=>`<option value="${d.id}">${escapeHTML(getShortName(d.name))}</option>`).join('');
  const revSrv=document.getElementById('rev-service'); if(revSrv) revSrv.innerHTML='<option value="">Выберите услугу</option>'+unique.map(s=>`<option value="${escapeHTML(s)}">${escapeHTML(s)}</option>`).join('');
}
function filteredReviews(){ const d=document.getElementById('review-filter-doctor')?.value||''; const s=document.getElementById('review-filter-service')?.value||''; return REVIEWS.filter(r=>(!d || r.doctor===d) && (!s || r.service===s)); }
function updateRatingStats(reviews){
  const total=reviews.length; const avg=total ? reviews.reduce((sum,r)=>sum+Number(r.rating||0),0)/total : 0;
  document.getElementById('rating-avg').textContent=avg.toFixed(1); document.getElementById('rating-stars').innerHTML=renderStars(avg); document.getElementById('rating-count').textContent=`${total} отзывов`;
  const bars=document.getElementById('rating-bars'); if(bars) bars.innerHTML=[5,4,3,2,1].map(rate=>{ const count=reviews.filter(r=>Number(r.rating)===rate).length; const pct=total?Math.round(count/total*100):0; return `<div class="rbar"><span>${rate}</span><div><i style="width:${pct}%"></i></div><b>${pct}%</b></div>`; }).join('');
}
function renderStars(rating){ const full=Math.round(Number(rating)||0); return Array.from({length:5},(_,i)=>`<span class="${i<full?'full':''}">★</span>`).join(''); }
function reviewCard(r){ return `<article class="review-card"><div class="quote">“</div><p>${escapeHTML(r.text)}</p><div class="review-card__foot"><span><b>${escapeHTML(r.name)}</b><small>${escapeHTML(r.date||'')}</small></span><div>${renderStars(r.rating)}</div></div></article>`; }
function renderReviewsPreview(){ const el=document.getElementById('reviews-preview'); if(el) el.innerHTML = REVIEWS.slice(0,3).map(reviewCard).join(''); }
function renderReviews(){ populateReviewSelects(); const reviews=filteredReviews(); updateRatingStats(reviews); const list=document.getElementById('reviews-list'); if(list) list.innerHTML = reviews.length ? reviews.map(reviewCard).join('') : '<div class="empty-state"><h3>Отзывов по фильтрам нет</h3><p>Измените врача или услугу.</p></div>'; }
function clearReviewFilters(){ const d=document.getElementById('review-filter-doctor'), s=document.getElementById('review-filter-service'); if(d)d.value=''; if(s)s.value=''; renderReviews(); }
function setStar(n){ selectedStar=n; document.querySelectorAll('#star-picker span').forEach((s,i)=>s.classList.toggle('active', i<n)); }
async function submitReview(){
  const name=document.getElementById('rev-name').value.trim(); const doctorId=Number(document.getElementById('rev-doctor').value||0); const service=document.getElementById('rev-service').value; const text=document.getElementById('rev-text').value.trim();
  if(!name || !selectedStar || !text) return showToast('Заполните имя, оценку и текст отзыва', 'error');
  try{ const review=await apiRequest('/api/reviews',{method:'POST',body:JSON.stringify({patient_name:name,doctor_id:doctorId||null,service_name:service,rating:selectedStar,text})}); REVIEWS.unshift(review); selectedStar=0; document.querySelectorAll('#star-picker span').forEach(s=>s.classList.remove('active')); document.getElementById('rev-name').value=''; document.getElementById('rev-text').value=''; await refreshReviews(); renderReviews(); renderReviewsPreview(); showToast('Отзыв добавлен', 'success'); }
  catch(e){ showToast(e.message || 'Не удалось добавить отзыв', 'error'); }
}

function renderCabinet(){
  const el=document.getElementById('cabinet-content'); if(!el) return;
  if(!CURRENT_USER){ el.innerHTML = `<div class="auth-layout"><div class="auth-card panel"><h2>Вход</h2><p>Войдите, чтобы видеть свои записи.</p><div class="form-group"><label>Телефон или email</label><input id="login-id" class="form-input" placeholder="+7 или email"></div><div class="form-group"><label>Пароль</label><input id="login-pass" class="form-input" type="password"></div><button class="btn btn--primary btn--full" onclick="loginCabinetUser()">Войти</button></div><div class="auth-card panel"><h2>Регистрация</h2><p>Создайте кабинет пациента.</p><div class="form-group"><label>Имя</label><input id="reg-name" class="form-input"></div><div class="form-group"><label>Телефон</label><input id="reg-phone" class="form-input"></div><div class="form-group"><label>Email</label><input id="reg-email" class="form-input"></div><div class="form-group"><label>Пароль</label><input id="reg-pass" class="form-input" type="password"></div><button class="btn btn--soft btn--full" onclick="registerCabinetUser()">Зарегистрироваться</button></div></div>`; return; }
  loadUserBookingsAndRender();
}
async function loadUserBookingsAndRender(){
  let list=[]; try{ list=await apiRequest(`/api/bookings?userId=${CURRENT_USER.id}&phone=${encodeURIComponent(CURRENT_USER.phone||'')}&email=${encodeURIComponent(CURRENT_USER.email||'')}`); }catch{ list=BOOKINGS.filter(b=>b.userId===CURRENT_USER.id || b.phone===CURRENT_USER.phone || b.email===CURRENT_USER.email); }
  const active=list.filter(b=>b.status!=='cancelled' && b.status!=='done'); const done=list.filter(b=>b.status==='done' || b.status==='cancelled');
  document.getElementById('cabinet-content').innerHTML = `<div class="cabinet-layout"><div class="cabinet-header panel"><div class="cabinet-avatar">${escapeHTML((CURRENT_USER.name||'П')[0])}</div><div><h2>${escapeHTML(CURRENT_USER.name)}</h2><p>${escapeHTML(CURRENT_USER.phone||'')} · ${escapeHTML(CURRENT_USER.email||'')}</p></div><button class="btn btn--soft" onclick="logoutCabinetUser()">Выйти</button></div><div class="cabinet-grid"><section class="panel"><h3>Активные записи</h3>${active.length?active.map(bookingItemHTML).join(''):'<div class="empty-state"><h3>Нет активных записей</h3><p>Выберите врача и удобное время.</p><button class="btn btn--primary" onclick="showSection(\'booking\')">Записаться</button></div>'}</section><section class="panel"><h3>История</h3>${done.length?done.map(bookingItemHTML).join(''):'<p class="muted">История появится после завершённых визитов.</p>'}</section></div></div>`;
}
function bookingItemHTML(b){ const labels={new:'Новая',confirmed:'Подтверждена',cancelled:'Отменена',done:'Завершена'}; return `<div class="booking-item"><div><b>${formatDate(b.date)}, ${b.time}</b><span class="booking-status status--${b.status}">${labels[b.status]||'Новая'}</span></div><p>${escapeHTML(b.service||'')}</p><small>${escapeHTML(b.doctorName||'')}</small>${b.status==='new'||b.status==='confirmed'?`<button class="btn btn--soft btn--sm" onclick="cancelBooking(${b.id})">Отменить</button>`:''}</div>`; }
async function registerCabinetUser(){ try{ const user=await apiRequest('/api/users/register',{method:'POST',body:JSON.stringify({name:document.getElementById('reg-name').value.trim(),phone:document.getElementById('reg-phone').value.trim(),email:document.getElementById('reg-email').value.trim(),password:document.getElementById('reg-pass').value.trim()})}); saveCurrentUser(user); renderCabinet(); showToast('Регистрация выполнена','success'); } catch(e){ showToast(e.message||'Не удалось зарегистрироваться','error'); } }
async function loginCabinetUser(){ try{ const user=await apiRequest('/api/users/login',{method:'POST',body:JSON.stringify({login:document.getElementById('login-id').value.trim(),password:document.getElementById('login-pass').value.trim()})}); saveCurrentUser(user); renderCabinet(); showToast('Вход выполнен','success'); } catch(e){ showToast(e.message||'Не удалось войти','error'); } }
function logoutCabinetUser(){ saveCurrentUser(null); renderCabinet(); }
async function cancelBooking(id){ try{ await apiRequest(`/api/bookings/${id}/status`,{method:'PATCH',body:JSON.stringify({status:'cancelled'})}); showToast('Запись отменена','success'); renderCabinet(); } catch(e){ showToast(e.message||'Не удалось отменить запись','error'); } }

function showToast(msg,type='success'){ let t=document.querySelector('.toast'); if(!t){ t=document.createElement('div'); t.className='toast'; document.body.appendChild(t); } t.className=`toast toast--${type}`; t.textContent=msg; setTimeout(()=>t.classList.add('show'),10); setTimeout(()=>t.classList.remove('show'),3300); }

document.addEventListener('DOMContentLoaded', async () => { await loadInitialData(); renderHome(); showSection('home'); document.addEventListener('keydown', e => { if(e.key==='Escape') closeDoctorModal(); }); });
