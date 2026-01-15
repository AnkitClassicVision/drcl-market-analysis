/**
 * DRCL Market Analysis Website - Main JavaScript
 * Ethereal Clarity Design System - Optimized for 60fps
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize scroll reveal with optimized settings
  initScrollReveal();

  // Initialize mobile navigation
  initMobileNav();

  // Initialize active nav link
  setActiveNavLink();

  // Initialize scroll performance optimizations
  initScrollPerformance();
});

/**
 * Scroll Reveal Animation using IntersectionObserver
 * Optimized with higher threshold and immediate reveal
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');

  if (!revealElements.length) return;

  // Use requestIdleCallback if available for non-critical work
  const scheduleReveal = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add revealed class immediately - no RAF needed for class toggle
        entry.target.classList.add('revealed');
        // Stop observing after reveal
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '50px 0px', // Trigger earlier for smoother experience
    threshold: 0.1
  });

  // Observe elements with slight delay to not block initial render
  scheduleReveal(() => {
    revealElements.forEach((el) => observer.observe(el));
  });
}

/**
 * Mobile Navigation Toggle - Optimized
 */
function initMobileNav() {
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');

  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('nav__links--open');
    toggle.setAttribute('aria-expanded', isOpen);

    // Update icon
    const icon = toggle.querySelector('svg use');
    if (icon) {
      icon.setAttribute('href', isOpen ? '#icon-x' : '#icon-menu');
    }
  }, { passive: true });

  // Close mobile nav when clicking outside - use capture for better performance
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav') && links.classList.contains('nav__links--open')) {
      links.classList.remove('nav__links--open');
      toggle.setAttribute('aria-expanded', 'false');
      const icon = toggle.querySelector('svg use');
      if (icon) icon.setAttribute('href', '#icon-menu');
    }
  }, { passive: true });
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
 * Smooth Scroll for Anchor Links - Using native behavior
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
  }, { passive: false });
});

/**
 * Scroll Performance Optimization
 * Pauses animations during scroll for smoother experience
 */
function initScrollPerformance() {
  const auroraBlobs = document.querySelectorAll('.aurora-blob');
  if (!auroraBlobs.length) return;

  let scrollTimeout;
  let isScrolling = false;

  const pauseAnimations = () => {
    if (!isScrolling) {
      isScrolling = true;
      auroraBlobs.forEach(blob => {
        blob.style.animationPlayState = 'paused';
      });
    }

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
      auroraBlobs.forEach(blob => {
        blob.style.animationPlayState = 'running';
      });
    }, 150);
  };

  window.addEventListener('scroll', pauseAnimations, { passive: true });
}

/**
 * Utility: Throttle function for performance-critical events
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

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
