/* ============================================
   Main.js - LeaveAware Landing Page
   ============================================ */

// Form handling removed - no email form

// Email validation removed

// Initialize trial manager removed

const CTA_TRACKING_RULES = [
    { selector: '#pricing_menu_item_cta', location: 'home_top_nav_pricing' },
    { selector: '#start_free_trial_bar_cta', location: 'home_top_bar_trial' },
    { selector: '#start_free_trial_cta', location: 'home_hero_trial' },
    { selector: '#pricing_tire_cta1', location: 'pricing_core_plan' },
    { selector: '#pricing_tire_cta2', location: 'pricing_smart_plan' },
    { selector: '#join_early_access_cta', location: 'pricing_join_early_access' },
    { selector: 'a.nav-link[href="../pricing/index.html"]', location: 'legal_top_nav_pricing' },
    { selector: 'a.btn-primary-pill[href="../pricing/index.html"]', location: 'legal_top_bar_trial' }
];

// Form handling
document.addEventListener('DOMContentLoaded', () => {
    setupSmoothScrolling();
    setupAccessibility();
    setupAnalyticsTracking();
    setupEarlyAccessForm();
});

function trackAnalyticsEvent(eventName, params = {}) {
    if (typeof window.gtag !== 'function') return;

    window.gtag('event', eventName, params);
}

function setupAnalyticsTracking() {
    document.addEventListener('click', (e) => {
        for (const rule of CTA_TRACKING_RULES) {
            const element = e.target.closest(rule.selector);
            if (!element) continue;

            trackAnalyticsEvent('cta_click', {
                cta_id: element.id || '',
                cta_location: rule.location,
                cta_text: element.textContent.trim(),
                link_url: element.getAttribute('href') || '',
                page_path: window.location.pathname
            });
            return;
        }
    });
}

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

function setupEarlyAccessForm() {
    const form = document.getElementById('early-access-form');
    const successMessage = document.getElementById('success-message');
    if (!form || !successMessage) return;

    const submitButton = form.querySelector('button[type="submit"]');
    const defaultButtonLabel = submitButton ? submitButton.textContent : '';
    let hideTimer;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
        }

        successMessage.style.display = 'none';
        successMessage.classList.remove('is-error', 'is-visible');

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    Accept: 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Form submission failed');
            }

            const formData = new FormData(form);
            trackAnalyticsEvent('early_access_submit_success', {
                form_id: form.id,
                source: formData.get('source') || '',
                team_size: formData.get('team_size') || ''
            });

            form.reset();
            successMessage.innerHTML = 'Thanks! You’re on the list. We’ll notify you at launch and reserve your <span class="pricing-plan-accent">50%</span> lifetime discount.';
            hideTimer = showFormPopup(successMessage, hideTimer);
        } catch (error) {
            successMessage.textContent = 'Something went wrong. Please try again in a moment.';
            successMessage.classList.add('is-error');
            hideTimer = showFormPopup(successMessage, hideTimer);
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = defaultButtonLabel;
            }
        }
    });
}

function showFormPopup(messageElement, existingTimer) {
    if (existingTimer) {
        clearTimeout(existingTimer);
    }

    messageElement.style.display = 'block';
    requestAnimationFrame(() => {
        messageElement.classList.add('is-visible');
    });

    return setTimeout(() => {
        messageElement.classList.remove('is-visible');
        setTimeout(() => {
            messageElement.style.display = 'none';
            messageElement.classList.remove('is-error');
        }, 180);
    }, 3600);
}
