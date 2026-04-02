const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

setCanvasSize();

const particlesArray = [];
const colors = ["rgba(102, 227, 255, 0.8)", "rgba(139, 123, 255, 0.8)", "rgba(255, 255, 255, 0.55)"];
const numParticles = prefersReducedMotion ? 24 : 54;

class Particle {
    constructor() {
        this.reset(true);
    }

    reset(initial = false) {
        this.x = Math.random() * canvas.width;
        this.y = initial ? Math.random() * canvas.height : canvas.height + Math.random() * 40;
        this.radius = Math.random() * 2.6 + 1.2;
        this.speedX = (Math.random() - 0.5) * 0.25;
        this.speedY = Math.random() * 0.42 + 0.12;
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 18;
        ctx.fill();
    }

    update() {
        this.x += this.speedX;
        this.y -= this.speedY;

        if (this.y < -20 || this.x < -20 || this.x > canvas.width + 20) {
            this.reset();
        }

        this.draw();
    }
}

for (let i = 0; i < numParticles; i++) {
    particlesArray.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach((particle) => particle.update());
    if (!prefersReducedMotion) {
        requestAnimationFrame(animateParticles);
    }
}

animateParticles();

window.addEventListener("resize", () => {
    setCanvasSize();
});

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

const revealElements = document.querySelectorAll(".reveal");

if (revealElements.length) {
    if (prefersReducedMotion) {
        revealElements.forEach((element) => element.classList.add("is-visible"));
    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.16,
            rootMargin: "0px 0px -40px 0px"
        });

        revealElements.forEach((element) => observer.observe(element));
    }
}

if (!prefersReducedMotion && finePointer) {
    const cursorCanvas = document.createElement("canvas");
    document.body.appendChild(cursorCanvas);
    const cctx = cursorCanvas.getContext("2d");

    function setCursorCanvasSize() {
        cursorCanvas.width = window.innerWidth;
        cursorCanvas.height = window.innerHeight;
    }

    setCursorCanvasSize();
    cursorCanvas.style.position = "fixed";
    cursorCanvas.style.inset = "0";
    cursorCanvas.style.pointerEvents = "none";
    cursorCanvas.style.zIndex = "999";

    let sparks = [];

    class Spark {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 2 + 1;
            this.alpha = 1;
            this.vx = (Math.random() - 0.5) * 1.8;
            this.vy = (Math.random() - 0.5) * 1.8;
        }

        draw() {
            cctx.beginPath();
            cctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            cctx.fillStyle = `rgba(102, 227, 255, ${this.alpha})`;
            cctx.shadowColor = "rgba(102, 227, 255, 0.9)";
            cctx.shadowBlur = 14;
            cctx.fill();
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= 0.03;
            this.draw();
        }
    }

    function animateSparks() {
        cctx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
        sparks = sparks.filter((spark) => spark.alpha > 0);
        sparks.forEach((spark) => spark.update());
        requestAnimationFrame(animateSparks);
    }

    window.addEventListener("mousemove", (event) => {
        for (let i = 0; i < 3; i++) {
            sparks.push(new Spark(event.clientX, event.clientY));
        }
    });

    window.addEventListener("resize", setCursorCanvasSize);
    animateSparks();
}
