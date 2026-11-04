const crypto = require('crypto');

const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const COOKIE_NAME = 'arpident_session';
const sessions = new Map();
const loginAttempts = new Map();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return `scrypt$${salt}$${derived}`;
}

function verifyPassword(password, encoded) {
  if (typeof encoded !== 'string') return false;
  const parts = encoded.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt' || !/^[a-f0-9]{32}$/.test(parts[1]) || !/^[a-f0-9]{128}$/.test(parts[2])) return false;
  const expected = Buffer.from(parts[2], 'hex');
  const actual = crypto.scryptSync(String(password), parts[1], 64);
  return crypto.timingSafeEqual(actual, expected);
}

function secureEquals(a, b) {
  const ah = crypto.createHash('sha256').update(String(a)).digest();
  const bh = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ah, bh);
}

function cookieOptions(req, maxAge) {
  const https = req.socket.encrypted || req.headers['x-forwarded-proto'] === 'https';
  return `HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}${https ? '; Secure' : ''}`;
}

function readToken(req) {
  const raw = req.headers.cookie || '';
  const match = raw.split(';').map(s => s.trim()).find(s => s.startsWith(COOKIE_NAME + '='));
  return match ? match.slice(COOKIE_NAME.length + 1) : null;
}

function createSession(req, res, role, userId = null) {
  const oldToken = readToken(req);
  if (oldToken) sessions.delete(oldToken);
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, { role, userId, expires: Date.now() + SESSION_TTL_MS });
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${token}; ${cookieOptions(req, SESSION_TTL_MS / 1000)}`);
}

function getSession(req) {
  const token = readToken(req);
  const session = token && sessions.get(token);
  if (!session) return null;
  if (session.expires <= Date.now()) {
    sessions.delete(token);
    return null;
  }
  return session;
}

function clearSession(req, res) {
  const token = readToken(req);
  if (token) sessions.delete(token);
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; ${cookieOptions(req, 0)}`);
}

function loginAllowed(ip) {
  const now = Date.now();
  const prior = loginAttempts.get(ip);
  if (!prior || prior.reset <= now) {
    loginAttempts.set(ip, { count: 0, reset: now + 15 * 60 * 1000 });
    return true;
  }
  return prior.count < 10;
}

function recordLoginFailure(ip) {
  const item = loginAttempts.get(ip) || { count: 0, reset: Date.now() + 15 * 60 * 1000 };
  item.count += 1;
  loginAttempts.set(ip, item);
}

function resetLoginFailures(ip) {
  loginAttempts.delete(ip);
}

function originAllowed(req) {
  if (!req.headers.origin) return true;
  try {
    return new URL(req.headers.origin).host === req.headers.host;
  } catch {
    return false;
  }
}

module.exports = {
  hashPassword, verifyPassword, secureEquals,
  createSession, getSession, clearSession,
  loginAllowed, recordLoginFailure, resetLoginFailures, originAllowed
};
