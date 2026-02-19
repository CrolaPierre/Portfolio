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


// CP2077 Night City Map background
function createNightCityMap() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0'; canvas.style.left = '0';
    canvas.style.width = '100%'; canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');
    let W, H, blocks, blips, pings, waypoint;

    function mkRand(seed) {
        let s = seed;
        return () => { s = (s * 16807) % 2147483647; return (s-1)/2147483646; };
    }
    const r = mkRand(9999);

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
        build();
    }

    // Density map — center is hottest
    function density(x, y) {
        const dx = (x / W) - 0.48, dy = (y / H) - 0.45;
        const d  = Math.sqrt(dx*dx + dy*dy);
        return Math.max(0, 1 - d * 2.2);
    }

    function build() {
        blocks = [];
        // Tile the screen with city blocks of varying sizes
        let y = 0;
        while (y < H) {
            const rowH = 10 + Math.floor(r() * 22);
            let x = 0;
            while (x < W) {
                const bw = 12 + Math.floor(r() * 35);
                const dens = density(x + bw/2, y + rowH/2);

                // Only draw if dense enough
                if (r() < dens * 0.85 + 0.05) {
                    // Color based on density: hot=red, mid=dark red, edge=very dim
                    const heat = dens;
                    let rc, gc, bc, alpha;
                    if (heat > 0.7) {
                        // Core: bright red blocks
                        rc = 180 + Math.floor(r()*40);
                        gc = 20  + Math.floor(r()*25);
                        bc = 30  + Math.floor(r()*20);
                        alpha = 0.12 + heat * 0.1;
                    } else if (heat > 0.35) {
                        // Mid: dark red
                        rc = 100 + Math.floor(r()*60);
                        gc = 15  + Math.floor(r()*20);
                        bc = 20  + Math.floor(r()*15);
                        alpha = 0.06 + heat * 0.08;
                    } else {
                        // Edge: very dim brownish
                        rc = 50 + Math.floor(r()*30);
                        gc = 10 + Math.floor(r()*10);
                        bc = 10 + Math.floor(r()*10);
                        alpha = 0.03 + heat * 0.05;
                    }

                    // Road gap between blocks (2-4px)
                    const gap = 2 + Math.floor(r() * 3);
                    blocks.push({ x: x+gap, y: y+gap, w: bw-gap*2, h: rowH-gap*2, r: rc, g: gc, b: bc, a: alpha, heat });
                }
                x += bw;
            }
            y += rowH;
        }

        // Major roads — bright yellow/white lines along grid seams
        // (drawn as the gaps between blocks, so the grid itself IS the road network)

        // Moving blips
        blips = Array.from({ length: 25 }, () => ({
            x: r()*W, y: r()*H,
            vx: (r()-0.5)*0.5, vy: (r()-0.5)*0.5,
            enemy: r() > 0.55,
            size: 1.5 + r()*1.8,
            phase: r()*Math.PI*2,
        }));

        // Pings at hotspots
        pings = [
            { x: W*0.48, y: H*0.45 },
            { x: W*0.25, y: H*0.3  },
            { x: W*0.7,  y: H*0.6  },
            { x: W*0.35, y: H*0.7  },
        ].map(p => ({ ...p, phase: r()*Math.PI*2 }));

        waypoint = { x: W*0.48, y: H*0.44, pulse: 0 };
    }

    // Road highlight lines — drawn over the block grid
    function drawRoads() {
        // Major arteries as bright lines
        const arteries = [
            [[0, H*0.45], [W*0.3, H*0.42], [W*0.55, H*0.44], [W*0.8, H*0.48], [W, H*0.5]],
            [[W*0.47, 0], [W*0.48, H*0.3], [W*0.5, H*0.55], [W*0.49, H*0.8], [W*0.48, H]],
            [[0, H*0.2], [W*0.25, H*0.28], [W*0.5, H*0.35], [W*0.75, H*0.25], [W, H*0.2]],
            [[0, H*0.75],[W*0.3, H*0.68], [W*0.6, H*0.72], [W, H*0.78]],
            [[W*0.2,0],  [W*0.22,H*0.35], [W*0.28,H*0.65], [W*0.25,H]],
            [[W*0.75,0], [W*0.73,H*0.3],  [W*0.78,H*0.65], [W*0.75,H]],
        ];

        arteries.forEach((pts, i) => {
            const isMajor = i < 2;
            // Glow pass
            ctx.beginPath();
            ctx.moveTo(pts[0][0], pts[0][1]);
            pts.slice(1).forEach(p => ctx.lineTo(p[0], p[1]));
            ctx.strokeStyle = isMajor ? 'rgba(220,80,60,0.15)' : 'rgba(180,50,40,0.1)';
            ctx.lineWidth   = isMajor ? 8 : 5;
            ctx.stroke();
            // Core
            ctx.beginPath();
            ctx.moveTo(pts[0][0], pts[0][1]);
            pts.slice(1).forEach(p => ctx.lineTo(p[0], p[1]));
            ctx.strokeStyle = isMajor ? 'rgba(240,100,80,0.35)' : 'rgba(200,70,60,0.2)';
            ctx.lineWidth   = isMajor ? 1.5 : 0.8;
            ctx.stroke();
        });
    }

    let time = 0;

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // Very dark base
        ctx.fillStyle = 'rgba(6,4,8,1)';
        ctx.fillRect(0, 0, W, H);

        // City blocks
        blocks.forEach(b => {
            ctx.fillStyle = `rgba(${b.r},${b.g},${b.b},${b.a})`;
            ctx.fillRect(b.x, b.y, b.w, b.h);
            // Hot blocks get a bright edge
            if (b.heat > 0.6) {
                ctx.strokeStyle = `rgba(${b.r+40},${b.g},${b.b},0.25)`;
                ctx.lineWidth = 0.5;
                ctx.strokeRect(b.x, b.y, b.w, b.h);
            }
        });

        // Roads over blocks
        drawRoads();

        // Radial city glow — center hotspot
        const grd = ctx.createRadialGradient(W*0.48, H*0.44, 0, W*0.48, H*0.44, W*0.35);
        grd.addColorStop(0,   'rgba(160,30,40,0.08)');
        grd.addColorStop(0.5, 'rgba(120,20,30,0.04)');
        grd.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);

        // Pings
        pings.forEach(p => {
            p.phase += 0.015;
            for (let i = 0; i < 2; i++) {
                const ph     = (p.phase + i * Math.PI) % (Math.PI * 2);
                const radius = (ph / (Math.PI*2)) * 30;
                const alpha  = (1 - ph/(Math.PI*2)) * 0.18;
                ctx.beginPath();
                ctx.arc(p.x, p.y, radius, 0, Math.PI*2);
                ctx.strokeStyle = `rgba(245,180,60,${alpha})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }
        });

        // Waypoint
        waypoint.pulse += 0.018;
        for (let i = 0; i < 3; i++) {
            const ph     = (waypoint.pulse + i*(Math.PI*2/3)) % (Math.PI*2);
            const radius = (ph/(Math.PI*2)) * 40;
            const alpha  = (1 - ph/(Math.PI*2)) * 0.35;
            ctx.beginPath();
            ctx.arc(waypoint.x, waypoint.y, radius, 0, Math.PI*2);
            ctx.strokeStyle = `rgba(245,230,66,${alpha})`;
            ctx.lineWidth   = 0.8;
            ctx.stroke();
        }
        const ds = 5;
        ctx.save();
        ctx.translate(waypoint.x, waypoint.y);
        ctx.rotate(Math.PI/4);
        ctx.shadowColor = 'rgba(245,230,66,0.9)';
        ctx.shadowBlur  = 12;
        ctx.fillStyle   = 'rgba(245,230,66,0.95)';
        ctx.fillRect(-ds/2, -ds/2, ds, ds);
        ctx.shadowBlur  = 0;
        ctx.restore();
        // Crosshair
        ctx.strokeStyle = 'rgba(245,230,66,0.1)';
        ctx.lineWidth   = 0.5;
        ctx.setLineDash([5,10]);
        ctx.beginPath();
        ctx.moveTo(waypoint.x, 0);      ctx.lineTo(waypoint.x, H);
        ctx.moveTo(0, waypoint.y);      ctx.lineTo(W, waypoint.y);
        ctx.stroke();
        ctx.setLineDash([]);



        time += 0.016;
        requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    draw();
}

createNightCityMap();


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