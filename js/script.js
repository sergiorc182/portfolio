// =============================
// FONDO DE PARTICULAS VIOLETAS
// =============================
const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const colors = ["#a855f7", "#c77dff", "#e0aaff", "#9d4edd"];
const numParticles = 80;

class Particle {
    constructor(x, y, radius, dx, dy, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20;
        ctx.fill();
    }

    update() {
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }

        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    }
}

function initParticles() {
    particlesArray = [];

    for (let i = 0; i < numParticles; i++) {
        const radius = Math.random() * 4 + 2;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = Math.random() * (canvas.height - radius * 2) + radius;
        const dx = (Math.random() - 0.5) * 1.5;
        const dy = (Math.random() - 0.5) * 1.5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        particlesArray.push(new Particle(x, y, radius, dx, dy, color));
    }
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach((particle) => particle.update());
}

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

initParticles();
animateParticles();

// =============================
// MENU MOBILE
// =============================
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".navbar ul");

if (menuToggle && navMenu) {
    const closeMenu = () => {
        navMenu.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
    };

    menuToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("active");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        document.body.classList.toggle("menu-open", isOpen);
    });

    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) {
            closeMenu();
        }
    });
}

// =============================
// EFECTO DE ESTRELLA FUGAZ
// =============================
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

if (!prefersReducedMotion && finePointer) {
    const cursorCanvas = document.createElement("canvas");
    document.body.appendChild(cursorCanvas);
    const cctx = cursorCanvas.getContext("2d");

    cursorCanvas.width = window.innerWidth;
    cursorCanvas.height = window.innerHeight;
    cursorCanvas.style.position = "fixed";
    cursorCanvas.style.top = "0";
    cursorCanvas.style.left = "0";
    cursorCanvas.style.pointerEvents = "none";
    cursorCanvas.style.zIndex = "999";

    let stars = [];

    class Star {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 2;
            this.opacity = 1;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
        }

        draw() {
            cctx.beginPath();
            cctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            cctx.fillStyle = `rgba(200, 0, 255, ${this.opacity})`;
            cctx.shadowColor = "#d400ff";
            cctx.shadowBlur = 20;
            cctx.fill();
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.opacity -= 0.02;
            this.draw();
        }
    }

    function animateStars() {
        requestAnimationFrame(animateStars);
        cctx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
        stars = stars.filter((star) => star.opacity > 0);
        stars.forEach((star) => star.update());
    }

    window.addEventListener("mousemove", (event) => {
        for (let i = 0; i < 5; i++) {
            stars.push(new Star(event.clientX, event.clientY));
        }
    });

    window.addEventListener("resize", () => {
        cursorCanvas.width = window.innerWidth;
        cursorCanvas.height = window.innerHeight;
    });

    animateStars();
}
