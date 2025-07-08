
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



// enhancements

