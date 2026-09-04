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

/** Appends the server's debug detail (if present) to an error message — same pattern as attendance.js. */
function errorText(res) {
  return res.debug ? `${res.message} (${res.debug})` : res.message;
}

// =================================================================
// LOGIN — password is the normal day-to-day path. OTP is only used to
// verify email ownership before setting/resetting a password.
// =================================================================
let pendingEmail = '';

document.getElementById('loginPasswordBtn').addEventListener('click', async () => {
  showFieldError('loginError', '');
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  if (!email) return showFieldError('loginError', 'Please enter your email address.');
  if (!password) return showFieldError('loginError', 'Please enter your password.');

  setLoading(true, 'Logging in…');
  const res = await Api.adminLoginPassword(email, password);
  setLoading(false);
  if (!res.success) return showFieldError('loginError', errorText(res));

  saveSession(res.data.sessionToken, res.data.name);
  document.getElementById('loginPassword').value = '';
  await loadDashboard();
});

// "First time or forgot password?" — reuses whatever email is already
// typed in, so nobody has to enter it twice.
document.getElementById('goToOtpSetupBtn').addEventListener('click', async () => {
  showFieldError('loginError', '');
  const email = document.getElementById('loginEmail').value.trim();
  if (!email) return showFieldError('loginError', 'Enter your email above first, then tap this again.');

  setLoading(true, 'Sending OTP…');
  const res = await Api.adminRequestOtp(email);
  setLoading(false);
  if (!res.success) return showFieldError('loginError', errorText(res));

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
  const res = await Api.adminVerifyOtpForPasswordSetup(pendingEmail, otp);
  setLoading(false);
  if (!res.success) return showFieldError('otpError', errorText(res));

  pendingSetupToken = res.data.setupToken;
  document.getElementById('newPasswordInput').value = '';
  document.getElementById('confirmPasswordInput').value = '';
  showFieldError('setPasswordError', '');
  showView('view-set-password');
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
  if (!res.success) return showFieldError('otpError', errorText(res));
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

// =================================================================
// SET PASSWORD (after OTP verification)
// =================================================================
let pendingSetupToken = '';

document.getElementById('savePasswordBtn').addEventListener('click', async () => {
  showFieldError('setPasswordError', '');
  const pw = document.getElementById('newPasswordInput').value;
  const confirm = document.getElementById('confirmPasswordInput').value;
  if (pw.length < 6) return showFieldError('setPasswordError', 'Password must be at least 6 characters.');
  if (pw !== confirm) return showFieldError('setPasswordError', 'Passwords do not match.');

  setLoading(true, 'Saving password…');
  const res = await Api.adminSetPassword(pendingSetupToken, pw);
  setLoading(false);
  if (!res.success) return showFieldError('setPasswordError', errorText(res));

  saveSession(res.data.sessionToken, res.data.name);
  showToast('Password set. You\'re logged in.');
  await loadDashboard();
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
    showToast(errorText(res));
    return;
  }

  renderDashboard(res.data);
  showView('view-dashboard');
  loadExpiringSoon();
  loadQuickStats();
}

async function loadQuickStats() {
  const session = getSession();
  const wrap = document.getElementById('quickStats');
  const [studentsRes, revenueRes] = await Promise.all([
    Api.adminListStudents(session.token),
    Api.adminGetRevenue(session.token), // defaults to this month, server-side
  ]);
  const activeCount = studentsRes.success ? studentsRes.data.students.filter(s => s.status === 'ACTIVE').length : '—';
  const revenue = revenueRes.success ? `₹${revenueRes.data.totalRevenue.toLocaleString('en-IN')}` : '—';
  wrap.innerHTML = `
    <div class="quick-stat"><strong>${activeCount}</strong><span>Active Students</span></div>
    <div class="quick-stat"><strong>${revenue}</strong><span>Est. Revenue This Month</span></div>
  `;
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
  if (!res.success) { showToast(errorText(res)); return; }
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
    if (!res.success) return showToast(errorText(res));
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
  document.getElementById('editStudentForm').classList.toggle('is-active', tab.dataset.tab === 'edit');
  document.getElementById('addAdminForm').classList.toggle('is-active', tab.dataset.tab === 'admin');
  if (tab.dataset.tab === 'edit') populateStudentPicker();
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
  if (!res.success) { setLoading(false); return showFieldError('stuFormError', errorText(res)); }

  setLoading(true, 'Sending welcome email…');
  const meals = [payload.breakfast && 'Breakfast', payload.lunch && 'Lunch', payload.dinner && 'Dinner'].filter(Boolean).join(', ');
  try {
    await emailjs.send(CONFIG.EMAILJS_SERVICE_ID, CONFIG.EMAILJS_WELCOME_TEMPLATE_ID, {
      name: payload.name,
      email: payload.email,
      meals: meals,
      subscription_start: formatDisplay(payload.subscriptionStart),
      subscription_end: formatDisplay(payload.subscriptionEnd),
      business_name: CONFIG.BUSINESS_NAME,
    }, CONFIG.EMAILJS_PUBLIC_KEY);
    showToast(`Student added: ${res.data.studentId}. Welcome email sent.`);
  } catch (err) {
    showToast(`Student added: ${res.data.studentId}, but the welcome email failed to send.`);
  }
  setLoading(false);
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
  if (!res.success) return showFieldError('adminFormError', errorText(res));

  showToast(`Admin added: ${res.data.adminId}`);
  document.getElementById('adminName').value = '';
  document.getElementById('adminEmail').value = '';
});

// =================================================================
// EDIT STUDENT
// =================================================================
async function populateStudentPicker() {
  const session = getSession();
  const picker = document.getElementById('editStudentPicker');
  setLoading(true, 'Loading students…');
  const res = await Api.adminListStudents(session.token);
  setLoading(false);
  if (!res.success) return showToast(errorText(res));

  picker.innerHTML = '<option value="">— choose a student —</option>' +
    res.data.students.map(s => `<option value="${s.studentId}">${s.name} (${s.studentId}${s.status === 'INACTIVE' ? ' — inactive' : ''})</option>`).join('');
}

document.getElementById('editStudentPicker').addEventListener('change', async (e) => {
  const studentId = e.target.value;
  const fieldsWrap = document.getElementById('editStudentFields');
  showFieldError('editFormError', '');
  if (!studentId) { fieldsWrap.hidden = true; return; }

  const session = getSession();
  setLoading(true, 'Loading student…');
  const res = await Api.adminGetStudent(session.token, studentId);
  setLoading(false);
  if (!res.success) return showToast(errorText(res));

  const s = res.data;
  document.getElementById('editName').value = s.name;
  document.getElementById('editPhone').value = s.phone || '';
  document.getElementById('editStart').value = s.subscriptionStart;
  document.getElementById('editEnd').value = s.subscriptionEnd;
  document.getElementById('editStatus').value = s.status;
  document.getElementById('editBreakfast').checked = s.breakfast;
  document.getElementById('editLunch').checked = s.lunch;
  document.getElementById('editDinner').checked = s.dinner;
  fieldsWrap.hidden = false;
});

document.getElementById('submitEditBtn').addEventListener('click', async () => {
  showFieldError('editFormError', '');
  const session = getSession();
  const studentId = document.getElementById('editStudentPicker').value;
  const payload = {
    sessionToken: session.token,
    studentId: studentId,
    name: document.getElementById('editName').value.trim(),
    phone: document.getElementById('editPhone').value.trim(),
    status: document.getElementById('editStatus').value,
    subscriptionStart: document.getElementById('editStart').value,
    subscriptionEnd: document.getElementById('editEnd').value,
    breakfast: document.getElementById('editBreakfast').checked,
    lunch: document.getElementById('editLunch').checked,
    dinner: document.getElementById('editDinner').checked,
  };
  if (!payload.name) return showFieldError('editFormError', 'Please enter a name.');
  if (!payload.subscriptionStart || !payload.subscriptionEnd) return showFieldError('editFormError', 'Please enter both subscription dates.');
  if (!payload.breakfast && !payload.lunch && !payload.dinner) return showFieldError('editFormError', 'Please select at least one meal.');

  setLoading(true, 'Saving…');
  const res = await Api.adminEditStudent(payload);
  setLoading(false);
  if (!res.success) return showFieldError('editFormError', errorText(res));

  showToast('Student updated.');
  populateStudentPicker();
});

// =================================================================
// EXPIRING SOON + RENEW
// =================================================================
async function loadExpiringSoon() {
  const session = getSession();
  const res = await Api.adminGetExpiringSoon(session.token);
  const block = document.getElementById('expiringSoonBlock');
  if (!res.success || res.data.students.length === 0) { block.hidden = true; return; }

  block.hidden = false;
  document.getElementById('expiringList').innerHTML = res.data.students.map(s => {
    const label = s.daysRemaining < 0 ? 'Expired' : s.daysRemaining === 0 ? 'Ends today' : `${s.daysRemaining} day${s.daysRemaining === 1 ? '' : 's'} left`;
    const urgency = s.daysRemaining <= 1 ? 'is-urgent' : 'is-soon';
    return `
      <li class="expiring-row">
        <span class="expiring-row-info">${s.name}<span class="expiring-days ${urgency}">${label}</span></span>
        <span class="expiring-row-actions">
          <button type="button" class="link-btn" data-remind="${s.studentId}" data-remind-name="${s.name}" data-remind-email="${s.email}" data-remind-end="${s.subscriptionEnd}" data-remind-days="${s.daysRemaining}">Remind</button>
          <button type="button" class="link-btn" data-renew="${s.studentId}" data-renew-name="${s.name}" data-current-end="${s.subscriptionEnd}">Renew</button>
        </span>
      </li>`;
  }).join('');
}

document.getElementById('expiringList').addEventListener('click', async (e) => {
  const renewBtn = e.target.closest('[data-renew]');
  if (renewBtn) { openRenewModal(renewBtn.dataset.renew, renewBtn.dataset.renewName, renewBtn.dataset.currentEnd); return; }

  const remindBtn = e.target.closest('[data-remind]');
  if (remindBtn) {
    setLoading(true, 'Sending reminder…');
    const daysLeft = Number(remindBtn.dataset.remindDays);
    try {
      await emailjs.send(CONFIG.EMAILJS_SERVICE_ID, CONFIG.EMAILJS_REMINDER_TEMPLATE_ID, {
        name: remindBtn.dataset.remindName,
        email: remindBtn.dataset.remindEmail,
        subscription_end: formatDisplay(remindBtn.dataset.remindEnd),
        days_left: daysLeft < 0 ? 0 : daysLeft,
        business_name: CONFIG.BUSINESS_NAME,
      }, CONFIG.EMAILJS_PUBLIC_KEY);
      showToast('Reminder email sent.');
    } catch (err) {
      showToast('Could not send the reminder email.');
    }
    setLoading(false);
  }
});

function openRenewModal(studentId, name, currentEnd) {
  document.getElementById('renewModal').dataset.studentId = studentId;
  document.getElementById('renewStudentName').textContent = `${name} — currently ends ${formatDisplay(currentEnd)}`;
  showFieldError('renewFormError', '');
  // default the new date to one month after the current end date
  const d = new Date(currentEnd + 'T00:00:00');
  d.setMonth(d.getMonth() + 1);
  const defaultNew = d.toISOString().slice(0, 10);
  const input = document.getElementById('renewNewDate');
  input.value = defaultNew;
  input.min = todayISOLocal();
  document.getElementById('renewModal').classList.add('open');
}
document.getElementById('closeRenewBtn').addEventListener('click', () => {
  document.getElementById('renewModal').classList.remove('open');
});

document.getElementById('confirmRenewBtn').addEventListener('click', async () => {
  showFieldError('renewFormError', '');
  const session = getSession();
  const studentId = document.getElementById('renewModal').dataset.studentId;
  const newEndDate = document.getElementById('renewNewDate').value;
  if (!newEndDate) return showFieldError('renewFormError', 'Please choose a new end date.');

  setLoading(true, 'Renewing…');
  const res = await Api.adminRenewStudent(session.token, studentId, newEndDate);
  setLoading(false);
  if (!res.success) return showFieldError('renewFormError', errorText(res));

  document.getElementById('renewModal').classList.remove('open');
  showToast('Subscription renewed.');
  await loadExpiringSoon();
});

// =================================================================
// INIT
// =================================================================
// =================================================================
// ALL STUDENTS
// =================================================================
let allStudentsCache = [];

document.getElementById('openAllStudentsBtn').addEventListener('click', async () => {
  showView('view-all-students');
  await loadAllStudents();
});
document.getElementById('backFromAllStudentsBtn').addEventListener('click', async () => {
  showView('view-dashboard');
  await loadDashboard();
});

async function loadAllStudents() {
  const session = getSession();
  setLoading(true, 'Loading students…');
  const res = await Api.adminListStudentsDetailed(session.token);
  setLoading(false);
  if (!res.success) return showToast(errorText(res));
  allStudentsCache = res.data.students;
  renderAllStudents(allStudentsCache);
}

function renderAllStudents(students) {
  const wrap = document.getElementById('allStudentsList');
  if (students.length === 0) { wrap.innerHTML = '<p class="empty-note">No students found.</p>'; return; }
  wrap.innerHTML = students.map(s => `
    <div class="student-card">
      <div class="student-card-info">
        <strong>${s.name} <span class="student-status-badge ${s.status.toLowerCase()}">${s.status}</span></strong>
        <span>${s.meals.join(' · ') || 'No meals'} · ends ${formatDisplay(s.subscriptionEnd)}</span>
      </div>
      <div class="student-skip-count">
        <strong>${s.skippedCount}</strong>
        <span>skipped</span>
      </div>
    </div>`).join('');
}

document.getElementById('studentSearch').addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  const filtered = q
    ? allStudentsCache.filter(s => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q))
    : allStudentsCache;
  renderAllStudents(filtered);
});

// =================================================================
// REVENUE
// =================================================================
document.getElementById('openRevenueBtn').addEventListener('click', async () => {
  showView('view-revenue');
  await loadRevenue();
});
document.getElementById('backFromRevenueBtn').addEventListener('click', async () => {
  showView('view-dashboard');
  await loadDashboard();
});
document.getElementById('revenueGoBtn').addEventListener('click', loadRevenue);

async function loadRevenue() {
  const session = getSession();
  const fromInput = document.getElementById('revenueFrom');
  const toInput = document.getElementById('revenueTo');

  setLoading(true, 'Calculating revenue…');
  const res = await Api.adminGetRevenue(session.token, fromInput.value || undefined, toInput.value || undefined);
  setLoading(false);
  if (!res.success) return showToast(errorText(res));

  fromInput.value = res.data.fromDate;
  toInput.value = res.data.toDate;

  document.getElementById('revenueTotalCard').innerHTML = `
    <strong>₹${res.data.totalRevenue.toLocaleString('en-IN')}</strong>
    <span>Estimated total, ${formatDisplay(res.data.fromDate)} – ${formatDisplay(res.data.toDate)}</span>`;

  document.getElementById('revenueMealCards').innerHTML = ['breakfast', 'lunch', 'dinner'].map(meal => {
    const m = res.data.byMeal[meal];
    return `
      <div class="revenue-meal-card">
        <span class="meal-badge">${MEAL_ICON[meal]} ${capitalize(meal)}</span>
        <strong>₹${m.revenue.toLocaleString('en-IN')}</strong>
        <span>${m.count} meals served</span>
      </div>`;
  }).join('');
}

// =================================================================
// INIT
// =================================================================
(function init() {
  emailjs.init({ publicKey: CONFIG.EMAILJS_PUBLIC_KEY });
  const session = getSession();
  if (session) loadDashboard();
  else showView('view-login');
})();