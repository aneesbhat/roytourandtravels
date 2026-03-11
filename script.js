document.addEventListener('DOMContentLoaded', () => {
    /* --- 1. Header Scroll Effect --- */
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* --- 2. Mobile Off-Canvas Menu --- */
    const mobileToggle = document.querySelector('.mobile-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const offCanvas = document.getElementById('offCanvas');
    const navLinks = document.querySelectorAll('.mobile-nav a');

    mobileToggle.addEventListener('click', () => {
        offCanvas.classList.add('active');
    });

    closeMenu.addEventListener('click', () => {
        offCanvas.classList.remove('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            offCanvas.classList.remove('active');
        });
    });

    /* --- 3. Hero Carousel --- */
    const slides = document.querySelectorAll('.hero-carousel .slide');
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));
        
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        currentSlide = index;
    };

    const nextSlide = () => {
        let next = (currentSlide + 1) % slides.length;
        showSlide(next);
    };

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            clearInterval(slideInterval);
            showSlide(index);
            slideInterval = setInterval(nextSlide, 5000);
        });
    });

    slideInterval = setInterval(nextSlide, 5000);

    /* --- 4. Package Inclusions Toggle --- */
    const inclusionToggles = document.querySelectorAll('.inclusions-toggle');
    inclusionToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            const list = e.target.closest('.pkg-inclusions').querySelector('.inclusions-list');
            const icon = e.target.querySelector('i');
            
            if (list.style.display === 'block') {
                list.style.display = 'none';
                icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
            } else {
                list.style.display = 'block';
                icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
            }
        });
    });

    /* --- 5. Stats Counter Animation --- */
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    const runCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // ms
            const step = target / (duration / 16); // 60fps
            
            let current = 0;
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    };

    // Use IntersectionObserver to trigger counter when in view
    const statsSection = document.querySelector('.stats-banner');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasCounted) {
                runCounters();
                hasCounted = true;
            }
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    }

    /* --- 6. Form Logic: Tickets Booked & AJAX Submit --- */
    const ticketRadios = document.querySelectorAll('input[name="ticketsBooked"]');
    const travelDateInput = document.getElementById('travelDate');
    const dateAsterisk = document.getElementById('dateAsterisk');
    const dateHint = document.getElementById('dateHint');

    ticketRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'yes') {
                travelDateInput.disabled = false;
                travelDateInput.required = true;
                dateAsterisk.style.display = 'inline';
                dateHint.style.display = 'none';
            } else {
                travelDateInput.disabled = true;
                travelDateInput.required = false;
                travelDateInput.value = ''; // clear value
                dateAsterisk.style.display = 'none';
                dateHint.style.display = 'block';
            }
        });
    });

    const bookingForm = document.getElementById('bookingForm');
    const formSuccess = document.getElementById('formSuccess');
    const resetFormBtn = document.getElementById('resetFormBtn');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Honeypot check
            const honeypot = document.getElementById('honeypot').value;
            if (honeypot) {
                console.log('Spam detected');
                return; // Silently reject
            }

            // Simulate AJAX request
            const submitBtn = bookingForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Success
                bookingForm.style.display = 'none';
                formSuccess.style.display = 'flex';
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                bookingForm.reset();
            }, 1500);
        });
    }

    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', () => {
            formSuccess.style.display = 'none';
            bookingForm.style.display = 'block';
        });
    }

    /* --- 7. GSAP Animations & Tilt Effects --- */
    // Ensure GSAP is loaded
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Vanilla JS Tilt Effect for .tilt-card
        const tiltCards = document.querySelectorAll('.tilt-card');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -10; // max 10 deg
                const rotateY = ((x - centerX) / centerX) * 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                card.style.transition = 'none';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                card.style.transition = 'transform 0.5s ease';
            });
        });

        // Hero Content Fade In
        gsap.from('.hero-content > *', {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
            delay: 0.5
        });

        // Section Headers Fade In
        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: "top 80%",
                },
                y: 30,
                opacity: 0,
                duration: 0.8
            });
        });

        // Destinations and Packages Stagger animations removed to prevent opacity bugs

        // Gallery Stagger
        gsap.from('.gallery-item', {
            scrollTrigger: {
                trigger: '.gallery-grid',
                start: "top 80%",
            },
            scale: 0.8,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1
        });
        // Refresh ScrollTrigger after all images load to fix "empty" sections
        window.addEventListener('load', () => {
            ScrollTrigger.refresh();
        });
    }

    /* --- 8. Booking Modal Logic --- */
    const bookingModal = document.getElementById('bookingModal');
    const triggerButtons = document.querySelectorAll('.trigger-booking');
    const closeModal = document.getElementById('closeModal');
    const closeSuccessBtn = document.getElementById('closeSuccessBtn');
    const modalBookingForm = document.getElementById('modalBookingForm');
    const modalSuccess = document.getElementById('modalSuccess');
    const selectedPackageDisplay = document.getElementById('selectedPackageDisplay');
    const packageNameText = document.getElementById('packageNameText');

    const closeModalFunc = () => {
        if (!bookingModal) return;
        bookingModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            if (modalBookingForm) { modalBookingForm.style.display = ''; modalBookingForm.reset(); }
            if (modalSuccess)    { modalSuccess.style.display = 'none'; }
        }, 400);
    };

    if (bookingModal && triggerButtons.length > 0) {
        // Open modal on Book Now click
        triggerButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const pkgName = btn.getAttribute('data-package');
                if (pkgName && packageNameText && selectedPackageDisplay) {
                    packageNameText.innerText = pkgName;
                    selectedPackageDisplay.style.display = 'inline-flex';
                } else if (selectedPackageDisplay) {
                    selectedPackageDisplay.style.display = 'none';
                }
                bookingModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        // Close handlers
        if (closeModal)      closeModal.addEventListener('click', closeModalFunc);
        if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeModalFunc);
        bookingModal.addEventListener('click', e => { if (e.target === bookingModal) closeModalFunc(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModalFunc(); });

        // Ticket radio → travel date toggle
        const modalTicketRadios = document.querySelectorAll('input[name="modalTickets"]');
        const modalTravelDateInput = document.getElementById('modalTravelDate');
        const modalDateAsterisk   = document.getElementById('modalDateAsterisk');
        const modalDateHint       = document.getElementById('modalDateHint');

        if (modalTravelDateInput) {
            modalTicketRadios.forEach(radio => {
                radio.addEventListener('change', e => {
                    if (e.target.value === 'yes') {
                        modalTravelDateInput.disabled = false;
                        modalTravelDateInput.required = true;
                        if (modalDateAsterisk) modalDateAsterisk.style.display = 'inline';
                        if (modalDateHint)     modalDateHint.style.display = 'none';
                    } else {
                        modalTravelDateInput.disabled = true;
                        modalTravelDateInput.required = false;
                        modalTravelDateInput.value = '';
                        if (modalDateAsterisk) modalDateAsterisk.style.display = 'none';
                        if (modalDateHint)     modalDateHint.style.display = 'block';
                    }
                });
            });
        }

        // Modal form submission
        if (modalBookingForm) {
            modalBookingForm.addEventListener('submit', e => {
                e.preventDefault();

                // Honeypot check
                const hp = document.getElementById('modalHoneypot');
                if (hp && hp.value) return;

                // Button loading state
                const submitBtn = document.getElementById('modalSubmitBtn');
                const btnText   = submitBtn ? submitBtn.querySelector('.btn-text')   : null;
                const btnLoader = submitBtn ? submitBtn.querySelector('.btn-loader')  : null;

                if (submitBtn)  submitBtn.disabled = true;
                if (btnText)    btnText.style.display   = 'none';
                if (btnLoader)  btnLoader.style.display = 'inline-flex';

                setTimeout(() => {
                    modalBookingForm.style.display = 'none';
                    if (modalSuccess) modalSuccess.style.display = 'block';
                    // Reset button
                    if (submitBtn)  submitBtn.disabled = false;
                    if (btnText)    btnText.style.display   = '';
                    if (btnLoader)  btnLoader.style.display = 'none';
                }, 1500);
            });
        }
    }
});
