/* ============================================
   Main.js - LeaveAware Landing Page
   ============================================ */

// Form handling removed - no email form

// Email validation removed

// Initialize trial manager removed

// Form handling
document.addEventListener('DOMContentLoaded', () => {
    setupSmoothScrolling();
    setupAccessibility();
    setupEarlyAccessForm();
});

function setupSmoothScrolling() {
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        e.preventDefault();
        const targetId = link.getAttribute('href');

        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        // Check if user prefers reduced motion
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReduced) {
            target.scrollIntoView();
        } else {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Enhance accessibility
function setupAccessibility() {
    // Smooth scroll respects prefers-reduced-motion
    const html = document.documentElement;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
        html.classList.add('no-scroll');
    }

    // Listen for changes to prefers-reduced-motion
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
        if (e.matches) {
            html.classList.add('no-scroll');
        } else {
            html.classList.remove('no-scroll');
        }
    });

    // Ensure proper focus management for details/summary
    const details = document.querySelectorAll('details');
    details.forEach(detail => {
        detail.addEventListener('toggle', () => {
            if (detail.open) {
                const summary = detail.querySelector('summary');
                // Small delay to ensure animation completion
                setTimeout(() => {
                    summary.focus();
                }, 100);
            }
        });
    });
}

// Early access form handling
function setupEarlyAccessForm() {
    const form = document.getElementById('early-access-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const companySize = document.getElementById('company-size').value;

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Store in localStorage
        const data = {
            email,
            companySize,
            timestamp: new Date().toISOString(),
            source: 'pricing-page'
        };
        localStorage.setItem('leaveawareEarlyAccess', JSON.stringify(data));

        // Show success message
        form.style.display = 'none';
        document.getElementById('success-message').style.display = 'block';
    });
}