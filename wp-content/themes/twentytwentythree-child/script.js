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
                    iconAnchor: [16, 40], // Punto inferior del marcador (centro horizontal, parte inferior)
                    popupAnchor: [0, -40] // Popup arriba del marcador
                });
            }

            // Project locations - usar coordenadas del servidor (sin CORS)
            const projectCoords = window.cycThemeData?.projectCoords || {};
            
            const projectAddresses = [
                { slug: 'arenales-742', address: 'Arenales 742, Salta, Argentina', title: 'Arenales 742' },
                { slug: 'guemes-1768', address: 'Güemes 1768, Salta, Argentina', title: 'Güemes 1768' },
                { slug: 'guemes-1853', address: 'Güemes 1853, Salta, Argentina', title: 'Güemes 1853' },
                { slug: 'libera', address: 'Leguizamón 2073, Salta, Argentina', title: 'Edificio Libera' },
                { slug: 'belgrano-office', address: 'Belgrano 2131, Salta, Argentina', title: 'Edificio Belgrano Office' },
                { slug: 'balcarce-2302', address: 'Balcarce 2302, Salta, Argentina', title: 'Balcarce 2302' },
                { slug: 'duplex-grand-bourg', address: 'Grand Bourg, Buenos Aires, Argentina', title: 'Duplex Grand Bourg' }
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
                        
                        // Create unique icons for each marker with ID
                        const defaultIcon = createCustomIcon(defaultColor, currentIndex);
                        const hoverIcon = createCustomIcon(hoverColor, currentIndex);
                        
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
        const allCards = Array.from(track.querySelectorAll('.c-project-card-grid'));
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
            return link.classList && link.classList.contains('c-project-card-grid');
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
            const retryCards = Array.from(track.querySelectorAll('a.c-project-card-grid, .c-project-card-grid[data-project]'));
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
            return card.classList && card.classList.contains('c-project-card-grid');
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

