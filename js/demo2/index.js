// Importing utility function for preloading images
import { preloadImages } from '../utils.js';

// Variable to store the Lenis smooth scrolling object
let lenis;

// Selecting DOM elements for content and reflection
const contentEl = document.querySelector('.content');
const contentItems = [...contentEl.querySelectorAll('.item')];
const reflectionEl = document.querySelector('.content--reflection');
const reflectionItems = [...reflectionEl.querySelectorAll('.item')];

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
    // Loop through each content item and set up animations
    contentItems.forEach((item, pos) => {
        
        // Selecting elements for each content item
        const itemImg = item.querySelector('.item__img');
        const itemImgInner = itemImg.querySelector('.item__img-inner');
        const itemCaption = item.querySelector('.item__caption');

        // Selecting elements for each reflection item
        const reflectionItem = reflectionItems[pos];
        const reflectionItemImg = reflectionItem.querySelector('.item__img');
        const reflectionItemImgInner = reflectionItemImg.querySelector('.item__img-inner');
        const reflectionItemCaption = reflectionItem.querySelector('.item__caption');

        // Set up GSAP timeline for each content-reflection pair
        gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                scrub: true
            }
        })
        // Animation for image and reflection image
        .fromTo([itemImg, reflectionItemImg], {
            filter: 'brightness(120%) blur(0px)',
            transformOrigin: '50% 100%'
        }, {
            ease: 'power3.in',
            filter: 'brightness(50%) blur(25px)',
            skewX: 3,
            borderRadius: 100,
            scaleY: 0,
            scaleX: 1.1,
        }, 0)
        .to([itemImg, reflectionItemImg], {
            ease: 'power4.in',
            skewY: -3
        }, 0)
        // Animation for image inner content
        .fromTo([itemImgInner, reflectionItemImgInner], {
            scale: 1
        }, {
            ease: 'none',
            scale: 2
        }, 0)
        // Animation for caption
        .to([itemCaption, reflectionItemCaption], {
            ease: 'power4.in',
            opacity: 0,
            scale: 0
        }, 0);
    });
};

// Initialization function
const init = () => {
    initSmoothScrolling(); // Initialize Lenis for smooth scrolling
    scroll(); // Apply scroll-triggered animations
};

// Preload images before initializing animations
preloadImages('.item__img-inner').then(() => {
    // Once images are preloaded, remove the 'loading' indicator/class from the body
    document.body.classList.remove('loading');
    init(); // Initialize animations after preloading
});
