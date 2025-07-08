// theme-toggle.js
document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  const btn  = document.getElementById('theme-toggle');

  // apply saved or default
  const saved = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', saved);

  btn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
});
