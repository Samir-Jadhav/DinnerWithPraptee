const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function setCanvasSize() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function spawnParticles() {
  const total = Math.min(220, Math.max(140, Math.floor(window.innerWidth / 10)));
  particles = [];

  for (let i = 0; i < total; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 2.8 + 0.8,
      speed: Math.random() * 0.8 + 0.22,
      alpha: Math.random() * 0.9 + 0.2,
      drift: (Math.random() - 0.5) * 0.8,
      phase: Math.random() * Math.PI * 2,
      gold: Math.random() > 0.7
    });
  }
}

function renderParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  particles.forEach((particle) => {
    particle.y -= particle.speed;
    particle.x += Math.sin(particle.phase) * particle.drift;
    particle.phase += 0.025;

    if (particle.y < -8) {
      particle.y = window.innerHeight + 8;
      particle.x = Math.random() * window.innerWidth;
    }

    if (particle.x < -8) particle.x = window.innerWidth + 8;
    if (particle.x > window.innerWidth + 8) particle.x = -8;

    const glow = 14 + particle.radius * 5;
    ctx.beginPath();
    ctx.fillStyle = particle.gold ? `rgba(242, 204, 119, ${particle.alpha})` : `rgba(255,255,255,${particle.alpha})`;
    ctx.shadowColor = particle.gold ? 'rgba(242, 204, 119, 0.7)' : 'rgba(255,255,255,0.5)';
    ctx.shadowBlur = glow;
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.shadowBlur = 0;
  requestAnimationFrame(renderParticles);
}

window.addEventListener('resize', () => {
  setCanvasSize();
  spawnParticles();
});

setCanvasSize();
spawnParticles();
renderParticles();
