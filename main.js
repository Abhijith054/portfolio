/* ═══════════════════════════════════════════════════════════════════
   ABHIJITH U · F1 CYBERPUNK AI PORTFOLIO — main.js
═══════════════════════════════════════════════════════════════════ */

'use strict';

/* ─── GLOBALS ─── */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let scrollY = 0;
let currentSection = 0;
const sections = ['paddock','telemetry','specs','circuit','trophies','garage','pitstop'];
const sectionEls = sections.map(id => document.getElementById(id));

/* ═══════════════════════════════════════════════════════════════════
   1. LOADING SCREEN
═══════════════════════════════════════════════════════════════════ */
(function initLoader() {
  const loader     = $('#loader');
  const bar        = $('#loader-bar');
  const pct        = $('#loader-percent');
  const seq        = $('#loader-sequence');
  const lGpu       = $('#l-gpu');
  const lNeural    = $('#l-neural');
  const lAi        = $('#l-ai');
  const loaderCanvas = $('#loader-canvas');

  const sequences = [
    'NEURAL CORE BOOT SEQUENCE v4.2.1',
    'LOADING AI SUBSYSTEMS...',
    'CALIBRATING TELEMETRY ARRAYS...',
    'INITIALIZING RACE CONTROL MATRIX...',
    'ACTIVATING CYBERNETIC INTERFACE...',
    'DEPLOYING HOLOGRAPHIC SYSTEMS...',
    'ALL SYSTEMS NOMINAL — RACE MODE ACTIVE'
  ];

  // Loader canvas — grid lines + scan
  if (loaderCanvas) {
    loaderCanvas.width  = window.innerWidth;
    loaderCanvas.height = window.innerHeight;
    const lctx = loaderCanvas.getContext('2d');

    function drawLoaderBg() {
      lctx.clearRect(0, 0, loaderCanvas.width, loaderCanvas.height);
      lctx.strokeStyle = 'rgba(255,26,26,0.04)';
      lctx.lineWidth = 1;
      const step = 60;
      for (let x = 0; x < loaderCanvas.width; x += step) {
        lctx.beginPath(); lctx.moveTo(x, 0); lctx.lineTo(x, loaderCanvas.height); lctx.stroke();
      }
      for (let y = 0; y < loaderCanvas.height; y += step) {
        lctx.beginPath(); lctx.moveTo(0, y); lctx.lineTo(loaderCanvas.width, y); lctx.stroke();
      }
      // diagonal accent
      lctx.strokeStyle = 'rgba(255,26,26,0.06)';
      for (let i = -loaderCanvas.height; i < loaderCanvas.width; i += 120) {
        lctx.beginPath(); lctx.moveTo(i, 0); lctx.lineTo(i + loaderCanvas.height, loaderCanvas.height); lctx.stroke();
      }
    }
    drawLoaderBg();
  }

  let progress = 0;
  let seqIndex = 0;

  const interval = setInterval(() => {
    const increment = Math.random() * 4 + 1;
    progress = Math.min(100, progress + increment);
    bar.style.width = progress + '%';
    pct.textContent = Math.floor(progress) + '%';
    lGpu.textContent    = Math.min(100, Math.floor(progress * 0.9)) + '%';
    lNeural.textContent = Math.min(100, Math.floor(progress * 1.05)) + '%';

    const si = Math.floor((progress / 100) * sequences.length);
    if (si !== seqIndex && si < sequences.length) {
      seqIndex = si;
      seq.textContent = sequences[seqIndex];
    }
    if (progress >= 60) lAi.textContent = 'ONLINE';
    if (progress >= 100) {
      clearInterval(interval);
      lAi.textContent = 'NOMINAL';
      setTimeout(() => {
        loader.classList.add('done');
        initAll();
      }, 600);
    }
  }, 40);
})();

/* ═══════════════════════════════════════════════════════════════════
   2. INIT ALL (runs after loader)
═══════════════════════════════════════════════════════════════════ */
function initAll() {
  initCursor();
  initNav();
  initHeroCanvas();
  initParticles();
  initLightStreaks();
  /* hero subtitle is static — typing disabled for cinematic center layout */
  initHUDStats();
  initClock();
  initScrollWatcher();
  initReveal();
  initSkillBars();
  initSparklines();
  initSpeedGraph();
  initContactForm();
  initCarParticles();
  initScrollAcceleration();
}

/* ═══════════════════════════════════════════════════════════════════
   3. CUSTOM CURSOR
═══════════════════════════════════════════════════════════════════ */
function initCursor() {
  const cursor = $('#cursor');
  const trail  = $('#cursor-trail');
  let tx = mouse.x, ty = mouse.y;

  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });

  (function animTrail() {
    tx += (mouse.x - tx) * 0.12;
    ty += (mouse.y - ty) * 0.12;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(animTrail);
  })();

  // Click burst
  document.addEventListener('click', e => {
    const burst = document.createElement('div');
    burst.style.cssText = `
      position:fixed; left:${e.clientX}px; top:${e.clientY}px;
      width:4px; height:4px; border-radius:50%;
      background:var(--red); pointer-events:none; z-index:99999;
      transform:translate(-50%,-50%);
      animation:cursor-burst 0.6s ease-out forwards;
    `;
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 600);
  });

  // Inject burst keyframe
  const s = document.createElement('style');
  s.textContent = `
    @keyframes cursor-burst {
      0%   { transform:translate(-50%,-50%) scale(1); opacity:1; box-shadow:0 0 0 0 rgba(255,26,26,.6); }
      100% { transform:translate(-50%,-50%) scale(0.5); opacity:0; box-shadow:0 0 0 30px rgba(255,26,26,0); }
    }`;
  document.head.appendChild(s);
}

/* ═══════════════════════════════════════════════════════════════════
   4. NAVIGATION
═══════════════════════════════════════════════════════════════════ */
function initNav() {
  const nav       = $('#nav');
  const hamburger = $('#nav-hamburger');
  const navLinks  = $('#nav-links');
  const overlay   = $('#mobile-nav-overlay');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    overlay.classList.toggle('open', open);
    hamburger.querySelectorAll('span')[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
    hamburger.querySelectorAll('span')[1].style.opacity   = open ? '0' : '1';
    hamburger.querySelectorAll('span')[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
  });

  overlay.addEventListener('click', () => {
    navLinks.classList.remove('open');
    overlay.classList.remove('open');
  });

  // Smooth scroll + close mobile nav
  $$('.nav-link, a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      navLinks.classList.remove('open');
      overlay.classList.remove('open');
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════
   5. HERO CANVAS — Particle field + tunnel effect
═══════════════════════════════════════════════════════════════════ */
function initHeroCanvas() {
  const canvas = $('#hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Stars / tunnel particles
  const STAR_COUNT = 200;
  const stars = Array.from({ length: STAR_COUNT }, () => newStar());

  function newStar(born = false) {
    const angle = Math.random() * Math.PI * 2;
    const r = born ? Math.random() * 20 : Math.random() * Math.max(canvas.width, canvas.height) * 0.6;
    return {
      angle,
      r,
      speed: Math.random() * 4 + 1,
      size:  Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      color: Math.random() > 0.7 ? '#ff1a1a' : '#ffffff',
      tail:  [],
    };
  }

  let speedMult = 1;

  function drawHeroCanvas() {
    const cx = canvas.width  / 2;
    const cy = canvas.height / 2;

    ctx.fillStyle = 'rgba(5,5,5,0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
      const x = cx + Math.cos(star.angle) * star.r;
      const y = cy + Math.sin(star.angle) * star.r;

      // Draw tail
      if (star.tail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(star.tail[0].x, star.tail[0].y);
        star.tail.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.strokeStyle = star.color === '#ff1a1a' ? 'rgba(255,26,26,0.3)' : 'rgba(255,255,255,0.15)';
        ctx.lineWidth   = star.size * 0.5;
        ctx.stroke();
      }

      // Draw star
      ctx.beginPath();
      ctx.arc(x, y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = star.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Update
      star.tail.push({ x, y });
      if (star.tail.length > 8) star.tail.shift();

      star.r += star.speed * speedMult;
      if (star.r > Math.max(canvas.width, canvas.height) * 0.7) {
        Object.assign(star, newStar(true));
        star.tail = [];
      }
    });

    // Radial glow at center
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 300);
    grad.addColorStop(0,   'rgba(255,0,60,0.04)');
    grad.addColorStop(0.5, 'rgba(255,26,26,0.02)');
    grad.addColorStop(1,   'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    requestAnimationFrame(drawHeroCanvas);
  }
  drawHeroCanvas();

  // Export speed multiplier setter
  window._setHeroSpeed = v => { speedMult = v; };
}

/* ═══════════════════════════════════════════════════════════════════
   6. FLOATING PARTICLES
═══════════════════════════════════════════════════════════════════ */
function initParticles() {
  const container = $('#particle-container');
  if (!container) return;

  function spawnParticle() {
    const el = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const isRed = Math.random() > 0.5;
    const startX = Math.random() * 100;
    const dur = Math.random() * 8 + 4;
    const delay = Math.random() * 6;

    el.style.cssText = `
      position: absolute;
      left: ${startX}%;
      bottom: -10px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${isRed ? 'var(--red)' : 'rgba(255,255,255,0.6)'};
      box-shadow: 0 0 ${size * 3}px ${isRed ? 'var(--red)' : 'rgba(255,255,255,0.4)'};
      animation: float-up ${dur}s linear ${delay}s infinite;
      pointer-events: none;
    `;
    container.appendChild(el);
  }

  // Inject float-up keyframe
  const s = document.createElement('style');
  s.textContent = `
    @keyframes float-up {
      0%   { transform: translateY(0) translateX(0); opacity: 0; }
      10%  { opacity: 1; }
      90%  { opacity: 0.6; }
      100% { transform: translateY(-100vh) translateX(${(Math.random()-0.5)*100}px); opacity: 0; }
    }`;
  document.head.appendChild(s);

  for (let i = 0; i < 60; i++) spawnParticle();
}

/* ═══════════════════════════════════════════════════════════════════
   7. LIGHT STREAKS
═══════════════════════════════════════════════════════════════════ */
function initLightStreaks() {
  const container = $('#light-streaks');
  if (!container) return;

  function spawnStreak() {
    const el = document.createElement('div');
    const y = Math.random() * 100;
    const w = Math.random() * 200 + 60;
    const dur = Math.random() * 1.5 + 0.5;
    const delay = Math.random() * 6;
    const isRed = Math.random() > 0.4;

    el.style.cssText = `
      position: absolute;
      top: ${y}%;
      left: -${w}px;
      width: ${w}px;
      height: 1px;
      background: linear-gradient(90deg, transparent, ${isRed ? 'rgba(255,26,26,0.8)' : 'rgba(255,255,255,0.4)'}, transparent);
      box-shadow: 0 0 6px ${isRed ? 'rgba(255,26,26,0.5)' : 'rgba(255,255,255,0.2)'};
      animation: streak-move ${dur}s linear ${delay}s infinite;
      pointer-events: none;
    `;
    container.appendChild(el);
  }

  const s = document.createElement('style');
  s.textContent = `
    @keyframes streak-move {
      0%   { transform: translateX(0); opacity: 0; }
      5%   { opacity: 1; }
      95%  { opacity: 0.8; }
      100% { transform: translateX(calc(100vw + 300px)); opacity: 0; }
    }`;
  document.head.appendChild(s);

  for (let i = 0; i < 30; i++) spawnStreak();
}

/* ═══════════════════════════════════════════════════════════════════
   8. HERO ROLE TYPING
═══════════════════════════════════════════════════════════════════ */
function initHeroRoleTyping() {
  const el = $('#hero-role');
  if (!el) return;

  const roles = [
    'AI Developer',
    'ML Engineer',
    'Full Stack Developer',
    'GDG Media Facilitator',
    'IEEE Member',
    'Vision Systems Builder',
    'LLM Integration Expert',
  ];
  let ri = 0, ci = 0, deleting = false;

  function type() {
    const target = roles[ri];
    if (!deleting) {
      el.textContent = target.slice(0, ++ci);
      if (ci === target.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
      setTimeout(type, 80);
    } else {
      el.textContent = target.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        ri = (ri + 1) % roles.length;
        setTimeout(type, 300);
        return;
      }
      setTimeout(type, 40);
    }
  }
  type();
}

/* ═══════════════════════════════════════════════════════════════════
   9. HUD STATS — animated counters
═══════════════════════════════════════════════════════════════════ */
function initHUDStats() {
  const stats = {
    speed:  { el: $('#stat-speed'),  target: 324,   current: 0,  step: 8 },
    ai:     { el: $('#stat-ai'),     target: 87,    current: 0,  step: 2 },
    neural: { el: $('#stat-neural'), target: 4096,  current: 0,  step: 100 },
    gpu:    { el: $('#stat-gpu'),    target: 94,    current: 0,  step: 2 },
  };

  let lapNum = 1;
  const lapEl = $('#stat-lap');

  function tick() {
    Object.values(stats).forEach(s => {
      if (!s.el) return;
      s.current = Math.min(s.target, s.current + s.step * (Math.random() + 0.5));
      const displayed = Math.floor(s.current);
      s.el.textContent = displayed;
      // Fluctuate slightly
      if (s.current >= s.target) {
        s.target = s.target + (Math.random() - 0.5) * s.step * 4;
        s.target = Math.max(s.target * 0.7, Math.min(s.target * 1.3, s.target));
      }
    });
    setTimeout(tick, 80);
  }
  tick();

  // Lap counter syncs with section
  window._setLap = n => {
    if (lapEl) lapEl.textContent = String(n).padStart(2, '0');
  };

  // DRS toggle
  const drsEl = $('#rh-drs');
  setInterval(() => {
    const on = Math.random() > 0.5;
    if (drsEl) { drsEl.textContent = on ? 'ACTIVE' : 'OFF'; drsEl.classList.toggle('on', on); }
  }, 3000);

  // Gear
  const gears = ['N','1','2','3','4','5','6','7','8'];
  const gearEl = $('#rh-gear');
  setInterval(() => {
    if (gearEl) gearEl.textContent = gears[Math.floor(Math.random() * gears.length)];
  }, 1200);
}

/* ═══════════════════════════════════════════════════════════════════
   10. CLOCK
═══════════════════════════════════════════════════════════════════ */
function initClock() {
  const el = $('#rh-time');
  if (!el) return;
  const start = Date.now();
  setInterval(() => {
    const elapsed = Date.now() - start;
    const h = String(Math.floor(elapsed / 3600000)).padStart(2, '0');
    const m = String(Math.floor((elapsed % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((elapsed % 60000) / 1000)).padStart(2, '0');
    el.textContent = `${h}:${m}:${s}`;
  }, 1000);
}

/* ═══════════════════════════════════════════════════════════════════
   11. SCROLL WATCHER — sections, nav active, HUD sectors
═══════════════════════════════════════════════════════════════════ */
function initScrollWatcher() {
  const navLinks = $$('.nav-link');
  const lhSectors = $$('.lh-sector');
  const navSectorNum = $('#nav-sector-num');
  const lhFill = $('#lh-progress-fill');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      const idx = sections.indexOf(id);
      if (idx === -1) return;
      currentSection = idx;

      // Nav link active
      navLinks.forEach((a, i) => a.classList.toggle('active', i === idx));
      if (navSectorNum) navSectorNum.textContent = String(idx + 1).padStart(2, '0');

      // Left HUD sectors
      lhSectors.forEach((s, i) => s.classList.toggle('active', i === idx));

      // Lap counter
      if (window._setLap) window._setLap(idx + 1);

      // Progress fill (roughly)
      if (lhFill) lhFill.style.height = `${(idx / (sections.length - 1)) * 100}%`;
    });
  }, { threshold: 0.3 });

  sectionEls.forEach(el => { if (el) observer.observe(el); });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  }, { passive: true });
}

/* ═══════════════════════════════════════════════════════════════════
   12. REVEAL ON SCROLL
═══════════════════════════════════════════════════════════════════ */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  $$('.reveal-section, .reveal-item').forEach(el => obs.observe(el));

  // Stagger reveal for grid children
  const gridObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const children = entry.target.querySelectorAll(
        '.skill-card, .spec-category, .project-card, .trophy-card, .timeline-item'
      );
      children.forEach((child, i) => {
        setTimeout(() => {
          child.style.opacity = '1';
          child.style.transform = 'translateY(0)';
        }, i * 100);
      });
      gridObs.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  $$('.skills-grid, .specs-grid, .projects-grid, .trophies-grid, .timeline').forEach(el => {
    // Set initial hidden state for children
    el.querySelectorAll('.skill-card, .spec-category, .project-card, .trophy-card, .timeline-item').forEach(c => {
      c.style.opacity = '0';
      c.style.transform = 'translateY(30px)';
      c.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    gridObs.observe(el);
  });
}

/* ═══════════════════════════════════════════════════════════════════
   13. SKILL BARS ANIMATION
═══════════════════════════════════════════════════════════════════ */
function initSkillBars() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const fills = entry.target.querySelectorAll('.scm-fill');
      fills.forEach(fill => {
        const pct = fill.style.getPropertyValue('--pct');
        // Animate by setting width after brief delay
        fill.style.width = '0';
        requestAnimationFrame(() => {
          setTimeout(() => { fill.style.width = pct; }, 100);
        });
      });
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  $$('.telemetry-section').forEach(el => obs.observe(el));
}

/* ═══════════════════════════════════════════════════════════════════
   14. SKILL SPARKLINES
═══════════════════════════════════════════════════════════════════ */
function initSparklines() {
  $$('.skill-sparkline').forEach(canvas => {
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    canvas.width  = parent.offsetWidth || 280;
    canvas.height = 40;

    // Generate random telemetry-like data
    const points = Array.from({ length: 30 }, (_, i) => {
      const base = 0.5 + Math.sin(i * 0.4) * 0.2 + Math.random() * 0.3;
      return Math.min(1, Math.max(0.05, base));
    });

    const w = canvas.width;
    const h = canvas.height;
    const step = w / (points.length - 1);

    // Draw gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0,   'rgba(255,26,26,0.3)');
    grad.addColorStop(1,   'rgba(255,26,26,0)');

    ctx.beginPath();
    ctx.moveTo(0, h - points[0] * h);
    points.forEach((p, i) => ctx.lineTo(i * step, h - p * h));
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    ctx.moveTo(0, h - points[0] * h);
    points.forEach((p, i) => ctx.lineTo(i * step, h - p * h));
    ctx.strokeStyle = '#ff1a1a';
    ctx.lineWidth   = 1.5;
    ctx.stroke();

    // Animate the "live" dot moving
    let dotPos = 0;
    function animDot() {
      // Redraw
      ctx.clearRect(0, 0, w, h);

      ctx.beginPath();
      ctx.moveTo(0, h - points[0] * h);
      points.forEach((p, i) => ctx.lineTo(i * step, h - p * h));
      ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
      ctx.fillStyle = grad; ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, h - points[0] * h);
      points.forEach((p, i) => ctx.lineTo(i * step, h - p * h));
      ctx.strokeStyle = '#ff1a1a'; ctx.lineWidth = 1.5; ctx.stroke();

      // Moving dot
      const idx = Math.floor(dotPos) % points.length;
      const dx  = idx * step;
      const dy  = h - points[idx] * h;
      ctx.beginPath();
      ctx.arc(dx, dy, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ff1a1a';
      ctx.shadowColor = '#ff1a1a'; ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      dotPos += 0.2;
      requestAnimationFrame(animDot);
    }
    animDot();
  });
}

/* ═══════════════════════════════════════════════════════════════════
   15. SPEED GRAPH (bottom HUD)
═══════════════════════════════════════════════════════════════════ */
function initSpeedGraph() {
  const canvas = $('#speed-graph-canvas');
  if (!canvas) return;
  canvas.width  = 200;
  canvas.height = 40;
  const ctx = canvas.getContext('2d');
  const data = Array.from({ length: 40 }, () => Math.random() * 0.8 + 0.1);

  function draw() {
    ctx.clearRect(0, 0, 200, 40);
    const step = 200 / (data.length - 1);

    const grad = ctx.createLinearGradient(0, 0, 0, 40);
    grad.addColorStop(0, 'rgba(255,26,26,0.4)');
    grad.addColorStop(1, 'rgba(255,26,26,0)');

    ctx.beginPath();
    ctx.moveTo(0, 40 - data[0] * 35);
    data.forEach((d, i) => ctx.lineTo(i * step, 40 - d * 35));
    ctx.lineTo(200, 40); ctx.lineTo(0, 40); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, 40 - data[0] * 35);
    data.forEach((d, i) => ctx.lineTo(i * step, 40 - d * 35));
    ctx.strokeStyle = '#ff1a1a'; ctx.lineWidth = 1.5; ctx.stroke();

    // Update data
    data.shift();
    data.push(Math.min(1, Math.max(0.05, data[data.length - 1] + (Math.random() - 0.5) * 0.3)));

    requestAnimationFrame(draw);
  }
  draw();
}

/* ═══════════════════════════════════════════════════════════════════
   16. CAR PARTICLES
═══════════════════════════════════════════════════════════════════ */
function initCarParticles() {
  const container = $('#car-particles');
  if (!container) return;

  function spawn() {
    const el = document.createElement('div');
    const x  = Math.random() * 100;
    const size = Math.random() * 4 + 1;
    const dur  = Math.random() * 1.5 + 0.5;
    el.style.cssText = `
      position:absolute; bottom:0; left:${x}%;
      width:${size}px; height:${size}px; border-radius:50%;
      background:var(--red); opacity:${Math.random() * 0.8 + 0.2};
      box-shadow:0 0 ${size * 2}px var(--red);
      animation:car-particle-up ${dur}s ease-out forwards;
      pointer-events:none;
    `;
    container.appendChild(el);
    setTimeout(() => el.remove(), dur * 1000);
  }

  const ks = document.createElement('style');
  ks.textContent = `
    @keyframes car-particle-up {
      0%   { transform:translate(0, 0) scale(1); opacity:1; }
      100% { transform:translate(${(Math.random()-0.5)*60}px, -80px) scale(0); opacity:0; }
    }`;
  document.head.appendChild(ks);

  setInterval(spawn, 150);
}

/* ═══════════════════════════════════════════════════════════════════
   17. SCROLL ACCELERATION (car + blur)
═══════════════════════════════════════════════════════════════════ */
function initScrollAcceleration() {
  const heroSection = document.getElementById('paddock');
  if (!heroSection) return;

  let lastScroll = 0;
  let blurEl = null;

  // Create motion blur overlay
  blurEl = document.createElement('div');
  blurEl.style.cssText = `
    position:fixed; inset:0; z-index:500; pointer-events:none;
    background:radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%);
    opacity:0; transition:opacity 0.3s ease;
  `;
  document.body.appendChild(blurEl);

  // Red flash on section change
  const flash = document.createElement('div');
  flash.style.cssText = `
    position:fixed; inset:0; z-index:501; pointer-events:none;
    background:linear-gradient(90deg, rgba(255,26,26,0.05), transparent);
    opacity:0;
  `;
  document.body.appendChild(flash);

  let lastSection = 0;

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    const delta = Math.abs(sy - lastScroll);
    lastScroll = sy;

    // Speed up hero canvas
    const spd = Math.min(6, 1 + delta * 0.1);
    if (window._setHeroSpeed) window._setHeroSpeed(spd);

    // Motion blur
    const blurAmt = Math.min(1, delta * 0.02);
    if (blurEl) blurEl.style.opacity = blurAmt;
    clearTimeout(blurEl._t);
    blurEl._t = setTimeout(() => { if (blurEl) blurEl.style.opacity = 0; }, 150);

    // Red sweep on section change
    if (currentSection !== lastSection) {
      lastSection = currentSection;
      flash.style.opacity = '1';
      setTimeout(() => { flash.style.opacity = '0'; }, 300);
    }

    // Update speedometer display from scroll velocity
    const speedEl = $('#stat-speed');
    if (speedEl) {
      const v = Math.min(340, 200 + delta * 5);
      speedEl.textContent = Math.floor(v);
    }
  }, { passive: true });
}

/* ═══════════════════════════════════════════════════════════════════
   18. CONTACT FORM — real-time email transmission
═══════════════════════════════════════════════════════════════════ */
function initContactForm() {
  const form       = $('#contact-form');
  const btn        = $('#pf-submit');
  const txPanel    = $('#cf-transmission-panel');
  const txFill     = $('#cf-tx-fill');
  const txSeq      = $('#cf-tx-seq');
  const txPct      = $('#cf-tx-pct');
  const successEl  = $('#pf-success');
  const errorEl    = $('#pf-error');
  const wrap       = form ? form.closest('.pitstop-form-wrap') : null;

  if (!form) return;

  const cfg = window.CONTACT_CONFIG || { recipientEmail: 'abhijithunni3234@gmail.com', provider: 'formsubmit', emailjs: {} };
  const RECIPIENT = cfg.recipientEmail || 'abhijithunni3234@gmail.com';

  const TX_STEPS = [
    'INITIALIZING NEURAL RELAY...',
    'ENCRYPTING MESSAGE PAYLOAD...',
    'ESTABLISHING SECURE UPLINK...',
    'ROUTING TO COMMAND INBOX...',
    'VERIFYING TRANSMISSION CHECKSUM...'
  ];

  const fields = {
    name:    { el: $('#cf-name'),    err: $('#cf-err-name') },
    email:   { el: $('#cf-email'),   err: $('#cf-err-email') },
    subject: { el: $('#cf-subject'), err: $('#cf-err-subject') },
    message: { el: $('#cf-msg'),     err: $('#cf-err-message') }
  };

  function clearFeedback() {
    if (successEl) { successEl.hidden = true; successEl.classList.remove('is-visible'); }
    if (errorEl)   { errorEl.hidden = true;   errorEl.classList.remove('is-visible'); }
    if (wrap) wrap.classList.remove('cf-success', 'cf-error', 'cf-sending');
  }

  function setFieldError(key, msg) {
    const f = fields[key];
    if (!f.el || !f.err) return;
    f.el.classList.toggle('pf-invalid', !!msg);
    f.el.closest('.pf-field')?.classList.toggle('has-error', !!msg);
    f.err.textContent = msg || '';
  }

  function clearFieldErrors() {
    Object.keys(fields).forEach(k => setFieldError(k, ''));
  }

  function validatePayload() {
    clearFieldErrors();
    let valid = true;
    const name    = fields.name.el?.value.trim() || '';
    const email   = fields.email.el?.value.trim() || '';
    const subject = fields.subject.el?.value.trim() || '';
    const message = fields.message.el?.value.trim() || '';
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (name.length < 2) {
      setFieldError('name', 'OPERATOR ID REQUIRED (MIN 2 CHARS)');
      valid = false;
    }
    if (!emailRx.test(email)) {
      setFieldError('email', 'INVALID COMM CHANNEL — ENTER VALID EMAIL');
      valid = false;
    }
    if (subject.length < 3) {
      setFieldError('subject', 'MISSION BRIEF REQUIRED');
      valid = false;
    }
    if (message.length < 10) {
      setFieldError('message', 'PAYLOAD TOO SHORT (MIN 10 CHARS)');
      valid = false;
    }

    return valid ? { name, email, subject, message } : null;
  }

  function useEmailJS() {
    const ej = cfg.emailjs || {};
    return cfg.provider === 'emailjs' &&
      ej.serviceId && ej.templateId && ej.publicKey &&
      typeof emailjs !== 'undefined';
  }

  function buildEmailBody(data, timestamp) {
    return [
      `Operator Name: ${data.name}`,
      `Email Channel: ${data.email}`,
      `Mission Brief: ${data.subject}`,
      `Message Payload: ${data.message}`,
      '',
      `Timestamp: ${timestamp}`,
      'System Status: MESSAGE TRANSMITTED'
    ].join('\n');
  }

  async function sendViaFormSubmit(data, timestamp) {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(RECIPIENT)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: '🚀 New AI Portfolio Contact Request',
        _captcha: 'false',
        _template: 'table',
        _replyto: data.email,
        name: data.name,
        email: data.email,
        operator_name: data.name,
        email_channel: data.email,
        mission_brief: data.subject,
        message_payload: data.message,
        timestamp,
        system_status: 'MESSAGE TRANSMITTED',
        message: buildEmailBody(data, timestamp)
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json().catch(() => ({}));
    if (json.success === 'false' || json.success === false) {
      throw new Error(json.message || 'Transmission rejected');
    }
    return json;
  }

  async function sendViaEmailJS(data, timestamp) {
    const ej = cfg.emailjs;
    emailjs.init(ej.publicKey);
    const result = await emailjs.send(ej.serviceId, ej.templateId, {
      operator_name: data.name,
      email_channel: data.email,
      mission_brief: data.subject,
      message_payload: data.message,
      timestamp,
      system_status: 'MESSAGE TRANSMITTED',
      reply_to: data.email,
      to_email: RECIPIENT
    });
    if (result.status && result.status >= 400) throw new Error('EmailJS transmission failed');
    return result;
  }

  async function transmitMessage(data) {
    const timestamp = new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'medium',
      timeZone: 'Asia/Kolkata'
    });
    if (useEmailJS()) {
      try {
        return await sendViaEmailJS(data, timestamp);
      } catch (err) {
        console.warn('[Contact] EmailJS failed, using FormSubmit fallback:', err);
      }
    }
    return sendViaFormSubmit(data, timestamp);
  }

  let progressTimer = null;
  let progressValue = 0;

  function setProgress(pct, stepIndex) {
    progressValue = pct;
    if (txFill) txFill.style.width = `${pct}%`;
    if (txPct) txPct.textContent = `${Math.round(pct)}%`;
    if (txSeq && TX_STEPS[stepIndex]) txSeq.textContent = TX_STEPS[stepIndex];
  }

  function startTransmissionHUD() {
    if (wrap) wrap.classList.add('cf-sending');
    form.classList.add('is-transmitting');
    if (txPanel) {
      txPanel.hidden = false;
      txPanel.setAttribute('aria-hidden', 'false');
    }
    if (btn) {
      btn.disabled = true;
      btn.classList.add('is-scanning');
      const txt = btn.querySelector('.pfs-text');
      if (txt) txt.textContent = 'SCANNING UPLINK...';
    }
    setProgress(0, 0);

    let step = 0;
    clearInterval(progressTimer);
    progressTimer = setInterval(() => {
      if (progressValue >= 88) return;
      const next = Math.min(progressValue + 4 + Math.random() * 6, 88);
      if (next > step * 18 && step < TX_STEPS.length - 1) step++;
      setProgress(next, Math.min(step, TX_STEPS.length - 1));
    }, 120);
  }

  function stopTransmissionHUD(success) {
    clearInterval(progressTimer);
    if (success) {
      setProgress(100, TX_STEPS.length - 1);
      if (txSeq) txSeq.textContent = 'TRANSMISSION COMPLETE — INBOX CONFIRMED';
    }
    setTimeout(() => {
      if (txPanel) {
        txPanel.hidden = true;
        txPanel.setAttribute('aria-hidden', 'true');
      }
      form.classList.remove('is-transmitting');
      if (wrap) wrap.classList.remove('cf-sending');
      setProgress(0, 0);
    }, success ? 900 : 400);
  }

  function showSuccess() {
    clearFeedback();
    if (wrap) wrap.classList.add('cf-success');
    if (successEl) {
      successEl.hidden = false;
      requestAnimationFrame(() => successEl.classList.add('is-visible'));
    }
    if (btn) {
      btn.style.display = 'none';
      btn.classList.remove('is-scanning');
    }
  }

  function showError() {
    clearFeedback();
    if (wrap) wrap.classList.add('cf-error');
    if (errorEl) {
      errorEl.hidden = false;
      requestAnimationFrame(() => errorEl.classList.add('is-visible'));
    }
    if (btn) {
      btn.disabled = false;
      btn.classList.remove('is-scanning');
      btn.style.display = '';
      const txt = btn.querySelector('.pfs-text');
      if (txt) txt.textContent = 'RETRY TRANSMISSION';
    }
  }

  function resetForm() {
    form.reset();
    clearFieldErrors();
    if (btn) {
      btn.disabled = false;
      btn.style.display = '';
      btn.classList.remove('is-scanning');
      const txt = btn.querySelector('.pfs-text');
      if (txt) txt.textContent = 'TRANSMIT MESSAGE';
    }
    setTimeout(() => {
      if (successEl) successEl.classList.remove('is-visible');
      if (wrap) wrap.classList.remove('cf-success');
      setTimeout(() => { if (successEl) successEl.hidden = true; }, 400);
    }, 5000);
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    clearFeedback();

    if ($('#cf-honey')?.value) return;

    const data = validatePayload();
    if (!data) {
      if (wrap) {
        wrap.classList.add('cf-error');
        setTimeout(() => wrap.classList.remove('cf-error'), 600);
      }
      return;
    }

    startTransmissionHUD();

    try {
      await transmitMessage(data);
      stopTransmissionHUD(true);
      await new Promise(r => setTimeout(r, 700));
      showSuccess();
      resetForm();
    } catch (err) {
      console.error('[Contact] Transmission failed:', err);
      stopTransmissionHUD(false);
      await new Promise(r => setTimeout(r, 350));
      showError();
    }
  });

  Object.values(fields).forEach(f => {
    f.el?.addEventListener('input', () => {
      const key = Object.keys(fields).find(k => fields[k].el === f.el);
      if (key) setFieldError(key, '');
      if (errorEl && !errorEl.hidden) {
        errorEl.classList.remove('is-visible');
        setTimeout(() => { errorEl.hidden = true; if (wrap) wrap.classList.remove('cf-error'); }, 300);
      }
    });
  });

  if (btn) {
    btn.addEventListener('mousemove', e => {
      if (btn.disabled) return;
      const rect = btn.getBoundingClientRect();
      const dx = e.clientX - rect.left - rect.width / 2;
      const dy = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${dx * 0.12}px, ${dy * 0.12}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  }
}

/* ═══════════════════════════════════════════════════════════════════
   19. MAGNETIC HOVER — btn-explore
═══════════════════════════════════════════════════════════════════ */
(function initMagneticButtons() {
  $$('.btn-explore, .btn-pitstop').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const dx = e.clientX - rect.left - rect.width  / 2;
      const dy = e.clientY - rect.top  - rect.height / 2;
      btn.style.transform = `translate(${dx * 0.15}px, ${dy * 0.15}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

/* ═══════════════════════════════════════════════════════════════════
   20. CORNER DECORATIONS — animated
═══════════════════════════════════════════════════════════════════ */
(function initCornerDeco() {
  // Project cards get pulsing corners on hover
  $$('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.querySelectorAll('.pc-corner').forEach(c => {
        c.style.boxShadow = '0 0 12px var(--red)';
      });
    });
    card.addEventListener('mouseleave', () => {
      card.querySelectorAll('.pc-corner').forEach(c => {
        c.style.boxShadow = '';
      });
    });
  });
})();

/* ═══════════════════════════════════════════════════════════════════
   21. SECTION BACKGROUND HOLOGRAPHIC LINES
═══════════════════════════════════════════════════════════════════ */
(function initHolographicLines() {
  $$('.section-bg-lines').forEach(el => {
    // Add animated diagonal line
    const diag = document.createElement('div');
    diag.style.cssText = `
      position:absolute; inset:0; pointer-events:none;
      overflow:hidden;
    `;
    const line = document.createElement('div');
    line.style.cssText = `
      position:absolute; top:0; left:-100%;
      width:60%; height:100%;
      background:linear-gradient(90deg, transparent, rgba(255,26,26,0.02), transparent);
      animation:holo-sweep 6s linear infinite;
    `;
    diag.appendChild(line);
    el.parentElement.appendChild(diag);
  });

  const ks = document.createElement('style');
  ks.textContent = `
    @keyframes holo-sweep {
      0%   { left:-60%; }
      100% { left:160%; }
    }`;
  document.head.appendChild(ks);
})();

/* ═══════════════════════════════════════════════════════════════════
   22. TROPHY CARD — tilt effect
═══════════════════════════════════════════════════════════════════ */
(function initCardTilt() {
  $$('.trophy-card, .project-card, .skill-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = (e.clientX - rect.left) / rect.width  - 0.5;
      const y    = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ═══════════════════════════════════════════════════════════════════
   23. STATS FLUCTUATION — live telemetry feel
═══════════════════════════════════════════════════════════════════ */
(function initLiveFluctuation() {
  // Make skill percentages fluctuate slightly
  $$('.sc-percent').forEach(el => {
    const base = parseInt(el.dataset.pct || el.textContent, 10);
    setInterval(() => {
      const v = base + Math.floor((Math.random() - 0.5) * 4);
      el.textContent = Math.max(0, Math.min(100, v)) + '%';
    }, 2000 + Math.random() * 3000);
  });
})();

/* ═══════════════════════════════════════════════════════════════════
   24. WINDOW RESIZE
═══════════════════════════════════════════════════════════════════ */
window.addEventListener('resize', () => {
  $$('.skill-sparkline').forEach(c => {
    c.width = c.parentElement.offsetWidth || 280;
  });
}, { passive: true });

/* ═══════════════════════════════════════════════════════════════════
   25. KEYBOARD NAVIGATION
═══════════════════════════════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown' || e.key === 'PageDown') {
    const next = sectionEls[Math.min(currentSection + 1, sectionEls.length - 1)];
    if (next) next.scrollIntoView({ behavior: 'smooth' });
  } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    const prev = sectionEls[Math.max(currentSection - 1, 0)];
    if (prev) prev.scrollIntoView({ behavior: 'smooth' });
  }
});

/* ═══════════════════════════════════════════════════════════════════
   26. PERFORMANCE OPTIMIZATION — pause canvas when hidden
═══════════════════════════════════════════════════════════════════ */
document.addEventListener('visibilitychange', () => {
  if (window._setHeroSpeed) {
    window._setHeroSpeed(document.hidden ? 0 : 1);
  }
});

/* ═══════════════════════════════════════════════════════════════════
   27. EASTER EGG — Konami Code → DRS BOOST
═══════════════════════════════════════════════════════════════════ */
(function initKonami() {
  const code = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let pos = 0;
  document.addEventListener('keydown', e => {
    if (e.key === code[pos]) {
      pos++;
      if (pos === code.length) {
        pos = 0;
        // DRS BOOST!
        if (window._setHeroSpeed) window._setHeroSpeed(12);
        document.body.style.filter = 'hue-rotate(0deg)';
        const notify = document.createElement('div');
        notify.style.cssText = `
          position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
          font-family:var(--font-hud); font-size:32px; color:var(--red);
          text-shadow:0 0 30px var(--red); z-index:99999; pointer-events:none;
          letter-spacing:6px; animation:konami-pop 2s ease-out forwards;
        `;
        notify.textContent = '⚡ DRS BOOST ACTIVATED ⚡';
        document.body.appendChild(notify);
        const ks = document.createElement('style');
        ks.textContent = `@keyframes konami-pop {
          0%{opacity:0;transform:translate(-50%,-50%) scale(0.5)}
          20%{opacity:1;transform:translate(-50%,-50%) scale(1.2)}
          80%{opacity:1;}
          100%{opacity:0;transform:translate(-50%,-50%) scale(1)}
        }`;
        document.head.appendChild(ks);
        setTimeout(() => {
          notify.remove();
          if (window._setHeroSpeed) window._setHeroSpeed(1);
        }, 2000);
      }
    } else { pos = 0; }
  });
})();

/* ═══════════════════════════════════════════════════════════════════
   28. INTERSECTION OBSERVER POLYFILL GUARD
═══════════════════════════════════════════════════════════════════ */
if (!window.IntersectionObserver) {
  // Fallback: show all sections
  $$('.reveal-section, .reveal-item').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}

console.log('%c⚡ ABHIJITH U · AI ENGINEER · F1 CYBERPUNK PORTFOLIO\n%cv4.2.1 — ALL SYSTEMS NOMINAL',
  'color:#ff1a1a; font-family:monospace; font-size:18px; font-weight:bold;',
  'color:#888; font-family:monospace; font-size:12px;'
);
