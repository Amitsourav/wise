/**
 * Wise Bridge Global Partners - Main JavaScript
 * Minimal JavaScript for Italian corporate website
 * Focus on functionality, not flashy effects
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const nav = document.getElementById('nav');
    
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            
            // Toggle hamburger animation
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                span.style.transform = nav.classList.contains('active') 
                    ? getHamburgerTransform(index) 
                    : 'none';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                nav.classList.remove('active');
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans.forEach(span => span.style.transform = 'none');
            }
        });
    }
    
    // Helper function for hamburger menu animation
    function getHamburgerTransform(index) {
        const transforms = [
            'rotate(45deg) translate(6px, 6px)',
            'opacity(0)',
            'rotate(-45deg) translate(6px, -6px)'
        ];
        return transforms[index];
    }
    
    // Set active navigation link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    const spans = mobileMenuToggle.querySelectorAll('span');
                    spans.forEach(span => span.style.transform = 'none');
                }
            }
        });
    });
    
    // Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Validate required fields
            const requiredFields = ['name', 'email', 'service-interest', 'message'];
            const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');
            
            if (missingFields.length > 0) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            if (!isValidEmail(data.email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Check privacy consent
            const privacyConsent = contactForm.querySelector('input[name="privacy-consent"]');
            if (!privacyConsent || !privacyConsent.checked) {
                showFormMessage('Please acknowledge our Privacy Policy to continue.', 'error');
                return;
            }
            
            // Simulate form submission (in production, this would send to backend)
            showFormMessage('Submitting your request...', 'info');
            
            // Simulate API call delay
            setTimeout(() => {
                showFormMessage(
                    'Thank you for your interest. We will contact you within 24 hours to schedule your consultation.',
                    'success'
                );
                contactForm.reset();
            }, 1500);
        });
    }
    
    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Form message display
    function showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message-${type}`;
        messageEl.textContent = message;
        
        // Style the message
        const styles = {
            padding: '1rem',
            marginBottom: '1.5rem',
            borderRadius: '0',
            fontSize: '0.9rem',
            fontWeight: '500'
        };
        
        const colors = {
            success: { bg: '#f0f9f0', border: '#4ade80', text: '#166534' },
            error: { bg: '#fef2f2', border: '#f87171', text: '#dc2626' },
            info: { bg: '#f0f9ff', border: '#60a5fa', text: '#1d4ed8' }
        };
        
        Object.assign(messageEl.style, styles);
        Object.assign(messageEl.style, {
            backgroundColor: colors[type].bg,
            borderLeft: `4px solid ${colors[type].border}`,
            color: colors[type].text
        });
        
        // Insert message at top of form
        contactForm.insertBefore(messageEl, contactForm.firstChild);
        
        // Scroll to message
        messageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-remove success/info messages after 5 seconds
        if (type !== 'error') {
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.remove();
                }
            }, 5000);
        }
    }
    
    // Optional fade-in animation for content sections
    // Only implements if elements with fade-in class exist
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if (fadeElements.length > 0) {
        // Simple intersection observer for fade-in effect
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        fadeElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Form enhancement - auto-format phone numbers (US format)
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else {
                    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
                e.target.value = value;
            }
        });
    });
    
    // Accessibility: ESC key to close mobile menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav && nav.classList.contains('active')) {
            nav.classList.remove('active');
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans.forEach(span => span.style.transform = 'none');
        }
    });
    
    // Add focus indicators for keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Simple back to top functionality (only show after scrolling)
    let backToTopButton = null;
    
    function createBackToTopButton() {
        if (!backToTopButton) {
            backToTopButton = document.createElement('button');
            backToTopButton.innerHTML = '↑';
            backToTopButton.className = 'back-to-top';
            backToTopButton.setAttribute('aria-label', 'Back to top');
            
            // Style the button
            Object.assign(backToTopButton.style, {
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: '2px solid var(--accent-color)',
                backgroundColor: 'var(--background)',
                color: 'var(--accent-color)',
                fontSize: '1.25rem',
                cursor: 'pointer',
                opacity: '0',
                transform: 'translateY(20px)',
                transition: 'all 0.3s ease',
                zIndex: '999',
                boxShadow: '0 4px 12px rgba(28, 35, 49, 0.15)'
            });
            
            backToTopButton.addEventListener('click', function() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            
            backToTopButton.addEventListener('mouseenter', function() {
                this.style.backgroundColor = 'var(--accent-color)';
                this.style.color = 'white';
            });
            
            backToTopButton.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'var(--background)';
                this.style.color = 'var(--accent-color)';
            });
            
            document.body.appendChild(backToTopButton);
        }
    }
    
    // Show/hide back to top button based on scroll position
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset > 300;
        
        if (scrolled && !backToTopButton) {
            createBackToTopButton();
        }
        
        if (backToTopButton) {
            backToTopButton.style.opacity = scrolled ? '1' : '0';
            backToTopButton.style.transform = scrolled ? 'translateY(0)' : 'translateY(20px)';
        }
    });
    
    console.log('Wise Bridge Global Partners website loaded successfully.');
});

// Add keyboard navigation styles
const style = document.createElement('style');
style.textContent = `
    .keyboard-navigation *:focus {
        outline: 2px solid var(--accent-color) !important;
        outline-offset: 2px !important;
    }
    
    .form-message {
        animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .back-to-top:focus {
        outline: 2px solid var(--accent-color);
        outline-offset: 2px;
    }
`;
document.head.appendChild(style);