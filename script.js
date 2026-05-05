document.addEventListener('DOMContentLoaded', () => {

    // ===== MOBILE MENU =====
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });

    // ===== SCROLL REVEAL ANIMATIONS =====
    const revealElements = document.querySelectorAll('.section, .skill-card, .about-content, .contact-content');

    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < triggerBottom) {
                element.classList.add('revealed');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Set initial state
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Check on load and scroll
    window.addEventListener('scroll', revealOnScroll);
    setTimeout(revealOnScroll, 100); // Initial check

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== TYPED EFFECT FOR HERO (Optional Enhancement) =====
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const text = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        heroSubtitle.style.opacity = '1';

        let i = 0;
        const typeEffect = () => {
            if (i < text.length) {
                heroSubtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeEffect, 50);
            }
        };

        // Start typing after initial animations
        setTimeout(typeEffect, 800);
    }

    // ===== PARALLAX EFFECT FOR ORBS =====
    const orbs = document.querySelectorAll('.gradient-orb');

    if (orbs.length > 0) {
        window.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;

            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 20;
                const x = mouseX * speed;
                const y = mouseY * speed;
                orb.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    // ===== CARDS STAGGER ANIMATION =====
    const cards = document.querySelectorAll('.skill-card, .project-card');

    const animateCards = (entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    };

    if ('IntersectionObserver' in window) {
        const cardObserver = new IntersectionObserver(animateCards, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        cards.forEach(card => {
            cardObserver.observe(card);
        });
    }

    // ===== ACTIVE NAV LINK ON SCROLL =====
    const sections = document.querySelectorAll('section[id]');

    const highlightNavLink = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                    navLink.style.color = 'var(--accent)';
                } else {
                    navLink.classList.remove('active');
                    navLink.style.color = '';
                }
            }
        });
    };

    window.addEventListener('scroll', highlightNavLink);

    // ===== EMAIL OBFUSCATION PROTECTION =====
    // Protects email from bots and scrapers
    const initEmailProtection = () => {
        // Function to decode email from data attributes
        const revealEmail = (element) => {
            const user = element.getAttribute('data-user');
            const domain = element.getAttribute('data-domain');

            if (user && domain) {
                // Build email dynamically
                const email = user + '@' + domain;
                element.href = 'mailto:' + email;

                // Optional: show email in tooltip
                element.setAttribute('title', 'Send email to ' + email);
            }
        };

        // Find all email links
        const emailLinks = document.querySelectorAll('.email-link, .email-link-footer');

        emailLinks.forEach(link => {
            // Reveal email only on click or hover
            // This makes it harder for bots to access the email

            // Option 1: On hover (better UX)
            link.addEventListener('mouseenter', function() {
                if (!this.hasAttribute('data-email-revealed')) {
                    revealEmail(this);
                    this.setAttribute('data-email-revealed', 'true');
                }
            }, { once: false });

            // Option 2: On click (better security)
            link.addEventListener('click', function(e) {
                if (!this.hasAttribute('data-email-revealed')) {
                    e.preventDefault();
                    revealEmail(this);
                    this.setAttribute('data-email-revealed', 'true');

                    // Let user know they can click again
                    this.style.opacity = '0.7';
                    setTimeout(() => {
                        this.style.opacity = '1';
                        // Simulate click again
                        this.click();
                    }, 100);
                }
            });

            // Option 3: For bots that analyze JavaScript
            // Add artificial delay on first load
            if (Math.random() > 0.5) { // Randomness makes analysis harder
                setTimeout(() => {
                    // Don't reveal immediately, just prepare
                    link.setAttribute('data-ready', 'true');
                }, 1000 + Math.random() * 2000);
            }
        });
    };

    // Initialize email protection
    initEmailProtection();

    // ===== LOADING ANIMATION =====
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
});

