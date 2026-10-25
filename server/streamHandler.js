import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import { ZipArchive } from 'archiver';
import { isPathAllowedForUser } from './fileManager.js';

export async function handleFileDownload(req, res) {
  const targetPath = path.resolve(req.query.path);

  if (!isPathAllowedForUser(targetPath, req.user)) {
    return res.status(403).json({ success: false, error: 'Access denied. You do not have permission to download this item.' });
  }

  if (!fs.existsSync(targetPath)) {
    return res.status(404).json({ success: false, error: 'File not found' });
  }

  const stat = await fs.promises.stat(targetPath);

  // If it's a directory, zip and stream
  if (stat.isDirectory()) {
    const folderName = path.basename(targetPath) || 'folder';
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(folderName)}.zip"`);

    const archive = new ZipArchive({ zlib: { level: 6 } });
    archive.on('error', (err) => {
      console.error('Archive error:', err);
      if (!res.headersSent) {
        res.status(500).send('Error creating zip archive');
      }
    });

    archive.pipe(res);
    archive.directory(targetPath, folderName);
    await archive.finalize();
    return;
  }

  // Single file download
  const filename = path.basename(targetPath);
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
  res.setHeader('Content-Type', mime.lookup(targetPath) || 'application/octet-stream');
  res.setHeader('Content-Length', stat.size);

  const stream = fs.createReadStream(targetPath);
  stream.pipe(res);
}

export async function handleFileStream(req, res) {
  const targetPath = path.resolve(req.query.path);

  if (!isPathAllowedForUser(targetPath, req.user)) {
    return res.status(403).send('Access denied');
  }

  if (!fs.existsSync(targetPath)) {
    return res.status(404).send('File not found');
  }

  const stat = await fs.promises.stat(targetPath);
  if (stat.isDirectory()) {
    return res.status(400).send('Cannot stream a directory');
  }

  const fileSize = stat.size;
  const mimeType = mime.lookup(targetPath) || 'application/octet-stream';
  const range = req.headers.range;

  // Support HTTP 206 Partial Content for video/audio seeking
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize || end >= fileSize || start > end) {
      res.setHeader('Content-Range', `bytes */${fileSize}`);
      return res.status(416).send('Requested range not satisfiable');
    }

    const chunksize = end - start + 1;
    const file = fs.createReadStream(targetPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': mimeType
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': mimeType,
      'Accept-Ranges': 'bytes'
    };
    res.writeHead(200, head);
    fs.createReadStream(targetPath).pipe(res);
  }
}
