document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // --- Active Navigation Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length && navLinks.length) {
        const activateLink = (id) => {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    activateLink(entry.target.id);
                }
            });
        }, { rootMargin: '-30% 0px -70% 0px' });

        sections.forEach(section => sectionObserver.observe(section));
    }

    // --- Smooth Scrolling for all Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                const navMenu = document.querySelector('.nav-menu');
                const mobileToggle = document.querySelector('.mobile-menu-toggle');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                }
            }
        });
    });

    // --- Fade-in Animations on Scroll ---
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.service-card, .project-card, .team-member, .review-card, .about-text, .about-stats, .contact-form, .contact-info').forEach(el => {
        el.classList.add('fade-in');
        animationObserver.observe(el);
    });

    // --- Mobile Menu Toggle ---
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }
    
    // --- Popup Modal Functionality (Corrected Code) ---
    const popup = document.getElementById('connectPopup');
    const popupClose = document.querySelector('.popup-close');
    const popupButtons = document.querySelectorAll('.popup-btn');

    if (popup) {
        const closePopup = () => {
            popup.style.display = 'none';
        };

        if (!sessionStorage.getItem('popupShown')) {
            setTimeout(() => {
                popup.style.display = 'block';
                sessionStorage.setItem('popupShown', 'true');
            }, 15000);
        }

        if (popupClose) {
            popupClose.addEventListener('click', closePopup);
        }

        popupButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('primary')) {
                    const contactSection = document.querySelector('#contact');
                    if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
                closePopup();
            });
        });

        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                closePopup();
            }
        });
    }

    // --- Contact Form Submission ---
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            // contactForm.reset();
        });
    }
 // --- Stats Counter Animation ---
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counters = entry.target.querySelectorAll('.stat h3');
                    counters.forEach(counter => {
                        const targetText = counter.innerText;
                        const target = parseInt(targetText.replace(/[^0-9]/g, ''));
                        const suffix = targetText.replace(/[0-9]/g, '');
                        counter.innerText = '0' + suffix;

                        let current = 0;
                        const increment = target / 100;

                        const updateCounter = () => {
                            if (current < target) {
                                current += increment;
                                counter.innerText = Math.ceil(current) + suffix;
                                requestAnimationFrame(updateCounter);
                            } else {
                                counter.innerText = target + suffix;
                            }
                        };
                        updateCounter();
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.8 });
        
        statsObserver.observe(statsSection);
    }
    // --- "Start Your Project" Button Functionality ---
    const startProjectBtn = document.querySelector('.cta-button-secondary');
    if (startProjectBtn) {
        startProjectBtn.addEventListener('click', () => {
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    // --- "Get Started Today" Hero Button ---
    const getStartedBtn = document.querySelector('.cta-button');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    // --- New Project Details Modal Logic ---
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('projectModal');

    if (modal) {
        const closeModalBtn = document.querySelector('.close-project-modal');
        const modalDescription = document.getElementById('modalProjectDescription');
        const modalScreenshotsContainer = document.getElementById('modalScreenshotsGrid');

        const openModal = (description, images) => {
            // Set the description text
            modalDescription.innerHTML = description;

            // Clear previous screenshots
            modalScreenshotsContainer.innerHTML = '';

            // Add new screenshots
            const imageArray = images.split(',').map(img => img.trim());
            imageArray.forEach(src => {
                const img = document.createElement('img');
                img.src = src;
                img.alt = "Project Screenshot";
                modalScreenshotsContainer.appendChild(img);
            });

            modal.style.display = 'block';
        };

        const closeModal = () => {
            modal.style.display = 'none';
        };

        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                const description = card.dataset.description;
                const images = card.dataset.images;
                if (description && images) {
                    openModal(description, images);
                }
            });
        });

        closeModalBtn.addEventListener('click', closeModal);

        // Close modal if user clicks outside the modal content area
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        // --- Image Modal Logic ---
const imageModal = document.getElementById('imageModal');
if (imageModal) {
    const fullSizeImage = document.getElementById('fullSizeImage');
    const closeImageModalBtn = document.querySelector('.close-image-modal');

    const openImageModal = (imgSrc) => {
        if (fullSizeImage) fullSizeImage.src = imgSrc;
        imageModal.style.display = 'block';
    };

    const closeImageModal = () => {
        imageModal.style.display = 'none';
    };

    if (modalScreenshotsContainer) {
        modalScreenshotsContainer.addEventListener('click', (event) => {
            if (event.target.tagName === 'IMG') {
                openImageModal(event.target.src);
            }
        });
    }

    if (closeImageModalBtn) closeImageModalBtn.addEventListener('click', closeImageModal);

    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            closeImageModal();
        }
    });
}
    }
    // --- Team Section Slider (Looping Version) ---
    const teamSlider = document.querySelector('.team-slider-wrapper');
    if (teamSlider) {
        const track = teamSlider.querySelector('.team-slider-track');
        const prevButton = teamSlider.querySelector('.team-prev-arrow');
        const nextButton = teamSlider.querySelector('.team-next-arrow');
        
        if (track && prevButton && nextButton) {
            const slides = Array.from(track.children);

            if (slides.length > 0) {
                let currentIndex = 0;

                const getSlidesInView = () => {
                    if (window.innerWidth <= 768) return 1;
                    if (window.innerWidth <= 992) return 2;
                    return 3;
                };

                const setupAndMove = () => {
                    const slideWidth = slides[0].getBoundingClientRect().width;
                    let gap = parseFloat(window.getComputedStyle(track).gap);
                    if (isNaN(gap)) gap = 32; // Fallback
                    
                    const amountToMove = currentIndex * (slideWidth + gap);
                    track.style.transform = `translateX(-${amountToMove}px)`;
                };

                nextButton.addEventListener('click', () => {
                    const slidesInView = getSlidesInView();
                    // Agar aakhri slide par hain, to pehle par aa jao
                    if (currentIndex >= slides.length - slidesInView) {
                        currentIndex = 0;
                    } else {
                        currentIndex++;
                    }
                    setupAndMove();
                });

                prevButton.addEventListener('click', () => {
                    const slidesInView = getSlidesInView();
                    // Agar pehle slide par hain, to aakhri par chale jao
                    if (currentIndex === 0) {
                        currentIndex = slides.length - slidesInView;
                    } else {
                        currentIndex--;
                    }
                    setupAndMove();
                });

                window.addEventListener('load', setupAndMove);
                window.addEventListener('resize', setupAndMove);
            }
        }
    }
});