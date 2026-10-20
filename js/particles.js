// Canvas Particles: Lotus Petals, Marigold Flowers, Sacred Tulasi Leaves & Gold Dust
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  if (!canvas || !canvas.parentElement) return;
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Particle types: 'petal', 'leaf' (Tulasi), 'sparkle'
class Particle {
  constructor(type = 'petal') {
    this.x = Math.random() * canvas.width;
    this.y = -20 - Math.random() * 20;
    this.type = type;
    this.speedY = Math.random() * 2.5 + 1.4;
    this.speedX = (Math.random() - 0.5) * 2.2;
    this.rotation = Math.random() * 360;
    this.rotSpeed = (Math.random() - 0.5) * 5;
    this.wobble = Math.random() * 10;
    this.wobbleSpeed = Math.random() * 0.08 + 0.02;
    this.alpha = 1;

    if (this.type === 'leaf') {
      // Tulasi Sacred Green Leaves
      this.size = Math.random() * 7 + 9;
      const leafGreens = ['#2e7d32', '#388e3c', '#4caf50', '#1b5e20', '#66bb6a'];
      this.color = leafGreens[Math.floor(Math.random() * leafGreens.length)];
    } else if (this.type === 'petal') {
      // Rose petals & Marigold golden blossoms
      this.size = Math.random() * 8 + 8;
      const petalColors = ['#e11d48', '#f43f5e', '#fbbf24', '#f97316', '#ff80ab', '#f59e0b'];
      this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
    } else {
      // Sparkling gold dust
      this.size = Math.random() * 4 + 2;
      this.color = '#ffd700';
    }
  }

  update() {
    this.wobble += this.wobbleSpeed;
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.wobble) * 0.8;
    this.rotation += this.rotSpeed;
    if (this.y > canvas.height - 35) {
      this.alpha -= 0.025;
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;

    if (this.type === 'leaf') {
      // Sacred Tulasi leaf with central vein
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 1.1);
      ctx.bezierCurveTo(this.size * 0.6, -this.size * 0.6, this.size * 0.6, this.size * 0.6, 0, this.size * 1.1);
      ctx.bezierCurveTo(-this.size * 0.6, this.size * 0.6, -this.size * 0.6, -this.size * 0.6, 0, -this.size * 1.1);
      ctx.fill();

      // Delicate vein line
      ctx.strokeStyle = '#1b5e20';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.lineTo(0, this.size);
      ctx.stroke();
    } else if (this.type === 'petal') {
      // Flower Petal
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.bezierCurveTo(this.size * 0.7, -this.size * 0.5, this.size * 0.7, this.size * 0.5, 0, this.size);
      ctx.bezierCurveTo(-this.size * 0.7, this.size * 0.5, -this.size * 0.7, -this.size * 0.5, 0, -this.size);
      ctx.fill();
    } else {
      // Sparkle circle
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

// Regular step shower (mild flowers + gold)
function triggerPetalShower(burst = 3) {
  for (let i = 0; i < burst; i++) {
    const rand = Math.random();
    const type = rand < 0.6 ? 'petal' : (rand < 0.85 ? 'leaf' : 'sparkle');
    particles.push(new Particle(type));
  }
}

// Grand Mala Completion Gesture: Lavish shower of flowers, Tulasi leaves, and gold
function triggerGrandCelebrationShower() {
  // Spawn dense celebratory cloud of flowers and leaves
  for (let i = 0; i < 90; i++) {
    const rand = Math.random();
    const type = rand < 0.5 ? 'petal' : (rand < 0.85 ? 'leaf' : 'sparkle');
    const p = new Particle(type);
    // Stagger spawn heights for cascading shower effect
    p.y = -Math.random() * 120;
    p.speedY = Math.random() * 3 + 1.8;
    particles.push(p);
  }

  // Display Celebration overlay banner
  const overlay = document.getElementById('completionOverlay');
  if (overlay) {
    overlay.classList.remove('opacity-0', '-translate-y-4', 'scale-95');
    overlay.classList.add('opacity-100', 'translate-y-0', 'scale-100');
    setTimeout(() => {
      overlay.classList.remove('opacity-100', 'translate-y-0', 'scale-100');
      overlay.classList.add('opacity-0', '-translate-y-4', 'scale-95');
    }, 3600);
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].alpha <= 0 || particles[i].y > canvas.height + 30) {
      particles.splice(i, 1);
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();
