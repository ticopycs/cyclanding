/**
 * Twenty Twenty-Three Child Theme Scripts
 * Enhanced UX with smooth animations and interactions
 */

(function($) {
    'use strict';

    // ============================================
    // LOADING SPINNER CONTROL
    // ============================================
    
    // Hide spinner when page is fully loaded
    window.addEventListener('load', function() {
        const spinner = document.getElementById('cyc-loading-spinner');
        if (spinner) {
            setTimeout(function() {
                spinner.classList.add('hidden');
                // Remove from DOM after transition
                setTimeout(function() {
                    spinner.remove();
                }, 500);
            }, 300); // Small delay to ensure smooth transition
        }
    });

    // Show spinner on page navigation (if using links)
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href]');
        if (link && !link.hasAttribute('target') && !link.getAttribute('href').startsWith('#')) {
            const spinner = document.getElementById('cyc-loading-spinner');
            if (spinner && !spinner.classList.contains('hidden')) {
                // Spinner already visible
                return;
            }
            // Create new spinner for navigation
            if (!document.getElementById('cyc-loading-spinner')) {
                const newSpinner = createLoadingSpinner();
                document.body.insertBefore(newSpinner, document.body.firstChild);
            }
        }
    });

    // Helper to create loading spinner dynamically
    function createLoadingSpinner() {
        const overlay = document.createElement('div');
        overlay.id = 'cyc-loading-spinner';
        overlay.className = 'c-loading-overlay';
        overlay.innerHTML = `
            <div class="c-spinner-container">
                <div class="c-spinner-ring"></div>
                <div class="c-spinner-logo-base"></div>
                <div class="c-spinner-logo-orbit"></div>
                <div class="c-spinner-particle"></div>
                <div class="c-spinner-particle"></div>
                <div class="c-spinner-particle"></div>
                <div class="c-spinner-particle"></div>
                <div class="c-spinner-particle"></div>
                <div class="c-spinner-text">CARGANDO...</div>
            </div>
        `;
        return overlay;
    }

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

            // Add Light theme tiles for better visibility
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(map);

            // Default and hover colors - Colores de la empresa
            const defaultColor = '#434955'; // Gris empresa
            const hoverColor = '#FF6F27'; // Naranja empresa

            // Create custom icon using company logo (orange version)
            function createCustomIcon(id) {
                return L.divIcon({
                    className: 'custom-map-marker',
                    html: `<div class="logo-marker-container" id="marker-logo-${id}">
                        <img src="/imagenes/newLogoCyc.png" alt="CyC" style="width: 40px; height: 40px; filter: drop-shadow(0 3px 6px rgba(255,111,39,0.6));" />
                    </div>`,
                    iconSize: [40, 40],
                    iconAnchor: [20, 40], // Punto inferior del marcador (centro horizontal, parte inferior)
                    popupAnchor: [0, -40] // Popup arriba del marcador
                });
            }

            // Project locations - usar coordenadas del servidor (sin CORS)
            const projectCoords = window.cycThemeData?.projectCoords || {};
            
            const projectAddresses = [
                { slug: 'arenales-742', address: 'Arenales 742, Salta Capital, Argentina', title: 'Arenales 742' },
                { slug: 'guemes-1768', address: 'General Güemes 1768, Salta Capital, Argentina', title: 'General Güemes 1768' },
                { slug: 'guemes-1853', address: 'General Güemes 1853, Salta Capital, Argentina', title: 'General Güemes 1853' },
                { slug: 'libera', address: 'Leguizamón 2073 esq. Cnel. Suárez, Salta Capital, Argentina', title: 'Edificio Libera - Torre 1' },
                { slug: 'libera-torre2', address: 'Cnel. Suárez 486 esq. Leguizamón, Salta Capital, Argentina', title: 'Edificio Libera - Torre 2' },
                { slug: 'belgrano-office', address: 'Av. Belgrano 2131, Salta Capital, Argentina', title: 'Office Belgrano' },
                { slug: 'balcarce-2302', address: 'Balcarce 2302, Salta Capital, Argentina', title: 'Balcarce 2302' },
                { slug: 'balcarce-2320', address: 'Balcarce 2320, Salta Capital, Argentina', title: 'Balcarce 2320' },
                { slug: 'duplex-grand-bourg', address: 'Comodoro Rivadavia 3902, Salta Capital, Argentina', title: 'Comodoro Rivadavia 3902' },
                { slug: 'atocha', address: 'Pueblo Atocha M17 L2, Salta Capital, Argentina', title: 'Pueblo Atocha M17-L2' },
                { slug: 'portal-lesser', address: 'Barrio El Huaico, Zona Norte, Salta Capital, Argentina', title: 'Portal de Lesser' },
                { slug: 'galpon', address: 'Pasaje Pedriel 1005, Salta Capital, Argentina', title: 'Pje. Pedriel 1005' }
            ];

            // Usar coordenadas del servidor (ya geocodificadas, sin CORS)
            function getProjectCoords(slug) {
                if (projectCoords[slug]) {
                    // Asegurar que sean números, no strings
                    const lat = parseFloat(projectCoords[slug].lat);
                    const lng = parseFloat(projectCoords[slug].lng);
                    
                    // Validar que sean coordenadas válidas
                    if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
                        console.warn('Coordenadas inválidas para:', slug, projectCoords[slug]);
                        return null;
                    }
                    
                    return { lat, lng };
                }
                return null;
            }

            // Agregar marcadores al mapa usando coordenadas del servidor
            function addMarkersToMap() {
                const markers = [];
                let markerIndex = 0;
                
                for (const project of projectAddresses) {
                    const coords = getProjectCoords(project.slug);
                    if (coords) {
                        markerIndex++;
                        const currentIndex = markerIndex;
                        
                        // Create unique icons for each marker using logo
                        const defaultIcon = createCustomIcon(currentIndex);
                        
                        // Asegurar que las coordenadas sean números válidos
                        const lat = parseFloat(coords.lat);
                        const lng = parseFloat(coords.lng);
                        
                        if (isNaN(lat) || isNaN(lng)) {
                            console.error('Coordenadas inválidas para', project.slug, ':', coords);
                            continue;
                        }
                        
                        // Validar rango de coordenadas (Argentina está entre -55 y -22 lat, -73 y -53 lng)
                        if (lat < -55 || lat > -22 || lng < -73 || lng > -53) {
                            console.warn('Coordenadas fuera de rango para', project.slug, ':', lat, lng);
                        }
                        
                        console.log('Agregando marcador:', project.title, 'en', lat, lng, '(tipo:', typeof lat, typeof lng, ')');
                        
                        // Crear marcador con coordenadas explícitas como números
                        const marker = L.marker([Number(lat), Number(lng)], {
                            icon: defaultIcon,
                            draggable: false,
                            keyboard: true
                        });
                        
                        // Agregar al mapa explícitamente
                        marker.addTo(map);
                        
                        // Verificar que el marcador se agregó correctamente
                        const markerLatLng = marker.getLatLng();
                        console.log('Marcador creado en:', markerLatLng.lat, markerLatLng.lng, 'vs esperado:', lat, lng);

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
                                const imgElement = iconElement.querySelector('img');
                                
                                if (imgElement) {
                                    iconElement.style.cursor = 'pointer';
                                    
                                    // Handle hover directly on DOM element
                                    iconElement.addEventListener('mouseenter', function() {
                                        if (!popupIsOpen) {
                                            imgElement.style.transform = 'scale(1.2)';
                                            imgElement.style.filter = 'drop-shadow(0 4px 8px rgba(255,111,39,0.8))';
                                        }
                                    });
                                    
                                    iconElement.addEventListener('mouseleave', function() {
                                        if (!popupIsOpen) {
                                            imgElement.style.transform = 'scale(1)';
                                            imgElement.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))';
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
                                const imgElement = iconElement.querySelector('img');
                                if (imgElement) {
                                    imgElement.style.transform = 'scale(1.2)';
                                    imgElement.style.filter = 'drop-shadow(0 4px 8px rgba(255,111,39,0.8))';
                                }
                            }
                        });

                        marker.on('popupclose', function() {
                            popupIsOpen = false;
                            const iconElement = marker.getElement();
                            if (iconElement) {
                                const imgElement = iconElement.querySelector('img');
                                if (imgElement) {
                                    imgElement.style.transform = 'scale(1)';
                                    imgElement.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))';
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

            // Esperar a que el mapa esté completamente inicializado antes de agregar marcadores
            map.whenReady(function() {
                // Pequeño delay para asegurar que el mapa esté completamente renderizado
                setTimeout(function() {
                    addMarkersToMap();
                }, 100);
            });
        }
        
        // Initialize map when ready
        initMap();

        // Header scroll detection - cambiar fondo cuando se sale del hero
        const header = document.querySelector('.cyc-header');
        const heroSection = document.querySelector('.c-hero');
        
        function handleHeaderScroll() {
            if (!header) return;
            
            const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
            
            if (heroSection) {
                const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
                
                // Si estamos sobre el hero, header transparente
                if (scrollPosition < heroBottom - 100) {
                    header.classList.add('over-hero');
                    header.classList.remove('scrolled');
                } else {
                    // Después del hero, header con fondo
                    header.classList.remove('over-hero');
                    header.classList.add('scrolled');
                }
            } else {
                // Si no hay hero section, siempre mostrar fondo blanco (página de proyectos, etc.)
                header.classList.remove('over-hero');
                header.classList.add('scrolled');
            }
        }
        
        // Detectar sección activa para navegación
        function updateActiveNavLink() {
            const sections = document.querySelectorAll('[id^="nosotros"], [id^="servicios"], [id^="proyectos"], [id^="equipo"], [id^="ubicacion"]');
            const navLinks = document.querySelectorAll('.cyc-nav-link, .cyc-mobile-nav-link');
            
            let currentSection = '';
            const scrollPosition = window.pageYOffset + 150;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = section.id;
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + currentSection) {
                    link.classList.add('active');
                }
            });
        }
        
        // Función para inicializar el estado del header
        function initHeaderState() {
            if (!header) return;
            
            // Verificar si hay hero section
            if (heroSection) {
                // Si hay hero, empezar transparente (over-hero)
                header.classList.add('over-hero');
                header.classList.remove('scrolled');
            } else {
                // Si no hay hero (página de proyectos, etc.), empezar con fondo blanco
                header.classList.remove('over-hero');
                header.classList.add('scrolled');
            }
            // Ejecutar función para asegurar estado correcto
            handleHeaderScroll();
        }
        
        // Inicializar inmediatamente si DOM está listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initHeaderState);
        } else {
            // DOM ya está listo, ejecutar inmediatamente
            initHeaderState();
        }
        
        // También con jQuery por compatibilidad
        $(document).ready(initHeaderState);
        
        window.addEventListener('scroll', () => {
            handleHeaderScroll();
            updateActiveNavLink();
        }, { passive: true });
        
        // Servicios interactivos - Click para scroll a proyectos
        document.querySelectorAll('.c-service-card').forEach(card => {
            card.addEventListener('click', function() {
                const proyectosSection = document.querySelector('#proyectos');
                if (proyectosSection) {
                    const headerHeight = header ? header.offsetHeight : 80;
                    const targetPosition = proyectosSection.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Función para agregar horarios al calendario
        window.addToCalendar = function() {
            const startDate = new Date();
            startDate.setHours(9, 0, 0, 0);
            const endDate = new Date();
            endDate.setHours(18, 0, 0, 0);
            
            // Formato para Google Calendar
            const formatDate = (date) => {
                return date.toISOString().replace(/-|:|\.\d+/g, '');
            };
            
            const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Horarios+CyC+Emprendimientos&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=Lunes+a+Viernes:+9:00+–+18:00&location=Vicente+Lopez+477+3D,+Salta,+Argentina`;
            
            window.open(googleCalendarUrl, '_blank');
        };
        
        // Smooth scroll for on-page anchors
        $('a[href^="#"]').on('click', function(e) {
            const href = $(this).attr('href');
            if (href === '#' || href === '#!') return;
            
            const target = $(href);
            if (target.length) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 80;
                $('html, body').stop().animate({
                    scrollTop: target.offset().top - headerHeight
                }, 800, 'swing');
                
                // Cerrar menú móvil si está abierto
                const mobileMenu = document.querySelector('.cyc-mobile-menu');
                const hamburger = document.querySelector('.cyc-hamburger');
                if (mobileMenu && mobileMenu.classList.contains('is-open')) {
                    mobileMenu.classList.remove('is-open');
                    if (hamburger) {
                        hamburger.classList.remove('is-active');
                        hamburger.setAttribute('aria-expanded', 'false');
                    }
                    document.body.style.overflow = '';
                }
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
(function initCycCarousel(){
    const container = document.querySelector('.c-carousel-container');
    if (!container) return;

    const track   = container.querySelector('.c-carousel-track');
    const prevBtn = container.querySelector('.c-carousel-prev');
    const nextBtn = container.querySelector('.c-carousel-next');

    if (!track) return;

    // Obtener tarjetas - estrategia múltiple para manejar variaciones de WordPress
    let cards = [];
    
    // Estrategia 1: Hijos directos del track
    cards = Array.from(track.children).filter(card => {
        // Verificar si es un elemento <a> con la clase correcta
        if (card.tagName === 'A' && card.classList && card.classList.contains('c-project-card-grid')) {
            return true;
        }
        // También verificar elementos que contengan la clase aunque no sean hijos directos
        if (card.classList && card.classList.contains('c-project-card-grid')) {
            return true;
        }
        return false;
    });
    
    // Estrategia 2: Si no encontramos con children, buscar con querySelectorAll
    if (cards.length === 0) {
        const allCards = Array.from(track.querySelectorAll('.c-project-card-grid, .c-project-card-minimal'));
        // Filtrar duplicados y asegurar que sean hijos directos o elementos válidos
        const seen = new Set();
        cards = allCards.filter(card => {
            const projectId = card.getAttribute('data-project');
            
            // Verificar si es duplicado
            if (projectId && seen.has(projectId)) {
                return false;
            }
            
            // Verificar que sea hijo directo del track o un elemento <a> válido
            const isDirectChild = card.parentElement === track;
            const isValidCard = card.tagName === 'A' || card.querySelector('img, .c-project-card-image-grid');
            
            if (projectId) seen.add(projectId);
            
            return (isDirectChild || isValidCard) && projectId;
        });
    }
    
    // Estrategia 3: Buscar elementos <a> dentro del track que tengan data-project
    if (cards.length === 0) {
        const allLinks = track.querySelectorAll('a[data-project]');
        cards = Array.from(allLinks).filter(link => {
            return link.classList && (link.classList.contains('c-project-card-grid') || link.classList.contains('c-project-card-minimal'));
        });
    }
    
    // Eliminar duplicados basándose en data-project
    const uniqueCards = [];
    const seenProjects = new Set();
    cards.forEach(card => {
        const projectId = card.getAttribute('data-project');
        if (projectId && !seenProjects.has(projectId)) {
            seenProjects.add(projectId);
            uniqueCards.push(card);
        } else if (!projectId) {
            // Si no tiene data-project, usar el texto del h3 como identificador
            const h3 = card.querySelector('h3');
            const title = h3 ? h3.textContent.trim() : '';
            if (title && !seenProjects.has(title)) {
                seenProjects.add(title);
                uniqueCards.push(card);
            }
        }
    });
    cards = uniqueCards;

    // Si no hay tarjetas, no seguimos
    if (cards.length === 0) {
        console.error('CyC Carousel: No se encontraron tarjetas en el track');
        console.error('Track children:', track.children.length);
        console.error('Track children types:', Array.from(track.children).map(c => c.tagName + '.' + c.className));
        console.error('Track HTML (primeros 1000 chars):', track.innerHTML.substring(0, 1000));
        console.error('Container HTML:', container.innerHTML.substring(0, 500));
        
        // Intentar una última vez después de un delay
        setTimeout(() => {
            const retryCards = Array.from(track.querySelectorAll('a.c-project-card-grid, a.c-project-card-minimal, .c-project-card-grid[data-project], .c-project-card-minimal[data-project]'));
            if (retryCards.length > 0) {
                console.log('CyC Carousel: Reintentando inicialización después de delay...');
                // Reinicializar con las tarjetas encontradas
                location.reload(); // Recargar para reinicializar todo
            }
        }, 2000);
        return;
    }

    console.log('CyC Carousel: Encontradas', cards.length, 'tarjetas únicas');
    console.log('Tarjetas:', cards.map(c => c.getAttribute('data-project') || c.querySelector('h3')?.textContent || 'sin título'));

    // Medidas fijas (deben coincidir con CSS)
    const CARD_W = 350;
    const GAP = 24;
    const STEP = CARD_W + GAP;

    // Asegurar que todas las tarjetas tengan el ancho correcto y estructura completa
    cards.forEach((card, index) => {
        // Estilos de tamaño - aplicar con !important usando setProperty
        card.style.setProperty('width', CARD_W + 'px', 'important');
        card.style.setProperty('min-width', CARD_W + 'px', 'important');
        card.style.setProperty('max-width', CARD_W + 'px', 'important');
        card.style.setProperty('flex-shrink', '0', 'important');
        
        // Estilos de layout para evitar que se dividan
        card.style.setProperty('display', 'flex', 'important');
        card.style.setProperty('flex-direction', 'column', 'important');
        card.style.setProperty('box-sizing', 'border-box', 'important');
        card.style.setProperty('position', 'relative', 'important');
        card.style.setProperty('margin', '0', 'important');
        card.style.setProperty('padding', '0', 'important');
        card.style.setProperty('overflow', 'hidden', 'important');
        
        // Asegurar que la tarjeta mantenga su estructura completa
        const img = card.querySelector('img, .c-project-card-image-grid');
        const content = card.querySelector('.c-project-card-content-grid');
        
        if (img) {
            img.style.setProperty('flex-shrink', '0', 'important');
            img.style.setProperty('width', '100%', 'important');
            img.style.setProperty('height', '250px', 'important');
            img.style.setProperty('object-fit', 'cover', 'important');
            img.style.setProperty('display', 'block', 'important');
            img.style.setProperty('margin', '0', 'important');
            img.style.setProperty('padding', '0', 'important');
        }
        
        if (content) {
            content.style.setProperty('flex', '1 1 auto', 'important');
            content.style.setProperty('display', 'flex', 'important');
            content.style.setProperty('flex-direction', 'column', 'important');
            content.style.setProperty('width', '100%', 'important');
            content.style.setProperty('box-sizing', 'border-box', 'important');
            content.style.setProperty('margin', '0', 'important');
        }
        
        // Asegurar que todos los hijos directos mantengan la estructura
        Array.from(card.children).forEach(child => {
            if (child.classList && child.classList.contains('c-project-card-content-grid')) {
                child.style.setProperty('display', 'flex', 'important');
                child.style.setProperty('flex-direction', 'column', 'important');
            }
        });
        
        console.log(`Tarjeta ${index + 1} (${card.getAttribute('data-project')}):`, {
            width: card.offsetWidth,
            height: card.offsetHeight,
            hasImg: !!img,
            hasContent: !!content,
            children: card.children.length
        });
    });

    // Limpiar cualquier tarjeta duplicada que pueda estar en el DOM
    // Mantener solo las tarjetas únicas que encontramos
    const allTrackChildren = Array.from(track.children);
    allTrackChildren.forEach(child => {
        if (!cards.includes(child)) {
            // Si este hijo no está en nuestra lista de tarjetas únicas, podría ser un duplicado
            // Pero solo lo eliminamos si tiene la clase y es un duplicado real
            if (child.classList && child.classList.contains('c-project-card-grid')) {
                const projectId = child.getAttribute('data-project');
                const isDuplicate = cards.some(card => card.getAttribute('data-project') === projectId);
                if (isDuplicate) {
                    console.log('Eliminando tarjeta duplicada:', projectId);
                    child.remove();
                }
            }
        }
    });

    // Crear clones para loop infinito
    // Clonar todas las tarjetas al final para crear efecto infinito
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.style.width = CARD_W + 'px';
        clone.style.minWidth = CARD_W + 'px';
        clone.style.maxWidth = CARD_W + 'px';
        clone.style.flexShrink = '0';
        track.appendChild(clone);
    });

    // Variables de control
    let currentIndex = 0;
    let autoPlayInterval = null;
    let isPaused = false;
    const AUTO_PLAY_SPEED = 3000; // 3 segundos entre transiciones
    const wrapper = container.querySelector('.c-carousel-wrapper');
    const wrapperWidth = wrapper ? wrapper.clientWidth : container.clientWidth;
    const visibleCount = Math.max(1, Math.floor(wrapperWidth / STEP));
    const totalCards = cards.length;
    const totalWidth = totalCards * STEP;

    function applyTransform(instant = false) {
        const offset = -(STEP * currentIndex);
        if (instant) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.4s ease'; // Reducido de 0.6s a 0.4s (33% más rápido)
        }
        track.style.transform = `translateX(${offset}px)`;
    }

    function goNext() {
        currentIndex++;
        
        // Si llegamos al final de las tarjetas originales, resetear sin transición
        if (currentIndex >= totalCards) {
            currentIndex = 0;
            applyTransform(true);
            // Forzar reflow para que el navegador procese el cambio
            void track.offsetWidth;
            // Aplicar la nueva posición con transición
            setTimeout(() => {
                applyTransform(false);
            }, 10);
        } else {
            applyTransform(false);
        }
    }

    function goPrev() {
        currentIndex--;
        
        // Si estamos al inicio, saltar al final de los clones sin transición
        if (currentIndex < 0) {
            currentIndex = totalCards - 1;
            applyTransform(true);
            // Forzar reflow
            void track.offsetWidth;
            // Aplicar la nueva posición con transición
            setTimeout(() => {
                applyTransform(false);
            }, 10);
        } else {
            applyTransform(false);
        }
    }

    // Auto-play infinito
    function startAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
        
        autoPlayInterval = setInterval(() => {
            if (!isPaused) {
                goNext();
            }
        }, AUTO_PLAY_SPEED);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    // Pausar al hacer hover
    container.addEventListener('mouseenter', () => {
        isPaused = true;
    });

    container.addEventListener('mouseleave', () => {
        isPaused = false;
    });

    // Navegación manual con botones
    prevBtn?.addEventListener('click', e => { 
        e.preventDefault(); 
        e.stopPropagation();
        // Pausar temporalmente el auto-play
        const wasPaused = isPaused;
        isPaused = true;
        goPrev();
        // Reanudar después de un momento
        setTimeout(() => {
            isPaused = wasPaused;
        }, AUTO_PLAY_SPEED);
    });
    
    nextBtn?.addEventListener('click', e => { 
        e.preventDefault(); 
        e.stopPropagation();
        // Pausar temporalmente el auto-play
        const wasPaused = isPaused;
        isPaused = true;
        goNext();
        // Reanudar después de un momento
        setTimeout(() => {
            isPaused = wasPaused;
        }, AUTO_PLAY_SPEED);
    });

    // ============================================
    // SWIPE/TOUCH SUPPORT FOR MOBILE
    // ============================================
    let touchStartX = 0;
    let touchStartY = 0;
    let touchCurrentX = 0;
    let isDragging = false;
    let startOffset = 0;
    let touchStartTime = 0;
    let hasSwiped = false; // Para prevenir clicks en links después de un swipe
    const SWIPE_THRESHOLD = 50; // Mínimo de píxeles para considerar un swipe
    const SWIPE_MIN_DISTANCE = 30; // Distancia mínima para swipe rápido

    // Obtener el offset actual del track
    function getCurrentOffset() {
        const transform = track.style.transform || 'translateX(0px)';
        const match = transform.match(/translateX\((-?\d+\.?\d*)px\)/);
        return match ? parseFloat(match[1]) : 0;
    }

    // Touch start
    track.addEventListener('touchstart', (e) => {
        // Pausar auto-play mientras se interactúa
        isPaused = true;
        stopAutoPlay();
        
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartTime = Date.now();
        startOffset = getCurrentOffset();
        isDragging = true;
        hasSwiped = false; // Resetear flag de swipe
        
        // Prevenir scroll mientras se arrastra
        track.style.transition = 'none';
    }, { passive: true });

    // Touch move
    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const touch = e.touches[0];
        touchCurrentX = touch.clientX;
        const deltaX = touchCurrentX - touchStartX;
        const deltaY = Math.abs(touch.clientY - touchStartY);
        
        // Solo permitir swipe horizontal si el movimiento horizontal es mayor que el vertical
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
            e.preventDefault(); // Prevenir scroll vertical
            const newOffset = startOffset + deltaX;
            track.style.transform = `translateX(${newOffset}px)`;
        }
    }, { passive: false });

    // Touch end
    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        isDragging = false;
        const touchEndTime = Date.now();
        const touchDuration = touchEndTime - touchStartTime;
        const deltaX = touchCurrentX - touchStartX;
        const deltaY = Math.abs(touchStartY - (e.changedTouches[0]?.clientY || touchStartY));
        const distance = Math.abs(deltaX);
        
        // Calcular velocidad (píxeles por milisegundo)
        const velocity = distance / touchDuration;
        
        // Determinar si fue un swipe válido
        // 1. Swipe con distancia suficiente
        const hasMinimumDistance = distance > SWIPE_THRESHOLD;
        // 2. Swipe rápido con menos distancia
        const isFastSwipe = velocity > 0.3 && distance > SWIPE_MIN_DISTANCE;
        // 3. El movimiento horizontal debe ser mayor que el vertical
        const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
        
        if ((hasMinimumDistance || isFastSwipe) && isHorizontalSwipe) {
            hasSwiped = true; // Marcar que hubo un swipe
            // Swipe a la izquierda (siguiente)
            if (deltaX < 0) {
                goNext();
            }
            // Swipe a la derecha (anterior)
            else {
                goPrev();
            }
        } else {
            // No fue un swipe válido, volver a la posición actual
            applyTransform(false);
        }
        
        // Restaurar transición
        track.style.transition = 'transform 0.4s ease';
        
        // Prevenir clicks en links si hubo un swipe
        if (hasSwiped) {
            const links = track.querySelectorAll('a');
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }, { once: true, capture: true });
            });
            
            // Resetear el flag después de un momento
            setTimeout(() => {
                hasSwiped = false;
            }, 300);
        }
        
        // Reanudar auto-play después de un momento
        setTimeout(() => {
            isPaused = false;
            startAutoPlay();
        }, AUTO_PLAY_SPEED);
    }, { passive: true });

    // Cancelar drag si el usuario sale del área
    track.addEventListener('touchcancel', () => {
        if (isDragging) {
            isDragging = false;
            applyTransform(false);
            track.style.transition = 'transform 0.4s ease';
            setTimeout(() => {
                isPaused = false;
                startAutoPlay();
            }, AUTO_PLAY_SPEED);
        }
    }, { passive: true });

    // Recalcular en resize
    function recalc() {
        const newWrapperWidth = wrapper ? wrapper.clientWidth : container.clientWidth;
        const newVisibleCount = Math.max(1, Math.floor(newWrapperWidth / STEP));
        // No necesitamos maxIndex para loop infinito
        applyTransform(false);
    }

    // Recalcular en resize
    window.addEventListener('resize', () => {
        clearTimeout(window.__cycCarouselResize);
        window.__cycCarouselResize = setTimeout(recalc, 150);
    });

    // Inicializar después de que el DOM esté completamente cargado y las imágenes estén listas
    function initCarousel() {
        // Esperar a que todas las imágenes se carguen
        const images = track.querySelectorAll('img');
        let imagesLoaded = 0;
        
        if (images.length === 0) {
            // No hay imágenes, inicializar inmediatamente
            setTimeout(() => {
                recalc();
                startAutoPlay();
            }, 100);
            return;
        }
        
        const checkImagesLoaded = () => {
            imagesLoaded++;
            if (imagesLoaded === images.length) {
                // Todas las imágenes cargadas, inicializar carousel
                setTimeout(() => {
                    recalc();
                    startAutoPlay(); // Iniciar auto-play después de que todo esté listo
                }, 50);
            }
        };
        
        images.forEach(img => {
            if (img.complete) {
                checkImagesLoaded();
            } else {
                img.addEventListener('load', checkImagesLoaded);
                img.addEventListener('error', checkImagesLoaded); // Continuar aunque falle
            }
        });
        
        // Timeout de seguridad: inicializar después de 2 segundos máximo
        setTimeout(() => {
            if (imagesLoaded < images.length) {
                console.warn('CyC Carousel: Algunas imágenes no cargaron, inicializando de todas formas');
                recalc();
                startAutoPlay();
            }
        }, 2000);
    }
    
    // Inicializar el carousel - múltiples estrategias para asegurar que funcione
    let initAttempted = false;
    
    function ensureInit() {
        // Evitar múltiples inicializaciones
        if (initAttempted) return;
        
        // Verificar que el contenedor y track existan y tengan contenido
        if (!container || !track || track.children.length === 0) {
            // Si no está listo, intentar de nuevo (máximo 10 intentos)
            if (ensureInit.attempts === undefined) ensureInit.attempts = 0;
            ensureInit.attempts++;
            if (ensureInit.attempts < 10) {
                setTimeout(ensureInit, 200);
            }
            return;
        }
        
        // Verificar que tengamos tarjetas válidas
        const currentCards = Array.from(track.children).filter(card => {
            return card.classList && (card.classList.contains('c-project-card-grid') || card.classList.contains('c-project-card-minimal'));
        });
        
        if (currentCards.length === 0) {
            // Si no hay tarjetas aún, esperar un poco más
            if (ensureInit.attempts === undefined) ensureInit.attempts = 0;
            ensureInit.attempts++;
            if (ensureInit.attempts < 10) {
                setTimeout(ensureInit, 200);
            }
            return;
        }
        
        // Si llegamos aquí, tenemos todo lo necesario
        initAttempted = true;
        initCarousel();
    }
    
    // Estrategia 1: Si el DOM ya está listo
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(ensureInit, 100);
    } 
    // Estrategia 2: Esperar a DOMContentLoaded
    else if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(ensureInit, 100);
        });
    }
    // Estrategia 3: Fallback con window.onload
    else {
        window.addEventListener('load', () => {
            setTimeout(ensureInit, 100);
        });
    }
    
    // También intentar después de un delay adicional (por si el contenido se carga dinámicamente)
    setTimeout(ensureInit, 500);
    
    // Limpiar intervalo al salir de la página
    window.addEventListener('beforeunload', () => {
        stopAutoPlay();
    });
})();
  

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

        // Image & Video Modal for Project Detail Pages
        const imageModal = document.getElementById('c-image-modal');
        const modalImage = document.getElementById('c-modal-image');
        const modalVideo = document.getElementById('c-modal-video');
        const modalClose = document.querySelector('.c-modal-close');
        const modalPrev = document.querySelector('.c-modal-prev');
        const modalNext = document.querySelector('.c-modal-next');
        const modalCurrent = document.getElementById('c-modal-current');
        const modalTotal = document.getElementById('c-modal-total');
        const galleryItems = document.querySelectorAll('.c-project-gallery-item');
        
        let currentMediaIndex = 0;
        let mediaItems = [];

        // Collect all media items (images and videos) and apply dynamic grid layout
        if (galleryItems.length > 0) {
            galleryItems.forEach(item => {
                const mediaType = item.getAttribute('data-media-type') || 'image';
                const mediaUrl = item.getAttribute('data-media-url') || item.getAttribute('data-image-url');
                if (mediaUrl) {
                    mediaItems.push({
                        type: mediaType,
                        url: mediaUrl
                    });
                }
            });
            if (modalTotal) {
                modalTotal.textContent = mediaItems.length;
            }

            // Apply dynamic grid layout based on media count
            const galleryGrid = document.querySelector('.c-project-gallery-grid');
            if (galleryGrid) {
                const mediaCount = galleryItems.length;
                galleryGrid.setAttribute('data-count', mediaCount);
                
                // Add staggered fade-in animation for gallery items
                galleryItems.forEach((item, index) => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 80);
                });

                console.log(`Dynamic gallery initialized with ${mediaCount} media items`);
            }
        }

        // Open modal with media (image or video)
        function openModal(index) {
            if (!imageModal || mediaItems.length === 0) return;
            
            currentMediaIndex = index;
            updateModalMedia();
            imageModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }

        // Close modal
        function closeModal() {
            if (!imageModal) return;
            if (modalVideo) {
                modalVideo.pause();
                modalVideo.currentTime = 0;
            }
            imageModal.style.display = 'none';
            document.body.style.overflow = '';
        }

        // Update modal media (image or video)
        function updateModalMedia() {
            if (mediaItems.length === 0) return;
            
            if (currentMediaIndex < 0) {
                currentMediaIndex = mediaItems.length - 1;
            } else if (currentMediaIndex >= mediaItems.length) {
                currentMediaIndex = 0;
            }
            
            const currentMedia = mediaItems[currentMediaIndex];
            
            if (currentMedia.type === 'video') {
                // Show video, hide image
                if (modalImage) modalImage.style.display = 'none';
                if (modalVideo) {
                    modalVideo.style.display = 'block';
                    modalVideo.querySelector('source').src = currentMedia.url;
                    modalVideo.load();
                }
            } else {
                // Show image, hide video
                if (modalVideo) {
                    modalVideo.pause();
                    modalVideo.currentTime = 0;
                    modalVideo.style.display = 'none';
                }
                if (modalImage) {
                    modalImage.style.display = 'block';
                    modalImage.src = currentMedia.url;
                }
            }
            
            if (modalCurrent) {
                modalCurrent.textContent = currentMediaIndex + 1;
            }
        }

        // Navigate to previous media
        function prevMedia() {
            if (modalVideo) modalVideo.pause();
            currentMediaIndex--;
            updateModalMedia();
        }

        // Navigate to next media
        function nextMedia() {
            if (modalVideo) modalVideo.pause();
            currentMediaIndex++;
            updateModalMedia();
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
            modalPrev.addEventListener('click', prevMedia);
        }

        if (modalNext) {
            modalNext.addEventListener('click', nextMedia);
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
                    prevMedia();
                } else if (e.key === 'ArrowRight') {
                    nextMedia();
                }
            }
        });

        // Console log to confirm script loaded
        console.log('CyC Emprendimientos - Child Theme Scripts Loaded');
        console.log('Project filters and sliders initialized');

        // ============================================
        // CUSTOM CYC HEADER - HAMBURGER MENU
        // ============================================
        
        const hamburger = document.querySelector('.cyc-hamburger');
        const mobileMenu = document.querySelector('.cyc-mobile-menu');
        const body = document.body;

        if (hamburger && mobileMenu) {
            // Toggle mobile menu
            hamburger.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const isOpen = mobileMenu.classList.contains('is-open');
                
                if (isOpen) {
                    // Close menu
                    mobileMenu.classList.remove('is-open');
                    hamburger.classList.remove('is-active');
                    hamburger.setAttribute('aria-expanded', 'false');
                    body.style.overflow = '';
                } else {
                    // Open menu
                    mobileMenu.classList.add('is-open');
                    hamburger.classList.add('is-active');
                    hamburger.setAttribute('aria-expanded', 'true');
                    body.style.overflow = 'hidden';
                }
            });

            // Close menu when clicking on a link inside mobile menu
            const mobileMenuLinks = mobileMenu.querySelectorAll('a');
            mobileMenuLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mobileMenu.classList.remove('is-open');
                    hamburger.classList.remove('is-active');
                    hamburger.setAttribute('aria-expanded', 'false');
                    body.style.overflow = '';
                });
            });

            // Close menu on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
                    mobileMenu.classList.remove('is-open');
                    hamburger.classList.remove('is-active');
                    hamburger.setAttribute('aria-expanded', 'false');
                    body.style.overflow = '';
                }
            });

            // Close menu on window resize (if switching to desktop)
            let resizeTimer;
            window.addEventListener('resize', function() {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function() {
                    if (window.innerWidth > 768 && mobileMenu.classList.contains('is-open')) {
                        mobileMenu.classList.remove('is-open');
                        hamburger.classList.remove('is-active');
                        hamburger.setAttribute('aria-expanded', 'false');
                        body.style.overflow = '';
                    }
                }, 250);
            });

            console.log('CyC Header - Hamburger menu initialized');
        }
    });

})(jQuery);

