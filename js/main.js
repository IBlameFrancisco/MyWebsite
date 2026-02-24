/* ============================================================
   PERSONAL WEBSITE — INTERACTIONS & ANIMATIONS
   Animated loader, custom cursor, magnetic buttons, scroll
   reveals, counter animations, tilt effects, and more.
   ============================================================ */

(function () {
  'use strict';

  // ========== LOADER ==========
  var loader = document.getElementById('loader');
  var loaderBarFill = document.getElementById('loader-bar-fill');
  var loaderNum = document.getElementById('loader-num');
  var loaderProgress = 0;
  var loaderTarget = 100;
  var loaderDone = false;

  function tickLoader() {
    if (loaderDone) return;

    // Accelerate toward target
    var remaining = loaderTarget - loaderProgress;
    var increment = Math.max(0.5, remaining * 0.08);
    loaderProgress = Math.min(loaderProgress + increment, loaderTarget);

    if (loaderNum) loaderNum.textContent = Math.round(loaderProgress);
    if (loaderBarFill) loaderBarFill.style.width = loaderProgress + '%';

    if (loaderProgress >= 99.5) {
      loaderProgress = 100;
      if (loaderNum) loaderNum.textContent = '100';
      if (loaderBarFill) loaderBarFill.style.width = '100%';
      loaderDone = true;

      setTimeout(function () {
        if (loader) loader.classList.add('hidden');
        document.body.classList.add('loaded');
      }, 400);
      return;
    }

    requestAnimationFrame(tickLoader);
  }

  // Start loader immediately
  requestAnimationFrame(tickLoader);

  // Speed up when page is fully loaded
  window.addEventListener('load', function () {
    loaderTarget = 100;
  });

  // ========== SCROLL PROGRESS BAR ==========
  var scrollProgress = document.getElementById('scroll-progress');

  function updateScrollProgress() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = progress + '%';
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // ========== CUSTOM CURSOR ==========
  var cursor = document.getElementById('cursor');
  var follower = document.getElementById('cursor-follower');
  var mouseX = 0;
  var mouseY = 0;
  var followerX = 0;
  var followerY = 0;

  // Only init cursor on non-touch devices
  var hasHover = window.matchMedia('(hover: hover)').matches;

  if (hasHover && cursor && follower) {
    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    (function animateFollower() {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    })();

    // Hover effects on interactive elements
    var interactiveSelector = 'a, button, .course-tag, .family-card, .work-item, .social-btn';
    document.addEventListener('mouseenter', function (e) {
      if (e.target.closest(interactiveSelector)) {
        follower.classList.add('hovering');
      }
    }, true);

    document.addEventListener('mouseleave', function (e) {
      if (e.target.closest(interactiveSelector)) {
        follower.classList.remove('hovering');
      }
    }, true);
  }

  // ========== NAVIGATION ==========
  var nav = document.getElementById('nav');

  window.addEventListener('scroll', function () {
    if (nav) {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // Smooth scroll for anchor links
  var anchorLinks = document.querySelectorAll('a[href^="#"]');
  for (var i = 0; i < anchorLinks.length; i++) {
    anchorLinks[i].addEventListener('click', handleAnchorClick);
  }

  function handleAnchorClick(e) {
    e.preventDefault();
    var href = this.getAttribute('href');
    var target = document.querySelector(href);
    if (target) {
      var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
      var top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }

    // Close mobile menu if open
    var mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  }

  // ========== MOBILE MENU ==========
  var menuBtn = document.getElementById('menu-btn');
  var mobileMenu = document.getElementById('mobile-menu');

  function openMobileMenu() {
    if (menuBtn) menuBtn.classList.add('active');
    if (mobileMenu) mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (menuBtn) menuBtn.classList.remove('active');
    if (mobileMenu) mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  // ========== SCROLL REVEAL (Intersection Observer) ==========
  var revealElements = document.querySelectorAll('.reveal-up');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -80px 0px'
      }
    );

    for (var j = 0; j < revealElements.length; j++) {
      revealObserver.observe(revealElements[j]);
    }
  } else {
    // Fallback: show everything
    for (var k = 0; k < revealElements.length; k++) {
      revealElements[k].classList.add('visible');
    }
  }

  // ========== COUNTER ANIMATION ==========
  var counters = document.querySelectorAll('.stat-number[data-count]');

  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    for (var c = 0; c < counters.length; c++) {
      counterObserver.observe(counters[c]);
    }
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var duration = 2000;
    var start = performance.now();

    function step(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      // Ease-out quart
      var ease = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.round(target * ease);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  // ========== MAGNETIC BUTTONS ==========
  var magneticEls = document.querySelectorAll('.magnetic');

  for (var m = 0; m < magneticEls.length; m++) {
    (function (el) {
      var strength = parseInt(el.getAttribute('data-strength')) || 20;

      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = 'translate(' + (x * strength / 100) + 'px, ' + (y * strength / 100) + 'px)';
      });

      el.addEventListener('mouseleave', function () {
        el.style.transform = 'translate(0, 0)';
        el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(function () {
          el.style.transition = '';
        }, 600);
      });
    })(magneticEls[m]);
  }

  // ========== TILT EFFECT ON CARDS ==========
  var tiltCards = document.querySelectorAll('[data-tilt]');

  if (hasHover) {
    for (var t = 0; t < tiltCards.length; t++) {
      (function (card) {
        card.addEventListener('mousemove', function (e) {
          var rect = card.getBoundingClientRect();
          var x = (e.clientX - rect.left) / rect.width;
          var y = (e.clientY - rect.top) / rect.height;
          var tiltX = (y - 0.5) * 6; // degrees
          var tiltY = (x - 0.5) * -6;
          card.style.transform = 'perspective(600px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) translateY(-6px)';
        });

        card.addEventListener('mouseleave', function () {
          card.style.transform = '';
          card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
          setTimeout(function () {
            card.style.transition = '';
          }, 500);
        });
      })(tiltCards[t]);
    }
  }

  // ========== PARALLAX ON HERO BG TEXT ==========
  var heroBgText = document.querySelector('.hero-bg-text');

  if (heroBgText) {
    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;
      var speed = 0.3;
      heroBgText.style.transform = 'translateX(-50%) translateY(' + (scrollY * speed) + 'px)';
    }, { passive: true });
  }

  // ========== PARALLAX ON HERO ORBS ==========
  var orbs = document.querySelectorAll('.orb');

  if (orbs.length > 0) {
    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;
      for (var o = 0; o < orbs.length; o++) {
        var speed = 0.05 + (o * 0.03);
        orbs[o].style.marginTop = -(scrollY * speed) + 'px';
      }
    }, { passive: true });
  }

  // ========== ACTIVE NAV LINK HIGHLIGHT ==========
  var sections = document.querySelectorAll('.section, .hero');
  var navLinks = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window && navLinks.length > 0) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute('id');
            for (var n = 0; n < navLinks.length; n++) {
              if (navLinks[n].getAttribute('href') === '#' + id) {
                navLinks[n].classList.add('active');
              } else {
                navLinks[n].classList.remove('active');
              }
            }
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-20% 0px -40% 0px'
      }
    );

    for (var s = 0; s < sections.length; s++) {
      sectionObserver.observe(sections[s]);
    }
  }

})();
