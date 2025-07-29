import { createMarketShareChart } from './charts.js';

document.addEventListener('DOMContentLoaded', () => {
    const slides = Array.from(document.querySelectorAll('.presentation-slide'));
    let currentSlide = 0;
    if (slides.length === 0) { console.warn('No slides found'); return; }

    let animatedElementsCache = new WeakMap();
    const getAnimatedElements = (slide) => {
        if (!animatedElementsCache.has(slide)) {
            animatedElementsCache.set(slide, slide.querySelectorAll('[data-animate]'));
        }
        return animatedElementsCache.get(slide);
    };

    const setSlideVisible = (slide, visible) => {
        if (!slide) return;
        slide.style.opacity = visible ? '1' : '0';
        slide.style.visibility = visible ? 'visible' : 'hidden';
        slide.style.pointerEvents = visible ? 'auto' : 'none';
        slide.style.zIndex = visible ? '2' : '1';
    };

    const goToSlide = (slideIndex, isInitial = false) => {
        if (slideIndex < 0 || slideIndex >= slides.length || (slideIndex === currentSlide && !isInitial)) return;

        const oldSlide = slides[currentSlide];
        const newSlide = slides[slideIndex];
        
        gsap.killTweensOf('[data-animate]');
        
        const timeline = gsap.timeline({
            onComplete: () => {
                if (oldSlide) getAnimatedElements(oldSlide).forEach(el => el.style.willChange = 'auto');
                if (newSlide) getAnimatedElements(newSlide).forEach(el => el.style.willChange = 'auto');
            }
        });

        if (!isInitial && oldSlide) {
            const oldElements = getAnimatedElements(oldSlide);
            if (oldElements.length > 0) {
                oldElements.forEach(el => el.style.willChange = 'opacity, transform');
                timeline.to(oldElements, { opacity: 0, y: 20, stagger: 0.05, duration: 0.5, ease: 'power3.in' });
            }
        }

        timeline.call(() => {
            if (oldSlide) setSlideVisible(oldSlide, false);
            setSlideVisible(newSlide, true);
            currentSlide = slideIndex;
            updateUIElements();

            if (newSlide && newSlide.id === 'slide-2') {
                createMarketShareChart();
            }
        }, null, isInitial ? 0 : (getAnimatedElements(oldSlide).length > 0 ? '+=0.2' : 0));

        const newElements = getAnimatedElements(newSlide);
        if (newElements.length > 0) {
            newElements.forEach(el => el.style.willChange = 'opacity, transform');
            timeline.fromTo(newElements, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' });
        }
    };

    const nextSlide = () => goToSlide(currentSlide + 1);
    const prevSlide = () => goToSlide(currentSlide - 1);

    function updateUIElements() {
        const dotsContainer = document.getElementById('presentation-dots');
        const prevButton = document.getElementById('presentation-prev-slide');
        const nextButton = document.getElementById('presentation-next-slide');

        if (dotsContainer) {
            dotsContainer.innerHTML = ''; 
            const pageIndicator = document.createElement('div');
            pageIndicator.className = 'flex items-center gap-1 text-white/80 text-sm font-medium';
            pageIndicator.innerHTML = `<span class="min-w-[1.2em] text-center">${currentSlide + 1}</span><span class="text-white/50">/</span><span class="min-w-[1.2em] text-center">${slides.length}</span>`;
            dotsContainer.appendChild(pageIndicator);
        }

        if (prevButton) prevButton.disabled = currentSlide === 0;
        if (nextButton) nextButton.disabled = currentSlide === slides.length - 1;
    }

    function initializeUI() {
        const navContainer = document.getElementById('presentation-navigation');
        const prevButton = document.getElementById('presentation-prev-slide');
        const nextButton = document.getElementById('presentation-next-slide');

        if (slides.length <= 1) {
            if (navContainer) navContainer.style.display = 'none';
            return;
        }
        
        if (prevButton) prevButton.addEventListener('click', prevSlide);
        if (nextButton) nextButton.addEventListener('click', nextSlide);

        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') nextSlide();
            if (e.key === 'ArrowLeft' || e.key === 'PageUp') prevSlide();
        });

        updateUIElements();
    }


    slides.forEach((slide, index) => setSlideVisible(slide, index === 0));
    if (slides.length > 0) {

        const firstSlideElements = getAnimatedElements(slides[0]);
        if (firstSlideElements.length > 0) {
            gsap.fromTo(firstSlideElements, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out', delay: 0.5 });
        }
    }

    lucide.createIcons();
    initializeUI();
});
