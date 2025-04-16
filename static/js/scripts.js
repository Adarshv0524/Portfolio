
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
const modal = document.getElementById("resume-modal");
const viewBtn = document.getElementById("view-btn");
const resumeIframe = document.getElementById("resume-iframe");
const closeBtn = document.createElement("span");
closeBtn.innerHTML = "×";
closeBtn.classList.add("close-btn");
document.querySelector(".view-resume-content").appendChild(closeBtn);

viewBtn.onclick = function() {
    modal.style.display = "block";
    resumeIframe.src = "https://1drv.ms/b/s!Av0WPbKOYrgLgmJ3XLSdunG9Bl9b?e=Nty1JC";
    document.body.style.overflow = 'hidden';
};

closeBtn.onclick = function() {
    modal.style.display = "none";
    resumeIframe.src = "";
    document.body.style.overflow = 'auto';
};

window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
        resumeIframe.src = "";
        document.body.style.overflow = 'auto';
    }
};