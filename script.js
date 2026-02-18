// Loader — CP2077 scan sequence
function initLoader() {
    const loader   = document.getElementById('loader');
    const barFill  = document.getElementById('loader-bar');
    const pctEl    = document.getElementById('loader-pct');
    const idEl     = document.getElementById('ld-id');
    const statusEl = document.getElementById('ld-status');
    const clrEl    = document.getElementById('ld-clr');

    if (!loader) return;

    const statusSeq = ['SCANNING', 'DETECTED', 'INDEXING', 'CONFIRMED'];
    const clrSeq    = ['VERIFYING', 'PROCESSING', 'GRANTED'];
    const idChars   = 'ABCDEF0123456789';
    const finalId   = 'CROLA-P // MMI-3';

    function randStr(len) {
        return Array.from({length: len}, () =>
            idChars[Math.floor(Math.random() * idChars.length)]
        ).join('');
    }

    function dismissLoader() {
        loader.classList.add('hidden');
        setTimeout(() => {
            if (loader.parentNode) loader.parentNode.removeChild(loader);
        }, 600);
    }

    // Animate progress over 2.5s then dismiss
    const totalDuration = 2500;
    let startTime = null;

    function tick(now) {
        if (!startTime) startTime = now;
        const elapsed = now - startTime;
        const pct = Math.min(Math.round((elapsed / totalDuration) * 100), 100);

        if (barFill) barFill.style.width = pct + '%';
        if (pctEl)   pctEl.textContent   = pct + '%';

        if (idEl)     idEl.textContent     = pct < 80 ? randStr(finalId.length) : finalId;
        if (statusEl) statusEl.textContent = statusSeq[Math.min(Math.floor((pct / 100) * statusSeq.length), statusSeq.length - 1)];
        if (clrEl)    clrEl.textContent    = clrSeq[Math.min(Math.floor((pct / 100) * clrSeq.length), clrSeq.length - 1)];

        if (pct < 100) {
            requestAnimationFrame(tick);
        } else {
            setTimeout(dismissLoader, 300);
        }
    }

    requestAnimationFrame(tick);
}

// Guarantee loader runs after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoader);
} else {
    initLoader();
}

// Smooth scroll for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active state to navigation based on scroll position
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Fade-in animation for sections on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});


// Matrix rain — palette Cyberpunk 2077
function createMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.12';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    const chars   = '01';
    const fontSize = 14;
    const columns  = Math.floor(canvas.width / fontSize);
    const drops    = Array(columns).fill(1);

    // Couleurs CP2077 : jaune chrome → orange
    const colors = ['#F5E642', '#F5E642', '#F5E642', '#FF6B1A', '#c4b82e'];

    function draw() {
        // Fond semi-transparent pour l'effet traînée
        ctx.fillStyle = 'rgba(12, 12, 12, 0.06)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = fontSize + 'px "Share Tech Mono", monospace';

        for (let i = 0; i < drops.length; i++) {
            // Tête de goutte : blanc-jaune vif
            const isHead = drops[i] * fontSize < canvas.height * 0.1 ||
                           Math.random() > 0.98;

            ctx.fillStyle = isHead
                ? '#FFFFFF'
                : colors[Math.floor(Math.random() * colors.length)];

            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(draw, 50);
}

createMatrixRain();


console.log('%c⚡ PORTFOLIO LOADED', 'color: #F5E642; font-size: 16px; font-weight: bold; font-family: monospace;');
console.log('%cCyberpunk 2077 Theme — Night City never sleeps.', 'color: #FF6B1A; font-size: 12px; font-family: monospace;');

// =================== GAME HUD ===================
function initHUD() {
    const clock      = document.getElementById('hud-clock');
    const cursorEl   = document.getElementById('hud-cursor');
    const sectionEl  = document.getElementById('hud-section');
    const scrollPct  = document.getElementById('hud-scroll-pct');
    const progressEl = document.getElementById('hud-progress');

    const sectionNames = {
        'about':        'ABOUT // CROLA.P',
        'education':    'EDUCATION // RECORDS',
        'projects':     'PROJECTS // WORKS',
        'skills':       'SKILLS // DEV',
        'skills-divers':'SKILLS // DESIGN',
        'contact':      'CONTACT // LINK',
    };

    // Clock
    function updateClock() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        if (clock) clock.textContent = h + ':' + m + ':' + s;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Cursor coordinates
    document.addEventListener('mousemove', (e) => {
        if (!cursorEl) return;
        const x = String(e.clientX).padStart(4, '0');
        const y = String(e.clientY).padStart(4, '0');
        cursorEl.textContent = 'X:' + x + ' Y:' + y;
    });

    // Scroll progress + current section
    function updateScroll() {
        const scrolled  = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const pct       = maxScroll > 0 ? Math.round((scrolled / maxScroll) * 100) : 0;

        if (scrollPct)  scrollPct.textContent  = String(pct).padStart(3, '0') + '%';
        if (progressEl) progressEl.style.width = pct + '%';

        // Find current section
        let current = 'INIT';
        document.querySelectorAll('section').forEach(section => {
            if (window.scrollY >= section.offsetTop - 120) {
                const id = section.getAttribute('id');
                current = sectionNames[id] || id.toUpperCase();
            }
        });
        if (sectionEl) sectionEl.textContent = current;
    }

    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHUD);
} else {
    initHUD();
}