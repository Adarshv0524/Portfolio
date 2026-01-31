// ===== SKILL CONSTELLATION SYSTEM =====
(function() {
    const constellation = document.querySelector('.skill-constellation');
    if (!constellation) return;

    const skillNodes = document.querySelectorAll('.skill-node');
    const connections = document.querySelectorAll('.connection');
    const tooltip = document.querySelector('.skill-tooltip');
    const tooltipTitle = document.querySelector('.tooltip-title');
    const tooltipDesc = document.querySelector('.tooltip-desc');
    const legendItems = document.querySelectorAll('.legend-item');

    let currentFilter = 'all';

    // Skill Node Hover - Show Tooltip and Highlight Connections
    skillNodes.forEach(node => {
        node.addEventListener('mouseenter', function() {
            const skillName = this.getAttribute('data-skill');
            const skillDesc = this.getAttribute('data-desc');
            const category = this.classList[1]; // ai, web, mobile, or tools
            
            // Show tooltip
            if (tooltip && tooltipTitle && tooltipDesc) {
                tooltipTitle.textContent = skillName;
                tooltipDesc.textContent = skillDesc;
                tooltip.classList.add('show');
            }
            
            // Highlight connections
            connections.forEach(conn => {
                if (conn.classList.contains(category)) {
                    conn.classList.add('active');
                }
            });
        });

        node.addEventListener('mouseleave', function() {
            if (tooltip && !this.classList.contains('active')) {
                tooltip.classList.remove('show');
            }
            
            // Remove connection highlights
            connections.forEach(conn => conn.classList.remove('active'));
        });

        // Click to pin tooltip
        node.addEventListener('click', function() {
            skillNodes.forEach(n => n.classList.remove('active'));
            this.classList.add('active');
            
            const skillName = this.getAttribute('data-skill');
            const skillDesc = this.getAttribute('data-desc');
            
            if (tooltip && tooltipTitle && tooltipDesc) {
                tooltipTitle.textContent = skillName;
                tooltipDesc.textContent = skillDesc;
                tooltip.classList.add('show');
            }
        });
    });

    // Legend Click Filtering
    legendItems.forEach(item => {
        item.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            if (currentFilter === category) {
                // Reset
                currentFilter = 'all';
                skillNodes.forEach(node => node.classList.remove('dimmed'));
                connections.forEach(conn => conn.style.opacity = '0.3');
                legendItems.forEach(l => l.classList.remove('active'));
            } else {
                // Filter
                currentFilter = category;
                skillNodes.forEach(node => {
                    if (node.classList.contains(category)) {
                        node.classList.remove('dimmed');
                    } else {
                        node.classList.add('dimmed');
                    }
                });
                
                connections.forEach(conn => {
                    if (conn.classList.contains(category)) {
                        conn.style.opacity = '0.6';
                    } else {
                        conn.style.opacity = '0.1';
                    }
                });
                
                legendItems.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Legend Hover Preview
    legendItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            if (currentFilter === 'all') {
                const category = this.getAttribute('data-category');
                skillNodes.forEach(node => {
                    if (!node.classList.contains(category)) {
                        node.style.opacity = '0.3';
                    }
                });
            }
        });

        item.addEventListener('mouseleave', function() {
            if (currentFilter === 'all') {
                skillNodes.forEach(node => {
                    node.style.opacity = '1';
                });
            }
        });
    });

    // Core Click - Reset
    const core = document.querySelector('.constellation-core');
    if (core) {
        core.addEventListener('click', function() {
            skillNodes.forEach(n => {
                n.classList.remove('active');
                n.classList.remove('dimmed');
            });
            connections.forEach(conn => conn.style.opacity = '0.3');
            if (tooltip) tooltip.classList.remove('show');
            currentFilter = 'all';
            legendItems.forEach(l => l.classList.remove('active'));
        });
    }

    // Close tooltip on outside click
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.skill-node') && !e.target.closest('.skill-tooltip')) {
            skillNodes.forEach(n => n.classList.remove('active'));
            if (tooltip) tooltip.classList.remove('show');
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Escape') {
            skillNodes.forEach(n => {
                n.classList.remove('active');
                n.classList.remove('dimmed');
            });
            connections.forEach(conn => conn.style.opacity = '0.3');
            if (tooltip) tooltip.classList.remove('show');
            currentFilter = 'all';
            legendItems.forEach(l => l.classList.remove('active'));
        }
    });

    console.log('🌌 Neural Constellation System Activated');
    console.log('⌨️  Click nodes for details | Click legend to filter | Esc to reset');
})();
