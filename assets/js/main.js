/**
 * DRCL Market Analysis Website - Main JavaScript
 * Ethereal Clarity Design System
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize scroll reveal
  initScrollReveal();

  // Initialize mobile navigation
  initMobileNav();

  // Initialize active nav link
  setActiveNavLink();
});

/**
 * Scroll Reveal Animation using IntersectionObserver
 * More performant than scroll event listeners
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]');

  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add will-change before animation
        entry.target.style.willChange = 'transform, opacity';

        // Trigger reveal
        entry.target.classList.add('revealed');

        // Clean up will-change after animation completes
        setTimeout(() => {
          entry.target.style.willChange = 'auto';
        }, 500);

        // Stop observing after reveal
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '50px',
    threshold: 0.1
  });

  revealElements.forEach((el) => observer.observe(el));
}

/**
 * Mobile Navigation Toggle
 */
function initMobileNav() {
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');

  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('nav__links--open');

    // Update aria-expanded
    const isOpen = links.classList.contains('nav__links--open');
    toggle.setAttribute('aria-expanded', isOpen);

    // Update icon
    const icon = toggle.querySelector('svg use');
    if (icon) {
      icon.setAttribute('href', isOpen ? '#icon-x' : '#icon-menu');
    }
  });

  // Close mobile nav when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav') && links.classList.contains('nav__links--open')) {
      links.classList.remove('nav__links--open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * Set Active Navigation Link Based on Current Page
 */
function setActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav__link');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');

    // Check if current page matches link href
    if (currentPath.endsWith(href) ||
        (href === 'index.html' && (currentPath === '/' || currentPath.endsWith('/')))) {
      link.classList.add('nav__link--active');
    } else {
      link.classList.remove('nav__link--active');
    }
  });
}

/**
 * Lazy Load Spotlight Effect (loads on first mouse interaction)
 * Deferred to reduce initial load time
 */
let spotlightLoaded = false;

function loadSpotlightEffect() {
  if (spotlightLoaded) return;
  spotlightLoaded = true;

  // Create spotlight element
  const spotlight = document.createElement('div');
  spotlight.className = 'spotlight';
  spotlight.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    transition: transform 0.1s ease-out;
    transform: translate(-50%, -50%);
  `;
  document.body.appendChild(spotlight);

  // Update spotlight position
  document.addEventListener('mousemove', (e) => {
    spotlight.style.left = e.clientX + 'px';
    spotlight.style.top = e.clientY + 'px';
  });
}

// Load spotlight on first mouse move
document.addEventListener('mousemove', loadSpotlightEffect, { once: true });

/**
 * Smooth Scroll for Anchor Links
 */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

/**
 * Format Numbers with Commas
 * Utility function for displaying stats
 */
function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format Currency
 * Utility function for displaying monetary values
 */
function formatCurrency(amount, decimals = 0) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(amount);
}
