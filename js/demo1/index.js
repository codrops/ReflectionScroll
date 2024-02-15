// Importing utility function for preloading images
import { preloadImages } from '../utils.js';

// Variable to store the Lenis smooth scrolling object
let lenis;

// Selecting DOM elements
const contentEl = document.querySelector('.content');
const reflectionEl = document.querySelector('.content--reflection');
const contentItems = [...contentEl.querySelectorAll('.item__inner')];
const reflectionItems = [...reflectionEl.querySelectorAll('.item__inner')];

// Initializes Lenis for smooth scrolling with specific properties
const initSmoothScrolling = () => {
    // Instantiate the Lenis object with specified properties
    lenis = new Lenis({
        lerp: 0.2, // Lower values create a smoother scroll effect
        smoothWheel: true // Enables smooth scrolling for mouse wheel events
    });

    // Update ScrollTrigger each time the user scrolls
    lenis.on('scroll', () => ScrollTrigger.update);

    // Define a function to run at each animation frame
    const scrollFn = (time) => {
        lenis.raf(time); // Run Lenis' requestAnimationFrame method
        requestAnimationFrame(scrollFn); // Recursively call scrollFn on each frame

        // Update translateY property of .content--reflection based on scroll amount
        reflectionEl.style.transform = `translateY(${-lenis.actualScroll}px)`;
    };
    // Start the animation frame loop
    requestAnimationFrame(scrollFn);
};

// Function to handle scroll-triggered animations
const scroll = () => {
    contentItems.forEach((item, pos) => {
        const reflectionItem = reflectionItems[pos];
        
        gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        })
        .fromTo([item, reflectionItem], {
            transformOrigin: '50% 120%',
            filter: 'contrast(120%) brightness(100%)'
        }, {
            ease: 'power1.in',
            rotationX: 70,
            z: -300,
            scaleY: 0.8,
            filter: 'contrast(65%) brightness(30%)'
        }, 0)
        .fromTo([item.querySelector('.item__img-inner'), reflectionItem.querySelector('.item__img-inner')], {
            scale: 1
        }, {
            ease: 'sine.inOut',
            scale: 1.3
        }, 0);
    });
};

// Initialization function
const init = () => {
    initSmoothScrolling(); // Initialize Lenis for smooth scrolling
    scroll(); // Apply scroll-triggered animations
};

preloadImages('.item__img-inner').then(() => {
    // Once images are preloaded, remove the 'loading' indicator/class from the body
    document.body.classList.remove('loading');
    init();
});