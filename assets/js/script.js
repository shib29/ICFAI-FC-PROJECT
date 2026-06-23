if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && typeof MotionPathPlugin !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, ScrollToPlugin);
}

function runWhenReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

runWhenReady(function () {
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    setTimeout(function () {
      const body = document.body || document.getElementsByTagName('body')[0];
      if (body) body.classList.add('loaded');
      loadingScreen.style.opacity = '0';
      loadingScreen.style.pointerEvents = 'none';
      setTimeout(function () {
        loadingScreen.style.display = 'none';
        if (loadingScreen.parentNode) {
          loadingScreen.parentNode.removeChild(loadingScreen);
        }
      }, 500);
    }, 2000);
  } else {
    const body = document.body || document.getElementsByTagName('body')[0];
    if (body) body.classList.add('loaded');
  }
});


const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, {
  threshold: 0.2,
});

document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

const navLinkItems = document.querySelectorAll('.nav-links a');
navLinkItems.forEach(link => {
  link.addEventListener('click', () => {
    if (navLinks.classList.contains('show')) {
      navLinks.classList.remove('show');
    }
  });
});

document.addEventListener('click', (event) => {
  if (
    navLinks.classList.contains('show') &&
    !navLinks.contains(event.target) &&
    !hamburger.contains(event.target)
  ) {
    navLinks.classList.remove('show');
  }
});

window.addEventListener('scroll', () => {
  if (navLinks.classList.contains('show')) {
    navLinks.classList.remove('show');
  }
});



window.onload = function () {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

  gsap.from(".quote-icon-left", {
    x: -200,
    y: -100,
    opacity: 0,
    duration: 1.5,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".textContent",
      start: "top center",
      toggleActions: "play none none none",
      // markers: true
    }
  });

  gsap.from(".quote-icon-right", {
    y: 100,
    opacity: 0,
    scale: 0.5,
    duration: 1.5,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".textContent",
      start: "top center",
      toggleActions: "play none none none",
      // markers: true
    }
  });


  gsap.from(".Quote-icon-left", {
    x: -200,
    y: -100,
    opacity: 0,
    scale: 0.5,
    duration: 1.5,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".textkontent",
      start: "top center",
      toggleActions: "play none none none",
      // markers: true
    }
  });

  gsap.from(".Quote-icon-right", {
    x: 100,
    y: 100,
    opacity: 0,
    scale: 0.5,
    duration: 1.5,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".textkontent",
      start: "top center",
      toggleActions: "play none none none",
      // markers: true
    }
  });

}




runWhenReady(function () {
  const carousel = document.getElementById('carousel');
  if (!carousel) return;
  const items = carousel.querySelectorAll('.carousel-item');
  const dots = document.querySelectorAll('.dot');
  let currentIndex = 0;
  let isUserScrolling = false;
  let autoScrollInterval;
  initResponsiveSquad();
  setupCarousel();

function setupCarousel() {
  updateActiveSlide(currentIndex);
  
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      currentIndex = i;
      scrollToIndex(currentIndex);
      resetAutoScroll();
    });
  });

  // Handle mobile touch events
  let touchStartX = 0;
  let touchEndX = 0;
  let isDragging = false;
  
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    pauseAutoScroll();
    isDragging = true;
  }, {passive: true});

  carousel.addEventListener('touchmove', (e) => {
    if (isDragging) {
      touchEndX = e.changedTouches[0].screenX;
      const deltaX = touchEndX - touchStartX;
      const itemWidth = items[0].offsetWidth + 20;
      const scrollPosition = itemWidth * currentIndex - deltaX;
      carousel.scrollLeft = scrollPosition;
    }
  }, {passive: true});

  carousel.addEventListener('touchend', (e) => {
    if (isDragging) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      isDragging = false;
    }
    startAutoScroll();
  }, {passive: true});

  // --- Desktop Mouse Dragging ---
  let isMouseDown = false;
  let mouseStartX = 0;
  let scrollStartX = 0;

  carousel.addEventListener('mousedown', (e) => {
    // Only left mouse button
    if (e.button !== 0) return;
    isMouseDown = true;
    mouseStartX = e.pageX;
    scrollStartX = carousel.scrollLeft;
    pauseAutoScroll();
    carousel.classList.add('dragging');
  });

  carousel.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;
    const deltaX = e.pageX - mouseStartX;
    carousel.scrollLeft = scrollStartX - deltaX;
  });

  carousel.addEventListener('mouseup', () => {
    if (isMouseDown) {
      isMouseDown = false;
      carousel.classList.remove('dragging');
      startAutoScroll();
    }
  });

  carousel.addEventListener('mouseleave', () => {
    if (isMouseDown) {
      isMouseDown = false;
      carousel.classList.remove('dragging');
      startAutoScroll();
    }
  });

  startAutoScroll();
  carousel.addEventListener('scroll', handleScroll);
}

function updateActiveSlide(index) {
  items.forEach((item, i) => {
    item.classList.remove('active', 'blur-left', 'blur-right');

    if (i === index) {
      item.classList.add('active');
      // Center the active slide
      gsap.to(item, {
        scale: 1,
        filter: 'blur(0)',
        opacity: 1,
        duration: 0.3
      });
    } else if (i === index - 1 || (index === 0 && i === items.length - 1)) {
      item.classList.add('blur-left');
      // Apply left blur effect
      gsap.to(item, {
        scale: 0.9,
        filter: 'blur(4px)',
        opacity: 0.8,
        duration: 0.3
      });
    } else if (i === index + 1 || (index === items.length - 1 && i === 0)) {
      item.classList.add('blur-right');
      // Apply right blur effect
      gsap.to(item, {
        scale: 0.9,
        filter: 'blur(4px)',
        opacity: 0.8,
        duration: 0.3
      });
    } else {
      // More blur for non-adjacent items
      gsap.to(item, {
        scale: 0.85,
        filter: 'blur(6px)',
        opacity: 0.6,
        duration: 0.3
      });
    }
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function scrollToIndex(index) {
  const itemWidth = items[0].offsetWidth + 20;
  const scrollPosition = itemWidth * index;
  const isMobile = window.innerWidth <= 768;
  const duration = isMobile ? 0.8 : 0.5;
  
  gsap.to(carousel, {
    scrollTo: { x: scrollPosition, autoKill: false },
    duration: duration,
    ease: "power2.out",
    onComplete: () => {
      updateActiveSlide(index);
    }
  });
}

  function handleScroll() {
    isUserScrolling = true;
    const scrollLeft = carousel.scrollLeft;
    const itemWidth = items[0].offsetWidth + 20;
    const index = Math.round(scrollLeft / itemWidth);

    if (index !== currentIndex) {
      currentIndex = index;
      updateActiveSlide(currentIndex);
    }

    clearTimeout(carousel._scrollTimeout);
    carousel._scrollTimeout = setTimeout(() => {
      isUserScrolling = false;
    }, 200);
  }

  function startAutoScroll() {
    clearInterval(autoScrollInterval); 
    const isMobile = window.innerWidth <= 768;
    const interval = isMobile ? 3000 : 5000;
    autoScrollInterval = setInterval(() => {
      if (!isUserScrolling) {
        currentIndex = (currentIndex + 1) % items.length;
        scrollToIndex(currentIndex);
      }
    }, interval);
  }

  function resetAutoScroll() {
    clearInterval(autoScrollInterval);
    startAutoScroll();
  }
  function updateSquadImages() {
    const squadImages = document.querySelectorAll('.carousel-item img');
    const isMobile = window.innerWidth <= 768;

    squadImages.forEach(img => {
      const newSrc = isMobile ? img.dataset.mobileSrc : img.dataset.desktopSrc;
      if (newSrc && img.src !== newSrc) {
        img.classList.add('loading');
        img.onload = () => img.classList.remove('loading');
        img.src = newSrc;
      }
    });
  }
  function initResponsiveSquad() {
    updateSquadImages();
    window.addEventListener('resize', function () {
      updateSquadImages();
      scrollToIndex(currentIndex);
    });
  }
});












function animateJerseyShine() {
  const shineElements = document.querySelectorAll('.jersey-shine .shine-overlay');
  if (!shineElements.length) {
    console.warn('No shine elements found');
    return;
  }

  shineElements.forEach((shine, idx) => {
    gsap.set(shine, { opacity: 0, x: '-140%' });
    gsap.to(shine, {
      x: '120%',
      duration: 3.5,
      ease: 'power2.inOut',
      repeat: -1,
      delay: idx * 0.5,
      opacity: 0.85,
      onStart: () => gsap.set(shine, { opacity: 0.85 }),
      onRepeat: () => gsap.set(shine, { opacity: 0.85, x: '-140%' })
    });
  });
}

function animateJerseyScrollIn() {
  const jerseyCards = document.querySelectorAll('.jersey-card');
  if (!jerseyCards.length) {
    console.warn('No jersey cards found');
    return;
  }

  // Reset initial state
  jerseyCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(60px) scale(0.92) rotateY(25deg)';
  });

  // Check if device is mobile
  const isMobile = window.innerWidth <= 768;

  gsap.to('.jersey-card', {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateY: 0,
    duration: isMobile ? 1.0 : 1.3,
    ease: 'power2.out',
    stagger: isMobile ? 0.12 : 0.18,
    scrollTrigger: {
      trigger: '.jersey-section',
      start: 'top 80%',
      once: true
    },
    onStart: () => {
      console.log('Jersey 3D bounce scroll animation triggered');
    }
  });
}

// COMPLETELY REMOVE TOUCH INTERACTIONS ON MOBILE
function addJerseyCardHoverEffect() {
  const jerseyCards = document.querySelectorAll('.jersey-card');
  if (!jerseyCards.length) return;

  // Multiple mobile detection methods
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth <= 768 ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0;

  jerseyCards.forEach(card => {
    if (!isMobile) {
      // DESKTOP ONLY - hover effects
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out',
          zIndex: 10,
          boxShadow: '0 20px 60px 0 rgba(2,62,138,0.25), 0 8px 20px rgba(0,0,0,0.18)'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
          zIndex: 2,
          boxShadow: '0 16px 40px 0 rgba(2,62,138,0.25)'
        });
      });
    }
    // MOBILE: NO INTERACTION AT ALL - just display images
  });
}

function forceImagesVisible() {
  const jerseyCards = document.querySelectorAll('.jersey-card');
  const jerseyImages = document.querySelectorAll('.jersey-card img, .jersey-image-wrapper img');
  const imageWrappers = document.querySelectorAll('.jersey-image-wrapper');

  // Force all jersey elements to be visible
  jerseyCards.forEach(card => {
    card.style.display = 'block';
    card.style.opacity = '1';
    card.style.visibility = 'visible';
    card.style.pointerEvents = 'auto';
    card.style.transform = 'none';
    card.style.position = 'relative';
  });

  jerseyImages.forEach(img => {
    img.style.display = 'block';
    img.style.opacity = '1';
    img.style.visibility = 'visible';
    img.style.pointerEvents = 'none'; // Prevent image drag
    img.style.webkitUserSelect = 'none';
    img.style.userSelect = 'none';
    img.style.webkitTouchCallout = 'none';
    img.style.webkitUserDrag = 'none';
    img.style.position = 'relative';
    img.style.zIndex = '1';
  });

  imageWrappers.forEach(wrapper => {
    wrapper.style.display = 'block';
    wrapper.style.opacity = '1';
    wrapper.style.visibility = 'visible';
    wrapper.style.position = 'relative';
  });
}



// Initialize everything
runWhenReady(() => {
  console.log('DOM loaded, initializing jersey animations...');

  // Check if all required elements exist
  const requiredElements = [
    '.jersey-section',
    '.jersey-card'
  ];

  const allElementsExist = requiredElements.every(selector =>
    document.querySelector(selector) !== null
  );

  if (!allElementsExist) {
    console.error('Some required jersey elements are missing from the DOM');
    return;
  }

  // FORCE IMAGES TO BE VISIBLE IMMEDIATELY
  forceImagesVisible();

  // DISABLE ALL TOUCH EVENTS
  // disableAllTouchEvents(); // This line is commented out as per the edit hint

  // Wait for images to load
  const images = document.querySelectorAll('.jersey-card img');
  let loadedImages = 0;

  function initAnimations() {
    console.log('Initializing animations...');

    // Force images visible again
    forceImagesVisible();

    // Initialize animations
    animateJerseyShine();
    animateJerseyScrollIn();
    addJerseyCardHoverEffect();

    console.log('Jersey animations initialized');
  }

  if (images.length === 0) {
    console.log('No images found, initializing without waiting');
    initAnimations();
  } else {
    console.log(`Found ${images.length} images, waiting for load...`);

images.forEach((img, index) => {
  if (img.complete && img.naturalWidth > 0) {
    console.log(`Image ${index} already loaded`);
    loadedImages++;
    if (loadedImages === images.length) {
      initAnimations();
    }
  } else {
    img.onload = () => {
      console.log(`Image ${index} loaded`);
      loadedImages++;
      if (loadedImages === images.length) {
        initAnimations();
      }
    };

    img.onerror = () => {
      console.warn(`Image ${index} failed to load:`, img.src);
      loadedImages++;
      if (loadedImages === images.length) {
        initAnimations();
      }
    };
  }
});

// Fallback timeout
setTimeout(() => {
  if (loadedImages < images.length) {
    console.log('Timeout reached, initializing anyway');
    initAnimations();
  }
}, 2000);
  }
});

// Additional safety nets
window.addEventListener('load', () => {
  console.log('Window loaded, forcing images visible again');
  forceImagesVisible();
  // disableAllTouchEvents(); // This line is commented out as per the edit hint
});

// Handle orientation changes
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    console.log('Orientation changed, forcing images visible');
    forceImagesVisible();
    // disableAllTouchEvents(); // This line is commented out as per the edit hint

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }, 300);
});

// Handle resize
window.addEventListener('resize', () => {
  clearTimeout(window.resizeTimeout);
  window.resizeTimeout = setTimeout(() => {
    forceImagesVisible();
    // disableAllTouchEvents(); // This line is commented out as per the edit hint

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }, 250);
});




// --- VIDEO CAROUSEL FIXED CODE ---
runWhenReady(function () {
  // Video carousel variables
  let currentSlide = 0;
  const carouselTrack = document.getElementById('carouselTrack');
  const carouselDots = document.getElementById('carouselDots');
  const slides = carouselTrack ? carouselTrack.querySelectorAll('.carousel-slide') : [];
  const dots = carouselDots ? carouselDots.querySelectorAll('.dotts') : [];
  const prevBtn = document.querySelector('.carousel-nav.prev');
  const nextBtn = document.querySelector('.carousel-nav.next');
  let autoplayInterval = null;
  const autoplayDelay = 4000;

  if (carouselTrack && dots.length && prevBtn && nextBtn) {
    function updateCarousel() {
      // Move slides
      const translateX = -currentSlide * carouselTrack.parentElement.offsetWidth;
      gsap.set(carouselTrack, { x: translateX });
      // Update active slide
      slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === currentSlide);
      });
      // Update dots
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlide);
      });
    }
    function goToSlide(idx) {
      currentSlide = idx;
      updateCarousel();
    }
    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      updateCarousel();
    }
    function prevSlide() {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      updateCarousel();
    }
    function startAutoplay() {
      if (autoplayInterval) clearInterval(autoplayInterval);
      autoplayInterval = setInterval(nextSlide, autoplayDelay);
    }
    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    }
    // Dots click
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        goToSlide(idx);
        stopAutoplay();
        startAutoplay();
      });
    });
    // Prev/Next click
    prevBtn.addEventListener('click', () => {
      prevSlide();
      stopAutoplay();
      startAutoplay();
    });
    nextBtn.addEventListener('click', () => {
      nextSlide();
      stopAutoplay();
      startAutoplay();
    });
    // Autoplay pause on hover
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', stopAutoplay);
    carouselContainer.addEventListener('mouseleave', startAutoplay);
    // Responsive update
    window.addEventListener('resize', updateCarousel);
    // Init
    updateCarousel();
    startAutoplay();
  }
});

function goToNews(id) {
  window.location.href = `newsdetails.html?id=${id}`;
}

// Side Drawer Toggle Logic
const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
const mobileSidebarToggleBtn = document.getElementById('mobileSidebarToggleBtn');
const sideDrawer = document.getElementById('sideDrawer');
const drawerCloseBtn = document.getElementById('drawerCloseBtn');
const drawerOverlay = document.getElementById('drawerOverlay');

function openDrawer() {
  if (sideDrawer && drawerOverlay) {
    sideDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
    document.body.style.overflow = 'hidden'; // Disable scroll
  }
}

function closeDrawer() {
  if (sideDrawer && drawerOverlay) {
    sideDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    document.body.style.overflow = ''; // Enable scroll
  }
}

if (sidebarToggleBtn) sidebarToggleBtn.addEventListener('click', openDrawer);
if (mobileSidebarToggleBtn) mobileSidebarToggleBtn.addEventListener('click', openDrawer);
if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

// Close drawer when clicking internal links
const drawerLinks = document.querySelectorAll('.drawer-links a');
drawerLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (link.getAttribute('href').startsWith('#')) {
      closeDrawer();
    }
  });
});