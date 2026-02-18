// Loader — CP2077 scan sequence
(function () {
    const loader   = document.getElementById('loader');
    const barFill  = document.getElementById('loader-bar');
    const pctEl    = document.getElementById('loader-pct');
    const idEl     = document.getElementById('ld-id');
    const statusEl = document.getElementById('ld-status');
    const clrEl    = document.getElementById('ld-clr');

    let pct = 0;
    const duration = 2200; // ms
    const steps    = 80;
    const interval = duration / steps;

    const statusSeq  = ['SCANNING', 'DETECTED', 'INDEXING', 'CONFIRMED'];
    const clrSeq     = ['VERIFYING', 'PROCESSING', 'GRANTED'];
    const idChars    = 'ABCDEF0123456789';
    const finalId    = 'CROLA-P // MMI-3';

    function randStr(len) {
        return Array.from({length: len}, () =>
            idChars[Math.floor(Math.random() * idChars.length)]
        ).join('');
    }

    const tick = setInterval(() => {
        pct += 100 / steps + (Math.random() * 0.8 - 0.4);
        pct  = Math.min(Math.round(pct), 100);

        barFill.style.width = pct + '%';
        pctEl.textContent   = pct + '%';

        // Identity scramble → resolve at 80%
        if (pct < 80)  idEl.textContent = randStr(finalId.length);
        else           idEl.textContent = finalId;

        // Status sequence
        const si = Math.floor((pct / 100) * statusSeq.length);
        statusEl.textContent = statusSeq[Math.min(si, statusSeq.length - 1)];

        // Clearance sequence
        const ci = Math.floor((pct / 100) * clrSeq.length);
        clrEl.textContent = clrSeq[Math.min(ci, clrSeq.length - 1)];

        if (pct >= 100) {
            clearInterval(tick);
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => loader.remove(), 600);
            }, 300);
        }
    }, interval);
})();

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