document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('#primary-navigation');

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 20);
    });

    if (menuToggle && navbar) {
        const closeMenu = () => {
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Abrir menu');
            navbar.classList.remove('is-open');
        };

        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', String(!isExpanded));
            menuToggle.setAttribute('aria-label', isExpanded ? 'Abrir menu' : 'Fechar menu');
            navbar.classList.toggle('is-open', !isExpanded);
        });

        navbar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
                closeMenu();
                menuToggle.focus();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 800) {
                closeMenu();
            }
        });
    }

    const carousel = document.querySelector('.avaliacoes-carrossel');

    if (carousel) {
        const track = carousel.querySelector('.avaliacoes-trilho');
        const slides = Array.from(track.children);
        const pagination = carousel.querySelector('.avaliacoes-paginacao');
        const previousButton = carousel.querySelector('[data-avaliacao-anterior]');
        const nextButton = carousel.querySelector('[data-avaliacao-proxima]');
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let currentSlide = 0;
        let autoplay;

        const getVisibleSlides = () => {
            if (window.innerWidth <= 480) {
                return 1;
            }
            return window.innerWidth <= 800 ? 2 : 3;
        };

        const showSlide = index => {
            const visibleSlides = getVisibleSlides();
            const lastStart = Math.max(0, slides.length - visibleSlides);
            currentSlide = index > lastStart ? 0 : index < 0 ? lastStart : index;
            const slideGap = parseFloat(window.getComputedStyle(track).columnGap) || 0;
            const slideWidth = slides[0].getBoundingClientRect().width;
            track.style.transform = `translateX(-${currentSlide * (slideWidth + slideGap)}px)`;
            slides.forEach((slide, slideIndex) => {
                const isVisible = slideIndex >= currentSlide && slideIndex < currentSlide + visibleSlides;
                slide.setAttribute('aria-hidden', String(!isVisible));
            });
            const lastVisible = Math.min(currentSlide + visibleSlides, slides.length);
            pagination.textContent = `${currentSlide + 1}–${lastVisible} / ${slides.length}`;
        };

        const stopAutoplay = () => {
            window.clearInterval(autoplay);
        };

        const startAutoplay = () => {
            stopAutoplay();
            if (!reducedMotion.matches) {
                autoplay = window.setInterval(() => showSlide(currentSlide + 1), 5000);
            }
        };

        previousButton.addEventListener('click', () => {
            showSlide(currentSlide - 1);
            startAutoplay();
        });

        nextButton.addEventListener('click', () => {
            showSlide(currentSlide + 1);
            startAutoplay();
        });

        window.addEventListener('resize', () => showSlide(currentSlide));
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
        carousel.addEventListener('focusin', stopAutoplay);
        carousel.addEventListener('focusout', event => {
            if (!carousel.contains(event.relatedTarget)) {
                startAutoplay();
            }
        });
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoplay();
            } else {
                startAutoplay();
            }
        });
        reducedMotion.addEventListener('change', startAutoplay);

        showSlide(0);
        startAutoplay();
    }
});