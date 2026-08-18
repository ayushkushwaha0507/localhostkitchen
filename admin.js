/**
 * admin.js — admin login (email + OTP, same mechanism as students),
 * dashboard counts, meal view with present/absent lists, print, and
 * a tap-to-override control on each student row.
 */

const ADMIN_SESSION_KEY = 'lhk_admin_session';
function saveSession(token, name) { sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ token, name })); }
function getSession() { try { return JSON.parse(sessionStorage.getItem(ADMIN_SESSION_KEY)); } catch { return null; } }
function clearSession() { sessionStorage.removeItem(ADMIN_SESSION_KEY); }

function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('is-active', v.id === id));
}
function setLoading(isLoading, text) {
  const overlay = document.getElementById('loadingOverlay');
  document.getElementById('loadingText').textContent = text || 'Loading…';
  overlay.classList.toggle('is-visible', isLoading);
}
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('is-visible');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}
function showFieldError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.hidden = !msg;
}

// =================================================================
// LOGIN (mirrors attendance.js — same OTP mechanism, admin actions)
// =================================================================
let pendingEmail = '';

document.getElementById('sendOtpBtn').addEventListener('click', async () => {
  showFieldError('loginError', '');
  const email = document.getElementById('loginEmail').value.trim();
  if (!email) return showFieldError('loginError', 'Please enter your email address.');

  setLoading(true, 'Sending OTP…');
  const res = await Api.adminRequestOtp(email);
  setLoading(false);
  if (!res.success) return showFieldError('loginError', res.message);

  try {
    await emailjs.send(CONFIG.EMAILJS_SERVICE_ID, CONFIG.EMAILJS_TEMPLATE_ID, {
      name: res.data.name, otp: res.data.otp, email: res.data.email,
    }, CONFIG.EMAILJS_PUBLIC_KEY);
  } catch {
    return showFieldError('loginError', "⚠️ We couldn't send the OTP. Please try again.");
  }

  pendingEmail = email;
  document.getElementById('otpSentTo').textContent = `OTP sent to ${email}.`;
  document.getElementById('otpInput').value = '';
  showView('view-otp');
  startResendCooldown();
});

document.getElementById('backToLoginBtn').addEventListener('click', () => showView('view-login'));

document.getElementById('verifyOtpBtn').addEventListener('click', async () => {
  showFieldError('otpError', '');
  const otp = document.getElementById('otpInput').value.trim();
  if (!/^\d{6}$/.test(otp)) return showFieldError('otpError', 'Please enter the 6-digit code.');

  setLoading(true, 'Verifying…');
  const res = await Api.adminVerifyOtp(pendingEmail, otp);
  setLoading(false);
  if (!res.success) return showFieldError('otpError', res.message);

  saveSession(res.data.sessionToken, res.data.name);
  await loadDashboard();
});

let resendTimer = null;
function startResendCooldown(seconds) {
  seconds = seconds || 30;
  const btn = document.getElementById('resendOtpBtn');
  const label = document.getElementById('resendCooldown');
  btn.hidden = true; label.hidden = false;
  let remaining = seconds;
  label.textContent = `Resend available in ${remaining}s`;
  clearInterval(resendTimer);
  resendTimer = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) { clearInterval(resendTimer); btn.hidden = false; label.hidden = true; }
    else label.textContent = `Resend available in ${remaining}s`;
  }, 1000);
}
document.getElementById('resendOtpBtn').addEventListener('click', async () => {
  setLoading(true, 'Resending OTP…');
  const res = await Api.adminRequestOtp(pendingEmail);
  setLoading(false);
  if (!res.success) return showFieldError('otpError', res.message);
  try {
    await emailjs.send(CONFIG.EMAILJS_SERVICE_ID, CONFIG.EMAILJS_TEMPLATE_ID, {
      name: res.data.name, otp: res.data.otp, email: res.data.email,
    }, CONFIG.EMAILJS_PUBLIC_KEY);
    showToast('OTP resent.');
    startResendCooldown();
  } catch {
    showFieldError('otpError', "⚠️ We couldn't send the OTP. Please try again.");
  }
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
  const session = getSession();
  if (session) await Api.adminLogout(session.token);
  clearSession();
  showView('view-login');
});

// =================================================================
// DASHBOARD
// =================================================================
const MEAL_ICON = { breakfast: '🌅', lunch: '🍱', dinner: '🌙' };
let currentDate = todayISOLocal();

function todayISOLocal() {
  // display-only convenience; the server independently computes IST 'today'
  // for anything that matters (counts, cutoff) — see Utils.gs
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

async function loadDashboard() {
  const session = getSession();
  if (!session) { showView('view-login'); return; }

  setLoading(true, 'Loading dashboard…');
  const res = await Api.getAdminDashboard(session.token, currentDate);
  setLoading(false);

  if (!res.success) {
    if (res.error === 'SESSION_EXPIRED') { clearSession(); showView('view-login'); return; }
    showToast(res.message);
    return;
  }

  renderDashboard(res.data);
  showView('view-dashboard');
}

function renderDashboard(data) {
  document.getElementById('dashDate').textContent = formatDisplay(data.date);
  document.getElementById('lastUpdated').textContent = 'Last updated: ' + data.updatedAt;

  document.getElementById('mealSummaryCards').innerHTML = ['breakfast', 'lunch', 'dinner'].map(meal => {
    const c = data.counts[meal];
    return `
      <div class="meal-summary-card">
        <span class="meal-badge">${MEAL_ICON[meal]} ${meal.toUpperCase()}</span>
        <div class="count-row"><strong>${c.subscribers}</strong><span>Subscribers</span></div>
        <div class="count-row"><strong class="count-present">${c.present}</strong><span>Present</span></div>
        <div class="count-row"><strong class="count-absent">${c.absent}</strong><span>Absent</span></div>
        <button type="button" class="btn btn-primary btn-block" data-view-meal="${meal}">View ${capitalize(meal)}</button>
      </div>`;
  }).join('');
}
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function formatDisplay(dateISO) {
  const d = new Date(dateISO + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

document.getElementById('mealSummaryCards').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-view-meal]');
  if (btn) openMealView(btn.dataset.viewMeal);
});
document.getElementById('refreshBtn').addEventListener('click', loadDashboard);

// =================================================================
// MEAL VIEW — present/absent lists + tap-to-override
// =================================================================
let currentMeal = null;

async function openMealView(meal) {
  currentMeal = meal;
  document.getElementById('mealViewTitle').textContent = `${MEAL_ICON[meal]} ${capitalize(meal)}`;
  await loadMealView();
  showView('view-meal');
}

async function loadMealView() {
  const session = getSession();
  setLoading(true, 'Loading…');
  const res = await Api.getMealStudents(session.token, currentDate, currentMeal);
  setLoading(false);
  if (!res.success) { showToast(res.message); return; }
  renderMealView(res.data);
}

function renderMealView(data) {
  document.getElementById('mealViewDate').textContent = formatDisplay(data.date);
  document.getElementById('mealViewCounts').innerHTML = `
    <span class="count-pill count-pill--present">${data.present.length} Present</span>
    <span class="count-pill count-pill--absent">${data.absent.length} Absent</span>`;

  document.getElementById('presentList').innerHTML = data.present.length
    ? data.present.map(s => studentRowHTML(s, 'PRESENT')).join('')
    : '<li class="empty-note">No one present.</li>';

  document.getElementById('absentList').innerHTML = data.absent.length
    ? data.absent.map(s => studentRowHTML(s, 'ABSENT')).join('')
    : '<li class="empty-note">No one absent.</li>';
}

function studentRowHTML(student, status) {
  const icon = status === 'PRESENT' ? '✓' : '✕';
  const otherStatus = status === 'PRESENT' ? 'ABSENT' : 'PRESENT';
  const actionLabel = status === 'PRESENT' ? 'Mark Absent' : 'Mark Present';
  return `
    <li class="student-row">
      <span>${icon} ${student.name}</span>
      <button type="button" class="link-btn" data-override="${student.studentId}" data-new-status="${otherStatus}">${actionLabel}</button>
    </li>`;
}

document.querySelectorAll('.student-list').forEach(list => {
  list.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-override]');
    if (!btn) return;
    const studentId = btn.dataset.override;
    const newStatus = btn.dataset.newStatus;
    const confirmed = confirm(`Mark this student's ${currentMeal} as ${newStatus.toLowerCase()}? If the cutoff has passed, this will be recorded as an admin override.`);
    if (!confirmed) return;

    const session = getSession();
    setLoading(true, 'Updating…');
    const res = await Api.adminOverride(session.token, studentId, currentDate, currentMeal, newStatus);
    setLoading(false);
    if (!res.success) return showToast(res.message);
    await loadMealView();
  });
});

document.getElementById('backToDashboardBtn').addEventListener('click', async () => {
  showView('view-dashboard');
  await loadDashboard();
});
document.getElementById('mealRefreshBtn').addEventListener('click', loadMealView);
document.getElementById('printBtn').addEventListener('click', () => window.print());

// =================================================================
// MANAGE USERS — add student / add admin
// =================================================================
document.getElementById('openManageUsersBtn').addEventListener('click', () => showView('view-users'));
document.getElementById('backFromUsersBtn').addEventListener('click', async () => {
  showView('view-dashboard');
  await loadDashboard();
});

document.getElementById('userTabs').addEventListener('click', (e) => {
  const tab = e.target.closest('.user-tab');
  if (!tab) return;
  document.querySelectorAll('.user-tab').forEach(t => t.classList.toggle('is-active', t === tab));
  document.getElementById('addStudentForm').classList.toggle('is-active', tab.dataset.tab === 'student');
  document.getElementById('addAdminForm').classList.toggle('is-active', tab.dataset.tab === 'admin');
});

document.getElementById('submitStudentBtn').addEventListener('click', async () => {
  showFieldError('stuFormError', '');
  const session = getSession();
  const payload = {
    sessionToken: session.token,
    name: document.getElementById('stuName').value.trim(),
    email: document.getElementById('stuEmail').value.trim(),
    phone: document.getElementById('stuPhone').value.trim(),
    subscriptionStart: document.getElementById('stuStart').value,
    subscriptionEnd: document.getElementById('stuEnd').value,
    breakfast: document.getElementById('stuBreakfast').checked,
    lunch: document.getElementById('stuLunch').checked,
    dinner: document.getElementById('stuDinner').checked,
  };
  if (!payload.name) return showFieldError('stuFormError', 'Please enter a name.');
  if (!payload.email) return showFieldError('stuFormError', 'Please enter an email.');
  if (!payload.subscriptionStart || !payload.subscriptionEnd) return showFieldError('stuFormError', 'Please enter both subscription dates.');
  if (!payload.breakfast && !payload.lunch && !payload.dinner) return showFieldError('stuFormError', 'Please select at least one meal.');

  setLoading(true, 'Adding student…');
  const res = await Api.adminAddStudent(payload);
  setLoading(false);
  if (!res.success) return showFieldError('stuFormError', res.message);

  showToast(`Student added: ${res.data.studentId}`);
  document.getElementById('addStudentForm').reset();
});

document.getElementById('submitAdminBtn').addEventListener('click', async () => {
  showFieldError('adminFormError', '');
  const session = getSession();
  const name = document.getElementById('adminName').value.trim();
  const email = document.getElementById('adminEmail').value.trim();
  if (!name) return showFieldError('adminFormError', 'Please enter a name.');
  if (!email) return showFieldError('adminFormError', 'Please enter an email.');

  setLoading(true, 'Adding admin…');
  const res = await Api.adminAddAdmin(session.token, name, email);
  setLoading(false);
  if (!res.success) return showFieldError('adminFormError', res.message);

  showToast(`Admin added: ${res.data.adminId}`);
  document.getElementById('adminName').value = '';
  document.getElementById('adminEmail').value = '';
});

// =================================================================
// INIT
// =================================================================
(function init() {
  emailjs.init({ publicKey: CONFIG.EMAILJS_PUBLIC_KEY });
  const session = getSession();
  if (session) loadDashboard();
  else showView('view-login');
})();
