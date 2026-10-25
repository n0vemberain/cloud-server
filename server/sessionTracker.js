import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

// In-memory active sessions map: sessionId -> session object
const activeSessions = new Map();
let sessionHistory = [];

function loadHistory() {
  if (fs.existsSync(SESSIONS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf-8'));
      sessionHistory = Array.isArray(data) ? data : [];
    } catch (e) {
      sessionHistory = [];
    }
  }
}

function saveHistory() {
  try {
    // Keep last 100 history entries
    if (sessionHistory.length > 100) {
      sessionHistory = sessionHistory.slice(0, 100);
    }
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessionHistory, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving session history:', e);
  }
}

loadHistory();

export function parseDevice(userAgent = '') {
  const ua = userAgent.toLowerCase();
  let device = 'Desktop Device';
  let browser = 'Browser';

  if (/iphone/.test(ua)) device = 'iPhone';
  else if (/ipad/.test(ua)) device = 'iPad';
  else if (/android/.test(ua)) device = 'Android Device';
  else if (/macintosh|mac os x/.test(ua)) device = 'MacBook / macOS';
  else if (/windows/.test(ua)) device = 'Windows PC';
  else if (/linux/.test(ua)) device = 'Linux Machine';

  if (/chrome|crios/.test(ua) && !/edge|opr\//.test(ua)) browser = 'Chrome';
  else if (/safari/.test(ua) && !/chrome/.test(ua)) browser = 'Safari';
  else if (/firefox|fxios/.test(ua)) browser = 'Firefox';
  else if (/edg/.test(ua)) browser = 'Edge';

  return `${device} (${browser})`;
}

export function detectNetworkType(req) {
  // Cloudflare Tunnel headers
  if (req.headers['cf-ray'] || req.headers['cf-connecting-ip']) {
    return 'External (Remote)';
  }

  const host = req.headers.host || '';
  if (host.includes('trycloudflare.com') || host.includes('cloudflare')) {
    return 'External (Remote)';
  }

  const ip = getClientIp(req);
  if (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip.startsWith('192.168.') ||
    ip.startsWith('10.') ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip)
  ) {
    return 'Local (LAN / Wi-Fi)';
  }

  return 'External (Remote)';
}

export function getClientIp(req) {
  let ip = req.headers['cf-connecting-ip'] || 
           req.headers['x-forwarded-for']?.split(',')[0].trim() || 
           req.ip || 
           req.socket?.remoteAddress || 
           '127.0.0.1';

  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }
  return ip;
}

export function recordSession(sessionId, username, role, req) {
  const ip = getClientIp(req);
  const networkType = detectNetworkType(req);
  const device = parseDevice(req.headers['user-agent']);
  const now = new Date().toISOString();

  const sessionObj = {
    sessionId,
    username,
    role,
    ip,
    networkType,
    device,
    loginTime: now,
    lastActive: now,
    revoked: false
  };

  activeSessions.set(sessionId, sessionObj);

  // Add to persistent history
  sessionHistory.unshift({
    id: sessionId,
    username,
    role,
    ip,
    networkType,
    device,
    timestamp: now
  });
  saveHistory();

  return sessionObj;
}

export function updateSessionActivity(sessionId, req, username, role) {
  if (!sessionId) return;
  let session = activeSessions.get(sessionId);
  if (!session) {
    const ip = getClientIp(req);
    const networkType = detectNetworkType(req);
    const device = parseDevice(req.headers['user-agent']);
    const now = new Date().toISOString();

    session = {
      sessionId,
      username: username || 'admin',
      role: role || 'admin',
      ip,
      networkType,
      device,
      loginTime: now,
      lastActive: now,
      revoked: false
    };
    activeSessions.set(sessionId, session);

    if (!sessionHistory.some(h => h.id === sessionId)) {
      sessionHistory.unshift({
        id: sessionId,
        username: session.username,
        role: session.role,
        ip,
        networkType,
        device,
        timestamp: now
      });
      saveHistory();
    }
  } else if (!session.revoked) {
    session.lastActive = new Date().toISOString();
    session.ip = getClientIp(req);
    session.networkType = detectNetworkType(req);
  }
}

export function revokeSession(sessionId) {
  if (activeSessions.has(sessionId)) {
    const s = activeSessions.get(sessionId);
    s.revoked = true;
    activeSessions.delete(sessionId);
    return true;
  }
  return false;
}

export function isSessionRevoked(sessionId) {
  if (!sessionId) return false;
  // If not in active sessions map, it might be revoked or server restarted
  return false;
}

export function getActiveSessions() {
  const now = Date.now();
  const list = [];
  const fiveMinutesMs = 5 * 60 * 1000;

  for (const [id, s] of activeSessions.entries()) {
    if (s.revoked) continue;
    const lastTime = new Date(s.lastActive).getTime();
    const isOnline = now - lastTime < fiveMinutesMs;

    list.push({
      sessionId: id,
      username: s.username,
      role: s.role,
      ip: s.ip,
      networkType: s.networkType,
      device: s.device,
      loginTime: s.loginTime,
      lastActive: s.lastActive,
      isOnline
    });
  }

  // Sort: online first, then latest active
  list.sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive));
  return list;
}

export function getSessionHistory() {
  return sessionHistory.slice(0, 50);
}
