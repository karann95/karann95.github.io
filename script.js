document.addEventListener("DOMContentLoaded", () => {
    // Mobile Navigation Toggle
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");
    const navItems = document.querySelectorAll(".nav-links a");

    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        const icon = hamburger.querySelector("i");
        if(navLinks.classList.contains("active")) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-times");
        } else {
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
        }
    });

    const sections = document.querySelectorAll("section");
    
    function showSection(targetId) {
        sections.forEach(sec => {
            if ("#" + sec.getAttribute("id") === targetId) {
                if (sec.classList.contains("hidden-section")) {
                    sec.classList.remove("hidden-section");
                    // Reset fade-up elements so they animate again when entering DOM
                    const fadeElements = sec.querySelectorAll('.fade-up');
                    fadeElements.forEach(el => el.classList.remove('visible'));
                }
            } else {
                sec.classList.add("hidden-section");
            }
        });
        window.scrollTo(0, 0); // Jump to top
    }

    // Initialize SPA routing based on hash or default to #home
    const initialHash = window.location.hash || "#home";
    showSection(initialHash);
    
    // Set initial active nav link
    navItems.forEach(nav => {
        nav.classList.remove("active");
        if(nav.getAttribute("href") === initialHash) {
            nav.classList.add("active");
        }
    });

    // Nav Links Click event
    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            
            navLinks.classList.remove("active");
            const icon = hamburger.querySelector("i");
            if(icon) {
                icon.classList.remove("fa-times");
                icon.classList.add("fa-bars");
            }

            const targetId = item.getAttribute("href");
            showSection(targetId);
            
            navItems.forEach(nav => nav.classList.remove("active"));
            item.classList.add("active");
            
            history.pushState(null, null, targetId);
        });
    });
    
    // Support CTA Routing (e.g. View Projects, Contact Me buttons)
    const ctaLinks = document.querySelectorAll("a[href^='#']:not(.nav-links a)");
    ctaLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("href");
            if(targetId && targetId !== "#") {
                e.preventDefault();
                showSection(targetId);
                
                navItems.forEach(nav => {
                    nav.classList.remove("active");
                    if(nav.getAttribute("href") === targetId) {
                        nav.classList.add("active");
                    }
                });
                history.pushState(null, null, targetId);
            }
        });
    });

    // Navbar Scrolled State
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // Intersection Observer for Scroll Animations
    const fadeElements = document.querySelectorAll('.fade-up');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => scrollObserver.observe(el));

    // EmailJS Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const submitBtn = document.getElementById('submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending... ⏳';
            submitBtn.disabled = true;

            emailjs.sendForm('service_sikrihh', 'template_fmnof0q', this)
                .then(() => {
                    alert('Message sent successfully!');
                    contactForm.reset();
                })
                .catch((error) => {
                    alert('Failed to send message. Please try again later.');
                    console.error('EmailJS Error:', error);
                })
                .finally(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }
});
