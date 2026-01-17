// Cozy Gaming Portfolio - Animation & Interactions
// Using vanilla JS with Framer Motion-inspired animations
import * as THREE from 'three';

const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
const isCoarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  updateCurrentYear();

  if (prefersReducedMotion) {
    // Ensure nothing remains hidden when animations are disabled.
    document.querySelectorAll('[data-animate]').forEach((el) => el.classList.add('animate-in'));
  }

  if (!prefersReducedMotion && !isCoarsePointer) {
    initializeCustomCursor();
  }

  if (!prefersReducedMotion && !isCoarsePointer) {
    initializeConstellation();
  }
  // initializeParticles(); // Disabled - animated emojis removed
  if (!prefersReducedMotion) {
    initializeScrollAnimations();
  }
  initializeMobileMenu();

  // Hover-only effects can feel glitchy on touch devices.
  if (!prefersReducedMotion && !isCoarsePointer) {
    initializeHoverEffects();
    initializeMagneticButtons();
  }

  if (!prefersReducedMotion) {
    initializeSmoothScroll();
    initializeTextAnimations();
  }

  if (!prefersReducedMotion && !isCoarsePointer) {
    initializeThreeButtons();
  }
});

function updateCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (!yearEl) return;
  yearEl.textContent = String(new Date().getFullYear());
}

// ============================================
// Three.js Button Particle Effects
// ============================================
function initializeThreeButtons() {
  const wrappers = document.querySelectorAll('.three-button-wrapper');
  
  wrappers.forEach((wrapper) => {
    const canvas = wrapper.querySelector('.three-button-canvas');
    const button = wrapper.querySelector('.three-btn');
    if (!canvas || !button) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1000);
    camera.position.z = 30;
    
    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      alpha: true,
      antialias: true 
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create particles
    const particleCount = 50;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = [];
    
    // Cozy color palette
    const cozyColors = [
      new THREE.Color(0xFFB5C5), // pink
      new THREE.Color(0x9B7EBD), // purple
      new THREE.Color(0xFFDAB3), // peach
      new THREE.Color(0xE8D5F2), // lavender
    ];
    
    for (let i = 0; i < particleCount; i++) {
      // Random positions in a sphere around the button
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 15 + Math.random() * 20;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi) - 20;
      
      // Random cozy color
      const color = cozyColors[Math.floor(Math.random() * cozyColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      sizes[i] = Math.random() * 3 + 1;
      
      velocities.push({
        baseX: positions[i * 3],
        baseY: positions[i * 3 + 1],
        baseZ: positions[i * 3 + 2]
      });
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Custom shader material for glowing particles
    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    // Mouse tracking
    let mouseX = 0, mouseY = 0;
    let isHovering = false;
    let targetOpacity = 0;
    
    button.addEventListener('mouseenter', () => {
      isHovering = true;
      targetOpacity = 0.8;
    });
    
    button.addEventListener('mouseleave', () => {
      isHovering = false;
      targetOpacity = 0;
    });
    
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });
    
    // Resize handler
    function resize() {
      const rect = wrapper.getBoundingClientRect();
      const width = rect.width * 2;
      const height = rect.height * 3;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);
    
    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      
      // Smooth opacity transition
      material.opacity += (targetOpacity - material.opacity) * 0.1;
      
      // Update particle positions
      const positions = geometry.attributes.position.array;
      
      for (let i = 0; i < particleCount; i++) {
        const vel = velocities[i];
        
        if (isHovering) {
          // Particles react to mouse
          const targetX = vel.baseX + mouseX * 10;
          const targetY = vel.baseY + mouseY * 10;
          
          positions[i * 3] += (targetX - positions[i * 3]) * 0.05;
          positions[i * 3 + 1] += (targetY - positions[i * 3 + 1]) * 0.05;
          
          // Add some floating motion
          positions[i * 3] += Math.sin(Date.now() * 0.001 + i) * 0.1;
          positions[i * 3 + 1] += Math.cos(Date.now() * 0.001 + i) * 0.1;
        } else {
          // Return to base position
          positions[i * 3] += (vel.baseX - positions[i * 3]) * 0.02;
          positions[i * 3 + 1] += (vel.baseY - positions[i * 3 + 1]) * 0.02;
        }
      }
      
      geometry.attributes.position.needsUpdate = true;
      
      // Rotate particles gently
      particles.rotation.z += 0.001;
      
      renderer.render(scene, camera);
    }
    animate();
  });
}

// ============================================
// Custom Animated Cursor
// ============================================
function initializeCustomCursor() {
  const cursor = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursor-trail');
  
  if (!cursor || !cursorTrail) return;

  document.body.classList.add('cozy-cursor-hidden');
  
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let trailX = 0, trailY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Smooth cursor animation
  function animateCursor() {
    // Main cursor follows mouse directly
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.left = cursorX - 12 + 'px';
    cursor.style.top = cursorY - 12 + 'px';
    
    // Trail follows with delay
    trailX += (mouseX - trailX) * 0.1;
    trailY += (mouseY - trailY) * 0.1;
    cursorTrail.style.left = trailX - 20 + 'px';
    cursorTrail.style.top = trailY - 20 + 'px';
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  
  // Cursor effects on hover
  const interactiveElements = document.querySelectorAll('a, button, .game-card, .skill-card, .social-link');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(2)';
      cursorTrail.style.transform = 'scale(1.5)';
      cursorTrail.style.borderColor = 'var(--cozy-pink)';
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      cursorTrail.style.transform = 'scale(1)';
      cursorTrail.style.borderColor = 'var(--cozy-purple)';
    });
  });
  
  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorTrail.style.opacity = '0';
  });
  
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorTrail.style.opacity = '1';
  });
}

// ============================================
// Interactive Constellation Background
// ============================================
function initializeConstellation() {
  const canvas = document.getElementById('constellation');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 150 };
  
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  
  // Track mouse
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });
  
  // Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = Math.random() * 30 + 1;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
    }
    
    update() {
      // Mouse interaction
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;
      let maxDistance = mouse.radius;
      let force = (maxDistance - distance) / maxDistance;
      let directionX = forceDirectionX * force * this.density;
      let directionY = forceDirectionY * force * this.density;
      
      if (distance < mouse.radius) {
        this.x -= directionX;
        this.y -= directionY;
      } else {
        // Gentle floating
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
    }
    
    draw() {
      ctx.fillStyle = 'rgba(155, 126, 189, 0.6)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Create particles
  const particleCount = Math.floor((width * height) / 15000);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  // Connect particles
  function connect() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          let opacity = 1 - distance / 120;
          ctx.strokeStyle = `rgba(255, 181, 197, ${opacity * 0.3})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }
  
  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connect();
    
    requestAnimationFrame(animate);
  }
  animate();
}

// ============================================
// Floating Particles Background
// ============================================
function initializeParticles() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;

  const emojis = ['✨', '⭐', '🌟', '💫', '🌸', '🍂', '🎮', '💜', '🌙'];
  const particleCount = 20;

  for (let i = 0; i < particleCount; i++) {
    createParticle(particlesContainer, emojis);
  }
}

function createParticle(container, emojis) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  
  // Random positioning and timing
  const size = Math.random() * 20 + 12;
  particle.style.cssText = `
    left: ${Math.random() * 100}%;
    font-size: ${size}px;
    animation-duration: ${Math.random() * 15 + 10}s;
    animation-delay: ${Math.random() * -20}s;
    opacity: ${Math.random() * 0.5 + 0.2};
  `;
  
  container.appendChild(particle);
}

// ============================================
// Scroll-Triggered Animations (Framer Motion Style)
// ============================================
function initializeScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  // Intersection Observer for scroll animations
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add animation class with stagger delay
        requestAnimationFrame(() => {
          entry.target.classList.add('animate-in');
        });
        
        // Optionally unobserve after animation
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all animated elements
  animatedElements.forEach(el => observer.observe(el));

  // Animate header immediately
  const header = document.querySelector('[data-animate="header"]');
  if (header) {
    setTimeout(() => header.classList.add('animate-in'), 100);
  }
}

// ============================================
// Mobile Menu Toggle
// ============================================
function initializeMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu');

  if (!menuToggle || !menu) return;

  const openMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close navigation menu');
    menu.setAttribute('aria-hidden', 'false');

    menu.classList.remove('hidden');
    menu.classList.add('flex', 'flex-col', 'absolute', 'top-full', 'left-0', 'right-0');
    menu.classList.add('bg-cozy-cream/95', 'backdrop-blur-md', 'p-4', 'gap-2', 'border-b-4', 'border-cozy-brown/10');
    menu.style.animation = 'fadeInUp 0.3s ease-out forwards';

    // Move focus into the opened menu for keyboard users.
    requestAnimationFrame(() => {
      menu.querySelector('a')?.focus?.();
    });
  };

  const closeMenu = (returnFocus = true) => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    menu.setAttribute('aria-hidden', 'true');

    menu.style.animation = 'none';
    menu.classList.add('hidden');
    menu.classList.remove('flex', 'flex-col', 'absolute', 'top-full', 'left-0', 'right-0');
    menu.classList.remove('bg-cozy-cream/95', 'backdrop-blur-md', 'p-4', 'gap-2', 'border-b-4', 'border-cozy-brown/10');

    if (returnFocus) {
      // Return focus to the toggle button.
      menuToggle.focus?.();
    }
  };

  const syncAriaVisibility = () => {
    // At desktop sizes, the nav is visible (md:flex), so it shouldn't be aria-hidden.
    if (window.innerWidth >= 768) {
      menu.style.animation = 'none';
      menu.classList.remove('hidden');
      menu.classList.remove('flex', 'flex-col', 'absolute', 'top-full', 'left-0', 'right-0');
      menu.classList.remove('bg-cozy-cream/95', 'backdrop-blur-md', 'p-4', 'gap-2', 'border-b-4', 'border-cozy-brown/10');
      menu.setAttribute('aria-hidden', 'false');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation menu');
      return;
    }
    // On mobile, follow the actual open/closed state.
    menu.setAttribute('aria-hidden', menu.classList.contains('hidden') ? 'true' : 'false');
  };

  // Ensure a consistent initial state.
  closeMenu(false);
  syncAriaVisibility();

  menuToggle.addEventListener('click', () => {
    const isHidden = menu.classList.contains('hidden');
    if (isHidden) openMenu();
    else closeMenu();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && window.innerWidth < 768 && menuToggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });

  // If we resize to desktop, make sure the mobile overlay state is cleared.
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      syncAriaVisibility();
    } else {
      closeMenu(false);
      syncAriaVisibility();
    }
  });

  // Close menu when clicking a link
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 768) {
        closeMenu(false);
      }
    });
  });
}

// ============================================
// Interactive Hover Effects
// ============================================
function initializeHoverEffects() {
  // Card tilt effect on hover
  const cards = document.querySelectorAll('.game-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // Button ripple effect
  const buttons = document.querySelectorAll('.cozy-button, .cozy-button-outline');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      
      ripple.style.cssText = `
        position: absolute;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 50%;
        pointer-events: none;
        width: 100px;
        height: 100px;
        left: ${e.clientX - rect.left - 50}px;
        top: ${e.clientY - rect.top - 50}px;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple animation to document
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// ============================================
// Smooth Scroll with easing
// ============================================
function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ============================================
// Parallax effect for floating elements
// ============================================
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const scrolled = window.pageYOffset;
      
      // Subtle parallax for decorative elements
      document.querySelectorAll('.animate-float, .animate-float-delayed').forEach((el, i) => {
        const speed = 0.05 + (i % 3) * 0.02;
        el.style.transform = `translateY(${scrolled * speed}px)`;
      });
      
      ticking = false;
    });
    ticking = true;
  }
});

// ============================================
// Magnetic Buttons Effect
// ============================================
function initializeMagneticButtons() {
  const magneticBtns = document.querySelectorAll('.magnetic-btn');
  
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0) scale(1)';
    });
  });
}

// ============================================
// Text Reveal Animations
// ============================================
function initializeTextAnimations() {
  // Add staggered letter animation to elements with .text-reveal class
  const textRevealElements = document.querySelectorAll('.text-reveal');
  
  textRevealElements.forEach(el => {
    const text = el.textContent;
    el.textContent = '';
    
    [...text].forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.setProperty('--char-index', i);
      el.appendChild(span);
    });
  });
  
  // Intersection observer for triggering animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('span').forEach(span => {
          span.style.animationPlayState = 'running';
        });
      }
    });
  }, { threshold: 0.5 });
  
  textRevealElements.forEach(el => observer.observe(el));
}

// ============================================
// Easter Egg: Konami Code
// ============================================
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      activateEasterEgg();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

function activateEasterEgg() {
  // Create rainbow mode
  document.body.classList.add('rainbow-mode');
  
  // Add confetti explosion
  for (let i = 0; i < 100; i++) {
    createConfetti();
  }
  
  // Show secret message
  const message = document.createElement('div');
  message.innerHTML = '🎮 You found the secret! 🎮<br>Achievement Unlocked: Code Master';
  message.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #FFB5C5, #9B7EBD);
    color: white;
    padding: 30px 50px;
    border-radius: 20px;
    font-family: 'Press Start 2P', cursive;
    font-size: 14px;
    text-align: center;
    z-index: 10000;
    animation: popIn 0.5s ease-out;
    box-shadow: 0 20px 60px rgba(155, 126, 189, 0.5);
  `;
  document.body.appendChild(message);
  
  // Add pop animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes popIn {
      0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
      50% { transform: translate(-50%, -50%) scale(1.2); }
      100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    .rainbow-mode {
      animation: rainbowBg 2s linear infinite;
    }
    @keyframes rainbowBg {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
  
  // Remove after 3 seconds
  setTimeout(() => {
    message.remove();
    document.body.classList.remove('rainbow-mode');
  }, 3000);
}

function createConfetti() {
  const confetti = document.createElement('div');
  const colors = ['#FFB5C5', '#9B7EBD', '#FFDAB3', '#E8D5F2', '#FDF6E3'];
  
  confetti.style.cssText = `
    position: fixed;
    width: ${Math.random() * 10 + 5}px;
    height: ${Math.random() * 10 + 5}px;
    background: ${colors[Math.floor(Math.random() * colors.length)]};
    left: ${Math.random() * 100}vw;
    top: -20px;
    border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
    pointer-events: none;
    z-index: 9999;
    animation: confettiFall ${Math.random() * 2 + 2}s linear forwards;
  `;
  
  document.body.appendChild(confetti);
  
  // Add falling animation if not exists
  if (!document.getElementById('confetti-style')) {
    const style = document.createElement('style');
    style.id = 'confetti-style';
    style.textContent = `
      @keyframes confettiFall {
        to {
          transform: translateY(100vh) rotate(${Math.random() * 720}deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  setTimeout(() => confetti.remove(), 4000);
}

// ============================================
// Type writer effect for hero (optional enhancement)
// ============================================
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// Console easter egg
console.log('%c🎮 Welcome to Flogert\'s Cozy Portfolio! ✨', 
  'font-size: 20px; color: #9B7EBD; font-weight: bold;');
console.log('%c☕ Made with love and lots of matcha lattes 🍵', 
  'font-size: 14px; color: #FFB5C5;');
console.log('%c🕹️ Try the Konami Code for a surprise!', 
  'font-size: 12px; color: #FFDAB3;');
