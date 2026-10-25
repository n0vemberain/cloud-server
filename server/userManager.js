import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = path.join(process.cwd(), 'data');
const GUESTS_FILE = path.join(DATA_DIR, 'guests.json');
const REQUESTS_FILE = path.join(DATA_DIR, 'permission_requests.json');

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

export function loadGuests() {
  if (fs.existsSync(GUESTS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(GUESTS_FILE, 'utf-8'));
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error('Error loading guests:', e);
      return [];
    }
  }
  return [];
}

export function saveGuests(guests) {
  try {
    fs.writeFileSync(GUESTS_FILE, JSON.stringify(guests, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving guests:', e);
  }
}

export function loadRequests() {
  if (fs.existsSync(REQUESTS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(REQUESTS_FILE, 'utf-8'));
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error('Error loading permission requests:', e);
      return [];
    }
  }
  return [];
}

export function saveRequests(requests) {
  try {
    fs.writeFileSync(REQUESTS_FILE, JSON.stringify(requests, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving permission requests:', e);
  }
}

export function createPermissionRequest(guestId, username, permission) {
  const allowed = ['canWrite', 'canDelete', 'canDownload'];
  if (!allowed.includes(permission)) {
    throw new Error('Invalid permission type requested.');
  }

  const permissionLabels = {
    canWrite: 'File Upload & Editing',
    canDelete: 'File Deleting',
    canDownload: 'File Downloads'
  };

  const requests = loadRequests();
  // Check if existing pending request already exists
  const existing = requests.find(r => r.guestId === guestId && r.permission === permission && r.status === 'pending');
  if (existing) {
    return existing;
  }

  const newReq = {
    id: 'req_' + crypto.randomBytes(6).toString('hex'),
    guestId,
    username,
    permission,
    permissionLabel: permissionLabels[permission] || permission,
    status: 'pending',
    createdAt: new Date().toISOString(),
    resolvedAt: null
  };

  requests.push(newReq);
  saveRequests(requests);
  return newReq;
}

export function getMyRequests(guestId) {
  const requests = loadRequests();
  return requests.filter(r => r.guestId === guestId);
}

export function getPendingRequests() {
  const requests = loadRequests();
  return requests.filter(r => r.status === 'pending');
}

export function approvePermissionRequest(requestId) {
  const requests = loadRequests();
  const req = requests.find(r => r.id === requestId);
  if (!req) {
    throw new Error('Request not found.');
  }

  // Update guest permissions in guests.json
  const guests = loadGuests();
  const guest = guests.find(g => g.id === req.guestId || g.username.toLowerCase() === req.username.toLowerCase());
  if (guest) {
    guest.permissions = guest.permissions || {};
    guest.permissions[req.permission] = true;
    saveGuests(guests);
  }

  req.status = 'approved';
  req.resolvedAt = new Date().toISOString();
  saveRequests(requests);

  return { success: true, request: req };
}

export function declinePermissionRequest(requestId) {
  const requests = loadRequests();
  const req = requests.find(r => r.id === requestId);
  if (!req) {
    throw new Error('Request not found.');
  }

  req.status = 'declined';
  req.resolvedAt = new Date().toISOString();
  saveRequests(requests);

  return { success: true, request: req };
}

export function getGuests() {
  const guests = loadGuests();
  return guests.map(g => ({
    id: g.id,
    username: g.username,
    permissions: g.permissions || { canWrite: false, canDelete: false, canDownload: true },
    createdAt: g.createdAt
  }));
}

export function createGuest(username, password, permissions = {}) {
  const cleanUsername = username.trim().toLowerCase();
  if (!cleanUsername || cleanUsername === 'admin') {
    throw new Error('Invalid username. "admin" is reserved.');
  }
  if (!password || password.length < 4) {
    throw new Error('Password must be at least 4 characters.');
  }

  const guests = loadGuests();
  if (guests.some(g => g.username.toLowerCase() === cleanUsername)) {
    throw new Error(`Username "${cleanUsername}" already exists.`);
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const hash = hashPassword(password, salt);

  const newGuest = {
    id: 'guest_' + crypto.randomBytes(6).toString('hex'),
    username: cleanUsername,
    salt,
    hash,
    role: 'guest',
    permissions: {
      canWrite: permissions.canWrite ?? false,
      canDelete: permissions.canDelete ?? false,
      canDownload: permissions.canDownload ?? true
    },
    createdAt: new Date().toISOString()
  };

  guests.push(newGuest);
  saveGuests(guests);

  return {
    id: newGuest.id,
    username: newGuest.username,
    permissions: newGuest.permissions,
    createdAt: newGuest.createdAt
  };
}

export function deleteGuest(id) {
  const guests = loadGuests();
  const index = guests.findIndex(g => g.id === id);
  if (index === -1) {
    throw new Error('Guest not found.');
  }
  const deleted = guests.splice(index, 1)[0];
  saveGuests(guests);
  return { success: true, username: deleted.username };
}

export function updateGuestPassword(id, newPassword) {
  if (!newPassword || newPassword.length < 4) {
    throw new Error('Password must be at least 4 characters.');
  }
  const guests = loadGuests();
  const guest = guests.find(g => g.id === id);
  if (!guest) {
    throw new Error('Guest not found.');
  }
  const salt = crypto.randomBytes(16).toString('hex');
  guest.salt = salt;
  guest.hash = hashPassword(newPassword, salt);
  saveGuests(guests);
  return { success: true };
}

export function updateGuestPermissions(id, permissions) {
  const guests = loadGuests();
  const guest = guests.find(g => g.id === id);
  if (!guest) {
    throw new Error('Guest not found.');
  }
  guest.permissions = {
    ...guest.permissions,
    ...permissions
  };
  saveGuests(guests);
  return { success: true, permissions: guest.permissions };
}

export function verifyGuestPassword(guest, password) {
  const hash = hashPassword(password, guest.salt);
  return hash === guest.hash;
}

export function authenticateUser(username, password, adminConfig) {
  const u = (username || 'admin').trim().toLowerCase();

  // Admin authentication
  if (u === 'admin') {
    const adminHash = hashPassword(password, adminConfig.passwordSalt);
    if (adminHash === adminConfig.passwordHash) {
      return {
        success: true,
        user: {
          username: 'admin',
          role: 'admin',
          permissions: { canWrite: true, canDelete: true, canDownload: true }
        }
      };
    }
    return { success: false, error: 'Invalid password for admin.' };
  }

  // Guest authentication
  const guests = loadGuests();
  const guest = guests.find(g => g.username.toLowerCase() === u);
  if (!guest) {
    return { success: false, error: `User "${u}" not found.` };
  }

  if (verifyGuestPassword(guest, password)) {
    return {
      success: true,
      user: {
        id: guest.id,
        username: guest.username,
        role: 'guest',
        permissions: guest.permissions || { canWrite: false, canDelete: false, canDownload: true }
      }
    };
  }

  return { success: false, error: 'Invalid password.' };
}
