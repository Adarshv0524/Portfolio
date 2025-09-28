
// Text Rotator for Hero Name
function initNameRotator() {
    const nameItems = document.querySelectorAll('.name-item');
    if (nameItems.length === 0) return;
    
    let currentIndex = 0;
    
    function rotateNames() {
        // Fade out current item
        nameItems[currentIndex].classList.remove('active');
        nameItems[currentIndex].classList.add('fade-out');
        
        // Move to next item
        currentIndex = (currentIndex + 1) % nameItems.length;
        
        // Fade in next item after a brief pause
        setTimeout(() => {
            // Reset all items
            nameItems.forEach(item => {
                item.classList.remove('active', 'fade-out', 'fade-in');
            });
            
            // Activate new item
            nameItems[currentIndex].classList.add('active', 'fade-in');
        }, 300);
    }
    
    // Start rotation after initial delay
    setTimeout(() => {
        setInterval(rotateNames, 3000); // Change every 3 seconds
    }, 2000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initNameRotator);

// Hamburger menu toggle
const topNav = document.getElementById('top-nav');
const hamburgerMenu = document.querySelector('.hamburger-menu');
const header = document.getElementById('header');
const sidebar = document.querySelector('.sidebar');

hamburgerMenu.addEventListener('click', toggleSidebar);

function toggleSidebar() {
    if (window.innerWidth < 768) {
        const isHidden = header.style.display === 'none';
        const topNavContent = document.querySelector('.top-nav-content');
        
        header.style.display = isHidden ? 'block' : 'none';
        sidebar.style.display = isHidden ? 'block' : 'none';
        
        // Hide only the top nav content (name/logo) but keep hamburger visible
        topNavContent.style.display = isHidden ? 'none' : 'flex';
        
        // Add/remove overlay class to top nav for better visibility
        topNav.classList.toggle('sidebar-open', isHidden);
        
        // Toggle hamburger menu active state (transforms to N shape)
        hamburgerMenu.classList.toggle('active', isHidden);
    }
}

document.addEventListener('click', function(event) {
    if (window.innerWidth < 768 && sidebar.style.display === 'block') {
        if (!sidebar.contains(event.target) && event.target !== hamburgerMenu && !hamburgerMenu.contains(event.target)) {
            const topNavContent = document.querySelector('.top-nav-content');
            
            header.style.display = 'none';
            sidebar.style.display = 'none';
            topNavContent.style.display = 'flex'; // Show top nav content when closing sidebar
            topNav.classList.remove('sidebar-open');
            hamburgerMenu.classList.remove('active');
        }
    }
});

// contact-form.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const modal = document.getElementById('success-modal');
  const closeBtn = document.getElementById('modal-close');

  // Enhanced form validation
  const fields = ['name','email','contact','message'];
  
  fields.forEach(id => {
    const el = document.getElementById(id);
    const err = document.getElementById(`error-${id}`);
    
    el.addEventListener('input', () => {
      validateField(el, err);
    });
    
    el.addEventListener('blur', () => {
      validateField(el, err);
    });
    
    el.addEventListener('focus', () => {
      err.classList.remove('show');
    });
  });

  function validateField(element, errorElement) {
    const value = element.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Custom validation rules
    switch(element.id) {
      case 'name':
        if (!value) {
          isValid = false;
          errorMessage = 'Name is required';
        } else if (value.length < 2) {
          isValid = false;
          errorMessage = 'Name must be at least 2 characters';
        }
        break;
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          isValid = false;
          errorMessage = 'Email is required';
        } else if (!emailRegex.test(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid email address';
        }
        break;
        
      case 'contact':
        if (value && !/^\+?[\d\s\-\(\)]{10,}$/.test(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid phone number';
        }
        break;
        
      case 'message':
        if (!value) {
          isValid = false;
          errorMessage = 'Message is required';
        } else if (value.length < 10) {
          isValid = false;
          errorMessage = 'Message must be at least 10 characters';
        }
        break;
    }

    if (isValid) {
      errorElement.textContent = '';
      errorElement.classList.remove('show');
      element.classList.remove('error');
      element.classList.add('valid');
    } else {
      errorElement.textContent = errorMessage;
      errorElement.classList.add('show');
      element.classList.add('error');
      element.classList.remove('valid');
    }

    return isValid;
  }

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
        modal.classList.add('show');
        form.reset();
        // Clear all error messages
        fields.forEach(id => {
          const err = document.getElementById(`error-${id}`);
          err.textContent = '';
          err.classList.remove('show');
        });
      } else {
        alert('Submission failed. Please try again.');
      }
    } catch {
      alert('Network error. Please try later.');
    }
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
  });

  // Close modal on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
      modal.classList.remove('show');
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      modal.classList.remove('show');
    }
  });
});

// Progressive Disclosure Footer functionality
document.addEventListener('DOMContentLoaded', function() {
    const footerVedic = document.querySelector('.footer-vedic');
    const triggerLine = document.querySelector('.shloka-underline');
    
    if (footerVedic && triggerLine) {
        let isRevealed = false;
        
        // Check if device supports hover (desktop)
        const supportsHover = window.matchMedia('(hover: hover)').matches;
        
        if (supportsHover) {
            // Desktop: Use hover interaction
            triggerLine.addEventListener('mouseenter', function() {
                if (!isRevealed) {
                    footerVedic.classList.add('active');
                    isRevealed = true;
                }
            });
            
            triggerLine.addEventListener('mouseleave', function() {
                if (isRevealed) {
                    footerVedic.classList.remove('active');
                    isRevealed = false;
                }
            });
        } else {
            // Touch devices: Use toggle interaction
            triggerLine.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                if (isRevealed) {
                    footerVedic.classList.remove('active');
                    isRevealed = false;
                } else {
                    footerVedic.classList.add('active');
                    isRevealed = true;
                }
            });
            
            // Close on outside click for touch devices
            document.addEventListener('click', function(event) {
                if (isRevealed && !footerVedic.contains(event.target)) {
                    footerVedic.classList.remove('active');
                    isRevealed = false;
                }
            });
        }
        
        // Optional: Close on escape key for both desktop and touch
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && isRevealed) {
                footerVedic.classList.remove('active');
                isRevealed = false;
            }
        });
    }
});

// Skills filter functionality
document.addEventListener('DOMContentLoaded', function() {
    const legendItems = document.querySelectorAll('.legend-item');
    const skillBubbles = document.querySelectorAll('.skill-bubble');
    let activeFilter = null;

    legendItems.forEach(item => {
        item.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Toggle filter
            if (activeFilter === filter) {
                // Remove filter - show all
                activeFilter = null;
                legendItems.forEach(legend => legend.classList.remove('active'));
                skillBubbles.forEach(bubble => {
                    bubble.style.opacity = '1';
                    bubble.style.transform = 'scale(1)';
                });
            } else {
                // Apply filter
                activeFilter = filter;
                legendItems.forEach(legend => legend.classList.remove('active'));
                this.classList.add('active');
                
                skillBubbles.forEach(bubble => {
                    if (bubble.dataset.category === filter) {
                        bubble.style.opacity = '1';
                        bubble.style.transform = 'scale(1.05)';
                    } else {
                        bubble.style.opacity = '0.3';
                        bubble.style.transform = 'scale(0.95)';
                    }
                });
            }
        });
    });
});

// Resume Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('resume-modal');
    const viewBtn = document.getElementById('view-resume-btn');
    const closeBtn = document.querySelector('.resume-close-btn');
    
    if (viewBtn && modal && closeBtn) {
        // Open modal
        viewBtn.addEventListener('click', function(e) {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
        
        // Close modal
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto'; // Restore scrolling
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
});





