// =============================================================
// Localhost: Kitchen — site behaviour
// =============================================================

// --- 1. Mobile nav toggle -------------------------------------
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // close menu after tapping a link (mobile)
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// --- 2. Footer year --------------------------------------------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// --- 3. Swiggy à la carte menu -----------------------------------
// EDIT ME: paste your real Swiggy restaurant page link below.
const SWIGGY_URL = "https://www.swiggy.com/"; // <-- replace with your store URL

const swiggyMenu = [
  { name: "Rajma Thali", items: ["4 soft whole wheat phulka", "Fresh garden salad", "Lemon & pickle"], price: "₹89" },
  { name: "Rajma with Jeera Rice", items: ["Jeera rice", "Fresh garden salad", "Lemon & pickle"], price: "₹89" },
  { name: "Punjabi Chole (Puri)", items: ["6 puffy golden puri", "Fresh garden salad", "Lemon & pickle"], price: "₹99" },
  { name: "Punjabi Chole Bhature", items: ["2 large fluffy bhature", "Fresh garden salad", "Lemon & pickle"], price: "₹119" },
  { name: "Punjabi Chole with Rice", items: ["Jeera rice", "Fresh garden salad", "Lemon & pickle"], price: "₹89" },
  { name: "Shahi Paneer Thali", items: ["Jeera rice, roti (2)", "Raita & papad", "Fresh garden salad"], price: "₹109" },
  { name: "Aloo Pyaaz Paratha", items: ["Dahi", "Onion salad", "Green chutney"], price: "₹89" },
  { name: "Paneer Pyaaz Paratha", items: ["Dahi", "Onion salad", "Green chutney"], price: "₹99" },
];

const swiggyGrid = document.getElementById('swiggyGrid');
if (swiggyGrid) {
  swiggyMenu.forEach((dish, i) => {
    const card = document.createElement('div');
    card.className = 'swiggy-card';
    card.innerHTML = `
      <span class="num">${i + 1}</span>
      <h4>${dish.name}</h4>
      <ul>${dish.items.map(it => `<li>${it}</li>`).join('')}</ul>
      <span class="price">${dish.price}</span>
    `;
    swiggyGrid.appendChild(card);
  });
}

const swiggyLink = document.getElementById('swiggyLink');
if (swiggyLink) swiggyLink.href = SWIGGY_URL;

// =================================================================
// 4. Generic modal system  (used by day-detail popup + enquiry form)
// =================================================================
function openModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}
// open triggers: any element with [data-open-modal="modalId"]
document.querySelectorAll('[data-open-modal]').forEach(el => {
  el.addEventListener('click', () => openModal(el.getAttribute('data-open-modal')));
});
// close triggers: [data-close-modal] buttons + clicking the dark backdrop + Escape key
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal(overlay.id);
  });
  overlay.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(overlay.id));
  });
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(o => closeModal(o.id));
  }
});

// =================================================================
// 5. Weekly menu roadmap — Candy-Crush style level map
// =================================================================
const weekMenu = [
  { key: 'mon', label: 'Monday', full: 'Monday',    icon: '🫘', image: 'images/Monday_MENU.png',    lunch: ['Chole', '4 Roti', 'Rice', 'Salad'],                    dinner: ['Dal Makhani', 'Seasonal Sabzi', '4 Roti', 'Rice'] },
  { key: 'tue', label: 'Tuesday', full: 'Tuesday',   icon: '🍛', image: 'images/Tuesday_Menu.png',   lunch: ['Kadhi Pakora', '4 Roti', 'Rice', 'Salad'],             dinner: ['Soyabean Curry', '4 Roti', 'Rice', 'Raita'] },
  { key: 'wed', label: 'Wednesday', full: 'Wednesday', icon: '🍚', image: 'images/Wednesday_Menu.png', lunch: ['Rajma', '4 Roti', 'Rice', 'Raita'],                    dinner: ['Dal Tadka', 'Seasonal Sabzi', '4 Roti', 'Rice'] },
  { key: 'thu', label: 'Thursday', full: 'Thursday',  icon: '🥘', image: 'images/Thursday_Menu.png',  lunch: ['Dal Makhani', 'Seasonal Sabzi', '4 Roti', 'Rice'],     dinner: ['Aloo Tamatar', '6 Puri', 'Raita', 'Salad'] },
  { key: 'fri', label: 'Friday', full: 'Friday',    icon: '🍲', image: 'images/Friday_Menu.png',    lunch: ['Dal', 'Seasonal Sabzi', '4 Roti', 'Rice'],             dinner: ['Chole', 'Jeera Pulao', 'Salad', 'Raita'] },
  { key: 'sat', label: 'Saturday', full: 'Saturday',  icon: '🍜', image: 'images/Saturday_Menu.png',  lunch: ['Soyabean Curry', '4 Roti', 'Rice', 'Raita'],           dinner: ['Rajma', '4 Roti', 'Rice', 'Salad'] },
  { key: 'sun', label: 'Sunday', full: 'Sunday',    icon: '🥞', image: 'images/Sunday_Menu.png',    lunch: ['Idli', 'Sambar', 'Coconut Chutney'],                   dinner: ['Shahi Paneer', '4 Roti', 'Rice', 'Salad'] },
];

const roadmapWrap = document.getElementById('roadmapWrap');
const roadmapNodesEl = document.getElementById('roadmapNodes');
const trailPath = document.getElementById('trailPath');

if (roadmapWrap && roadmapNodesEl && trailPath) {
  // JS getDay(): 0=Sun..6=Sat -> convert so Monday=0 .. Sunday=6 (matches weekMenu order)
  const todayIndex = (new Date().getDay() + 6) % 7;

  const pathLength = trailPath.getTotalLength();
  const viewBoxW = 340, viewBoxH = 1400;

  // set up the "draw the trail" animation using the path's real length
  // (inline styles beat CSS specificity, so we drive both start and end state from JS)
  trailPath.style.strokeDasharray = `${pathLength}`;
  trailPath.style.strokeDashoffset = `${pathLength}`;

  // total stops = start flag + 7 days + finish trophy
  const totalStops = weekMenu.length + 2;

  const stopsHTML = [];

  for (let i = 0; i < totalStops; i++) {
    const distance = (i / (totalStops - 1)) * pathLength;
    const pt = trailPath.getPointAtLength(distance);
    const leftPct = (pt.x / viewBoxW) * 100;
    const topPct = (pt.y / viewBoxH) * 100;

    if (i === 0) {
      // start flag
      stopsHTML.push(`
        <div class="roadmap-node is-endpoint reveal" style="left:${leftPct}%; top:${topPct}%;" tabindex="-1">
          <div class="node-circle" aria-hidden="true">🚩</div>
          <span class="node-label">Start</span>
        </div>`);
      continue;
    }
    if (i === totalStops - 1) {
        stopsHTML.push(`
            <a href="https://www.instagram.com/localhost.kitchen?igsh=dzM3dndobXN5OWhl"
            target="_blank"
            rel="noopener noreferrer"
            class="roadmap-node is-endpoint is-finish reveal"
            style="left:${leftPct}%; top:${topPct}%;">
            
            <div class="node-circle" aria-hidden="true">📸</div>
            <span class="node-label">Follow us on Instagram</span>

            </a>`);
        continue;
        }

    const dayIdx = i - 1; // 0..6 within weekMenu
    const day = weekMenu[dayIdx];
    let statusClass = 'is-upcoming';
    if (dayIdx < todayIndex) statusClass = 'is-completed';
    if (dayIdx === todayIndex) statusClass = 'is-today';

    stopsHTML.push(`
      <button type="button" class="roadmap-node ${statusClass} reveal" style="left:${leftPct}%; top:${topPct}%;" data-day="${day.key}">
        <div class="node-circle" aria-hidden="true">${day.icon}</div>
        <span class="node-label">${day.label}</span>
      </button>`);
  }

  roadmapNodesEl.innerHTML = stopsHTML.join('');

  // wire up day nodes -> open modal with that day's full menu
  roadmapNodesEl.querySelectorAll('[data-day]').forEach(btn => {
    btn.addEventListener('click', () => {
      const day = weekMenu.find(d => d.key === btn.getAttribute('data-day'));
      if (!day) return;
      const content = document.getElementById('dayModalContent');
      content.innerHTML = `
        <div class="day-modal-image">
          <div class="day-modal-image-fallback"><span>${day.icon}</span><small>${day.full} Thali</small></div>
          <img src="${day.image}" alt="${day.full} thali" loading="lazy"
               onload="this.classList.add('is-loaded')" onerror="this.remove()">
        </div>
        <div class="day-modal-head">
          <span class="day-modal-icon">${day.icon}</span>
          <div>
            <p class="day-modal-tag">${day.key === weekMenu[todayIndex].key ? "Today's menu" : day.full}</p>
            <h3>${day.full}</h3>
          </div>
        </div>
        <div class="day-modal-meal">
          <h4>☀️ Lunch · 1:00–2:00 PM</h4>
          <ul>${day.lunch.map(i => `<li>${i}</li>`).join('')}</ul>
        </div>
        <div class="day-modal-meal">
          <h4>🌙 Dinner · 9:00–10:00 PM</h4>
          <ul>${day.dinner.map(i => `<li>${i}</li>`).join('')}</ul>
        </div>
        <div class="day-modal-cta">
          <button type="button" class="btn btn-primary" data-wa-order="Hi! I'd like to order the ${day.full} tiffin (lunch &amp; dinner).">
            Order ${day.full}'s tiffin
          </button>
        </div>
      `;
      openModal('dayModal');
      // newly injected [data-wa-order] button needs its click handler wired
      wireOrderButtons();
    });
  });

  // draw the trail path once it scrolls into view
  const trailObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        roadmapWrap.classList.add('draw');
        trailPath.style.strokeDashoffset = '0';
        trailObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  trailObserver.observe(roadmapWrap);

  // auto-scroll the map so today's stop is nicely in view the first time it appears
  const todayNode = roadmapNodesEl.querySelector('.is-today');
  if (todayNode) {
    const focusObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            todayNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 400);
          focusObserver.disconnect();
        }
      });
    }, { threshold: 0.4 });
    focusObserver.observe(roadmapWrap);
  }
}

// =================================================================
// 6. Scroll-reveal for cards across the page (staggered pop-in)
// =================================================================
document.querySelectorAll('.feature, .plan-card, .swiggy-card, .roadmap-node').forEach(el => {
  el.classList.add('reveal');
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const siblingIndex = Array.prototype.indexOf.call(el.parentElement.children, el);
      el.style.transitionDelay = `${Math.min(siblingIndex * 70, 560)}ms`;
      el.classList.add('in-view');
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.15 });

// observe static cards immediately, and roadmap nodes (added dynamically) right after creation
document.querySelectorAll('.feature, .plan-card, .swiggy-card').forEach(el => revealObserver.observe(el));
document.querySelectorAll('.roadmap-node').forEach(el => revealObserver.observe(el));

// =================================================================
// 7. Enquiry form → Google Sheet (with WhatsApp fallback)
// =================================================================
// EDIT ME: deploy the Apps Script in "google-apps-script.gs" as a Web App
// and paste the resulting /exec URL below. See GOOGLE_SHEET_SETUP.md for steps.
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwVTNlYDFoOMfld-HqwZa9Jb-pllALQfX3BzXXhg7uyTbzwbQZEowlJ94v6gRZNtsHt/exec";

const enquiryForm = document.getElementById('enquiryForm');
if (enquiryForm) {
  enquiryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const submitBtn = document.getElementById('enquirySubmitBtn');
    const status = document.getElementById('formStatus');
    const data = new FormData(form);

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    status.textContent = '';
    status.classList.remove('success');

    try {
      if (!GOOGLE_SHEET_URL || GOOGLE_SHEET_URL.includes('PASTE_YOUR')) {
        throw new Error('sheet-not-configured');
      }
      const params = new URLSearchParams();
      for (const [key, value] of data.entries()) params.append(key, value);

      // Apps Script web apps don't return usable CORS headers for reading the
      // response from the browser, so we fire in "no-cors" mode and treat a
      // resolved (non-throwing) fetch as success.
      await fetch(GOOGLE_SHEET_URL, { method: 'POST', mode: 'no-cors', body: params });

      status.textContent = "Thanks! We've received your enquiry and will reach out on WhatsApp shortly.";
      status.classList.add('success');
      form.reset();
      setTimeout(() => closeModal('enquiryModal'), 2600);
    } catch (err) {
      // Fallback: never let an enquiry get lost — hand it straight to WhatsApp.
      const text = [
        "Hi! I'd like to enquire about Tefin Tiffin.",
        `Name: ${data.get('name') || '-'}`,
        `Phone: ${data.get('phone') || '-'}`,
        `Locality: ${data.get('locality') || '-'}`,
        `Interested in: ${data.get('mealPreference') || '-'}`,
        `Message: ${data.get('message') || '-'}`,
      ].join('\n');
      status.textContent = 'Opening WhatsApp to complete your enquiry…';
      window.open(`https://wa.me/917428662683?text=${encodeURIComponent(text)}`, '_blank');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Enquiry';
    }
  });
}

// =================================================================
// 8. Swipe-to-confirm order flow
// =================================================================
// Any button/link with [data-wa-order="message text"] opens this modal
// instead of jumping straight to WhatsApp — the customer has to swipe
// (or press Enter on the thumb) to confirm before the chat opens.
const WHATSAPP_NUMBER = '917428662683';
let pendingOrderMessage = '';

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
  if (!swipeTrack) return;
  setSwipePosition(getSwipeMax() + 5);
  swipeTrack.classList.add('is-confirmed');
  if (swipeLabel) swipeLabel.textContent = 'Confirmed! Opening WhatsApp…';
  setTimeout(() => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(pendingOrderMessage)}`;
    window.open(url, '_blank');
    closeModal('confirmOrderModal');
    setTimeout(resetSwipe, 350);
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
  // keyboard users: Enter / Space confirms directly (no drag needed)
  swipeThumb.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); confirmSwipe(); }
  });
}

function openConfirmOrder(message) {
  pendingOrderMessage = message;
  const summary = document.getElementById('confirmSummary');
  if (summary) summary.textContent = `“${message}”`;
  resetSwipe();
  openModal('confirmOrderModal');
}

function wireOrderButtons() {
  document.querySelectorAll('[data-wa-order]').forEach(btn => {
    if (btn.dataset.waWired) return;
    btn.dataset.waWired = 'true';
    btn.addEventListener('click', () => openConfirmOrder(btn.getAttribute('data-wa-order')));
  });
}
wireOrderButtons();

// =================================================================
// 9. Google Reviews carousel — slide (scroll-snap), focus + zoom
// =================================================================
// EDIT ME: these are PLACEHOLDER reviews so the carousel has something to
// show. Replace every entry below with the real text from your Google
// Business Profile reviews before publishing — do not leave fake reviews live.
const reviewsData = [
  { name: 'Somwati Davi', time: '', rating: 5, text: 'Quality of food is good.' },
  { name: 'Ayush K. (Working Professional)', time: '', rating: 5, text: 'Finally found homemade food in Greater Noida that actually tastes like home!' },
  { name: 'Priya M', time: '', rating: 5, text: 'Fresh food, good quantity, and always delivered on time.' },
  { name: 'Diwakar Yadav', time: '', rating: 5, text: 'Had a great experience.' },
  { name: 'Aman K.', time: '', rating: 5, text: 'Best tiffin service I have tried, simple, tasty, and worth every rupee.' },
  { name: 'Neha Singh', time: '', rating: 5, text: 'The food quality is excellent, the packaging is neat, and the taste reminds me of home. Ordering through WhatsApp is simple, and the customer service is always responsive. One of the best vegetarian tiffin services in Greater Noida.' },
  { name: 'Rohit Kumar', time: '', rating: 5, text: 'Finding good homemade food near Delta 1 was not easy until I found Localhost Kitchen. Fresh ingredients, hygienic cooking, affordable pricing, and a weekly changing menu make it my first choice for daily meals.' },
  { name: 'Ankit T', time: '', rating: 5, text: 'I work from home, so cooking every day became difficult. Localhost Kitchen solved that problem. Good quantity, simple homemade taste, and the WhatsApp ordering process is really easy. Worth the money⭐⭐.' },
  { name: 'Harsh kumar', time: '', rating: 5, text: 'Paste your real Google review text here.' },
  { name: 'Puneet Yadav', time: '', rating: 5, text: 'I really love the food here😋☺️.' },
];

const reviewsTrack = document.getElementById('reviewsTrack');
const reviewsDotsEl = document.getElementById('reviewsDots');
const reviewsPrevBtn = document.getElementById('reviewsPrev');
const reviewsNextBtn = document.getElementById('reviewsNext');

if (reviewsTrack && reviewsDotsEl) {
  reviewsTrack.innerHTML = reviewsData.map((r) => `
    <div class="review-card">
      <div class="review-card-head">
        <div class="review-avatar">${(r.name || '?').trim().charAt(0).toUpperCase()}</div>
        <div>
          <div class="review-name">${r.name}</div>
          ${r.time ? `<div class="review-time">${r.time}</div>` : ''}
        </div>
      </div>
      <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
      <p class="review-text">${r.text}</p>
      <div class="review-google">
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.85z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.98 10.98 0 0 0 12 1a11 11 0 0 0-9.82 6.05l3.66 2.85C6.71 7.3 9.14 5.38 12 5.38z"/></svg>
        Posted on Google
      </div>
    </div>
  `).join('');

  const cards = Array.from(reviewsTrack.querySelectorAll('.review-card'));
  reviewsDotsEl.innerHTML = cards.map((_, i) => `<button type="button" class="dot" data-index="${i}" aria-label="Go to review ${i + 1}"></button>`).join('');
  const dots = Array.from(reviewsDotsEl.querySelectorAll('.dot'));

  function setActiveReview(index) {
    cards.forEach((c, i) => c.classList.toggle('is-active', i === index));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
  }
  function goToReview(index) {
    const clamped = Math.max(0, Math.min(index, cards.length - 1));
    const card = cards[clamped];
    const trackRect = reviewsTrack.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    // scroll only the track's own horizontal axis — never touches page scroll,
    // which is what was causing the page to jump back to this section
    const targetLeft = reviewsTrack.scrollLeft + (cardRect.left - trackRect.left) - (trackRect.width - cardRect.width) / 2;
    reviewsTrack.scrollTo({ left: targetLeft, behavior: 'smooth' });
  }
  function currentReviewIndex() {
    const i = cards.findIndex(c => c.classList.contains('is-active'));
    return i === -1 ? 0 : i;
  }

  // detect the centred card as the user swipes/scrolls (native touch swipe)
  let scrollSettleTimer;
  reviewsTrack.addEventListener('scroll', () => {
    clearTimeout(scrollSettleTimer);
    scrollSettleTimer = setTimeout(() => {
      const trackRect = reviewsTrack.getBoundingClientRect();
      const centerX = trackRect.left + trackRect.width / 2;
      let closest = 0, closestDist = Infinity;
      cards.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const dist = Math.abs((r.left + r.width / 2) - centerX);
        if (dist < closestDist) { closestDist = dist; closest = i; }
      });
      setActiveReview(closest);
    }, 80);
  }, { passive: true });

  dots.forEach(d => d.addEventListener('click', () => goToReview(parseInt(d.dataset.index, 10))));
  if (reviewsPrevBtn) reviewsPrevBtn.addEventListener('click', () => goToReview(currentReviewIndex() - 1));
  if (reviewsNextBtn) reviewsNextBtn.addEventListener('click', () => goToReview(currentReviewIndex() + 1));

  setActiveReview(0);

  // gentle autoplay — only while the reviews section is actually visible,
  // so it never yanks the page back down after someone scrolls away
  let autoplayTimer = null;
  function startAutoplay() {
    if (autoplayTimer) return;
    autoplayTimer = setInterval(() => goToReview((currentReviewIndex() + 1) % cards.length), 1200);
  }
  function stopAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

  const reviewsSection = document.getElementById('reviews');
  if (reviewsSection) {
    const visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && document.visibilityState === 'visible') startAutoplay();
        else stopAutoplay();
      });
    }, { threshold: 0.4 });
    visibilityObserver.observe(reviewsSection);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') stopAutoplay();
  });
  reviewsTrack.addEventListener('pointerdown', stopAutoplay, { once: true });
}

// =================================================================
// 10. Launch-offer countdown (8% weekly / 15% monthly discount)
// =================================================================
// EDIT ME: set this to the real end date/time of your promo, in IST.
// When this passes, the countdown hides itself and BOTH plan cards
// automatically revert to their normal (non-discounted) price — so the
// site never shows a "time's running out" countdown that doesn't mean
// anything.
const PROMO_END = new Date('2026-07-31T23:59:59+05:30');

function endPromo() {
  const banner = document.getElementById('promoBanner');
  if (banner) banner.classList.add('is-ended');
  document.querySelectorAll('.promo-price, .discount-badge').forEach(el => { el.style.display = 'none'; });
  document.querySelectorAll('.plan-price-original').forEach(el => el.classList.add('is-fallback'));
}

function tickPromoCountdown() {
  const banner = document.getElementById('promoBanner');
  if (!banner) return;
  const diff = PROMO_END - new Date();
  if (diff <= 0) {
    endPromo();
    clearInterval(promoTimer);
    return;
  }
  const pad = n => String(n).padStart(2, '0');
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  const dEl = document.getElementById('cdDays');
  const hEl = document.getElementById('cdHours');
  const mEl = document.getElementById('cdMins');
  const sEl = document.getElementById('cdSecs');
  if (dEl) dEl.textContent = pad(days);
  if (hEl) hEl.textContent = pad(hours);
  if (mEl) mEl.textContent = pad(mins);
  if (sEl) sEl.textContent = pad(secs);
}

let promoTimer = null;
if (document.getElementById('promoBanner')) {
  tickPromoCountdown();
  promoTimer = setInterval(tickPromoCountdown, 1000);
}

// =================================================================
// 11. Enquiry modal presets — used by the discount "Claim" buttons and
//     the Bulk/Corporate/Party "Enquire" buttons to capture the
//     visitor's info (name/phone/locality) for that specific request.
// =================================================================
function openEnquiryPreset(optionText, message) {
  const form = document.getElementById('enquiryForm');
  if (form) {
    const select = form.querySelector('select[name="mealPreference"]');
    if (select) {
      const match = Array.from(select.options).find(o => o.value === optionText);
      if (match) select.value = match.value;
    }
    const textarea = form.querySelector('textarea[name="message"]');
    if (textarea && message) textarea.value = message;
  }
  openModal('enquiryModal');
}

function wireEnquiryPresetButtons() {
  document.querySelectorAll('[data-enquiry-preset]').forEach(btn => {
    if (btn.dataset.enquiryWired) return;
    btn.dataset.enquiryWired = 'true';
    btn.addEventListener('click', () => {
      openEnquiryPreset(btn.getAttribute('data-enquiry-preset'), btn.getAttribute('data-enquiry-message') || '');
    });
  });
}
wireEnquiryPresetButtons();