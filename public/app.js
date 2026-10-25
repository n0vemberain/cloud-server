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

const headerServerName = document.getElementById('headerServerName');
const tunnelBadge = document.getElementById('tunnelBadge');
const tunnelStatusText = document.getElementById('tunnelStatusText');
const batteryBadge = document.getElementById('batteryBadge');
const batteryText = document.getElementById('batteryText');
const storageStats = document.getElementById('storageStats');
const storageBarFill = document.getElementById('storageBarFill');
const folderStatsPill = document.getElementById('folderStatsPill');
const copyCurrentPathBtn = document.getElementById('copyCurrentPathBtn');

// Notifications & Messages Modal Elements
const notifModal = document.getElementById('notifModal');
const notifBtn = document.getElementById('notifBtn');
const notifCloseBtn = document.getElementById('notifCloseBtn');
const notifBadgeCount = document.getElementById('notifBadgeCount');
const adminNotifSection = document.getElementById('adminNotifSection');
const guestNotifSection = document.getElementById('guestNotifSection');
const notifTabReqBtn = document.getElementById('notifTabReqBtn');
const notifTabMsgBtn = document.getElementById('notifTabMsgBtn');
const notifReqCountPill = document.getElementById('notifReqCountPill');
const notifMsgCountPill = document.getElementById('notifMsgCountPill');
const paneNotifRequests = document.getElementById('paneNotifRequests');
const paneNotifMessages = document.getElementById('paneNotifMessages');
const notifRequestsList = document.getElementById('notifRequestsList');
const notifMessagesList = document.getElementById('notifMessagesList');
const markAllReadBtn = document.getElementById('markAllReadBtn');
const guestSendMessageForm = document.getElementById('guestSendMessageForm');
const guestMessageInput = document.getElementById('guestMessageInput');
const guestMyMessagesList = document.getElementById('guestMyMessagesList');

// Unified Settings Modal Elements
const settingsModal = document.getElementById('settingsModal');
const settingsBtn = document.getElementById('settingsBtn');
const settingsCloseBtn = document.getElementById('settingsCloseBtn');
const settingsConnCount = document.getElementById('settingsConnCount');

// Settings: General & LAN
const serverNameForm = document.getElementById('serverNameForm');
const serverNameInput = document.getElementById('serverNameInput');
const settingsLocalUrl = document.getElementById('settingsLocalUrl');
const copyLocalUrlBtn = document.getElementById('copyLocalUrlBtn');
const settingsLocalQrImg = document.getElementById('settingsLocalQrImg');

// Settings: Remote Access
const remoteSwitchCheckbox = document.getElementById('remoteSwitchCheckbox');
const remoteStatusBadge = document.getElementById('remoteStatusBadge');
const remoteStatusExplanation = document.getElementById('remoteStatusExplanation');
const remoteActiveSection = document.getElementById('remoteActiveSection');
const remoteInactiveSection = document.getElementById('remoteInactiveSection');
const remoteModalLink = document.getElementById('remoteModalLink');
const copyRemoteUrlBtn = document.getElementById('copyRemoteUrlBtn');
const remoteModalQrImg = document.getElementById('remoteModalQrImg');

// Settings: Connected Sessions
const tabActiveBtn = document.getElementById('tabActiveBtn');
const tabHistoryBtn = document.getElementById('tabHistoryBtn');
const tabActiveContent = document.getElementById('tabActiveContent');
const tabHistoryContent = document.getElementById('tabHistoryContent');
const activeConnectionsList = document.getElementById('activeConnectionsList');
const historyConnectionsList = document.getElementById('historyConnectionsList');

// Settings: Guest Users
const createGuestForm = document.getElementById('createGuestForm');
const guestsList = document.getElementById('guestsList');

// Settings: Master Password
const changePasswordForm = document.getElementById('changePasswordForm');
const settingsMsg = document.getElementById('settingsMsg');

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

const promptModal = document.getElementById('promptModal');
const promptTitle = document.getElementById('promptTitle');
const promptInput = document.getElementById('promptInput');
const promptForm = document.getElementById('promptForm');
const promptCancelBtn = document.getElementById('promptCancelBtn');
const promptCloseBtn = document.getElementById('promptCloseBtn');


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

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
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

  // Guest-only elements
  document.querySelectorAll('.guest-only').forEach(el => {
    el.style.display = !isAdmin ? '' : 'none';
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

// Check Auth Status on Page Load
async function checkAuth() {
  try {
    const res = await fetch('/api/auth/status');
    if (res.status === 401) {
      window.location.href = '/login.html';
      return false;
    }
    const data = await res.json();
    if (data.serverName) {
      if (headerServerName) headerServerName.textContent = data.serverName;
      if (serverNameInput) serverNameInput.value = data.serverName;
      document.title = `${data.serverName} — Personal Cloud`;
    }
    if (data.authenticated && data.user) {
      applyUserPermissions(data.user);
      return true;
    }
  } catch (err) {
    console.error('Check auth error:', err);
  }
  return false;
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

    if (folderStatsPill) {
      if (data.folderStats && data.folderStats.summary) {
        folderStatsPill.textContent = data.folderStats.summary;
        folderStatsPill.style.display = 'inline-flex';
      } else {
        folderStatsPill.style.display = 'none';
      }
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
    card.title = item.isDirectory ? `${item.name} (Folder, ${item.sizeFormatted || 'Empty'})` : `${item.name} (${item.sizeFormatted})`;

    const iconSvg = getFileSvg(item);
    const iconClass = item.isDirectory ? 'item-icon-wrapper folder-icon' : 'item-icon-wrapper';

    const sizeText = item.isDirectory
      ? (item.sizeFormatted && item.sizeFormatted !== '0 B' && item.sizeFormatted !== 'Empty'
          ? `${item.sizeFormatted} • ${item.itemCount || 0} items`
          : (item.itemCount ? `${item.itemCount} items` : 'Empty'))
      : item.sizeFormatted;

    card.innerHTML = `
      <button class="grid-item-menu-btn" title="Options" aria-label="Item options">
        ${SVG_ICONS.dots}
      </button>
      <div class="${iconClass}">${iconSvg}</div>
      <div class="item-name">${item.name}</div>
      <div class="item-size">${sizeText}</div>
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

    const tableSize = item.isDirectory
      ? (item.sizeFormatted && item.sizeFormatted !== 'Empty' ? `${item.sizeFormatted} (${item.itemCount || 0} items)` : '0 B')
      : item.sizeFormatted;

    row.innerHTML = `
      <td>
        <div class="name-col">
          <span class="table-icon">${iconSvg}</span>
          <span>${item.name}</span>
        </div>
      </td>
      <td>${tableSize}</td>
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
  try {
    const res = await fetch('/api/activity/connections');
    if (res.status === 401 || res.status === 403) return;
    const data = await res.json();
    if (!data.success) return;

    if (settingsConnCount) settingsConnCount.textContent = data.activeCount || 0;

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
                <span>IP / Network: <strong>${conn.ip}</strong></span>
                <span>•</span>
                <span>${conn.device}</span>
                <span>•</span>
                <span>Last active: ${formatDate(conn.lastActive)}</span>
              </div>
            </div>
          </div>
          ${(currentUser?.role === 'admin' && conn.sessionId) ? '<div><button class="btn btn-danger btn-sm revoke-btn">Disconnect</button></div>' : ''}
        `;

        const revokeBtnEl = card.querySelector('.revoke-btn');
        if (revokeBtnEl) {
          revokeBtnEl.onclick = async () => {
            if (confirm(`Disconnect session for "${conn.username}"?`)) {
              await fetch('/api/activity/revoke', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: conn.sessionId })
              });
              showToast('Session disconnected');
              loadConnections();
            }
          };
        }

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
  try {
    const res = await fetch('/api/guests');
    if (res.status === 401) return;
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

      const allowedFolders = [];
      if (g.permissions?.folderAccess?.desktop) allowedFolders.push('Desktop');
      if (g.permissions?.folderAccess?.documents) allowedFolders.push('Documents');
      if (g.permissions?.folderAccess?.downloads) allowedFolders.push('Downloads');
      if (Array.isArray(g.permissions?.folderAccess?.customFolders)) {
        g.permissions.folderAccess.customFolders.forEach(cf => {
          if (cf && cf.name) allowedFolders.push(cf.name);
        });
      }
      const foldersText = allowedFolders.length > 0 ? allowedFolders.join(', ') : 'None';

      const permsText = [
        g.permissions?.canDownload ? 'Download' : '',
        g.permissions?.canWrite ? 'Upload/Edit' : '',
        g.permissions?.canDelete ? 'Delete' : ''
      ].filter(Boolean).join(', ') || 'Read-Only';

      const isAdmin = currentUser?.role === 'admin';
      const adminActions = isAdmin ? `
        <div style="display: flex; gap: 8px; align-items: center;">
          <button class="btn btn-secondary btn-sm edit-guest-btn">Edit</button>
          <button class="btn btn-danger btn-sm del-guest-btn">Delete</button>
        </div>
      ` : `
        <div style="font-size: 11px; color: var(--text-muted); font-style: italic;">
          Active Guest
        </div>
      `;

      card.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 4px; flex: 1;">
          <div style="font-size: 14px; font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span>${escapeHtml(g.name || g.username)}</span>
            <span style="font-size: 12px; color: var(--text-secondary); font-weight: normal;">@${escapeHtml(g.username)}</span>
            <span class="role-badge guest">Guest</span>
          </div>

          <div style="display: flex; align-items: center; gap: 6px; margin-top: 3px;">
            <span style="font-size: 11px; color: var(--text-secondary); font-weight: 500;">Password:</span>
            <code style="background: var(--bg-primary); padding: 2px 7px; border-radius: 4px; border: 1px solid var(--border-color); font-size: 11px; font-weight: 600; color: var(--accent-blue);">${escapeHtml(g.password)}</code>
            <button type="button" class="icon-btn-ghost copy-pass-btn" title="Copy Password" style="padding: 2px; height: auto;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>

          <div style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">
            Allowed Folders: <strong style="color: var(--text-primary);">${escapeHtml(foldersText)}</strong>
          </div>
          <div style="font-size: 12px; color: var(--text-secondary);">
            Permissions: <strong>${escapeHtml(permsText)}</strong>
          </div>
        </div>
        ${adminActions}
      `;

      const copyPassBtn = card.querySelector('.copy-pass-btn');
      if (copyPassBtn) {
        copyPassBtn.onclick = () => {
          navigator.clipboard.writeText(g.password).then(() => {
            showToast(`Password copied for @${g.username}`);
          }).catch(() => {
            showToast(`Password: ${g.password}`);
          });
        };
      }

      const editGuestBtn = card.querySelector('.edit-guest-btn');
      if (editGuestBtn) {
        editGuestBtn.onclick = () => openEditGuestModal(g);
      }

      const delGuestBtn = card.querySelector('.del-guest-btn');
      if (delGuestBtn) {
        delGuestBtn.onclick = async () => {
          if (confirm(`Delete guest account "${g.name || g.username}" (@${g.username})?`)) {
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
      }

      guestsList.appendChild(card);
    });
  } catch (err) {}
}

let createCustomFolders = [];
let editCustomFolders = [];

function renderCreateCustomFolders() {
  const container = document.getElementById('createCustomFoldersList');
  if (!container) return;
  container.innerHTML = '';
  if (createCustomFolders.length === 0) {
    container.innerHTML = '<div style="font-size: 11px; color: var(--text-muted); font-style: italic;">No custom folder paths added.</div>';
    return;
  }
  createCustomFolders.forEach((cf, index) => {
    const chip = document.createElement('div');
    chip.className = 'custom-folder-chip';
    chip.innerHTML = `
      <div style="min-width: 0; flex: 1;">
        <span class="custom-folder-chip-name">${escapeHtml(cf.name)}</span>
        <span class="custom-folder-chip-path" title="${escapeHtml(cf.path)}">${escapeHtml(cf.path)}</span>
      </div>
      <button type="button" class="custom-folder-chip-remove" title="Remove Folder">&times;</button>
    `;
    chip.querySelector('.custom-folder-chip-remove').onclick = () => {
      createCustomFolders.splice(index, 1);
      renderCreateCustomFolders();
    };
    container.appendChild(chip);
  });
}

function renderEditCustomFolders() {
  const container = document.getElementById('editCustomFoldersList');
  if (!container) return;
  container.innerHTML = '';
  if (editCustomFolders.length === 0) {
    container.innerHTML = '<div style="font-size: 11px; color: var(--text-muted); font-style: italic;">No custom folder paths added.</div>';
    return;
  }
  editCustomFolders.forEach((cf, index) => {
    const chip = document.createElement('div');
    chip.className = 'custom-folder-chip';
    chip.innerHTML = `
      <div style="min-width: 0; flex: 1;">
        <span class="custom-folder-chip-name">${escapeHtml(cf.name)}</span>
        <span class="custom-folder-chip-path" title="${escapeHtml(cf.path)}">${escapeHtml(cf.path)}</span>
      </div>
      <button type="button" class="custom-folder-chip-remove" title="Remove Folder">&times;</button>
    `;
    chip.querySelector('.custom-folder-chip-remove').onclick = () => {
      editCustomFolders.splice(index, 1);
      renderEditCustomFolders();
    };
    container.appendChild(chip);
  });
}

async function addCustomFolderToCreate() {
  const input = document.getElementById('createCustomFolderPath');
  if (!input) return;
  const folderPath = input.value.trim();
  if (!folderPath) {
    showToast('Please enter or paste a valid folder path');
    return;
  }
  if (createCustomFolders.some(cf => cf.path === folderPath)) {
    showToast('Folder already added to list');
    return;
  }
  try {
    const res = await fetch('/api/files/validate-path', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: folderPath })
    });
    const data = await res.json();
    if (data.success) {
      createCustomFolders.push({ name: data.name, path: data.path });
      input.value = '';
      renderCreateCustomFolders();
      showToast(`Added folder: ${data.name}`);
    } else {
      showToast(data.error || 'Invalid folder path');
    }
  } catch (err) {
    showToast(err.message);
  }
}

async function addCustomFolderToEdit() {
  const input = document.getElementById('editCustomFolderPath');
  if (!input) return;
  const folderPath = input.value.trim();
  if (!folderPath) {
    showToast('Please enter or paste a valid folder path');
    return;
  }
  if (editCustomFolders.some(cf => cf.path === folderPath)) {
    showToast('Folder already added to list');
    return;
  }
  try {
    const res = await fetch('/api/files/validate-path', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: folderPath })
    });
    const data = await res.json();
    if (data.success) {
      editCustomFolders.push({ name: data.name, path: data.path });
      input.value = '';
      renderEditCustomFolders();
      showToast(`Added folder: ${data.name}`);
    } else {
      showToast(data.error || 'Invalid folder path');
    }
  } catch (err) {
    showToast(err.message);
  }
}

const createAddCustomFolderBtn = document.getElementById('createAddCustomFolderBtn');
const createCustomFolderPathInput = document.getElementById('createCustomFolderPath');
if (createAddCustomFolderBtn) createAddCustomFolderBtn.onclick = addCustomFolderToCreate;
if (createCustomFolderPathInput) {
  createCustomFolderPathInput.onkeydown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomFolderToCreate();
    }
  };
}

const editAddCustomFolderBtn = document.getElementById('editAddCustomFolderBtn');
const editCustomFolderPathInput = document.getElementById('editCustomFolderPath');
if (editAddCustomFolderBtn) editAddCustomFolderBtn.onclick = addCustomFolderToEdit;
if (editCustomFolderPathInput) {
  editCustomFolderPathInput.onkeydown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomFolderToEdit();
    }
  };
}

function openEditGuestModal(guest) {
  const modal = document.getElementById('editGuestModal');
  if (!modal) return;
  document.getElementById('editGuestId').value = guest.id;
  document.getElementById('editGuestName').value = guest.name || guest.username;
  document.getElementById('editGuestUsername').value = guest.username;
  document.getElementById('editGuestPassword').value = '';
  document.getElementById('editFolderDesktop').checked = Boolean(guest.permissions?.folderAccess?.desktop);
  document.getElementById('editFolderDocuments').checked = Boolean(guest.permissions?.folderAccess?.documents);
  document.getElementById('editFolderDownloads').checked = Boolean(guest.permissions?.folderAccess?.downloads);
  document.getElementById('editPermDownload').checked = Boolean(guest.permissions?.canDownload);
  document.getElementById('editPermWrite').checked = Boolean(guest.permissions?.canWrite);
  document.getElementById('editPermDelete').checked = Boolean(guest.permissions?.canDelete);

  editCustomFolders = Array.isArray(guest.permissions?.folderAccess?.customFolders)
    ? JSON.parse(JSON.stringify(guest.permissions.folderAccess.customFolders))
    : [];
  renderEditCustomFolders();

  modal.classList.add('active');
}

function closeEditGuestModal() {
  const modal = document.getElementById('editGuestModal');
  if (modal) modal.classList.remove('active');
}

const editGuestCloseBtn = document.getElementById('editGuestCloseBtn');
const editGuestCancelBtn = document.getElementById('editGuestCancelBtn');
const editGuestForm = document.getElementById('editGuestForm');

if (editGuestCloseBtn) editGuestCloseBtn.onclick = closeEditGuestModal;
if (editGuestCancelBtn) editGuestCancelBtn.onclick = closeEditGuestModal;

if (editGuestForm) {
  editGuestForm.onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('editGuestId').value;
    const name = document.getElementById('editGuestName').value.trim();
    const password = document.getElementById('editGuestPassword').value;
    const canDownload = document.getElementById('editPermDownload').checked;
    const canWrite = document.getElementById('editPermWrite').checked;
    const canDelete = document.getElementById('editPermDelete').checked;
    const folderAccess = {
      desktop: document.getElementById('editFolderDesktop').checked,
      documents: document.getElementById('editFolderDocuments').checked,
      downloads: document.getElementById('editFolderDownloads').checked,
      customFolders: editCustomFolders
    };

    try {
      const payload = {
        id,
        name,
        permissions: {
          canDownload,
          canWrite,
          canDelete,
          folderAccess
        }
      };
      if (password && password.trim().length >= 4) {
        payload.password = password.trim();
      }

      const res = await fetch('/api/guests/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Guest updated successfully');
        closeEditGuestModal();
        loadGuests();
      } else {
        showToast(data.error || 'Failed to update guest');
      }
    } catch (err) {
      showToast(err.message);
    }
  };
}

// ---------------- PERMISSION REQUESTS & GUEST PERMISSIONS ----------------
async function loadPendingRequests() {
  if (currentUser?.role !== 'admin') return;
  try {
    const res = await fetch('/api/requests/pending');
    if (!res.ok) return;
    const data = await res.json();
    if (!data.success) return;

    const pendingRequestsList = document.getElementById('pendingRequestsList');
    const notifRequestsList = document.getElementById('notifRequestsList');
    const pendingRequestsCountBadge = document.getElementById('pendingRequestsCountBadge');
    const pendingRequestsCountPill = document.getElementById('pendingRequestsCountPill');

    const count = (data.pending || []).length;
    if (pendingRequestsCountBadge) {
      pendingRequestsCountBadge.textContent = `${count} Pending`;
    }
    if (pendingRequestsCountPill) {
      if (count > 0) {
        pendingRequestsCountPill.textContent = count;
        pendingRequestsCountPill.style.display = 'inline-flex';
      } else {
        pendingRequestsCountPill.style.display = 'none';
      }
    }

    function renderRequestsList(container) {
      if (!container) return;
      container.innerHTML = '';

      if (count === 0) {
        container.innerHTML = '<div style="color: var(--text-muted); font-size: 12px; padding: 10px 0; text-align: center;">No pending requests from guests.</div>';
        return;
      }

      data.pending.forEach(req => {
        const card = document.createElement('div');
        card.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); gap: 10px;';

        const senderDisplay = req.name ? `${escapeHtml(req.name)} (@${escapeHtml(req.username)})` : `@${escapeHtml(req.username)}`;

        card.innerHTML = `
          <div>
            <div style="font-size: 13px; font-weight: 600; color: var(--text-primary);">
              <span>${senderDisplay}</span> requested <span style="color: var(--accent-blue);">${escapeHtml(req.permissionLabel)}</span>
            </div>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">
              ${formatDate(req.createdAt)}
            </div>
          </div>
          <div style="display: flex; gap: 8px; flex-shrink: 0;">
            <button class="btn btn-primary btn-sm approve-req-btn" style="background: var(--accent-green); border-color: var(--accent-green); padding: 4px 10px; font-size: 12px;">Approve</button>
            <button class="btn btn-secondary btn-sm decline-req-btn" style="padding: 4px 10px; font-size: 12px;">Decline</button>
          </div>
        `;

        card.querySelector('.approve-req-btn').onclick = async () => {
          try {
            const ares = await fetch('/api/requests/approve', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ requestId: req.id })
            });
            const adata = await ares.json();
            if (adata.success) {
              showToast(`Approved "${req.permissionLabel}" for ${senderDisplay}`);
              loadPendingRequests();
              loadGuests();
              updateNotificationsSummary();
            } else {
              showToast(adata.error || 'Failed to approve');
            }
          } catch (e) {
            showToast(e.message);
          }
        };

        card.querySelector('.decline-req-btn').onclick = async () => {
          try {
            const dres = await fetch('/api/requests/decline', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ requestId: req.id })
            });
            const ddata = await dres.json();
            if (ddata.success) {
              showToast(`Declined request from ${senderDisplay}`);
              loadPendingRequests();
              updateNotificationsSummary();
            } else {
              showToast(ddata.error || 'Failed to decline');
            }
          } catch (e) {
            showToast(e.message);
          }
        };

        container.appendChild(card);
      });
    }

    renderRequestsList(pendingRequestsList);
    renderRequestsList(notifRequestsList);
  } catch (err) {}
}

async function loadGuestPermissions() {
  if (currentUser?.role === 'admin') return;

  const guestPermUsernameBadge = document.getElementById('guestPermUsernameBadge');
  if (guestPermUsernameBadge) {
    const disp = currentUser?.name ? `${currentUser.name} (@${currentUser.username})` : `@${currentUser?.username || 'guest'}`;
    guestPermUsernameBadge.textContent = disp;
  }

  // Permitted Folders Badges
  const guestAllowedFoldersDesc = document.getElementById('guestAllowedFoldersDesc');
  const guestAllowedFoldersBadges = document.getElementById('guestAllowedFoldersBadges');
  if (guestAllowedFoldersBadges) {
    const fa = currentUser?.permissions?.folderAccess || {};
    const allowed = [];
    if (fa.desktop) allowed.push('Desktop');
    if (fa.documents) allowed.push('Documents');
    if (fa.downloads) allowed.push('Downloads');
    if (Array.isArray(fa.customFolders)) {
      fa.customFolders.forEach(cf => {
        if (cf && cf.name) allowed.push(cf.name);
      });
    }

    if (guestAllowedFoldersDesc) {
      guestAllowedFoldersDesc.textContent = allowed.length > 0
        ? `Access granted to: ${allowed.join(', ')}`
        : 'No folder access assigned yet. Please contact admin.';
    }

    guestAllowedFoldersBadges.innerHTML = allowed.map(folder =>
      `<span class="conn-net-badge local" style="background: rgba(48, 209, 88, 0.15); color: var(--accent-green); border-color: rgba(48, 209, 88, 0.3);">${escapeHtml(folder)}</span>`
    ).join('') || '<span class="conn-net-badge" style="color: var(--accent-orange);">None</span>';
  }

  let requests = [];
  try {
    const res = await fetch('/api/requests/my');
    if (res.ok) {
      const data = await res.json();
      requests = data.requests || [];
    }
  } catch (err) {}

  const pendingWrite = requests.find(r => r.permission === 'canWrite' && r.status === 'pending');
  const pendingDelete = requests.find(r => r.permission === 'canDelete' && r.status === 'pending');

  const permWriteStatus = document.getElementById('permWriteStatus');
  if (permWriteStatus) {
    if (currentUser?.permissions?.canWrite) {
      permWriteStatus.innerHTML = '<span class="conn-net-badge local" style="background: rgba(48, 209, 88, 0.15); color: var(--accent-green); border-color: rgba(48, 209, 88, 0.3);">Granted</span>';
    } else if (pendingWrite) {
      permWriteStatus.innerHTML = '<span class="conn-net-badge" style="background: rgba(255, 159, 10, 0.15); color: var(--accent-orange); border-color: rgba(255, 159, 10, 0.3);">Pending Approval</span>';
    } else {
      permWriteStatus.innerHTML = '<button class="btn btn-primary btn-sm request-btn" style="padding: 4px 10px; font-size: 12px;">Request Permission</button>';
      permWriteStatus.querySelector('.request-btn').onclick = () => requestGuestPermission('canWrite');
    }
  }

  const permDeleteStatus = document.getElementById('permDeleteStatus');
  if (permDeleteStatus) {
    if (currentUser?.permissions?.canDelete) {
      permDeleteStatus.innerHTML = '<span class="conn-net-badge local" style="background: rgba(48, 209, 88, 0.15); color: var(--accent-green); border-color: rgba(48, 209, 88, 0.3);">Granted</span>';
    } else if (pendingDelete) {
      permDeleteStatus.innerHTML = '<span class="conn-net-badge" style="background: rgba(255, 159, 10, 0.15); color: var(--accent-orange); border-color: rgba(255, 159, 10, 0.3);">Pending Approval</span>';
    } else {
      permDeleteStatus.innerHTML = '<button class="btn btn-primary btn-sm request-btn" style="padding: 4px 10px; font-size: 12px;">Request Permission</button>';
      permDeleteStatus.querySelector('.request-btn').onclick = () => requestGuestPermission('canDelete');
    }
  }
}

async function requestGuestPermission(permission) {
  try {
    const res = await fetch('/api/requests/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ permission })
    });
    const data = await res.json();
    if (data.success) {
      showToast('Permission request submitted to administrator');
      loadGuestPermissions();
      updateNotificationsSummary();
    } else {
      showToast(data.error || 'Failed to submit request');
    }
  } catch (err) {
    showToast(err.message);
  }
}

createGuestForm.onsubmit = async (e) => {
  e.preventDefault();
  const name = document.getElementById('guestName').value.trim();
  const username = document.getElementById('guestUsername').value.trim();
  const password = document.getElementById('guestPassword').value;
  const canDownload = document.getElementById('permDownload').checked;
  const canWrite = document.getElementById('permWrite').checked;
  const canDelete = document.getElementById('permDelete').checked;
  const folderAccess = {
    desktop: document.getElementById('folderDesktop').checked,
    documents: document.getElementById('folderDocuments').checked,
    downloads: document.getElementById('folderDownloads').checked,
    customFolders: createCustomFolders
  };

  try {
    const res = await fetch('/api/guests/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        username,
        password,
        permissions: {
          canDownload,
          canWrite,
          canDelete,
          folderAccess
        }
      })
    });
    const data = await res.json();
    if (data.success) {
      showToast(`Guest "${name || username}" created successfully!`);
      createGuestForm.reset();
      createCustomFolders = [];
      renderCreateCustomFolders();
      document.getElementById('folderDownloads').checked = true;
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
        updateLocalNetworkInfo();
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

// Local Network Info in Settings
function updateLocalNetworkInfo() {
  const localUrl = currentLocalUrl || window.location.origin;
  if (settingsLocalUrl) {
    settingsLocalUrl.href = localUrl;
    settingsLocalUrl.textContent = localUrl;
  }
  fetch(`/api/system/qr?url=${encodeURIComponent(localUrl)}`)
    .then(r => r.json())
    .then(d => {
      if (d.success && settingsLocalQrImg) settingsLocalQrImg.src = d.qr;
    }).catch(() => {});
}

if (copyLocalUrlBtn) {
  copyLocalUrlBtn.onclick = () => {
    const localUrl = currentLocalUrl || window.location.origin;
    navigator.clipboard.writeText(localUrl)
      .then(() => showToast('Local LAN link copied to clipboard!'))
      .catch(() => showToast('Failed to copy link'));
  };
}

// Server Name Form Submission
if (serverNameForm) {
  serverNameForm.onsubmit = async (e) => {
    e.preventDefault();
    const name = serverNameInput.value.trim();
    if (!name) return;
    try {
      const res = await fetch('/api/settings/server-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (data.success) {
        if (headerServerName) headerServerName.textContent = data.serverName;
        document.title = `${data.serverName} — Personal Cloud`;
        showToast(`Server name updated to "${data.serverName}"`);
      } else {
        showToast(data.error || 'Failed to update server name');
      }
    } catch (err) {
      showToast('Error updating server name: ' + err.message);
    }
  };
}

function updateRemoteModalUI(data) {
  const isOnline = Boolean(data && data.running && data.url);
  if (remoteSwitchCheckbox) {
    remoteSwitchCheckbox.checked = isOnline;
  }
  if (remoteStatusBadge) {
    remoteStatusBadge.textContent = isOnline ? 'Online (Public HTTPS)' : 'Disabled (Local Only)';
    remoteStatusBadge.className = isOnline ? 'conn-net-badge remote' : 'conn-net-badge local';
  }
  if (remoteStatusExplanation) {
    remoteStatusExplanation.textContent = isOnline
      ? 'Your MacBook is securely reachable over the global internet via encrypted Cloudflare Tunnel.'
      : 'Remote tunnel is off. External internet traffic cannot reach your Mac. Only devices on your Wi-Fi / LAN can access.';
  }

  if (isOnline) {
    if (remoteActiveSection) remoteActiveSection.style.display = 'block';
    if (remoteInactiveSection) remoteInactiveSection.style.display = 'none';
    if (remoteModalLink) {
      remoteModalLink.href = data.url;
      remoteModalLink.textContent = data.url;
    }
    fetch(`/api/system/qr?url=${encodeURIComponent(data.url)}`)
      .then(r => r.json())
      .then(d => {
        if (d.success && remoteModalQrImg) remoteModalQrImg.src = d.qr;
      }).catch(() => {});
  } else {
    if (remoteActiveSection) remoteActiveSection.style.display = 'none';
    if (remoteInactiveSection) remoteInactiveSection.style.display = 'block';
  }
}

if (remoteSwitchCheckbox) {
  remoteSwitchCheckbox.onchange = async () => {
    const shouldStart = remoteSwitchCheckbox.checked;
    showToast(shouldStart ? 'Starting Remote Internet Tunnel...' : 'Stopping Remote Internet Access...');
    try {
      const res = await fetch('/api/system/tunnel/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: shouldStart ? 'start' : 'stop' })
      });
      const data = await res.json();
      await updateTunnelStatus();
      updateRemoteModalUI(data);
      showToast(data.running ? 'Remote Access is now ONLINE' : 'Remote Access is now OFF (Local Only)');
    } catch (err) {
      showToast('Toggle error: ' + err.message);
      remoteSwitchCheckbox.checked = !shouldStart;
    }
  };
}

if (copyRemoteUrlBtn) {
  copyRemoteUrlBtn.onclick = () => {
    if (currentTunnelUrl) {
      navigator.clipboard.writeText(currentTunnelUrl)
        .then(() => showToast('Remote link copied to clipboard!'))
        .catch(() => showToast('Failed to copy link'));
    }
  };
}

// Settings Navigation Tabs
function switchSettingsTab(tabName) {
  const isAdmin = currentUser?.role === 'admin';
  if (!isAdmin) {
    if (tabName !== 'remote' && tabName !== 'permissions') {
      tabName = 'remote';
    }
  }

  document.querySelectorAll('.settings-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  document.querySelectorAll('.settings-tab-pane').forEach(pane => {
    pane.style.display = 'none';
  });

  const tabId = 'pane' + tabName.charAt(0).toUpperCase() + tabName.slice(1);
  const targetPane = document.getElementById(tabId);
  if (targetPane) targetPane.style.display = 'block';

  if (tabName === 'general' && isAdmin) updateLocalNetworkInfo();
  if (tabName === 'remote') {
    fetch('/api/system/tunnel')
      .then(r => r.json())
      .then(d => updateRemoteModalUI(d))
      .catch(() => {});
  }
  if (tabName === 'permissions' && !isAdmin) loadGuestPermissions();
  if (tabName === 'connections' && isAdmin) loadConnections();
  if (tabName === 'guests' && isAdmin) {
    loadGuests();
    loadPendingRequests();
  }
}

document.querySelectorAll('.settings-tab-btn').forEach(btn => {
  btn.onclick = () => switchSettingsTab(btn.dataset.tab);
});

function openSettings(tab) {
  if (settingsModal) {
    const isAdmin = currentUser?.role === 'admin';
    if (!tab) {
      tab = isAdmin ? 'general' : 'remote';
    }
    if (!isAdmin && tab !== 'remote' && tab !== 'permissions') {
      tab = 'remote';
    }
    settingsModal.classList.add('active');
    switchSettingsTab(tab);
  }
}

if (settingsBtn) {
  settingsBtn.onclick = () => openSettings();
}
if (tunnelBadge) {
  tunnelBadge.onclick = () => openSettings('remote');
}
if (settingsCloseBtn) {
  settingsCloseBtn.onclick = () => settingsModal.classList.remove('active');
}

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
if (copyCurrentPathBtn) {
  copyCurrentPathBtn.onclick = () => {
    if (!currentPath) {
      showToast('No directory path available');
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(currentPath).then(() => {
        showToast(`Copied folder path: ${currentPath}`);
      }).catch(() => {
        fallbackCopyText(currentPath);
      });
    } else {
      fallbackCopyText(currentPath);
    }
  };
}

function fallbackCopyText(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  showToast(`Copied: ${text}`);
}

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

// Notifications & Messages Modal Management
let activeNotifTab = 'requests';

function openNotifModal(tab = 'requests') {
  if (!notifModal) return;
  const isAdmin = currentUser?.role === 'admin';
  if (adminNotifSection) adminNotifSection.style.display = isAdmin ? 'block' : 'none';
  if (guestNotifSection) guestNotifSection.style.display = !isAdmin ? 'block' : 'none';

  notifModal.classList.add('active');

  if (isAdmin) {
    switchNotifTab(tab);
    loadPendingRequests();
    loadAdminMessages();
  } else {
    loadGuestMessages();
  }
  updateNotificationsSummary();
}

function closeNotifModal() {
  if (notifModal) notifModal.classList.remove('active');
}

function switchNotifTab(tab) {
  activeNotifTab = tab;
  if (tab === 'requests') {
    if (notifTabReqBtn) notifTabReqBtn.classList.add('active');
    if (notifTabMsgBtn) notifTabMsgBtn.classList.remove('active');
    if (paneNotifRequests) paneNotifRequests.style.display = 'block';
    if (paneNotifMessages) paneNotifMessages.style.display = 'none';
    loadPendingRequests();
  } else {
    if (notifTabReqBtn) notifTabReqBtn.classList.remove('active');
    if (notifTabMsgBtn) notifTabMsgBtn.classList.add('active');
    if (paneNotifRequests) paneNotifRequests.style.display = 'none';
    if (paneNotifMessages) paneNotifMessages.style.display = 'block';
    loadAdminMessages();
  }
}

if (notifBtn) notifBtn.onclick = () => openNotifModal('requests');
if (notifCloseBtn) notifCloseBtn.onclick = closeNotifModal;
if (notifTabReqBtn) notifTabReqBtn.onclick = () => switchNotifTab('requests');
if (notifTabMsgBtn) notifTabMsgBtn.onclick = () => switchNotifTab('messages');

async function updateNotificationsSummary() {
  try {
    const res = await fetch('/api/notifications/summary');
    if (!res.ok) return;
    const data = await res.json();
    if (!data.success) return;

    const totalUnread = data.totalUnread || 0;
    if (notifBadgeCount) {
      if (totalUnread > 0) {
        notifBadgeCount.textContent = totalUnread > 99 ? '99+' : totalUnread;
        notifBadgeCount.style.display = 'inline-flex';
      } else {
        notifBadgeCount.style.display = 'none';
      }
    }

    if (notifReqCountPill) {
      const pCount = data.pendingRequestsCount || 0;
      if (pCount > 0) {
        notifReqCountPill.textContent = pCount;
        notifReqCountPill.style.display = 'inline-flex';
      } else {
        notifReqCountPill.style.display = 'none';
      }
    }

    if (notifMsgCountPill) {
      const mCount = data.unreadMessagesCount || 0;
      if (mCount > 0) {
        notifMsgCountPill.textContent = mCount;
        notifMsgCountPill.style.display = 'inline-flex';
      } else {
        notifMsgCountPill.style.display = 'none';
      }
    }
  } catch (err) {}
}

async function loadAdminMessages() {
  if (currentUser?.role !== 'admin') return;
  if (!notifMessagesList) return;
  try {
    const res = await fetch('/api/messages/all');
    if (!res.ok) return;
    const data = await res.json();
    if (!data.success) return;

    const msgs = data.messages || [];
    notifMessagesList.innerHTML = '';

    if (msgs.length === 0) {
      notifMessagesList.innerHTML = '<div style="color: var(--text-muted); font-size: 12px; padding: 12px 0; text-align: center;">No messages from guests yet.</div>';
      return;
    }

    msgs.forEach(msg => {
      const card = document.createElement('div');
      card.className = `notif-card ${msg.read ? '' : 'unread'}`;

      const senderDisplay = msg.name ? `${escapeHtml(msg.name)} (@${escapeHtml(msg.username)})` : `@${escapeHtml(msg.username)}`;
      const unreadBadge = !msg.read ? '<span class="conn-net-badge" style="background: rgba(10, 132, 255, 0.15); color: var(--accent-blue); border-color: rgba(10, 132, 255, 0.3);">New</span>' : '';

      card.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <strong style="font-size: 13px; color: var(--text-primary);">${senderDisplay}</strong>
            ${unreadBadge}
          </div>
          <span style="font-size: 11px; color: var(--text-secondary); flex-shrink: 0;">${formatDate(msg.createdAt)}</span>
        </div>
        <div class="notif-msg-body">${escapeHtml(msg.text)}</div>
        <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 10px;">
          ${!msg.read ? '<button class="btn btn-secondary btn-sm mark-read-btn" style="padding: 3px 8px; font-size: 11px;">Mark as Read</button>' : ''}
          <button class="btn btn-danger btn-sm del-msg-btn" style="padding: 3px 8px; font-size: 11px;">Delete</button>
        </div>
      `;

      const markBtn = card.querySelector('.mark-read-btn');
      if (markBtn) {
        markBtn.onclick = async () => {
          try {
            await fetch('/api/messages/read', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ messageId: msg.id })
            });
            loadAdminMessages();
            updateNotificationsSummary();
          } catch (e) {
            showToast(e.message);
          }
        };
      }

      const delBtn = card.querySelector('.del-msg-btn');
      if (delBtn) {
        delBtn.onclick = async () => {
          try {
            await fetch('/api/messages/delete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ messageId: msg.id })
            });
            loadAdminMessages();
            updateNotificationsSummary();
          } catch (e) {
            showToast(e.message);
          }
        };
      }

      notifMessagesList.appendChild(card);
    });
  } catch (err) {}
}

if (markAllReadBtn) {
  markAllReadBtn.onclick = async () => {
    try {
      const res = await fetch('/api/messages/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true })
      });
      const data = await res.json();
      if (data.success) {
        showToast('All messages marked as read');
        loadAdminMessages();
        updateNotificationsSummary();
      }
    } catch (e) {
      showToast(e.message);
    }
  };
}

async function loadGuestMessages() {
  if (currentUser?.role === 'admin') return;
  if (!guestMyMessagesList) return;
  try {
    const res = await fetch('/api/messages/my');
    if (!res.ok) return;
    const data = await res.json();
    if (!data.success) return;

    const msgs = data.messages || [];
    guestMyMessagesList.innerHTML = '';

    if (msgs.length === 0) {
      guestMyMessagesList.innerHTML = '<div style="color: var(--text-muted); font-size: 12px; padding: 8px 0;">You have not sent any messages yet.</div>';
      return;
    }

    msgs.forEach(msg => {
      const card = document.createElement('div');
      card.className = 'notif-card';
      const statusBadge = msg.read
        ? '<span class="conn-net-badge local" style="background: rgba(48, 209, 88, 0.15); color: var(--accent-green); border-color: rgba(48, 209, 88, 0.3); font-size: 10px;">Read by Admin</span>'
        : '<span class="conn-net-badge" style="background: rgba(255, 159, 10, 0.15); color: var(--accent-orange); border-color: rgba(255, 159, 10, 0.3); font-size: 10px;">Delivered</span>';

      card.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
          <span style="font-size: 11px; color: var(--text-secondary);">${formatDate(msg.createdAt)}</span>
          ${statusBadge}
        </div>
        <div class="notif-msg-body">${escapeHtml(msg.text)}</div>
      `;
      guestMyMessagesList.appendChild(card);
    });
  } catch (err) {}
}

if (guestSendMessageForm) {
  guestSendMessageForm.onsubmit = async (e) => {
    e.preventDefault();
    if (!guestMessageInput) return;
    const text = guestMessageInput.value.trim();
    if (!text) return;

    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Message sent to server administrator');
        guestMessageInput.value = '';
        loadGuestMessages();
        updateNotificationsSummary();
      } else {
        showToast(data.error || 'Failed to send message');
      }
    } catch (err) {
      showToast(err.message);
    }
  };
}

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
    if (editorModal) editorModal.classList.remove('active');
    closeMediaPreview();
    if (settingsModal) settingsModal.classList.remove('active');
    if (notifModal) notifModal.classList.remove('active');
    closeEditGuestModal();
    closePrompt();
    closeItemActionSheet();
    closeMobileSidebar();
  }
});

previewCloseBtn.onclick = closeMediaPreview;

// Mobile bottom bar buttons
const mobileConnectionsBtn = document.getElementById('mobileConnectionsBtn');
if (mobileConnectionsBtn) {
  mobileConnectionsBtn.onclick = () => openSettings('connections');
}
const mobilePermsBtn = document.getElementById('mobilePermsBtn');
if (mobilePermsBtn) {
  mobilePermsBtn.onclick = () => openSettings('permissions');
}
if (mobileQrBtn) {
  mobileQrBtn.onclick = () => openSettings('remote');
}

// Mobile sidebar drawer
menuToggleBtn.onclick = () => {
  appSidebar.classList.toggle('open');
  sidebarBackdrop.classList.toggle('active');
};
sidebarBackdrop.onclick = closeMobileSidebar;

// Initialize
async function init() {
  await checkAuth();
  await updateMetrics();
  await updateTunnelStatus();
  await loadDirectory();
  await updateNotificationsSummary();

  if (currentUser?.role === 'admin') {
    loadConnections();
    loadPendingRequests();
  } else {
    loadGuestPermissions();
  }

  setInterval(updateMetrics, 10000);
  setInterval(updateTunnelStatus, 8000);
  setInterval(updateNotificationsSummary, 6000);
  setInterval(() => {
    if (currentUser?.role === 'admin') {
      loadConnections();
      loadPendingRequests();
    }
  }, 6000);
}

init();
