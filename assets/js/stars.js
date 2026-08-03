(function () {
  const canvas = document.getElementById("stars");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let stars = [];
  let sparkles = [];
  let celebrationStars = [];
  let celebrationUntil = 0;
  let width, height, dpr;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawn() {
    const count = Math.min(160, Math.max(90, Math.floor(width / 12)));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.7 + 0.55,
      baseAlpha: Math.random() * 0.5 + 0.45,
      twinkleSpeed: Math.random() * 0.015 + 0.005,
      phase: Math.random() * Math.PI * 2,
      drift: Math.random() * 0.18 + 0.035,
      sway: Math.random() * 0.16 + 0.03,
      gold: Math.random() > 0.82,
    }));

    sparkles = [
      { x: width * 0.86, y: height * 0.42, size: 9, phase: 0, speed: 0.012 },
      { x: width * 0.22, y: height * 0.14, size: 6, phase: 1.4, speed: 0.01 },
      { x: width * 0.12, y: height * 0.62, size: 5, phase: 2.6, speed: 0.009 },
      { x: width * 0.9, y: height * 0.16, size: 5, phase: 3.5, speed: 0.011 },
    ];
  }

  function drawSparkle(x, y, size, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(255, 214, 140, 1)";
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.bezierCurveTo(size * 0.15, -size * 0.15, size * 0.85, -size * 0.1, size, 0);
    ctx.bezierCurveTo(size * 0.15, size * 0.15, size * 0.1, size * 0.85, 0, size);
    ctx.bezierCurveTo(-size * 0.15, size * 0.15, -size * 0.85, size * 0.1, -size, 0);
    ctx.bezierCurveTo(-size * 0.15, -size * 0.15, -size * 0.1, -size * 0.85, 0, -size);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function celebrate() {
    celebrationUntil = Date.now() + 5000;
    celebrationStars = Array.from({ length: 100 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 0.8,
      alpha: Math.random() * 0.55 + 0.3,
      speed: Math.random() * 0.55 + 0.2,
      gold: Math.random() > 0.25,
    }));
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach((s) => {
      s.phase += s.twinkleSpeed;
      s.y -= s.drift;
      s.x += Math.sin(s.phase) * s.sway;

      if (s.y < -4) {
        s.y = height + 4;
        s.x = Math.random() * width;
      }

      if (s.x < -4) s.x = width + 4;
      if (s.x > width + 4) s.x = -4;

      const alpha = s.baseAlpha + Math.sin(s.phase) * 0.25;
      ctx.beginPath();
      ctx.fillStyle = s.gold
        ? `rgba(240, 200, 130, ${Math.max(alpha, 0)})`
        : `rgba(255, 255, 255, ${Math.max(alpha, 0)})`;
      ctx.shadowColor = s.gold ? "rgba(240, 200, 130, 0.8)" : "rgba(255, 255, 255, 0.65)";
      ctx.shadowBlur = s.r > 1.45 ? 7 : 3;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.shadowBlur = 0;

    if (Date.now() < celebrationUntil) {
      celebrationStars.forEach((star) => {
        star.y -= star.speed;
        if (star.y < -5) star.y = height + 5;
        ctx.beginPath();
        ctx.fillStyle = star.gold ? `rgba(240, 200, 130, ${star.alpha})` : `rgba(255, 255, 255, ${star.alpha})`;
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    sparkles.forEach((sp) => {
      sp.phase += sp.speed;
      const alpha = Math.max(0, Math.sin(sp.phase)) * 0.85;
      drawSparkle(sp.x, sp.y, sp.size, alpha);
    });

    requestAnimationFrame(render);
  }

  window.addEventListener("resize", () => {
    resize();
    spawn();
  });
  window.addEventListener("invitation:celebrate", celebrate);

  resize();
  spawn();
  render();
})();
