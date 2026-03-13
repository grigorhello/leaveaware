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
