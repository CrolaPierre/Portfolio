'use strict';

/* ════════════════════════════════════════════════
   LOADER — boxes slide in from alternating directions
════════════════════════════════════════════════ */
let resolveLoaderDone;
window.loaderDone = new Promise(r => { resolveLoaderDone = r; });

(function initLoader() {
  const loader = document.getElementById('loader');
  const fill   = document.getElementById('loader-fill');
  const boxes  = [...document.querySelectorAll('#loader-name .lc-box')];
  if (!loader) { resolveLoaderDone(); return; }

  // Each letter gets a random direction + easing personality
  const dirs  = ['110%', '-110%'];
  const eases = [
    'cubic-bezier(0.22, 1, 0.36, 1)',
    'cubic-bezier(0.16, 1, 0.3, 1)',
    'cubic-bezier(0.34, 1.56, 0.64, 1)',
    'cubic-bezier(0.12, 0.8, 0.4, 1)',
  ];
  const total = boxes.length;
  let done    = 0;

  // Stagger: some letters arrive at the same time, gaps are irregular
  const delays = [0, 60, 60, 130, 220, 310, 320, 400, 460, 520, 520, 600];
  const durations = [420, 480, 390, 520, 450, 410, 490, 380, 460, 430, 500, 440];

  boxes.forEach((box, i) => {
    const dir  = dirs[i % 2 === 0 ? 0 : 1];
    const ease = eases[i % eases.length];
    const dur  = durations[i];
    const del  = delays[i];

    // start hidden (translateY set by CSS default: 110%)
    box.style.transform = dir;

    setTimeout(() => {
      box.style.transition = `transform ${dur}ms ${ease}`;
      box.style.transform  = 'translateY(0%)';

      setTimeout(() => {
        // flip: box bg disappears, letter colour shows
        box.style.transition = 'background 0.25s, color 0.25s';
        box.classList.add('done');
        done++;
        fill.style.width = (done / total * 100) + '%';
        if (done === total) exitLoader();
      }, dur + 80);
    }, del);
  });

  function exitLoader() {
    setTimeout(() => {
      loader.classList.add('exit');
      setTimeout(() => { loader.remove(); resolveLoaderDone(); }, 820);
    }, 280);
  }
})();

/* ════════════════════════════════════════════════
   CURSOR + CONTEXTUAL LABEL
════════════════════════════════════════════════ */
const cur   = document.getElementById('cursor');
const dot   = document.getElementById('cdot');
const label = document.getElementById('cursor-label');

document.addEventListener('mousemove', e => {
  cur.style.left   = e.clientX + 'px';
  cur.style.top    = e.clientY + 'px';
  dot.style.left   = e.clientX + 'px';
  dot.style.top    = e.clientY + 'px';
  label.style.left = (e.clientX + 20) + 'px';
  label.style.top  = (e.clientY + 16) + 'px';
});

function showLabel(text) {
  label.textContent = text;
  label.classList.add('show');
  cur.classList.add('hov');
}
function hideLabel() {
  label.classList.remove('show');
  cur.classList.remove('hov');
}

// Map selectors → label text
const cursorMap = [
  ['a[href="projets/cryptex.html"], .proj-thumb', 'Voir →'],
  ['header nav a[href="#about"]',                 'À propos'],
  ['header nav a[href="#skills"]',                'Compétences'],
  ['header nav a[href="#projects"]',              'Projets'],
  ['header nav a[href="#contact"]',               'Contact'],
  ['.btn-primary',                                'Voir →'],
  ['.soc-link',                                   'Visiter ↗'],
  ['.contact-email',                              'Écrire ✉'],
  ['.btn-ghost',                                  'Voir'],
  ['#lang-toggle',                                'Lang'],
  ['.logo',                                       'Accueil'],
  ['.pill',                                       null],
];

cursorMap.forEach(([selector, text]) => {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('mouseenter', () => text ? showLabel(text) : cur.classList.add('hov'));
    el.addEventListener('mouseleave', () => hideLabel());
  });
});

/* ════════════════════════════════════════════════
   PAGE TRANSITIONS — venetian blind strips
════════════════════════════════════════════════ */
const transitionEl = document.getElementById('page-transition');
const N_STRIPS = 7;
const STAGGER  = 38;  // ms between each strip
const EXIT_DUR = 420; // ms per strip animation

// Build strips
if (transitionEl) {
  for (let i = 0; i < N_STRIPS; i++) {
    const s = document.createElement('div');
    s.className = 'pt-strip' + (i % 2 === 0 ? '' : ' from-left');
    transitionEl.appendChild(s);
  }
}

function getStrips() { return [...transitionEl.querySelectorAll('.pt-strip')]; }

// On page load — if arriving via transition, exit the strips
if (transitionEl && sessionStorage.getItem('pt')) {
  sessionStorage.removeItem('pt');
  const strips = getStrips();
  // place all at 0 (covering screen)
  strips.forEach(s => s.classList.add('enter'));
  // stagger them out
  requestAnimationFrame(() => requestAnimationFrame(() => {
    strips.forEach((s, i) => {
      setTimeout(() => {
        s.classList.add(i % 2 === 0 ? 'go-right' : 'go-left');
      }, i * STAGGER);
    });
  }));
}

// Intercept internal link clicks
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
  link.addEventListener('click', e => {
    e.preventDefault();
    if (!transitionEl) { window.location.href = href; return; }
    const strips = getStrips();
    strips.forEach((s, i) => {
      setTimeout(() => s.classList.add('exit'), i * STAGGER);
    });
    sessionStorage.setItem('pt', '1');
    // navigate after last strip finishes
    setTimeout(() => { window.location.href = href; }, EXIT_DUR + N_STRIPS * STAGGER);
  });
});

/* ════════════════════════════════════════════════
   HERO CANVAS — deforming grid + trail + shockwave
════════════════════════════════════════════════ */
const canvas = document.getElementById('hero-canvas');
if (canvas) {
  const ctx  = canvas.getContext('2d');
  const GRID = 72;

  function resize() {
    const hero = document.getElementById('hero');
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }
  window.addEventListener('load', resize);
  window.addEventListener('resize', resize);
  resize();

  let mouse = { x: -9999, y: -9999 };
  const heroEl = document.getElementById('hero');

  heroEl.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  heroEl.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  const shockwaves = [];
  heroEl.addEventListener('click', e => {
    const r = canvas.getBoundingClientRect();
    shockwaves.push({ x: e.clientX - r.left, y: e.clientY - r.top, startT: performance.now() });
  });

  const trail = new Map();

  function getDisplaced(bx, by) {
    const dMouse = Math.hypot(bx - mouse.x, by - mouse.y);
    let dx = 0, dy = 0;
    const gravRadius = 140, gravStrength = 22;
    if (dMouse < gravRadius && dMouse > 0) {
      const pull = (1 - dMouse / gravRadius) * gravStrength;
      dx = ((mouse.x - bx) / dMouse) * pull;
      dy = ((mouse.y - by) / dMouse) * pull;
    }
    return { x: bx + dx, y: by + dy };
  }

  function animGrid(ts) {
    const W = canvas.width, H = canvas.height;
    if (!W || !H) { requestAnimationFrame(animGrid); return; }
    ctx.clearRect(0, 0, W, H);

    const cols = Math.ceil(W / GRID) + 1;
    const rows = Math.ceil(H / GRID) + 1;
    const trailRadius = 90, shockDur = 1800, shockWidth = GRID * 2;

    const pts = [];
    for (let row = 0; row < rows; row++) {
      pts[row] = [];
      for (let col = 0; col < cols; col++) {
        const bx = col * GRID, by = row * GRID;
        const key = `${col},${row}`;
        const { x, y } = getDisplaced(bx, by);

        const dMouse = Math.hypot(bx - mouse.x, by - mouse.y);
        let trailAlpha = 0;
        if (dMouse < trailRadius) {
          trailAlpha = (1 - dMouse / trailRadius) * 0.9;
          trail.set(key, { alpha: trailAlpha, ts });
        } else {
          const prev = trail.get(key);
          if (prev) {
            const age = (ts - prev.ts) / 1000;
            trailAlpha = Math.max(0, prev.alpha - age * 0.9);
            if (trailAlpha <= 0) trail.delete(key);
          }
        }

        let shockAlpha = 0;
        shockwaves.forEach((sw, si) => {
          const elapsed   = ts - sw.startT;
          const maxD      = Math.hypot(W, H);
          const wavefront = (elapsed / shockDur) * maxD;
          const dist      = Math.hypot(bx - sw.x, by - sw.y);
          const diff      = wavefront - dist;
          if (diff >= 0 && diff < shockWidth)
            shockAlpha = Math.max(shockAlpha, Math.sin((diff / shockWidth) * Math.PI) * 0.95);
          if (wavefront - shockWidth > maxD) shockwaves.splice(si, 1);
        });

        pts[row][col] = { x, y, alpha: Math.min(1, trailAlpha + shockAlpha) };
      }
    }

    // horizontal lines
    for (let row = 0; row < rows; row++)
      for (let col = 0; col < cols - 1; col++) {
        const a = pts[row][col], b = pts[row][col + 1];
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = 'rgba(30,30,37,0.45)'; ctx.lineWidth = 0.5; ctx.stroke();
      }

    // vertical lines
    for (let col = 0; col < cols; col++)
      for (let row = 0; row < rows - 1; row++) {
        const a = pts[row][col], b = pts[row + 1][col];
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = 'rgba(30,30,37,0.45)'; ctx.lineWidth = 0.5; ctx.stroke();
      }

    // dots
    for (let row = 0; row < rows; row++)
      for (let col = 0; col < cols; col++) {
        const { x, y, alpha } = pts[row][col];
        if (alpha < 0.01) continue;
        const glowR = 2.5 + alpha * 8;
        const g = ctx.createRadialGradient(x, y, 0, x, y, glowR);
        g.addColorStop(0, `rgba(201,255,71,${alpha * 0.45})`);
        g.addColorStop(1, `rgba(201,255,71,0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, glowR, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,255,71,${alpha})`; ctx.fill();
      }

    requestAnimationFrame(animGrid);
  }
  requestAnimationFrame(animGrid);
}

/* ════════════════════════════════════════════════
   HERO NAME SCRAMBLE — fires after loader exits
════════════════════════════════════════════════ */
const nameEl = document.getElementById('hero-name');
if (nameEl) {
  const CHARS_H = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@';
  const letters  = nameEl.querySelectorAll('.c');

  function scrambleLetter(span, original, delay) {
    let n = 0;
    setTimeout(() => {
      const iv = setInterval(() => {
        span.textContent = CHARS_H[Math.floor(Math.random() * CHARS_H.length)];
        span.style.color = 'var(--accent)';
        if (++n >= 10) {
          clearInterval(iv);
          span.textContent = original;
          span.style.color  = '';
        }
      }, 40);
    }, delay);
  }

  window.loaderDone.then(() => {
    letters.forEach((span, i) => {
      const orig = span.textContent;
      scrambleLetter(span, orig, 400 + i * 60);
    });
  });
}

/* ════════════════════════════════════════════════
   KONAMI CODE  ↑↑↓↓←→←→  (arrows only)
════════════════════════════════════════════════ */
const KONAMI_SEQ = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight'];
let konamiIdx = 0;

document.addEventListener('keydown', e => {
  if (!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) { konamiIdx = 0; return; }
  konamiIdx = (e.key === KONAMI_SEQ[konamiIdx]) ? konamiIdx + 1 : 0;
  if (konamiIdx === KONAMI_SEQ.length) { konamiIdx = 0; triggerKonami(); }
});

function triggerKonami() {
  if (document.getElementById('konami-page')) return;

  const page = document.createElement('div');
  page.id = 'konami-page';
  page.innerHTML = `
    <button id="konami-close" aria-label="Fermer">✕</button>
    <div id="konami-content">
      <p class="k-eyebrow">Connaissez-vous le Konami Code ?</p>
      <h2 id="konami-title"></h2>
      <div class="k-grid">
        <div class="k-card">
          <span class="k-card-label">Créateur</span>
          <p>Kazuhisa Hashimoto, développeur chez Konami, invente le code en 1986 lors du portage de <em>Gradius</em> sur NES. Le jeu étant trop difficile pour le tester lui-même, il programme un raccourci secret pour s'octroyer des vies supplémentaires.</p>
        </div>
        <div class="k-card">
          <span class="k-card-label">Ce que ça faisait</span>
          <p>Dans Gradius NES, taper la séquence sur l'écran pause déclenchait un power-up complet — bouclier, missiles, lasers, vitesse max — tout d'un coup. Hashimoto oublie de le retirer avant la sortie. Le code reste.</p>
        </div>
        <div class="k-card">
          <span class="k-card-label">Pourquoi c'est culte</span>
          <p>Konami réutilise le code dans presque tous ses jeux suivants : <em>Contra</em>, <em>Castlevania</em>, <em>Metal Gear</em>... Il devient un signal secret entre développeurs et joueurs, un clin d'œil caché dans le code. Aujourd'hui il est présent sur des dizaines de sites web, dont <em>ESPN</em>, <em>Buzzfeed</em> et <em>Google</em>.</p>
        </div>
        <div class="k-card">
          <span class="k-card-label">La séquence originale</span>
          <p>Sur la manette NES, il fallait appuyer sur&nbsp;: <span class="k-accent">↑ ↑ ↓ ↓ ← → ← → B A Start</span> — croix directionnelle, puis les boutons B et A, puis Start pour valider. Certains jeux acceptaient aussi la variante <span class="k-accent">Select Start</span> pour le mode 2 joueurs. 🎮</p>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(page);

  // Scramble title then resolve to "you found me ;)"
  const CHARS_K  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#!?';
  const TARGET   = 'tu m\'as trouvé ;)';
  const titleEl  = document.getElementById('konami-title');
  let frame = 0;
  const totalFrames = 22;
  const iv = setInterval(() => {
    titleEl.textContent = TARGET.split('').map((ch, i) => {
      if (ch === ' ' || ch === '\'' || ch === ';' || ch === ')') return ch;
      return frame > (i / TARGET.length) * totalFrames
        ? ch
        : CHARS_K[Math.floor(Math.random() * CHARS_K.length)].toLowerCase();
    }).join('');
    frame++;
    if (frame > totalFrames) clearInterval(iv);
  }, 55);

  // Animate in
  requestAnimationFrame(() => requestAnimationFrame(() => page.classList.add('show')));

  // Close
  document.getElementById('konami-close').addEventListener('click', () => {
    page.classList.remove('show');
    setTimeout(() => page.remove(), 500);
  });
  page.addEventListener('keydown', e => { if (e.key === 'Escape') document.getElementById('konami-close')?.click(); });
}

/* ════════════════════════════════════════════════
   LANGUAGE TOGGLE — FR ↔ EN with ripple
════════════════════════════════════════════════ */
(function initLang() {
  const btn    = document.getElementById('lang-toggle');
  const ripple = document.getElementById('lang-ripple');
  if (!btn || !ripple) return;

  const T = {
    fr: {
      'nav-about':      'À propos',
      'nav-skills':     'Compétences',
      'nav-projects':   'Projets',
      'nav-contact':    'Contact',
      'hero-sub':       'Développeur \u00a0·\u00a0 Designer \u00a0·\u00a0 Dessinateur',
      'btn-projects':   'Voir mes projets →',
      'btn-contact':    'Me contacter',
      'scroll':         'Défiler',
      'photo-tag':      '01 — À propos',
      'about-label':    'À propos de moi',
      'about-h2':       'À propos<br>de moi',
      'quote':          '"Je vois le web comme une expérience que l\'on doit apprécier, non comme une page vide que l\'on doit subir."',
      'about-p1':       'Bienvenue sur mon portfolio ! Je suis un étudiant passionné qui aime créer et innover dans le cadre de projets personnels et professionnels.',
      'about-p2':       'Je fais de mon mieux pour avoir un code propre et une expérience utilisateur des plus agréables.',
      'cv-btn':         'Découvrir mon CV',
      'skills-label':   '02 — Compétences',
      'skills-h2':      'Compétences',
      'backend-lbl':    'Backend & Outils',
      'design-lbl':     'Design & Création',
      'projects-label': '03 — Projets',
      'projects-h2':    'Projets',
      'thumb-preview':  'Aperçu projet',
      'thumb-preview2': 'Aperçu',
      'cryptex-desc':   'Dashboard de suivi de cryptomonnaies en temps réel via API. Accent sur la lisibilité des données et une expérience utilisateur fluide sans rechargement de page.',
      'view-project':   'Voir le projet →',
      'proj2-name':     'Projet Deux',
      'proj2-desc':     'Emplacement réservé pour un futur projet.',
      'proj3-name':     'Projet Trois',
      'proj3-desc':     'Emplacement réservé pour un futur projet.',
      'view-btn':       'Voir →',
      'contact-h2':     'Contactez moi',
      'avail-status':     'Ouvert aux opportunités',
      'avail-sub':        'BUT MMI 1ère année · IUT de Troyes',
      'avail-tag-contract': 'Stage',
      'avail-tag-location': 'Troyes · Remote OK',
      'avail-cta':        'Me contacter →',
      'marquee-dev':    'Développeur',
      'marquee-draw':   'Dessinateur',
    },
    en: {
      'nav-about':      'About',
      'nav-skills':     'Skills',
      'nav-projects':   'Projects',
      'nav-contact':    'Contact',
      'hero-sub':       'Developer \u00a0·\u00a0 Designer \u00a0·\u00a0 Illustrator',
      'btn-projects':   'See my projects →',
      'btn-contact':    'Get in touch',
      'scroll':         'Scroll',
      'photo-tag':      '01 — About',
      'about-label':    'About me',
      'about-h2':       'About<br>me',
      'quote':          '"I see the web as an experience to be enjoyed, not a blank page to be endured."',
      'about-p1':       'Welcome to my portfolio! I\'m a passionate student who loves creating and innovating through personal and professional projects.',
      'about-p2':       'I do my best to write clean code and deliver the most pleasant user experience possible.',
      'cv-btn':         'Discover my CV',
      'skills-label':   '02 — Skills',
      'skills-h2':      'Skills',
      'backend-lbl':    'Backend & Tools',
      'design-lbl':     'Design & Creation',
      'projects-label': '03 — Projects',
      'projects-h2':    'Projects',
      'thumb-preview':  'Preview',
      'thumb-preview2': 'Preview',
      'cryptex-desc':   'Real-time cryptocurrency tracking dashboard via API. Focus on data readability and a smooth user experience with no page reload.',
      'view-project':   'View project →',
      'proj2-name':     'Project Two',
      'proj2-desc':     'Placeholder for a future project.',
      'proj3-name':     'Project Three',
      'proj3-desc':     'Placeholder for a future project.',
      'view-btn':       'View →',
      'contact-h2':     'Get in touch',
      'avail-status':     'Open to opportunities',
      'avail-sub':        'BUT MMI 2nd year · IUT de Troyes',
      'avail-tag-contract': 'Internship',
      'avail-tag-location': 'Troyes · Remote OK',
      'avail-cta':        'Get in touch →',
      'marquee-dev':    'Developer',
      'marquee-draw':   'Illustrator',
    }
  };

  let lang = localStorage.getItem('lang') || 'fr';
  let lastX = window.innerWidth / 2, lastY = window.innerHeight / 2;
  document.addEventListener('mousemove', e => { lastX = e.clientX; lastY = e.clientY; });

  function applyLang(l, animate) {
    const dict = T[l];

    function swap() {
      document.documentElement.lang = l;
      btn.textContent = l === 'fr' ? 'EN' : 'FR';

      // text nodes — use innerHTML to preserve &nbsp; and other entities
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (dict[key] !== undefined) el.innerHTML = dict[key];
      });
      // innerHTML (elements with <br> etc)
      document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.dataset.i18nHtml;
        if (dict[key] !== undefined) el.innerHTML = dict[key];
      });
      // marquee special items
      document.querySelectorAll('[data-i18n-marquee]').forEach(el => {
        const mk = 'marquee-' + el.dataset.i18nMarquee;
        if (dict[mk] !== undefined) {
          const dot = el.querySelector('.mdot');
          el.textContent = dict[mk];
          if (dot) el.appendChild(dot);
        }
      });
    }

    if (!animate) { swap(); return; }

    ripple.style.left       = lastX + 'px';
    ripple.style.top        = lastY + 'px';
    ripple.style.transform  = 'scale(0)';
    ripple.style.opacity    = '1';
    ripple.classList.remove('expand', 'fade');

    requestAnimationFrame(() => {
      ripple.classList.add('expand');
      setTimeout(() => {
        swap();
        btn.classList.add('spinning');
        setTimeout(() => btn.classList.remove('spinning'), 380);
        ripple.classList.add('fade');
        setTimeout(() => {
          ripple.style.transform = 'scale(0)';
          ripple.classList.remove('expand', 'fade');
        }, 600);
      }, 300);
    });
  }

  applyLang(lang, false);

  btn.addEventListener('click', () => {
    lang = lang === 'fr' ? 'en' : 'fr';
    localStorage.setItem('lang', lang);
    applyLang(lang, true);
  });
})();

/* ════════════════════════════════════════════════
   SCROLL PROGRESS BAR
════════════════════════════════════════════════ */
const scrollBar = document.getElementById('scroll-bar');
if (scrollBar) {
  document.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollBar.style.width = (window.scrollY / max * 100) + '%';
  }, { passive: true });
}

/* ════════════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════════════ */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));