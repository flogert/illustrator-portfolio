// Flogert Portfolio - Brutalist/Minimalist Interactions

const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
const isCoarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;

document.addEventListener('DOMContentLoaded', () => {
  updateCurrentYear();
  
  if (!isCoarsePointer && !prefersReducedMotion) {
    initializeCustomCursor();
  }
  
  initializeSmoothScroll();
  initializeMobileMenu();
  initializeScrollAnimations();
  initializeFiltering();
});

function updateCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

// ============================================
// Scroll Animations (Fade/Scale)
// ============================================
function initializeScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });
}

// ============================================
// Custom Cursor (Minimalist)
// ============================================
function initializeCustomCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;
  
  let cursorX = 0;
  let cursorY = 0;
  let mouseX = 0;
  let mouseY = 0;
  
  // Initial position off-screen
  cursorX = -100;
  cursorY = -100;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  function animate() {
    // Faster tracking for brutalist feel
    const dt = 0.2; 
    cursorX += (mouseX - cursorX) * dt;
    cursorY += (mouseY - cursorY) * dt;
    
    // Translate -50% to center the cursor div on the mouse
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animate);
  }
  animate();
  
  // Simple hover effect scale
  const interactiveSelector = 'a, button, input, textarea, [role="button"]';
  document.querySelectorAll(interactiveSelector).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('scale-[2.5]');
      // In brutalist mode we might want to invert colors or just scale. 
      // The cursor has mix-blend-exclusion already in HTML so scaling is enough.
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('scale-[2.5]');
    });
  });
}

// ============================================
// Smooth Scroll (Native + Anchor)
// ============================================
function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Close mobile menu if open
        const menuToggle = document.getElementById('menu-toggle');
        const menu = document.getElementById('menu');
        if (menu && !menu.classList.contains('hidden') && window.innerWidth < 768) {
             menu.classList.add('hidden');
             if(menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
        }

        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
}

// ============================================
// Mobile Menu Toggle (Simple)
// ============================================
function initializeMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu');
  
  if (!menuToggle || !menu) return;

  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
      // Close
      menu.classList.add('hidden');
      menu.classList.remove('flex');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.innerHTML = '☰';
      document.body.style.overflow = '';
    } else {
      // Open
      menu.classList.remove('hidden');
      menu.classList.add('flex');
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.innerHTML = '✕';
      document.body.style.overflow = 'hidden';
    }
  });

  // Close when clicking a link
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
      menu.classList.remove('flex');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.innerHTML = '☰';
      document.body.style.overflow = '';
    });
  });
}

// ============================================
// Portfolio Filtering
// ============================================
function initializeFiltering() {
    const filters = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-item');

    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            // Update active state
            filters.forEach(btn => btn.classList.remove('text-brand-accent'));
            filter.classList.add('text-brand-accent');

            const category = filter.getAttribute('data-filter');

            projects.forEach(project => {
                const projectCategory = project.getAttribute('data-category');
                
                if (category === 'all' || projectCategory === category) {
                    project.classList.remove('hidden');
                    // Simple fade in
                    project.style.opacity = '0';
                    setTimeout(() => project.style.opacity = '1', 50);
                } else {
                    project.classList.add('hidden');
                }
            });
        });
    });
}
