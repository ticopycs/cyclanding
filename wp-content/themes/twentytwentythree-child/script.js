/**
 * Twenty Twenty-Three Child Theme Scripts
 * Enhanced UX with smooth animations and interactions
 */

(function($) {
    'use strict';

    // Wait for DOM to be ready
    $(document).ready(function() {
        // Header scroll behavior - integrate with hero, then sticky
        // Using setTimeout to ensure it doesn't interfere with map initialization
        setTimeout(function() {
            try {
                const header = document.querySelector('.wp-block-template-part:first-child');
                const nosotrosSection = document.querySelector('#nosotros');
                const heroSection = document.querySelector('.c-hero');
                const siteTitle = document.querySelector('.wp-block-site-title a');
                const proyectosPage = document.querySelector('.c-project-grid, .c-project-filters');
                const projectDetailPage = document.querySelector('.c-project-detail');
                
                if (header) {
                    // If there's a hero section, header starts as absolute (integrated)
                    // If no hero section (like on proyectos page), header should be fixed from start
                    // BUT keep title visible on proyectos pages
                    if (!heroSection) {
                        header.classList.add('header-sticky');
                        document.body.classList.add('header-sticky-active');
                        
                        // Only hide title text on project detail pages, not on proyectos listing page
                        if (projectDetailPage && siteTitle) {
                            const titleText = siteTitle.childNodes;
                            titleText.forEach(node => {
                                if (node.nodeType === 3) { // Text node
                                    node.style.display = 'none';
                                }
                            });
                            const textElements = siteTitle.querySelectorAll('span, em, strong');
                            textElements.forEach(el => el.style.display = 'none');
                        }
                        // On proyectos listing page, keep title visible
                    } else if (nosotrosSection) {
                        // Only add scroll handler if both hero and nosotros exist (homepage)
                        function handleHeaderScroll() {
                            try {
                                const nosotrosTop = nosotrosSection.getBoundingClientRect().top;
                                
                                if (nosotrosTop <= 0) {
                                    // Past nosotros section - make header sticky
                                    header.classList.add('header-sticky');
                                    document.body.classList.add('header-sticky-active');
                                    
                                    // Hide title text, keep logo
                                    if (siteTitle) {
                                        const titleText = siteTitle.childNodes;
                                        titleText.forEach(node => {
                                            if (node.nodeType === 3) { // Text node
                                                node.style.display = 'none';
                                            }
                                        });
                                        const textElements = siteTitle.querySelectorAll('span, em, strong');
                                        textElements.forEach(el => el.style.display = 'none');
                                    }
                                } else {
                                    // Before nosotros section - header integrated with hero
                                    header.classList.remove('header-sticky');
                                    document.body.classList.remove('header-sticky-active');
                                    
                                    // Show title text again
                                    if (siteTitle) {
                                        const titleText = siteTitle.childNodes;
                                        titleText.forEach(node => {
                                            if (node.nodeType === 3) { // Text node
                                                node.style.display = '';
                                            }
                                        });
                                        const textElements = siteTitle.querySelectorAll('span, em, strong');
                                        textElements.forEach(el => el.style.display = '');
                                    }
                                }
                            } catch (e) {
                                console.warn('Error in handleHeaderScroll:', e);
                            }
                        }
                        
                        // Check on scroll
                        window.addEventListener('scroll', handleHeaderScroll);
                        // Check initial state
                        handleHeaderScroll();
                    }
                }
            } catch (e) {
                console.warn('Error in header scroll behavior:', e);
            }
        }, 100); // Small delay to ensure map initialization happens first
        
        // Homepage hero slider
        const heroSectionSlider = document.querySelector('.c-hero');

        if (heroSectionSlider) {
            let heroImages = [];

            const inlineImages = heroSectionSlider.getAttribute('data-hero-images');
            if (inlineImages) {
                try {
                    heroImages = JSON.parse(inlineImages);
                } catch (error) {
                    console.warn('No se pudo parsear data-hero-images');
                }
            } else if (window.cycThemeData && Array.isArray(window.cycThemeData.heroImages)) {
                heroImages = window.cycThemeData.heroImages;
            }

            if (heroImages.length > 0) {
                let currentIndex = 0;
                let slidesWrapper = heroSectionSlider.querySelector('.c-hero-background');

                if (!slidesWrapper) {
                    slidesWrapper = document.createElement('div');
                    slidesWrapper.className = 'c-hero-background';
                    heroSectionSlider.insertBefore(slidesWrapper, heroSectionSlider.firstChild);
                }

                if (!slidesWrapper.children.length) {
                    heroImages.forEach((image, index) => {
                        const slide = document.createElement('div');
                        slide.className = 'c-hero-slide';
                        if (index === 0) {
                            slide.classList.add('is-active');
                        }
                        slide.style.backgroundImage = `url('${image}')`;
                        slidesWrapper.appendChild(slide);
                    });
                }

                const slides = slidesWrapper.querySelectorAll('.c-hero-slide');

                if (slides.length > 1) {
                    setInterval(() => {
                        slides[currentIndex].classList.remove('is-active');
                        currentIndex = (currentIndex + 1) % slides.length;
                        slides[currentIndex].classList.add('is-active');
                    }, 6000);
                }
            }
        }

        // Project hero slider on dedicated endpoints
        document.querySelectorAll('.c-project-detail-hero').forEach(hero => {
            let heroImages = [];
            const attr = hero.getAttribute('data-hero-images');

            if (attr) {
                try {
                    heroImages = JSON.parse(attr);
                } catch (error) {
                    console.warn('No se pudo parsear data-hero-images en proyecto');
                }
            }

            const slidesWrapper = hero.querySelector('.c-project-detail-hero-background');
            const slides = slidesWrapper ? slidesWrapper.querySelectorAll('.c-project-detail-hero-slide') : [];

            if (slides.length > 1) {
                let index = 0;
                setInterval(() => {
                    slides[index].classList.remove('is-active');
                    index = (index + 1) % slides.length;
                    slides[index].classList.add('is-active');
                }, 7000);
            } else if (heroImages.length === 1 && slidesWrapper && !slidesWrapper.children.length) {
                const slide = document.createElement('div');
                slide.className = 'c-project-detail-hero-slide is-active';
                slide.style.backgroundImage = `url('${heroImages[0]}')`;
                slidesWrapper.appendChild(slide);
            }
        });

        // Initialize Leaflet Map - ensure it loads after Leaflet is available
        function initMap() {
            const mapContainer = document.getElementById('projects-map');
            if (!mapContainer) {
                return; // Map container doesn't exist on this page
            }
            
            if (typeof L === 'undefined') {
                // Leaflet not loaded yet, try again after a short delay
                console.log('Leaflet not loaded, retrying...');
                setTimeout(initMap, 200);
                return;
            }
            
            // Ensure map container has dimensions
            if (mapContainer.offsetHeight === 0) {
                console.log('Map container has no height, retrying...');
                setTimeout(initMap, 200);
                return;
            }
            
            // Center of Salta, Argentina
            const saltaCenter = [-24.7859, -65.4117];
            
            // Initialize map
            const map = L.map('projects-map', {
                center: saltaCenter,
                zoom: 13,
                scrollWheelZoom: true,
                zoomControl: true
            });

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19
            }).addTo(map);

            // Default and hover colors
            const defaultColor = '#2c5aa0'; // Azul para todos
            const hoverColor = '#e76027'; // Naranja al hacer hover

            // Create custom icon for markers
            function createCustomIcon(color, id) {
                return L.divIcon({
                    className: 'custom-map-marker',
                    html: `<svg id="marker-svg-${id}" width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path class="marker-path" d="M16 0C7.163 0 0 7.163 0 16C0 28 16 40 16 40C16 40 32 28 32 16C32 7.163 24.837 0 16 0Z" fill="${color}"/>
                        <circle cx="16" cy="16" r="8" fill="white"/>
                    </svg>`,
                    iconSize: [32, 40],
                    iconAnchor: [16, 40],
                    popupAnchor: [0, -40]
                });
            }

            // Project locations with exact addresses - will be geocoded
            const projectAddresses = [
                { slug: 'arenales-742', address: 'Arenales 742, Salta, Argentina', title: 'Arenales 742' },
                { slug: 'guemes-1768', address: 'Güemes 1768, Salta, Argentina', title: 'Güemes 1768' },
                { slug: 'guemes-1853', address: 'Güemes 1853, Salta, Argentina', title: 'Güemes 1853' },
                { slug: 'libera', address: 'Leguizamón 2073, Salta, Argentina', title: 'Edificio Libera' },
                { slug: 'belgrano-office', address: 'Belgrano 2131, Salta, Argentina', title: 'Edificio Belgrano Office' },
                { slug: 'balcarce-2302', address: 'Balcarce 2302, Salta, Argentina', title: 'Balcarce 2302' },
                { slug: 'duplex-grand-bourg', address: 'Casa de Gobierno, Grand Bourg, Buenos Aires, Argentina', title: 'Duplex Grand Bourg' }
            ];

            // Geocode addresses using Nominatim API
            async function geocodeAddress(address) {
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
                    const data = await response.json();
                    if (data && data.length > 0) {
                        return {
                            lat: parseFloat(data[0].lat),
                            lng: parseFloat(data[0].lon)
                        };
                    }
                } catch (error) {
                    console.warn('Geocoding error for:', address, error);
                }
                return null;
            }

            // Geocode all addresses and add markers
            async function addMarkersToMap() {
                const markers = [];
                let markerIndex = 0;
                
                for (const project of projectAddresses) {
                    const coords = await geocodeAddress(project.address);
                    if (coords) {
                        markerIndex++;
                        const currentIndex = markerIndex;
                        
                        // Create unique icons for each marker with ID
                        const defaultIcon = createCustomIcon(defaultColor, currentIndex);
                        const hoverIcon = createCustomIcon(hoverColor, currentIndex);
                        
                        const marker = L.marker([coords.lat, coords.lng], {
                            icon: defaultIcon
                        }).addTo(map);

                        // Create popup content with card style
                        const popupContent = `
                            <div class="c-map-popup-card">
                                <h3 class="c-map-popup-title">${project.title}</h3>
                                <p class="c-map-popup-address">${project.address}</p>
                                <a href="/proyectos/${project.slug}/" class="c-map-popup-button">Ver Proyecto</a>
                            </div>
                        `;

                        marker.bindPopup(popupContent, {
                            closeButton: true,
                            className: 'c-map-popup-wrapper',
                            maxWidth: 300,
                            autoPan: true
                        });

                        // Track popup state for this marker
                        let popupIsOpen = false;

                        // Wait for marker to be rendered, then attach DOM events
                        setTimeout(function() {
                            const iconElement = marker.getElement();
                            if (iconElement) {
                                const svgElement = iconElement.querySelector('svg');
                                const pathElement = iconElement.querySelector('.marker-path');
                                
                                if (svgElement) {
                                    iconElement.style.cursor = 'pointer';
                                    
                                    // Handle hover directly on DOM element
                                    iconElement.addEventListener('mouseenter', function() {
                                        if (!popupIsOpen) {
                                            if (pathElement) {
                                                pathElement.setAttribute('fill', hoverColor);
                                            } else {
                                                marker.setIcon(hoverIcon);
                                            }
                                        }
                                    });
                                    
                                    iconElement.addEventListener('mouseleave', function() {
                                        if (!popupIsOpen) {
                                            if (pathElement) {
                                                pathElement.setAttribute('fill', defaultColor);
                                            } else {
                                                marker.setIcon(defaultIcon);
                                            }
                                        }
                                    });
                                    
                                    // Handle click
                                    iconElement.addEventListener('click', function(e) {
                                        e.stopPropagation();
                                        if (popupIsOpen) {
                                            marker.closePopup();
                                        } else {
                                            marker.openPopup();
                                        }
                                    });
                                }
                            }
                        }, 50);

                        // Handle popup open/close events
                        marker.on('popupopen', function() {
                            popupIsOpen = true;
                            const iconElement = marker.getElement();
                            if (iconElement) {
                                const pathElement = iconElement.querySelector('.marker-path');
                                if (pathElement) {
                                    pathElement.setAttribute('fill', hoverColor);
                                } else {
                                    marker.setIcon(hoverIcon);
                                }
                            }
                        });

                        marker.on('popupclose', function() {
                            popupIsOpen = false;
                            const iconElement = marker.getElement();
                            if (iconElement) {
                                const pathElement = iconElement.querySelector('.marker-path');
                                if (pathElement) {
                                    pathElement.setAttribute('fill', defaultColor);
                                } else {
                                    marker.setIcon(defaultIcon);
                                }
                            }
                        });

                        markers.push(marker);
                    }
                }

                // Fit map to show all markers (focus on Salta projects)
                if (markers.length > 0) {
                    const bounds = markers.map(m => m.getLatLng());
                    const saltaMarkers = bounds.filter(b => b.lat > -25);
                    
                    if (saltaMarkers.length > 0) {
                        map.fitBounds(saltaMarkers, { padding: [50, 50] });
                    } else {
                        map.fitBounds(bounds, { padding: [50, 50] });
                    }
                }
            }

            // Start geocoding
            addMarkersToMap();
        }
        
        // Initialize map when ready
        initMap();

        // Smooth scroll for on-page anchors
        $('a[href^="#"]').on('click', function(e) {
            var target = $(this.getAttribute('href'));
            if (target.length) {
                e.preventDefault();
                $('html, body').stop().animate({
                    scrollTop: target.offset().top - 80
                }, 1000, 'swing');
            }
        });

        // Animated counters for statistics section
        function animateCounters() {
            $('.c-stat-number').each(function() {
                var $this = $(this);
                var targetValue = parseInt($this.attr('data-target')) || parseInt($this.text().replace(/\D/g, ''));
                
                // Check if element is in viewport
                var elementTop = $this.offset().top;
                var elementBottom = elementTop + $this.outerHeight();
                var viewportTop = $(window).scrollTop();
                var viewportBottom = viewportTop + $(window).height();
                
                if (elementBottom > viewportTop && elementTop < viewportBottom) {
                    // Only animate if not already animated
                    if (!$this.hasClass('animated')) {
                        $this.addClass('animated');
                        
                        $({countNum: 0}).animate({
                            countNum: targetValue
                        }, {
                            duration: 2000,
                            easing: 'swing',
                            step: function() {
                                $this.text('+' + Math.floor(this.countNum).toLocaleString());
                            },
                            complete: function() {
                                $this.text('+' + targetValue.toLocaleString());
                            }
                        });
                    }
                }
            });
        }

        // Trigger counter animation on scroll
        $(window).on('scroll', function() {
            animateCounters();
        });

        // Initial check for counters
        animateCounters();

        // Enhanced hover effects for project and news cards
        $('.c-project-card, .c-news-card').hover(
            function() {
                $(this).css({
                    'transform': 'translateY(-8px)',
                    'box-shadow': '0 8px 20px rgba(0,0,0,0.12)'
                });
            },
            function() {
                $(this).css({
                    'transform': 'translateY(0)',
                    'box-shadow': '0 4px 12px rgba(0,0,0,0.08)'
                });
            }
        );

        // Parallax effect for hero section
        $(window).on('scroll', function() {
            var scrolled = $(window).scrollTop();
            $('.c-hero').css('transform', 'translateY(' + (scrolled * 0.5) + 'px)');
        });

        // Fade in elements on scroll
        function fadeInOnScroll() {
            $('.c-section').each(function() {
                var elementTop = $(this).offset().top;
                var elementBottom = elementTop + $(this).outerHeight();
                var viewportTop = $(window).scrollTop();
                var viewportBottom = viewportTop + $(window).height();
                
                if (elementBottom > viewportTop && elementTop < viewportBottom) {
                    $(this).css({
                        'opacity': '1',
                        'transform': 'translateY(0)'
                    });
                }
            });
        }

        // Initial setup for fade-in elements
        $('.c-section').css({
            'opacity': '0',
            'transform': 'translateY(30px)',
            'transition': 'opacity 0.6s ease, transform 0.6s ease'
        });

        // Trigger fade-in on scroll
        $(window).on('scroll', function() {
            fadeInOnScroll();
        });

        // Initial check for fade-in elements
        fadeInOnScroll();

        // Reduce CLS (Cumulative Layout Shift) for images
        $('img').each(function() {
            var width = $(this).attr('width');
            var height = $(this).attr('height');
            if (width && height) {
                $(this).css('aspect-ratio', width + ' / ' + height);
            }
        });

        // Button hover animation
        $('.c-button').hover(
            function() {
                $(this).css('transform', 'translateY(-2px)');
            },
            function() {
                $(this).css('transform', 'translateY(0)');
            }
        );

        // Carousel functionality - Using Grid Cards
        const carouselContainer = document.querySelector('.c-carousel-container');
        if (carouselContainer) {
            const track = carouselContainer.querySelector('.c-carousel-track');
            const prevBtn = carouselContainer.querySelector('.c-carousel-prev');
            const nextBtn = carouselContainer.querySelector('.c-carousel-next');
            
            if (track && prevBtn && nextBtn) {
                setTimeout(() => {
                    // Remove existing clones
                    const allCards = Array.from(track.children);
                    const originalCount = 5;
                    
                    while (track.children.length > originalCount) {
                        track.removeChild(track.lastChild);
                    }
                    
                    // Get original cards
                    const originalCards = Array.from(track.children).slice(0, originalCount);
                    if (originalCards.length === 0) return;
                    
                    const cardWidth = 350;
                    const gap = 24;
                    const cardTotalWidth = cardWidth + gap;
                    const totalWidth = originalCards.length * cardTotalWidth;
                    
                    // Clone cards for infinite scroll - ensure structure is preserved
                    originalCards.forEach(card => {
                        // Verify card has proper structure before cloning
                        const img = card.querySelector('img, .c-project-card-image-grid');
                        const content = card.querySelector('.c-project-card-content-grid');
                        
                        if (img && content) {
                            const clone = card.cloneNode(true);
                            // Ensure clone maintains flex structure
                            clone.style.display = 'flex';
                            clone.style.flexDirection = 'column';
                            track.appendChild(clone);
                        }
                    });
                    
                    // Create animation
                    const animationId = 'cyc-carousel-' + Date.now();
                    let existingStyle = document.getElementById('cyc-carousel-style');
                    if (existingStyle) {
                        existingStyle.remove();
                    }
                    
                    const style = document.createElement('style');
                    style.id = 'cyc-carousel-style';
                    style.textContent = `
                        .c-carousel-track {
                            animation: ${animationId} 20s linear infinite;
                        }
                        @keyframes ${animationId} {
                            0% {
                                transform: translateX(0);
                            }
                            100% {
                                transform: translateX(-${totalWidth}px);
                            }
                        }
                    `;
                    document.head.appendChild(style);
                    
                    // Manual navigation
                    let isAnimating = false;
                    let currentPosition = 0;
                    
                    function scrollCarousel(direction) {
                        if (isAnimating) return;
                        isAnimating = true;
                        
                        track.style.animationPlayState = 'paused';
                        
                        if (direction === 'next') {
                            currentPosition -= cardTotalWidth;
                        } else {
                            currentPosition += cardTotalWidth;
                        }
                        
                        if (currentPosition <= -totalWidth) {
                            currentPosition = 0;
                            track.style.transition = 'none';
                            track.style.transform = 'translateX(0)';
                        } else if (currentPosition > 0) {
                            currentPosition = -totalWidth + cardTotalWidth;
                            track.style.transition = 'none';
                            track.style.transform = `translateX(${currentPosition}px)`;
                        } else {
                            track.style.transition = 'transform 0.5s ease';
                            track.style.transform = `translateX(${currentPosition}px)`;
                        }
                        
                        setTimeout(() => {
                            isAnimating = false;
                            track.style.animation = 'none';
                            setTimeout(() => {
                                track.style.animation = `${animationId} 20s linear infinite`;
                                track.style.animationPlayState = 'running';
                            }, 10);
                        }, 500);
                    }
                    
                    prevBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        scrollCarousel('prev');
                    });
                    
                    nextBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        scrollCarousel('next');
                    });
                }, 300);
            }
        }

        // Project Filtering System
        const filterButtons = document.querySelectorAll('.c-filter-btn');
        const projectCards = document.querySelectorAll('.c-project-card-grid');
        const noResults = document.querySelector('.c-no-results');
        
        if (filterButtons.length > 0) {
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Remove active class from all buttons
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    const filterValue = this.getAttribute('data-filter');
                    let visibleCount = 0;
                    const finalizadosSection = document.getElementById('finalizados-section');
                    const desarrolloSection = document.getElementById('desarrollo-section');
                    
                    projectCards.forEach(card => {
                        const stage = (card.getAttribute('data-stage') || '').toLowerCase();
                        let shouldDisplay = false;

                        if (filterValue === 'all') {
                            shouldDisplay = true;
                        } else if (filterValue === 'proximos' && stage === 'proximos') {
                            shouldDisplay = true;
                        } else if (filterValue === 'construccion' && (stage === 'en-construccion' || stage === 'construccion' || stage === 'en-desarrollo')) {
                            shouldDisplay = true;
                        } else if (filterValue === 'finalizados' && stage === 'finalizado') {
                            shouldDisplay = true;
                        }

                        card.style.display = shouldDisplay ? 'flex' : 'none';
                        if (shouldDisplay) {
                            visibleCount++;
                        }
                    });
                    
                    // Show/hide section titles based on visible cards
                    if (filterValue === 'all') {
                        if (finalizadosSection) finalizadosSection.style.display = '';
                        if (desarrolloSection) desarrolloSection.style.display = '';
                    } else if (filterValue === 'finalizados') {
                        if (finalizadosSection) finalizadosSection.style.display = '';
                        if (desarrolloSection) desarrolloSection.style.display = 'none';
                    } else if (filterValue === 'construccion') {
                        if (finalizadosSection) finalizadosSection.style.display = 'none';
                        if (desarrolloSection) desarrolloSection.style.display = '';
                    }
                    
                    // Show/hide no results message
                    if (noResults) {
                        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
                    }
                    
                    // Animate visible cards
                    setTimeout(() => {
                        document.querySelectorAll('.c-project-card-grid[style*="flex"]').forEach((card, index) => {
                            card.style.animation = 'none';
                            setTimeout(() => {
                                card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`;
                            }, 10);
                        });
                    }, 10);
                });
            });
        }

        // Copy link interactions
        const copyButtons = document.querySelectorAll('.js-copy-link');

        if (copyButtons.length) {
            copyButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const link = this.getAttribute('data-copy-target');
                    const feedbackSelector = this.getAttribute('data-feedback-target');
                    const feedbackElement = feedbackSelector ? document.querySelector(feedbackSelector) : null;

                    if (!link) {
                        return;
                    }

                    const copyToClipboard = async () => {
                        try {
                            await navigator.clipboard.writeText(link);
                            showFeedback();
                        } catch (error) {
                            fallbackCopy();
                        }
                    };

                    const fallbackCopy = () => {
                        const tempInput = document.createElement('input');
                        tempInput.value = link;
                        document.body.appendChild(tempInput);
                        tempInput.select();
                        document.execCommand('copy');
                        document.body.removeChild(tempInput);
                        showFeedback();
                    };

                    const showFeedback = () => {
                        if (feedbackElement) {
                            feedbackElement.style.display = 'block';
                            feedbackElement.classList.add('is-visible');
                            setTimeout(() => {
                                feedbackElement.classList.remove('is-visible');
                                setTimeout(() => {
                                    feedbackElement.style.display = 'none';
                                }, 300);
                            }, 3000);
                        }
                        this.classList.add('is-copied');
                        setTimeout(() => this.classList.remove('is-copied'), 3000);
                    };

                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        copyToClipboard();
                    } else {
                        fallbackCopy();
                    }
                });
            });
        }

        // Image Modal for Project Detail Pages
        const imageModal = document.getElementById('c-image-modal');
        const modalImage = document.getElementById('c-modal-image');
        const modalClose = document.querySelector('.c-modal-close');
        const modalPrev = document.querySelector('.c-modal-prev');
        const modalNext = document.querySelector('.c-modal-next');
        const modalCurrent = document.getElementById('c-modal-current');
        const modalTotal = document.getElementById('c-modal-total');
        const galleryItems = document.querySelectorAll('.c-project-gallery-item');
        
        let currentImageIndex = 0;
        let imageUrls = [];

        // Collect all image URLs
        if (galleryItems.length > 0) {
            galleryItems.forEach(item => {
                const url = item.getAttribute('data-image-url');
                if (url) {
                    imageUrls.push(url);
                }
            });
            if (modalTotal) {
                modalTotal.textContent = imageUrls.length;
            }
        }

        // Open modal with image
        function openModal(index) {
            if (!imageModal || imageUrls.length === 0) return;
            
            currentImageIndex = index;
            updateModalImage();
            imageModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }

        // Close modal
        function closeModal() {
            if (!imageModal) return;
            imageModal.style.display = 'none';
            document.body.style.overflow = '';
        }

        // Update modal image
        function updateModalImage() {
            if (!modalImage || imageUrls.length === 0) return;
            
            if (currentImageIndex < 0) {
                currentImageIndex = imageUrls.length - 1;
            } else if (currentImageIndex >= imageUrls.length) {
                currentImageIndex = 0;
            }
            
            modalImage.src = imageUrls[currentImageIndex];
            if (modalCurrent) {
                modalCurrent.textContent = currentImageIndex + 1;
            }
        }

        // Navigate to previous image
        function prevImage() {
            currentImageIndex--;
            updateModalImage();
        }

        // Navigate to next image
        function nextImage() {
            currentImageIndex++;
            updateModalImage();
        }

        // Event listeners for gallery items
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                openModal(index);
            });
        });

        // Event listeners for modal controls
        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }

        if (modalPrev) {
            modalPrev.addEventListener('click', prevImage);
        }

        if (modalNext) {
            modalNext.addEventListener('click', nextImage);
        }

        // Close modal on background click
        if (imageModal) {
            imageModal.addEventListener('click', (e) => {
                if (e.target === imageModal) {
                    closeModal();
                }
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (imageModal && imageModal.style.display === 'flex') {
                if (e.key === 'Escape') {
                    closeModal();
                } else if (e.key === 'ArrowLeft') {
                    prevImage();
                } else if (e.key === 'ArrowRight') {
                    nextImage();
                }
            }
        });

        // Console log to confirm script loaded
        console.log('CyC Emprendimientos - Child Theme Scripts Loaded');
        console.log('Project filters and sliders initialized');
    });

})(jQuery);

