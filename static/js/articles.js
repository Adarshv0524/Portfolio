// articles.js
document.addEventListener('DOMContentLoaded', () => {
  fetch('static/articles.json')
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('article-list');
      data.sort((a,b) => new Date(b.date) - new Date(a.date)); // newest first
      data.forEach(article => {
        const card = document.createElement('div');
        card.className = 'article-card';
        card.innerHTML = `
          <div class="article-card-content">
            <h4>${article.title}</h4>
            <p>${article.summary}</p>
            <a href="${article.url}" target="_blank">Read more →</a>
          </div>`;
        list.appendChild(card);
      });
    })
    .catch(err => console.error('Failed loading articles:', err));
});
