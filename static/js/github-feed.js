// // github-feed.js
// document.addEventListener('DOMContentLoaded', () => {
//   const username = 'Adarshv0524';
//   const list = document.getElementById('github-list');
//   fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`)
//     .then(res => res.json())
//     .then(repos => {
//       repos.forEach(repo => {
//         const card = document.createElement('div');
//         card.className = 'github-repo';
//         card.innerHTML = `
//           <h4>${repo.name}</h4>
//           <p>${repo.description || 'No description.'}</p>
//           <p>⭐ ${repo.stargazers_count} • 🍴 ${repo.forks_count}</p>
//           <a href="${repo.html_url}" target="_blank">View on GitHub →</a>
//         `;
//         list.appendChild(card);
//       });
//     })
//     .catch(err => {
//       console.error('GitHub API error:', err);
//       list.innerHTML = `<p style="color:var(--text-color)">Unable to load GitHub activity.</p>`;
//     });
// });
