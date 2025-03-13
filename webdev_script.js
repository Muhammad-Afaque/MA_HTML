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
        this.spotlight.style.backgroundImage = 'radial-gradient(circle at 2.93843% 61.8908%, transparent 20%, rgb(0, 0, 0) 25%)';
    }

    /**
     * Update spotlight position based on mouse coordinates
     * @param {MouseEvent} e - Mouse event object
     */
    updateSpotlight(e) {
        const xPos = (e.pageX / window.innerWidth) * 100;
        const yPos = (e.pageY / window.innerHeight) * 100;

        this.spotlight.style.backgroundImage =
            `radial-gradient(circle at ${xPos}% ${yPos}%, transparent 5%, rgb(0, 0, 0) 25%)`;
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
    // Check if the target section exists
    const customSection = document.querySelector('#custom');

    if (customSection) {
        // Initialize GSAP
        gsap.registerPlugin(ScrollTrigger);

        // Check if the required elements exist
        const hasLine = document.querySelector('.line');
        const hasImages = document.querySelectorAll('.imgChild img').length > 0;
        const hasContent = document.querySelector('#custom h2, #custom p, #custom ul, #custom a');

        // Create a timeline for better control and sequencing
        const mainTL = gsap.timeline({
            scrollTrigger: {
                trigger: '#custom',
                start: 'top 85%',
                toggleActions: 'play none none reset'
            }
        });

        // Subtle initial setup - only if images exist
        if (hasImages) {
            gsap.set('.imgChild img', {
                scale: 0.85,
                opacity: 0
            });
        }

        // Animation for the vector background - only if line exists
        if (hasLine) {
            mainTL.fromTo('.line', {
                x: '100%',
                opacity: 0
            }, {
                x: 0,
                opacity: 0.85, // Slightly less opacity for subtlety
                duration: 1.4,
                ease: 'power2.out' // Smoother ease
            });
        }

        // Staggered scale animations for the images - only if images exist
        if (hasImages) {
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
        }

        // Text animations - only if content exists
        if (hasContent) {
            mainTL.from('#custom h2, #custom p, #custom ul, #custom a', {
                y: 30, // Reduced distance
                opacity: 0,
                duration: 0.8,
                stagger: 0.15, // More noticeable stagger but not too long
                ease: 'power1.out' // Smoother, less bouncy ease
            }, "-=1.2"); // Start earlier in the timeline
        }

        // Refined hover animation for the images - only if images exist
        if (hasImages) {
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
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Check if Shopify section exists
    const shopifySection = document.querySelector('#shopify');

    if (shopifySection) {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Check for specific elements
        const heading = document.querySelector('#shopify h2');
        const paragraph = document.querySelector('#shopify p');
        const ctaButton = document.querySelector('#shopify a');
        const slideImages = document.querySelectorAll('#shopify .slide_vex img');
        const slideVex = document.querySelectorAll('#shopify .slide_vex');
        const sliderContainer = document.querySelector('#shopify .shopifu_slider');

        // Animation for the heading elements (sliding from top)
        if (heading) {
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
        }

        // Animation for the paragraph (sliding from top with slight delay)
        if (paragraph) {
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
        }

        // Animation for the CTA button (sliding from top with more delay)
        if (ctaButton) {
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
        }

        // Staggered animation for slider images (domino effect from bottom)
        if (slideImages.length > 0 && sliderContainer) {
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
        }

        // Optional: Add a subtle rotation effect to enhance the domino feel
        if (slideVex.length > 0 && sliderContainer) {
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
        }

        // Optional: Add a subtle scale effect to the entire slider container
        if (sliderContainer) {
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
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Check if the target element exists
    const overlay = document.querySelector('#resp_desi .curve_text_bg .overlay');

    // Only proceed if the overlay element exists
    if (overlay) {
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
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // First check if the responsive design section exists
    const respDesiSection = document.querySelector('#resp_desi');

    if (respDesiSection) {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Check for specific elements
        const curveTextBg = document.querySelector('#resp_desi .curve_text_bg');
        const overlayImages = document.querySelectorAll('#resp_desi .overlay img');
        const overlay = document.querySelector('#resp_desi .overlay');
        const heading = document.querySelector('#resp_desi h2');
        const span = document.querySelector('#resp_desi span');
        const paragraphs = document.querySelectorAll('#resp_desi p');
        const ctaLink = document.querySelector('#resp_desi a');

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

        // Circular text animations - only if required elements exist
        if (curveTextBg) {
            // First rotate the entire container
            respDesignTimeline.from('#resp_desi .curve_text_bg', {
                rotation: -180,
                scale: 0.7,
                opacity: 0,
                duration: 1.5,
                ease: 'power3.out'
            });
        }

        if (overlayImages.length > 0) {
            // Then animate each circular text with staggered rotation
            respDesignTimeline.from('#resp_desi .overlay img', {
                rotation: 90,
                scale: 0.8,
                opacity: 0,
                stagger: 0.2,
                duration: 1.2,
                ease: 'back.out(1.7)'
            }, '-=1.2');
        }

        if (overlay) {
            // Counter-rotate the overlay for interesting effect
            respDesignTimeline.from('#resp_desi .overlay', {
                rotation: 45,
                duration: 1.8,
                ease: 'sine.inOut'
            }, '-=1.5');

            // Continuous rotation animation for subtle movement
            respDesignTimeline.to('#resp_desi .overlay', {
                rotation: '+=360',
                duration: 30,
                repeat: -1,
                ease: 'none'
            });
        }

        // Only create text timeline if any text elements exist
        if (heading || span || paragraphs.length > 0 || ctaLink) {
            // Text content animations
            const textTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: '#resp_desi',
                    start: 'top 70%',
                    toggleActions: 'play none none none'
                }
            });

            if (heading) {
                textTimeline.from('#resp_desi h2', {
                    x: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.out'
                }, 0.5);
            }

            if (span) {
                textTimeline.from('#resp_desi span', {
                    color: '#33B9C0',
                    duration: 0.6,
                    ease: 'power1.inOut'
                }, heading ? '-=0.3' : 0.5);
            }

            if (paragraphs.length > 0) {
                textTimeline.from('#resp_desi p', {
                    x: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    // Animate each line separately
                    stagger: {
                        amount: 0.3,
                        from: "start"
                    }
                }, (heading || span) ? '-=0.5' : 0.5);
            }

            if (ctaLink) {
                textTimeline.from('#resp_desi a', {
                    y: 20,
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.7,
                    ease: 'back.out(1.7)'
                }, (heading || span || paragraphs.length > 0) ? '-=0.3' : 0.5);
            }
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Check if the main section exists
    const ecomSection = document.querySelector('#ecom_wp_dev');

    if (ecomSection) {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Check for specific elements
        const heading = document.querySelector('#ecom_wp_dev h2');
        const paragraph = document.querySelector('#ecom_wp_dev p');
        const ctaButton = document.querySelector('#ecom_wp_dev a');
        const sliderContainer = document.querySelector('#ecom_wp_dev .shopifu_slider_4');
        const slideImages = document.querySelectorAll('#ecom_wp_dev .slide_vex img');
        const slideVex = document.querySelectorAll('#ecom_wp_dev .slide_vex');

        // Animation for the heading elements (sliding from top)
        if (heading) {
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
        }

        // Animation for the paragraph (sliding from top with slight delay)
        if (paragraph) {
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
        }

        // Animation for the CTA button (sliding from top with more delay)
        if (ctaButton) {
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
        }

        // Only proceed with slider animations if the slider container exists
        if (sliderContainer) {
            // Staggered animation for slider images (domino effect from bottom)
            if (slideImages.length > 0) {
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
            }

            // Optional: Add a subtle rotation effect to enhance the domino feel
            if (slideVex.length > 0) {
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
            }

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
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Content Management Section checks
    const contentMngSection = document.querySelector('#content_mng');

    if (contentMngSection) {
        // Check for specific elements
        const heading = document.querySelector('#content_mng h2');
        const span = document.querySelector('#content_mng span');
        const paragraph = document.querySelector('#content_mng p');
        const ctaButton = document.querySelector('#content_mng a');

        // Only create timeline if at least one element exists
        if (heading || span || paragraph || ctaButton) {
            const contentMngTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: '#content_mng',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });

            if (heading) {
                contentMngTimeline.from('#content_mng h2', {
                    y: -50,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out'
                });
            }

            if (span) {
                contentMngTimeline.from('#content_mng span', {
                    color: '#ffffff',
                    duration: 0.8,
                    ease: 'power2.out'
                }, heading ? '-=0.4' : 0);
            }

            if (paragraph) {
                contentMngTimeline.from('#content_mng p', {
                    y: -30,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out'
                }, (heading || span) ? '-=0.6' : 0);
            }

            if (ctaButton) {
                contentMngTimeline.from('#content_mng a', {
                    y: -20,
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.8,
                    ease: 'back.out(1.7)'
                }, (heading || span || paragraph) ? '-=0.5' : 0);
            }
        }

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
    }

    // Responsiveness Section checks
    const responsiveSection = document.querySelector('#responsivevnes');

    if (responsiveSection) {
        // Check for specific elements
        const heading = document.querySelector('#responsivevnes h2');
        const paragraph = document.querySelector('#responsivevnes p');
        const ctaButton = document.querySelector('#responsivevnes a');
        const image = document.querySelector('#responsivevnes img');

        // Only create timeline if at least one element exists
        if (heading || paragraph || ctaButton || image) {
            const responsiveTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: '#responsivevnes',
                    start: 'top 70%',
                    toggleActions: 'play none none none'
                }
            });

            if (heading) {
                responsiveTimeline.from('#responsivevnes h2', {
                    x: -50,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.out'
                });
            }

            if (paragraph) {
                responsiveTimeline.from('#responsivevnes p', {
                    x: -40,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.out'
                }, heading ? '-=0.4' : 0);
            }

            if (ctaButton) {
                responsiveTimeline.from('#responsivevnes a', {
                    x: -30,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.out'
                }, (heading || paragraph) ? '-=0.4' : 0);
            }

            if (image) {
                responsiveTimeline.from('#responsivevnes img', {
                    x: 100,
                    opacity: 0,
                    scale: 0.8,
                    rotation: 5,
                    duration: 1.2,
                    ease: 'back.out(1.4)'
                }, (heading || paragraph || ctaButton) ? '-=1.2' : 0);

                // Optional floating animation for the responsive image
                gsap.to('#responsivevnes img', {
                    y: '15px',
                    duration: 2,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay: 1.5
                });
            }
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Check if the WordPress Development section exists
    const wpDevSection = document.querySelector('#wp_dev');

    if (wpDevSection) {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Check for specific elements
        const heading = document.querySelector('#wp_dev h2');
        const span = document.querySelector('#wp_dev h2 span');
        const paragraph = document.querySelector('#wp_dev p');
        const ctaButton = document.querySelector('#wp_dev a');

        // Only create timeline if at least one element exists
        if (heading || paragraph || ctaButton) {
            // WordPress Development Section Animation
            const wpDevTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: '#wp_dev',
                    start: 'top 75%',
                    toggleActions: 'play none none none'
                }
            });

            // Header and content animations with a slight stagger
            if (heading) {
                wpDevTimeline.from('#wp_dev h2', {
                    y: -60,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out'
                });
            }

            if (span) {
                wpDevTimeline.from('#wp_dev h2 span', {
                    color: '#e0e0e0',
                    textShadow: 'none',
                    duration: 0.8,
                    ease: 'power2.inOut'
                }, heading ? '-=0.6' : 0);
            }

            if (paragraph) {
                wpDevTimeline.from('#wp_dev p', {
                    y: -40,
                    opacity: 0,
                    duration: 1,
                    ease: 'power2.out'
                }, (heading || span) ? '-=0.7' : 0);
            }

            if (ctaButton) {
                wpDevTimeline.from('#wp_dev a', {
                    y: -20,
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.8,
                    ease: 'back.out(1.7)'
                }, (heading || span || paragraph) ? '-=0.6' : 0);
            }
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Check if the influencer management section exists
    const influencerSection = document.querySelector('#Influencer_Management');

    if (influencerSection) {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Check for specific elements
        const curveTextBg = document.querySelector('#Influencer_Management .curve_text_bg');
        const overlayImages = document.querySelectorAll('#Influencer_Management .overlay img');
        const overlay = document.querySelector('#Influencer_Management .overlay');
        const heading = document.querySelector('#Influencer_Management h2');
        const span = document.querySelector('#Influencer_Management span');
        const paragraphs = document.querySelectorAll('#Influencer_Management p');
        const ctaLink = document.querySelector('#Influencer_Management a');

        // Background effect animation
        gsap.fromTo('#Influencer_Management',
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
                    trigger: '#Influencer_Management',
                    start: 'top 70%',
                    toggleActions: 'play none none none'
                }
            }
        );

        // Only create circular animations if required elements exist
        if (curveTextBg || overlay || overlayImages.length > 0) {
            // Responsive Design Section Animation
            const respDesignTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: '#Influencer_Management',
                    start: 'top 70%',
                    toggleActions: 'play none none none'
                }
            });

            // Circular text animations - only if required elements exist
            if (curveTextBg) {
                // First rotate the entire container
                respDesignTimeline.from('#Influencer_Management .curve_text_bg', {
                    rotation: -180,
                    scale: 0.7,
                    opacity: 0,
                    duration: 1.5,
                    ease: 'power3.out'
                });
            }

            if (overlayImages.length > 0) {
                // Then animate each circular text with staggered rotation
                respDesignTimeline.from('#Influencer_Management .overlay img', {
                    rotation: 90,
                    scale: 0.8,
                    opacity: 0,
                    stagger: 0.2,
                    duration: 1.2,
                    ease: 'back.out(1.7)'
                }, curveTextBg ? '-=1.2' : 0);
            }

            if (overlay) {
                // Counter-rotate the overlay for interesting effect
                respDesignTimeline.from('#Influencer_Management .overlay', {
                    rotation: 45,
                    duration: 1.8,
                    ease: 'sine.inOut'
                }, (curveTextBg || overlayImages.length > 0) ? '-=1.5' : 0);

                // Continuous rotation animation for subtle movement
                respDesignTimeline.to('#Influencer_Management .overlay', {
                    rotation: '+=360',
                    duration: 30,
                    repeat: -1,
                    ease: 'none'
                });
            }
        }

        // Only create text timeline if any text elements exist
        if (heading || span || paragraphs.length > 0 || ctaLink) {
            // Text content animations
            const textTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: '#Influencer_Management',
                    start: 'top 70%',
                    toggleActions: 'play none none none'
                }
            });

            if (heading) {
                textTimeline.from('#Influencer_Management h2', {
                    x: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.out'
                }, 0.5);
            }

            if (span) {
                textTimeline.from('#Influencer_Management span', {
                    color: '#33B9C0',
                    duration: 0.6,
                    ease: 'power1.inOut'
                }, heading ? '-=0.3' : 0.5);
            }

            if (paragraphs.length > 0) {
                textTimeline.from('#Influencer_Management p', {
                    x: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    // Animate each line separately
                    stagger: {
                        amount: 0.3,
                        from: "start"
                    }
                }, (heading || span) ? '-=0.5' : 0.5);
            }

            if (ctaLink) {
                textTimeline.from('#Influencer_Management a', {
                    y: 20,
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.7,
                    ease: 'back.out(1.7)'
                }, (heading || span || paragraphs.length > 0) ? '-=0.3' : 0.5);
            }
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Check if cards-box elements exist
    let sliderImagesBox = document.querySelectorAll('#content_tiktok_mng .cards-box');
    
    if (sliderImagesBox && sliderImagesBox.length > 0) {
        sliderImagesBox.forEach(el => {
            // Check if there are non-hidden card elements
            let imageNodes = el.querySelectorAll('#content_tiktok_mng .card:not(.hide)');
            
            if (imageNodes && imageNodes.length > 0) {
                let arrIndexes = []; // Index array
                
                (() => {
                    // The loop that added values to the arrIndexes array for the first time
                    let start = 0;
                    while (imageNodes.length > start) {
                        arrIndexes.push(start++);
                    }
                })();
                
                let setIndex = (arr) => {
                    for(let i = 0; i < imageNodes.length; i++) {
                        imageNodes[i].dataset.slide = arr[i]; // Set indexes
                    }
                };
                
                // Add click event only if we have elements to work with
                el.addEventListener('click', () => {
                    arrIndexes.unshift(arrIndexes.pop());
                    setIndex(arrIndexes);
                });
                
                setIndex(arrIndexes); // The first indexes addition
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Check if cards-box elements exist
    let sliderImagesBox = document.querySelectorAll('#amazonMAReasearch .cards-box');
    
    if (sliderImagesBox && sliderImagesBox.length > 0) {
        sliderImagesBox.forEach(el => {
            // Check if there are non-hidden card elements
            let imageNodes = el.querySelectorAll('#amazonMAReasearch .card:not(.hide)');
            
            if (imageNodes && imageNodes.length > 0) {
                let arrIndexes = []; // Index array
                
                (() => {
                    // The loop that added values to the arrIndexes array for the first time
                    let start = 0;
                    while (imageNodes.length > start) {
                        arrIndexes.push(start++);
                    }
                })();
                
                let setIndex = (arr) => {
                    for(let i = 0; i < imageNodes.length; i++) {
                        imageNodes[i].dataset.slide = arr[i]; // Set indexes
                    }
                };
                
                // Add click event only if we have elements to work with
                el.addEventListener('click', () => {
                    arrIndexes.unshift(arrIndexes.pop());
                    setIndex(arrIndexes);
                });
                
                setIndex(arrIndexes); // The first indexes addition
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
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

    const heroAnimationElement = document.querySelector('.hero-animation');
    if (heroAnimationElement) {
        new HeroAnimation(heroAnimationElement);
    }
});



