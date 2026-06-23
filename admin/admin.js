/* ==========================================================================
   Ruven Studio Admin Panel — JavaScript
   Complete logic: Auth, Routing, Modals, Toasts, CMD Palette, AI, etc.
   ========================================================================== */

'use strict';

// ============================================================
// STATE
// ============================================================
const STATE = {
  currentSection: 'dashboard',
  sidebarCollapsed: false,
  isAuthenticated: false,
  user: { name: 'Samuel Ruven', email: 'samuel@ruvenstudio.in', role: 'super-admin', initials: 'SR' },
  users: [
    { id: 1, name: 'Samuel Ruven', email: 'samuel@ruvenstudio.in', role: 'super-admin', active: 'Just now', status: 'active', bg: 'linear-gradient(135deg,var(--brand-burgundy),var(--brand-gold))', initials: 'SR' },
    { id: 2, name: 'James Kumar', email: 'james@ruvenstudio.com', role: 'store-manager', active: '2h ago', status: 'active', bg: 'linear-gradient(135deg,#3b82f6,#60a5fa)', initials: 'JK' },
    { id: 3, name: 'Sarah Philip', email: 'sarah@ruvenstudio.com', role: 'content-manager', active: 'Yesterday', status: 'active', bg: 'linear-gradient(135deg,var(--color-success),#86efac)', initials: 'SP' },
    { id: 4, name: 'Mark Thomas', email: 'mark@ruvenstudio.com', role: 'support', active: '3d ago', status: 'inactive', bg: 'linear-gradient(135deg,#8b5cf6,#a78bfa)', initials: 'MT' }
  ],
  permissions: {
    'super-admin': ['homepage', 'products', 'articles', 'orders', 'analytics', 'users', 'settings'],
    'admin': ['homepage', 'products', 'articles', 'orders', 'analytics', 'users', 'settings'],
    'store-manager': ['products', 'orders', 'analytics'],
    'content-manager': ['homepage', 'articles', 'media'],
    'product-manager': ['products', 'media'],
    'marketing-manager': ['analytics', 'discounts', 'campaigns'],
    'support': ['orders'],
    'warehouse-manager': ['products'],
    'community-manager': ['community'],
    'finance': ['analytics'],
    'guest': []
  },
  activityLog: [
    { id: 1, time: '10 mins ago', user: 'Samuel Ruven', action: 'Product created', resource: 'Armor of Light Tee (White)', hasUndo: false },
    { id: 2, time: '1 hour ago', user: 'Samuel Ruven', action: 'User invited', resource: 'james@ruvenstudio.com', hasUndo: false },
    { id: 3, time: '2 hours ago', user: 'Samuel Ruven', action: 'Settings changed', resource: 'Appearance (Primary color)', hasUndo: false }
  ],
  articles: [
    { id: 1, title: 'Romans 13: Put on the Armor of Light', subtitle: 'A deep dive into spiritual warfare and daily living', author: 'Pastor James', category: 'Devotional', views: 1240, status: 'published', date: 'Jun 15', tags: 'romans, faith, armor', text: 'Romans 13:12 opens with a striking declaration: "The night is nearly over; the day is almost here." Paul writes this to the church in Rome, reminding them of the urgency of their spiritual calling.', verse: 'Romans 13:12' },
    { id: 2, title: 'Faith That Moves Mountains', subtitle: 'Mark 11:23 and the power of unwavering belief', author: 'Sarah Philip', category: 'Scripture Study', views: 892, status: 'published', date: 'Jun 08', tags: 'faith, power, mark', text: 'Faith that moves mountains...', verse: 'Mark 11:23' },
    { id: 3, title: 'Grace Collection: Behind the Design', subtitle: 'How each piece is rooted in scripture', author: 'Sarah Philip', category: 'Brand Story', views: 0, status: 'draft', date: '—', tags: 'grace, branding, fashion', text: 'Behind the Grace Collection...', verse: 'Ephesians 2:8' },
    { id: 4, title: 'Walk by Faith, Not by Sight', subtitle: 'Living 2 Corinthians 5:7 in daily work', author: 'Mark Thomas', role: 'content-writer', category: 'Devotional', views: 0, status: 'review', date: '—', tags: 'faith, lifestyle, walking', text: 'Walking by faith...', verse: '2 Corinthians 5:7' }
  ],
  currentArticleTab: 'all',
  products: [
    { id: 1, name: 'Armor of Light Tee', sku: 'RS-001', price: 2890, stock: 3, status: 'published', collection: 'Faith Essentials', thumb: '👕', tags: 'armor, light, romans', desc: 'Premium t-shirt based on Romans 13:12', longDesc: 'This premium heavyweight tee is crafted for those who walk in faith daily...' },
    { id: 2, name: 'Child of God Tee (Black)', sku: 'RS-002', price: 2690, stock: 7, status: 'published', collection: 'Armor Collection', thumb: '🖤', tags: 'child, god, black', desc: 'Inspired by Galatians 3:26', longDesc: 'You are all children of God through faith in Christ Jesus...' },
    { id: 3, name: 'Child of God Tee (White)', sku: 'RS-003', price: 2690, stock: 42, status: 'published', collection: 'Faith Essentials', thumb: '⚪', tags: 'child, god, white', desc: 'Inspired by Galatians 3:26', longDesc: 'You are all children of God through faith in Christ Jesus...' },
    { id: 4, name: 'Grace Oversized Hoodie', sku: 'RS-004', price: 4490, stock: 15, status: 'draft', collection: 'Armor Collection', thumb: '🕊️', tags: 'grace, hoodie, oversized', desc: 'Cozy oversized fit inspired by Ephesians 2:8', longDesc: 'By grace you have been saved through faith...' },
    { id: 5, name: 'Faith Walk Cap', sku: 'RS-005', price: 1290, stock: 28, status: 'published', collection: 'Accessories', thumb: '📿', tags: 'faith, walk, cap', desc: 'Minimalist cap with custom scripture embroidery', longDesc: 'For we walk by faith, not by sight...' }
  ],
  currentProductTab: 'all'
};

const UNDO_ACTIONS = {};
let logIdCounter = 4;

const PERMISSION_DEFINITIONS = [
  { key: 'homepage', label: 'Can Edit Homepage', desc: 'Modify sections and hero layout in Homepage Builder' },
  { key: 'products', label: 'Can Publish Products', desc: 'Create, update, and publish products in the catalog' },
  { key: 'articles', label: 'Can Edit Articles', desc: 'Draft and edit devotional articles in Faith Journal' },
  { key: 'orders', label: 'Can Refund Orders', desc: 'Manage invoices, process full and partial refunds' },
  { key: 'analytics', label: 'Can Access Analytics', desc: 'View revenue reports, traffic sources and conversions' },
  { key: 'users', label: 'Can Manage Users', desc: 'Invite team members and change system roles' },
  { key: 'settings', label: 'Can Edit Settings', desc: 'Modify shop details, API keys, and security setups' }
];

// Valid admin accounts — email: password
// Password is checked against localStorage first, then falls back to default
const ADMIN_ACCOUNTS = {
  'samuel@ruvenstudio.in':  { name: 'Samuel Ruven',  initials: 'SR', defaultPw: 'Ruven@2026' },
  'admin@ruvenstudio.com':  { name: 'Super Admin',   initials: 'SA', defaultPw: 'Ruven@2026' },
  'admin@ruvenstudio.in':   { name: 'Samuel Ruven',  initials: 'SR', defaultPw: 'Ruven@2026' },
};

function getStoredPassword(email) {
  return localStorage.getItem(`rs_pw_${btoa(email)}`) || null;
}

function setStoredPassword(email, pw) {
  localStorage.setItem(`rs_pw_${btoa(email)}`, pw);
}

// ============================================================
// DOM READY
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initAuth();
  initOTP();
  initCmdPalette();
  initTabs();
  initTabsUnderline();
  initAnimations();
  checkSession();
});

function initTheme() {
  const saved = localStorage.getItem('rs_theme') || 'dark';
  setThemeSilent(saved);
}

function setThemeSilent(theme) {
  let activeTheme = theme;
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    activeTheme = prefersDark ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', activeTheme);
}

function setTheme(theme) {
  let activeTheme = theme;
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    activeTheme = prefersDark ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', activeTheme);
  localStorage.setItem('rs_theme', theme);
  showToast('success', 'Theme Updated', `Theme set to ${theme}`);
}

function toggleThemeMenu(event) {
  event.stopPropagation();
  const menu = document.getElementById('theme-menu');
  if (menu) {
    const display = menu.style.display;
    menu.style.display = display === 'none' ? 'block' : 'none';
    if (menu.style.display === 'block') {
      document.addEventListener('click', closeThemeMenu, { once: true });
    }
  }
}

function closeThemeMenu() {
  const menu = document.getElementById('theme-menu');
  if (menu) menu.style.display = 'none';
}

function toggleNavGroup(el) {
  const group = el.closest('.nav-group');
  if (group) {
    group.classList.toggle('expanded');
  }
}

// ============================================================
// SESSION & AUTH
// ============================================================
function checkSession() {
  const saved = sessionStorage.getItem('rs_admin_auth');
  if (saved === 'true') {
    enterAdmin();
  }
}

function initAuth() {
  const form = document.getElementById('login-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email    = document.getElementById('login-email').value.trim().toLowerCase();
      const password = document.getElementById('login-password').value;
      const btn      = document.getElementById('login-btn');
      const errBox   = document.getElementById('login-error');

      errBox.style.display = 'none';

      if (!email || !password) {
        errBox.textContent = '❌ Please enter both your email and password.';
        errBox.style.display = 'block';
        return;
      }

      const account = ADMIN_ACCOUNTS[email];
      if (!account) {
        errBox.textContent = '❌ No admin account found for this email.';
        errBox.style.display = 'block';
        return;
      }

      // Check stored password first, then fall back to default
      const storedPw  = getStoredPassword(email);
      const validPw   = storedPw || account.defaultPw;

      if (password !== validPw) {
        errBox.textContent = '❌ Incorrect password. Hint: default is Ruven@2026';
        errBox.style.display = 'block';
        // shake the card
        const card = btn.closest('.auth-card');
        card.style.animation = 'none';
        setTimeout(() => card.style.animation = 'shake 0.4s ease', 10);
        return;
      }

      // Correct credentials
      btn.classList.add('btn-loading');
      btn.disabled = true;
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;animation:spin 0.8s linear infinite"><path d="M12 2a10 10 0 1 0 10 10"/></svg> Signing in…';

      STATE.user = { name: account.name, email, role: 'super-admin', initials: account.initials };

      setTimeout(() => {
        btn.classList.remove('btn-loading');
        btn.disabled = false;
        sessionStorage.setItem('rs_admin_auth', 'true');
        sessionStorage.setItem('rs_admin_user', JSON.stringify(STATE.user));
        enterAdmin();
      }, 1000);
    });
  }
}

function enterAdmin() {
  STATE.isAuthenticated = true;

  // Restore user from session if available
  const savedUser = sessionStorage.getItem('rs_admin_user');
  if (savedUser) STATE.user = JSON.parse(savedUser);

  document.querySelectorAll('.auth-screen').forEach(s => s.classList.remove('active'));
  document.getElementById('admin-app').classList.add('active');

  // Update sidebar with logged-in user info
  const nameEl   = document.getElementById('sidebar-name');
  const emailEl  = document.getElementById('sidebar-email');
  const avatarEl = document.getElementById('sidebar-avatar');
  if (nameEl)   nameEl.textContent   = STATE.user.name;
  if (emailEl)  emailEl.textContent  = STATE.user.email;
  if (avatarEl) avatarEl.textContent = STATE.user.initials;

  navigate('dashboard');
  showToast('success', `Welcome back, ${STATE.user.name.split(' ')[0]} 👋`, 'You are logged in as Super Admin');
  startRealTimeClock();
  renderNotifications();
  renderRoleDashboard();
}

function logout() {
  sessionStorage.removeItem('rs_admin_auth');
  STATE.isAuthenticated = false;
  document.getElementById('admin-app').classList.remove('active');
  document.getElementById('screen-login').classList.add('active');
  showToast('info', 'Signed out', 'You have been logged out securely');

  // Reset login button
  const btn = document.getElementById('login-btn');
  if (btn) {
    btn.textContent = '';
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg> Sign in`;
    btn.disabled = false;
  }
}

function showScreen(id) {
  document.querySelectorAll('.auth-screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
}

function selectRole(el) {
  el.closest('.role-select-grid').querySelectorAll('.role-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

// ============================================================
// 2FA OTP
// ============================================================
function initOTP() {
  const inputs = document.querySelectorAll('.otp-input');
  inputs.forEach((input, idx) => {
    input.addEventListener('input', () => {
      if (input.value) {
        input.classList.add('filled');
        if (idx < inputs.length - 1) inputs[idx + 1].focus();
      }
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && idx > 0) {
        inputs[idx - 1].focus();
        inputs[idx - 1].classList.remove('filled');
      }
    });
    input.addEventListener('paste', (e) => {
      const data = e.clipboardData.getData('text').slice(0, 6);
      inputs.forEach((inp, i) => {
        if (data[i]) { inp.value = data[i]; inp.classList.add('filled'); }
      });
      e.preventDefault();
    });
  });
}

function complete2FA() {
  const inputs = document.querySelectorAll('.otp-input');
  const code = Array.from(inputs).map(i => i.value).join('');
  if (code.length < 6) {
    showToast('error', 'Incomplete Code', 'Please enter all 6 digits');
    return;
  }
  sessionStorage.setItem('rs_admin_auth', 'true');
  enterAdmin();
}

// ============================================================
// NAVIGATION / ROUTING
// ============================================================
function navigate(section) {
  STATE.currentSection = section;

  // Update sidebar active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('onclick') && item.getAttribute('onclick').includes(`'${section}'`)) {
      item.classList.add('active');
      const group = item.closest('.nav-group');
      if (group) group.classList.add('expanded');
    }
  });

  // Hide all panels
  document.querySelectorAll('.section-panel').forEach(p => p.classList.remove('active'));

  // Show target panel
  const panel = document.getElementById(`panel-${section}`);
  if (panel) {
    panel.classList.add('active');
    // Scroll top
    const main = document.getElementById('admin-main');
    if (main) main.scrollTo({ top: 0, behavior: 'smooth' });

    // Page initializers with simulated skeleton loaders
    if (section === 'users') {
      const tbody = document.getElementById('team-table-body');
      if (tbody) tbody.innerHTML = `<tr><td colspan="6"><div class="skeleton" style="height:24px;margin-bottom:8px;"></div><div class="skeleton" style="height:24px;margin-bottom:8px;"></div><div class="skeleton" style="height:24px;"></div></td></tr>`;
      setTimeout(() => { if (STATE.currentSection === 'users') renderTeamDirectory(); }, 250);
      const roleSelect = document.getElementById('rbac-role-select');
      if (roleSelect) loadRolePermissions(roleSelect.value);
    } else if (section === 'audit') {
      const tbody = document.getElementById('audit-table-body');
      if (tbody) tbody.innerHTML = `<tr><td colspan="5"><div class="skeleton" style="height:24px;margin-bottom:8px;"></div><div class="skeleton" style="height:24px;margin-bottom:8px;"></div><div class="skeleton" style="height:24px;"></div></td></tr>`;
      setTimeout(() => { if (STATE.currentSection === 'audit') renderAuditLogs(); }, 250);
    } else if (section === 'articles') {
      const tbody = document.getElementById('articles-table-body');
      if (tbody) tbody.innerHTML = `<tr><td colspan="7"><div class="skeleton" style="height:24px;margin-bottom:8px;"></div><div class="skeleton" style="height:24px;margin-bottom:8px;"></div><div class="skeleton" style="height:24px;"></div></td></tr>`;
      setTimeout(() => { if (STATE.currentSection === 'articles') renderArticles(); }, 250);
    } else if (section === 'products') {
      const tbody = document.getElementById('products-table-body');
      if (tbody) tbody.innerHTML = `<tr><td colspan="7"><div class="skeleton" style="height:24px;margin-bottom:8px;"></div><div class="skeleton" style="height:24px;margin-bottom:8px;"></div><div class="skeleton" style="height:24px;"></div></td></tr>`;
      setTimeout(() => { if (STATE.currentSection === 'products') renderProducts(); }, 250);
    } else if (section === 'homepage') {
      const p = document.getElementById('homepage-preview-container');
      if (p) p.innerHTML = `<div class="skeleton-card" style="height:120px;margin-bottom:12px;"></div><div class="skeleton-card" style="height:120px;"></div>`;
      setTimeout(() => { if (STATE.currentSection === 'homepage') renderHomepageBuilder(); }, 250);
    } else if (section === 'media') {
      const g = document.getElementById('media-grid-container');
      if (g) g.innerHTML = `<div class="skeleton-card" style="height:100px;margin-bottom:12px;"></div><div class="skeleton-card" style="height:100px;"></div>`;
      setTimeout(() => { if (STATE.currentSection === 'media') renderMediaLibrary(); }, 250);
    }
  }

  // Update breadcrumb
  const labels = {
    dashboard: 'Dashboard',
    products: 'Products',
    collections: 'Collections',
    media: 'Media Library',
    orders: 'Orders',
    customers: 'Customers',
    discounts: 'Discounts',
    articles: 'Faith Journal',
    verses: 'Verse Library',
    homepage: 'Homepage Builder',
    navigation: 'Navigation',
    community: 'Community',
    reviews: 'Reviews',
    marketing: 'Marketing',
    analytics: 'Analytics',
    newsletter: 'Newsletter',
    users: 'Users & Roles',
    settings: 'Settings',
    audit: 'Audit Logs',
  };
  const breadcrumb = document.getElementById('header-section');
  if (breadcrumb) breadcrumb.textContent = labels[section] || section;

  // Update new button label
  const newBtnLabels = {
    products: 'New Product',
    articles: 'New Article',
    customers: 'New Customer',
    discounts: 'New Discount',
    orders: 'Export',
    collections: 'New Collection',
    verses: 'Add Verse',
    users: 'Invite User',
    media: 'Upload',
    newsletter: 'New Campaign',
    marketing: 'New Campaign',
  };
  const newBtn = document.getElementById('header-new-btn');
  if (newBtn) {
    const lbl = newBtnLabels[section] || 'New';
    newBtn.lastChild.textContent = ` ${lbl}`;
  }
}

// ============================================================
// SIDEBAR TOGGLE
// ============================================================
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  STATE.sidebarCollapsed = !STATE.sidebarCollapsed;
  sidebar.classList.toggle('collapsed', STATE.sidebarCollapsed);
}

// ============================================================
// MODALS
// ============================================================
function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    closeModal(e.target.id);
  }
});

function openProductEditor() { openModal('modal-product'); }
function openArticleEditor() { openModal('modal-article'); }
function openOrderDetail()   { openModal('modal-order'); }
function openDiscountModal() { navigate('discounts'); openModal('modal-discount'); }
function openInviteModal()   { openModal('modal-invite'); }
function openVerseModal()    { openModal('modal-verse'); }
function openNewItemModal()  { openModal('modal-new'); }

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
const toastIcons = {
  success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`,
  error:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  info:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
};

function showToast(type = 'info', title = '', message = '', duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${toastIcons[type] || toastIcons.info}</div>
    <div class="toast-content">
      ${title ? `<div class="toast-title">${title}</div>` : ''}
      ${message ? `<div class="toast-message">${message}</div>` : ''}
    </div>
    <div class="toast-close" onclick="this.parentElement.remove()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </div>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Add toast exit animation
const style = document.createElement('style');
style.textContent = `@keyframes toastOut { from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(100%)} }`;
document.head.appendChild(style);

// ============================================================
// CMD PALETTE
// ============================================================
function initCmdPalette() {
  document.addEventListener('keydown', (e) => {
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    const cmdKey = isMac ? e.metaKey : e.ctrlKey;
    if (cmdKey && e.key === 'k') {
      e.preventDefault();
      openCmdPalette();
    }
    if (e.key === 'Escape') closeCmdPalette();
  });
}

function openCmdPalette() {
  if (!STATE.isAuthenticated) return;
  const overlay = document.getElementById('cmd-overlay');
  overlay.classList.add('open');
  setTimeout(() => {
    const input = document.getElementById('cmd-input');
    if (input) { input.value = ''; input.focus(); }
  }, 50);
  filterCmdResults('');
}

function closeCmdPalette(e) {
  if (e && e.target !== document.getElementById('cmd-overlay')) return;
  document.getElementById('cmd-overlay').classList.remove('open');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') document.getElementById('cmd-overlay')?.classList.remove('open');
});

const COMMAND_PALETTE_ITEMS = [
  { type: 'nav', label: 'Dashboard Overview', sub: 'Jump to main Overview metrics', search: 'overview analytics home dashboard', action: () => navigate('dashboard') },
  { type: 'nav', label: 'Product Catalog', sub: 'Manage products, pricing, and variants', search: 'catalog items inventory stock shirts hoodies', action: () => navigate('products') },
  { type: 'nav', label: 'Order Processing', sub: 'Customer sales, status and refunds', search: 'invoices shipping returns fulfillment orders', action: () => navigate('orders') },
  { type: 'nav', label: 'Faith Journal CMS', sub: 'Write and moderate devotional articles', search: 'articles content devotional blog publisher bible scriptures', action: () => navigate('articles') },
  { type: 'nav', label: 'Team Directory & Access', sub: 'Teammate permissions and security roles', search: 'employees access control roles permissions user', action: () => navigate('users') },
  { type: 'nav', label: 'Activity & Audit Trail', sub: 'Operations logs and history', search: 'activity undo logs history actions security', action: () => navigate('audit') },
  { type: 'nav', label: 'System Settings', sub: 'General details, integrations and API keys', search: 'integrations domains keys payments appearance', action: () => navigate('settings') },
  
  { type: 'action', label: 'Create Product', sub: 'Add new item to catalog', search: 'new catalog product item apparel', action: () => { navigate('products'); openProductEditor(); } },
  { type: 'action', label: 'Write Article', sub: 'Draft new devotional entry', search: 'new post journal devotion', action: () => { navigate('articles'); openArticleEditor(); } },
  { type: 'action', label: 'Invite Teammate', sub: 'Send email access invitation', search: 'invite user role employee teammate', action: () => { openInviteModal(); } },
  { type: 'action', label: 'Switch to Light Theme', sub: 'Warm Gray layout colors', search: 'light mode white system theme', action: () => { setTheme('light'); } },
  { type: 'action', label: 'Switch to Dark Theme', sub: 'OLED Dark charcoal layout colors', search: 'dark mode oled charcoal theme', action: () => { setTheme('dark'); } }
];

function filterCmdResults(query) {
  const container = document.getElementById('cmd-results');
  if (!container) return;

  const q = query.toLowerCase().trim();
  container.innerHTML = '';

  // 1. Navigation & Actions Group
  const matchedActions = COMMAND_PALETTE_ITEMS.filter(item => {
    return !q || item.label.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q) || item.search.toLowerCase().includes(q);
  });

  // 2. Products Group
  const matchedProducts = (STATE.products || []).filter(p => {
    return q && (p.name.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q)) || (p.collection && p.collection.toLowerCase().includes(q)));
  });

  // 3. Articles Group
  const matchedArticles = (STATE.articles || []).filter(a => {
    return q && (a.title.toLowerCase().includes(q) || a.author.toLowerCase().includes(q) || a.category.toLowerCase().includes(q));
  });

  // 4. Teammates Group
  const matchedUsers = (STATE.users || []).filter(u => {
    return q && (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q));
  });

  // Helper to append a group
  const appendGroup = (title, items, renderFn) => {
    if (items.length === 0) return;
    const groupDiv = document.createElement('div');
    groupDiv.className = 'cmd-group';
    groupDiv.innerHTML = `<div class="cmd-group-label">${title}</div>`;
    items.forEach(item => {
      const itemEl = renderFn(item);
      groupDiv.appendChild(itemEl);
    });
    container.appendChild(groupDiv);
  };

  // Render Groups
  appendGroup('Actions & Navigation', matchedActions, (item) => {
    const div = document.createElement('div');
    div.className = 'cmd-item';
    div.innerHTML = `
      <div class="cmd-item-icon">${item.type === 'nav' ? '🧭' : '✨'}</div>
      <div style="flex:1;">
        <div class="cmd-item-label">${item.label}</div>
        <div class="cmd-item-sub">${item.sub}</div>
      </div>
    `;
    div.onclick = () => {
      item.action();
      closeCmdPalette();
    };
    return div;
  });

  appendGroup('Products Catalog', matchedProducts, (p) => {
    const div = document.createElement('div');
    div.className = 'cmd-item';
    div.innerHTML = `
      <div class="cmd-item-icon">👕</div>
      <div style="flex:1;">
        <div class="cmd-item-label">${p.name}</div>
        <div class="cmd-item-sub">Price: ${p.price} · Stock: ${p.stock} units · SKU: ${p.sku}</div>
      </div>
    `;
    div.onclick = () => {
      navigate('products');
      closeCmdPalette();
      // Simulate editing product
      editProduct(p.id);
    };
    return div;
  });

  appendGroup('Faith Journal Articles', matchedArticles, (a) => {
    const div = document.createElement('div');
    div.className = 'cmd-item';
    div.innerHTML = `
      <div class="cmd-item-icon">✍️</div>
      <div style="flex:1;">
        <div class="cmd-item-label">${a.title}</div>
        <div class="cmd-item-sub">Author: ${a.author} · Status: ${a.status.toUpperCase()}</div>
      </div>
    `;
    div.onclick = () => {
      navigate('articles');
      closeCmdPalette();
      // Simulate editing article
      editArticle(a.id);
    };
    return div;
  });

  appendGroup('Team Members', matchedUsers, (u) => {
    const div = document.createElement('div');
    div.className = 'cmd-item';
    div.innerHTML = `
      <div class="cmd-item-icon">👤</div>
      <div style="flex:1;">
        <div class="cmd-item-label">${u.name}</div>
        <div class="cmd-item-sub">${u.email} · ${u.role.toUpperCase()}</div>
      </div>
    `;
    div.onclick = () => {
      navigate('users');
      closeCmdPalette();
    };
    return div;
  });

  const firstItem = container.querySelector('.cmd-item');
  if (firstItem) firstItem.classList.add('active');
}

function handleCmdKey(e) {
  const items = Array.from(document.querySelectorAll('.cmd-item'));
  const active = document.querySelector('.cmd-item.active');
  let idx = items.indexOf(active);

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    active?.classList.remove('active');
    const nextIdx = idx === -1 ? 0 : (idx + 1) % items.length;
    items[nextIdx]?.classList.add('active');
    items[nextIdx]?.scrollIntoView({ block: 'nearest' });
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    active?.classList.remove('active');
    const prevIdx = idx === -1 ? items.length - 1 : (idx - 1 + items.length) % items.length;
    items[prevIdx]?.classList.add('active');
    items[prevIdx]?.scrollIntoView({ block: 'nearest' });
  } else if (e.key === 'Enter') {
    active?.click();
  }
}

function cmdNavigate(section) {
  document.getElementById('cmd-overlay').classList.remove('open');
  navigate(section);
}

// ============================================================
// NOTIFICATIONS
// ============================================================
function openNotifications() {
  toggleNotifications();
}

function toggleNotifications() {
  const panel = document.getElementById('notif-panel');
  panel.classList.toggle('open');
  // Close on outside click
  if (panel.classList.contains('open')) {
    setTimeout(() => {
      document.addEventListener('click', closeNotifOnOutside, { once: true });
    }, 100);
  }
}

function closeNotifOnOutside(e) {
  const panel = document.getElementById('notif-panel');
  const btn = e.target.closest('.header-btn');
  if (!panel.contains(e.target) && !btn) {
    panel.classList.remove('open');
  }
}

// ============================================================
// TABS
// ============================================================
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    tabGroup.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', function() {
        tabGroup.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
      });
    });
  });
}

function initTabsUnderline() {
  document.querySelectorAll('.tabs-underline').forEach(tabGroup => {
    tabGroup.querySelectorAll('.tab-underline').forEach(tab => {
      tab.addEventListener('click', function() {
        tabGroup.querySelectorAll('.tab-underline').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
      });
    });
  });
}

function switchTab(el, id) {
  // Mark active
  el.parentElement.querySelectorAll('.tab-underline').forEach(t => t.classList.remove('active'));
  el.classList.add('active');

  // Show correct tab content
  const prefix = id.includes('prayer') || id.includes('testimonials') || id.includes('moderation') || id.includes('partnerships') ? 'tab-' : 'tab-';
  const allTabs = document.querySelectorAll(`[id^="tab-"]`);
  allTabs.forEach(t => t.style.display = 'none');
  const target = document.getElementById(`tab-${id}`);
  if (target) target.style.display = 'block';
}

// ============================================================
// SETTINGS TABS
// ============================================================
function switchSettingsTab(el, id) {
  // Nav items
  el.closest('.admin-content').querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');

  // Content
  document.querySelectorAll('.settings-content').forEach(c => c.style.display = 'none');
  const target = document.getElementById(`settings-${id}`);
  if (target) target.style.display = 'block';
}

// ============================================================
// TABLE UTILITIES
// ============================================================
function filterTable(input, tableId) {
  const q = input.value.toLowerCase();
  const table = document.getElementById(tableId);
  if (!table) return;
  table.querySelectorAll('tbody tr').forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(q) ? '' : 'none';
  });
}

function selectAll(checkbox, tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;
  table.querySelectorAll('tbody .table-checkbox').forEach(cb => {
    cb.checked = checkbox.checked;
  });
}

function filterOrders(type) {
  showToast('info', 'Filter Applied', `Showing ${type === 'all' ? 'all' : type} orders`);
}

// ============================================================
// MEDIA LIBRARY
// ============================================================
function toggleMediaSelect(item) {
  item.classList.toggle('selected');
  const count = document.querySelectorAll('.media-item.selected').length;
  if (count > 0) {
    showToast('info', `${count} file${count > 1 ? 's' : ''} selected`, 'Click again to deselect');
  }
}

function handleDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('dragover');
  const files = Array.from(e.dataTransfer.files);
  if (files.length) showToast('success', 'Files Uploaded', `${files.length} file${files.length > 1 ? 's' : ''} added to media library`);
}

// ============================================================
// AI ASSISTANT
// ============================================================
const aiResponses = {
  desc: `This premium heavyweight tee is crafted for those who walk in faith daily. Made from 100% organic ring-spun cotton (220 GSM), it bears the words of Romans 13:12 in our signature typeface—a reminder to put on the armor of light. Oversized fit, pre-washed for softness, available in White and Black.`,
  seo: `**SEO Suggestions:**\n• Title: "Armor of Light Tee | Faith Streetwear | Ruven Studio"\n• Description: "Premium Christian streetwear inspired by Romans 13:12. Shop the Armor of Light collection at Ruven Studio."\n• Keywords: faith streetwear, Christian tshirt India, Romans 13, armor of light`,
  verse: `**Suggested Verses:**\n• Romans 13:12 — "Put on the armor of light"\n• Ephesians 6:11 — "Put on the full armor of God"\n• Isaiah 40:31 — "They that wait on the Lord shall renew their strength"\n• Philippians 4:13 — "I can do all things through Christ"`,
  alt: `**Alt Text Generated:**\n"White oversized cotton t-shirt with Romans 13:12 typographic print in black ink. Faith streetwear by Ruven Studio. Model wearing size M."`,
  rewrite: `This devotional explores Romans 13:12 through the lens of modern life—examining how Christians are called to actively "put on the armor of light" not just spiritually, but in their daily choices, dress, and declaration of identity in Christ.`,
};

function runAI(type) {
  const output = document.getElementById('ai-output') || document.getElementById('ai-output-article');
  if (!output) return;

  output.classList.add('visible');
  output.classList.add('ai-output-typing');
  output.textContent = '';

  const text = aiResponses[type] || 'Generating suggestions…';
  let i = 0;
  const interval = setInterval(() => {
    output.textContent = text.slice(0, i);
    i += 3;
    if (i > text.length) {
      clearInterval(interval);
      output.textContent = text;
      output.classList.remove('ai-output-typing');
    }
  }, 20);
}

// ============================================================
// FORM HELPERS
// ============================================================
function selectRadio(el) {
  el.closest('.radio-group').querySelectorAll('.radio-option').forEach(r => r.classList.remove('selected'));
  el.classList.add('selected');
}

function selectViewport(el) {
  el.closest('.viewport-btns').querySelectorAll('.viewport-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

// ============================================================
// REAL-TIME CLOCK IN HEADER
// ============================================================
function startRealTimeClock() {
  function tick() {
    const now = new Date();
    const clockStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    const shortClockStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    document.title = `Ruven OS · ${shortClockStr}`;
    const clockEl = document.getElementById('header-clock');
    if (clockEl) clockEl.textContent = clockStr;
  }
  tick();
  setInterval(tick, 1000);
}

function simulateRoleChange(role) {
  STATE.user.role = role;
  const roleProfiles = {
    'super-admin': { name: 'Samuel Ruven', initials: 'SR', email: 'samuel@ruvenstudio.in' },
    'admin': { name: 'Super Admin', initials: 'SA', email: 'admin@ruvenstudio.com' },
    'store-manager': { name: 'James Kumar', initials: 'JK', email: 'james@ruvenstudio.com' },
    'content-manager': { name: 'Sarah Philip', initials: 'SP', email: 'sarah@ruvenstudio.com' },
    'product-manager': { name: 'David Lee', initials: 'DL', email: 'david@ruvenstudio.com' },
    'marketing-manager': { name: 'Jessica Vance', initials: 'JV', email: 'jessica@ruvenstudio.com' },
    'support': { name: 'Mark Thomas', initials: 'MT', email: 'mark@ruvenstudio.com' }
  };
  
  const profile = roleProfiles[role] || roleProfiles['super-admin'];
  STATE.user.name = profile.name;
  STATE.user.email = profile.email;
  STATE.user.initials = profile.initials;
  
  const nameEl   = document.getElementById('sidebar-name');
  const emailEl  = document.getElementById('sidebar-email');
  const avatarEl = document.getElementById('sidebar-avatar');
  if (nameEl)   nameEl.textContent   = STATE.user.name;
  if (emailEl)  emailEl.textContent  = STATE.user.email;
  if (avatarEl) avatarEl.textContent = STATE.user.initials;
  
  sessionStorage.setItem('rs_admin_user', JSON.stringify(STATE.user));
  showToast('info', 'Role Switched', `Logged in as ${role.toUpperCase().replace('-', ' ')} (${profile.name})`);
  
  renderRoleDashboard();
}

function renderRoleDashboard() {
  // Will be implemented in Task 13
  console.log("Rendering dashboard for role:", STATE.user.role);
}

// ============================================================
// ANIMATIONS ON SCROLL
// ============================================================
function initAnimations() {
  // Animate stat cards on dashboard entry
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.stat-card, .card, .quick-action').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)';
    observer.observe(el);
  });
}

// ============================================================
// VIEWPORT BUTTONS (Homepage Builder)
// ============================================================
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.viewport-btn');
  if (btn) selectViewport(btn);
});

// ============================================================
// BUILDER SECTION ITEMS
// ============================================================
document.addEventListener('click', (e) => {
  const item = e.target.closest('.builder-section-item');
  if (item && !e.target.closest('.section-toggle')) {
    item.closest('.builder-section-list').querySelectorAll('.builder-section-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  }
});

// ============================================================
// SIDEBAR NAV ACTIVE STATE TOOLTIPS
// ============================================================
document.querySelectorAll('.nav-item').forEach(item => {
  const label = item.querySelector('.nav-label');
  if (label) {
    item.setAttribute('title', label.textContent.trim());
  }
});

// ============================================================
// GLOBAL KEYBOARD SHORTCUTS
// ============================================================
document.addEventListener('keydown', (e) => {
  if (!STATE.isAuthenticated) return;

  // Don't trigger shortcuts in inputs
  const tag = document.activeElement?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

  switch (e.key) {
    case 'd': navigate('dashboard'); break;
    case 'p': if (!e.metaKey && !e.ctrlKey) navigate('products'); break;
    case 'o': navigate('orders'); break;
    case 'a': navigate('analytics'); break;
    case '?':
      showToast('info', 'Keyboard Shortcuts',
        'd=Dashboard · p=Products · o=Orders · a=Analytics · ⌘K=Search · ?=Help');
      break;
  }
});

// ============================================================
// SMOOTH LOAD
// ============================================================
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});

// Start with body hidden for smooth fade-in
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.3s ease';
setTimeout(() => { document.body.style.opacity = '1'; }, 50);

// ============================================================
// DEMO: Auto-populate dashboard greeting based on time
// ============================================================
(function updateGreeting() {
  const hour = new Date().getHours();
  const greetings = {
    morning:   'Good morning, Admin 👋',
    afternoon: 'Good afternoon, Admin ☀️',
    evening:   'Good evening, Admin 🌙',
  };
  const key = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  const title = document.querySelector('#panel-dashboard .page-title');
  if (title) title.textContent = greetings[key];
})();

// ============================================================
// TEAM MANAGEMENT & ACCESS CONTROL (RBAC)
// ============================================================
function renderTeamDirectory() {
  const tbody = document.getElementById('team-table-body');
  const countEl = document.getElementById('team-count');
  if (!tbody) return;

  tbody.innerHTML = '';
  if (countEl) countEl.textContent = `${STATE.users.length} member${STATE.users.length > 1 ? 's' : ''}`;

  STATE.users.forEach(u => {
    const isSelf = u.email === STATE.user.email;
    const roleLabel = u.role.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    // Status badge
    let statusClass = 'badge-success';
    if (u.status === 'suspended') statusClass = 'badge-error';
    if (u.status === 'inactive') statusClass = 'badge-muted';
    
    // Role badge
    let roleClass = 'badge-gold';
    if (u.role === 'super-admin') roleClass = 'badge-burgundy';
    else if (u.role === 'content-manager') roleClass = 'badge-info';
    else if (u.role === 'support') roleClass = 'badge-muted';
    
    let actionButtons = '';
    if (isSelf) {
      actionButtons = `<span style="font-size:0.75rem;color:var(--text-disabled);font-weight:600;">You</span>`;
    } else {
      const toggleLabel = u.status === 'active' ? 'Suspend' : 'Activate';
      const toggleAction = u.status === 'active' ? 'suspended' : 'active';
      actionButtons = `
        <div style="display:flex;gap:6px;justify-content:flex-end;">
          <button class="btn btn-secondary btn-sm" onclick="toggleUserStatus(${u.id}, '${toggleAction}')">${toggleLabel}</button>
          <button class="btn btn-danger btn-sm" onclick="deleteUser(${u.id})">Delete</button>
        </div>
      `;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:32px;height:32px;border-radius:50%;background:${u.bg};display:flex;align-items:center;justify-content:center;font-size:0.72rem;font-weight:700;color:#fff;">${u.initials}</div>
          <span class="td-primary">${u.name}</span>
        </div>
      </td>
      <td style="color:var(--text-muted);font-size:0.82rem;">${u.email}</td>
      <td><span class="badge ${roleClass}">${roleLabel}</span></td>
      <td style="color:var(--text-muted);font-size:0.78rem;">${u.active}</td>
      <td><span class="badge ${statusClass}"><span class="badge-dot"></span>${u.status.toUpperCase()}</span></td>
      <td style="text-align:right;">${actionButtons}</td>
    `;
    tbody.appendChild(tr);
  });
}

function filterTeamTable(input) {
  const q = input.value.toLowerCase().trim();
  const rows = document.querySelectorAll('#team-table-body tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(q) ? '' : 'none';
  });
}

function submitInvite() {
  const email = document.getElementById('invite-email').value.trim();
  const role = document.getElementById('invite-role').value;
  const msg = document.getElementById('invite-msg').value.trim();

  if (!email) {
    showToast('error', 'Validation Error', 'Please enter an email address');
    return;
  }

  const name = email.split('@')[0];
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
  const initials = formattedName.slice(0, 2).toUpperCase();
  const id = STATE.users.length ? Math.max(...STATE.users.map(u => u.id)) + 1 : 1;
  
  const colors = [
    'linear-gradient(135deg,#3b82f6,#60a5fa)',
    'linear-gradient(135deg,#10b981,#34d399)',
    'linear-gradient(135deg,#f59e0b,#fbbf24)',
    'linear-gradient(135deg,#8b5cf6,#a78bfa)',
    'linear-gradient(135deg,#ec4899,#f472b6)'
  ];
  const randomColor = colors[id % colors.length];

  const newUser = {
    id,
    name: formattedName,
    email,
    role,
    active: 'Pending invite',
    status: 'inactive',
    bg: randomColor,
    initials
  };

  STATE.users.push(newUser);
  closeModal('modal-invite');
  
  logActivity('User invited', email, () => {
    STATE.users = STATE.users.filter(u => u.id !== id);
    renderTeamDirectory();
  });

  showToast('success', 'Invite Sent', `${email} has been invited as ${role.toUpperCase().replace('-', ' ')}`);
  renderTeamDirectory();

  // Reset inputs
  document.getElementById('invite-email').value = '';
  document.getElementById('invite-msg').value = '';
}

function toggleUserStatus(id, newStatus) {
  const user = STATE.users.find(u => u.id === id);
  if (!user) return;
  const oldStatus = user.status;
  user.status = newStatus;
  
  logActivity(newStatus === 'suspended' ? 'User suspended' : 'User activated', user.email, () => {
    user.status = oldStatus;
    renderTeamDirectory();
  });

  showToast('info', 'Status Changed', `${user.name} is now ${newStatus}`);
  renderTeamDirectory();
}

function deleteUser(id) {
  const idx = STATE.users.findIndex(u => u.id === id);
  if (idx === -1) return;
  const user = STATE.users[idx];
  STATE.users.splice(idx, 1);

  logActivity('User deleted', user.email, () => {
    STATE.users.splice(idx, 0, user);
    renderTeamDirectory();
  });

  showToast('warning', 'User Deleted', `${user.name} has been removed`);
  renderTeamDirectory();
}

function loadRolePermissions(role) {
  const grid = document.getElementById('rbac-permissions-grid');
  if (!grid) return;

  grid.innerHTML = '';
  const currentPerms = STATE.permissions[role] || [];

  PERMISSION_DEFINITIONS.forEach(def => {
    const isGranted = currentPerms.includes(def.key);
    const div = document.createElement('div');
    div.style.background = 'var(--bg-elevated)';
    div.style.border = '1px solid var(--border-subtle)';
    div.style.padding = 'var(--space-4)';
    div.style.borderRadius = 'var(--radius-md)';
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.gap = '8px';

    div.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:0.875rem;font-weight:600;color:var(--text-primary);">${def.label}</span>
        <label class="switch" style="position:relative;display:inline-block;width:36px;height:20px;">
          <input type="checkbox" id="perm-${def.key}" ${isGranted ? 'checked' : ''} style="opacity:0;width:0;height:0;">
          <span class="slider" style="position:absolute;cursor:pointer;inset:0;background-color:var(--text-disabled);transition:0.3s;border-radius:20px;"></span>
        </label>
      </div>
      <p style="font-size:0.75rem;color:var(--text-muted);line-height:1.3;">${def.desc}</p>
    `;

    const checkbox = div.querySelector('input');
    const slider = div.querySelector('.slider');
    const updateSliderStyle = () => {
      if (checkbox.checked) {
        slider.style.backgroundColor = 'var(--brand-burgundy)';
        slider.style.boxShadow = '0 0 8px var(--brand-burgundy-glow)';
      } else {
        slider.style.backgroundColor = 'var(--text-disabled)';
        slider.style.boxShadow = 'none';
      }
    };
    checkbox.addEventListener('change', updateSliderStyle);
    updateSliderStyle();

    grid.appendChild(div);
  });
}

function saveRolePermissions() {
  const role = document.getElementById('rbac-role-select').value;
  const newPerms = [];

  PERMISSION_DEFINITIONS.forEach(def => {
    const el = document.getElementById(`perm-${def.key}`);
    if (el && el.checked) {
      newPerms.push(def.key);
    }
  });

  const oldPerms = [...(STATE.permissions[role] || [])];
  STATE.permissions[role] = newPerms;

  logActivity('Role permissions updated', role, () => {
    STATE.permissions[role] = oldPerms;
    if (STATE.currentSection === 'users') loadRolePermissions(role);
  });

  const indicator = document.getElementById('rbac-save-indicator');
  if (indicator) {
    indicator.style.opacity = '1';
    setTimeout(() => { indicator.style.opacity = '0'; }, 2000);
  }

  showToast('success', 'Permissions Applied', `Access control updated for ${role.toUpperCase()}`);
}

// ============================================================
// ACTIVITY LOG & UNDO LOGIC
// ============================================================
function logActivity(action, resource, undoCallback = null) {
  const id = logIdCounter++;
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const entry = {
    id,
    time: `Today at ${timeStr}`,
    user: STATE.user.name,
    action,
    resource,
    hasUndo: !!undoCallback
  };
  STATE.activityLog.unshift(entry);
  if (undoCallback) {
    UNDO_ACTIONS[id] = undoCallback;
  }
  if (STATE.currentSection === 'audit') {
    renderAuditLogs();
  }
}

function undoActivity(id) {
  const callback = UNDO_ACTIONS[id];
  if (callback) {
    try {
      callback();
      delete UNDO_ACTIONS[id];
      const logEntry = STATE.activityLog.find(l => l.id === id);
      if (logEntry) logEntry.hasUndo = false;
      showToast('success', 'Action Undone', 'Reverted successfully');
      if (STATE.currentSection === 'audit') {
        renderAuditLogs();
      }
    } catch (err) {
      showToast('error', 'Undo Failed', err.message);
    }
  } else {
    showToast('error', 'Cannot Undo', 'This action cannot be undone');
  }
}

function renderAuditLogs() {
  const tbody = document.getElementById('audit-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';
  if (STATE.activityLog.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:var(--space-8);">No activities logged yet</td></tr>`;
    return;
  }

  STATE.activityLog.forEach(log => {
    let actionBadge = 'badge-muted';
    if (log.action.includes('created') || log.action.includes('published') || log.action.includes('added')) {
      actionBadge = 'badge-success';
    } else if (log.action.includes('edited') || log.action.includes('updated') || log.action.includes('changed') || log.action.includes('permissions')) {
      actionBadge = 'badge-info';
    } else if (log.action.includes('deleted') || log.action.includes('removed') || log.action.includes('suspended')) {
      actionBadge = 'badge-error';
    }

    const undoBtn = log.hasUndo
      ? `<button class="btn btn-secondary btn-sm" onclick="undoActivity(${log.id})" style="border-color:rgba(192,154,107,0.3);color:var(--brand-gold);">Undo</button>`
      : `<span style="font-size:0.75rem;color:var(--text-disabled);">Non-revertible</span>`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-family:var(--font-mono);font-size:0.75rem;color:var(--text-secondary);">${log.time}</td>
      <td class="td-primary" style="font-weight:600;">${log.user}</td>
      <td><span class="badge ${actionBadge}">${log.action.toUpperCase()}</span></td>
      <td style="color:var(--text-muted);font-size:0.8rem;">${log.resource}</td>
      <td style="text-align:right;">${undoBtn}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ============================================================
// ARTICLE PUBLISHING & APPROVAL WORKFLOW
// ============================================================
function renderArticles() {
  const tbody = document.getElementById('articles-table-body');
  if (!tbody) return;
  
  // Update review counts in tabs
  const reviewCount = STATE.articles.filter(a => a.status === 'review').length;
  const badge = document.getElementById('article-review-count');
  if (badge) {
    badge.textContent = reviewCount;
    badge.style.display = reviewCount > 0 ? 'inline-block' : 'none';
  }
  
  // Render moderation queue if user has admin permissions
  renderModerationQueue();

  tbody.innerHTML = '';
  const filtered = STATE.articles.filter(a => {
    if (STATE.currentArticleTab === 'all') return true;
    return a.status === STATE.currentArticleTab;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:var(--space-8);">No articles found in this category</td></tr>`;
    return;
  }

  filtered.forEach(a => {
    let statusClass = 'badge-success';
    if (a.status === 'draft') statusClass = 'badge-muted';
    else if (a.status === 'review') statusClass = 'badge-warning';
    else if (a.status === 'approved') statusClass = 'badge-info';

    // Show actions based on permissions
    let actions = `<button class="btn btn-secondary btn-sm" onclick="editArticle(${a.id})">Edit</button>`;
    if (a.status === 'approved') {
      actions += `<button class="btn btn-primary btn-sm" onclick="publishApprovedArticle(${a.id})" style="margin-left:6px;">Publish</button>`;
    } else if (a.status === 'review' && (STATE.user.role === 'super-admin' || STATE.user.role === 'admin')) {
      actions += `
        <button class="btn btn-gold btn-sm" onclick="approveArticle(${a.id})" style="margin-left:6px;">Approve</button>
        <button class="btn btn-danger btn-sm" onclick="rejectArticle(${a.id})" style="margin-left:6px;">Reject</button>
      `;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><div><div class="td-primary" style="font-weight:600;">${a.title}</div><div style="font-size:0.72rem;color:var(--text-muted);">${a.subtitle}</div></div></td>
      <td class="td-primary" style="font-size:0.82rem;">${a.author}</td>
      <td><span class="badge badge-burgundy">${a.category}</span></td>
      <td>${a.views || '—'}</td>
      <td><span class="badge ${statusClass}"><span class="badge-dot"></span>${a.status.toUpperCase()}</span></td>
      <td style="color:var(--text-muted);font-size:0.78rem;">${a.date}</td>
      <td style="text-align:right;">
        <div style="display:flex;gap:6px;justify-content:flex-end;">
          ${actions}
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderModerationQueue() {
  const queueContainer = document.getElementById('articles-moderation-queue');
  const queueList = document.getElementById('moderation-queue-list');
  if (!queueContainer || !queueList) return;

  const reviewArticles = STATE.articles.filter(a => a.status === 'review');
  const isAdmin = STATE.user.role === 'super-admin' || STATE.user.role === 'admin';

  if (reviewArticles.length > 0 && isAdmin) {
    queueContainer.style.display = 'block';
    queueList.innerHTML = '';
    reviewArticles.forEach(a => {
      const div = document.createElement('div');
      div.style.display = 'flex';
      div.style.justifyContent = 'space-between';
      div.style.alignItems = 'center';
      div.style.background = 'var(--bg-elevated)';
      div.style.border = '1px solid var(--border-subtle)';
      div.style.padding = 'var(--space-3) var(--space-4)';
      div.style.borderRadius = 'var(--radius-md)';
      div.style.marginBottom = '8px';

      div.innerHTML = `
        <div>
          <div style="font-size:0.85rem;font-weight:700;color:var(--text-primary);">${a.title}</div>
          <div style="font-size:0.72rem;color:var(--text-muted);margin-top:2px;">Submitted by <strong>${a.author}</strong> in Category <em>${a.category}</em></div>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-secondary btn-sm" onclick="editArticle(${a.id})">Review Text</button>
          <button class="btn btn-gold btn-sm" onclick="approveArticle(${a.id})">Approve &amp; Publish</button>
          <button class="btn btn-danger btn-sm" onclick="rejectArticle(${a.id})">Reject to Draft</button>
        </div>
      `;
      queueList.appendChild(div);
    });
  } else {
    queueContainer.style.display = 'none';
  }
}

function switchArticleTab(tab) {
  STATE.currentArticleTab = tab;
  
  const tabIds = ['all', 'draft', 'review', 'approved', 'published'];
  tabIds.forEach(id => {
    const el = document.getElementById(`art-tab-${id}`);
    if (el) {
      if (id === tab) el.classList.add('active');
      else el.classList.remove('active');
    }
  });

  renderArticles();
}

function filterArticlesTable(input) {
  const q = input.value.toLowerCase().trim();
  const rows = document.querySelectorAll('#articles-table-body tr');
  rows.forEach(row => {
    const title = row.querySelector('.td-primary')?.textContent.toLowerCase() || '';
    row.style.display = title.includes(q) ? '' : 'none';
  });
}

function approveArticle(id) {
  const a = STATE.articles.find(art => art.id === id);
  if (!a) return;
  a.status = 'published';
  a.date = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' });

  logActivity('Article published', a.title, () => {
    a.status = 'review';
    a.date = '—';
    renderArticles();
  });

  showToast('success', 'Article Approved', `"${a.title}" is now published.`);
  renderArticles();
}

function rejectArticle(id) {
  const a = STATE.articles.find(art => art.id === id);
  if (!a) return;
  a.status = 'draft';

  logActivity('Article rejected', a.title, () => {
    a.status = 'review';
    renderArticles();
  });

  showToast('warning', 'Article Rejected', `"${a.title}" sent back to draft queue.`);
  renderArticles();
}

function publishApprovedArticle(id) {
  const a = STATE.articles.find(art => art.id === id);
  if (!a) return;
  a.status = 'published';
  a.date = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' });

  logActivity('Article published', a.title, () => {
    a.status = 'approved';
    a.date = '—';
    renderArticles();
  });

  showToast('success', 'Article Live', `"${a.title}" has been published to website`);
  renderArticles();
}

// ============================================================
// STATE EXTENSIONS
// ============================================================
STATE.homepageSections = [
  { id: 'announcement', name: '📢 Announcement Bar', active: true, desc: 'Banner at the top of the page', type: 'banner' },
  { id: 'hero', name: '🦸 Hero Slideshow', active: true, desc: 'Large slideshow with typography', type: 'hero' },
  { id: 'trust', name: '🛡️ Trust Strip', active: true, desc: 'Security, shipping and returns guarantees', type: 'trust' },
  { id: 'statement', name: '📖 Brand Statement', active: true, desc: 'Scripture-inspired mission quote', type: 'statement' },
  { id: 'products', name: '🛍️ Featured Products', active: true, desc: 'Grid of featured faith tees', type: 'products' },
  { id: 'community', name: '🙏 Community Prayer', active: false, desc: 'Interactive community prayer requests', type: 'community' },
  { id: 'journal', name: '📰 Faith Journal Blog', active: true, desc: 'Latest devotional entries list', type: 'journal' },
  { id: 'newsletter', name: '✉️ Newsletter Signup', active: true, desc: 'Input field for email subscriptions', type: 'newsletter' }
];
STATE.currentHomepageViewport = 'desktop';
STATE.mediaFolders = ['Campaign Images', 'Product Mockups', 'Journal Graphics'];
STATE.mediaFiles = [
  { id: 1, name: 'hero2.png', size: '1.2 MB', dim: '1920×1080', folder: null, alt: 'Banner image for homepage slideshow', thumb: '🖼️' },
  { id: 2, name: 'hero3.png', size: '1.4 MB', dim: '1920×1080', folder: 'Campaign Images', alt: 'Campaign main banner image', thumb: '🖼️' },
  { id: 3, name: 'logo.png', size: '24 KB', dim: '400×200', folder: null, alt: 'Ruven Studio logo black typographic style', thumb: '🏷️' },
  { id: 4, name: 'product-01.jpg', size: '850 KB', dim: '800×1000', folder: 'Product Mockups', alt: 'Armor of Light Tee White front view mock', thumb: '🖼️' },
  { id: 5, name: 'product-02.jpg', size: '920 KB', dim: '800×1000', folder: 'Product Mockups', alt: 'Child of God Tee Black front view mock', thumb: '🖼️' },
  { id: 6, name: 'lookbook.mp4', size: '28 MB', dim: '1080p', folder: null, alt: 'Ruven Studio lookbook short promo video', thumb: '🎬' },
  { id: 7, name: 'brand-kit.pdf', size: '4.2 MB', dim: '—', folder: null, alt: 'Ruven Studio brand kit assets guideline PDF', thumb: '📄' }
];
STATE.currentMediaFolder = null;
STATE.selectedMediaFileId = null;
STATE.redirects = [
  { id: 1, from: '/old-collection', to: '/collections/faith-essentials' },
  { id: 2, from: '/romans-13-tee', to: '/products/armor-of-light-tee' }
];
STATE.notifications = [
  { id: 1, type: 'order', text: '<strong>New Order</strong> — #RS-1042 from Priya Sharma · ₹2,890', time: '2 mins ago', unread: true, icon: '🛍️', bg: 'var(--color-info-bg)' },
  { id: 2, type: 'stock', text: '<strong>Low Stock Alert</strong> — Armor of Light Tee (White/M) has 3 units left', time: '14 mins ago', unread: true, icon: '⚠️', bg: 'var(--color-error-bg)' },
  { id: 3, type: 'prayer', text: '<strong>New Prayer Request</strong> — Awaiting review from Priya S.', time: '1 hour ago', unread: true, icon: '🙏', bg: 'var(--brand-burgundy-glow)' },
  { id: 4, type: 'publish', text: '<strong>Article Published</strong> — "Romans 13: Armor of Light" is now live', time: '3 hours ago', unread: false, icon: '✅', bg: 'var(--color-success-bg)' },
  { id: 5, type: 'review', text: '<strong>New Review</strong> — Rahul M. left a 5-star review', time: '5 hours ago', unread: false, icon: '⭐', bg: 'var(--brand-gold-dim)' }
];

// ============================================================
// PRODUCT CATALOG LOGIC (Task 7)
// ============================================================
window.renderProducts = function() {
  const tbody = document.getElementById('products-table-body');
  if (!tbody) return;

  // Calculate stats first
  const totalCount = STATE.products.length;
  const publishedCount = STATE.products.filter(p => p.status === 'published').length;
  const draftCount = STATE.products.filter(p => p.status === 'draft').length;
  const lowCount = STATE.products.filter(p => p.stock <= 5).length;

  const totalEl = document.getElementById('prod-stat-total');
  const publishedEl = document.getElementById('prod-stat-published');
  const draftEl = document.getElementById('prod-stat-draft');
  const lowEl = document.getElementById('prod-stat-low');

  if (totalEl) totalEl.textContent = totalCount;
  if (publishedEl) publishedEl.textContent = publishedCount;
  if (draftEl) draftEl.textContent = draftCount;
  if (lowEl) lowEl.textContent = lowCount;

  // Filter products by tab
  let filtered = STATE.products;
  if (STATE.currentProductTab === 'published') {
    filtered = STATE.products.filter(p => p.status === 'published');
  } else if (STATE.currentProductTab === 'draft') {
    filtered = STATE.products.filter(p => p.status === 'draft');
  } else if (STATE.currentProductTab === 'archived') {
    filtered = STATE.products.filter(p => p.status === 'archived');
  } else if (STATE.currentProductTab === 'low-stock') {
    filtered = STATE.products.filter(p => p.stock <= 5);
  }

  tbody.innerHTML = '';
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:var(--space-8);">No products found</td></tr>`;
    return;
  }

  filtered.forEach(p => {
    let statusClass = 'badge-success';
    if (p.status === 'draft') statusClass = 'badge-muted';
    else if (p.status === 'archived') statusClass = 'badge-error';

    let stockClass = '';
    if (p.stock === 0) stockClass = 'color:var(--color-error);font-weight:700;';
    else if (p.stock <= 5) stockClass = 'color:var(--color-warning);font-weight:600;';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="checkbox" class="table-checkbox prod-row-checkbox" data-id="${p.id}" onchange="updateProductBulkToolbar()"></td>
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:32px;height:32px;border-radius:var(--radius-sm);background:var(--bg-elevated);display:flex;align-items:center;justify-content:center;font-size:1.2rem;">${p.thumb || '👕'}</div>
          <div>
            <div class="td-primary" style="font-weight:600;">${p.name}</div>
            <div style="font-size:0.72rem;color:var(--text-muted);">${p.sku || '—'}</div>
          </div>
        </div>
      </td>
      <td style="color:var(--text-muted);font-size:0.82rem;">${p.collection || 'Faith Essentials'}</td>
      <td class="td-primary" style="font-weight:600;">₹${p.price.toLocaleString('en-IN')}</td>
      <td style="${stockClass}">${p.stock} units</td>
      <td><span class="badge ${statusClass}"><span class="badge-dot"></span>${p.status.toUpperCase()}</span></td>
      <td style="text-align:right;">
        <div style="display:flex;gap:6px;justify-content:flex-end;">
          <button class="btn btn-secondary btn-sm" onclick="editProduct(${p.id})">Edit</button>
          <button class="btn btn-secondary btn-sm" onclick="duplicateProduct(${p.id})">Duplicate</button>
          <button class="btn btn-danger btn-sm" onclick="deleteProductDirect(${p.id})">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  updateProductBulkToolbar();
};

window.switchProductTab = function(tab) {
  STATE.currentProductTab = tab;
  document.querySelectorAll('#panel-products .tab-underline').forEach(el => {
    el.classList.remove('active');
  });
  const activeTabEl = document.getElementById(`prod-tab-${tab === 'low-stock' ? 'low' : tab}`);
  if (activeTabEl) activeTabEl.classList.add('active');
  renderProducts();
};

window.toggleSelectAllProducts = function(selectAllEl) {
  const checkboxes = document.querySelectorAll('.prod-row-checkbox');
  checkboxes.forEach(cb => {
    cb.checked = selectAllEl.checked;
  });
  updateProductBulkToolbar();
};

window.updateProductBulkToolbar = function() {
  const checkboxes = document.querySelectorAll('.prod-row-checkbox');
  const checked = Array.from(checkboxes).filter(cb => cb.checked);
  const toolbar = document.getElementById('products-bulk-toolbar');
  const countEl = document.getElementById('bulk-select-count');
  
  if (checked.length > 0) {
    if (toolbar) toolbar.style.display = 'flex';
    if (countEl) countEl.textContent = `${checked.length} item${checked.length > 1 ? 's' : ''} selected`;
  } else {
    if (toolbar) toolbar.style.display = 'none';
    const selectAllCheckbox = document.getElementById('selectAllProducts');
    if (selectAllCheckbox) selectAllCheckbox.checked = false;
  }
};

window.filterProductsTable = function(input) {
  const q = input.value.toLowerCase().trim();
  const rows = document.querySelectorAll('#products-table-body tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(q) ? '' : 'none';
  });
};

window.editProduct = function(id) {
  document.getElementById('prod-edit-id').value = '';
  document.getElementById('prod-edit-name').value = '';
  document.getElementById('prod-edit-slug').value = '';
  document.getElementById('prod-edit-collection').value = 'Faith Essentials';
  document.getElementById('prod-edit-short-desc').value = '';
  document.getElementById('prod-edit-long-desc').value = '';
  document.getElementById('prod-edit-verse').value = '';
  document.getElementById('prod-edit-verse-text').value = '';
  document.getElementById('prod-edit-price').value = '';
  document.getElementById('prod-edit-compare-price').value = '';
  document.getElementById('prod-edit-cost-price').value = '';
  document.getElementById('prod-edit-sku').value = '';
  document.getElementById('prod-edit-barcode').value = '';
  document.getElementById('prod-edit-stock').value = '';
  document.getElementById('prod-edit-status').value = 'draft';
  document.getElementById('prod-edit-publish-date').value = '';
  document.getElementById('prod-edit-featured').checked = false;
  document.getElementById('prod-edit-meta-title').value = '';
  document.getElementById('prod-edit-meta-desc').value = '';
  document.getElementById('prod-edit-tags').value = '';

  const titleEl = document.querySelector('#modal-product .modal-title');
  const autosaveText = document.getElementById('prod-autosave-text');
  const autosaveDot = document.getElementById('prod-autosave-dot');
  if (autosaveText) autosaveText.textContent = 'Autosaved';
  if (autosaveDot) {
    autosaveDot.className = 'autosave-dot';
  }

  if (id) {
    const p = STATE.products.find(prod => prod.id === id);
    if (p) {
      if (titleEl) titleEl.textContent = 'Edit Product';
      document.getElementById('prod-edit-id').value = p.id;
      document.getElementById('prod-edit-name').value = p.name || '';
      document.getElementById('prod-edit-slug').value = p.slug || '';
      document.getElementById('prod-edit-collection').value = p.collection || 'Faith Essentials';
      document.getElementById('prod-edit-short-desc').value = p.desc || '';
      document.getElementById('prod-edit-long-desc').value = p.longDesc || '';
      document.getElementById('prod-edit-verse').value = p.verse || '';
      document.getElementById('prod-edit-verse-text').value = p.verseText || '';
      document.getElementById('prod-edit-price').value = p.price || '';
      document.getElementById('prod-edit-compare-price').value = p.comparePrice || '';
      document.getElementById('prod-edit-cost-price').value = p.costPrice || '';
      document.getElementById('prod-edit-sku').value = p.sku || '';
      document.getElementById('prod-edit-barcode').value = p.barcode || '';
      document.getElementById('prod-edit-stock').value = p.stock || 0;
      document.getElementById('prod-edit-status').value = p.status || 'draft';
      document.getElementById('prod-edit-publish-date').value = p.publishDate || '';
      document.getElementById('prod-edit-featured').checked = !!p.featured;
      document.getElementById('prod-edit-meta-title').value = p.metaTitle || '';
      document.getElementById('prod-edit-meta-desc').value = p.metaDesc || '';
      document.getElementById('prod-edit-tags').value = p.tags || '';
    }
  } else {
    if (titleEl) titleEl.textContent = 'New Product';
  }
  openModal('modal-product');
};

let productAutosaveTimeout = null;
window.triggerProductAutosave = function() {
  const dot = document.getElementById('prod-autosave-dot');
  const text = document.getElementById('prod-autosave-text');
  if (dot && text) {
    dot.className = 'autosave-dot saving';
    text.textContent = 'Autosaving…';
  }
  if (productAutosaveTimeout) clearTimeout(productAutosaveTimeout);
  productAutosaveTimeout = setTimeout(() => {
    if (dot && text) {
      dot.className = 'autosave-dot';
      text.textContent = 'Saved just now';
    }
  }, 1000);
};

window.saveProduct = function(statusOverride) {
  const idVal = document.getElementById('prod-edit-id').value;
  const name = document.getElementById('prod-edit-name').value.trim() || 'Untitled Product';
  const sku = document.getElementById('prod-edit-sku').value.trim() || 'RS-' + Math.floor(Math.random() * 10000);
  const price = parseFloat(document.getElementById('prod-edit-price').value) || 0;
  const stock = parseInt(document.getElementById('prod-edit-stock').value) || 0;
  const status = statusOverride || document.getElementById('prod-edit-status').value;
  const collection = document.getElementById('prod-edit-collection').value;

  const data = {
    name,
    sku,
    price,
    stock,
    status,
    collection,
    slug: document.getElementById('prod-edit-slug').value.trim(),
    desc: document.getElementById('prod-edit-short-desc').value.trim(),
    longDesc: document.getElementById('prod-edit-long-desc').value.trim(),
    verse: document.getElementById('prod-edit-verse').value.trim(),
    verseText: document.getElementById('prod-edit-verse-text').value.trim(),
    comparePrice: parseFloat(document.getElementById('prod-edit-compare-price').value) || 0,
    costPrice: parseFloat(document.getElementById('prod-edit-cost-price').value) || 0,
    barcode: document.getElementById('prod-edit-barcode').value.trim(),
    publishDate: document.getElementById('prod-edit-publish-date').value,
    featured: document.getElementById('prod-edit-featured').checked,
    metaTitle: document.getElementById('prod-edit-meta-title').value.trim(),
    metaDesc: document.getElementById('prod-edit-meta-desc').value.trim(),
    tags: document.getElementById('prod-edit-tags').value.trim(),
    thumb: '👕'
  };

  if (idVal) {
    const id = parseInt(idVal);
    const idx = STATE.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      const oldProd = { ...STATE.products[idx] };
      data.id = id;
      STATE.products[idx] = data;

      logActivity('Product updated', name, () => {
        STATE.products[idx] = oldProd;
        renderProducts();
      });
      showToast('success', 'Product Updated', `"${name}" has been updated.`);
    }
  } else {
    const id = STATE.products.length ? Math.max(...STATE.products.map(p => p.id)) + 1 : 1;
    data.id = id;
    STATE.products.push(data);

    logActivity('Product created', name, () => {
      STATE.products = STATE.products.filter(p => p.id !== id);
      renderProducts();
    });
    showToast('success', 'Product Published', `"${name}" has been added to the catalog.`);
  }

  closeModal('modal-product');
  renderProducts();
};

window.duplicateProduct = function(id) {
  const p = STATE.products.find(prod => prod.id === id);
  if (!p) return;
  const newId = STATE.products.length ? Math.max(...STATE.products.map(pr => pr.id)) + 1 : 1;
  const dupe = {
    ...p,
    id: newId,
    name: `${p.name} (Copy)`,
    sku: `${p.sku}-COPY`
  };
  STATE.products.push(dupe);

  logActivity('Product duplicated', dupe.name, () => {
    STATE.products = STATE.products.filter(pr => pr.id !== newId);
    renderProducts();
  });

  showToast('success', 'Product Duplicated', `Duplicated "${p.name}"`);
  renderProducts();
};

window.deleteProductDirect = function(id) {
  const idx = STATE.products.findIndex(p => p.id === id);
  if (idx === -1) return;
  const p = STATE.products[idx];
  STATE.products.splice(idx, 1);

  logActivity('Product deleted', p.name, () => {
    STATE.products.splice(idx, 0, p);
    renderProducts();
  });

  showToast('warning', 'Product Removed', `"${p.name}" has been deleted.`);
  renderProducts();
};

window.bulkUpdateProductStatus = function(status) {
  const checkboxes = document.querySelectorAll('.prod-row-checkbox:checked');
  const ids = Array.from(checkboxes).map(cb => parseInt(cb.getAttribute('data-id')));
  const originalStates = STATE.products.map(p => ({ id: p.id, status: p.status }));

  STATE.products.forEach(p => {
    if (ids.includes(p.id)) p.status = status;
  });

  logActivity(`Bulk status update`, `${ids.length} products to ${status}`, () => {
    STATE.products.forEach(p => {
      const orig = originalStates.find(o => o.id === p.id);
      if (orig) p.status = orig.status;
    });
    renderProducts();
  });

  showToast('success', 'Bulk Actions Applied', `Updated ${ids.length} products to ${status}`);
  renderProducts();
};

window.promptBulkPriceUpdate = function() {
  const pctStr = prompt("Enter percentage price adjustment (e.g. 10 for +10%, -10 for -10%):");
  if (pctStr === null) return;
  const pct = parseFloat(pctStr);
  if (isNaN(pct)) {
    showToast('error', 'Invalid Input', 'Please enter a valid number');
    return;
  }

  const checkboxes = document.querySelectorAll('.prod-row-checkbox:checked');
  const ids = Array.from(checkboxes).map(cb => parseInt(cb.getAttribute('data-id')));
  const originalPrices = STATE.products.map(p => ({ id: p.id, price: p.price }));

  STATE.products.forEach(p => {
    if (ids.includes(p.id)) {
      p.price = Math.round(p.price * (1 + pct / 100));
    }
  });

  logActivity(`Bulk price adjusted`, `${ids.length} items by ${pct}%`, () => {
    STATE.products.forEach(p => {
      const orig = originalPrices.find(o => o.id === p.id);
      if (orig) p.price = orig.price;
    });
    renderProducts();
  });

  showToast('success', 'Prices Adjusted', `Adjusted prices for ${ids.length} items by ${pct}%`);
  renderProducts();
};

window.promptBulkRestock = function() {
  const amtStr = prompt("Enter stock level to set for selected items:");
  if (amtStr === null) return;
  const amt = parseInt(amtStr);
  if (isNaN(amt)) {
    showToast('error', 'Invalid Input', 'Please enter a valid number');
    return;
  }

  const checkboxes = document.querySelectorAll('.prod-row-checkbox:checked');
  const ids = Array.from(checkboxes).map(cb => parseInt(cb.getAttribute('data-id')));
  const originalStock = STATE.products.map(p => ({ id: p.id, stock: p.stock }));

  STATE.products.forEach(p => {
    if (ids.includes(p.id)) {
      p.stock = amt;
    }
  });

  logActivity(`Bulk stock restocked`, `${ids.length} items set to ${amt}`, () => {
    STATE.products.forEach(p => {
      const orig = originalStock.find(o => o.id === p.id);
      if (orig) p.stock = orig.stock;
    });
    renderProducts();
  });

  showToast('success', 'Inventory Restocked', `Set stock of ${ids.length} items to ${amt}`);
  renderProducts();
};

window.bulkDeleteProducts = function() {
  if (!confirm("Are you sure you want to delete the selected products?")) return;

  const checkboxes = document.querySelectorAll('.prod-row-checkbox:checked');
  const ids = Array.from(checkboxes).map(cb => parseInt(cb.getAttribute('data-id')));
  const deletedProducts = STATE.products.filter(p => ids.includes(p.id));

  STATE.products = STATE.products.filter(p => !ids.includes(p.id));

  logActivity(`Bulk products deleted`, `${ids.length} products`, () => {
    STATE.products.push(...deletedProducts);
    renderProducts();
  });

  showToast('warning', 'Products Deleted', `Removed ${ids.length} products`);
  renderProducts();
};

// ============================================================
// ARTICLE BLOCK EDITOR LOGIC (Task 8)
// ============================================================
window.createBlockElement = function(type, content = '') {
  const div = document.createElement('div');
  div.className = 'block-item';
  div.style.position = 'relative';
  div.style.marginBottom = '12px';
  div.style.display = 'flex';
  div.style.gap = '8px';
  div.style.alignItems = 'flex-start';

  let inputHtml = '';
  if (type === 'heading') {
    inputHtml = `<textarea class="block-content block-heading" placeholder="Write a heading…" rows="1" style="flex:1;height:auto;overflow:hidden;font-size:1.4rem;font-weight:700;" oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px';triggerArticleAutosave()">${content}</textarea>`;
  } else if (type === 'verse') {
    inputHtml = `<div class="block-verse" contenteditable="true" style="flex:1;background:rgba(192,154,107,0.06);border-left:3px solid var(--brand-gold);padding:8px 12px;font-style:italic;font-family:var(--font-serif);border-radius:2px;" oninput="triggerArticleAutosave()">${content || '"Enter verse text here..." — Verse Reference'}</div>`;
  } else if (type === 'product') {
    const options = STATE.products.map(p => `<option value="${p.id}" ${content == p.id ? 'selected' : ''}>${p.thumb} ${p.name} (₹${p.price})</option>`).join('');
    inputHtml = `<div style="flex:1;background:var(--bg-elevated);border:1px solid var(--border-strong);padding:8px 12px;border-radius:var(--radius-md);display:flex;align-items:center;gap:12px;">
      <span style="font-size:0.75rem;font-weight:700;color:var(--brand-gold);">EMBEDDED PRODUCT:</span>
      <select class="select" style="flex:1;margin:0;" onchange="triggerArticleAutosave()">${options}</select>
    </div>`;
  } else {
    inputHtml = `<textarea class="block-content" rows="3" placeholder="Write your paragraph…" style="flex:1;height:auto;overflow:hidden;" oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px';triggerArticleAutosave()">${content}</textarea>`;
  }

  div.innerHTML = `
    <div style="cursor:grab;color:var(--text-disabled);padding-top:8px;">☰</div>
    ${inputHtml}
    <button class="btn btn-danger btn-sm" onclick="this.closest('.block-item').remove();triggerArticleAutosave()" style="padding:4px 8px;margin-top:6px;">&times;</button>
  `;

  setTimeout(() => {
    const txts = div.querySelectorAll('textarea');
    txts.forEach(t => {
      t.style.height = 'auto';
      t.style.height = t.scrollHeight + 'px';
    });
  }, 50);

  return div;
};

window.editArticle = function(id) {
  document.getElementById('art-edit-id').value = '';
  document.getElementById('art-edit-title').value = '';
  document.getElementById('art-edit-status').value = 'draft';
  document.getElementById('art-edit-category').value = 'Devotional';
  document.getElementById('art-edit-author').value = 'Super Admin';
  document.getElementById('art-edit-tags').value = '';
  const blockList = document.getElementById('art-edit-block-list');
  if (blockList) blockList.innerHTML = '';

  const titleEl = document.querySelector('#modal-article .modal-title');
  const autosaveText = document.getElementById('art-autosave-text');
  const autosaveDot = document.getElementById('art-autosave-dot');
  if (autosaveText) autosaveText.textContent = 'Autosaved';
  if (autosaveDot) {
    autosaveDot.className = 'autosave-dot';
  }

  if (id) {
    const a = STATE.articles.find(art => art.id === id);
    if (a) {
      if (titleEl) titleEl.textContent = 'Edit Article';
      document.getElementById('art-edit-id').value = a.id;
      document.getElementById('art-edit-title').value = a.title || '';
      document.getElementById('art-edit-status').value = a.status || 'draft';
      document.getElementById('art-edit-category').value = a.category || 'Devotional';
      document.getElementById('art-edit-author').value = a.author || 'Super Admin';
      document.getElementById('art-edit-tags').value = a.tags || '';

      if (a.blocks && a.blocks.length > 0) {
        a.blocks.forEach(b => {
          blockList.appendChild(createBlockElement(b.type, b.content));
        });
      } else {
        if (a.verse) {
          blockList.appendChild(createBlockElement('verse', `"${a.text || ''}" — ${a.verse}`));
        } else {
          blockList.appendChild(createBlockElement('paragraph', a.text || ''));
        }
      }
    }
  } else {
    if (titleEl) titleEl.textContent = 'New Article';
    blockList.appendChild(createBlockElement('paragraph', ''));
  }

  openModal('modal-article');
};

window.addArticleBlock = function(type, content = '') {
  const blockList = document.getElementById('art-edit-block-list');
  if (blockList) {
    blockList.appendChild(createBlockElement(type, content));
    triggerArticleAutosave();
  }
};

let articleAutosaveTimeout = null;
window.triggerArticleAutosave = function() {
  const dot = document.getElementById('art-autosave-dot');
  const text = document.getElementById('art-autosave-text');
  if (dot && text) {
    dot.className = 'autosave-dot saving';
    text.textContent = 'Autosaving…';
  }
  if (articleAutosaveTimeout) clearTimeout(articleAutosaveTimeout);
  articleAutosaveTimeout = setTimeout(() => {
    if (dot && text) {
      dot.className = 'autosave-dot';
      text.textContent = 'Saved just now';
    }
  }, 1000);
};

window.saveArticle = function(statusOverride) {
  const idVal = document.getElementById('art-edit-id').value;
  const title = document.getElementById('art-edit-title').value.trim() || 'Untitled Article';
  const status = statusOverride || document.getElementById('art-edit-status').value;
  const category = document.getElementById('art-edit-category').value;
  const author = document.getElementById('art-edit-author').value;
  const tags = document.getElementById('art-edit-tags').value.trim();

  const blockList = document.getElementById('art-edit-block-list');
  const blocks = [];
  let summaryText = '';
  let primaryVerse = '';

  if (blockList) {
    const items = blockList.querySelectorAll('.block-item');
    items.forEach(item => {
      const headingTextarea = item.querySelector('.block-heading');
      const paragraphTextarea = item.querySelector('textarea:not(.block-heading)');
      const verseDiv = item.querySelector('.block-verse');
      const productSelect = item.querySelector('select');

      if (headingTextarea) {
        blocks.push({ type: 'heading', content: headingTextarea.value });
      } else if (verseDiv) {
        blocks.push({ type: 'verse', content: verseDiv.innerText });
        if (!primaryVerse) primaryVerse = verseDiv.innerText;
      } else if (productSelect) {
        blocks.push({ type: 'product', content: productSelect.value });
      } else if (paragraphTextarea) {
        blocks.push({ type: 'paragraph', content: paragraphTextarea.value });
        if (!summaryText) summaryText = paragraphTextarea.value.substring(0, 100) + '...';
      }
    });
  }

  const data = {
    title,
    status,
    category,
    author,
    tags,
    blocks,
    text: summaryText || 'No text content',
    verse: primaryVerse || 'Scripture study',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
    views: idVal ? (STATE.articles.find(a => a.id === parseInt(idVal))?.views || 0) : 0,
    subtitle: summaryText ? summaryText.substring(0, 50) + '...' : 'Spiritual devotional study'
  };

  if (idVal) {
    const id = parseInt(idVal);
    const idx = STATE.articles.findIndex(a => a.id === id);
    if (idx !== -1) {
      const oldArt = { ...STATE.articles[idx] };
      data.id = id;
      STATE.articles[idx] = data;

      logActivity('Article updated', title, () => {
        STATE.articles[idx] = oldArt;
        renderArticles();
      });
      showToast('success', 'Article Saved', `"${title}" has been saved as ${status}.`);
    }
  } else {
    const id = STATE.articles.length ? Math.max(...STATE.articles.map(a => a.id)) + 1 : 1;
    data.id = id;
    STATE.articles.push(data);

    logActivity('Article created', title, () => {
      STATE.articles = STATE.articles.filter(a => a.id !== id);
      renderArticles();
    });
    showToast('success', 'Article Created', `"${title}" has been created as ${status}.`);
  }

  closeModal('modal-article');
  renderArticles();
};

window.previewArticle = function() {
  const title = document.getElementById('art-edit-title').value.trim() || 'Untitled Article';
  const author = document.getElementById('art-edit-author').value;
  const category = document.getElementById('art-edit-category').value;
  
  const blockList = document.getElementById('art-edit-block-list');
  let blocksHtml = '';

  if (blockList) {
    const items = blockList.querySelectorAll('.block-item');
    items.forEach(item => {
      const headingTextarea = item.querySelector('.block-heading');
      const paragraphTextarea = item.querySelector('textarea:not(.block-heading)');
      const verseDiv = item.querySelector('.block-verse');
      const productSelect = item.querySelector('select');

      if (headingTextarea) {
        blocksHtml += `<h2 style="font-size:1.5rem;font-weight:700;color:var(--text-primary);margin-top:20px;margin-bottom:10px;">${headingTextarea.value}</h2>`;
      } else if (verseDiv) {
        blocksHtml += `<blockquote style="border-left:4px solid var(--brand-gold);padding-left:16px;margin:20px 0;font-style:italic;color:var(--brand-gold);background:var(--bg-elevated);padding:12px 16px;border-radius:4px;">${verseDiv.innerText}</blockquote>`;
      } else if (productSelect) {
        const prodId = parseInt(productSelect.value);
        const prod = STATE.products.find(p => p.id === prodId);
        if (prod) {
          blocksHtml += `
            <div style="display:flex;align-items:center;gap:12px;background:var(--bg-elevated);border:1px solid var(--border-subtle);padding:12px;border-radius:8px;margin:16px 0;">
              <span style="font-size:2rem;">${prod.thumb || '👕'}</span>
              <div style="flex:1;">
                <div style="font-weight:700;color:var(--text-primary);">${prod.name}</div>
                <div style="font-size:0.8rem;color:var(--text-muted);">${prod.desc}</div>
              </div>
              <div style="font-weight:700;color:var(--brand-gold);">₹${prod.price}</div>
            </div>
          `;
        }
      } else if (paragraphTextarea) {
        blocksHtml += `<p style="font-size:1rem;color:var(--text-secondary);line-height:1.6;margin-bottom:12px;">${paragraphTextarea.value}</p>`;
      }
    });
  }

  const previewDiv = document.createElement('div');
  previewDiv.id = 'dynamic-preview-modal';
  previewDiv.className = 'modal-overlay open';
  previewDiv.style.zIndex = '2000';
  previewDiv.innerHTML = `
    <div class="modal modal-lg" style="background:var(--bg-surface);color:var(--text-primary);padding:30px;border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);margin-top:40px;">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border-subtle);padding-bottom:16px;margin-bottom:20px;">
        <span style="font-weight:700;color:var(--brand-gold);text-transform:uppercase;letter-spacing:0.05em;font-size:0.8rem;">Live Journal Preview</span>
        <button class="btn btn-secondary btn-sm" onclick="document.getElementById('dynamic-preview-modal').remove()">Close Preview</button>
      </div>
      <div style="max-height:60vh;overflow-y:auto;padding-right:10px;text-align:left;">
        <span class="badge badge-burgundy" style="margin-bottom:10px;">${category.toUpperCase()}</span>
        <h1 style="font-size:2.2rem;font-weight:800;color:var(--text-primary);line-height:1.2;margin-bottom:12px;">${title}</h1>
        <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:24px;">By <strong>${author}</strong> · Published Today</div>
        <div class="article-preview-content">${blocksHtml || '<p style="color:var(--text-muted);">No content added yet.</p>'}</div>
      </div>
    </div>
  `;
  document.body.appendChild(previewDiv);
};

// ============================================================
// VISUAL HOMEPAGE BUILDER LOGIC (Task 9)
// ============================================================
window.renderHomepageBuilder = function() {
  const sidebarContainer = document.getElementById('homepage-sections-container');
  const previewContainer = document.getElementById('homepage-preview-container');
  if (!sidebarContainer || !previewContainer) return;

  sidebarContainer.innerHTML = '';
  previewContainer.innerHTML = '';

  const previews = {
    banner: `<div style="background:var(--brand-burgundy);color:#fff;text-align:center;padding:8px;font-size:0.75rem;font-weight:600;letter-spacing:0.05em;border-radius:4px;">FREE SHIPPING ON ALL ORDERS ABOVE ₹2,500 🚚</div>`,
    hero: `<div style="height:160px;background:linear-gradient(135deg,#111,#222);border-radius:6px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;text-align:center;">
        <div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(103,0,0,0.45),transparent);"></div>
        <div style="position:relative;"><div style="font-size:1.3rem;font-weight:800;color:#fff;">Put on the Armor of Light</div><div style="font-size:0.7rem;color:var(--brand-gold);margin-top:4px;">EPISODE I · FAITH STREETWEAR</div></div>
      </div>`,
    trust: `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center;font-size:0.68rem;color:var(--text-secondary);background:var(--bg-elevated);padding:8px;border-radius:4px;">
        <div>✓ 100% Premium Cotton</div><div>✓ Free Shipping India</div><div>✓ Easy 7-Day Returns</div>
      </div>`,
    statement: `<div style="text-align:center;padding:16px;background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:6px;">
        <div style="font-style:italic;font-family:var(--font-serif);color:var(--text-primary);font-size:0.85rem;">"Let us put aside the deeds of darkness and put on the armor of light."</div>
        <div style="font-size:0.68rem;color:var(--text-muted);margin-top:4px;">Romans 13:12</div>
      </div>`,
    products: `<div>
        <div style="font-size:0.8rem;font-weight:700;margin-bottom:6px;color:var(--text-primary);text-align:left;">Featured faith collections</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
          <div style="background:var(--bg-elevated);border-radius:4px;padding:8px;text-align:center;"><div style="font-size:1.5rem;">👕</div><div style="font-weight:600;font-size:0.7rem;color:var(--text-primary);">Armor Tee</div><div style="color:var(--brand-gold);font-size:0.68rem;">₹2,890</div></div>
          <div style="background:var(--bg-elevated);border-radius:4px;padding:8px;text-align:center;"><div style="font-size:1.5rem;">🖤</div><div style="font-weight:600;font-size:0.7rem;color:var(--text-primary);">Child of God</div><div style="color:var(--brand-gold);font-size:0.68rem;">₹2,690</div></div>
          <div style="background:var(--bg-elevated);border-radius:4px;padding:8px;text-align:center;"><div style="font-size:1.5rem;">🕊️</div><div style="font-weight:600;font-size:0.7rem;color:var(--text-primary);">Grace Hoodie</div><div style="color:var(--brand-gold);font-size:0.68rem;">₹4,490</div></div>
        </div>
      </div>`,
    community: `<div style="background:rgba(192,154,107,0.08);border:1px dashed var(--brand-gold);border-radius:6px;padding:12px;text-align:center;">
        <div style="font-size:0.8rem;font-weight:700;color:var(--brand-gold);">🙏 Prayer Request Wall</div>
        <div style="font-size:0.7rem;color:var(--text-secondary);margin-top:4px;">"Praying for peace in the new workspace..." - 14 joins</div>
      </div>`,
    journal: `<div style="border-top:1px solid var(--border-subtle);padding-top:12px;text-align:left;">
        <div style="font-size:0.8rem;font-weight:700;color:var(--text-primary);margin-bottom:6px;">Latest from the journal</div>
        <div style="display:flex;gap:8px;align-items:center;background:var(--bg-elevated);padding:6px;border-radius:4px;">
          <div style="font-size:1.2rem;">📖</div><div><div style="font-weight:600;font-size:0.7rem;color:var(--text-primary);">Romans 13: Put on the Armor of Light</div><div style="font-size:0.62rem;color:var(--text-muted);">Read time: 5 mins</div></div>
        </div>
      </div>`,
    newsletter: `<div style="background:#111;color:#fff;padding:12px;border-radius:6px;text-align:center;">
        <div style="font-weight:700;font-size:0.78rem;">Join the Faith Community Newsletter</div>
        <div style="display:flex;gap:6px;margin-top:6px;"><input type="text" placeholder="Your email..." style="flex:1;font-size:0.68rem;padding:4px;border:1px solid #444;background:#222;color:#fff;border-radius:3px;"><button style="background:var(--brand-gold);color:#000;border:none;font-size:0.68rem;padding:4px 8px;border-radius:3px;font-weight:700;cursor:pointer;">Subscribe</button></div>
      </div>`
  };

  STATE.homepageSections.forEach((s, idx) => {
    const activeClass = s.active ? 'on' : '';
    const itemDiv = document.createElement('div');
    itemDiv.className = 'builder-section-item';
    itemDiv.style.display = 'flex';
    itemDiv.style.justifyContent = 'space-between';
    itemDiv.style.alignItems = 'center';
    itemDiv.style.padding = '8px 12px';
    itemDiv.style.background = 'var(--bg-surface)';
    itemDiv.style.border = '1px solid var(--border-subtle)';
    itemDiv.style.borderRadius = 'var(--radius-sm)';
    itemDiv.style.marginBottom = '6px';

    itemDiv.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="display:flex;flex-direction:column;gap:2px;">
          <button class="btn btn-ghost btn-sm" onclick="moveSectionUp(${idx})" style="padding:0 2px;font-size:0.65rem;border:none;background:none;color:var(--text-muted);cursor:pointer;">▲</button>
          <button class="btn btn-ghost btn-sm" onclick="moveSectionDown(${idx})" style="padding:0 2px;font-size:0.65rem;border:none;background:none;color:var(--text-muted);cursor:pointer;">▼</button>
        </div>
        <span class="section-name" style="font-size:0.8rem;font-weight:600;color:var(--text-primary);">${s.name}</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <div class="section-toggle ${activeClass}" onclick="toggleSectionActive(${idx})" style="position:relative;width:32px;height:18px;background:var(--text-disabled);border-radius:9px;cursor:pointer;transition:0.25s;">
          <span style="position:absolute;top:2px;left:${s.active ? '16px' : '2px'};width:14px;height:14px;background:#fff;border-radius:50%;transition:0.25s;"></span>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="deleteHomepageSection(${idx})" style="color:var(--color-error);padding:0;background:none;border:none;cursor:pointer;">&times;</button>
      </div>
    `;

    // Adjust switch toggle color
    const toggleEl = itemDiv.querySelector('.section-toggle');
    if (s.active && toggleEl) {
      toggleEl.style.backgroundColor = 'var(--brand-burgundy)';
    }

    sidebarContainer.appendChild(itemDiv);

    if (s.active) {
      const previewBlockHtml = previews[s.type] || `<div style="padding:10px;background:var(--bg-elevated);border-radius:4px;">${s.name}</div>`;
      previewContainer.insertAdjacentHTML('beforeend', previewBlockHtml);
    }
  });
};

window.moveSectionUp = function(idx) {
  if (idx === 0) return;
  const temp = STATE.homepageSections[idx];
  STATE.homepageSections[idx] = STATE.homepageSections[idx - 1];
  STATE.homepageSections[idx - 1] = temp;
  renderHomepageBuilder();
  showToast('info', 'Section Reordered', 'Moved section up');
};

window.moveSectionDown = function(idx) {
  if (idx === STATE.homepageSections.length - 1) return;
  const temp = STATE.homepageSections[idx];
  STATE.homepageSections[idx] = STATE.homepageSections[idx + 1];
  STATE.homepageSections[idx + 1] = temp;
  renderHomepageBuilder();
  showToast('info', 'Section Reordered', 'Moved section down');
};

window.toggleSectionActive = function(idx) {
  STATE.homepageSections[idx].active = !STATE.homepageSections[idx].active;
  renderHomepageBuilder();
  showToast('success', 'Layout Updated', `${STATE.homepageSections[idx].name} visibility changed`);
};

window.setPreviewViewport = function(device) {
  STATE.currentHomepageViewport = device;
  const frame = document.getElementById('homepage-preview-frame-container');
  if (!frame) return;

  document.querySelectorAll('.viewport-btn').forEach(btn => btn.classList.remove('active'));
  
  if (device === 'desktop') {
    frame.style.maxWidth = '900px';
    const btn = document.querySelector('[title="Desktop"]');
    if (btn) btn.classList.add('active');
  } else if (device === 'tablet') {
    frame.style.maxWidth = '600px';
    const btn = document.querySelector('[title="Tablet"]');
    if (btn) btn.classList.add('active');
  } else if (device === 'mobile') {
    frame.style.maxWidth = '375px';
    const btn = document.querySelector('[title="Mobile"]');
    if (btn) btn.classList.add('active');
  }
};

window.addHomepageSection = function() {
  const name = prompt("Enter custom section name:");
  if (!name) return;
  
  const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const newSection = {
    id,
    name: '⚙️ ' + name,
    active: true,
    desc: 'Custom added page block',
    type: 'custom'
  };
  STATE.homepageSections.push(newSection);
  renderHomepageBuilder();
  showToast('success', 'Section Added', `"${name}" added to homepage sections`);
};

window.deleteHomepageSection = function(idx) {
  const s = STATE.homepageSections[idx];
  STATE.homepageSections.splice(idx, 1);
  renderHomepageBuilder();
  showToast('warning', 'Section Removed', `Removed "${s.name}"`);
};

// ============================================================
// MEDIA MANAGER & AI LOGIC (Task 10)
// ============================================================
window.renderMediaLibrary = function() {
  const grid = document.getElementById('media-grid-container');
  const breadcrumb = document.getElementById('media-breadcrumbs');
  if (!grid || !breadcrumb) return;

  grid.innerHTML = '';
  
  // Breadcrumbs
  if (STATE.currentMediaFolder) {
    breadcrumb.innerHTML = `
      <span style="cursor:pointer;font-weight:600;color:var(--brand-gold);" onclick="navigateToMediaFolder(null)">Media Library</span>
      <span style="color:var(--text-disabled);">/</span>
      <span style="font-weight:600;color:var(--text-primary);">${STATE.currentMediaFolder}</span>
    `;
  } else {
    breadcrumb.innerHTML = `
      <span style="font-weight:600;color:var(--text-primary);">Media Library</span>
    `;
  }

  // Render Folders first (only at root level)
  if (STATE.currentMediaFolder === null) {
    STATE.mediaFolders.forEach(folder => {
      const folderDiv = document.createElement('div');
      folderDiv.className = 'media-item';
      folderDiv.style.border = '1px solid rgba(192,154,107,0.2)';
      folderDiv.style.background = 'rgba(192,154,107,0.03)';
      folderDiv.ondblclick = () => navigateToMediaFolder(folder);
      
      folderDiv.innerHTML = `
        <div class="media-thumb" style="color:var(--brand-gold);font-size:3rem;padding-top:10px;">📁</div>
        <div class="media-info" style="text-align:center;"><div class="media-name" style="font-weight:700;color:var(--brand-gold);">${folder}</div><div class="media-meta">Folder</div></div>
      `;
      grid.appendChild(folderDiv);
    });
  }

  // Render Files
  const files = STATE.mediaFiles.filter(f => f.folder === STATE.currentMediaFolder);
  
  if (files.length === 0 && STATE.currentMediaFolder !== null) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);font-style:italic;">This folder is empty. Drop files to upload.</div>`;
    return;
  }

  files.forEach(f => {
    const isSelected = STATE.selectedMediaFileId === f.id;
    const activeClass = isSelected ? 'selected' : '';
    const fileDiv = document.createElement('div');
    fileDiv.className = `media-item ${activeClass}`;
    fileDiv.onclick = () => showMediaDetails(f.id);

    fileDiv.innerHTML = `
      <div class="media-thumb">${f.thumb || '🖼️'}</div>
      <div class="media-info"><div class="media-name">${f.name}</div><div class="media-meta">${f.size} · ${f.dim}</div></div>
      <div class="media-select-badge" style="opacity:${isSelected ? 1 : 0};">✓</div>
    `;
    grid.appendChild(fileDiv);
  });
};

window.navigateToMediaFolder = function(folder) {
  STATE.currentMediaFolder = folder;
  STATE.selectedMediaFileId = null;
  closeMediaDetails();
  renderMediaLibrary();
};

window.createMediaFolder = function() {
  const name = prompt("Enter new folder name:");
  if (!name) return;
  if (STATE.mediaFolders.includes(name)) {
    showToast('error', 'Error', 'Folder already exists');
    return;
  }
  STATE.mediaFolders.push(name);
  renderMediaLibrary();
  showToast('success', 'Folder Created', `Folder "${name}" has been created`);
};

window.showMediaDetails = function(fileId) {
  STATE.selectedMediaFileId = fileId;
  const f = STATE.mediaFiles.find(file => file.id === fileId);
  if (!f) return;

  renderMediaLibrary();

  const sidebar = document.getElementById('media-detail-sidebar');
  if (!sidebar) return;

  sidebar.style.display = 'block';
  document.getElementById('media-detail-preview').textContent = f.thumb || '🖼️';
  document.getElementById('media-detail-name').textContent = f.name;
  document.getElementById('media-detail-meta').textContent = `${f.size} · ${f.dim}`;
  document.getElementById('media-detail-alt').value = f.alt || '';
};

window.closeMediaDetails = function() {
  STATE.selectedMediaFileId = null;
  const sidebar = document.getElementById('media-detail-sidebar');
  if (sidebar) sidebar.style.display = 'none';
  renderMediaLibrary();
};

window.updateMediaAltText = function(val) {
  if (!STATE.selectedMediaFileId) return;
  const f = STATE.mediaFiles.find(file => file.id === STATE.selectedMediaFileId);
  if (f) f.alt = val;
};

window.generateMediaAltText = function() {
  if (!STATE.selectedMediaFileId) return;
  const f = STATE.mediaFiles.find(file => file.id === STATE.selectedMediaFileId);
  if (!f) return;

  const spinner = document.getElementById('media-ai-spinner');
  if (spinner) spinner.style.display = 'block';

  setTimeout(() => {
    if (spinner) spinner.style.display = 'none';
    const autoAlt = `An aesthetic streetwear photo of Ruven Studio product ${f.name.split('.')[0]} on a clean textured gray concrete background, warm studio light shadows.`;
    f.alt = autoAlt;
    const input = document.getElementById('media-detail-alt');
    if (input) input.value = autoAlt;
    showToast('success', 'Alt Text Generated', 'AI successfully generated image alt text description.');
  }, 1200);
};

window.deleteMediaFile = function() {
  if (!STATE.selectedMediaFileId) return;
  const idx = STATE.mediaFiles.findIndex(file => file.id === STATE.selectedMediaFileId);
  if (idx === -1) return;
  const file = STATE.mediaFiles[idx];
  STATE.mediaFiles.splice(idx, 1);
  
  logActivity('Media asset deleted', file.name, () => {
    STATE.mediaFiles.splice(idx, 0, file);
    renderMediaLibrary();
  });

  closeMediaDetails();
  showToast('warning', 'Asset Deleted', `"${file.name}" has been removed`);
  renderMediaLibrary();
};

// ============================================================
// SEO REDIRECT MANAGER & SITEMAP (Task 11)
// ============================================================
window.renderRedirects = function() {
  const tbody = document.getElementById('redirect-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';
  if (STATE.redirects.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:var(--text-muted);padding:10px;">No custom 301 redirects</td></tr>`;
    return;
  }

  STATE.redirects.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-family:var(--font-mono);font-size:0.75rem;">${r.from}</td>
      <td style="font-family:var(--font-mono);font-size:0.75rem;color:var(--brand-gold);">${r.to}</td>
      <td style="text-align:right;"><button class="btn btn-danger btn-sm" onclick="deleteRedirect(${r.id})" style="padding:2px 6px;">&times;</button></td>
    `;
    tbody.appendChild(tr);
  });
};

window.addRedirect = function() {
  const src = document.getElementById('redirect-src').value.trim();
  const dst = document.getElementById('redirect-dst').value.trim();

  if (!src || !dst) {
    showToast('error', 'Error', 'Please enter both source and destination paths');
    return;
  }

  const id = STATE.redirects.length ? Math.max(...STATE.redirects.map(r => r.id)) + 1 : 1;
  const newRedirect = { id, from: src, to: dst };
  STATE.redirects.push(newRedirect);

  logActivity('301 Redirect added', `${src} → ${dst}`, () => {
    STATE.redirects = STATE.redirects.filter(r => r.id !== id);
    renderRedirects();
  });

  document.getElementById('redirect-src').value = '';
  document.getElementById('redirect-dst').value = '';

  renderRedirects();
  showToast('success', 'Redirect Added', `301 redirect created successfully.`);
};

window.deleteRedirect = function(id) {
  const idx = STATE.redirects.findIndex(r => r.id === id);
  if (idx === -1) return;
  const r = STATE.redirects[idx];
  STATE.redirects.splice(idx, 1);

  logActivity('301 Redirect deleted', `${r.from} → ${r.to}`, () => {
    STATE.redirects.splice(idx, 0, r);
    renderRedirects();
  });

  renderRedirects();
  showToast('info', 'Redirect Deleted', '301 redirect has been removed.');
};

window.rebuildSitemap = function() {
  const spinner = document.getElementById('sitemap-spinner');
  if (spinner) spinner.style.display = 'inline-block';

  setTimeout(() => {
    if (spinner) spinner.style.display = 'none';
    showToast('success', 'Sitemap Generated', 'sitemap.xml rebuilt with all products, articles and collections.');
    logActivity('XML Sitemap generated', 'sitemap.xml');
  }, 1500);
};

// ============================================================
// DYNAMIC NOTIFICATIONS (Task 12)
// ============================================================
window.renderNotifications = function() {
  const container = document.getElementById('notif-list-container');
  const countBadge = document.getElementById('notif-count-badge');
  const headerDot = document.getElementById('header-notif-dot');
  if (!container) return;

  container.innerHTML = '';
  const unreadList = STATE.notifications.filter(n => n.unread);
  const unreadCount = unreadList.length;

  if (countBadge) countBadge.textContent = `${unreadCount} new`;
  if (headerDot) {
    headerDot.style.display = unreadCount > 0 ? 'block' : 'none';
  }

  if (STATE.notifications.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text-muted);font-style:italic;">No notifications yet.</div>`;
    return;
  }

  STATE.notifications.forEach(n => {
    const unreadClass = n.unread ? 'unread' : '';
    const dotHtml = n.unread ? `<div class="notif-unread-dot"></div>` : '';
    
    const div = document.createElement('div');
    div.className = `notif-item ${unreadClass}`;
    div.onclick = () => markNotificationAsRead(n.id);

    div.innerHTML = `
      <div class="notif-icon" style="background:${n.bg};">${n.icon}</div>
      <div class="notif-content">
        <div class="notif-text">${n.text}</div>
        <div class="notif-time">${n.time}</div>
      </div>
      ${dotHtml}
    `;
    container.appendChild(div);
  });
};

window.markNotificationAsRead = function(id) {
  const n = STATE.notifications.find(not => not.id === id);
  if (n) {
    n.unread = false;
    renderNotifications();
  }
};

window.markAllNotificationsAsRead = function() {
  STATE.notifications.forEach(n => {
    n.unread = false;
  });
  renderNotifications();
  showToast('info', 'Notifications Read', 'All notifications marked as read.');
};

// ============================================================
// ROLE-AWARE ANALYTICS DASHBOARD (Task 13)
// ============================================================
window.renderRoleDashboard = function() {
  const container = document.getElementById('dashboard-stats-grid');
  const greetingEl = document.querySelector('#panel-dashboard .page-title');
  if (!container) return;

  const role = STATE.user.role || 'super-admin';
  let cardsHtml = '';
  
  const greetings = {
    'super-admin': 'Good morning, Admin 👋',
    'admin': 'Welcome back, Super Admin 🛡️',
    'store-manager': 'Welcome back, Store Manager 🛍️',
    'content-manager': 'Welcome back, Content Manager ✍️',
    'product-manager': 'Welcome back, Product Manager 📦',
    'marketing-manager': 'Welcome back, Marketer 📢',
    'support': 'Welcome back, Support Team 📞'
  };
  if (greetingEl) greetingEl.textContent = greetings[role] || 'Welcome back 👋';

  if (role === 'super-admin' || role === 'admin' || role === 'finance') {
    cardsHtml = `
      <div class="stat-card">
        <div class="stat-card-accent accent-burgundy"></div>
        <div class="stat-header">
          <span class="stat-label">Revenue Today</span>
          <div class="stat-icon" style="background:var(--brand-burgundy-glow);">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--brand-burgundy-light)" stroke-width="2" style="width:16px;height:16px;"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
        </div>
        <div class="stat-value">₹24,890</div>
        <div class="stat-change up">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:12px;height:12px;"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          +18.4% vs yesterday
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-accent accent-gold"></div>
        <div class="stat-header">
          <span class="stat-label">Orders Today</span>
          <div class="stat-icon" style="background:var(--brand-gold-dim);">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--brand-gold)" stroke-width="2" style="width:16px;height:16px;"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          </div>
        </div>
        <div class="stat-value">47</div>
        <div class="stat-change up">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:12px;height:12px;"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          +7 from yesterday
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-accent accent-success"></div>
        <div class="stat-header">
          <span class="stat-label">Visitors Today</span>
          <div class="stat-icon" style="background:var(--color-success-bg);">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2" style="width:16px;height:16px;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
        </div>
        <div class="stat-value">1,842</div>
        <div class="stat-change up">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:12px;height:12px;"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          +12.2%
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-accent accent-info"></div>
        <div class="stat-header">
          <span class="stat-label">Conversion Rate</span>
          <div class="stat-icon" style="background:var(--color-info-bg);">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-info)" stroke-width="2" style="width:16px;height:16px;"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
        </div>
        <div class="stat-value">2.55%</div>
        <div class="stat-change down">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:12px;height:12px;"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
          -0.3% vs last week
        </div>
      </div>
    `;
  } else if (role === 'store-manager' || role === 'product-manager' || role === 'warehouse-manager') {
    cardsHtml = `
      <div class="stat-card">
        <div class="stat-card-accent accent-burgundy"></div>
        <div class="stat-header">
          <span class="stat-label">Low Stock Items</span>
          <div class="stat-icon" style="background:var(--color-error-bg);display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;">📦</div>
        </div>
        <div class="stat-value">1 item</div>
        <div class="stat-change down">Armor of Light Tee (M)</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-accent accent-gold"></div>
        <div class="stat-header">
          <span class="stat-label">Total Products</span>
          <div class="stat-icon" style="background:var(--bg-elevated);display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;">👕</div>
        </div>
        <div class="stat-value">${STATE.products.length}</div>
        <div class="stat-change neutral">Active in catalog</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-accent accent-success"></div>
        <div class="stat-header">
          <span class="stat-label">Out of Stock</span>
          <div class="stat-icon" style="background:var(--color-success-bg);display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;">✅</div>
        </div>
        <div class="stat-value">0</div>
        <div class="stat-change neutral">All items active</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-accent accent-info"></div>
        <div class="stat-header">
          <span class="stat-label">Total Inventory Value</span>
          <div class="stat-icon" style="background:var(--color-info-bg);display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;">💰</div>
        </div>
        <div class="stat-value">₹2,84,320</div>
        <div class="stat-change up">Current retail value</div>
      </div>
    `;
  } else if (role === 'content-manager') {
    cardsHtml = `
      <div class="stat-card">
        <div class="stat-card-accent accent-burgundy"></div>
        <div class="stat-header">
          <span class="stat-label">Total Blog Views</span>
          <div class="stat-icon" style="background:var(--brand-burgundy-glow);display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;">📖</div>
        </div>
        <div class="stat-value">2,132</div>
        <div class="stat-change up">+14.2% this month</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-accent accent-gold"></div>
        <div class="stat-header">
          <span class="stat-label">Pending Review</span>
          <div class="stat-icon" style="background:var(--brand-gold-dim);display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;">✍️</div>
        </div>
        <div class="stat-value">${STATE.articles.filter(a => a.status === 'review').length}</div>
        <div class="stat-change down">Awaiting approval</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-accent accent-success"></div>
        <div class="stat-header">
          <span class="stat-label">Active Devotionals</span>
          <div class="stat-icon" style="background:var(--color-success-bg);display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;">✝</div>
        </div>
        <div class="stat-value">${STATE.articles.filter(a => a.status === 'published').length}</div>
        <div class="stat-change neutral">Live on site</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-accent accent-info"></div>
        <div class="stat-header">
          <span class="stat-label">Avg. Reading Time</span>
          <div class="stat-icon" style="background:var(--color-info-bg);display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;">⏱️</div>
        </div>
        <div class="stat-value">4.5 min</div>
        <div class="stat-change neutral">High engagement rate</div>
      </div>
    `;
  } else if (role === 'marketing-manager') {
    cardsHtml = `
      <div class="stat-card">
        <div class="stat-card-accent accent-burgundy"></div>
        <div class="stat-header">
          <span class="stat-label">Subscribers</span>
          <div class="stat-icon" style="background:var(--brand-burgundy-glow);display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;">✉️</div>
        </div>
        <div class="stat-value">1,240</div>
        <div class="stat-change up">+48 this week</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-accent accent-gold"></div>
        <div class="stat-header">
          <span class="stat-label">Open Rate</span>
          <div class="stat-icon" style="background:var(--brand-gold-dim);display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;">📈</div>
        </div>
        <div class="stat-value">48.2%</div>
        <div class="stat-change up">Industry avg: 21%</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-accent accent-success"></div>
        <div class="stat-header">
          <span class="stat-label">Click Rate</span>
          <div class="stat-icon" style="background:var(--color-success-bg);display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;">🔗</div>
        </div>
        <div class="stat-value">12.4%</div>
        <div class="stat-change up">Above average</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-accent accent-info"></div>
        <div class="stat-header">
          <span class="stat-label">Active Discounts</span>
          <div class="stat-icon" style="background:var(--color-info-bg);display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;">🏷️</div>
        </div>
        <div class="stat-value">2</div>
        <div class="stat-change neutral">Promo campaigns</div>
      </div>
    `;
  } else if (role === 'support') {
    cardsHtml = `
      <div class="stat-card">
        <div class="stat-card-accent accent-burgundy"></div>
        <div class="stat-header">
          <span class="stat-label">Pending Orders</span>
          <div class="stat-icon" style="background:var(--brand-burgundy-glow);display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;">🛍️</div>
        </div>
        <div class="stat-value">12</div>
        <div class="stat-change warning">Needs fulfillment</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-accent accent-gold"></div>
        <div class="stat-header">
          <span class="stat-label">Return Requests</span>
          <div class="stat-icon" style="background:var(--brand-gold-dim);display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;">⚠️</div>
        </div>
        <div class="stat-value">3</div>
        <div class="stat-change error">Refund processing</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-accent accent-success"></div>
        <div class="stat-header">
          <span class="stat-label">CSAT Score</span>
          <div class="stat-icon" style="background:var(--color-success-bg);display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;">⭐</div>
        </div>
        <div class="stat-value">98.2%</div>
        <div class="stat-change up">Excellent satisfaction</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-accent accent-info"></div>
        <div class="stat-header">
          <span class="stat-label">Avg. Response Time</span>
          <div class="stat-icon" style="background:var(--color-info-bg);display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;">⏱️</div>
        </div>
        <div class="stat-value">15 min</div>
        <div class="stat-change up">Fast support delivery</div>
      </div>
    `;
  }
  container.innerHTML = cardsHtml;
  initAnimations();
};
