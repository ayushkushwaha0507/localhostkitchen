// =============================================================
// Localhost: Kitchen — FAQ page behaviour
// =============================================================

// --- 0. FAQ DATA ------------------------------------------------
// One place to edit questions/answers/categories. `popular: true`
// surfaces a question in the "Popular Questions" sidebar list.
const faqData = [
  { id: 'what-is-localhost-kitchen', category: 'general', popular: true,
    q: 'What is Localhost Kitchen?',
    a: "Localhost Kitchen is a homemade vegetarian tiffin service based in Delta 1, Greater Noida. We cook fresh lunch and dinner every day using simple, home-style recipes — the kind of food you'd expect from your own kitchen, not a restaurant. Our goal is to give students, working professionals and families access to healthy, homemade food without the effort of cooking daily. Every tiffin is prepared fresh, packed hygienically, and delivered on time." },

  { id: 'where-located', category: 'general',
    q: 'Where is Localhost Kitchen located?',
    a: "We're based in Delta 1, Greater Noida, Uttar Pradesh. Our kitchen operates as a cloud kitchen focused entirely on tiffin service — we don't have a dine-in restaurant, so all our energy goes into cooking and delivering fresh homemade food. Being centrally located in Delta 1 lets us reach nearby sectors quickly while the food is still hot and fresh." },

  { id: 'delivery-areas', category: 'delivery',
    q: 'Which areas do you deliver in Greater Noida?',
    a: "We currently deliver across Delta 1, Alpha 1, Beta 1, Gamma 1, Knowledge Park and other nearby areas in Greater Noida. If you're just outside these zones, message us on WhatsApp with your location — we're steadily expanding our delivery radius and may already be able to reach you." },

  { id: 'timings', category: 'delivery',
    q: 'What are your lunch and dinner timings?',
    a: "We deliver lunch and dinner daily, timed to reach you while the food is still fresh and warm. Lunch tiffins go out around midday and dinner tiffins in the evening, so you don't have to worry about cooking after a long day at work or college. Need a specific delivery window for your office or PG? Let us know on WhatsApp." },

  { id: 'meal-cost', category: 'pricing', popular: true,
    q: 'How much does one meal cost?',
    a: "A single meal starts at just ₹70, which typically includes roti, sabzi, dal or rajma-style curry, rice and a salad or raita — a complete, home-style thali. If you order regularly, our monthly subscription works out even more affordable per meal." },

  { id: 'monthly-subscription', category: 'pricing', popular: true,
    q: 'What is included in the ₹3570 monthly subscription?',
    a: "Our monthly subscription is ₹3570 and covers a full month of lunch and dinner tiffins, cooked fresh daily with a rotating homestyle menu. It's built for people who eat with us regularly — students, PG residents and working professionals — who want the convenience of not thinking about meals every day." },

  { id: 'single-meal-order', category: 'delivery',
    q: 'Can I order only one meal?',
    a: "Yes, absolutely. You don't need to subscribe monthly to eat with us — you can order a single lunch or dinner tiffin for ₹70 onwards whenever you like. Many customers start with a one-off order to try our food before moving to a weekly or monthly plan." },

  { id: 'freshly-prepared', category: 'quality',
    q: 'Is the food freshly prepared every day?',
    a: "Yes, everything is cooked fresh every single day — we don't believe in pre-cooking or freezing meals for later. Our kitchen prepares lunch and dinner separately each day using fresh ingredients, so what reaches you is genuinely homemade food, not reheated leftovers." },

  { id: 'vegetarian', category: 'quality', popular: true,
    q: 'Is your food 100% vegetarian?',
    a: "Yes, Localhost Kitchen is a 100% vegetarian kitchen. We don't prepare or store any non-vegetarian food on our premises, so you can order with complete confidence if you follow a vegetarian diet. Our menu is built around simple, wholesome vegetarian food cooked the way a home kitchen would make it." },

  { id: 'students-pg', category: 'delivery',
    q: 'Do you provide food for students and PG residents?',
    a: "Yes, students and PG residents make up a big part of who we cook for. We understand that living away from home often means missing proper homemade food, so our tiffin service is designed to fill exactly that gap — healthy, affordable meals delivered daily to your PG or hostel." },

  { id: 'office-delivery', category: 'delivery',
    q: 'Do you deliver to offices?',
    a: "Yes, we deliver to offices across our service areas in Greater Noida. Many working professionals order lunch tiffins to their workplace as a healthier, more affordable alternative to eating out every day. Message us on WhatsApp with your office location and preferred timing to set this up." },

  { id: 'corporate-events', category: 'corporate',
    q: 'Can I order food for corporate events?',
    a: "Yes, alongside our daily tiffin service, we also take bulk and corporate orders for office lunches, meetings and small events. We can put together a homestyle vegetarian spread sized to your headcount, with menus you can customize in advance. It's best to reach out a little ahead of time on WhatsApp so we can plan quantities properly." },

  { id: 'how-to-order', category: 'corporate', popular: true,
    q: 'How can I place an order?',
    a: "The easiest way to order is directly on WhatsApp at +91 74286 62683 — just tell us whether you want a single meal, a weekly plan or the monthly subscription, along with your delivery address. You can also browse our full weekly menu on our website. We reply quickly and confirm your order along with the delivery timing." },

  { id: 'payment-methods', category: 'pricing',
    q: 'Which payment methods are accepted?',
    a: "We accept UPI and cash for all orders, including single meals and the monthly subscription. UPI payments are quick and can be made directly through any app once we confirm your order on WhatsApp. Prefer paying in cash on delivery? That works too." },

  { id: 'fssai', category: 'quality',
    q: 'Is Localhost Kitchen FSSAI Registered?',
    a: "Yes, Localhost Kitchen is fully FSSAI registered, with license number 22726441001307. Food safety and hygiene are non-negotiable for us — our kitchen follows FSSAI guidelines for how food is prepared, stored and packed before it reaches you." },

  { id: 'why-choose-us', category: 'general',
    q: 'Why should I choose Localhost Kitchen instead of restaurant food?',
    a: "Restaurant food is often heavy with oil, and eating out daily gets expensive fast. Localhost Kitchen gives you the alternative — homemade, healthy food cooked the way it would be at home, at a fraction of restaurant prices. Portions, spice levels and ingredients are all tuned for a meal you can have day after day without feeling weighed down." },

  { id: 'customize-meal', category: 'quality',
    q: 'Can I customize my meal?',
    a: "We keep a set daily menu so we can cook efficiently and keep prices low, but we're happy to accommodate reasonable preferences — like skipping a particular vegetable or adjusting spice levels — if you let us know in advance. For specific dietary needs, message us on WhatsApp and we'll do our best to work something out." },

  { id: 'menu-changes', category: 'quality',
    q: 'Do you change the menu every day?',
    a: "Yes, our menu rotates through the week so you're not eating the same dal-roti combination every day. We plan a weekly rotation covering different sabzis, dals, rajma, chole and more, so both lunch and dinner feel varied. Check our current weekly menu on the website to see what's cooking on any given day." },

  { id: 'contact-us', category: 'contact', popular: true,
    q: 'How can I contact Localhost Kitchen?',
    a: "The fastest way to reach us is WhatsApp at +91 74286 62683 — we typically reply within minutes. You can also follow and message us on Instagram @localhost.kitchen, or browse our website for the full menu, pricing and subscription details." },

  { id: 'why-homemade-healthier', category: 'general',
    q: 'Why is homemade food healthier than outside food?',
    a: "Homemade food generally uses fresh ingredients, controlled amounts of oil and salt, and no artificial preservatives — unlike a lot of outside food, which is often optimized for taste rather than health. Home-cooked meals with balanced vegetables, grains and pulses support better long-term health than frequent restaurant or packaged food. That's the philosophy behind Localhost Kitchen." },
];

const CATEGORY_LABELS = {
  general: 'General',
  delivery: 'Delivery & Timing',
  pricing: 'Pricing & Subscription',
  quality: 'Food Quality & Safety',
  corporate: 'Orders & Corporate',
  contact: 'Contact',
};

// --- 1. Mobile nav toggle (same X-animation pattern as the main site) ---
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

// --- 2. Dark mode toggle (persisted, respects system preference by default) ---
const themeToggle = document.getElementById('themeToggle');
const THEME_KEY = 'lhk-theme';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}
(function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) { applyTheme(saved); return; }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
})();
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });
}

// --- 3. Footer year ---
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// --- 4. Most-viewed tracking (localStorage click counter) ---
const VIEWS_KEY = 'lhk-faq-views';
function getViewCounts() {
  try { return JSON.parse(localStorage.getItem(VIEWS_KEY)) || {}; }
  catch { return {}; }
}
function recordView(id) {
  const counts = getViewCounts();
  counts[id] = (counts[id] || 0) + 1;
  localStorage.setItem(VIEWS_KEY, JSON.stringify(counts));
  renderMostViewed();
}
function renderMostViewed() {
  const list = document.getElementById('mostViewedList');
  if (!list) return;
  const counts = getViewCounts();
  const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  if (ranked.length === 0) {
    list.innerHTML = '<li style="color:var(--ink-soft); font-size:.82rem;">Open a few questions and they\'ll show up here.</li>';
    return;
  }
  list.innerHTML = ranked.map(([id]) => {
    const item = faqData.find(f => f.id === id);
    if (!item) return '';
    return `<li><a href="#${item.id}" data-jump="${item.id}">${item.q}</a></li>`;
  }).join('');
}

// --- 5. Render Popular Questions sidebar ---
function renderPopular() {
  const list = document.getElementById('popularList');
  if (!list) return;
  const popular = faqData.filter(f => f.popular);
  list.innerHTML = popular.map(item => `<li><a href="#${item.id}" data-jump="${item.id}">${item.q}</a></li>`).join('');
}

// --- 6. Build the accordion, grouped into each category's <div class="accordion"> ---
function buildAccordion() {
  document.querySelectorAll('.faq-group').forEach(group => {
    const category = group.getAttribute('data-category');
    const container = group.querySelector('.accordion');
    const items = faqData.filter(f => f.category === category);
    container.innerHTML = items.map(item => `
      <div class="faq-item" id="${item.id}" data-id="${item.id}" data-category="${item.category}">
        <button type="button" class="faq-question" aria-expanded="false" aria-controls="answer-${item.id}">
          <h3>${item.popular ? '<span class="faq-badge">Popular</span>' : ''}${item.q}</h3>
          <span class="faq-toggle-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 5v14M5 12h14"/></svg>
          </span>
        </button>
        <div class="faq-answer" id="answer-${item.id}">
          <div class="faq-answer-inner">
            <div class="faq-answer-content">
              <p>${item.a}</p>
              <div class="faq-item-actions">
                <button type="button" class="icon-btn" data-action="copy" data-id="${item.id}">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
                  Copy Link
                </button>
                <button type="button" class="icon-btn" data-action="share" data-id="${item.id}">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.5l6.8-3.9M8.6 13.5l6.8 3.9"/></svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  });
}

// --- 7. Accordion open/close + copy/share actions (event delegation) ---
function toggleItem(itemEl, forceOpen) {
  const question = itemEl.querySelector('.faq-question');
  const isOpen = itemEl.classList.contains('is-open');
  const shouldOpen = forceOpen !== undefined ? forceOpen : !isOpen;
  itemEl.classList.toggle('is-open', shouldOpen);
  question.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
  if (shouldOpen && !isOpen) recordView(itemEl.dataset.id);
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

document.addEventListener('click', (e) => {
  const questionBtn = e.target.closest('.faq-question');
  if (questionBtn) {
    toggleItem(questionBtn.closest('.faq-item'));
    return;
  }

  const actionBtn = e.target.closest('[data-action]');
  if (actionBtn) {
    const id = actionBtn.getAttribute('data-id');
    const url = `${location.origin}${location.pathname}#${id}`;
    if (actionBtn.dataset.action === 'copy') {
      navigator.clipboard?.writeText(url).then(() => showToast('Link copied!'))
        .catch(() => showToast('Could not copy link'));
    } else if (actionBtn.dataset.action === 'share') {
      const item = faqData.find(f => f.id === id);
      if (navigator.share) {
        navigator.share({ title: item ? item.q : 'Localhost Kitchen FAQ', url }).catch(() => {});
      } else {
        navigator.clipboard?.writeText(url).then(() => showToast('Link copied — share it anywhere!'));
      }
    }
    return;
  }

  const jumpLink = e.target.closest('[data-jump]');
  if (jumpLink) {
    e.preventDefault();
    const id = jumpLink.getAttribute('data-jump');
    const itemEl = document.getElementById(id);
    if (itemEl) {
      // make sure its category group + card are visible before opening (in case a filter is active)
      resetFiltersTo('all');
      toggleItem(itemEl, true);
      itemEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
});

// --- 8. Expand All / Collapse All ---
document.getElementById('expandAll')?.addEventListener('click', () => {
  document.querySelectorAll('.faq-item:not(.is-hidden)').forEach(el => toggleItem(el, true));
});
document.getElementById('collapseAll')?.addEventListener('click', () => {
  document.querySelectorAll('.faq-item').forEach(el => toggleItem(el, false));
});

// --- 9. Category filter ---
let activeCategory = 'all';
function resetFiltersTo(category) {
  activeCategory = category;
  document.querySelectorAll('.pill').forEach(p => p.classList.toggle('is-active', p.dataset.category === category));
  applyFilters();
}
document.getElementById('categoryFilters')?.addEventListener('click', (e) => {
  const pill = e.target.closest('.pill');
  if (!pill) return;
  resetFiltersTo(pill.dataset.category);
});

// --- 10. Search + combined filtering ---
const searchInput = document.getElementById('faqSearch');
const clearSearchBtn = document.getElementById('clearSearch');

function applyFilters() {
  const query = (searchInput?.value || '').trim().toLowerCase();
  clearSearchBtn.hidden = query.length === 0;

  let visibleCount = 0;
  document.querySelectorAll('.faq-item').forEach(itemEl => {
    const matchesCategory = activeCategory === 'all' || itemEl.dataset.category === activeCategory;
    const text = itemEl.textContent.toLowerCase();
    const matchesSearch = query === '' || text.includes(query);
    const visible = matchesCategory && matchesSearch;
    itemEl.classList.toggle('is-hidden', !visible);
    if (visible) visibleCount++;
  });

  // hide whole category groups that have zero visible items
  document.querySelectorAll('.faq-group').forEach(group => {
    const hasVisible = group.querySelectorAll('.faq-item:not(.is-hidden)').length > 0;
    group.classList.toggle('is-hidden', !hasVisible);
  });

  document.getElementById('noResults').hidden = visibleCount !== 0;

  const countEl = document.getElementById('faqResultCount');
  if (countEl) {
    countEl.textContent = query
      ? `${visibleCount} question${visibleCount === 1 ? '' : 's'} matching "${searchInput.value.trim()}"`
      : '';
  }
}
searchInput?.addEventListener('input', applyFilters);
clearSearchBtn?.addEventListener('click', () => {
  searchInput.value = '';
  applyFilters();
  searchInput.focus();
});

// --- 11. Back to top ---
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (!backToTop) return;
  backToTop.hidden = window.scrollY < 500;
  backToTop.classList.toggle('is-visible', window.scrollY >= 500);
}, { passive: true });
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// --- 12. Init: build accordion, render sidebars, open item from URL hash ---
buildAccordion();
renderPopular();
renderMostViewed();

if (location.hash) {
  const id = location.hash.slice(1);
  const itemEl = document.getElementById(id);
  if (itemEl) {
    toggleItem(itemEl, true);
    setTimeout(() => itemEl.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
  }
}
