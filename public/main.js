/* ============================================
   Main.js - LeaveAware Landing Page
   ============================================ */

// Store and load free trial signups
class TrialManager {
    constructor() {
        this.storageKey = 'leaveaware_trials';
        this.loadSignups();
    }

    loadSignups() {
        const stored = localStorage.getItem(this.storageKey);
        this.signups = stored ? JSON.parse(stored) : [];
    }

    addSignup(email, companySize) {
        const entry = {
            email,
            companySize: companySize || 'not-specified',
            timestamp: new Date().toISOString()
        };
        
        // Check for duplicates
        if (this.signups.some(e => e.email.toLowerCase() === email.toLowerCase())) {
            return { success: false, message: 'This email is already registered for a free trial!' };
        }

        this.signups.push(entry);
        localStorage.setItem(this.storageKey, JSON.stringify(this.signups));
        return { success: true, message: 'Thanks! Check your email to continue.' };
    }

    getAllSignups() {
        return this.signups;
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Initialize trial manager
const trials = new TrialManager();

// Form handling
document.addEventListener('DOMContentLoaded', () => {
    setupFormHandler();
    setupSmoothScrolling();
    setupAccessibility();
    setupCTAButtons();
});

function setupFormHandler() {
    const form = document.getElementById('trial-form');
    const emailInput = document.getElementById('email');
    const companySizeInput = document.getElementById('company-size');
    const messageEl = document.getElementById('form-message');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const companySize = companySizeInput.value;

        // Validate email
        if (!email) {
            showMessage(messageEl, 'Please enter your email', 'error');
            emailInput.focus();
            return;
        }

        if (!isValidEmail(email)) {
            showMessage(messageEl, 'Please enter a valid email address', 'error');
            emailInput.focus();
            return;
        }

        // Add to trials
        const result = trials.addSignup(email, companySize);

        if (result.success) {
            showMessage(messageEl, result.message, 'success');
            form.reset();
            companySizeInput.value = '';
            emailInput.focus();
        } else {
            showMessage(messageEl, result.message, 'error');
        }
    });
}

function showMessage(element, text, type) {
    element.textContent = text;
    element.className = `form-message ${type}`;
    
    // Auto-clear success message after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            element.textContent = '';
            element.className = 'form-message';
        }, 5000);
    }
}

// Smooth scrolling for anchor links
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

// Button clicks for CTAs that scroll to form
function setupCTAButtons() {
    document.addEventListener('click', (e) => {
        if (e.target.textContent.includes('Start free trial')) {
            const form = document.getElementById('trial-form');
            if (form) {
                e.preventDefault();
                const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                if (prefersReduced) {
                    form.scrollIntoView();
                } else {
                    form.scrollIntoView({ behavior: 'smooth' });
                }
                document.getElementById('email').focus();
            }
        }
    });
}
