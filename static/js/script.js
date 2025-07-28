document.addEventListener("DOMContentLoaded", () => {
  // --- Navbar Scroll Effect ---
  const navbar = document.querySelector(".navbar")
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled")
      } else {
        navbar.classList.remove("scrolled")
      }
    })
  }

  // --- Active Navigation Link Highlighting on Scroll ---
  const sections = document.querySelectorAll("section[id]")
  const navLinks = document.querySelectorAll(".nav-link")

  if (sections.length && navLinks.length) {
    const activateLink = (id) => {
      navLinks.forEach((link) => {
        link.classList.remove("active")
        if (link.getAttribute("href") === `#${id}`) {
          link.classList.add("active")
        }
      })
    }

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activateLink(entry.target.id)
          }
        })
      },
      { rootMargin: "-30% 0px -70% 0px" },
    )

    sections.forEach((section) => sectionObserver.observe(section))
  }

  // --- Smooth Scrolling for all Links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        // Close mobile menu if open
        const navMenu = document.querySelector(".nav-menu")
        const mobileToggle = document.querySelector(".mobile-menu-toggle")
        if (navMenu && navMenu.classList.contains("active")) {
          navMenu.classList.remove("active")
          mobileToggle.classList.remove("active")
        }

        // Smooth scroll with offset for fixed navbar
        const navbarHeight = navbar ? navbar.offsetHeight : 0
        const targetPosition = targetElement.offsetTop - navbarHeight - 20

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })

  // --- Fade-in Animations on Scroll ---
  const animationObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1 },
  )

  // Add fade-in animation to elements
  document
    .querySelectorAll(
      ".service-card, .project-card, .team-member, .review-card, .about-text, .about-stats, .contact-form, .contact-info, .footer-column",
    )
    .forEach((el) => {
      el.classList.add("fade-in")
      animationObserver.observe(el)
    })

  // --- Mobile Menu Toggle ---
  const mobileToggle = document.querySelector(".mobile-menu-toggle")
  const navMenu = document.querySelector(".nav-menu")

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active")
      mobileToggle.classList.toggle("active")

      // Prevent body scroll when menu is open
      if (navMenu.classList.contains("active")) {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = ""
      }
    })

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove("active")
        mobileToggle.classList.remove("active")
        document.body.style.overflow = ""
      }
    })

    // Close menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active")
        mobileToggle.classList.remove("active")
        document.body.style.overflow = ""
      }
    })
  }

  // --- Popup Modal Functionality ---
  const popup = document.getElementById("connectPopup")
  const popupClose = document.querySelector(".popup-close")
  const popupButtons = document.querySelectorAll(".popup-btn")

  if (popup) {
    const closePopup = () => {
      popup.style.display = "none"
      document.body.style.overflow = ""
    }

    // Show popup after 15 seconds if not shown before
    if (!sessionStorage.getItem("popupShown")) {
      setTimeout(() => {
        popup.style.display = "block"
        document.body.style.overflow = "hidden"
        sessionStorage.setItem("popupShown", "true")
      }, 15000)
    }

    if (popupClose) {
      popupClose.addEventListener("click", closePopup)
    }

    popupButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.classList.contains("primary")) {
          const contactSection = document.querySelector("#contact")
          if (contactSection) {
            closePopup()
            setTimeout(() => {
              contactSection.scrollIntoView({ behavior: "smooth" })
            }, 300)
          }
        }
        closePopup()
      })
    })

    popup.addEventListener("click", (e) => {
      if (e.target === popup) {
        closePopup()
      }
    })

    // Close popup on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && popup.style.display === "block") {
        closePopup()
      }
    })
  }

  // --- Enhanced Contact Form Submission ---
  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    const submitBtn = contactForm.querySelector(".submit-btn")
    const originalBtnText = submitBtn ? submitBtn.textContent : "Send Message"

    contactForm.addEventListener("submit", async (e) => {
      // e.preventDefault()

      if (submitBtn) {
        submitBtn.textContent = "Sending..."
        submitBtn.disabled = true
      }

      // Simulate form submission delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Show success message
      showNotification("Thank you for your message! We will get back to you soon.", "success")
      contactForm.reset()

      if (submitBtn) {
        submitBtn.textContent = originalBtnText
        submitBtn.disabled = false
      }
    })

    // Form validation
    const inputs = contactForm.querySelectorAll("input, textarea")
    inputs.forEach((input) => {
      input.addEventListener("blur", validateField)
      input.addEventListener("input", clearFieldError)
    })
  }

  // --- Newsletter Form Submission ---
  const newsletterForm = document.querySelector(".newsletter-form")
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const emailInput = newsletterForm.querySelector('input[type="email"]')
      const submitBtn = newsletterForm.querySelector(".newsletter-btn")

      if (emailInput && submitBtn) {
        const originalBtnHTML = submitBtn.innerHTML
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'
        submitBtn.disabled = true

        // Simulate subscription
        await new Promise((resolve) => setTimeout(resolve, 1500))

        showNotification("Successfully subscribed to our newsletter!", "success")
        emailInput.value = ""

        submitBtn.innerHTML = originalBtnHTML
        submitBtn.disabled = false
      }
    })
  }

  // --- Stats Counter Animation ---
  const statsSection = document.querySelector(".about-stats")
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll(".stat h3")
            counters.forEach((counter) => {
              const targetText = counter.innerText
              const target = Number.parseInt(targetText.replace(/[^0-9]/g, ""))
              const suffix = targetText.replace(/[0-9]/g, "")

              counter.innerText = "0" + suffix
              let current = 0
              const increment = target / 100
              const duration = 2000 // 2 seconds
              const stepTime = duration / 100

              const updateCounter = () => {
                if (current < target) {
                  current += increment
                  counter.innerText = Math.ceil(current) + suffix
                  setTimeout(updateCounter, stepTime)
                } else {
                  counter.innerText = target + suffix
                }
              }
              updateCounter()
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.8 },
    )

    statsObserver.observe(statsSection)
  }

  // --- CTA Buttons Scroll ---
  const ctaButtons = [".cta-button-secondary", ".cta-button", ".contact-btn"]
  ctaButtons.forEach((selector) => {
    const buttons = document.querySelectorAll(selector)
    buttons.forEach((btn) => {
      if (btn && !btn.closest(".nav-menu")) {
        // Exclude nav contact button
        btn.addEventListener("click", (e) => {
          e.preventDefault()
          const contactSection = document.querySelector("#contact")
          if (contactSection) {
            contactSection.scrollIntoView({ behavior: "smooth" })
          }
        })
      }
    })
  })

  // --- Project Details Modal ---
  const projectCards = document.querySelectorAll(".project-card")
  const modal = document.getElementById("projectModal")

  if (modal) {
    const closeModalBtn = document.querySelector(".close-project-modal")
    const modalDescription = document.getElementById("modalProjectDescription")
    const modalScreenshotsContainer = document.getElementById("modalScreenshotsGrid")

    const openModal = (description, images) => {
      modalDescription.innerHTML = description
      modalScreenshotsContainer.innerHTML = ""

      if (images) {
        const imageArray = images.split(",").map((img) => img.trim())
        imageArray.forEach((src) => {
          const img = document.createElement("img")
          img.src = src
          img.alt = "Project Screenshot"
          img.loading = "lazy"
          modalScreenshotsContainer.appendChild(img)
        })
      }

      modal.style.display = "block"
      document.body.style.overflow = "hidden"
    }

    const closeModal = () => {
      modal.style.display = "none"
      document.body.style.overflow = ""
    }

    projectCards.forEach((card) => {
      card.addEventListener("click", () => {
        const description = card.dataset.description
        const images = card.dataset.images
        openModal(description, images)
      })

      // Add keyboard support
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          const description = card.dataset.description
          const images = card.dataset.images
          openModal(description, images)
        }
      })
    })

    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", closeModal)
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal()
      }
    })

    // Close modal on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.style.display === "block") {
        closeModal()
      }
    })

    // --- Image Modal Logic ---
    const imageModal = document.getElementById("imageModal")
    if (imageModal) {
      const fullSizeImage = document.getElementById("fullSizeImage")
      const closeImageModalBtn = document.querySelector(".close-image-modal")

      const openImageModal = (imgSrc) => {
        if (fullSizeImage) {
          fullSizeImage.src = imgSrc
          fullSizeImage.alt = "Full size project screenshot"
        }
        imageModal.style.display = "block"
      }

      const closeImageModal = () => {
        imageModal.style.display = "none"
      }

      if (modalScreenshotsContainer) {
        modalScreenshotsContainer.addEventListener("click", (event) => {
          if (event.target.tagName === "IMG") {
            openImageModal(event.target.src)
          }
        })
      }

      if (closeImageModalBtn) {
        closeImageModalBtn.addEventListener("click", closeImageModal)
      }

      imageModal.addEventListener("click", (e) => {
        if (e.target === imageModal) {
          closeImageModal()
        }
      })

      // Close image modal on escape key
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && imageModal.style.display === "block") {
          closeImageModal()
        }
      })
    }
  }

  // --- Team Section Slider ---
  const teamSlider = document.querySelector(".team-slider-wrapper")
  if (teamSlider) {
    const track = teamSlider.querySelector(".team-slider-track")
    const prevButton = teamSlider.querySelector(".team-prev-arrow")
    const nextButton = teamSlider.querySelector(".team-next-arrow")

    if (track && prevButton && nextButton) {
      const slides = Array.from(track.children)
      if (slides.length > 0) {
        let currentIndex = 0
        let isAnimating = false

        const getSlidesInView = () => {
          if (window.innerWidth <= 768) return 1
          if (window.innerWidth <= 992) return 2
          return 3
        }

        const updateSliderPosition = () => {
          if (isAnimating) return
          isAnimating = true

          const slideWidth = slides[0].getBoundingClientRect().width
          const gap = Number.parseFloat(window.getComputedStyle(track).gap) || 32
          const amountToMove = currentIndex * (slideWidth + gap)

          track.style.transform = `translateX(-${amountToMove}px)`

          setTimeout(() => {
            isAnimating = false
          }, 500)
        }

        const updateButtonStates = () => {
          const slidesInView = getSlidesInView()
          prevButton.disabled = currentIndex === 0
          nextButton.disabled = currentIndex >= slides.length - slidesInView

          prevButton.style.opacity = prevButton.disabled ? "0.5" : "1"
          nextButton.style.opacity = nextButton.disabled ? "0.5" : "1"
        }

        nextButton.addEventListener("click", () => {
          if (isAnimating) return
          const slidesInView = getSlidesInView()
          if (currentIndex < slides.length - slidesInView) {
            currentIndex++
            updateSliderPosition()
            updateButtonStates()
          }
        })

        prevButton.addEventListener("click", () => {
          if (isAnimating) return
          if (currentIndex > 0) {
            currentIndex--
            updateSliderPosition()
            updateButtonStates()
          }
        })

        // Auto-play slider
        let autoPlayInterval
        const startAutoPlay = () => {
          autoPlayInterval = setInterval(() => {
            const slidesInView = getSlidesInView()
            if (currentIndex >= slides.length - slidesInView) {
              currentIndex = 0
            } else {
              currentIndex++
            }
            updateSliderPosition()
            updateButtonStates()
          }, 5000)
        }

        const stopAutoPlay = () => {
          clearInterval(autoPlayInterval)
        }

        // Pause auto-play on hover
        teamSlider.addEventListener("mouseenter", stopAutoPlay)
        teamSlider.addEventListener("mouseleave", startAutoPlay)

        // Initialize slider
        const initSlider = () => {
          updateSliderPosition()
          updateButtonStates()
          startAutoPlay()
        }

        window.addEventListener("load", initSlider)
        window.addEventListener("resize", () => {
          currentIndex = 0
          initSlider()
        })

        // Touch/swipe support for mobile
        let startX = 0
        let currentX = 0
        let isDragging = false

        track.addEventListener("touchstart", (e) => {
          startX = e.touches[0].clientX
          isDragging = true
          stopAutoPlay()
        })

        track.addEventListener("touchmove", (e) => {
          if (!isDragging) return
          currentX = e.touches[0].clientX
        })

        track.addEventListener("touchend", () => {
          if (!isDragging) return
          isDragging = false

          const diffX = startX - currentX
          const threshold = 50

          if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
              // Swipe left - next slide
              nextButton.click()
            } else {
              // Swipe right - previous slide
              prevButton.click()
            }
          }

          startAutoPlay()
        })
      }
    }
  }

  // --- Back to Top Button ---
  const backToTopBtn = document.querySelector(".back-to-top-btn")
  if (backToTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.style.opacity = "1"
        backToTopBtn.style.visibility = "visible"
      } else {
        backToTopBtn.style.opacity = "0"
        backToTopBtn.style.visibility = "hidden"
      }
    })

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }

  // --- Utility Functions ---

  // Form validation function
  function validateField(e) {
    const field = e.target
    const value = field.value.trim()

    // Remove existing error
    clearFieldError(e)

    if (!value) {
      showFieldError(field, "This field is required")
      return false
    }

    if (field.type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        showFieldError(field, "Please enter a valid email address")
        return false
      }
    }

    return true
  }

  function showFieldError(field, message) {
    field.classList.add("error")

    let errorElement = field.parentNode.querySelector(".field-error")
    if (!errorElement) {
      errorElement = document.createElement("span")
      errorElement.className = "field-error"
      field.parentNode.appendChild(errorElement)
    }
    errorElement.textContent = message
  }

  function clearFieldError(e) {
    const field = e.target
    field.classList.remove("error")

    const errorElement = field.parentNode.querySelector(".field-error")
    if (errorElement) {
      errorElement.remove()
    }
  }

  // Notification system
  function showNotification(message, type = "info") {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll(".notification")
    existingNotifications.forEach((notification) => notification.remove())

    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : "info-circle"}"></i>
                <span>${message}</span>
                <button class="notification-close" aria-label="Close notification">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `

    document.body.appendChild(notification)

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove()
      }
    }, 5000)

    // Close button functionality
    const closeBtn = notification.querySelector(".notification-close")
    closeBtn.addEventListener("click", () => {
      notification.remove()
    })

    // Animate in
    setTimeout(() => {
      notification.classList.add("show")
    }, 100)
  }

  // --- Performance Optimizations ---

  // Lazy load images
  const lazyImages = document.querySelectorAll("img[data-src]")
  if (lazyImages.length > 0) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.classList.remove("lazy")
          observer.unobserve(img)
        }
      })
    })

    lazyImages.forEach((img) => imageObserver.observe(img))
  }

  // Debounce scroll events
  function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  // Apply debouncing to scroll events
  const debouncedScrollHandler = debounce(() => {
    // Any additional scroll handling can go here
  }, 10)

  window.addEventListener("scroll", debouncedScrollHandler)

  // --- Accessibility Improvements ---

  // Skip to main content link
  const skipLink = document.createElement("a")
  skipLink.href = "#main"
  skipLink.textContent = "Skip to main content"
  skipLink.className = "skip-link"
  document.body.insertBefore(skipLink, document.body.firstChild)

  // Focus management for modals
  const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

  function trapFocus(element) {
    const focusableContent = element.querySelectorAll(focusableElements)
    const firstFocusableElement = focusableContent[0]
    const lastFocusableElement = focusableContent[focusableContent.length - 1]

    element.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus()
            e.preventDefault()
          }
        }
      }
    })

    firstFocusableElement.focus()
  }

  // Apply focus trapping to modals when they open
  const modals = document.querySelectorAll(".modal, .popup-modal, .project-modal, .image-modal")
  modals.forEach((modal) => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "style") {
          if (modal.style.display === "block") {
            trapFocus(modal)
          }
        }
      })
    })
    observer.observe(modal, { attributes: true })
  })

  console.log("🚀 Apitide website initialized successfully!")
})



// Inject additional styles
const styleSheet = document.createElement("style")
styleSheet.textContent = additionalStyles
document.head.appendChild(styleSheet)
