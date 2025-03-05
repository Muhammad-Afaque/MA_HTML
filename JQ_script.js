$(document).ready(function () {
    $('.seoFeatureCardParent').slick({
        dots: false,
        infinite: false,
        speed: 300,
        arrws: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });
    $('.slider_convex').slick({
        dots: false,
        infinite: true,
        speed: 8000,
        autoplay: true,
        autoplaySpeed: 0,
        arrws: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        pauseOnHover: false,
        cssEase: 'linear',
        draggable: false,
        swipe: false,
        touchMove: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });
    $('.shopifu_slider').slick({
        dots: false,
        infinite: true,
        speed: 8000,
        autoplay: true,
        autoplaySpeed: 0,
        arrws: false,
        slidesToShow: 6,
        slidesToScroll: 1,
        pauseOnHover: false,
        cssEase: 'linear',
        draggable: false,
        swipe: false,
        touchMove: false,
        variableWidth: false,
        centerMode: false,
        centerPadding: '0px',
        margin: 0,

    });
    $('.shopifu_slider_4').slick({
        dots: false,
        infinite: true,
        speed: 8000,
        autoplay: true,
        autoplaySpeed: 0,
        arrws: false,
        slidesToShow: 3.5,
        slidesToScroll: 1,
        pauseOnHover: false,
        cssEase: 'linear',
        draggable: false,
        swipe: false,
        touchMove: false,
        variableWidth: false,
        centerMode: false,
        centerPadding: '0px',
        margin: 0,

    });
    $('.slider_brand_digital').slick({
        dots: false,
        infinite: false,
        speed: 300,
        arrws: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });

    initVerticalSliderWithScrollbar(
        '.slick',
        '.custom-scrollbar',
        '.scrollbar-handle'
    );

    initAdvancedSlider('.rev_slider');

});


function initAdvancedSlider(selector, options = {}) {
    // Default configuration
    const defaultOptions = {
        speed: 1000,
        arrows: true,
        dots: false,
        focusOnSelect: true,
        prevArrow: '<button> prev</button>',
        nextArrow: '<button> next</button>',
        infinite: true,
        centerMode: true,
        slidesPerRow: 1,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerPadding: '0',
        swipe: true,
        customPaging: function (slider, i) {
            return '';
        }
    };

    // Merge default options with custom options
    const sliderOptions = $.extend({}, defaultOptions, options);

    // Get slider element
    const slider = $(selector);

    // Initialize event handlers
    slider.on('init', function (event, slick, currentSlide) {
        var cur = $(slick.$slides[slick.currentSlide]),
            next = cur.next(),
            next2 = cur.next().next(),
            prev = cur.prev(),
            prev2 = cur.prev().prev();

        prev.addClass('slick-sprev');
        next.addClass('slick-snext');
        prev2.addClass('slick-sprev2');
        next2.addClass('slick-snext2');

        cur.removeClass('slick-snext')
            .removeClass('slick-sprev')
            .removeClass('slick-snext2')
            .removeClass('slick-sprev2');

        slick.$prev = prev;
        slick.$next = next;
    }).on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        var cur = $(slick.$slides[nextSlide]);

        // Remove classes from previous slider state
        slick.$prev.removeClass('slick-sprev');
        slick.$next.removeClass('slick-snext');
        slick.$prev.prev().removeClass('slick-sprev2');
        slick.$next.next().removeClass('slick-snext2');

        // Define new prev/next elements
        var next = cur.next(),
            prev = cur.prev();

        // Add classes to new elements
        prev.addClass('slick-sprev');
        next.addClass('slick-snext');
        prev.prev().addClass('slick-sprev2');
        next.next().addClass('slick-snext2');

        // Update slick references
        slick.$prev = prev;
        slick.$next = next;

        // Reset current slide classes
        cur.removeClass('slick-next')
            .removeClass('slick-sprev')
            .removeClass('slick-next2')
            .removeClass('slick-sprev2');
    });

    // Initialize slick slider
    slider.slick(sliderOptions);

    return slider; // Return for chaining
}

function initVerticalSliderWithScrollbar(sliderSelector, scrollbarSelector, handleSelector, options = {}) {
    // Default slider configuration
    const defaultOptions = {
        autoplay: false,
        dots: true,
        speed: 150,
        vertical: true,
        verticalSwiping: true,
        ease: "linear",
        arrows: true,
        infinite: false,
        swipeToSlide: true,
        rows: 1,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    // Merge default options with custom options
    const sliderOptions = $.extend({}, defaultOptions, options);

    // Initialize slider
    const slider = $(sliderSelector);
    slider.slick(sliderOptions);

    // Get scrollbar elements
    const scrollbar = $(scrollbarSelector);
    const handle = $(handleSelector);

    // Scrollbar configuration
    let isDragging = false;
    let startY, startTop;
    const totalSlides = options.totalSlides || 3;
    const scrollbarHeight = scrollbar.height();
    const handleHeight = handle.height();
    const scrollMargin = options.scrollMargin || 20;
    const scrollableHeight = scrollbarHeight - handleHeight - (scrollMargin * 2);
    const stepSize = scrollableHeight / (totalSlides - 1);

    // Set initial handle position
    handle.css('top', `${scrollMargin}px`);

    // Handle mousedown event
    handle.mousedown(function (e) {
        isDragging = true;
        startY = e.pageY;
        startTop = parseInt(handle.css('top'));
        $(document).css('cursor', 'grabbing');
        e.preventDefault(); // Prevent text selection
    });

    // Handle mousemove event
    $(document).mousemove(function (e) {
        if (!isDragging) return;

        const deltaY = e.pageY - startY;
        let newTop = startTop + deltaY;

        // Calculate snap positions
        const snapPositions = Array.from({ length: totalSlides }, (_, i) =>
            scrollMargin + (stepSize * i)
        );

        // Find closest snap position
        const closestPos = snapPositions.reduce((prev, curr) =>
            Math.abs(curr - newTop) < Math.abs(prev - newTop) ? curr : prev
        );

        // Constrain to bounds and snap
        newTop = Math.max(scrollMargin, Math.min(scrollableHeight + scrollMargin, closestPos));
        handle.css('top', newTop + 'px');

        // Calculate target slide
        const scrollPercent = (newTop - scrollMargin) / scrollableHeight;
        const targetSlide = Math.round(scrollPercent * (totalSlides - 1));

        // Go to slide
        slider.slick('slickGoTo', targetSlide);
    });

    // Handle mouseup event
    $(document).mouseup(function () {
        isDragging = false;
        $(document).css('cursor', '');
    });

    // Update scrollbar when slider changes
    slider.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        const newTop = scrollMargin + (stepSize * nextSlide);
        handle.css('top', `${newTop}px`);
    });

    // Return slider instance for chaining
    return {
        slider: slider,
        scrollbar: scrollbar,
        handle: handle
    };
}