/**
 * Interactive Script for Priyanka Kulkarni Resume Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Mobile Hamburger Navigation Drawer
    // ----------------------------------------------------
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navDrawer = document.getElementById('mobile-nav-drawer');
    const drawerLinks = document.querySelectorAll('.drawer-link');
    const body = document.body;

    function toggleMenu() {
        hamburgerBtn.classList.toggle('active');
        navDrawer.classList.toggle('open');
        
        // Prevent body scroll when drawer is open
        if (navDrawer.classList.contains('open')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    }

    hamburgerBtn.addEventListener('click', toggleMenu);

    // Close drawer when links are clicked
    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navDrawer.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // Close drawer when clicking outside content (on screen wrapper)
    document.addEventListener('click', (e) => {
        if (navDrawer.classList.contains('open') && 
            !navDrawer.contains(e.target) && 
            !hamburgerBtn.contains(e.target)) {
            toggleMenu();
        }
    });

    // ----------------------------------------------------
    // 2. Active Section Syncing on Scroll
    // ----------------------------------------------------
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Custom Intersection Observer options
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies center viewport
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                // Update Desktop nav links
                navLinks.forEach(link => {
                    if (link.getAttribute('data-target') === activeId) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });

                // Update Mobile drawer links
                drawerLinks.forEach(link => {
                    if (link.getAttribute('data-target') === activeId) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });

                // Add active-section class to fade-in the section content
                entry.target.classList.add('active-section');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // ----------------------------------------------------
    // 3. KPI Counter Animation (Counting up on viewport entry)
    // ----------------------------------------------------
    const kpiCards = document.querySelectorAll('.kpi-card');
    let countersAnimated = false;

    function animateCounters() {
        kpiCards.forEach(card => {
            const valAttr = card.getAttribute('data-val');
            
            if (valAttr.includes('-')) {
                // Range value e.g., "8-10"
                const parts = valAttr.split('-');
                const minVal = parseInt(parts[0], 10);
                const maxVal = parseInt(parts[1], 10);
                const firstCounter = card.querySelector('.counter');
                const secondCounter = card.querySelector('.counter-secondary');
                
                countUp(firstCounter, minVal, 1000);
                countUp(secondCounter, maxVal, 1200);
            } else {
                // Single numerical value e.g., "80", "20", "2"
                const targetVal = parseInt(valAttr, 10);
                const counterElement = card.querySelector('.counter');
                
                countUp(counterElement, targetVal, 1500);
            }
        });
    }

    function countUp(element, target, duration) {
        if (!element) return;
        
        let startTimestamp = null;
        const startValue = 0;
        
        function step(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Ease out quad
            const easeProgress = progress * (2 - progress);
            const currentValue = Math.floor(easeProgress * (target - startValue) + startValue);
            element.textContent = currentValue;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = target; // Ensure exact final value
            }
        }
        
        window.requestAnimationFrame(step);
    }

    // Trigger counters only when KPI section comes into view
    const kpiSection = document.querySelector('.kpi-grid');
    const kpiObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                animateCounters();
                countersAnimated = true;
                kpiObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    if (kpiSection) {
        kpiObserver.observe(kpiSection);
    }
});
