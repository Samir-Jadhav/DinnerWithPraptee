const card = document.querySelector('.glass-card');
const background = document.querySelector('.background');

if (card && background) {
  const resetCard = () => {
    card.style.transform = 'perspective(1400px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    background.style.transform = 'translate3d(0, 0, 0) scale(1)';
  };

  document.addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 2;
    const y = (event.clientY / window.innerHeight - 0.5) * 2;

    const rotateY = x * 9;
    const rotateX = -y * 9;
    const translateY = Math.abs(y) * 8;

    card.style.transform = `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${-translateY}px)`;
    background.style.transform = `translate3d(${x * 12}px, ${y * 10}px, 0) scale(1.04)`;
  });

  document.addEventListener('pointerleave', resetCard);
  resetCard();
}
