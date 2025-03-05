class Navigation {
    constructor() {
        this.hamburger = document.querySelector(".hamburger");
        this.navLinks = document.querySelector(".nav-links");
        this.links = document.querySelectorAll(".nav-links li");
        this.init();
    }

    toggleMenu() {
        this.navLinks.classList.toggle("open");
        this.links.forEach(link => link.classList.toggle("fade"));
        this.hamburger.classList.toggle("toggle");
    }

    init() {
        this.hamburger?.addEventListener('click', () => this.toggleMenu());
    }
}

class HexagonInteraction {
    constructor() {
        this.initElements();
        if (!this.hexagonHome) return;
        this.init();
    }

    initElements() {
        this.hexagonHome = document.getElementById('hexagon-home');
        this.hexCells = this.hexagonHome?.querySelectorAll('.hex-cell');
        this.hexDetails = this.hexagonHome?.querySelectorAll('.details');
        this.hexSelected = this.hexagonHome?.querySelector('.selected');
        this.hexSelectedWrap = this.hexagonHome?.querySelector('.selected-wrap');
    }

    updateSelectedPosition(index) {
        if (!this.hexSelected || !this.hexSelectedWrap || !this.hexDetails) return;

        const detailHeight = 300; // Fixed height for each detail section
        const newPosition = index * detailHeight;

        // Update selected position
        this.hexSelected.style.top = `-${newPosition}px`;

        // Update wrapper height to match current detail
        const currentDetail = this.hexDetails[index];
        if (currentDetail) {
            this.hexSelectedWrap.style.height = `${detailHeight}px`;
        }
    }

    handleInteraction = (event) => {
        const cell = event.target.closest('.hex-cell');
        if (!cell || !this.hexCells) return;

        const index = Array.from(this.hexCells).indexOf(cell);

        // Update active state
        this.hexCells.forEach(cell => cell.classList.remove('active'));
        cell.classList.add('active');

        // Update position
        this.updateSelectedPosition(index);
    }

    init() {
        this.hexCells?.forEach(cell => {
            cell.addEventListener('mouseenter', this.handleInteraction);
            cell.addEventListener('click', this.handleInteraction);
        });

        // Set initial state
        const firstCell = this.hexCells?.[0];
        if (firstCell) {
            firstCell.classList.add('active');
            this.updateSelectedPosition(0);
        }
    }
}

class SvgServiceAnimation {
    constructor() {
        this.services = [
            'fisrtService',
            'secondService',
            'thirdService',
            'FourthService',
            'FifthService',
            'sixthService'
        ];
        this.timeline = gsap.timeline({
            defaults: {
                duration: 0.5,
                ease: "power2.out"
            }
        });
        this.init();
    }

    init() {
        // Initial state setup
        this.services.forEach((serviceId, index) => {
            const service = document.getElementById(serviceId);
            if (!service) return;

            gsap.set(service, {
                x: index % 2 === 0 ? -100 : 100,
                opacity: 0
            });
        });

        // Create master timeline for sequential animation
        ScrollTrigger.create({
            trigger: "#" + this.services[0], // First service as trigger
            start: "top 80%",
            onEnter: () => this.animateServices()
        });
    }

    animateServices() {
        this.services.forEach((serviceId, index) => {
            const service = document.getElementById(serviceId);
            if (!service) return;

            // Add to timeline with stagger
            this.timeline.to(service, {
                x: 0,
                opacity: 1,
                delay: index * 0.3 // Stagger delay between services
            });
        });

        return this.timeline;
    }
}

class ServicesAnimation {
    constructor() {
        this.cardsContainer = document.querySelector('.cards-container');
        this.cards = document.querySelectorAll('.service-card');
        this.timeline = null;
        this.init();
    }

    init() {
        if (!this.cardsContainer) return;
        
        this.cards.forEach(card => {
            card.style.animation = 'none';
        });

        // Reduced matrix skew and adjusted initial positioning
        gsap.set(this.cards, {
            opacity: 0,
            y: '80vh', // Reduced from 100vh for faster entry
            x: (index) => {
                const offset = [-300, -150, 0, 150, 300][index] || 0; // Reduced spread
                return `${offset}px`;
            },
            transform: 'matrix(0.95, 0.2, 0, 1, 0, 0)', // Reduced skew
            transformOrigin: 'center center'
        });

        // Reduced threshold for earlier trigger
        const servicesObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCards();
                    servicesObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 }); // Reduced from 0.2

        servicesObserver.observe(this.cardsContainer);
    }

    animateCards() {
        this.timeline = gsap.timeline();

        // Faster fan-out animation
        this.cards.forEach((card, index) => {
            this.timeline.to(card, {
                duration: 0.6, // Reduced from 0.8
                opacity: 1,
                y: '-30%', // Reduced vertical offset
                x: (index - 2) * 150, // Reduced spread
                ease: "power3.out", // Changed to power3 for smoother motion
                delay: index * 0.08 // Reduced delay between cards
            }, 0);
        });

        // Quicker transition to grid
        this.timeline.add(() => {
            this.cardsContainer.classList.add('grid-view');
        }, "+=1") // Reduced from 1.5
            .to(this.cards, {
                duration: 0.8, // Reduced from 1
                x: 0,
                y: 0,
                transform: 'matrix(1, 0, 0, 1, 0, 0)',
                stagger: {
                    amount: 0.2, // Reduced from 0.3
                    from: "start"
                },
                ease: "power2.inOut",
                clearProps: "transform,x,y",
                onComplete: () => {
                    this.cards.forEach(card => {
                        card.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                    });
                }
            });

        return this.timeline;
    }
}

class GraphicDesignAnimation {
    constructor() {
        // Initialize class properties
        this.section = "#graphicdesign";
        this.heading = `${this.section} h2`;
        this.cards = `${this.section} .col-md-3`;

        // Initialize GSAP
        gsap.registerPlugin(ScrollTrigger);

        // Initialize animations
        this.init();
    }

    init() {
        this.setInitialStates();
        this.createTimeline();
        this.addHoverEffects();
    }

    setInitialStates() {
        // Set initial states for elements
        gsap.set(this.heading, {
            opacity: 0,
            y: 100
        });

        gsap.set(this.cards, {
            opacity: 0,
            y: 100 // Changed from x: -100 to y: 100 for bottom-to-top animation
        });
    }

    createTimeline() {
        // Create the main animation timeline
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: this.section,
                start: "top center",
                end: "bottom center",
                toggleActions: "play none none reverse"
            }
        });

        // Add animations to timeline
        timeline
            .to(this.heading, {
                opacity: 1,
                duration: 1,
                ease: "expo.in(1.2,0.3)",
                y: - 10
            })
            .to(this.cards, {
                duration: 1,
                opacity: 1,
                y: 0, // Changed from x: 0 to y: 0 for bottom-to-top animation
                stagger: 0.5,
                ease: "sine.inOut",
            });
    }

    addHoverEffects() {
        // Add hover effects to cards
        const cards = gsap.utils.toArray(this.cards);

        cards.forEach(card => {
            // Mouse enter animation
            card.addEventListener("mouseenter", () => {
                gsap.to(card, {
                    duration: 0.3,
                    scale: 1.05,
                    ease: "power2.out"
                });
            });

            // Mouse leave animation
            card.addEventListener("mouseleave", () => {
                gsap.to(card, {
                    duration: 0.3,
                    scale: 1,
                    ease: "power2.out"
                });
            });
        });
    }

    // Method to manually refresh animations
    refresh() {
        ScrollTrigger.refresh();
        this.init();
    }

    // Method to kill all animations
    // destroy() {
    //     ScrollTrigger.kill();
    // }
}

class BrandingAnimations {
    constructor() {
        // Initialize required GSAP plugins
        gsap.registerPlugin(ScrollTrigger);

        // Store selectors
        this.section = '#branddesignsolution';
        this.heading = '#branddesignsolution h2';
        this.cards = '.slider_brand_digital .col-md-3';

        // Initialize animations
        this.init();
    }

    init() {
        this.animateHeading();
        this.animateCards();
        this.initHoverEffects();
    }

    animateHeading() {
        gsap.from(this.heading, {
            scrollTrigger: {
                trigger: this.section,
                start: 'top center',
                toggleActions: 'play none none reverse'
            },
            y: -100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    }

    animateCards() {
        gsap.from(this.cards, {
            scrollTrigger: {
                trigger: '.slider_brand_digital',
                start: 'top center+=100',
                toggleActions: 'play none none reverse'
            },
            y: -100,
            opacity: 0,
            duration: 0.8,
            stagger: {
                each: 0.5,
                from: 'start',
                amount: 1.2
            },
          
            ease: 'power3.out'
          
        });
    }

    initHoverEffects() {
        const cards = document.querySelectorAll('.image-container');

        cards.forEach(card => {
            // Mouse enter effect
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            // Mouse leave effect
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }

    // Method to refresh animations (useful for dynamic content)
    refresh() {
        ScrollTrigger.refresh();
    }

    // Method to kill all animations (useful for cleanup)
    // destroy() {
    //     ScrollTrigger.killAll();
    // }
}

class DigitalSectionAnimation {
    constructor() {
        // Store DOM elements
        this.section = document.querySelector('#threeddesign');
        this.heading = this.section.querySelector('.section-heading');
        this.cardLeft = this.section.querySelector('.card-left');
        this.cardRight = this.section.querySelector('.card-right');
        this.bottomCards = this.section.querySelectorAll('.card-bottom-left, .card-bottom-right');
        
        // Initialize timeline
        this.timeline = gsap.timeline({ paused: true });
        
        // Initialize the animation
        this.init();
    }

    init() {
        // Set initial states
        this.setInitialStates();
        
        // Create animation timeline
        this.createTimeline();
        
        // Setup observers and event listeners
        this.setupObservers();
        this.setupEventListeners();
    }

    setInitialStates() {
        gsap.set(this.heading, { opacity: 0, y: -100 });
        gsap.set(this.cardLeft, { opacity: 0, x: -100 });
        gsap.set(this.cardRight, { opacity: 0, x: 100 });
        gsap.set(this.bottomCards, { opacity: 0, y: 100 });
    }

    createTimeline() {
        this.timeline
            .to(this.heading, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out"
            })
            .to(this.cardLeft, {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.5")
            .to(this.cardRight, {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.8")
            .to(this.bottomCards, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.5");
    }

    setupObservers() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.playAnimation();
                } else {
                    this.reverseAnimation();
                }
            });
        }, {
            threshold: 0.2
        });

        this.observer.observe(this.section);
    }

    setupEventListeners() {
        this.section.addEventListener('mouseenter', () => this.playAnimation());
        this.section.addEventListener('mouseleave', () => this.reverseAnimation());
    }

    playAnimation() {
        this.timeline.play();
    }

    reverseAnimation() {
        this.timeline.reverse();
    }

    // Method to destroy and clean up the animation
    destroy() {
        // Remove event listeners
        this.section.removeEventListener('mouseenter', this.playAnimation);
        this.section.removeEventListener('mouseleave', this.reverseAnimation);
        
        // Disconnect observer
        this.observer.disconnect();
        
        // Kill GSAP animationsand I need 
        this.timeline.kill();
    }
}



// class CarouselDragScroll {
//     constructor() {
//         // Store DOM elements
//         this.list = document.querySelector('ul.carousel-items');
//         this.items = this.list.querySelectorAll('li');
        
//         // Create proxy element for dragging
//         this.proxy = document.createElement('div');
        
//         // Initialize variables
//         this.syncer = null;
//         this.frame = 0;
//         this.syncs = new Array(10);
//         this.index = 0;
//         this.config = {
//             snap: true
//         };
        
//         // Initialize the carousel
//         this.init();
//     }
    
//     init() {
//         // Apply snap attribute to document
//         this.syncSnapAttribute();
        
//         // Setup draggable functionality
//         this.setupDraggable();
//     }
    
//     syncSnapAttribute() {
//         document.documentElement.dataset.snap = this.config.snap;
//     }
    
//     addNumber(num) {
//         this.syncs[this.index] = num; // Place the new number at the current index
//         this.index = (this.index + 1) % this.syncs.length; // Move index forward, wrapping around if necessary
//     }
    
//     handleAutoScroll = () => {
//         this.syncer = requestAnimationFrame(() => {
//             const sames = new Set(this.syncs).size === 1;
//             if (sames) {
//                 this.frame++;
//             }
//             if (sames && this.frame >= 20) {
//                 this.list.style.removeProperty('pointer-events');
//                 this.list.removeEventListener('scroll', this.handleAutoScroll);
//                 if (this.syncer) cancelAnimationFrame(this.syncer);
//                 this.frame = 0;
//                 this.syncs = new Array(10);
//                 this.index = 0;
//                 document.documentElement.dataset.snap = true;
//             } else {
//                 this.addNumber(this.list.scrollLeft);
//                 this.handleAutoScroll();
//             }
//         });
//     }
    
//     complete = () => {
//         // Calculate the center of the scroll container on the horizontal axis
//         const listCenter = this.list.scrollLeft + this.list.clientWidth / 2;
//         let closestElement = null;
//         let closestDistance = Infinity;
        
//         // Loop over each item and calculate its distance to the container's center
//         Array.from(this.items).forEach(item => {
//             // Calculate the item's center position relative to the scroll container
//             const itemLeft = item.offsetLeft;
//             const itemCenter = itemLeft + item.offsetWidth / 2;
            
//             // Calculate the distance from the item's center to the container's center
//             const distanceToCenter = Math.abs(listCenter - itemCenter);
            
//             // Update the closest element if this one is nearer to the center
//             if (distanceToCenter < closestDistance) {
//                 closestDistance = distanceToCenter;
//                 closestElement = item.nextElementSibling;
//             }
//         });
        
//         // Scroll to the closest element
//         this.list.style.setProperty('pointer-events', 'none');
//         this.list.addEventListener('scroll', this.handleAutoScroll, { once: true });
//         if (closestElement) {
//             closestElement.scrollIntoView({ inline: 'center', behavior: 'smooth' });
//         }
//     }
    
//     update = function() {
//         this.list.scroll({
//             left: this.scrollLeft + -this.x,
//             behavior: 'instant'
//         });
//     }
    
//     setupDraggable() {
//         this.dragger = Draggable.create(this.proxy, {
//             type: 'x',
//             trigger: this.list,
//             inertia: true,
//             allowContextMenu: true,
//             onPressInit: () => {
//                 document.documentElement.dataset.snap = false;
//                 this.dragger[0].scrollLeft = this.list.scrollLeft;
//                 gsap.set(this.proxy, { clearProps: 'all' });
//             },
//             onDrag: this.update,
//             onThrowUpdate: this.update,
//             onThrowComplete: () => {
//                 this.complete();
//             }
//         });
//     }
    
//     // Method to toggle snap functionality
//     toggleSnap(value) {
//         this.config.snap = value;
//         this.syncSnapAttribute();
//     }
    
//     // Method to destroy and clean up
//     destroy() {
//         if (this.syncer) cancelAnimationFrame(this.syncer);
//         this.list.removeEventListener('scroll', this.handleAutoScroll);
//         if (this.dragger && this.dragger[0]) {
//             this.dragger[0].kill();
//         }
//     }
// }

// Add to your document ready function
document.addEventListener("DOMContentLoaded", () => {
    // Your existing code
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
        CustomEase,

    );

    // Initialize your existing classes
    new SvgServiceAnimation();
    new Navigation();
    new HexagonInteraction();
    new ServicesAnimation();
    new GraphicDesignAnimation();
    new BrandingAnimations();
    new DigitalSectionAnimation();
    
    // Initialize the new carousel
    // new CarouselDragScroll();
});

