/* ============================================================
   PORTFOLIO — script.js
   Premium Personal Portfolio — Vanilla JavaScript
   ============================================================
   Table of Contents
   ------------------
   01. DOM Ready Wrapper
   02. Preloader
   03. Custom Cursor
   04. Scroll Progress Bar
   05. Sticky Navbar
   06. Active Navigation (Scroll Spy)
   07. Mobile Navigation Toggle
   08. Smooth Scrolling
   09. Typing Effect (Hero)
   10. Counter Animation
   11. Scroll Reveal (Intersection Observer)
   12. Skill Bars Animation
   13. Skills Category Tabs
   14. Project Filters
   15. Testimonials Carousel
   16. FAQ Accordion
   17. Contact Form Validation
   18. Back To Top Button
   19. Footer Current Year
   20. Floating Shapes Parallax
   21. Hover Glow Effect on Cards
   22. Utilities & Helpers
   ============================================================ */

;(function () {
    'use strict';

    /* --------------------------------------------------------
       00. UTILITIES & HELPERS
    -------------------------------------------------------- */

    /**
     * Shorthand DOM selectors
     */
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    /**
     * Throttle — limits function calls to once per `limit` ms
     */
    function throttle(fn, limit) {
        let last = 0;
        return function (...args) {
            const now = Date.now();
            if (now - last >= limit) {
                last = now;
                fn.apply(this, args);
            }
        };
    }

    /**
     * Debounce — delays function call until `delay` ms after last invocation
     */
    function debounce(fn, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    /**
     * Check if prefers-reduced-motion is enabled
     */
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /**
     * Easing function — easeOutExpo
     */
    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }


    /* --------------------------------------------------------
       01. DOM READY — Everything initialises here
    -------------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', function () {
        initPreloader();
        initCustomCursor();
        initScrollProgress();
        initStickyNavbar();
        initActiveNav();
        initMobileNav();
        initSmoothScroll();
        initTypingEffect();
        initScrollReveal();
        initCounters();
        initSkillBars();
        initSkillsTabs();
        initProjectFilters();
        initTestimonialsCarousel();
        initFaqAccordion();
        initContactForm();
        initBackToTop();
        initCurrentYear();
        initFloatingParallax();
        initCardGlowEffect();
    });


    /* --------------------------------------------------------
       02. PRELOADER
       – Shows loading animation then fades out
    -------------------------------------------------------- */
    function initPreloader() {
        const preloader = $('#preloader');
        if (!preloader) return;

        const fill = $('.preloader-bar-fill', preloader);

        /* Animate the progress bar fill */
        if (fill) {
            fill.style.transition = 'width 1.8s cubic-bezier(0.65, 0, 0.35, 1)';
            /* Trigger reflow, then set width */
            void fill.offsetWidth;
            fill.style.width = '100%';
        }

        /* Hide preloader once page fully loads */
        window.addEventListener('load', function () {
            /* Give the bar time to finish if load is very fast */
            const minDelay = 2000;
            const loadTime = performance.now();
            const remaining = Math.max(0, minDelay - loadTime);

            setTimeout(function () {
                preloader.classList.add('preloader-done');
                /* Remove from DOM after transition */
                setTimeout(function () {
                    preloader.style.display = 'none';
                    document.body.classList.add('loaded');
                }, 600);
            }, remaining);
        });
    }


    /* --------------------------------------------------------
       03. CUSTOM CURSOR
       – Large outer circle + small inner dot following mouse
    -------------------------------------------------------- */
    function initCustomCursor() {
        const cursor = $('#customCursor');
        const dot = $('#customCursorDot');
        if (!cursor || !dot) return;

        /* Only show custom cursor on non-touch, large screens */
        if ('ontouchstart' in window || window.innerWidth < 1024) {
            cursor.style.display = 'none';
            dot.style.display = 'none';
            return;
        }

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let dotX = 0;
        let dotY = 0;

        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        /* Smooth follow with lerp */
        function animateCursor() {
            const speed = 0.15;
            const dotSpeed = 0.35;

            cursorX += (mouseX - cursorX) * speed;
            cursorY += (mouseY - cursorY) * speed;
            dotX += (mouseX - dotX) * dotSpeed;
            dotY += (mouseY - dotY) * dotSpeed;

            cursor.style.transform = 'translate(' + cursorX + 'px, ' + cursorY + 'px) translate(-50%, -50%)';
            dot.style.transform = 'translate(' + dotX + 'px, ' + dotY + 'px) translate(-50%, -50%)';

            requestAnimationFrame(animateCursor);
        }
        requestAnimationFrame(animateCursor);

        /* Hover state — grow cursor on interactive elements */
        const hoverTargets = $$('a, button, .btn, .nav-link, .project-card, .service-card, .skill-card, .certificate-card, .testimonial-card, .faq-question, input, textarea, .contact-social-link, .floating-social-link, .project-action-btn, .footer-socials a');
        hoverTargets.forEach(function (el) {
            el.addEventListener('mouseenter', function () {
                cursor.classList.add('cursor-hover');
                dot.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', function () {
                cursor.classList.remove('cursor-hover');
                dot.classList.remove('cursor-hover');
            });
        });

        /* Hide cursor when it leaves the window */
        document.addEventListener('mouseleave', function () {
            cursor.style.opacity = '0';
            dot.style.opacity = '0';
        });
        document.addEventListener('mouseenter', function () {
            cursor.style.opacity = '1';
            dot.style.opacity = '1';
        });
    }


    /* --------------------------------------------------------
       04. SCROLL PROGRESS BAR
       – Horizontal bar at top showing scroll depth
    -------------------------------------------------------- */
    function initScrollProgress() {
        const fill = $('#scrollProgressFill');
        if (!fill) return;

        function updateProgress() {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            fill.style.width = progress + '%';
        }

        window.addEventListener('scroll', throttle(updateProgress, 16), { passive: true });
        updateProgress();
    }


    /* --------------------------------------------------------
       05. STICKY NAVBAR
       – Adds .scrolled class to nav after scrolling past threshold
    -------------------------------------------------------- */
    function initStickyNavbar() {
        var nav = $('nav.navbar');
        if (!nav) return;

        var threshold = 80;

        function handleNavScroll() {
            if (window.pageYOffset > threshold) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', throttle(handleNavScroll, 50), { passive: true });
        handleNavScroll();
    }


    /* --------------------------------------------------------
       06. ACTIVE NAVIGATION (SCROLL SPY)
       – Highlights current section link in the navbar
    -------------------------------------------------------- */
    function initActiveNav() {
        var navLinks = $$('.navbar-nav .nav-link');
        var sections = [];

        /* Build section list from nav links */
        navLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                var section = $(href);
                if (section) {
                    sections.push({ el: section, link: link });
                }
            }
        });

        if (sections.length === 0) return;

        function updateActiveNav() {
            var scrollPos = window.pageYOffset + 200;

            var activeIndex = -1;
            for (var i = sections.length - 1; i >= 0; i--) {
                if (scrollPos >= sections[i].el.offsetTop) {
                    activeIndex = i;
                    break;
                }
            }

            navLinks.forEach(function (link) {
                link.classList.remove('active');
            });

            if (activeIndex >= 0) {
                sections[activeIndex].link.classList.add('active');
            }
        }

        window.addEventListener('scroll', throttle(updateActiveNav, 100), { passive: true });
        updateActiveNav();
    }


    /* --------------------------------------------------------
       07. MOBILE NAVIGATION TOGGLE
       – Custom hamburger animation + overlay behaviour
    -------------------------------------------------------- */
    function initMobileNav() {
        var toggler = $('#navToggler');
        var navCollapse = $('#navbarNav');
        if (!toggler || !navCollapse) return;

        var isOpen = false;

        toggler.addEventListener('click', function () {
            isOpen = !isOpen;
            toggler.classList.toggle('active', isOpen);
            toggler.setAttribute('aria-expanded', isOpen);

            if (isOpen) {
                navCollapse.classList.add('show');
                document.body.style.overflow = 'hidden';
            } else {
                navCollapse.classList.remove('show');
                document.body.style.overflow = '';
            }
        });

        /* Close nav when a link is clicked on mobile */
        $$('.navbar-nav .nav-link, .btn-nav-cta', navCollapse).forEach(function (link) {
            link.addEventListener('click', function () {
                if (isOpen) {
                    isOpen = false;
                    toggler.classList.remove('active');
                    toggler.setAttribute('aria-expanded', 'false');
                    navCollapse.classList.remove('show');
                    document.body.style.overflow = '';
                }
            });
        });

        /* Close on escape key */
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isOpen) {
                isOpen = false;
                toggler.classList.remove('active');
                toggler.setAttribute('aria-expanded', 'false');
                navCollapse.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }


    /* --------------------------------------------------------
       08. SMOOTH SCROLLING
       – All anchor links scroll smoothly to target
    -------------------------------------------------------- */
    function initSmoothScroll() {
        $$('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var href = this.getAttribute('href');
                if (!href || href === '#') return;

                var target = $(href);
                if (!target) return;

                e.preventDefault();

                var navHeight = 80;
                var targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                if (prefersReducedMotion) {
                    window.scrollTo(0, targetPos);
                    return;
                }

                /* Smooth scroll with custom easing */
                var startPos = window.pageYOffset;
                var distance = targetPos - startPos;
                var duration = Math.min(1200, Math.max(600, Math.abs(distance) * 0.5));
                var startTime = null;

                function scrollStep(timestamp) {
                    if (!startTime) startTime = timestamp;
                    var elapsed = timestamp - startTime;
                    var progress = Math.min(elapsed / duration, 1);
                    var eased = easeOutExpo(progress);

                    window.scrollTo(0, startPos + distance * eased);

                    if (progress < 1) {
                        requestAnimationFrame(scrollStep);
                    }
                }

                requestAnimationFrame(scrollStep);

                /* Update URL hash without jumping */
                if (history.pushState) {
                    history.pushState(null, null, href);
                }
            });
        });
    }


    /* --------------------------------------------------------
       09. TYPING EFFECT (HERO)
       – Types and deletes phrases in a loop
    -------------------------------------------------------- */
    function initTypingEffect() {
        var typedEl = $('#typedText');
        if (!typedEl) return;

        var phrases = [
            'Frontend Web Developer',
            'UI/UX Enthusiast',
            'Creative Problem Solver',
            'Performance Optimizer',
            'Pixel-Perfect Craftsman',
            'Responsive Design Expert'
        ];

        var phraseIndex = 0;
        var charIndex = 0;
        var isDeleting = false;
        var typeSpeed = 80;
        var deleteSpeed = 40;
        var pauseAfterType = 2000;
        var pauseAfterDelete = 500;

        function type() {
            var current = phrases[phraseIndex];

            if (isDeleting) {
                typedEl.textContent = current.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typedEl.textContent = current.substring(0, charIndex + 1);
                charIndex++;
            }

            var nextDelay = isDeleting ? deleteSpeed : typeSpeed;

            /* Finished typing the phrase */
            if (!isDeleting && charIndex === current.length) {
                nextDelay = pauseAfterType;
                isDeleting = true;
            }

            /* Finished deleting the phrase */
            if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                nextDelay = pauseAfterDelete;
            }

            setTimeout(type, nextDelay);
        }

        /* Start after a short initial delay */
        setTimeout(type, 1000);
    }


    /* --------------------------------------------------------
       10. COUNTER ANIMATION
       – Counts up from 0 to data-target when visible
    -------------------------------------------------------- */
    function initCounters() {
        var counters = $$('.counter');
        if (counters.length === 0) return;

        var animated = new Set();

        function animateCounter(el) {
            var target = parseInt(el.getAttribute('data-target'), 10);
            if (isNaN(target)) return;

            var duration = 2000;
            var startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var elapsed = timestamp - startTime;
                var progress = Math.min(elapsed / duration, 1);
                var eased = easeOutExpo(progress);
                var current = Math.round(eased * target);

                el.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = target;
                }
            }

            requestAnimationFrame(step);
        }

        /* Use IntersectionObserver to trigger when visible */
        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !animated.has(entry.target)) {
                    animated.add(entry.target);
                    /* Delay based on position for stagger effect */
                    var index = counters.indexOf(entry.target);
                    setTimeout(function () {
                        animateCounter(entry.target);
                    }, index * 150);
                }
            });
        }, { threshold: 0.3 });

        counters.forEach(function (counter) {
            counterObserver.observe(counter);
        });
    }


    /* --------------------------------------------------------
       11. SCROLL REVEAL (Intersection Observer)
       – Reveals elements with .reveal-up, .reveal-left,
         .reveal-right when they scroll into view
    -------------------------------------------------------- */
    function initScrollReveal() {
        var revealElements = $$('.reveal-up, .reveal-left, .reveal-right');
        if (revealElements.length === 0) return;

        if (prefersReducedMotion) {
            /* If user prefers reduced motion, show everything immediately */
            revealElements.forEach(function (el) {
                el.classList.add('revealed');
            });
            return;
        }

        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    var delay = parseInt(el.getAttribute('data-delay'), 10) || 0;

                    setTimeout(function () {
                        el.classList.add('revealed');
                    }, delay);

                    /* Stop observing once revealed */
                    revealObserver.unobserve(el);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        });

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    }


    /* --------------------------------------------------------
       12. SKILL BARS ANIMATION
       – Fills bars to data-width % when scrolled into view
    -------------------------------------------------------- */
    function initSkillBars() {
        var skillFills = $$('.skill-bar-fill');
        if (skillFills.length === 0) return;

        var animated = new Set();

        var skillObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !animated.has(entry.target)) {
                    animated.add(entry.target);
                    var targetWidth = entry.target.getAttribute('data-width');
                    if (targetWidth) {
                        /* Small delay for visual stagger */
                        var parent = entry.target.closest('.skill-card');
                        var allCards = $$('.skill-card');
                        var index = allCards.indexOf(parent);
                        var stagger = Math.max(0, index) * 100;

                        setTimeout(function () {
                            entry.target.style.width = targetWidth + '%';
                        }, stagger);
                    }
                }
            });
        }, { threshold: 0.3 });

        skillFills.forEach(function (fill) {
            skillObserver.observe(fill);
        });
    }


    /* --------------------------------------------------------
       13. SKILLS CATEGORY TABS
       – Filters skill cards by data-category
    -------------------------------------------------------- */
    function initSkillsTabs() {
        var tabs = $$('.skills-tab');
        var cards = $$('.skill-card');
        if (tabs.length === 0 || cards.length === 0) return;

        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                /* Update active tab */
                tabs.forEach(function (t) {
                    t.classList.remove('active');
                });
                this.classList.add('active');

                var filter = this.getAttribute('data-filter');

                cards.forEach(function (card, index) {
                    var category = card.getAttribute('data-category');
                    var shouldShow = filter === 'all' || category === filter;

                    if (shouldShow) {
                        card.style.display = '';
                        /* Stagger animation */
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(function () {
                            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 60);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(function () {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }


    /* --------------------------------------------------------
       14. PROJECT FILTERS
       – Filters project cards by data-category
    -------------------------------------------------------- */
    function initProjectFilters() {
        var filters = $$('.project-filter');
        var projects = $$('.col-project');
        if (filters.length === 0 || projects.length === 0) return;

        filters.forEach(function (btn) {
            btn.addEventListener('click', function () {
                /* Update active filter */
                filters.forEach(function (f) {
                    f.classList.remove('active');
                });
                this.classList.add('active');

                var filter = this.getAttribute('data-filter');
                var visibleIndex = 0;

                projects.forEach(function (project) {
                    var category = project.getAttribute('data-category');
                    var shouldShow = filter === 'all' || category === filter;

                    if (shouldShow) {
                        project.style.display = '';
                        project.style.opacity = '0';
                        project.style.transform = 'scale(0.95) translateY(20px)';
                        var delay = visibleIndex * 100;
                        visibleIndex++;
                        setTimeout(function () {
                            project.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                            project.style.opacity = '1';
                            project.style.transform = 'scale(1) translateY(0)';
                        }, delay);
                    } else {
                        project.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        project.style.opacity = '0';
                        project.style.transform = 'scale(0.95)';
                        setTimeout(function () {
                            project.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }


    /* --------------------------------------------------------
       15. TESTIMONIALS CAROUSEL
       – Swipe-able, auto-play carousel with dots + arrows
    -------------------------------------------------------- */
    function initTestimonialsCarousel() {
        var track = $('#testimonialsTrack');
        var prevBtn = $('#testimonialPrev');
        var nextBtn = $('#testimonialNext');
        var dotsContainer = $('#testimonialDots');
        if (!track) return;

        var cards = $$('.testimonial-card', track);
        if (cards.length === 0) return;

        var currentIndex = 0;
        var autoPlayTimer = null;
        var autoPlayDelay = 5000;
        var isTransitioning = false;

        /* Calculate how many cards visible at once */
        function getVisibleCount() {
            if (window.innerWidth >= 1200) return 2;
            return 1;
        }

        /* Total number of slide positions */
        function getMaxIndex() {
            return Math.max(0, cards.length - getVisibleCount());
        }

        /* Build dot indicators */
        function buildDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            var total = getMaxIndex() + 1;
            for (var i = 0; i < total; i++) {
                var dot = document.createElement('button');
                dot.className = 'testimonial-dot' + (i === currentIndex ? ' active' : '');
                dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
                dot.setAttribute('data-index', i);
                dot.addEventListener('click', function () {
                    goToSlide(parseInt(this.getAttribute('data-index'), 10));
                });
                dotsContainer.appendChild(dot);
            }
        }

        /* Update active dot */
        function updateDots() {
            if (!dotsContainer) return;
            var dots = $$('.testimonial-dot', dotsContainer);
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        /* Slide to index */
        function goToSlide(index) {
            if (isTransitioning) return;

            var maxIndex = getMaxIndex();
            currentIndex = Math.max(0, Math.min(index, maxIndex));

            isTransitioning = true;
            var cardWidth = cards[0].offsetWidth;
            var gap = 32; /* matches CSS gap */
            var offset = currentIndex * (cardWidth + gap);

            track.style.transition = 'transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)';
            track.style.transform = 'translateX(-' + offset + 'px)';

            updateDots();

            setTimeout(function () {
                isTransitioning = false;
            }, 600);

            /* Reset auto-play timer */
            resetAutoPlay();
        }

        /* Next / Previous */
        function nextSlide() {
            var maxIndex = getMaxIndex();
            goToSlide(currentIndex >= maxIndex ? 0 : currentIndex + 1);
        }

        function prevSlide() {
            var maxIndex = getMaxIndex();
            goToSlide(currentIndex <= 0 ? maxIndex : currentIndex - 1);
        }

        /* Button events */
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        /* Auto-play */
        function startAutoPlay() {
            stopAutoPlay();
            autoPlayTimer = setInterval(nextSlide, autoPlayDelay);
        }

        function stopAutoPlay() {
            if (autoPlayTimer) {
                clearInterval(autoPlayTimer);
                autoPlayTimer = null;
            }
        }

        function resetAutoPlay() {
            stopAutoPlay();
            startAutoPlay();
        }

        /* Pause on hover */
        var carousel = $('.testimonials-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', stopAutoPlay);
            carousel.addEventListener('mouseleave', startAutoPlay);
        }

        /* Touch / Swipe support */
        var touchStartX = 0;
        var touchEndX = 0;
        var touchThreshold = 50;

        track.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay();
        }, { passive: true });

        track.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            var diff = touchStartX - touchEndX;
            if (Math.abs(diff) > touchThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            startAutoPlay();
        }, { passive: true });

        /* Keyboard navigation for carousel */
        if (carousel) {
            carousel.setAttribute('tabindex', '0');
            carousel.addEventListener('keydown', function (e) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    prevSlide();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    nextSlide();
                }
            });
        }

        /* Recalculate on resize */
        window.addEventListener('resize', debounce(function () {
            buildDots();
            goToSlide(Math.min(currentIndex, getMaxIndex()));
        }, 250));

        /* Init */
        buildDots();
        startAutoPlay();
    }


    /* --------------------------------------------------------
       16. FAQ ACCORDION
       – Toggles answer visibility with smooth animation
    -------------------------------------------------------- */
    function initFaqAccordion() {
        var faqItems = $$('.faq-item');
        if (faqItems.length === 0) return;

        faqItems.forEach(function (item) {
            var question = $('.faq-question', item);
            var answer = $('.faq-answer', item);
            if (!question || !answer) return;

            /* Set initial state */
            answer.style.maxHeight = '0';
            answer.style.overflow = 'hidden';
            answer.style.transition = 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), padding 0.4s ease, opacity 0.3s ease';
            answer.style.opacity = '0';

            question.addEventListener('click', function () {
                var isOpen = item.classList.contains('active');

                /* Close all other items (accordion behaviour) */
                faqItems.forEach(function (other) {
                    if (other !== item && other.classList.contains('active')) {
                        other.classList.remove('active');
                        var otherAnswer = $('.faq-answer', other);
                        var otherQuestion = $('.faq-question', other);
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = '0';
                            otherAnswer.style.opacity = '0';
                        }
                        if (otherQuestion) {
                            otherQuestion.setAttribute('aria-expanded', 'false');
                        }
                    }
                });

                /* Toggle current item */
                if (isOpen) {
                    item.classList.remove('active');
                    answer.style.maxHeight = '0';
                    answer.style.opacity = '0';
                    question.setAttribute('aria-expanded', 'false');
                } else {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 32 + 'px';
                    answer.style.opacity = '1';
                    question.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }


    /* --------------------------------------------------------
       17. CONTACT FORM VALIDATION
       – Client-side validation with visual feedback
    -------------------------------------------------------- */
    function initContactForm() {
        var form = $('#contactForm');
        if (!form) return;

        var nameInput = $('#contactName');
        var emailInput = $('#contactEmail');
        var subjectInput = $('#contactSubject');
        var messageInput = $('#contactMessage');
        var submitBtn = $('.btn-submit', form);
        var formStatus = $('#formStatus');

        /* Email validation regex */
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        /* Validate a single field */
        function validateField(input) {
            var group = input.closest('.form-group');
            if (!group) return false;

            var value = input.value.trim();
            var isValid = true;

            if (input.hasAttribute('required') && value === '') {
                isValid = false;
            }

            if (input.type === 'email' && value !== '' && !emailRegex.test(value)) {
                isValid = false;
            }

            if (isValid) {
                group.classList.remove('error');
                group.classList.add('success');
            } else {
                group.classList.remove('success');
                group.classList.add('error');
            }

            return isValid;
        }

        /* Live validation on blur */
        [nameInput, emailInput, subjectInput, messageInput].forEach(function (input) {
            if (!input) return;
            input.addEventListener('blur', function () {
                validateField(this);
            });
            /* Clear error on focus */
            input.addEventListener('focus', function () {
                var group = this.closest('.form-group');
                if (group) group.classList.remove('error');
            });
            /* Clear error on input */
            input.addEventListener('input', function () {
                var group = this.closest('.form-group');
                if (group && group.classList.contains('error')) {
                    validateField(this);
                }
            });
        });

        /* Form submit handler */
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            /* Validate all fields */
            var fields = [nameInput, emailInput, subjectInput, messageInput];
            var allValid = true;
            var firstInvalid = null;

            fields.forEach(function (input) {
                if (!input) return;
                var valid = validateField(input);
                if (!valid && allValid) {
                    allValid = false;
                    firstInvalid = input;
                }
            });

            if (!allValid) {
                /* Shake the form */
                form.classList.add('form-shake');
                setTimeout(function () {
                    form.classList.remove('form-shake');
                }, 600);

                /* Focus first invalid field */
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            /* Show loading state */
            var btnText = $('.btn-text', submitBtn);
            var btnLoading = $('.btn-loading', submitBtn);
            var btnIcon = $('i.bi-send', submitBtn);

            if (btnText) btnText.style.display = 'none';
            if (btnIcon) btnIcon.style.display = 'none';
            if (btnLoading) btnLoading.style.display = 'inline-flex';
            submitBtn.disabled = true;

            /* Simulate form submission (replace with real endpoint) */
            setTimeout(function () {
                /* Reset button state */
                if (btnText) btnText.style.display = '';
                if (btnIcon) btnIcon.style.display = '';
                if (btnLoading) btnLoading.style.display = 'none';
                submitBtn.disabled = false;

                /* Show success message */
                if (formStatus) {
                    formStatus.style.display = 'block';
                    formStatus.className = 'form-status success';
                    formStatus.innerHTML = '<i class="bi bi-check-circle-fill"></i> Thank you! Your message has been sent successfully. I\'ll get back to you soon.';

                    /* Hide after a few seconds */
                    setTimeout(function () {
                        formStatus.style.opacity = '0';
                        setTimeout(function () {
                            formStatus.style.display = 'none';
                            formStatus.style.opacity = '1';
                        }, 400);
                    }, 6000);
                }

                /* Reset form */
                form.reset();
                fields.forEach(function (input) {
                    if (!input) return;
                    var group = input.closest('.form-group');
                    if (group) {
                        group.classList.remove('success', 'error');
                    }
                });
            }, 2000);
        });
    }


    /* --------------------------------------------------------
       18. BACK TO TOP BUTTON
       – Shows after scrolling down, scrolls to top on click
    -------------------------------------------------------- */
    function initBackToTop() {
        var btn = $('#backToTop');
        if (!btn) return;

        var threshold = 400;

        function toggleButton() {
            if (window.pageYOffset > threshold) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        }

        window.addEventListener('scroll', throttle(toggleButton, 100), { passive: true });
        toggleButton();

        btn.addEventListener('click', function () {
            if (prefersReducedMotion) {
                window.scrollTo(0, 0);
                return;
            }

            var startPos = window.pageYOffset;
            var duration = Math.min(1200, Math.max(600, startPos * 0.4));
            var startTime = null;

            function scrollStep(timestamp) {
                if (!startTime) startTime = timestamp;
                var elapsed = timestamp - startTime;
                var progress = Math.min(elapsed / duration, 1);
                var eased = easeOutExpo(progress);

                window.scrollTo(0, startPos * (1 - eased));

                if (progress < 1) {
                    requestAnimationFrame(scrollStep);
                }
            }

            requestAnimationFrame(scrollStep);
        });
    }


    /* --------------------------------------------------------
       19. FOOTER CURRENT YEAR
       – Sets #currentYear to the present year
    -------------------------------------------------------- */
    function initCurrentYear() {
        var el = $('#currentYear');
        if (el) {
            el.textContent = new Date().getFullYear();
        }
    }


    /* --------------------------------------------------------
       20. FLOATING SHAPES PARALLAX
       – Subtle parallax movement of background shapes on scroll
    -------------------------------------------------------- */
    function initFloatingParallax() {
        var shapes = $$('.shape');
        if (shapes.length === 0 || prefersReducedMotion) return;

        /* Different speeds for each shape */
        var speeds = [0.02, -0.015, 0.025, -0.01, 0.018, -0.022];

        function updateParallax() {
            var scrollY = window.pageYOffset;

            shapes.forEach(function (shape, i) {
                var speed = speeds[i % speeds.length];
                var yOffset = scrollY * speed;
                var xOffset = Math.sin(scrollY * 0.001 + i) * 10;
                shape.style.transform = 'translate(' + xOffset + 'px, ' + yOffset + 'px)';
            });
        }

        window.addEventListener('scroll', throttle(updateParallax, 16), { passive: true });
    }


    /* --------------------------------------------------------
       21. HOVER GLOW EFFECT ON CARDS
       – Tracks mouse position on cards to create radial glow
    -------------------------------------------------------- */
    function initCardGlowEffect() {
        var glowCards = $$('.service-card, .project-card, .certificate-card, .skill-card, .timeline-card');
        if (glowCards.length === 0 || prefersReducedMotion) return;

        /* Only on desktop */
        if ('ontouchstart' in window || window.innerWidth < 1024) return;

        glowCards.forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;

                card.style.setProperty('--mouse-x', x + 'px');
                card.style.setProperty('--mouse-y', y + 'px');
            });
        });
    }

})();
