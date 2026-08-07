// AutomateX-HUB — landing page
// Agents : lire AGENTS.md + .cursor/rules/ avant modification.
// Durée promise : 20 min. Event Calendly actuel : /30min (créer un event /20min puis mettre à jour l’URL).
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

// ---------- Sticky CTA mobile (home) ----------
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
