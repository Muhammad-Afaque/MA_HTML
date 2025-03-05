class HeroAnimation {
    /**
     * Constructor for the HeroAnimation class
     * @param {HTMLElement} element - The hero animation container element
     */
    constructor(element) {
        // Store DOM elements
        this.heroSection = element;
        this.spotlight = this.heroSection.querySelector('.spotlight');
        this.eyes = this.heroSection.querySelectorAll('.eye');
        this.face = this.heroSection.querySelector('.face');

        // Animation properties
        this.animationFrameId = null;
        this.isAnimating = false;
        this.spotlightSize = 'transparent 5%, rgb(0, 0, 0) 20%';
        this.bounds = 20; // The range for face movement

        // Initialize
        this.init();
    }

    /**
     * Maps a value from one range to another
     * @param {number} inputLower - Input range lower bound
     * @param {number} inputUpper - Input range upper bound
     * @param {number} outputLower - Output range lower bound
     * @param {number} outputUpper - Output range upper bound
     * @returns {Function} - Function that maps a value from input range to output range
     */
    mapRange(inputLower, inputUpper, outputLower, outputUpper) {
        const inputRange = inputUpper - inputLower;
        const outputRange = outputUpper - outputLower;

        return value => outputLower + ((value - inputLower) / inputRange * outputRange || 0);
    }

    /**
     * Initialize event listeners and setup
     */
    init() {
        // Bind methods to keep 'this' context
        this.updateSpotlight = this.updateSpotlight.bind(this);
        this.animateBubbles = this.animateBubbles.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.updateFacePosition = this.updateFacePosition.bind(this);

        // Add event listeners
        window.addEventListener('mousemove', this.updateSpotlight);
        window.addEventListener('mousedown', this.updateSpotlight);
        window.addEventListener('mouseup', this.updateSpotlight);
        document.addEventListener('pointermove', this.updateFacePosition);
        this.heroSection.addEventListener('mouseenter', this.handleMouseEnter);
        this.heroSection.addEventListener('mouseleave', this.handleMouseLeave);

        // Initialize spotlight position
        this.spotlight.style.backgroundImage = 'radial-gradient(circle at 2.93843% 61.8908%, transparent 20%, rgb(0, 0, 0) 37%)';
    }

    /**
     * Update spotlight position based on mouse coordinates
     * @param {MouseEvent} e - Mouse event object
     */
    updateSpotlight(e) {
        const xPos = (e.pageX / window.innerWidth) * 100;
        const yPos = (e.pageY / window.innerHeight) * 100;

        this.spotlight.style.backgroundImage =
            `radial-gradient(circle at ${xPos}% ${yPos}%, transparent 5%, rgb(0, 0, 0) 10%)`;
    }

    /**
     * Update face position based on pointer coordinates
     * @param {PointerEvent} e - Pointer event object
     */
    updateFacePosition(e) {
        const posX = this.mapRange(0, window.innerWidth, -this.bounds, this.bounds)(e.x);
        const posY = this.mapRange(0, window.innerHeight, -this.bounds, this.bounds)(e.y);

        this.face.style.setProperty('--x', posX);
        this.face.style.setProperty('--y', posY);
    }

    /**
     * Animate bubbles with random movements
     */
    animateBubbles() {
        if (!this.isAnimating) return;

        this.eyes.forEach(eye => {
            // Generate random positions within a controlled range
            const randomX = Math.random() * 20 - 10; // Random value between -10 and 10
            const randomY = Math.random() * 20 - 10; // Random value between -10 and 10

            // Apply random transform with transition
            eye.style.transform = `translate(${randomX}px, ${randomY}px)`;
        });

        // Continue animation loop
        this.animationFrameId = setTimeout(this.animateBubbles, 800);
    }

    /**
     * Handle mouse enter event
     */
    handleMouseEnter() {
        this.isAnimating = true;
        this.animateBubbles();
    }

    /**
     * Handle mouse leave event
     */
    handleMouseLeave() {
        this.isAnimating = false;
        clearTimeout(this.animationFrameId);

        // Reset positions
        this.eyes.forEach(eye => {
            eye.style.transform = 'translate(0, 0)';
        });
    }

    /**
     * Clean up event listeners and timers
     * Call when removing the component
     */
    destroy() {
        // Remove event listeners
        window.removeEventListener('mousemove', this.updateSpotlight);
        window.removeEventListener('mousedown', this.updateSpotlight);
        window.removeEventListener('mouseup', this.updateSpotlight);
        document.removeEventListener('pointermove', this.updateFacePosition);
        this.heroSection.removeEventListener('mouseenter', this.handleMouseEnter);
        this.heroSection.removeEventListener('mouseleave', this.handleMouseLeave);

        // Clear any running animations
        clearTimeout(this.animationFrameId);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Initialize GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Create a timeline for better control and sequencing
    const mainTL = gsap.timeline({
        scrollTrigger: {
            trigger: '#custom',
            start: 'top 85%',
            toggleActions: 'play none none reset'
        }
    });

    // Subtle initial setup
    gsap.set('.imgChild img', {
        scale: 0.85,
        opacity: 0
    });

    // Animation for the vector background - slide from right with a slight delay
    mainTL.fromTo('.line', {
        x: '100%',
        opacity: 0
    }, {
        x: 0,
        opacity: 0.85, // Slightly less opacity for subtlety
        duration: 1.4,
        ease: 'power2.out' // Smoother ease
    });

    // Staggered scale animations for the images with a more refined approach
    mainTL.fromTo('.imgChild img', {
        scale: 0.85,
        opacity: 0,
        y: 15 // Small vertical offset for more natural movement
    }, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.65, // Slightly shorter for less flashiness
        ease: 'back.out(1.4)', // Softer back ease
        stagger: 0.5, // Reduced stagger time for less wait
    }, "-=0.6"); // Overlap with previous animation for better flow

    // Text animations with a more subtle approach
    mainTL.from('#custom h2, #custom p, #custom ul, #custom a', {
        y: 30, // Reduced distance
        opacity: 0,
        duration: 0.8,
        stagger: 0.15, // More noticeable stagger but not too long
        ease: 'power1.out' // Smoother, less bouncy ease
    }, "-=1.2"); // Start earlier in the timeline

    // Refined hover animation for the images
    const customImages = document.querySelectorAll('.imgChild img');

    customImages.forEach(img => {
        const hoverTL = gsap.timeline({ paused: true });

        hoverTL.to(img, {
            scale: 1.05, // Subtle scale increase
            duration: 0.4,
            ease: 'power1.out',
            boxShadow: "0 10px 20px rgba(0,0,0,0.05)" // Subtle shadow for depth
        });

        img.addEventListener('mouseenter', () => hoverTL.play());
        img.addEventListener('mouseleave', () => hoverTL.reverse());
    });

    // Optional: Smooth parallax effect for more depth
    gsap.to('.imgChild img', {
        y: -10, // Subtle movement
        stagger: 0.1,
        ease: "none",
        scrollTrigger: {
            trigger: "#custom",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5 // Smooth scrubbing effect tied to scroll
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Animation for the heading elements (sliding from top)
    gsap.from('#shopify h2', {
        y: -100,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#shopify',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });

    // Animation for the paragraph (sliding from top with slight delay)
    gsap.from('#shopify p', {
        y: -80,
        opacity: 0,
        duration: 1.2,
        delay: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#shopify',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });

    // Animation for the CTA button (sliding from top with more delay)
    gsap.from('#shopify a', {
        y: -60,
        opacity: 0,
        duration: 1,
        delay: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#shopify',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });

    // Staggered animation for slider images (domino effect from bottom)
    gsap.from('#shopify .slide_vex img', {
        y: 200,
        opacity: 0,
        duration: 1,
        stagger: 0.15, // This creates the domino effect
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.shopifu_slider',
            start: 'top 90%',
            toggleActions: 'play none none none'
        }
    });

    // Optional: Add a subtle rotation effect to enhance the domino feel
    gsap.from('#shopify .slide_vex', {
        rotationX: 45,
        duration: 1.5,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.shopifu_slider',
            start: 'top 90%',
            toggleActions: 'play none none none'
        }
    });

    // Optional: Add a subtle scale effect to the entire slider container
    gsap.from('#shopify .shopifu_slider', {
        scale: 0.9,
        opacity: 0.8,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.shopifu_slider',
            start: 'top 90%',
            toggleActions: 'play none none none'
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const overlay = document.querySelector('.curve_text_bg .overlay');
    let currentRotation = 0;
    let targetRotation = 0;
    let isAnimating = false;
    let animationInterval;

    // Function to rotate overlay to the next quarter with inertia
    function rotateToNextQuarter() {
        if (isAnimating) return;

        isAnimating = true;

        // Calculate next quarter (90, 180, 270, or 360/0 degrees)
        targetRotation = currentRotation + 90;

        // Set transform for the rotation
        overlay.style.transform = `rotate(${targetRotation}deg)`;

        // Update current rotation after animation completes
        setTimeout(() => {
            currentRotation = targetRotation;
            isAnimating = false;

            // Reset to 0 if we've completed a full rotation
            if (currentRotation >= 360) {
                currentRotation = 0;
                overlay.style.transition = 'none';
                overlay.style.transform = 'rotate(0deg)';
                // Re-enable transition after reset
                setTimeout(() => {
                    overlay.style.transition = 'transform 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000)';
                }, 50);
            }
        }, 800);
    }

    // Auto-rotate the overlay every 3 seconds
    function startAutoRotation() {
        if (animationInterval) {
            clearInterval(animationInterval);
        }
        animationInterval = setInterval(rotateToNextQuarter, 3000);
    }

    // Start auto-rotation
    startAutoRotation();

    // Allow manual rotation by clicking
    overlay.addEventListener('click', function () {
        clearInterval(animationInterval);
        rotateToNextQuarter();

        // Restart auto-rotation after manual interaction
        setTimeout(startAutoRotation, 3000);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Animation for the heading elements (sliding from top)
    gsap.from('#ecom_wp_dev h2', {
        y: -100,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#ecom_wp_dev',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });

    // Animation for the paragraph (sliding from top with slight delay)
    gsap.from('#ecom_wp_dev p', {
        y: -80,
        opacity: 0,
        duration: 1.2,
        delay: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#ecom_wp_dev',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });

    // Animation for the CTA button (sliding from top with more delay)
    gsap.from('#ecom_wp_dev a', {
        y: -60,
        opacity: 0,
        duration: 1,
        delay: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#ecom_wp_dev',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });

    // Staggered animation for slider images (domino effect from bottom)
    gsap.from('#ecom_wp_dev .slide_vex img', {
        y: 200,
        opacity: 0,
        duration: 1,
        stagger: 0.15, // This creates the domino effect
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#ecom_wp_dev .shopifu_slider_4',
            start: 'top 90%',
            toggleActions: 'play none none none'
        }
    });

    // Optional: Add a subtle rotation effect to enhance the domino feel
    gsap.from('#ecom_wp_dev .slide_vex', {
        rotationX: 45,
        duration: 1.5,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '#ecom_wp_dev .shopifu_slider_4',
            start: 'top 90%',
            toggleActions: 'play none none none'
        }
    });

    // Optional: Add a subtle scale effect to the entire slider container
    gsap.from('#ecom_wp_dev .shopifu_slider_4', {
        scale: 0.9,
        opacity: 0.8,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '#ecom_wp_dev .shopifu_slider_4',
            start: 'top 90%',
            toggleActions: 'play none none none'
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Content Management Section Animations
    const contentMngTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '#content_mng',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });

    contentMngTimeline
        .from('#content_mng h2', {
            y: -50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        })
        .from('#content_mng span', {
            color: '#ffffff',
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.4')
        .from('#content_mng p', {
            y: -30,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.6')
        .from('#content_mng a', {
            y: -20,
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            ease: 'back.out(1.7)'
        }, '-=0.5');

    // Add background overlay animation effect
    gsap.fromTo('#content_mng',
        {
            backgroundSize: '120% auto',
            backgroundColor: 'rgba(0, 0, 0, 0.9)'
        },
        {
            backgroundSize: '100% auto',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '#content_mng',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        }
    );

    // Responsiveness Section Animations
    const responsiveTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '#responsivevnes',
            start: 'top 70%',
            toggleActions: 'play none none none'
        }
    });

    responsiveTimeline
        .from('#responsivevnes h2', {
            x: -50,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        })
        .from('#responsivevnes p', {
            x: -40,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.4')
        .from('#responsivevnes a', {
            x: -30,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.4')
        .from('#responsivevnes img', {
            x: 100,
            opacity: 0,
            scale: 0.8,
            rotation: 5,
            duration: 1.2,
            ease: 'back.out(1.4)'
        }, '-=1.2');

    // Optional floating animation for the responsive image
    gsap.to('#responsivevnes img', {
        y: '15px',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.5
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Responsive Design Section Animation
    const respDesignTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '#resp_desi',
            start: 'top 70%',
            toggleActions: 'play none none none'
        }
    });

    // Background effect animation
    gsap.fromTo('#resp_desi',
        {
            backgroundSize: '110% auto',
            backgroundColor: 'rgba(0, 0, 0, 0)'
        },
        {
            backgroundSize: '100% auto',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            duration: 1.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '#resp_desi',
                start: 'top 70%',
                toggleActions: 'play none none none'
            }
        }
    );

    // Circular text animations
    respDesignTimeline
        // First rotate the entire container
        .from('#resp_desi .curve_text_bg', {
            rotation: -180,
            scale: 0.7,
            opacity: 0,
            duration: 1.5,
            ease: 'power3.out'
        })
        // Then animate each circular text with staggered rotation
        .from('#resp_desi .overlay img', {
            rotation: 90,
            scale: 0.8,
            opacity: 0,
            stagger: 0.2,
            duration: 1.2,
            ease: 'back.out(1.7)'
        }, '-=1.2')
        // Counter-rotate the overlay for interesting effect
        .from('#resp_desi .overlay', {
            rotation: 45,
            duration: 1.8,
            ease: 'sine.inOut'
        }, '-=1.5')
        // Continuous rotation animation for subtle movement
        .to('#resp_desi .overlay', {
            rotation: '+=360',
            duration: 30,
            repeat: -1,
            ease: 'none'
        });

    // Text content animations
    const textTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '#resp_desi',
            start: 'top 70%',
            toggleActions: 'play none none none'
        }
    });

    textTimeline
        .from('#resp_desi h2', {
            x: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        }, 0.5)
        .from('#resp_desi span', {
            color: '#33B9C0',
            duration: 0.6,
            ease: 'power1.inOut'
        }, '-=0.3')
        .from('#resp_desi p', {
            x: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            // Animate each line separately
            stagger: {
                amount: 0.3,
                from: "start"
            }
        }, '-=0.5')
        .from('#resp_desi a', {
            y: 20,
            opacity: 0,
            scale: 0.9,
            duration: 0.7,
            ease: 'back.out(1.7)'
        }, '-=0.3');
});

document.addEventListener('DOMContentLoaded', function () {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // WordPress Development Section Animation
    const wpDevTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '#wp_dev',
            start: 'top 75%',
            toggleActions: 'play none none none'
        }
    });

    // Header and content animations with a slight stagger
    wpDevTimeline
        .from('#wp_dev h2', {
            y: -60,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        })
        .from('#wp_dev h2 span', {
            color: '#e0e0e0',
            textShadow: 'none',
            duration: 0.8,
            ease: 'power2.inOut'
        }, '-=0.6')
        .from('#wp_dev p', {
            y: -40,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        }, '-=0.7')
        .from('#wp_dev a', {
            y: -20,
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            ease: 'back.out(1.7)'
        }, '-=0.6');

    
});

document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP plugins
    gsap.registerPlugin(
        ScrollTrigger,
        Flip,
        Observer,
        ScrollToPlugin,
        Draggable,
        MotionPathPlugin,
        EaselPlugin,
        PixiPlugin,
        TextPlugin,
        CustomEase
    );

    // Initialize hero animation if element exists
    const heroAnimationElement = document.querySelector('.hero-animation');
    if (heroAnimationElement) {
        new HeroAnimation(heroAnimationElement);
    }

    // const CustomAnimationVar = document.querySelector('#custom');
    // if (sliderElement) {
    //     new CustomAnimation(CustomAnimationVar);
    // }
    // You can add more class initializations here
    // For example:
    // const sliderElement = document.querySelector('.custom-slider');
    // if (sliderElement) {
    //     new CustomSlider(sliderElement);
    // }
});
