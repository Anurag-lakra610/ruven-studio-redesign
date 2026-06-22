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
  user: { name: 'Super Admin', email: 'admin@ruvenstudio.com', role: 'super-admin', initials: 'SA' },
  notifications: 5,
};

// ============================================================
// DOM READY
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  initOTP();
  initCmdPalette();
  initTabs();
  initTabsUnderline();
  initAnimations();
  checkSession();
});

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
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value.trim();
      const btn = document.getElementById('login-btn');

      if (!email || !password) {
        showToast('error', 'Missing Fields', 'Please enter your email and password');
        return;
      }

      btn.classList.add('btn-loading');
      btn.disabled = true;
      btn.textContent = 'Signing in…';

      setTimeout(() => {
        btn.classList.remove('btn-loading');
        btn.disabled = false;
        // Skip 2FA for demo — go straight to admin
        sessionStorage.setItem('rs_admin_auth', 'true');
        enterAdmin();
      }, 1200);
    });
  }
}

function enterAdmin() {
  STATE.isAuthenticated = true;
  document.querySelectorAll('.auth-screen').forEach(s => s.classList.remove('active'));
  document.getElementById('admin-app').classList.add('active');
  navigate('dashboard');
  showToast('success', 'Welcome back 👋', 'Logged in as Super Admin');
  startRealTimeClock();
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

function filterCmdResults(query) {
  const items = document.querySelectorAll('.cmd-item');
  const q = query.toLowerCase().trim();
  items.forEach(item => {
    const label = item.querySelector('.cmd-item-label')?.textContent.toLowerCase() || '';
    const sub = item.querySelector('.cmd-item-sub')?.textContent.toLowerCase() || '';
    const search = (item.dataset.search || '').toLowerCase();
    const visible = !q || label.includes(q) || sub.includes(q) || search.includes(q);
    item.style.display = visible ? 'flex' : 'none';
  });

  // Show group labels only if they have visible items
  document.querySelectorAll('.cmd-group').forEach(group => {
    const hasVisible = Array.from(group.querySelectorAll('.cmd-item')).some(i => i.style.display !== 'none');
    group.style.display = hasVisible ? '' : 'none';
  });
}

function handleCmdKey(e) {
  const items = Array.from(document.querySelectorAll('.cmd-item')).filter(i => i.style.display !== 'none');
  const active = document.querySelector('.cmd-item.active');
  let idx = items.indexOf(active);

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    active?.classList.remove('active');
    items[(idx + 1) % items.length]?.classList.add('active');
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    active?.classList.remove('active');
    items[(idx - 1 + items.length) % items.length]?.classList.add('active');
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
  // Update page title with current time
  function tick() {
    const now = new Date();
    document.title = `Ruven Admin · ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
  }
  tick();
  setInterval(tick, 60000);
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
