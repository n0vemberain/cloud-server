import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = path.join(process.cwd(), 'data');
const DOWNLOADS_FILE = path.join(DATA_DIR, 'downloads.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadDownloads() {
  ensureDataDir();
  if (!fs.existsSync(DOWNLOADS_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(DOWNLOADS_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return [];
  }
}

function saveDownloads(downloads) {
  ensureDataDir();
  fs.writeFileSync(DOWNLOADS_FILE, JSON.stringify(downloads, null, 2), 'utf-8');
}

export function recordDownloadActivity({ user, filePath, fileName, fileSize, isDirectory }) {
  const downloads = loadDownloads();
  const id = 'dl_' + crypto.randomBytes(6).toString('hex');
  const now = new Date().toISOString();

  const activity = {
    id,
    userId: user?.id || user?.username || 'user',
    username: user?.username || 'unknown',
    name: user?.name || user?.username || 'User',
    role: user?.role || 'guest',
    filePath: filePath || '',
    fileName: fileName || path.basename(filePath || 'file'),
    fileSize: typeof fileSize === 'number' ? fileSize : 0,
    isDirectory: Boolean(isDirectory),
    read: false,
    downloadedAt: now
  };

  downloads.unshift(activity);

  // Keep last 150 downloads
  if (downloads.length > 150) {
    downloads.length = 150;
  }

  saveDownloads(downloads);
  return activity;
}

export function getDownloadActivities() {
  const downloads = loadDownloads();
  return downloads.sort((a, b) => new Date(b.downloadedAt) - new Date(a.downloadedAt));
}

export function getUnreadDownloadsCount() {
  const downloads = loadDownloads();
  return downloads.filter(d => !d.read).length;
}

export function markDownloadsAsRead(downloadId = null) {
  const downloads = loadDownloads();
  if (downloadId) {
    const item = downloads.find(d => d.id === downloadId);
    if (item) item.read = true;
  } else {
    downloads.forEach(d => { d.read = true; });
  }
  saveDownloads(downloads);
  return { success: true };
}

export function clearDownloadActivities() {
  saveDownloads([]);
  return { success: true };
}
