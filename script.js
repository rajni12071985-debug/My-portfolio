// ===== THREE.JS 3D BACKGROUND =====
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas'), alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
camera.position.z = 30;

// Mouse tracking
const mouse = { x: 0, y: 0, nx: 0, ny: 0 };
document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.nx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ny = -(e.clientY / window.innerHeight) * 2 + 1;
    // Cursor glow
    const g = document.getElementById('cursor-glow');
    if (g) { g.style.left = e.clientX + 'px'; g.style.top = e.clientY + 'px'; }
});

// Materials
const purpleMat = new THREE.MeshBasicMaterial({ color: 0x7c3aed, wireframe: true, transparent: true, opacity: 0.12 });
const cyanMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true, transparent: true, opacity: 0.1 });
const pinkMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true, transparent: true, opacity: 0.08 });

// Geometries - floating 3D shapes
const shapes = [];
function addShape(geo, mat, pos, rotSpeed) {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.userData = { rotSpeed, origY: pos.y, phase: Math.random() * Math.PI * 2 };
    scene.add(mesh);
    shapes.push(mesh);
}

// Torus
addShape(new THREE.TorusGeometry(3, 0.8, 16, 50), purpleMat, { x: -18, y: 8, z: -10 }, { x: 0.003, y: 0.005 });
addShape(new THREE.TorusGeometry(2, 0.5, 16, 40), cyanMat, { x: 20, y: -6, z: -15 }, { x: 0.004, y: 0.003 });
// Icosahedron
addShape(new THREE.IcosahedronGeometry(2.5, 0), pinkMat, { x: 15, y: 10, z: -8 }, { x: 0.005, y: 0.004 });
addShape(new THREE.IcosahedronGeometry(1.8, 0), purpleMat, { x: -14, y: -8, z: -12 }, { x: 0.003, y: 0.006 });
// Octahedron
addShape(new THREE.OctahedronGeometry(2, 0), cyanMat, { x: -8, y: 14, z: -18 }, { x: 0.006, y: 0.003 });
addShape(new THREE.OctahedronGeometry(1.5, 0), pinkMat, { x: 22, y: 2, z: -20 }, { x: 0.004, y: 0.005 });
// Dodecahedron
addShape(new THREE.DodecahedronGeometry(2, 0), purpleMat, { x: 0, y: -12, z: -14 }, { x: 0.005, y: 0.002 });
addShape(new THREE.DodecahedronGeometry(1.5, 0), cyanMat, { x: -20, y: 0, z: -22 }, { x: 0.003, y: 0.004 });
// Torus Knot
addShape(new THREE.TorusKnotGeometry(2, 0.4, 60, 8), pinkMat, { x: 10, y: -14, z: -16 }, { x: 0.002, y: 0.003 });

// Particle field
const particleCount = 300;
const pGeo = new THREE.BufferGeometry();
const pPos = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
    pPos[i] = (Math.random() - 0.5) * 80;
}
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
const pMat = new THREE.PointsMaterial({ color: 0x7c3aed, size: 0.08, transparent: true, opacity: 0.5 });
const particleSystem = new THREE.Points(pGeo, pMat);
scene.add(particleSystem);

// Scroll offset
let scrollY = 0;
window.addEventListener('scroll', () => { scrollY = window.scrollY; });

// Animation loop
const clock = new THREE.Clock();
function animate3D() {
    requestAnimationFrame(animate3D);
    const t = clock.getElapsedTime();

    // Rotate shapes + floating motion
    shapes.forEach(s => {
        s.rotation.x += s.userData.rotSpeed.x;
        s.rotation.y += s.userData.rotSpeed.y;
        s.position.y = s.userData.origY + Math.sin(t + s.userData.phase) * 1.5;
    });

    // Mouse parallax on camera
    camera.position.x += (mouse.nx * 3 - camera.position.x) * 0.02;
    camera.position.y += (mouse.ny * 2 - camera.position.y) * 0.02;

    // Scroll parallax
    camera.rotation.x = scrollY * 0.0001;
    particleSystem.rotation.y = t * 0.02;
    particleSystem.rotation.x = t * 0.01;

    renderer.render(scene, camera);
}
animate3D();

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ===== LOADER =====
window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('loader').classList.add('hidden'), 800);
});

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
});

// Mobile menu
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
});
navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navMenu.classList.remove('open');
}));

// ===== 3D CARD TILT =====
document.querySelectorAll('.card-3d').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        const rx = ((y - r.height / 2) / r.height) * -10;
        const ry = ((x - r.width / 2) / r.width) * 10;
        card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`;
        // Move shine
        const shine = card.querySelector('.card-shine');
        if (shine) {
            shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(124,58,237,0.08) 0%, transparent 60%)`;
        }
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale3d(1,1,1)';
        const shine = card.querySelector('.card-shine');
        if (shine) shine.style.background = '';
    });
});

// ===== 3D AVATAR PARALLAX =====
const avatar3d = document.getElementById('avatar-3d');
if (avatar3d) {
    document.addEventListener('mousemove', e => {
        const x = (e.clientX / window.innerWidth - 0.5) * 25;
        const y = (e.clientY / window.innerHeight - 0.5) * 25;
        avatar3d.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg)`;
    });
}

// ===== SCROLL REVEAL =====
const animEls = document.querySelectorAll('[data-animate]');
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = parseInt(entry.target.dataset.delay || 0);
            setTimeout(() => entry.target.classList.add('visible'), delay);
            revealObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });
animEls.forEach(el => revealObs.observe(el));

// ===== SKILL BARS (MOBILE) =====
const skillObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.sbi-fill').forEach(b => {
                b.style.width = b.dataset.width + '%';
            });
            skillObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });
document.querySelectorAll('.skills-bars-mobile').forEach(el => skillObs.observe(el));

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth' });
    });
});

// ===== ANIMATED COUNTERS =====
function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    if (!target) return;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic for smooth deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target.toLocaleString();
        }
    }
    requestAnimationFrame(update);
}

// Observe all counter elements (hero stats + experience counters)
const counterEls = document.querySelectorAll('.stat-num[data-count], .counter-value[data-count]');
const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Small delay to let the fade-in animation start first
            setTimeout(() => animateCounter(entry.target), 300);
            counterObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });
counterEls.forEach(el => counterObs.observe(el));
