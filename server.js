const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const { readDb, writeDb, findService } = require('./database');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const TIME_SLOTS = [
  '09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30',
  '14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30',
  '18:00','18:30','19:00','19:30','20:00'
];

const DEFAULT_BUSY_SLOTS = {
  1: { '09:00': 1, '09:30': 1, '10:00': 1, '12:00': 1, '12:30': 1, '15:00': 1, '17:00': 1 },
  2: { '09:00': 1, '10:30': 1, '11:30': 1, '14:00': 1, '16:30': 1, '17:30': 1 },
  3: { '09:30': 1, '10:00': 1, '12:30': 1, '14:30': 1, '16:00': 1, '19:00': 1 },
  4: { '09:00': 1, '09:30': 1, '11:00': 1, '14:00': 1, '15:00': 1, '18:00': 1 },
  5: { '10:00': 1, '11:30': 1, '12:30': 1, '15:30': 1, '17:00': 1, '18:30': 1 },
  6: { '09:00': 1, '10:30': 1, '12:00': 1, '14:30': 1, '16:00': 1, '17:30': 1 }
};

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function isValidDate(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

function isActiveStatus(status) {
  return status === 'new' || status === 'confirmed';
}

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function sendError(res, status, message) {
  sendJson(res, status, { error: message });
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1_000_000) {
        reject(new Error('Слишком большой запрос'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error('Некорректный JSON'));
      }
    });
  });
}

function isDefaultBusy(doctorId, time) {
  return Boolean(DEFAULT_BUSY_SLOTS[doctorId] && DEFAULT_BUSY_SLOTS[doctorId][time]);
}

function isSlotBusy(data, doctorId, date, time, exceptBookingId = null) {
  if (isDefaultBusy(doctorId, time)) return true;
  return data.bookings.some(booking => {
    if (exceptBookingId && booking.id === exceptBookingId) return false;
    return booking.doctorId === doctorId && booking.date === date && booking.time === time && isActiveStatus(booking.status);
  });
}

function formatRuDate(date = new Date()) {
  return date.toLocaleDateString('ru-RU');
}

function serveStatic(req, res, pathname) {
  let filePath = pathname === '/' ? path.join(PUBLIC_DIR, 'index.html') : path.join(PUBLIC_DIR, pathname);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
}

async function handleApi(req, res, pathname, searchParams) {
  if (req.method === 'GET' && pathname === '/api/health') {
    return sendJson(res, 200, { ok: true, service: 'ArpiDent API' });
  }

  if (req.method === 'GET' && pathname === '/api/doctors') {
    const data = readDb();
    return sendJson(res, 200, data.doctors);
  }

  if (req.method === 'GET' && pathname === '/api/services') {
    const data = readDb();
    return sendJson(res, 200, data.services);
  }

  if (req.method === 'GET' && pathname === '/api/bookings') {
    const data = readDb();
    const bookings = [...data.bookings].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    return sendJson(res, 200, bookings);
  }

  if (req.method === 'GET' && pathname === '/api/slots') {
    const data = readDb();
    const doctorId = Number(searchParams.get('doctorId'));
    const date = String(searchParams.get('date') || '');

    if (!doctorId) return sendError(res, 400, 'Не выбран врач.');
    if (!isValidDate(date)) return sendError(res, 400, 'Некорректная дата.');
    if (!data.doctors.find(doctor => doctor.id === doctorId)) return sendError(res, 404, 'Врач не найден.');

    const slots = TIME_SLOTS.map(time => ({
      time,
      status: isSlotBusy(data, doctorId, date, time) ? 'busy' : 'free'
    }));

    return sendJson(res, 200, slots);
  }

  if (req.method === 'POST' && pathname === '/api/bookings') {
    const body = await parseBody(req);
    const data = readDb();

    const patientName = String(body.patient_name || body.name || '').trim();
    const phone = String(body.phone || '').trim();
    const email = String(body.email || '').trim();
    const comment = String(body.comment || '').trim();
    const doctorId = Number(body.doctor_id || body.doctorId);
    const serviceId = Number(body.service_id || body.serviceId);
    const fallbackServiceName = String(body.service_name || body.service || '').trim();
    const fallbackServicePrice = String(body.service_price || body.servicePrice || '').trim();
    const date = String(body.date || '').trim();
    const time = String(body.time || '').trim();

    if (!patientName) return sendError(res, 400, 'Введите имя пациента.');
    if (!phone) return sendError(res, 400, 'Введите телефон пациента.');
    if (!doctorId) return sendError(res, 400, 'Выберите врача.');
    if (!date || !isValidDate(date)) return sendError(res, 400, 'Выберите корректную дату.');
    if (!time || !TIME_SLOTS.includes(time)) return sendError(res, 400, 'Выберите корректное время.');

    const doctor = data.doctors.find(item => item.id === doctorId);
    if (!doctor) return sendError(res, 404, 'Врач не найден.');

    const service = serviceId ? findService(data, serviceId) : null;
    if (serviceId && !service) return sendError(res, 404, 'Услуга не найдена.');
    if (!service && !fallbackServiceName) return sendError(res, 400, 'Выберите услугу.');

    if (isSlotBusy(data, doctorId, date, time)) {
      return sendError(res, 409, 'Это время уже занято. Выберите другое окно.');
    }

    const booking = {
      id: data.counters.bookings++,
      name: patientName,
      phone,
      email,
      comment,
      doctorId,
      doctorName: doctor.name,
      serviceId: service ? service.id : null,
      service: service ? service.name : fallbackServiceName,
      servicePrice: service ? service.price : fallbackServicePrice,
      date,
      time,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    data.bookings.unshift(booking);
    writeDb(data);
    return sendJson(res, 201, booking);
  }

  const statusMatch = pathname.match(/^\/api\/bookings\/(\d+)\/status$/);
  if (req.method === 'PATCH' && statusMatch) {
    const body = await parseBody(req);
    const data = readDb();
    const id = Number(statusMatch[1]);
    const status = String(body.status || '').trim();
    const allowedStatuses = ['new', 'confirmed', 'cancelled', 'done'];

    if (!allowedStatuses.includes(status)) return sendError(res, 400, 'Некорректный статус записи.');

    const booking = data.bookings.find(item => item.id === id);
    if (!booking) return sendError(res, 404, 'Запись не найдена.');

    if (isActiveStatus(status) && isSlotBusy(data, booking.doctorId, booking.date, booking.time, id)) {
      return sendError(res, 409, 'Нельзя активировать запись: это время уже занято.');
    }

    booking.status = status;
    writeDb(data);
    return sendJson(res, 200, booking);
  }

  const deleteMatch = pathname.match(/^\/api\/bookings\/(\d+)$/);
  if (req.method === 'DELETE' && deleteMatch) {
    const data = readDb();
    const id = Number(deleteMatch[1]);
    const booking = data.bookings.find(item => item.id === id);
    if (!booking) return sendError(res, 404, 'Запись не найдена.');

    booking.status = 'cancelled';
    writeDb(data);
    return sendJson(res, 200, booking);
  }

  if (req.method === 'GET' && pathname === '/api/reviews') {
    const data = readDb();
    const reviews = [...data.reviews].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    return sendJson(res, 200, reviews);
  }

  if (req.method === 'POST' && pathname === '/api/reviews') {
    const body = await parseBody(req);
    const data = readDb();

    const name = String(body.patient_name || body.name || '').trim();
    const doctorId = body.doctor_id || body.doctorId ? Number(body.doctor_id || body.doctorId) : null;
    const rating = Number(body.rating);
    const text = String(body.text || '').trim();
    let doctorName = String(body.doctor_name || body.doctor || '').trim();
    const serviceName = String(body.service_name || body.service || '').trim();

    if (!name) return sendError(res, 400, 'Введите имя.');
    if (!rating || rating < 1 || rating > 5) return sendError(res, 400, 'Поставьте оценку от 1 до 5.');
    if (!text) return sendError(res, 400, 'Напишите текст отзыва.');

    if (doctorId) {
      const doctor = data.doctors.find(item => item.id === doctorId);
      if (!doctor) return sendError(res, 404, 'Врач не найден.');
      doctorName = doctor.name;
    }

    const review = {
      id: data.counters.reviews++,
      name,
      doctorId,
      doctor: doctorName,
      service: serviceName,
      rating,
      date: formatRuDate(),
      text,
      createdAt: new Date().toISOString()
    };

    data.reviews.unshift(review);
    writeDb(data);
    return sendJson(res, 201, review);
  }

  if (req.method === 'POST' && pathname === '/api/admin/login') {
    const body = await parseBody(req);
    const data = readDb();
    const login = String(body.login || '').trim();
    const password = String(body.password || '').trim();
    const admin = data.admins.find(item => item.login === login && item.password === password);

    if (!admin) return sendError(res, 401, 'Неверный логин или пароль.');
    return sendJson(res, 200, { success: true, message: 'Вход выполнен.' });
  }

  return sendError(res, 404, 'API endpoint не найден.');
}

const server = http.createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = decodeURIComponent(requestUrl.pathname);

    if (pathname.startsWith('/api/')) {
      return await handleApi(req, res, pathname, requestUrl.searchParams);
    }

    return serveStatic(req, res, pathname);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, error.message || 'Внутренняя ошибка сервера.');
  }
});

server.listen(PORT, () => {
  console.log(`ArpiDent app запущен: http://localhost:${PORT}`);
  console.log('Админ-панель: логин admin, пароль admin123');
});
