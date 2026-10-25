import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import QRCode from 'qrcode';

import { loadConfig, updateServerName } from './config.js';
import {
  authMiddleware,
  requireAdmin,
  checkPermission,
  handleLogin,
  handleLogout,
  handleAuthStatus,
  handleChangePassword
} from './auth.js';
import {
  listDirectory,
  readTextFile,
  writeTextFile,
  createDirectory,
  createFile,
  renameItem,
  deleteItem,
  searchInDirectory
} from './fileManager.js';
import { handleFileDownload, handleFileStream } from './streamHandler.js';
import { getMacMetrics } from './systemInfo.js';
import { startTunnel, stopTunnel, getTunnelStatus } from './tunnelManager.js';
import { getActiveSessions, getSessionHistory, revokeSession } from './sessionTracker.js';
import { getGuests, createGuest, deleteGuest, updateGuestPassword, updateGuestPermissions } from './userManager.js';

export function createApp() {
  const app = express();
  const cfg = loadConfig();

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  app.use(cookieParser());

  // Static directory for client UI assets
  const publicDir = path.join(process.cwd(), 'public');
  app.use(express.static(publicDir));

  // Multer setup for file uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = req.headers['x-upload-dir'] || req.query.uploadDir || cfg.defaultRootDir;
      const safeDir = path.resolve(uploadDir);
      if (!fs.existsSync(safeDir)) {
        fs.mkdirSync(safeDir, { recursive: true });
      }
      cb(null, safeDir);
    },
    filename: (req, file, cb) => {
      const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
      cb(null, originalName);
    }
  });
  const upload = multer({ storage });

  // ---------------- AUTH ROUTES ----------------
  app.post('/api/auth/login', handleLogin);
  app.post('/api/auth/logout', handleLogout);
  app.get('/api/auth/status', handleAuthStatus);
  app.post('/api/auth/change-password', authMiddleware, handleChangePassword);
  app.post('/api/settings/server-name', authMiddleware, requireAdmin, (req, res) => {
    try {
      const { name } = req.body;
      const updated = updateServerName(name, cfg);
      res.json({ success: true, serverName: updated });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // ---------------- CONNECTION & ACTIVITY TRACKING (Admin Only) ----------------
  app.get('/api/activity/connections', authMiddleware, requireAdmin, (req, res) => {
    try {
      const active = getActiveSessions();
      const history = getSessionHistory();
      res.json({
        success: true,
        activeCount: active.filter(s => s.isOnline).length,
        active,
        history
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/activity/revoke', authMiddleware, requireAdmin, (req, res) => {
    try {
      const { sessionId } = req.body;
      const revoked = revokeSession(sessionId);
      res.json({ success: true, revoked });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // ---------------- GUEST MANAGEMENT ROUTES (Admin Only) ----------------
  app.get('/api/guests', authMiddleware, requireAdmin, (req, res) => {
    try {
      const guests = getGuests();
      res.json({ success: true, guests });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/guests/create', authMiddleware, requireAdmin, (req, res) => {
    try {
      const { username, password, permissions } = req.body;
      const guest = createGuest(username, password, permissions);
      res.json({ success: true, guest });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.post('/api/guests/delete', authMiddleware, requireAdmin, (req, res) => {
    try {
      const { id } = req.body;
      const result = deleteGuest(id);
      res.json({ success: true, ...result });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.post('/api/guests/update', authMiddleware, requireAdmin, (req, res) => {
    try {
      const { id, password, permissions } = req.body;
      if (password) updateGuestPassword(id, password);
      if (permissions) updateGuestPermissions(id, permissions);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // ---------------- FILE ROUTES (Protected + Permission checked) ----------------
  app.get('/api/files/browse', authMiddleware, async (req, res) => {
    try {
      const targetPath = req.query.path || cfg.defaultRootDir;
      const showHidden = req.query.showHidden === 'true';
      const result = await listDirectory(targetPath, showHidden);
      res.json({ success: true, ...result, user: req.user });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.get('/api/files/search', authMiddleware, async (req, res) => {
    try {
      const { path: searchPath, q } = req.query;
      if (!q) return res.json({ success: true, results: [] });
      const results = await searchInDirectory(searchPath || cfg.defaultRootDir, q);
      res.json({ success: true, results });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.get('/api/files/read', authMiddleware, async (req, res) => {
    try {
      const result = await readTextFile(req.query.path);
      res.json({ success: true, ...result });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.post('/api/files/write', authMiddleware, checkPermission('canWrite'), async (req, res) => {
    try {
      const { path: filePath, content } = req.body;
      const result = await writeTextFile(filePath, content);
      res.json(result);
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.post('/api/files/mkdir', authMiddleware, checkPermission('canWrite'), async (req, res) => {
    try {
      const { path: dirPath } = req.body;
      const result = await createDirectory(dirPath);
      res.json(result);
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.post('/api/files/create', authMiddleware, checkPermission('canWrite'), async (req, res) => {
    try {
      const { path: filePath } = req.body;
      const result = await createFile(filePath);
      res.json(result);
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.post('/api/files/rename', authMiddleware, checkPermission('canWrite'), async (req, res) => {
    try {
      const { oldPath, newName } = req.body;
      const result = await renameItem(oldPath, newName);
      res.json(result);
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.post('/api/files/delete', authMiddleware, checkPermission('canDelete'), async (req, res) => {
    try {
      const { path: targetPath, permanent } = req.body;
      const result = await deleteItem(targetPath, permanent);
      res.json(result);
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.post('/api/files/upload', authMiddleware, checkPermission('canWrite'), upload.array('files'), (req, res) => {
    try {
      const files = req.files || [];
      res.json({
        success: true,
        message: `${files.length} file(s) uploaded successfully!`,
        files: files.map(f => ({ name: f.originalname, size: f.size }))
      });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.get('/api/files/download', authMiddleware, checkPermission('canDownload'), handleFileDownload);
  app.get('/api/files/stream', authMiddleware, handleFileStream);

  // ---------------- SYSTEM & TUNNEL ROUTES ----------------
  app.get('/api/system/metrics', authMiddleware, async (req, res) => {
    try {
      const metrics = await getMacMetrics();
      res.json({ success: true, ...metrics });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/system/tunnel', authMiddleware, (req, res) => {
    res.json(getTunnelStatus());
  });

  app.post('/api/system/tunnel/toggle', authMiddleware, requireAdmin, async (req, res) => {
    const { action } = req.body;
    if (action === 'start') {
      const status = await startTunnel(cfg.port);
      return res.json(status);
    } else {
      const status = stopTunnel();
      return res.json(status);
    }
  });

  app.get('/api/system/qr', authMiddleware, async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send('URL required');
    try {
      const qrDataUrl = await QRCode.toDataURL(url, { margin: 2, scale: 6 });
      res.json({ success: true, qr: qrDataUrl });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/', authMiddleware, (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });

  return app;
}
