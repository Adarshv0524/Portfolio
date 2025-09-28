// Refined Timeline Enhancements
document.addEventListener('DOMContentLoaded', function() {
    initTimelineFeatures();
});

function initTimelineFeatures() {
    // Add subtle card interactions
    initCardInteractions();
    
    // Initialize smooth scroll animations
    initScrollAnimations();
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    const projectNodes = document.querySelectorAll('.project-node');
    projectNodes.forEach((node, index) => {
        node.style.opacity = '0';
        node.style.transform = 'translateY(30px)';
        node.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(node);
    });
}

function initCardInteractions() {
    const cards = document.querySelectorAll('.project-morph-card');
    
    cards.forEach(card => {
        // Add subtle hover effect
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
        
        // Add smooth tech orb interactions
        const techOrbs = card.querySelectorAll('.tech-orb');
        techOrbs.forEach(orb => {
            orb.addEventListener('mouseenter', () => {
                orb.style.transform = 'scale(1.1)';
                orb.style.boxShadow = '0 2px 8px rgba(123, 73, 144, 0.3)';
            });
            
            orb.addEventListener('mouseleave', () => {
                orb.style.transform = 'scale(1)';
                orb.style.boxShadow = 'none';
            });
        });
    });
}

// Mobile touch optimization
function initMobileOptimizations() {
    if (window.innerWidth <= 768) {
        const cards = document.querySelectorAll('.project-morph-card');
        
        cards.forEach(card => {
            // Add touch-friendly interactions
            card.addEventListener('touchstart', function(e) {
                this.style.transform = 'translateY(-2px) scale(0.98)';
            });
            
            card.addEventListener('touchend', function(e) {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
}

// Initialize mobile optimizations
document.addEventListener('DOMContentLoaded', () => {
    initMobileOptimizations();
});

window.addEventListener('resize', () => {
    initMobileOptimizations();
});