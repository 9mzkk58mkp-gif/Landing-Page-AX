// AutomateX-HUB — landing page
// Agents : lire AGENTS.md + .cursor/rules/ avant modification.
// Durée promise : 20 min. Event Calendly : /30min tant que /20min n’existe pas (404 au 2026-08-07). Créer /20min puis changer CALENDLY_URL.
const CALENDLY_URL = 'https://calendly.com/nolan-hermand-automatex-hub/30min';
const CALENDLY_CSS = 'https://assets.calendly.com/assets/external/widget.css';
const CALENDLY_JS = 'https://assets.calendly.com/assets/external/widget.js';

let calendlyAssetsPromise = null;

function loadCalendlyAssets() {
 if (window.Calendly) return Promise.resolve();
 if (calendlyAssetsPromise) return calendlyAssetsPromise;

 calendlyAssetsPromise = new Promise((resolve, reject) => {
 if (!document.querySelector('link[data-ax-calendly]')) {
 const link = document.createElement('link');
 link.rel = 'stylesheet';
 link.href = CALENDLY_CSS;
 link.setAttribute('data-ax-calendly', '1');
 document.head.appendChild(link);
 }

 const existing = document.querySelector('script[data-ax-calendly]');
 if (existing) {
 existing.addEventListener('load', () => resolve());
 existing.addEventListener('error', () => reject(new Error('Calendly script failed')));
 return;
 }

 const script = document.createElement('script');
 script.src = CALENDLY_JS;
 script.async = true;
 script.setAttribute('data-ax-calendly', '1');
 script.onload = () => resolve();
 script.onerror = () => reject(new Error('Calendly script failed'));
 document.head.appendChild(script);
 });

 return calendlyAssetsPromise;
}

function openCalendly(e) {
 if (e) e.preventDefault();
 loadCalendlyAssets()
 .then(() => {
 if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
 window.Calendly.initPopupWidget({ url: CALENDLY_URL });
 } else {
 window.location.href = CALENDLY_URL;
 }
 })
 .catch(() => {
 window.location.href = CALENDLY_URL;
 });
}

document.querySelectorAll('.js-calendly').forEach((a) => {
 a.href = CALENDLY_URL;
 a.removeAttribute('target');
 a.addEventListener('click', openCalendly);
});

// ---------- Deferred images (perf) ----------
(function deferImages() {
 const run = () => {
 document.querySelectorAll('img[data-defer-src]').forEach((img) => {
 const src = img.getAttribute('data-defer-src');
 const srcset = img.getAttribute('data-defer-srcset');
 if (src) img.setAttribute('src', src);
 if (srcset) img.setAttribute('srcset', srcset);
 img.removeAttribute('data-defer-src');
 img.removeAttribute('data-defer-srcset');
 });
 };
 if ('requestIdleCallback' in window) requestIdleCallback(run, { timeout: 2000 });
 else window.addEventListener('load', () => setTimeout(run, 200));
})();

// ---------- Révélations au scroll ----------
const animated = document.querySelectorAll('.reveal, .anim-run');
const show = (el) => {
 if (el.classList.contains('reveal')) el.classList.add('in');
 if (el.classList.contains('anim-run')) el.style.animationPlayState = 'running';
};

// Hero above-the-fold : visible + cliquable tout de suite (pas d'attente IO)
document.querySelectorAll('.section--hero .reveal, .section--hero .anim-run').forEach(show);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Navbar pilule : entrée puis flottement + pastille active
(function navPillMotion() {
 const nav = document.querySelector('.nav-pill');
 if (!nav) return;

 const links = Array.from(nav.querySelectorAll('.nav-pill__link'));
 const thumb = nav.querySelector('.nav-pill__thumb');

 const placeThumb = (link) => {
 if (!thumb || !link) return;
 const navBox = nav.getBoundingClientRect();
 const linkBox = link.getBoundingClientRect();
 nav.style.setProperty('--nav-thumb-x', `${Math.round(linkBox.left - navBox.left)}px`);
 nav.style.setProperty('--nav-thumb-w', `${Math.round(linkBox.width)}px`);
 };

 const setActive = (key) => {
 if (nav.dataset.active === key) {
 const current = links.find((l) => l.dataset.nav === key);
 if (current) placeThumb(current);
 return;
 }
 nav.dataset.active = key;
 links.forEach((link) => {
 const on = link.dataset.nav === key;
 link.classList.toggle('is-active', on);
 if (on) placeThumb(link);
 });
 };

 show(nav);
 requestAnimationFrame(() => {
 const current = links.find((l) => l.classList.contains('is-active')) || links[0];
 placeThumb(current);
 });

 if (!reducedMotion) {
 nav.addEventListener(
 'animationend',
 (e) => {
 if (e.animationName !== 'om-nav-in') return;
 nav.classList.add('nav-pill--live');
 },
 { once: true }
 );
 }

 links.forEach((link) => {
 link.addEventListener('click', () => {
 const key = link.dataset.nav || 'accueil';
 setActive(key);
 });
 });

 window.addEventListener('resize', () => {
 const current = links.find((l) => l.classList.contains('is-active')) || links[0];
 placeThumb(current);
 });

  const spyMap = [
    { id: 'top', key: 'accueil' },
    { id: 'outils', key: 'outils' },
    { id: 'comment', key: 'comment' },
    { id: 'fondateur', key: 'moi' },
    { id: 'faq', key: 'faq' },
  ];

 const targets = spyMap
 .map((s) => ({ ...s, el: document.getElementById(s.id) }))
 .filter((s) => s.el);

 if (!targets.length || !('IntersectionObserver' in window)) return;

 const visible = new Map();

 const spy = new IntersectionObserver(
 (entries) => {
 entries.forEach((entry) => {
 const hit = targets.find((t) => t.el === entry.target);
 if (!hit) return;
 if (entry.isIntersecting) visible.set(hit.key, entry.intersectionRatio);
 else visible.delete(hit.key);
 });
 if (!visible.size) return;
 let bestKey = 'accueil';
 let bestRatio = -1;
 visible.forEach((ratio, key) => {
 if (ratio >= bestRatio) {
 bestRatio = ratio;
 bestKey = key;
 }
 });
 setActive(bestKey);
 },
 { rootMargin: '-28% 0px -48% 0px', threshold: [0, 0.15, 0.35, 0.55] }
 );

 targets.forEach((t) => spy.observe(t.el));
})();

if (reducedMotion || !('IntersectionObserver' in window)) {
 document.documentElement.classList.add('no-motion');
 animated.forEach(show);
} else {
 const io = new IntersectionObserver(
 (entries) => {
 entries.forEach((entry) => {
 if (entry.isIntersecting) {
 show(entry.target);
 io.unobserve(entry.target);
 }
 });
 },
 { rootMargin: '0px 0px -4% 0px' }
 );
 animated.forEach((el) => io.observe(el));
}

// ---------- Calculateur « Devis N° 000 » ----------
const HOURS_PER_WEEK = 8;
const WEEKS_PER_MONTH = 4.33;

const slider = document.getElementById('rate');
const rateVal = document.getElementById('rate-val');
const monthlyVal = document.getElementById('monthly-val');

if (slider && rateVal && monthlyVal) {
 let displayed = HOURS_PER_WEEK * Number(slider.value) * WEEKS_PER_MONTH;
 let raf = 0;

 function renderMonthly(value) {
 monthlyVal.textContent = (Math.round(value / 10) * 10).toLocaleString('fr-FR');
 }

 function tweenTo(target) {
 cancelAnimationFrame(raf);
 const from = displayed;
 const t0 = performance.now();
 const step = (t) => {
 const p = Math.min(1, (t - t0) / 300);
 displayed = from + (target - from) * (1 - Math.pow(1 - p, 3));
 renderMonthly(displayed);
 if (p < 1) raf = requestAnimationFrame(step);
 };
 raf = requestAnimationFrame(step);
 }

 slider.addEventListener('input', () => {
 rateVal.textContent = slider.value;
 tweenTo(HOURS_PER_WEEK * Number(slider.value) * WEEKS_PER_MONTH);
 });

 renderMonthly(displayed);
}

// ---------- Lightbox AutomateX-OS ----------
(function initDashLightbox() {
 const lightbox = document.getElementById('dash-lightbox');
 if (!lightbox) return;

 const openers = document.querySelectorAll('.js-lightbox-open');
 const closers = lightbox.querySelectorAll('.js-lightbox-close');
 let lastFocus = null;
 let useDialog = typeof lightbox.showModal === 'function';

 const openLightbox = () => {
 const frameImg = lightbox.querySelector('.dash-lightbox__frame img');
 if (frameImg && frameImg.dataset.src) {
 if (frameImg.getAttribute('src') !== frameImg.dataset.src) {
 frameImg.setAttribute('src', frameImg.dataset.src);
 }
 }
 lastFocus = document.activeElement;
 document.body.style.overflow = 'hidden';
 if (useDialog) {
 try {
 if (!lightbox.open) lightbox.showModal();
 } catch (err) {
 useDialog = false;
 lightbox.classList.add('is-fallback-open');
 lightbox.setAttribute('open', '');
 }
 } else {
 lightbox.classList.add('is-fallback-open');
 lightbox.setAttribute('open', '');
 }
 const backBtn = lightbox.querySelector('.js-lightbox-close');
 if (backBtn) backBtn.focus();
 };

 const closeLightbox = () => {
 document.body.style.overflow = '';
 if (useDialog && lightbox.open) {
 lightbox.close();
 } else {
 lightbox.classList.remove('is-fallback-open');
 lightbox.removeAttribute('open');
 }
 if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
 };

 openers.forEach((btn) => {
 btn.addEventListener('click', (e) => {
 e.preventDefault();
 e.stopPropagation();
 openLightbox();
 });
 });

 closers.forEach((btn) => {
 btn.addEventListener('click', (e) => {
 e.preventDefault();
 e.stopPropagation();
 closeLightbox();
 });
 });

 lightbox.addEventListener('click', (e) => {
 if (e.target === lightbox) closeLightbox();
 });

 lightbox.addEventListener('cancel', (e) => {
 e.preventDefault();
 closeLightbox();
 });

 document.addEventListener('keydown', (e) => {
 if (e.key !== 'Escape') return;
 if (lightbox.open || lightbox.classList.contains('is-fallback-open')) {
 closeLightbox();
 }
 });
})();

// ---------- Bulle photo + chatbot FAQ (réponses du site, pas d’IA externe) ----------
(function initAxChat() {
 const bubble = document.getElementById('faq-bubble');
 const chat = document.getElementById('ax-chat');
 const messages = document.getElementById('ax-chat-messages');
 const chipsEl = document.getElementById('ax-chat-chips');
 const form = document.getElementById('ax-chat-form');
 const input = document.getElementById('ax-chat-input');
 const closeBtn = document.getElementById('ax-chat-close');
 if (!bubble || !chat || !messages || !form || !input) return;

 const CALENDLY =
 typeof CALENDLY_URL === 'string'
 ? CALENDLY_URL
 : 'https://calendly.com/nolan-hermand-automatex-hub/30min';

 const CHIPS = [
 'Combien ça coûte ?',
 'Obat suffit-il ?',
 'Mon outil n’est pas listé',
 'Réserver une démo',
 ];

 const KB = [
 {
 keys: ['prix', 'coute', 'coûte', 'tarif', 'combien', '390', '99', 'cout'],
 html:
 'À partir de <strong>390&nbsp;€ + 99&nbsp;€/mois</strong>. Sans engagement · RGPD France. On cadre ça en 20&nbsp;min avant toute facturation.',
 },
 {
 keys: ['obat', 'relance', 'logiciel'],
 html:
 'Non : Obat sert au chiffrage, il ne relance pas tout seul. AutomateX-HUB se branche sur Obat et Gmail pour envoi, suivi et relances. Jusqu’à 8&nbsp;h/semaine.',
 },
 {
 keys: ['heure', 'temps', 'soirée', 'semaine', 'gagne'],
 html:
 'Jusqu’à <strong>8&nbsp;h par semaine</strong> récupérées sur devis, relances et mails. À 55&nbsp;€/h, environ 1&nbsp;910&nbsp;€ de temps récupéré par mois.',
 },
 {
 keys: ['outil', 'listé', 'liste', 'pas dans', 'batigest', 'excel', 'autre'],
 html:
 'La liste (Obat, Gmail, Outlook, Telegram, WhatsApp) montre les plus courants. Si ton outil n’est pas cité, on le regarde ensemble pendant la démo de 20&nbsp;min.',
 },
 {
 keys: ['demo', 'démo', 'rdv', 'rendez', 'appel', 'calendly', 'réserver', 'reserver', 'parler'],
 html: 'On se parle 20&nbsp;min sur ton cas — sans engagement.',
 cta: true,
 },
    {
      keys: ['engagement', 'résil', 'resil', 'rgpd'],
      html:
        'Sans engagement · résiliable en 1 mail · RGPD France (données en France / UE selon le parcours).',
    },
    {
      keys: ['rembours', 'satisfait'],
      html:
        'Pas de garantie «&nbsp;30&nbsp;jours satisfait ou remboursé&nbsp;». Sans engagement, résiliable en 1 mail — on cadre le besoin avant de facturer.',
    },
 {
 keys: ['qui', 'nolan', 'menuisier', 'flers', 'orne', 'où', 'ou es'],
 html:
 'Moi c’est Nolan Hermand, menuisier devenu développeur, basé à Saint-Georges-des-Groseillers près de Flers (Orne). J’automatise devis / relances / mails pour artisans du bâtiment.',
 },
 {
 keys: ['gmail', 'outlook', 'whatsapp', 'telegram', 'branche', 'appli', 'application', 'écran', 'ecran', 'soir', 'coup'],
 html:
 'Tes outils restent. On les branche et on les regroupe dans <strong>ton application métier</strong> : le soir, un coup d’œil et tu vois devis, relances, mails — sans ouvrir dix onglets.',
 },
 ];

 const WELCOME =
 'Salut — je réponds aux questions du site (prix, outils, délais). Pour ton cas précis, mieux vaut une démo de 20&nbsp;min.';
 const FALLBACK =
 'Je n’ai pas cette réponse ici. Regarde la <a href="#faq">FAQ</a>, ou réserve 20&nbsp;min : on regarde ton cas ensemble.';

 let openedOnce = false;

 function syncBubble() {
 const chatOpen = !chat.hasAttribute('hidden');
 if (chatOpen) bubble.setAttribute('hidden', '');
 else bubble.removeAttribute('hidden');
 bubble.setAttribute('aria-expanded', chatOpen ? 'true' : 'false');
 document.body.classList.toggle('ax-chat-open', chatOpen);
 }

 function watchCookieBanner() {
 const update = () => {
 document.body.classList.toggle(
 'has-cookie-banner',
 !!document.getElementById('cookie-banner')
 );
 };
 update();
 const mo = new MutationObserver(update);
 mo.observe(document.body, { childList: true });
 }

 function addMsg(html, role) {
 const el = document.createElement('div');
 el.className = 'ax-chat__msg ax-chat__msg--' + role;
 el.innerHTML = html;
 messages.appendChild(el);
 messages.scrollTop = messages.scrollHeight;
 return el;
 }

 function addBot(html, withCta) {
 let body = html;
 if (withCta) {
 body +=
 '<a class="ax-chat__cta js-calendly" href="' +
 CALENDLY +
 '">Démo gratuite 20 min sur ton cas</a>';
 }
 const el = addMsg(body, 'bot');
 el.querySelectorAll('.js-calendly').forEach((a) => {
 a.addEventListener('click', openCalendly);
 });
 return el;
 }

 function answer(text) {
 const q = text
 .toLowerCase()
 .normalize('NFD')
 .replace(/[\u0300-\u036f]/g, '');
 for (let i = 0; i < KB.length; i++) {
 const item = KB[i];
 for (let k = 0; k < item.keys.length; k++) {
 const key = item.keys[k]
 .normalize('NFD')
 .replace(/[\u0300-\u036f]/g, '');
 if (q.indexOf(key) !== -1) {
 addBot(item.html, !!item.cta);
 return;
 }
 }
 }
 addBot(FALLBACK, true);
 }

 function renderChips() {
 if (!chipsEl) return;
 chipsEl.innerHTML = '';
 CHIPS.forEach((label) => {
 const b = document.createElement('button');
 b.type = 'button';
 b.className = 'ax-chat__chip';
 b.textContent = label;
 b.addEventListener('click', () => {
 addMsg(label, 'user');
 answer(label);
 });
 chipsEl.appendChild(b);
 });
 }

 function openChat() {
 chat.removeAttribute('hidden');
 if (!openedOnce) {
 messages.innerHTML = '';
 addBot(WELCOME, true);
 renderChips();
 openedOnce = true;
 }
 syncBubble();
 window.setTimeout(() => input.focus(), 50);
 }

 function closeChat() {
 chat.setAttribute('hidden', '');
 syncBubble();
 bubble.focus();
 }

 function onBubbleActivate(e) {
 if (e) {
 e.preventDefault();
 e.stopPropagation();
 }
 if (chat.hasAttribute('hidden')) openChat();
 else closeChat();
 }

 bubble.addEventListener('click', onBubbleActivate);
 bubble.addEventListener('keydown', (e) => {
 if (e.key === 'Enter' || e.key === ' ') {
 e.preventDefault();
 onBubbleActivate(e);
 }
 });

 if (closeBtn) closeBtn.addEventListener('click', closeChat);

 form.addEventListener('submit', (e) => {
 e.preventDefault();
 const raw = (input.value || '').trim();
 if (!raw) return;
 addMsg(raw.replace(/</g, '&lt;'), 'user');
 input.value = '';
 answer(raw);
 });

 document.addEventListener('keydown', (e) => {
 if (e.key === 'Escape' && !chat.hasAttribute('hidden')) {
 e.preventDefault();
 closeChat();
 }
 });

 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
 bubble.style.animation = 'none';
 }

 watchCookieBanner();
 syncBubble();
})();

// ---------- Sticky CTA mobile (home + métiers + zone si #sticky-cta) ----------
(function initStickyCta() {
 const sticky = document.getElementById('sticky-cta');
 if (!sticky) return;

 const heroCta = document.querySelector('.section--hero .js-calendly');
 let heroVisible = true;
 let cookieOpen = false;

 function syncSticky() {
 const showBar = !heroVisible && !cookieOpen;
 sticky.hidden = !showBar;
 document.body.classList.toggle('has-sticky-cta', showBar);
 }

 function watchCookies() {
 const update = () => {
 cookieOpen = !!document.getElementById('cookie-banner');
 syncSticky();
 };
 update();
 const mo = new MutationObserver(update);
 mo.observe(document.body, { childList: true });
 }

 watchCookies();

 if (!heroCta || !('IntersectionObserver' in window)) {
 heroVisible = false;
 syncSticky();
 return;
 }

 const io = new IntersectionObserver(
 (entries) => {
 entries.forEach((entry) => {
 heroVisible = entry.isIntersecting;
 syncSticky();
 });
 },
 { threshold: 0.2 }
 );
 io.observe(heroCta);
})();

// ---------- Cookies + Google Analytics (consentement RGPD) ----------
(function initCookieConsent() {
 const GA_ID = 'G-GZG5DWRGKF';
 const CONSENT_KEY = 'ax_cookie_consent';
 const CONSENT_GRANTED = 'granted';
 const CONSENT_DENIED = 'denied';

 function getConsent() {
 try {
 return localStorage.getItem(CONSENT_KEY);
 } catch (err) {
 return null;
 }
 }

 function setConsent(value) {
 try {
 localStorage.setItem(CONSENT_KEY, value);
 } catch (err) {
 /* ignore quota / private mode */
 }
 }

 function loadGoogleAnalytics() {
 if (window.__axGaLoaded) return;
 window.__axGaLoaded = true;
 window.dataLayer = window.dataLayer || [];
 function gtag() {
 window.dataLayer.push(arguments);
 }
 window.gtag = gtag;
 gtag('js', new Date());
 gtag('config', GA_ID, { anonymize_ip: true });
 const script = document.createElement('script');
 script.async = true;
 script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
 document.head.appendChild(script);
 }

 function hideBanner() {
 const banner = document.getElementById('cookie-banner');
 if (banner) banner.remove();
 }

 function showBanner() {
 if (document.getElementById('cookie-banner')) return;

 const banner = document.createElement('div');
 banner.id = 'cookie-banner';
 banner.className = 'cookie-banner';
 banner.setAttribute('role', 'dialog');
 banner.setAttribute('aria-labelledby', 'cookie-banner-title');
 banner.setAttribute('aria-live', 'polite');
 banner.innerHTML =
 '<div class="cookie-banner__inner">' +
 '<div class="cookie-banner__copy">' +
 '<p id="cookie-banner-title" class="cookie-banner__title">Cookies &amp; mesure d’audience</p>' +
 '<p class="cookie-banner__text">Ce site utilise Google Analytics uniquement si vous acceptez. ' +
 'Cookies strictement nécessaires&nbsp;: toujours actifs. ' +
 '<a href="/confidentialite/">Politique de confidentialité</a>.</p>' +
 '</div>' +
 '<div class="cookie-banner__actions">' +
 '<button type="button" class="btn cookie-banner__refuse js-cookie-refuse">Refuser</button>' +
 '<button type="button" class="btn cookie-banner__accept js-cookie-accept">Accepter</button>' +
 '</div>' +
 '</div>';

 document.body.appendChild(banner);

 banner.querySelector('.js-cookie-accept').addEventListener('click', () => {
 setConsent(CONSENT_GRANTED);
 hideBanner();
 loadGoogleAnalytics();
 });

 banner.querySelector('.js-cookie-refuse').addEventListener('click', () => {
 setConsent(CONSENT_DENIED);
 hideBanner();
 });

 const acceptBtn = banner.querySelector('.js-cookie-accept');
 if (acceptBtn) acceptBtn.focus();
 }

 function injectManageLink() {
 const nav = document.querySelector('.site-footer-nav');
 if (!nav || nav.querySelector('.js-cookie-manage')) return;
 const btn = document.createElement('button');
 btn.type = 'button';
 btn.className = 'site-footer-cookie js-cookie-manage';
 btn.textContent = 'Cookies';
 btn.addEventListener('click', () => showBanner());
 nav.appendChild(btn);
 }

 injectManageLink();

 const consent = getConsent();
 const boot = () => {
 if (consent === CONSENT_GRANTED) {
 loadGoogleAnalytics();
 } else if (consent !== CONSENT_DENIED) {
 showBanner();
 }
 };

 if (consent === CONSENT_GRANTED) {
 // Analytics after first paint
 if ('requestIdleCallback' in window) {
 requestIdleCallback(boot, { timeout: 2500 });
 } else {
 setTimeout(boot, 1200);
 }
 } else if (consent !== CONSENT_DENIED) {
 if ('requestIdleCallback' in window) {
 requestIdleCallback(boot, { timeout: 1800 });
 } else {
 setTimeout(boot, 800);
 }
 }
})();
