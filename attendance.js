/**
 * attendance.js — student login, OTP verification, dashboard,
 * skip/undo, and future-absence planning.
 */

// ---------- Session ----------
const SESSION_KEY = 'lhk_student_session';
function saveSession(token, name) { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ token, name })); }
function getSession() { try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); } catch { return null; } }
function clearSession() { sessionStorage.removeItem(SESSION_KEY); }

// ---------- View switching ----------
function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('is-active', v.id === id));
}

// ---------- Loading / toast ----------
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

// ---------- Generic confirm dialog ----------
function askConfirm(message) {
  return new Promise((resolve) => {
    document.getElementById('confirmMessage').textContent = message;
    const overlay = document.getElementById('confirmModal');
    overlay.classList.add('open');
    const okBtn = document.getElementById('confirmOkBtn');
    const cancelBtn = document.getElementById('confirmCancelBtn');
    function cleanup(result) {
      overlay.classList.remove('open');
      okBtn.removeEventListener('click', onOk);
      cancelBtn.removeEventListener('click', onCancel);
      resolve(result);
    }
    function onOk() { cleanup(true); }
    function onCancel() { cleanup(false); }
    okBtn.addEventListener('click', onOk);
    cancelBtn.addEventListener('click', onCancel);
  });
}

// =================================================================
// LOGIN — request OTP, then send it via EmailJS
// =================================================================
let pendingEmail = '';

document.getElementById('sendOtpBtn').addEventListener('click', async () => {
  showFieldError('loginError', '');
  const email = document.getElementById('loginEmail').value.trim();
  if (!email) return showFieldError('loginError', 'Please enter your email address.');

  setLoading(true, 'Sending OTP…');
  const res = await Api.requestOtp(email);
  setLoading(false);

  if (!res.success) {
    return showFieldError('loginError', res.message || '⚠️ This email is not registered with Localhost Kitchen.');
  }

  // Send the OTP via EmailJS. The OTP briefly exists in this variable only
  // to be handed to EmailJS — it's never logged or rendered anywhere.
  try {
    await emailjs.send(CONFIG.EMAILJS_SERVICE_ID, CONFIG.EMAILJS_TEMPLATE_ID, {
      name: res.data.name,
      otp: res.data.otp,
      email: res.data.email,
    }, CONFIG.EMAILJS_PUBLIC_KEY);
  } catch (err) {
    return showFieldError('loginError', "⚠️ We couldn't send the OTP. Please try again.");
  }

  pendingEmail = email;
  document.getElementById('otpSentTo').textContent = `OTP sent to ${email}.`;
  document.getElementById('otpInput').value = '';
  showView('view-otp');
  startResendCooldown();
});

document.getElementById('backToLoginBtn').addEventListener('click', () => showView('view-login'));

// ---------- OTP verify ----------
document.getElementById('verifyOtpBtn').addEventListener('click', async () => {
  showFieldError('otpError', '');
  const otp = document.getElementById('otpInput').value.trim();
  if (!/^\d{6}$/.test(otp)) return showFieldError('otpError', 'Please enter the 6-digit code.');

  setLoading(true, 'Verifying…');
  const res = await Api.verifyOtp(pendingEmail, otp);
  setLoading(false);

  if (!res.success) return showFieldError('otpError', res.message || 'Incorrect code. Please try again.');

  saveSession(res.data.sessionToken, res.data.name);
  await loadDashboard();
});

// ---------- Resend OTP with cooldown ----------
let resendTimer = null;
function startResendCooldown(seconds) {
  seconds = seconds || 30;
  const btn = document.getElementById('resendOtpBtn');
  const label = document.getElementById('resendCooldown');
  btn.hidden = true;
  label.hidden = false;
  let remaining = seconds;
  label.textContent = `Resend available in ${remaining}s`;
  clearInterval(resendTimer);
  resendTimer = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      clearInterval(resendTimer);
      btn.hidden = false;
      label.hidden = true;
    } else {
      label.textContent = `Resend available in ${remaining}s`;
    }
  }, 1000);
}
document.getElementById('resendOtpBtn').addEventListener('click', async () => {
  setLoading(true, 'Resending OTP…');
  const res = await Api.requestOtp(pendingEmail);
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

// =================================================================
// DASHBOARD
// =================================================================
const MEAL_ICON = { breakfast: '🌅', lunch: '🍱', dinner: '🌙' };
let currentDashboard = null;

async function loadDashboard() {
  const session = getSession();
  if (!session) { showView('view-login'); return; }

  setLoading(true, 'Loading your meals…');
  const res = await Api.getStudentDashboard(session.token);
  setLoading(false);

  if (!res.success) {
    if (res.error === 'SESSION_EXPIRED') { clearSession(); showView('view-login'); return; }
    showToast(res.message || "⚠️ We couldn't connect to Localhost Kitchen right now. Please try again.");
    return;
  }

  currentDashboard = res.data;
  renderDashboard(res.data);
  showView('view-dashboard');
}

function renderDashboard(data) {
  document.getElementById('dashGreeting').textContent = `Welcome, ${data.name} 👋`;
  document.getElementById('dashDate').textContent = data.displayDate;

  const remainingEl = document.getElementById('dashRemaining');
  if (data.daysRemaining < 0) {
    remainingEl.textContent = `Your subscription ended on ${data.subscriptionEndDisplay}.`;
    remainingEl.classList.add('is-warning');
  } else {
    remainingEl.textContent = `Subscription active until ${data.subscriptionEndDisplay} (${data.daysRemaining} day${data.daysRemaining === 1 ? '' : 's'} left)`;
    remainingEl.classList.toggle('is-warning', data.daysRemaining <= 3);
  }

  const chips = Object.entries(data.subscription)
    .filter(([, subscribed]) => subscribed)
    .map(([meal]) => `<span class="chip">${MEAL_ICON[meal]} ${capitalize(meal)}</span>`)
    .join('');
  document.getElementById('subSummaryChips').innerHTML = chips;

  renderMealCards('mealCards', data.date, data.statuses, data.menu, 'today');
  renderMealCards('tomorrowMealCards', data.tomorrow.date, data.tomorrow.statuses, data.tomorrow.menu, 'tomorrow');

  document.getElementById('lastUpdated').textContent = 'Last updated: ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  renderAbsenceMealChecks(data.subscription);
}

/** Builds one day's meal cards into a container — each Skip/Undo button carries
 * its own date, so the same click handler works correctly for both today and
 * tomorrow regardless of which section triggered it. */
function renderMealCards(containerId, dateISO, statuses, menu, dayWord) {
  const cards = Object.entries(statuses).map(([meal, status]) => {
    const dish = menu[meal];
    const dishHTML = dish
      ? `<h3>${dish.dish}</h3><p class="meal-desc">${dish.description || ''}</p><p class="meal-price">₹${dish.price}</p>`
      : `<h3>Menu not published yet</h3>`;

    let actionHTML;
    if (status === 'ABSENT') {
      actionHTML = `<p class="status-line status-absent">✕ ${capitalize(meal)} skipped</p><button type="button" class="btn btn-outline btn-block" data-undo="${meal}" data-date="${dateISO}" data-day-word="${dayWord}">Undo Skip</button>`;
    } else {
      actionHTML = `<p class="status-line status-present">✓ You are marked PRESENT</p><button type="button" class="btn btn-outline btn-block" data-skip="${meal}" data-date="${dateISO}" data-day-word="${dayWord}">Skip ${capitalize(meal)}</button>`;
    }

    return `
      <div class="meal-card" data-meal="${meal}">
        <span class="meal-badge">${MEAL_ICON[meal]} ${capitalize(meal).toUpperCase()}</span>
        ${dishHTML}
        ${actionHTML}
      </div>`;
  }).join('');
  document.getElementById(containerId).innerHTML = cards || '<p class="empty-note">You have no active meal subscriptions.</p>';
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

async function handleMealCardClick(e) {
  const skipBtn = e.target.closest('[data-skip]');
  const undoBtn = e.target.closest('[data-undo]');
  const session = getSession();
  if (!session) return;

  try {
    if (skipBtn) {
      const meal = skipBtn.dataset.skip;
      const dateISO = skipBtn.dataset.date;
      const dayWord = skipBtn.dataset.dayWord;
      const confirmed = await askConfirm(`Are you sure you want to skip ${dayWord}'s ${meal}?`);
      if (!confirmed) return;
      setLoading(true, 'Saving your absence…');
      const res = await Api.skipMeal(session.token, dateISO, meal);
      setLoading(false);
      if (!res.success) return showToast(res.debug ? `${res.message} (${res.debug})` : res.message);
      await loadDashboard();
    }

    if (undoBtn) {
      const meal = undoBtn.dataset.undo;
      const dateISO = undoBtn.dataset.date;
      setLoading(true, 'Updating…');
      const res = await Api.undoSkip(session.token, dateISO, meal);
      setLoading(false);
      if (!res.success) return showToast(res.debug ? `${res.message} (${res.debug})` : res.message);
      await loadDashboard();
    }
  } catch (err) {
    // safety net — a bug here should never again look like "the button does nothing"
    setLoading(false);
    showToast('Something went wrong on this page. Please refresh and try again.');
  }
}
document.getElementById('mealCards').addEventListener('click', handleMealCardClick);
document.getElementById('tomorrowMealCards').addEventListener('click', handleMealCardClick);

// Today / Tomorrow tab switching
document.getElementById('dayTabs').addEventListener('click', (e) => {
  const tab = e.target.closest('.day-tab');
  if (!tab) return;
  const which = tab.dataset.dayTab;
  document.querySelectorAll('.day-tab').forEach(t => t.classList.toggle('is-active', t === tab));
  document.getElementById('todayPanel').classList.toggle('is-active', which === 'today');
  document.getElementById('tomorrowPanel').classList.toggle('is-active', which === 'tomorrow');
});

document.getElementById('refreshBtn').addEventListener('click', loadDashboard);

document.getElementById('logoutBtn').addEventListener('click', async () => {
  const session = getSession();
  if (session) await Api.logout(session.token);
  clearSession();
  showView('view-login');
});

// =================================================================
// FUTURE ABSENCE
// =================================================================
function renderAbsenceMealChecks(subscription) {
  const wrap = document.getElementById('absenceMealChecks');
  const legend = wrap.querySelector('legend');
  wrap.innerHTML = '';
  wrap.appendChild(legend || Object.assign(document.createElement('legend'), { textContent: 'Meals' }));
  Object.entries(subscription).filter(([, s]) => s).forEach(([meal]) => {
    const label = document.createElement('label');
    label.innerHTML = `<input type="checkbox" name="absenceMeal" value="${meal}" checked> ${MEAL_ICON[meal]} ${capitalize(meal)}`;
    wrap.appendChild(label);
  });
}

document.getElementById('openFutureAbsenceBtn').addEventListener('click', () => {
  const today = new Date().toISOString().slice(0, 10);
  document.getElementById('absenceFrom').min = today;
  document.getElementById('absenceTo').min = today;
  document.getElementById('futureAbsenceModal').classList.add('open');
});
document.getElementById('closeFutureAbsenceBtn').addEventListener('click', () => {
  document.getElementById('futureAbsenceModal').classList.remove('open');
});
document.getElementById('absenceFrom').addEventListener('change', (e) => {
  document.getElementById('absenceTo').min = e.target.value;
});

document.getElementById('submitAbsenceBtn').addEventListener('click', async () => {
  showFieldError('absenceError', '');
  const from = document.getElementById('absenceFrom').value;
  const to = document.getElementById('absenceTo').value;
  const meals = Array.from(document.querySelectorAll('input[name="absenceMeal"]:checked')).map(el => el.value);
  const session = getSession();

  if (!from || !to) return showFieldError('absenceError', 'Please select both dates.');
  if (to < from) return showFieldError('absenceError', "End date can't be before the start date.");
  if (meals.length === 0) return showFieldError('absenceError', 'Please select at least one meal.');

  const confirmed = await askConfirm(`Mark yourself absent from ${from} to ${to} for ${meals.join(', ')}?`);
  if (!confirmed) return;

  setLoading(true, 'Saving…');
  const res = await Api.markFutureAbsence(session.token, from, to, meals);
  setLoading(false);

  if (!res.success) return showFieldError('absenceError', res.message);
  document.getElementById('futureAbsenceModal').classList.remove('open');
  showToast('Future absence saved.');
  await loadDashboard();
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