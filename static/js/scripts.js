
// Hamburger menu toggle
const topNav = document.getElementById('top-nav');
const hamburgerMenu = document.querySelector('.hamburger-menu');
const header = document.getElementById('header');
const sidebar = document.querySelector('.sidebar');
const closeIcon = document.createElement('span');
closeIcon.innerHTML = '×';
closeIcon.classList.add('close-icon');

hamburgerMenu.addEventListener('click', toggleSidebar);

function toggleSidebar() {
    if (window.innerWidth < 768) {
        const isHidden = header.style.display === 'none';
        header.style.display = isHidden ? 'block' : 'none';
        sidebar.style.display = isHidden ? 'block' : 'none';
        if (isHidden) {
            sidebar.appendChild(closeIcon);
            closeIcon.addEventListener('click', toggleSidebar);
        } else if (sidebar.contains(closeIcon)) {
            closeIcon.removeEventListener('click', toggleSidebar);
            sidebar.removeChild(closeIcon);
        }
    }
}

document.addEventListener('click', function(event) {
    if (window.innerWidth < 768 && sidebar.style.display === 'block') {
        if (!sidebar.contains(event.target) && event.target !== hamburgerMenu) {
            header.style.display = 'none';
            sidebar.style.display = 'none';
            if (sidebar.contains(closeIcon)) {
                closeIcon.removeEventListener('click', toggleSidebar);
                sidebar.removeChild(closeIcon);
            }
        }
    }
});


// Resume modal functionality
// In static/js/scripts.js (or wherever you handle the modal):
const modal = document.getElementById("resume-modal");
const viewBtn = document.getElementById("view-btn");
const closeBtn = document.querySelector(".close-btn");

// show
viewBtn.onclick = () => {
  modal.style.display = "block";
  document.body.style.overflow = "hidden"; // prevent background scroll
};

// hide
closeBtn.onclick = () => {
  modal.style.display = "none";
  document.body.style.overflow = "auto";
};
window.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
};



// contact-form.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const modal = document.getElementById('success-modal');
  const closeBtn = document.getElementById('modal-close');

  // Simple live validation
  const fields = ['name','email','contact','message'];
  fields.forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('input', () => {
      const err = document.getElementById(`error-${id}`);
      if (el.validity.valid) {
        err.textContent = '';
        err.style.visibility = 'hidden';
      } else {
        err.textContent = el.validationMessage;
        err.style.visibility = 'visible';
      }
    });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    // Check honeypot
    if (form.website.value) return; // spam – silently drop

    // Quick final validity check
    if (!form.checkValidity()) {
      fields.forEach(id => document.getElementById(id).dispatchEvent(new Event('input')));
      return;
    }

    // Collect form data
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    try {
      // Post to Web3Forms
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        modal.classList.add('active');
        form.reset();
      } else {
        alert('Submission failed. Please try again.');
      }
    } catch {
      alert('Network error. Please try later.');
    }
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });
});





