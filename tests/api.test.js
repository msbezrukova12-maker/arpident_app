const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const net = require('node:net');
const { spawn } = require('node:child_process');
const { hashPassword, verifyPassword } = require('../security');

function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
  });
}

async function awaitReady(base, child) {
  for (let i = 0; i < 80; i++) {
    if (child.exitCode !== null) throw new Error('Server stopped unexpectedly');
    try {
      const response = await fetch(base + '/api/health');
      if (response.ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error('Server failed to start');
}

test('passwords are salted and verified without plaintext storage', () => {
  const first = hashPassword('example password 123');
  const second = hashPassword('example password 123');
  assert.notEqual(first, second);
  assert.equal(verifyPassword('example password 123', first), true);
  assert.equal(verifyPassword('incorrect', first), false);
  assert.equal(verifyPassword('example password 123', 'admin123'), false);
});

test('authentication, authorization, booking flow and persistence', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'arpident-api-'));
  const dbPath = path.join(dir, 'test-db.json');
  const port = await findFreePort();
  const base = 'http://127.0.0.1:' + port;
  const child = spawn(process.execPath, ['server.js'], {
    cwd: path.join(__dirname, '..'),
    env: {
      ...process.env,
      PORT: String(port),
      DB_PATH: dbPath,
      ADMIN_LOGIN: 'demo-owner',
      ADMIN_PASSWORD: 'A-Strong-Demo-Password-123'
    },
    stdio: ['ignore', 'ignore', 'pipe']
  });
  let errors = '';
  child.stderr.on('data', chunk => { errors += chunk.toString(); });

  async function request(route, method = 'GET', body = undefined, cookie = undefined, otherHeaders = {}) {
    const response = await fetch(base + route, {
      method,
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(cookie ? { Cookie: cookie } : {}),
        ...otherHeaders
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {})
    });
    const rawCookie = response.headers.get('set-cookie');
    return {
      status: response.status,
      data: await response.json(),
      cookie: rawCookie ? rawCookie.split(';')[0] : null
    };
  }

  try {
    await awaitReady(base, child);
    assert.equal((await request('/api/health')).status, 200);
    assert.equal((await fetch(base + '/')).status, 200);
    assert.equal((await fetch(base + '/admin')).status, 200);
    assert.equal((await fetch(base + '/..%2Fserver.js')).status, 403);
    assert.equal((await request('/api/slots?doctorId=1&date=2026-02-30')).status, 400);
    const brokenJson = await fetch(base + '/api/admin/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{broken'
    });
    assert.equal(brokenJson.status, 400);
    assert.equal((await request('/api/bookings')).status, 401);
    assert.deepEqual((await request('/api/admin/session')).data, { authenticated: false });
    assert.equal((await request('/api/admin/login', 'POST', { login: 'demo-owner', password: 'bad' })).status, 401);
    assert.equal((await request('/api/admin/login', 'POST', {
      login: 'demo-owner', password: 'A-Strong-Demo-Password-123'
    }, undefined, { Origin: 'https://attacker.example' })).status, 403);
    assert.equal((await request('/api/users/register', 'POST', {
      name: 'Weak', phone: '+70000000000', password: '1234'
    })).status, 400);

    const a = await request('/api/users/register', 'POST', {
      name: 'Patient A', phone: '+70000000001', email: 'a@example.test', password: 'Patient-A-Password'
    });
    assert.equal(a.status, 201);
    assert.ok(a.cookie && a.cookie.startsWith('arpident_session='));
    assert.equal(a.data.password, undefined);
    assert.equal(a.data.passwordHash, undefined);

    const b = await request('/api/users/register', 'POST', {
      name: 'Patient B', phone: '+70000000002', email: 'b@example.test', password: 'Patient-B-Password'
    });
    assert.equal(b.status, 201);
    assert.notEqual(a.cookie, b.cookie);

    const disk = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    assert.ok(disk.users[0].passwordHash.startsWith('scrypt$'));
    assert.equal(disk.users[0].password, undefined);
    assert.equal(disk.admins, undefined);
    assert.equal((await request('/api/users/me', 'GET', undefined, a.cookie)).data.id, a.data.id);

    const aLogin = await request('/api/users/login', 'POST', {
      login: 'a@example.test', password: 'Patient-A-Password'
    });
    assert.equal(aLogin.status, 200);
    assert.ok(aLogin.cookie);

    const date = new Date(Date.now() + 10 * 86400 * 1000).toISOString().slice(0, 10);
    const booking = await request('/api/bookings', 'POST', {
      patient_name: 'Patient A', phone: '+70000000001', date, time: '14:30',
      doctor_id: 1, service_id: 1, user_id: b.data.id
    }, aLogin.cookie);
    assert.equal(booking.status, 201);
    assert.equal(booking.data.userId, a.data.id);

    const dupe = await request('/api/bookings', 'POST', {
      patient_name: 'Patient B', phone: '+70000000002', date, time: '14:30',
      doctor_id: 1, service_id: 1
    }, b.cookie);
    assert.equal(dupe.status, 409);

    const own = await request('/api/bookings', 'GET', undefined, aLogin.cookie);
    assert.equal(own.status, 200);
    assert.equal(own.data.length, 1);
    assert.equal((await request('/api/bookings', 'GET', undefined, b.cookie)).data.length, 0);
    assert.equal((await request('/api/bookings?userId=' + a.data.id, 'GET', undefined, b.cookie)).status, 403);
    assert.equal((await request('/api/bookings/' + booking.data.id + '/status', 'PATCH', { status: 'confirmed' })).status, 401);
    assert.equal((await request('/api/bookings/' + booking.data.id + '/status', 'PATCH', { status: 'confirmed' }, b.cookie)).status, 403);
    assert.equal((await request('/api/bookings/' + booking.data.id + '/status', 'PATCH', { status: 'confirmed' }, aLogin.cookie)).status, 403);
    assert.equal((await request('/api/bookings/' + booking.data.id, 'DELETE', undefined, b.cookie)).status, 403);

    const cancel = await request('/api/bookings/' + booking.data.id + '/status', 'PATCH', { status: 'cancelled' }, aLogin.cookie);
    assert.equal(cancel.status, 200);
    assert.equal(cancel.data.status, 'cancelled');

    const admin = await request('/api/admin/login', 'POST', {
      login: 'demo-owner', password: 'A-Strong-Demo-Password-123'
    });
    assert.equal(admin.status, 200);
    assert.ok(admin.cookie);
    assert.deepEqual((await request('/api/admin/session', 'GET', undefined, admin.cookie)).data, { authenticated: true });
    const all = await request('/api/bookings', 'GET', undefined, admin.cookie);
    assert.equal(all.data.length, 1);
    assert.equal((await request('/api/bookings/' + booking.data.id + '/status', 'PATCH', { status: 'confirmed' }, admin.cookie)).status, 200);
    assert.equal((await request('/api/logout', 'POST', undefined, admin.cookie)).status, 200);
    assert.equal((await request('/api/bookings', 'GET', undefined, admin.cookie)).status, 401);
    assert.equal((await request('/api/admin/session', 'GET', undefined, admin.cookie)).data.authenticated, false);
  } catch (error) {
    error.message += '\nServer stderr: ' + errors;
    throw error;
  } finally {
    if (child.exitCode === null) child.kill('SIGTERM');
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
