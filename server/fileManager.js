import fs from 'fs';
import path from 'path';
import os from 'os';
import mime from 'mime-types';

export function getBookmarks() {
  const home = os.homedir();
  const isWin = process.platform === 'win32';
  const rootDrive = isWin ? (process.env.SystemDrive || 'C:') + '\\' : '/';
  const rootLabel = isWin ? `Local Disk (${rootDrive})` : 'Root (Macintosh HD)';

  const bookmarks = [
    { name: 'Home', path: home, icon: 'home' },
    { name: 'Desktop', path: path.join(home, 'Desktop'), icon: 'desktop' },
    { name: 'Documents', path: path.join(home, 'Documents'), icon: 'document' },
    { name: 'Downloads', path: path.join(home, 'Downloads'), icon: 'download' },
    { name: 'Pictures', path: path.join(home, 'Pictures'), icon: 'image' },
    { name: 'Music', path: path.join(home, 'Music'), icon: 'music' },
    { name: isWin ? 'Videos' : 'Movies', path: path.join(home, isWin ? 'Videos' : 'Movies'), icon: 'video' },
    { name: rootLabel, path: rootDrive, icon: 'server' }
  ];
  return bookmarks.filter(b => fs.existsSync(b.path));
}

export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const folderSizeCache = new Map();

// Calculate directory size and file count
export async function getDirectorySize(dirPath, maxDepth = 2) {
  let totalBytes = 0;
  let fileCount = 0;
  let folderCount = 0;

  async function walk(currentPath, depth) {
    if (depth > maxDepth) return;
    try {
      const entries = await fs.promises.readdir(currentPath, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith('.')) continue;
        if (entry.name === 'node_modules' || entry.name === 'Library' || entry.name === '.git') continue;
        const full = path.join(currentPath, entry.name);
        try {
          if (entry.isDirectory()) {
            folderCount++;
            await walk(full, depth + 1);
          } else if (entry.isFile()) {
            const st = await fs.promises.stat(full);
            totalBytes += st.size;
            fileCount++;
          }
        } catch (e) {}
      }
    } catch (e) {}
  }

  await walk(dirPath, 0);
  return {
    totalBytes,
    fileCount,
    folderCount,
    formatted: formatBytes(totalBytes)
  };
}

export async function listDirectory(targetPath, showHidden = false) {
  const safePath = path.resolve(targetPath || os.homedir());
  
  if (!fs.existsSync(safePath)) {
    throw new Error('Directory does not exist');
  }

  const stat = await fs.promises.stat(safePath);
  if (!stat.isDirectory()) {
    throw new Error('Specified path is not a directory');
  }

  const entries = await fs.promises.readdir(safePath, { withFileTypes: true });
  let currentTotalBytes = 0;

  const dirEntries = [];
  const fileEntries = [];

  for (const entry of entries) {
    if (!showHidden && entry.name.startsWith('.')) {
      continue;
    }
    const itemPath = path.join(safePath, entry.name);
    try {
      const itemStat = await fs.promises.stat(itemPath);
      if (entry.isDirectory()) {
        dirEntries.push({ entry, itemPath, itemStat });
      } else {
        fileEntries.push({ entry, itemPath, itemStat });
      }
    } catch (err) {}
  }

  // Calculate folder sizes in parallel with in-memory caching
  const dirItems = await Promise.all(dirEntries.map(async ({ entry, itemPath, itemStat }) => {
    let dirInfo = folderSizeCache.get(itemPath);
    if (!dirInfo || dirInfo.mtimeMs !== itemStat.mtimeMs) {
      try {
        dirInfo = await getDirectorySize(itemPath, 2);
        dirInfo.mtimeMs = itemStat.mtimeMs;
        folderSizeCache.set(itemPath, dirInfo);
      } catch (e) {
        dirInfo = { totalBytes: 0, fileCount: 0, formatted: '0 B' };
      }
    }
    currentTotalBytes += dirInfo.totalBytes;

    return {
      name: entry.name,
      path: itemPath,
      isDirectory: true,
      size: dirInfo.totalBytes,
      sizeFormatted: dirInfo.totalBytes > 0 ? dirInfo.formatted : (dirInfo.fileCount === 0 ? 'Empty' : '0 B'),
      itemCount: dirInfo.fileCount,
      mtime: itemStat.mtime.toISOString(),
      mime: 'folder',
      extension: '',
      isHidden: entry.name.startsWith('.')
    };
  }));

  // Process files
  const fileItems = fileEntries.map(({ entry, itemPath, itemStat }) => {
    currentTotalBytes += itemStat.size;
    return {
      name: entry.name,
      path: itemPath,
      isDirectory: false,
      size: itemStat.size,
      sizeFormatted: formatBytes(itemStat.size),
      itemCount: 0,
      mtime: itemStat.mtime.toISOString(),
      mime: mime.lookup(itemPath) || 'application/octet-stream',
      extension: path.extname(entry.name).toLowerCase(),
      isHidden: entry.name.startsWith('.')
    };
  });

  const items = [...dirItems, ...fileItems];
  const currentFolderCount = dirEntries.length;
  const currentFileCount = fileEntries.length;

  // Sort: directories first, then alphabetically
  items.sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1;
    if (!a.isDirectory && b.isDirectory) return 1;
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
  });

  // Calculate breadcrumbs
  const parts = safePath.split(path.sep);
  const breadcrumbs = [];
  let currentAcc = '';
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (i === 0 && part === '') {
      currentAcc = '/';
      breadcrumbs.push({ name: 'Root', path: '/' });
    } else if (i === 0 && /^[a-zA-Z]:$/.test(part)) {
      currentAcc = part + path.sep;
      breadcrumbs.push({ name: part, path: currentAcc });
    } else if (part) {
      currentAcc = currentAcc ? path.join(currentAcc, part) : part;
      breadcrumbs.push({ name: part, path: currentAcc });
    }
  }

  return {
    currentPath: safePath,
    parentPath: path.dirname(safePath) === safePath ? null : path.dirname(safePath),
    breadcrumbs,
    items,
    bookmarks: getBookmarks(),
    folderStats: {
      totalFiles: currentFileCount,
      totalFolders: currentFolderCount,
      totalItems: currentFileCount + currentFolderCount,
      totalBytes: currentTotalBytes,
      totalFormatted: formatBytes(currentTotalBytes),
      summary: `${currentFileCount + currentFolderCount} items (${formatBytes(currentTotalBytes)})`
    }
  };
}

export async function readTextFile(filePath) {
  const safePath = path.resolve(filePath);
  const stat = await fs.promises.stat(safePath);
  
  if (stat.size > 15 * 1024 * 1024) {
    throw new Error('File is too large to open in browser editor (>15MB). Please download it instead.');
  }

  const content = await fs.promises.readFile(safePath, 'utf-8');
  return {
    path: safePath,
    name: path.basename(safePath),
    size: stat.size,
    content,
    mime: mime.lookup(safePath) || 'text/plain'
  };
}

export async function writeTextFile(filePath, content) {
  const safePath = path.resolve(filePath);
  await fs.promises.writeFile(safePath, content, 'utf-8');
  return { success: true, path: safePath };
}

export async function createDirectory(dirPath) {
  const safePath = path.resolve(dirPath);
  await fs.promises.mkdir(safePath, { recursive: true });
  return { success: true, path: safePath };
}

export async function createFile(filePath) {
  const safePath = path.resolve(filePath);
  if (fs.existsSync(safePath)) {
    throw new Error('File already exists');
  }
  await fs.promises.writeFile(safePath, '', 'utf-8');
  return { success: true, path: safePath };
}

export async function renameItem(oldPath, newName) {
  const safeOld = path.resolve(oldPath);
  const dir = path.dirname(safeOld);
  const safeNew = path.join(dir, newName);

  if (fs.existsSync(safeNew)) {
    throw new Error('An item with that name already exists');
  }

  await fs.promises.rename(safeOld, safeNew);
  return { success: true, oldPath: safeOld, newPath: safeNew };
}

export async function deleteItem(targetPath, permanent = false) {
  const safePath = path.resolve(targetPath);
  if (!fs.existsSync(safePath)) {
    throw new Error('Item does not exist');
  }

  const isWin = process.platform === 'win32';
  const protectedPaths = isWin
    ? [
        (process.env.SystemDrive || 'C:') + '\\',
        path.join(process.env.SystemDrive || 'C:\\', 'Windows'),
        path.join(process.env.SystemDrive || 'C:\\', 'Program Files'),
        path.join(process.env.SystemDrive || 'C:\\', 'Program Files (x86)'),
        os.homedir()
      ].map(p => path.resolve(p).toLowerCase())
    : ['/', '/System', '/Library', '/bin', '/sbin', '/usr', os.homedir()].map(p => path.resolve(p));

  const checkPath = isWin ? safePath.toLowerCase() : safePath;
  if (protectedPaths.includes(checkPath)) {
    throw new Error('Cannot delete protected system or home directory');
  }

  if (!permanent) {
    const trashDir = path.join(os.homedir(), '.Trash');
    if (fs.existsSync(trashDir)) {
      try {
        let dest = path.join(trashDir, path.basename(safePath));
        if (fs.existsSync(dest)) {
          dest = path.join(trashDir, `${Date.now()}_${path.basename(safePath)}`);
        }
        await fs.promises.rename(safePath, dest);
        return { success: true, trashed: true, path: safePath };
      } catch (err) {}
    }
  }

  await fs.promises.rm(safePath, { recursive: true, force: true });
  return { success: true, trashed: false, path: safePath };
}

export async function searchInDirectory(targetDir, query, maxResults = 50) {
  const results = [];
  const q = query.toLowerCase();

  async function walk(dir, depth = 0) {
    if (depth > 4 || results.length >= maxResults) return;
    try {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith('.')) continue;
        const fullPath = path.join(dir, entry.name);

        if (entry.name.toLowerCase().includes(q)) {
          const isDir = entry.isDirectory();
          results.push({
            name: entry.name,
            path: fullPath,
            isDirectory: isDir,
            mime: isDir ? 'folder' : (mime.lookup(fullPath) || 'application/octet-stream')
          });
        }

        if (entry.isDirectory() && results.length < maxResults) {
          await walk(fullPath, depth + 1);
        }
      }
    } catch (e) {}
  }

  await walk(path.resolve(targetDir));
  return results;
}
