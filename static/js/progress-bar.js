// progress-bar.js
window.addEventListener('scroll', () => {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = window.scrollY;
  const pct = (scrolled / docHeight) * 100;
  document.getElementById('scroll-progress').style.width = pct + '%';
});
