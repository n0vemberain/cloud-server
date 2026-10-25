// State
let currentPath = '';
let currentItems = [];
let currentUser = null;
let viewMode = localStorage.getItem('mac_view_mode') || 'grid';
let showHidden = localStorage.getItem('mac_show_hidden') === 'true';
let sortBy = 'name';
let currentEditingPath = '';
let promptAction = null;
let currentLocalUrl = '';
let currentTunnelUrl = '';
let activeSheetItem = null;

// DOM Elements
const breadcrumbsBar = document.getElementById('breadcrumbsBar');
const bookmarksNav = document.getElementById('bookmarksNav');
const fileGrid = document.getElementById('fileGrid');
const fileTable = document.getElementById('fileTable');
const fileTableBody = document.getElementById('fileTableBody');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const viewToggleBtn = document.getElementById('viewToggleBtn');
const hiddenFilesBtn = document.getElementById('hiddenFilesBtn');
const downloadFolderBtn = document.getElementById('downloadFolderBtn');

const uploadBtn = document.getElementById('uploadBtn');
const fileUploadInput = document.getElementById('fileUploadInput');
const dropzoneOverlay = document.getElementById('dropzoneOverlay');
const uploadStatus = document.getElementById('uploadStatus');
const uploadProgressFill = document.getElementById('uploadProgressFill');
const uploadText = document.getElementById('uploadText');

const localIpBadge = document.getElementById('localIpBadge');
const localIpText = document.getElementById('localIpText');
const tunnelBadge = document.getElementById('tunnelBadge');
const tunnelStatusText = document.getElementById('tunnelStatusText');
const batteryBadge = document.getElementById('batteryBadge');
const batteryText = document.getElementById('batteryText');
const storageStats = document.getElementById('storageStats');
const storageBarFill = document.getElementById('storageBarFill');
const tunnelToggleBtn = document.getElementById('tunnelToggleBtn');

const connectionsBtn = document.getElementById('connectionsBtn');
const mobileConnectionsBtn = document.getElementById('mobileConnectionsBtn');
const activeConnectionsBadge = document.getElementById('activeConnectionsBadge');
const connectionsModal = document.getElementById('connectionsModal');
const connectionsCloseBtn = document.getElementById('connectionsCloseBtn');
const tabActiveBtn = document.getElementById('tabActiveBtn');
const tabHistoryBtn = document.getElementById('tabHistoryBtn');
const tabActiveContent = document.getElementById('tabActiveContent');
const tabHistoryContent = document.getElementById('tabHistoryContent');
const activeConnectionsList = document.getElementById('activeConnectionsList');
const historyConnectionsList = document.getElementById('historyConnectionsList');

const guestsBtn = document.getElementById('guestsBtn');
const guestsModal = document.getElementById('guestsModal');
const guestsCloseBtn = document.getElementById('guestsCloseBtn');
const createGuestForm = document.getElementById('createGuestForm');
const guestsList = document.getElementById('guestsList');

const editorModal = document.getElementById('editorModal');
const editorFileName = document.getElementById('editorFileName');
const editorTextarea = document.getElementById('editorTextarea');
const editorSaveBtn = document.getElementById('editorSaveBtn');
const editorCloseBtn = document.getElementById('editorCloseBtn');

const previewModal = document.getElementById('previewModal');
const previewTitle = document.getElementById('previewTitle');
const previewContent = document.getElementById('previewContent');
const previewDownloadBtn = document.getElementById('previewDownloadBtn');
const previewCloseBtn = document.getElementById('previewCloseBtn');

const qrModal = document.getElementById('qrModal');
const qrModalBtn = document.getElementById('qrModalBtn');
const qrCloseBtn = document.getElementById('qrCloseBtn');
const qrLocalLink = document.getElementById('qrLocalLink');
const qrLocalImg = document.getElementById('qrLocalImg');
const qrRemoteLink = document.getElementById('qrRemoteLink');
const qrRemoteImg = document.getElementById('qrRemoteImg');
const qrRemoteStatus = document.getElementById('qrRemoteStatus');
const qrToggleTunnelBtn = document.getElementById('qrToggleTunnelBtn');

const promptModal = document.getElementById('promptModal');
const promptTitle = document.getElementById('promptTitle');
const promptInput = document.getElementById('promptInput');
const promptForm = document.getElementById('promptForm');
const promptCancelBtn = document.getElementById('promptCancelBtn');
const promptCloseBtn = document.getElementById('promptCloseBtn');

const settingsModal = document.getElementById('settingsModal');
const settingsBtn = document.getElementById('settingsBtn');
const settingsCloseBtn = document.getElementById('settingsCloseBtn');
const settingsCancelBtn = document.getElementById('settingsCancelBtn');
const changePasswordForm = document.getElementById('changePasswordForm');
const settingsMsg = document.getElementById('settingsMsg');

const logoutBtn = document.getElementById('logoutBtn');
const menuToggleBtn = document.getElementById('menuToggleBtn');
const appSidebar = document.getElementById('appSidebar');
const sidebarBackdrop = document.getElementById('sidebarBackdrop');
const toastContainer = document.getElementById('toastContainer');

const mobileUploadBtn = document.getElementById('mobileUploadBtn');
const mobileNewFolderBtn = document.getElementById('mobileNewFolderBtn');
const mobileNewFileBtn = document.getElementById('mobileNewFileBtn');
const mobileQrBtn = document.getElementById('mobileQrBtn');

const itemActionModal = document.getElementById('itemActionModal');
const actionSheetItemName = document.getElementById('actionSheetItemName');
const actionSheetCloseBtn = document.getElementById('actionSheetCloseBtn');
const sheetOpenBtn = document.getElementById('sheetOpenBtn');
const sheetOpenLabel = document.getElementById('sheetOpenLabel');
const sheetDownloadBtn = document.getElementById('sheetDownloadBtn');
const sheetDownloadLabel = document.getElementById('sheetDownloadLabel');
const sheetRenameBtn = document.getElementById('sheetRenameBtn');
const sheetDeleteBtn = document.getElementById('sheetDeleteBtn');

// Modern SVG Icons
const SVG_ICONS = {
  folder: '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>',
  image: '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
  video: '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>',
  audio: '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
  code: '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  document: '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>',
  pdf: '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>',
  archive: '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect width="22" height="5" x="1" y="3" rx="1"/><line x1="10" y1="12" x2="14" y2="12"/></svg>',
  binary: '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>',
  dots: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>',
  download: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  rename: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',
  trash: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>'
};

const BOOKMARK_ICONS = {
  home: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
  desktop: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>',
  document: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path></svg>',
  download: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
  image: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>',
  music: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>',
  video: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"></path><rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect></svg>',
  server: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>'
};

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${message}</span>`;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

function formatDate(isoString) {
  if (!isoString) return '--';
  const d = new Date(isoString);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getFileSvg(item) {
  if (item.isDirectory) return SVG_ICONS.folder;
  const ext = (item.extension || '').toLowerCase();
  const mime = (item.mime || '').toLowerCase();

  if (mime.startsWith('image/')) return SVG_ICONS.image;
  if (mime.startsWith('video/')) return SVG_ICONS.video;
  if (mime.startsWith('audio/')) return SVG_ICONS.audio;
  if (mime.includes('pdf') || ext === '.pdf') return SVG_ICONS.pdf;
  if (['.zip', '.tar', '.gz', '.tgz', '.rar', '.7z', '.dmg'].includes(ext)) return SVG_ICONS.archive;
  if (['.js', '.mjs', '.ts', '.py', '.html', '.css', '.json', '.sh', '.c', '.cpp', '.rs', '.go', '.sql'].includes(ext)) return SVG_ICONS.code;
  if (['.txt', '.md', '.log', '.csv', '.env', '.yaml', '.yml'].includes(ext)) return SVG_ICONS.document;
  if (['.app', '.pkg', '.bin', '.exe'].includes(ext)) return SVG_ICONS.binary;
  return SVG_ICONS.document;
}

function isTextEditable(item) {
  if (item.isDirectory) return false;
  const ext = (item.extension || '').toLowerCase();
  const mime = (item.mime || '').toLowerCase();
  const textExts = ['.txt', '.md', '.json', '.js', '.mjs', '.ts', '.html', '.css', '.py', '.sh', '.yaml', '.yml', '.env', '.xml', '.sql', '.csv', '.log', '.ini', '.conf'];
  return mime.startsWith('text/') || textExts.includes(ext);
}

function isMedia(item) {
  if (item.isDirectory) return false;
  const mime = (item.mime || '').toLowerCase();
  const ext = (item.extension || '').toLowerCase();
  return mime.startsWith('image/') || mime.startsWith('video/') || mime.startsWith('audio/') || ext === '.pdf';
}

// Apply User Role Permissions to UI
function applyUserPermissions(user) {
  currentUser = user;
  const isAdmin = user?.role === 'admin';
  const perms = user?.permissions || {};

  // Admin-only elements
  document.querySelectorAll('.admin-only').forEach(el => {
    el.style.display = isAdmin ? '' : 'none';
  });

  // Write permissions (upload, new folder, new file, edit save)
  const canWrite = isAdmin || perms.canWrite;
  document.querySelectorAll('.write-only').forEach(el => {
    el.style.display = canWrite ? '' : 'none';
  });

  // Delete permissions
  const canDelete = isAdmin || perms.canDelete;
  document.querySelectorAll('.delete-only').forEach(el => {
    el.style.display = canDelete ? '' : 'none';
  });

  // Download permissions
  const canDownload = isAdmin || perms.canDownload;
  document.querySelectorAll('.download-only').forEach(el => {
    el.style.display = canDownload ? '' : 'none';
  });
}

// Load Directory
async function loadDirectory(path = '') {
  try {
    const query = new URLSearchParams({ path, showHidden: showHidden.toString() });
    const res = await fetch(`/api/files/browse?${query}`);
    
    if (res.status === 401) {
      window.location.href = '/login.html';
      return;
    }

    const data = await res.json();
    if (!data.success) {
      showToast(data.error || 'Failed to load directory');
      return;
    }

    if (data.user) {
      applyUserPermissions(data.user);
    }

    currentPath = data.currentPath;
    currentItems = data.items;

    renderBreadcrumbs(data.breadcrumbs);
    renderBookmarks(data.bookmarks);
    renderItems(currentItems);
  } catch (err) {
    showToast('Server connection error: ' + err.message);
  }
}

// Render Breadcrumbs
function renderBreadcrumbs(crumbs) {
  breadcrumbsBar.innerHTML = '';
  crumbs.forEach((crumb, index) => {
    if (index > 0) {
      const sep = document.createElement('span');
      sep.className = 'breadcrumb-sep';
      sep.textContent = '/';
      breadcrumbsBar.appendChild(sep);
    }
    const item = document.createElement('span');
    item.className = `breadcrumb-item ${index === crumbs.length - 1 ? 'active' : ''}`;
    item.textContent = crumb.name;
    item.title = crumb.path;
    item.onclick = () => loadDirectory(crumb.path);
    breadcrumbsBar.appendChild(item);
  });
  breadcrumbsBar.scrollLeft = breadcrumbsBar.scrollWidth;
}

// Render Bookmarks
function renderBookmarks(bookmarks) {
  if (!bookmarks) return;
  bookmarksNav.innerHTML = '';
  bookmarks.forEach(b => {
    const item = document.createElement('div');
    const isActive = currentPath === b.path;
    item.className = `sidebar-nav-item ${isActive ? 'active' : ''}`;
    const iconSvg = BOOKMARK_ICONS[b.icon] || BOOKMARK_ICONS.document;
    item.innerHTML = `<span class="nav-icon">${iconSvg}</span><span>${b.name}</span>`;
    item.onclick = () => {
      loadDirectory(b.path);
      closeMobileSidebar();
    };
    bookmarksNav.appendChild(item);
  });
}

function closeMobileSidebar() {
  appSidebar.classList.remove('open');
  sidebarBackdrop.classList.remove('active');
}

// Sort Items
function sortItems(items) {
  const sorted = [...items];
  if (sortBy === 'name') {
    sorted.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    });
  } else if (sortBy === 'size') {
    sorted.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return b.size - a.size;
    });
  } else if (sortBy === 'date') {
    sorted.sort((a, b) => new Date(b.mtime) - new Date(a.mtime));
  }
  return sorted;
}

// Render Files
function renderItems(items) {
  const sorted = sortItems(items);
  
  if (sorted.length === 0) {
    emptyState.style.display = 'flex';
    fileGrid.style.display = 'none';
    fileTable.style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';

  if (viewMode === 'grid') {
    fileGrid.style.display = 'grid';
    fileTable.style.display = 'none';
    renderGridView(sorted);
  } else {
    fileGrid.style.display = 'none';
    fileTable.style.display = 'table';
    renderTableView(sorted);
  }
}

function renderGridView(items) {
  fileGrid.innerHTML = '';
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'grid-item';
    card.title = `${item.name} (${item.sizeFormatted})`;

    const iconSvg = getFileSvg(item);
    const iconClass = item.isDirectory ? 'item-icon-wrapper folder-icon' : 'item-icon-wrapper';

    card.innerHTML = `
      <button class="grid-item-menu-btn" title="Options" aria-label="Item options">
        ${SVG_ICONS.dots}
      </button>
      <div class="${iconClass}">${iconSvg}</div>
      <div class="item-name">${item.name}</div>
      <div class="item-size">${item.isDirectory ? 'Folder' : item.sizeFormatted}</div>
    `;

    card.onclick = (e) => {
      if (e.target.closest('.grid-item-menu-btn')) return;
      handleItemClick(item);
    };

    const menuBtn = card.querySelector('.grid-item-menu-btn');
    menuBtn.onclick = (e) => {
      e.stopPropagation();
      openItemActionSheet(item);
    };

    fileGrid.appendChild(card);
  });
}

function renderTableView(items) {
  fileTableBody.innerHTML = '';
  items.forEach(item => {
    const row = document.createElement('tr');
    const iconSvg = getFileSvg(item);
    const canWrite = currentUser?.role === 'admin' || currentUser?.permissions?.canWrite;
    const canDelete = currentUser?.role === 'admin' || currentUser?.permissions?.canDelete;
    const canDownload = currentUser?.role === 'admin' || currentUser?.permissions?.canDownload;

    row.innerHTML = `
      <td>
        <div class="name-col">
          <span class="table-icon">${iconSvg}</span>
          <span>${item.name}</span>
        </div>
      </td>
      <td>${item.sizeFormatted}</td>
      <td>${formatDate(item.mtime)}</td>
      <td class="actions-col">
        ${canDownload ? `<button class="icon-btn-ghost download-btn" title="Download">${SVG_ICONS.download}</button>` : ''}
        ${canWrite ? `<button class="icon-btn-ghost rename-btn" title="Rename">${SVG_ICONS.rename}</button>` : ''}
        ${canDelete ? `<button class="icon-btn-ghost delete-btn" title="Move to Trash">${SVG_ICONS.trash}</button>` : ''}
      </td>
    `;

    row.querySelector('.name-col').onclick = () => handleItemClick(item);
    const dBtn = row.querySelector('.download-btn');
    if (dBtn) dBtn.onclick = (e) => { e.stopPropagation(); downloadItem(item); };
    const rBtn = row.querySelector('.rename-btn');
    if (rBtn) rBtn.onclick = (e) => { e.stopPropagation(); promptRename(item); };
    const delBtn = row.querySelector('.delete-btn');
    if (delBtn) delBtn.onclick = (e) => { e.stopPropagation(); confirmDelete(item); };

    fileTableBody.appendChild(row);
  });
}

// Action click
function handleItemClick(item) {
  if (item.isDirectory) {
    loadDirectory(item.path);
    return;
  }

  if (isTextEditable(item)) {
    openCodeEditor(item);
  } else if (isMedia(item)) {
    openMediaPreview(item);
  } else {
    downloadItem(item);
  }
}

// Mobile & Tablet Action Bottom Sheet
function openItemActionSheet(item) {
  activeSheetItem = item;
  actionSheetItemName.textContent = item.name;

  if (item.isDirectory) {
    sheetOpenLabel.textContent = 'Open Folder';
    sheetDownloadLabel.textContent = 'Download Folder as ZIP';
  } else {
    if (isTextEditable(item)) {
      sheetOpenLabel.textContent = 'Edit in Code Editor';
    } else if (isMedia(item)) {
      sheetOpenLabel.textContent = 'Preview Media';
    } else {
      sheetOpenLabel.textContent = 'Download File';
    }
    sheetDownloadLabel.textContent = 'Download File';
  }

  itemActionModal.classList.add('active');
}

function closeItemActionSheet() {
  itemActionModal.classList.remove('active');
  activeSheetItem = null;
}

sheetOpenBtn.onclick = () => {
  if (!activeSheetItem) return;
  const item = activeSheetItem;
  closeItemActionSheet();
  handleItemClick(item);
};

sheetDownloadBtn.onclick = () => {
  if (!activeSheetItem) return;
  const item = activeSheetItem;
  closeItemActionSheet();
  downloadItem(item);
};

sheetRenameBtn.onclick = () => {
  if (!activeSheetItem) return;
  const item = activeSheetItem;
  closeItemActionSheet();
  promptRename(item);
};

sheetDeleteBtn.onclick = () => {
  if (!activeSheetItem) return;
  const item = activeSheetItem;
  closeItemActionSheet();
  confirmDelete(item);
};

actionSheetCloseBtn.onclick = closeItemActionSheet;

// Downloads
function downloadItem(item) {
  if (currentUser?.role === 'guest' && !currentUser.permissions.canDownload) {
    showToast('Download permission not granted');
    return;
  }
  const url = `/api/files/download?path=${encodeURIComponent(item.path)}`;
  const a = document.createElement('a');
  a.href = url;
  a.download = item.name + (item.isDirectory ? '.zip' : '');
  document.body.appendChild(a);
  a.click();
  a.remove();
  showToast(`Downloading: ${item.name}`);
}

// Code Editor
async function openCodeEditor(item) {
  try {
    currentEditingPath = item.path;
    editorFileName.textContent = item.name;
    editorTextarea.value = 'Loading contents...';
    editorModal.classList.add('active');

    const res = await fetch(`/api/files/read?path=${encodeURIComponent(item.path)}`);
    const data = await res.json();
    if (data.success) {
      editorTextarea.value = data.content;
      editorTextarea.focus();
    } else {
      showToast(data.error || 'Failed to read file');
      editorModal.classList.remove('active');
    }
  } catch (err) {
    showToast('Read error: ' + err.message);
    editorModal.classList.remove('active');
  }
}

async function saveCurrentFile() {
  if (!currentEditingPath) return;
  try {
    editorSaveBtn.disabled = true;
    editorSaveBtn.querySelector('span').textContent = 'Saving...';

    const res = await fetch('/api/files/write', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: currentEditingPath,
        content: editorTextarea.value
      })
    });
    const data = await res.json();

    if (data.success) {
      showToast('File saved successfully');
      loadDirectory(currentPath);
    } else {
      showToast(data.error || 'Save failed');
    }
  } catch (err) {
    showToast('Save error: ' + err.message);
  } finally {
    editorSaveBtn.disabled = false;
    editorSaveBtn.querySelector('span').textContent = 'Save (Cmd+S)';
  }
}

// Media Preview
function openMediaPreview(item) {
  previewTitle.textContent = item.name;
  previewDownloadBtn.href = `/api/files/download?path=${encodeURIComponent(item.path)}`;
  previewDownloadBtn.download = item.name;
  previewContent.innerHTML = '';

  const streamUrl = `/api/files/stream?path=${encodeURIComponent(item.path)}`;
  const mime = (item.mime || '').toLowerCase();
  const ext = (item.extension || '').toLowerCase();

  if (mime.startsWith('image/')) {
    const img = document.createElement('img');
    img.className = 'preview-image';
    img.src = streamUrl;
    img.alt = item.name;
    previewContent.appendChild(img);
  } else if (mime.startsWith('video/')) {
    const video = document.createElement('video');
    video.className = 'preview-video';
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.src = streamUrl;
    previewContent.appendChild(video);
  } else if (mime.startsWith('audio/')) {
    const audio = document.createElement('audio');
    audio.className = 'preview-audio';
    audio.controls = true;
    audio.autoplay = true;
    audio.src = streamUrl;
    previewContent.appendChild(audio);
  } else if (ext === '.pdf') {
    const iframe = document.createElement('iframe');
    iframe.className = 'preview-iframe';
    iframe.src = streamUrl;
    previewContent.appendChild(iframe);
  }

  previewModal.classList.add('active');
}

function closeMediaPreview() {
  previewModal.classList.remove('active');
  previewContent.innerHTML = '';
}

// Prompt Modal Helper
function openPrompt(title, defaultValue, onSubmit) {
  promptTitle.textContent = title;
  promptInput.value = defaultValue || '';
  promptAction = onSubmit;
  promptModal.classList.add('active');
  promptInput.focus();
}

function closePrompt() {
  promptModal.classList.remove('active');
  promptAction = null;
}

promptForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const val = promptInput.value.trim();
  if (val && promptAction) {
    promptAction(val);
  }
  closePrompt();
});

promptCancelBtn.onclick = closePrompt;
promptCloseBtn.onclick = closePrompt;

// New Folder Handlers
function handleNewFolderAction() {
  openPrompt('Enter New Folder Name:', 'New Folder', async (name) => {
    try {
      const res = await fetch('/api/files/mkdir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: currentPath + '/' + name })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Created folder: ${name}`);
        loadDirectory(currentPath);
      } else {
        showToast(data.error);
      }
    } catch (e) {
      showToast(e.message);
    }
  });
}
document.getElementById('newFolderBtn').onclick = handleNewFolderAction;
if (mobileNewFolderBtn) mobileNewFolderBtn.onclick = handleNewFolderAction;

// New File Handlers
function handleNewFileAction() {
  openPrompt('Enter New File Name:', 'untitled.txt', async (name) => {
    try {
      const res = await fetch('/api/files/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: currentPath + '/' + name })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Created file: ${name}`);
        loadDirectory(currentPath);
      } else {
        showToast(data.error);
      }
    } catch (e) {
      showToast(e.message);
    }
  });
}
document.getElementById('newFileBtn').onclick = handleNewFileAction;
if (mobileNewFileBtn) mobileNewFileBtn.onclick = handleNewFileAction;

// Rename
function promptRename(item) {
  openPrompt(`Rename "${item.name}":`, item.name, async (newName) => {
    if (newName === item.name) return;
    try {
      const res = await fetch('/api/files/rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPath: item.path, newName })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Renamed to: ${newName}`);
        loadDirectory(currentPath);
      } else {
        showToast(data.error);
      }
    } catch (e) {
      showToast(e.message);
    }
  });
}

// Delete
async function confirmDelete(item) {
  const confirmed = confirm(`Move "${item.name}" to Trash?`);
  if (!confirmed) return;

  try {
    const res = await fetch('/api/files/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: item.path })
    });
    const data = await res.json();
    if (data.success) {
      showToast(`Moved to Trash: ${item.name}`);
      loadDirectory(currentPath);
    } else {
      showToast(data.error);
    }
  } catch (e) {
    showToast(e.message);
  }
}

// Download Folder as ZIP
downloadFolderBtn.onclick = () => {
  if (!currentPath) return;
  const url = `/api/files/download?path=${encodeURIComponent(currentPath)}`;
  window.location.href = url;
  showToast('Creating and downloading ZIP archive...');
};

// Upload Files Handlers
uploadBtn.onclick = () => fileUploadInput.click();
if (mobileUploadBtn) mobileUploadBtn.onclick = () => fileUploadInput.click();

fileUploadInput.onchange = () => {
  if (fileUploadInput.files.length > 0) {
    uploadFiles(fileUploadInput.files);
  }
};

// Drag and drop upload
let dragCounter = 0;
window.addEventListener('dragenter', (e) => {
  e.preventDefault();
  dragCounter++;
  dropzoneOverlay.classList.add('active');
});

window.addEventListener('dragleave', (e) => {
  e.preventDefault();
  dragCounter--;
  if (dragCounter <= 0) {
    dragCounter = 0;
    dropzoneOverlay.classList.remove('active');
  }
});

window.addEventListener('dragover', (e) => e.preventDefault());

window.addEventListener('drop', (e) => {
  e.preventDefault();
  dragCounter = 0;
  dropzoneOverlay.classList.remove('active');
  if (e.dataTransfer && e.dataTransfer.files.length > 0) {
    uploadFiles(e.dataTransfer.files);
  }
});

function uploadFiles(files) {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }

  uploadStatus.classList.add('active');
  uploadText.textContent = `Uploading ${files.length} file(s)...`;
  uploadProgressFill.style.width = '0%';

  const xhr = new XMLHttpRequest();
  xhr.open('POST', `/api/files/upload?uploadDir=${encodeURIComponent(currentPath)}`);

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      const pct = Math.round((e.loaded / e.total) * 100);
      uploadProgressFill.style.width = `${pct}%`;
      uploadText.textContent = `Uploading: ${pct}%`;
    }
  };

  xhr.onload = () => {
    uploadStatus.classList.remove('active');
    fileUploadInput.value = '';
    if (xhr.status === 200) {
      showToast('All files uploaded successfully');
      loadDirectory(currentPath);
    } else {
      showToast('Upload failed');
    }
  };

  xhr.onerror = () => {
    uploadStatus.classList.remove('active');
    showToast('Network error during file upload');
  };

  xhr.send(formData);
}

// ---------------- CONNECTIONS & SESSIONS MODAL ----------------
async function loadConnections() {
  if (currentUser?.role !== 'admin') return;
  try {
    const res = await fetch('/api/activity/connections');
    const data = await res.json();
    if (!data.success) return;

    activeConnectionsBadge.textContent = data.activeCount || 0;

    // Render Active Sessions
    activeConnectionsList.innerHTML = '';
    if (data.active.length === 0) {
      activeConnectionsList.innerHTML = '<div style="color: var(--text-muted); padding: 12px; text-align: center;">No active connections.</div>';
    } else {
      data.active.forEach(conn => {
        const card = document.createElement('div');
        card.className = 'connection-card';
        const isRemote = conn.networkType.includes('External');
        const netClass = isRemote ? 'remote' : 'local';

        card.innerHTML = `
          <div class="conn-left">
            <span class="conn-status-dot ${conn.isOnline ? 'online' : 'offline'}" title="${conn.isOnline ? 'Online' : 'Idle'}"></span>
            <div class="conn-info">
              <div class="conn-title">
                <span>${conn.username}</span>
                <span class="role-badge ${conn.role === 'guest' ? 'guest' : ''}">${conn.role}</span>
                <span class="conn-net-badge ${netClass}">${conn.networkType}</span>
              </div>
              <div class="conn-meta">
                <span>IP: <strong>${conn.ip}</strong></span>
                <span>•</span>
                <span>${conn.device}</span>
                <span>•</span>
                <span>Last active: ${formatDate(conn.lastActive)}</span>
              </div>
            </div>
          </div>
          <div>
            <button class="btn btn-danger btn-sm revoke-btn">Disconnect</button>
          </div>
        `;

        card.querySelector('.revoke-btn').onclick = async () => {
          if (confirm(`Disconnect session for "${conn.username}" (${conn.ip})?`)) {
            await fetch('/api/activity/revoke', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sessionId: conn.sessionId })
            });
            showToast('Session disconnected');
            loadConnections();
          }
        };

        activeConnectionsList.appendChild(card);
      });
    }

    // Render History
    historyConnectionsList.innerHTML = '';
    if (data.history.length === 0) {
      historyConnectionsList.innerHTML = '<div style="color: var(--text-muted); padding: 12px; text-align: center;">No connection history yet.</div>';
    } else {
      data.history.forEach(item => {
        const card = document.createElement('div');
        card.className = 'connection-card';
        const isRemote = item.networkType.includes('External');
        const netClass = isRemote ? 'remote' : 'local';

        card.innerHTML = `
          <div class="conn-left">
            <div class="conn-info">
              <div class="conn-title">
                <span>${item.username}</span>
                <span class="role-badge ${item.role === 'guest' ? 'guest' : ''}">${item.role}</span>
                <span class="conn-net-badge ${netClass}">${item.networkType}</span>
              </div>
              <div class="conn-meta">
                <span>IP: <strong>${item.ip}</strong></span>
                <span>•</span>
                <span>${item.device}</span>
                <span>•</span>
                <span>Connected at: ${formatDate(item.timestamp)}</span>
              </div>
            </div>
          </div>
        `;
        historyConnectionsList.appendChild(card);
      });
    }
  } catch (err) {}
}

function openConnectionsModal() {
  loadConnections();
  connectionsModal.classList.add('active');
}

connectionsBtn.onclick = openConnectionsModal;
if (mobileConnectionsBtn) mobileConnectionsBtn.onclick = openConnectionsModal;
connectionsCloseBtn.onclick = () => connectionsModal.classList.remove('active');

tabActiveBtn.onclick = () => {
  tabActiveBtn.classList.add('active');
  tabHistoryBtn.classList.remove('active');
  tabActiveContent.style.display = 'block';
  tabHistoryContent.style.display = 'none';
};

tabHistoryBtn.onclick = () => {
  tabHistoryBtn.classList.add('active');
  tabActiveBtn.classList.remove('active');
  tabHistoryContent.style.display = 'block';
  tabActiveContent.style.display = 'none';
};

// ---------------- GUESTS MANAGEMENT MODAL ----------------
async function loadGuests() {
  if (currentUser?.role !== 'admin') return;
  try {
    const res = await fetch('/api/guests');
    const data = await res.json();
    if (!data.success) return;

    guestsList.innerHTML = '';
    if (data.guests.length === 0) {
      guestsList.innerHTML = '<div style="color: var(--text-muted); padding: 8px;">No guest accounts created yet.</div>';
      return;
    }

    data.guests.forEach(g => {
      const card = document.createElement('div');
      card.className = 'guest-card';

      const permsText = [
        g.permissions.canDownload ? 'Download' : '',
        g.permissions.canWrite ? 'Upload/Edit' : '',
        g.permissions.canDelete ? 'Delete' : ''
      ].filter(Boolean).join(', ') || 'Read-Only';

      card.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <div style="font-size: 14px; font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
            <span>${g.username}</span>
            <span class="role-badge guest">guest</span>
          </div>
          <div style="font-size: 12px; color: var(--text-secondary);">
            Permissions: <strong>${permsText}</strong>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary btn-sm change-pass-btn">Change Password</button>
          <button class="btn btn-danger btn-sm del-guest-btn">Delete</button>
        </div>
      `;

      card.querySelector('.change-pass-btn').onclick = () => {
        openPrompt(`Enter new password for guest "${g.username}":`, '', async (newPass) => {
          const ures = await fetch('/api/guests/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: g.id, password: newPass })
          });
          const udata = await ures.json();
          if (udata.success) {
            showToast(`Password updated for "${g.username}"`);
          } else {
            showToast(udata.error);
          }
        });
      };

      card.querySelector('.del-guest-btn').onclick = async () => {
        if (confirm(`Delete guest account "${g.username}"?`)) {
          const dres = await fetch('/api/guests/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: g.id })
          });
          const ddata = await dres.json();
          if (ddata.success) {
            showToast(`Guest "${g.username}" deleted`);
            loadGuests();
          } else {
            showToast(ddata.error);
          }
        }
      };

      guestsList.appendChild(card);
    });
  } catch (err) {}
}

function openGuestsModal() {
  loadGuests();
  guestsModal.classList.add('active');
}

guestsBtn.onclick = openGuestsModal;
guestsCloseBtn.onclick = () => guestsModal.classList.remove('active');

createGuestForm.onsubmit = async (e) => {
  e.preventDefault();
  const username = document.getElementById('guestUsername').value.trim();
  const password = document.getElementById('guestPassword').value;
  const canDownload = document.getElementById('permDownload').checked;
  const canWrite = document.getElementById('permWrite').checked;
  const canDelete = document.getElementById('permDelete').checked;

  try {
    const res = await fetch('/api/guests/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password,
        permissions: { canDownload, canWrite, canDelete }
      })
    });
    const data = await res.json();
    if (data.success) {
      showToast(`Guest "${username}" created successfully!`);
      createGuestForm.reset();
      document.getElementById('permDownload').checked = true;
      loadGuests();
    } else {
      showToast(data.error || 'Failed to create guest');
    }
  } catch (err) {
    showToast(err.message);
  }
};

// System Metrics
async function updateMetrics() {
  try {
    const res = await fetch('/api/system/metrics');
    const data = await res.json();
    if (data.success) {
      const primaryNet = data.network[0];
      if (primaryNet) {
        currentLocalUrl = `http://${primaryNet.address}:${window.location.port || '7890'}`;
        localIpText.textContent = `LAN: ${primaryNet.address}`;
        localIpBadge.onclick = () => openQrModal();
      }

      if (data.battery && data.battery.percent !== null) {
        batteryBadge.style.display = 'inline-flex';
        batteryText.textContent = `${data.battery.percent}%`;
      }

      if (data.disk) {
        storageStats.textContent = `${data.disk.free} free`;
        storageBarFill.style.width = `${data.disk.percentUsed}%`;
      }
    }
  } catch (err) {}
}

async function updateTunnelStatus() {
  try {
    const res = await fetch('/api/system/tunnel');
    const data = await res.json();
    if (data.running && data.url) {
      currentTunnelUrl = data.url;
      tunnelStatusText.textContent = 'Internet: Active';
      tunnelBadge.className = 'badge badge-green';
    } else {
      currentTunnelUrl = '';
      tunnelStatusText.textContent = 'Internet: Offline';
      tunnelBadge.className = 'badge badge-orange';
    }
  } catch (err) {}
}

async function toggleTunnel() {
  try {
    showToast('Toggling remote tunnel connection...');
    const action = currentTunnelUrl ? 'stop' : 'start';
    const res = await fetch('/api/system/tunnel/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });
    const data = await res.json();
    await updateTunnelStatus();
    showToast(data.running ? 'Remote Internet Tunnel Online' : 'Remote Tunnel Stopped');
  } catch (err) {
    showToast('Tunnel error: ' + err.message);
  }
}

// QR Code Modal
async function openQrModal() {
  qrModal.classList.add('active');

  const localUrl = currentLocalUrl || window.location.origin;
  qrLocalLink.href = localUrl;
  qrLocalLink.textContent = localUrl;
  fetch(`/api/system/qr?url=${encodeURIComponent(localUrl)}`)
    .then(r => r.json())
    .then(d => { if (d.success) qrLocalImg.src = d.qr; });

  if (currentTunnelUrl) {
    qrRemoteStatus.textContent = 'Remote HTTPS tunnel online:';
    qrRemoteLink.style.display = 'inline-block';
    qrRemoteLink.href = currentTunnelUrl;
    qrRemoteLink.textContent = currentTunnelUrl;
    qrRemoteImg.style.display = 'block';
    fetch(`/api/system/qr?url=${encodeURIComponent(currentTunnelUrl)}`)
      .then(r => r.json())
      .then(d => { if (d.success) qrRemoteImg.src = d.qr; });
    qrToggleTunnelBtn.textContent = 'Stop Remote Tunnel';
  } else {
    qrRemoteStatus.textContent = 'Remote Internet Tunnel is currently offline';
    qrRemoteLink.style.display = 'none';
    qrRemoteImg.style.display = 'none';
    qrToggleTunnelBtn.textContent = 'Start Remote Tunnel';
  }
}

qrModalBtn.onclick = openQrModal;
if (mobileQrBtn) mobileQrBtn.onclick = openQrModal;
localIpBadge.onclick = openQrModal;
tunnelBadge.onclick = openQrModal;
qrCloseBtn.onclick = () => qrModal.classList.remove('active');
tunnelToggleBtn.onclick = toggleTunnel;
qrToggleTunnelBtn.onclick = async () => {
  await toggleTunnel();
  openQrModal();
};

// Settings / Change Admin Password
settingsBtn.onclick = () => {
  settingsMsg.style.display = 'none';
  settingsModal.classList.add('active');
};
settingsCloseBtn.onclick = () => settingsModal.classList.remove('active');
settingsCancelBtn.onclick = () => settingsModal.classList.remove('active');

changePasswordForm.onsubmit = async (e) => {
  e.preventDefault();
  const currentPassword = document.getElementById('currentPassInput').value;
  const newPassword = document.getElementById('newPassInput').value;

  try {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (data.success) {
      settingsMsg.textContent = 'Admin password updated successfully';
      settingsMsg.style.background = 'rgba(48, 209, 88, 0.2)';
      settingsMsg.style.color = '#30d158';
      settingsMsg.style.display = 'block';
      setTimeout(() => settingsModal.classList.remove('active'), 1500);
    } else {
      settingsMsg.textContent = data.error || 'Failed to update password';
      settingsMsg.style.background = 'rgba(255, 69, 58, 0.2)';
      settingsMsg.style.color = '#ff453a';
      settingsMsg.style.display = 'block';
    }
  } catch (err) {
    settingsMsg.textContent = err.message;
    settingsMsg.style.display = 'block';
  }
};

// Logout
logoutBtn.onclick = async () => {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/login.html';
};

// Toolbar buttons
viewToggleBtn.onclick = () => {
  viewMode = viewMode === 'grid' ? 'table' : 'grid';
  localStorage.setItem('mac_view_mode', viewMode);
  renderItems(currentItems);
};

hiddenFilesBtn.onclick = () => {
  showHidden = !showHidden;
  localStorage.setItem('mac_show_hidden', showHidden.toString());
  showToast(showHidden ? 'Showing hidden files' : 'Hiding hidden files');
  loadDirectory(currentPath);
};

sortSelect.onchange = (e) => {
  sortBy = e.target.value;
  renderItems(currentItems);
};

// Search filter
let searchTimer = null;
searchInput.oninput = (e) => {
  clearTimeout(searchTimer);
  const q = e.target.value.trim().toLowerCase();
  searchTimer = setTimeout(() => {
    if (!q) {
      renderItems(currentItems);
      return;
    }
    const filtered = currentItems.filter(item => item.name.toLowerCase().includes(q));
    renderItems(filtered);
  }, 200);
};

// Editor listeners
editorCloseBtn.onclick = () => editorModal.classList.remove('active');
editorSaveBtn.onclick = saveCurrentFile;
window.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 's') {
    if (editorModal.classList.contains('active')) {
      e.preventDefault();
      saveCurrentFile();
    }
  }
  if (e.key === 'Escape') {
    editorModal.classList.remove('active');
    closeMediaPreview();
    qrModal.classList.remove('active');
    settingsModal.classList.remove('active');
    connectionsModal.classList.remove('active');
    guestsModal.classList.remove('active');
    closePrompt();
    closeItemActionSheet();
    closeMobileSidebar();
  }
});

previewCloseBtn.onclick = closeMediaPreview;

// Mobile sidebar drawer
menuToggleBtn.onclick = () => {
  appSidebar.classList.toggle('open');
  sidebarBackdrop.classList.toggle('active');
};
sidebarBackdrop.onclick = closeMobileSidebar;

// Initialize
async function init() {
  await updateMetrics();
  await updateTunnelStatus();
  await loadDirectory();
  loadConnections();

  setInterval(updateMetrics, 10000);
  setInterval(updateTunnelStatus, 8000);
  setInterval(loadConnections, 6000);
}

init();
