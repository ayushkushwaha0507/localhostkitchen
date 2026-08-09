// =============================================================
// Localhost: Kitchen — Menu & Subscription page
// =============================================================
// EDIT ME EACH WEEK: everything about dishes lives in menuData
// below. Nothing else needs to change for a normal menu update.
// =============================================================

const WHATSAPP_NUMBER = '917428662683';

// ---------- Meal metadata ----------
const MEAL_META = {
  breakfast: { label: 'Breakfast', emoji: '🌅', price: 30, time: '8:00 AM – 10:00 AM' },
  lunch:     { label: 'Lunch',     emoji: '☀️', price: 70, time: '1:00 PM – 2:30 PM' },
  dinner:    { label: 'Dinner',    emoji: '🌙', price: 70, time: '8:00 PM – 9:30 PM' },
};
const SUNDAY_BRUNCH_META = { label: 'Brunch', emoji: '🌅', price: 70, time: '10:00 AM – 12:00 PM' };
const DAILY_RATE = MEAL_META.breakfast.price + MEAL_META.lunch.price + MEAL_META.dinner.price; // ₹170/day/person

const DAYS = [
  { key: 'mon', label: 'Mon', full: 'Monday' },
  { key: 'tue', label: 'Tue', full: 'Tuesday' },
  { key: 'wed', label: 'Wed', full: 'Wednesday' },
  { key: 'thu', label: 'Thu', full: 'Thursday' },
  { key: 'fri', label: 'Fri', full: 'Friday' },
  { key: 'sat', label: 'Sat', full: 'Saturday' },
  { key: 'sun', label: 'Sun', full: 'Sunday' },
];

const PLANS = {
  full:    { label: 'Full Week',     days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] },
  weekday: { label: 'Weekdays Only', days: ['mon', 'tue', 'wed', 'thu', 'fri'] },
  weekend: { label: 'Weekend Only',  days: ['sat', 'sun'] },
};

// =================================================================
// 💰 DISCOUNTS — EDIT HERE
// Change the number for any plan to update its discount everywhere on
// the page (plan card badge, estimated total, and the WhatsApp message)
// automatically. Use 0 for no discount.
// =================================================================
const PLAN_DISCOUNTS = {
  full: 20,      // Full Week plan — 15% off
  weekday: 15,   // Weekdays Only plan — 15% off
  weekend: 5,    // Weekend Only plan — no discount
};

// ---------- THE MENU — update this every week ----------
const menuData = {
  mon: {
    breakfast: { name: 'Aloo Pyaz Paratha', items: ['Aloo Pyaz Paratha', 'Curd', 'Pickle'], price: 30, image: 'images/menu/aloo-pyaz-paratha.jpg', alt: 'Homemade aloo pyaz paratha breakfast from Localhost Kitchen in Greater Noida' },
    lunch:     { name: 'Chole', items: ['Chole', '4 Roti', 'Rice', 'Salad'], price: 70, image: 'images/menu/chole.jpg', alt: 'Homemade chole lunch tiffin with roti and rice from Localhost Kitchen' },
    dinner:    { name: 'Dal Makhani', items: ['Dal Makhani', 'Seasonal Sabzi', '4 Roti', 'Rice'], price: 70, image: 'images/menu/dal-makhani.jpg', alt: 'Homemade dal makhani dinner tiffin from Localhost Kitchen' },
  },
  tue: {
    breakfast: { name: 'Poha', items: ['Poha'], price: 30, image: 'images/menu/poha.jpg', alt: 'Homemade poha breakfast from Localhost Kitchen in Greater Noida' },
    lunch:     { name: 'Kadhi Pakora', items: ['Kadhi Pakora', '4 Roti', 'Rice', 'Salad'], price: 70, image: 'images/menu/kadhi-pakora.jpg', alt: 'Homemade kadhi pakora lunch tiffin from Localhost Kitchen' },
    dinner:    { name: 'Soyabean Curry', items: ['Soyabean Curry', '4 Roti', 'Rice', 'Raita'], price: 70, image: 'images/menu/soyabean-curry.jpg', alt: 'Homemade soyabean curry dinner tiffin from Localhost Kitchen' },
  },
  wed: {
    breakfast: { name: 'Macaroni / Pasta', items: ['Macaroni / Pasta'], price: 30, image: 'images/menu/macaroni-pasta.jpg', alt: 'Homemade macaroni pasta breakfast from Localhost Kitchen in Greater Noida' },
    lunch:     { name: 'Rajma', items: ['Rajma', '4 Roti', 'Rice', 'Raita'], price: 70, image: 'images/menu/rajma.jpg', alt: 'Homemade rajma lunch tiffin with roti and rice from Localhost Kitchen' },
    dinner:    { name: 'Dal Tadka', items: ['Dal Tadka', 'Seasonal Sabzi', '4 Roti', 'Rice'], price: 70, image: 'images/menu/dal-tadka.jpg', alt: 'Homemade dal tadka dinner tiffin from Localhost Kitchen' },
  },
  thu: {
    breakfast: { name: 'Upma', items: ['Upma'], price: 30, image: 'images/menu/upma.jpg', alt: 'Homemade upma breakfast from Localhost Kitchen in Greater Noida' },
    lunch:     { name: 'Dal Makhani', items: ['Dal Makhani', 'Seasonal Sabzi', '4 Roti', 'Rice'], price: 70, image: 'images/menu/dal-makhani.jpg', alt: 'Homemade dal makhani lunch tiffin from Localhost Kitchen' },
    dinner:    { name: 'Aloo Tamatar', items: ['Aloo Tamatar', 'Puri', 'Raita', 'Salad'], price: 70, image: 'images/menu/aloo-tamatar-puri.jpg', alt: 'Homemade aloo tamatar with puri dinner tiffin from Localhost Kitchen' },
  },
  fri: {
    breakfast: { name: 'Poha', items: ['Poha'], price: 30, image: 'images/menu/poha.jpg', alt: 'Homemade poha breakfast from Localhost Kitchen in Greater Noida' },
    lunch:     { name: 'Dal', items: ['Dal', 'Seasonal Sabzi', '4 Roti', 'Rice'], price: 70, image: 'images/menu/dal.jpg', alt: 'Homemade dal lunch tiffin from Localhost Kitchen' },
    dinner:    { name: 'Chole', items: ['Chole', 'Jeera Pulao', '4 Roti', 'Raita'], price: 70, image: 'images/menu/chole-jeera-pulao.jpg', alt: 'Homemade chole with jeera pulao dinner tiffin from Localhost Kitchen' },
  },
  sat: {
    breakfast: { name: 'Sandwich', items: ['Sandwich'], price: 30, image: 'images/menu/sandwich.jpg', alt: 'Homemade grilled sandwich breakfast from Localhost Kitchen in Greater Noida' },
    lunch:     { name: 'Soyabean Curry', items: ['Soyabean Curry', '4 Roti', 'Rice', 'Raita'], price: 70, image: 'images/menu/soyabean-curry.jpg', alt: 'Homemade soyabean curry lunch tiffin from Localhost Kitchen' },
    dinner:    { name: 'Rajma', items: ['Rajma', '4 Roti', 'Rice', 'Raita'], price: 70, image: 'images/menu/rajma.jpg', alt: 'Homemade rajma dinner tiffin from Localhost Kitchen' },
  },
  sun: {
    breakfast: { name: 'Idli Sambar', items: ['4 Idli', 'Sambar', 'Coconut Chutney', 'Salad'], price: 70, image: 'images/menu/idli-sambar.jpg', alt: 'Homemade idli sambar Sunday brunch from Localhost Kitchen in Greater Noida', isBrunch: true },
    lunch:     null, // not confirmed yet — shown as "coming soon" rather than inventing a dish
    dinner:    { name: 'Shahi Paneer', items: ['Shahi Paneer', '4 Roti', 'Rice', 'Salad'], price: 70, image: 'images/menu/shahi-paneer.jpg', alt: 'Homemade shahi paneer dinner tiffin from Localhost Kitchen' },
  },
};

// =================================================================
// STATE
// =================================================================
let selectedPlan = null; // 'full' | 'weekday' | 'weekend'
let showcaseDay = todayDayKey();

function todayDayKey() {
  const jsDay = new Date().getDay();
  return DAYS[(jsDay + 6) % 7].key;
}
function mealMetaFor(dayKey, mealType) {
  if (dayKey === 'sun' && mealType === 'breakfast') return SUNDAY_BRUNCH_META;
  return MEAL_META[mealType];
}
function todayISO() {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d - tz).toISOString().slice(0, 10);
}
function formatDatePretty(iso) {
  if (!iso) return '';
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function dayKeyFromDate(dateObj) {
  return DAYS[(dateObj.getDay() + 6) % 7].key;
}
// one month forward from a start date, minus a day, for a clean inclusive "1 month" window
function oneMonthEndISO(startISO) {
  const d = new Date(startISO + 'T00:00:00');
  d.setMonth(d.getMonth() + 1);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}
function matchingDaysInRange(startISO, endISO, planKey) {
  const start = new Date(startISO + 'T00:00:00');
  const end = new Date(endISO + 'T00:00:00');
  const daySet = new Set(PLANS[planKey].days);
  let count = 0;
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (daySet.has(dayKeyFromDate(d))) count++;
  }
  return count;
}

// =================================================================
// THIS WEEK'S MENU — read-only showcase (no cart, no add buttons)
// =================================================================
function mealRowHTML(dayKey, dayFull, mealType, dish) {
  const meta = mealMetaFor(dayKey, mealType);
  if (!dish) {
    return `
      <div class="meal-row meal-row--empty">
        <div class="meal-row-thumb"><span>${meta.emoji}</span></div>
        <div class="meal-row-body">
          <span class="meal-badge">${meta.emoji} ${meta.label}</span>
          <h3>Menu details coming soon</h3>
          <p class="meal-row-time">${meta.time}</p>
        </div>
      </div>`;
  }
  return `
    <div class="meal-row">
      <div class="meal-row-thumb">
        <div class="meal-row-fallback"><span>${meta.emoji}</span></div>
        <img src="${dish.image}" alt="${dish.alt}" loading="lazy" width="120" height="120"
             onload="this.classList.add('is-loaded')" onerror="this.remove()">
      </div>
      <div class="meal-row-body">
        <span class="meal-badge">${meta.emoji} ${meta.label}</span>
        <h3>${dish.name}</h3>
        <p class="meal-row-items">${dish.items.join(' · ')}</p>
        <p class="meal-row-time">${meta.time}</p>
      </div>
      <span class="meal-row-price">₹${dish.price}</span>
    </div>`;
}

function renderShowcaseTabs() {
  const wrap = document.getElementById('showcaseTabs');
  if (!wrap) return;
  wrap.innerHTML = DAYS.map(d => `
    <button type="button" class="showcase-tab ${d.key === showcaseDay ? 'is-active' : ''}" data-day="${d.key}">${d.label}</button>
  `).join('');
}

function renderShowcaseBody() {
  const body = document.getElementById('showcaseBody');
  if (!body) return;
  const day = DAYS.find(d => d.key === showcaseDay);
  const dayData = menuData[day.key];
  body.innerHTML = `
    <h3 class="showcase-day-title">${day.full}${day.key === todayDayKey() ? ' <span class="today-tag">Today</span>' : ''}</h3>
    ${['breakfast', 'lunch', 'dinner'].map(m => mealRowHTML(day.key, day.full, m, dayData[m])).join('')}
  `;
}

function setShowcaseDay(key) {
  showcaseDay = key;
  document.querySelectorAll('.showcase-tab').forEach(t => t.classList.toggle('is-active', t.dataset.day === key));
  renderShowcaseBody();
}

// shows a "X% OFF" badge on any plan card whose discount (in PLAN_DISCOUNTS) is above 0
function renderPlanDiscountBadges() {
  document.querySelectorAll('.plan-card').forEach(card => {
    const pct = PLAN_DISCOUNTS[card.dataset.plan] || 0;
    let badge = card.querySelector('.plan-discount-badge');
    if (pct > 0) {
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'plan-discount-badge';
        card.appendChild(badge);
      }
      badge.textContent = `${pct}% OFF`;
    } else if (badge) {
      badge.remove();
    }
  });
}

// =================================================================
// STEP 1 — PLAN SELECTION
// =================================================================
function selectPlan(planKey) {
  selectedPlan = planKey;
  document.querySelectorAll('.plan-card').forEach(c => c.classList.toggle('is-active', c.dataset.plan === planKey));

  document.getElementById('subscribeCard').dataset.locked = 'false';
  document.getElementById('subscribeLockHint').hidden = true;
  document.getElementById('subscribePlanName').textContent = `${PLANS[planKey].label} · ${PLANS[planKey].days.length} days/week`;

  updateEstimate();
  document.getElementById('subscribe').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// =================================================================
// STEP 2 — DATE, PEOPLE, ESTIMATE
// =================================================================
let people = 1;

function initDateInput() {
  const startInput = document.getElementById('startDate');
  startInput.min = todayISO();
}

function updateEstimate() {
  const startInput = document.getElementById('startDate');
  const box = document.getElementById('estimateBox');
  document.getElementById('peopleCount').textContent = people;

  if (!selectedPlan || !startInput.value) {
    box.hidden = true;
    return;
  }
  const endISO = oneMonthEndISO(startInput.value);
  const days = matchingDaysInRange(startInput.value, endISO, selectedPlan);
  const subtotal = days * DAILY_RATE * people;
  const discountPct = PLAN_DISCOUNTS[selectedPlan] || 0;
  const discountAmount = Math.round(subtotal * discountPct / 100);
  const total = subtotal - discountAmount;

  document.getElementById('estDays').textContent = days;

  const subtotalRow = document.getElementById('estSubtotalRow');
  const discountRow = document.getElementById('estDiscountRow');
  if (discountPct > 0) {
    subtotalRow.hidden = false;
    discountRow.hidden = false;
    document.getElementById('estSubtotal').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    document.getElementById('estDiscount').textContent = `− ₹${discountAmount.toLocaleString('en-IN')} (${discountPct}%)`;
  } else {
    subtotalRow.hidden = true;
    discountRow.hidden = true;
  }

  document.getElementById('estTotal').textContent = `₹${total.toLocaleString('en-IN')}`;
  box.hidden = false;
}

// =================================================================
// SWIPE-TO-CONFIRM → WHATSAPP
// =================================================================
const swipeTrack = document.getElementById('swipeTrack');
const swipeFill = document.getElementById('swipeFill');
const swipeThumb = document.getElementById('swipeThumb');
const swipeLabel = document.getElementById('swipeLabel');

function getSwipeMax() {
  if (!swipeTrack || !swipeThumb) return 0;
  return swipeTrack.getBoundingClientRect().width - swipeThumb.offsetWidth - 10;
}
function setSwipePosition(px) {
  if (!swipeTrack || !swipeThumb || !swipeFill) return 0;
  const max = getSwipeMax();
  const clamped = Math.max(5, Math.min(px, max + 5));
  swipeThumb.style.left = `${clamped}px`;
  swipeFill.style.width = `${clamped + swipeThumb.offsetWidth / 2}px`;
  return clamped;
}
function resetSwipe() {
  if (!swipeTrack) return;
  swipeTrack.classList.remove('is-confirmed');
  if (swipeLabel) swipeLabel.textContent = 'Swipe to confirm →';
  setSwipePosition(5);
}
function confirmSwipe() {
  showFormError('subscribeError', '');
  const startInput = document.getElementById('startDate');

  if (!selectedPlan) { showFormError('subscribeError', 'Please choose a plan first.'); return; }
  if (!startInput.value) { showFormError('subscribeError', 'Please choose a start date.'); resetSwipe(); return; }

  setSwipePosition(getSwipeMax() + 5);
  swipeTrack.classList.add('is-confirmed');
  swipeLabel.textContent = 'Confirmed! Opening WhatsApp…';

  setTimeout(() => {
    const endISO = oneMonthEndISO(startInput.value);
    const days = matchingDaysInRange(startInput.value, endISO, selectedPlan);
    const subtotal = days * DAILY_RATE * people;
    const discountPct = PLAN_DISCOUNTS[selectedPlan] || 0;
    const discountAmount = Math.round(subtotal * discountPct / 100);
    const total = subtotal - discountAmount;

    const lines = [
      'Hello Localhost Kitchen 👋',
      '',
      'I want to start a tiffin subscription.',
      '',
      `Plan: ${PLANS[selectedPlan].label} (${PLANS[selectedPlan].days.length} days/week)`,
      `Start Date: ${formatDatePretty(startInput.value)}`,
      `Number of People: ${people}`,
      '',
      `Estimated Tiffin Days (1 month): ${days}`,
      ...(discountPct > 0 ? [
        `Subtotal: ₹${subtotal.toLocaleString('en-IN')}`,
        `Discount (${discountPct}%): − ₹${discountAmount.toLocaleString('en-IN')}`,
      ] : []),
      `Estimated Total: ₹${total.toLocaleString('en-IN')}`,
      '',
      'Please confirm final pricing and delivery details.',
      'Thank you!',
    ].join('\n');

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`, '_blank');
    setTimeout(resetSwipe, 400);
  }, 450);
}

if (swipeTrack && swipeThumb) {
  let dragging = false, startX = 0, thumbStartLeft = 5;

  swipeThumb.addEventListener('pointerdown', (e) => {
    dragging = true;
    startX = e.clientX;
    thumbStartLeft = parseFloat(swipeThumb.style.left) || 5;
    swipeThumb.setPointerCapture(e.pointerId);
  });
  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const newLeft = setSwipePosition(thumbStartLeft + dx);
    if (newLeft >= getSwipeMax()) { dragging = false; confirmSwipe(); }
  });
  window.addEventListener('pointerup', () => {
    if (!dragging) return;
    dragging = false;
    const current = parseFloat(swipeThumb.style.left) || 5;
    if (current < getSwipeMax() * 0.9) setSwipePosition(5);
  });
  swipeThumb.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); confirmSwipe(); }
  });
}

function showFormError(elId, message) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = message;
  el.hidden = !message;
}
function validatePhone(value) {
  return /^(?:\+91[\s-]?)?[6-9]\d{9}$/.test(value.replace(/\s/g, ''));
}

// =================================================================
// BULK / CORPORATE ENQUIRY (unchanged flow, own WhatsApp message)
// =================================================================
function buildBulkWhatsAppMessage(data) {
  return [
    'Hello Localhost Kitchen 👋',
    '',
    'I have a bulk / corporate order enquiry.',
    '',
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Company / Organization: ${data.company || '-'}`,
    `Number of People: ${data.people}`,
    `Required Date: ${data.date}`,
    `Meal Type: ${data.meals.length ? data.meals.join(', ') : '-'}`,
    `Other Requirement: ${data.other || '-'}`,
    `Message: ${data.message || '-'}`,
    '',
    'Please get back to me with availability and pricing.',
    'Thank you!',
  ].join('\n');
}

function handleSendBulkEnquiry() {
  showFormError('bulkFormError', '');
  const name = document.getElementById('bulkName').value.trim();
  const phone = document.getElementById('bulkPhone').value.trim();
  const company = document.getElementById('bulkCompany').value.trim();
  const peopleVal = document.getElementById('bulkPeople').value.trim();
  const date = document.getElementById('bulkDate').value;
  const other = document.getElementById('bulkOther').value.trim();
  const message = document.getElementById('bulkMessage').value.trim();
  const meals = Array.from(document.querySelectorAll('input[name="bulkMeal"]:checked')).map(el => el.value);

  if (!name) return showFormError('bulkFormError', 'Please enter your name.');
  if (!phone) return showFormError('bulkFormError', 'Please enter your phone number.');
  if (!validatePhone(phone)) return showFormError('bulkFormError', 'Please enter a valid 10-digit mobile number.');
  if (!peopleVal || Number(peopleVal) < 1) return showFormError('bulkFormError', 'Please enter the number of people.');
  if (!date) return showFormError('bulkFormError', 'Please select the required date.');

  const text = buildBulkWhatsAppMessage({ name, phone, company, people: peopleVal, date, other, message, meals });
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
}

// =================================================================
// EVENT WIRING
// =================================================================
document.addEventListener('click', (e) => {
  const tab = e.target.closest('.showcase-tab');
  if (tab) { setShowcaseDay(tab.dataset.day); return; }

  const planBtn = e.target.closest('.plan-card');
  if (planBtn) { selectPlan(planBtn.dataset.plan); return; }
});

document.getElementById('startDate')?.addEventListener('change', () => {
  const hint = document.getElementById('dateHint');
  hint.textContent = "Past dates can't be selected.";
  hint.classList.remove('is-error');
  updateEstimate();
});

document.getElementById('peopleMinus')?.addEventListener('click', () => {
  if (people > 1) { people -= 1; updateEstimate(); }
});
document.getElementById('peoplePlus')?.addEventListener('click', () => {
  people += 1; updateEstimate();
});

document.getElementById('requestBulkBtn')?.addEventListener('click', () => {
  const form = document.getElementById('bulkForm');
  form.hidden = !form.hidden;
  if (!form.hidden) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
document.getElementById('sendBulkBtn')?.addEventListener('click', handleSendBulkEnquiry);

// mobile nav (same X-animation pattern as the rest of the site)
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// =================================================================
// INIT
// =================================================================
renderShowcaseTabs();
renderShowcaseBody();
initDateInput();
renderPlanDiscountBadges();