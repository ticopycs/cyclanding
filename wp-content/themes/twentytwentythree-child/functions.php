<?php
/**
 * Twenty Twenty-Three Child Theme Functions
 */

// Exit if accessed directly
if (!defined('ABSPATH')) exit;

/**
 * Enqueue parent and child theme styles
 */
function twentytwentythree_child_enqueue_styles() {
    // Enqueue parent theme stylesheet
    wp_enqueue_style(
        'twentytwentythree-style',
        get_template_directory_uri() . '/style.css',
        array(),
        wp_get_theme()->parent()->get('Version')
    );

    // Google Fonts: Montserrat (Gotham alternative)
    wp_enqueue_style(
        'child-google-fonts',
        'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap',
        array(),
        null
    );

    // Enqueue child theme stylesheet
    wp_enqueue_style(
        'twentytwentythree-child-style',
        get_stylesheet_uri(),
        array('twentytwentythree-style', 'child-google-fonts'),
        filemtime(get_stylesheet_directory() . '/style.css')
    );

    // Enqueue Leaflet CSS and JS for interactive maps (load first) - Latest version
    wp_enqueue_style(
        'leaflet-css',
        'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
        array(),
        '1.9.4'
    );
    wp_enqueue_script(
        'leaflet-js',
        'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
        array(),
        '1.9.4',
        false
    );

    // Enqueue child theme JavaScript (depends on Leaflet)
    $script_version = filemtime(get_stylesheet_directory() . '/script.js');
    wp_enqueue_script(
        'twentytwentythree-child-script',
        get_stylesheet_directory_uri() . '/script.js?v=' . $script_version,
        array('jquery', 'leaflet-js'),
        $script_version,
        true
    );
}
add_action('wp_enqueue_scripts', 'twentytwentythree_child_enqueue_styles', 20);

/**
 * Remove default WordPress theme supports that conflict with custom design
 */
function twentytwentythree_child_setup() {
    // Remove default post title display
    remove_theme_support('title-tag');
}
add_action('after_setup_theme', 'twentytwentythree_child_setup', 11);

/**
 * Remove WordPress branding and generator tags
 */
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wp_shortlink_wp_head');
add_filter('get_the_generator_html', '__return_empty_string');
add_filter('get_the_generator_xhtml', '__return_empty_string');
add_filter('the_generator', '__return_empty_string');

/**
 * Remove WordPress version from scripts and styles
 */
function twentytwentythree_child_remove_wp_version($src) {
    global $wp_version;
    parse_str(parse_url($src, PHP_URL_QUERY), $query);
    if (!empty($query['ver']) && $query['ver'] === $wp_version) {
        $src = remove_query_arg('ver', $src);
    }
    return $src;
}
add_filter('script_loader_src', 'twentytwentythree_child_remove_wp_version');
add_filter('style_loader_src', 'twentytwentythree_child_remove_wp_version');

/**
 * Hide WordPress branding in admin footer
 */
add_filter('admin_footer_text', '__return_empty_string', 11);
add_filter('update_footer', '__return_empty_string', 11);

/**
 * Change site title to CyC Emprendimientos
 */
add_filter('bloginfo', function($output, $show) {
    if ($show === 'name') {
        return 'CyC Emprendimientos';
    }
    return $output;
}, 10, 2);

add_filter('bloginfo_url', function($output, $show) {
    if ($show === 'name') {
        return 'CyC Emprendimientos';
    }
    return $output;
}, 10, 2);

add_filter('get_bloginfo', function($output, $show) {
    if ($show === 'name') {
        return 'CyC Emprendimientos';
    }
    return $output;
}, 10, 2);


/**
 * Add header elements: Projects button and social icons
 * Structure: LOGO (larger) + TITLE | Projects Button | Social Icons
 */
add_action('wp_head', function() {
    ?>
    <script>
    (function() {
        // Run immediately and on DOMContentLoaded
        function initHeader() {
            // Hide default WordPress header on project pages
            const isProjectPage = document.body.classList.contains('single-cyc-project');
            if (isProjectPage) {
                // Hide default WordPress header elements
                const defaultHeader = document.getElementById('header');
                const headerImg = document.getElementById('headerimg');
                const defaultBanner = document.querySelector('header[role="banner"]:not(.wp-block-template-part)');
                
                if (defaultHeader) defaultHeader.style.display = 'none';
                if (headerImg) headerImg.style.display = 'none';
                if (defaultBanner) defaultBanner.style.display = 'none';
                
                // Ensure correct header is visible and sticky
                const header = document.querySelector('.wp-block-template-part:first-child');
                if (header) {
                    header.style.display = 'block';
                    header.style.visibility = 'visible';
                    header.style.height = 'auto';
                    header.classList.add('header-sticky');
                    document.body.classList.add('header-sticky-active');
                }
            }
            
            const headerGroup = document.querySelector('.wp-block-template-part:first-child .wp-block-group');
            if (!headerGroup) {
                // Retry if header not ready
                setTimeout(initHeader, 100);
                return;
            }
            
            headerGroup.style.position = 'relative';
            headerGroup.style.display = 'flex';
            headerGroup.style.alignItems = 'center';
            headerGroup.style.justifyContent = 'space-between';
            
            // Ensure logo links to homepage and set correct title
            const siteTitle = headerGroup.querySelector('.wp-block-site-title a');
            if (siteTitle) {
                if (!siteTitle.getAttribute('href')) {
                    siteTitle.href = '<?php echo esc_js(home_url('/')); ?>';
                }
                // Change title text if it says "WordPress"
                const titleText = siteTitle.textContent.trim();
                if (titleText === 'WordPress' || titleText === '') {
                    // Find text nodes and replace
                    const walker = document.createTreeWalker(
                        siteTitle,
                        NodeFilter.SHOW_TEXT,
                        null,
                        false
                    );
                    let textNode;
                    while (textNode = walker.nextNode()) {
                        if (textNode.textContent.trim() === 'WordPress' || textNode.textContent.trim() === '') {
                            textNode.textContent = 'CyC Emprendimientos';
                        }
                    }
                    // Also check for any span/div elements with text
                    const textElements = siteTitle.querySelectorAll('span, div, em, strong');
                    textElements.forEach(el => {
                        if (el.textContent.trim() === 'WordPress' || el.textContent.trim() === '') {
                            el.textContent = 'CyC Emprendimientos';
                        }
                    });
                    // If no text found, add it
                    if (siteTitle.textContent.trim() === '' || siteTitle.textContent.trim() === 'WordPress') {
                        const titleSpan = document.createElement('span');
                        titleSpan.textContent = 'CyC Emprendimientos';
                        titleSpan.style.marginLeft = '20px';
                        siteTitle.appendChild(titleSpan);
                    }
                }
            }
            
            // Hide default navigation menu
            const nav = headerGroup.querySelector('.wp-block-navigation');
            if (nav) {
                nav.style.display = 'none';
            }
            
            // Add Projects button if it doesn't exist
            if (!document.querySelector('.c-header-projects-btn')) {
                const projectsBtn = document.createElement('a');
                projectsBtn.href = '/proyectos';
                projectsBtn.className = 'c-header-projects-btn';
                projectsBtn.textContent = 'PROYECTOS';
                projectsBtn.style.marginLeft = 'auto';
                projectsBtn.style.marginRight = '10px';
                headerGroup.appendChild(projectsBtn);
            }
            
            // Add social icons if they don't exist
            if (!document.querySelector('.c-header-social')) {
                const socialContainer = document.createElement('div');
                socialContainer.className = 'c-header-social';
                socialContainer.style.display = 'flex';
                socialContainer.style.gap = '15px';
                socialContainer.style.alignItems = 'center';
                
                // WhatsApp icon
                const whatsappIcon = document.createElement('a');
                whatsappIcon.href = 'https://wa.me/5493875058555';
                whatsappIcon.target = '_blank';
                whatsappIcon.className = 'c-social-icon whatsapp';
                whatsappIcon.innerHTML = '<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';
                
                // Instagram icon
                const instagramIcon = document.createElement('a');
                instagramIcon.href = 'https://www.instagram.com/cycsalta';
                instagramIcon.target = '_blank';
                instagramIcon.className = 'c-social-icon instagram';
                instagramIcon.innerHTML = '<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>';
                
                socialContainer.appendChild(whatsappIcon);
                socialContainer.appendChild(instagramIcon);
                headerGroup.appendChild(socialContainer);
            }
        }
        
        // Run immediately
        if (document.body) {
            initHeader();
        } else {
            document.addEventListener('DOMContentLoaded', initHeader);
        }
    })();
    </script>
    <?php
});

add_action('wp_footer', function() {
    ?>
    <script>
    // Ensure header elements are added even if wp_head didn't catch them
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            const headerGroup = document.querySelector('.wp-block-template-part:first-child .wp-block-group');
            if (headerGroup && !document.querySelector('.c-header-projects-btn')) {
                // Re-run header initialization
                const projectsBtn = document.createElement('a');
                projectsBtn.href = '/proyectos';
                projectsBtn.className = 'c-header-projects-btn';
                projectsBtn.textContent = 'PROYECTOS';
                projectsBtn.style.marginLeft = 'auto';
                projectsBtn.style.marginRight = '10px';
                headerGroup.appendChild(projectsBtn);
                
                if (!document.querySelector('.c-header-social')) {
                    const socialContainer = document.createElement('div');
                    socialContainer.className = 'c-header-social';
                    socialContainer.style.display = 'flex';
                    socialContainer.style.gap = '15px';
                    socialContainer.style.alignItems = 'center';
                    
                    const whatsappIcon = document.createElement('a');
                    whatsappIcon.href = 'https://wa.me/5493875058555';
                    whatsappIcon.target = '_blank';
                    whatsappIcon.className = 'c-social-icon whatsapp';
                    whatsappIcon.innerHTML = '<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';
                    
                    const instagramIcon = document.createElement('a');
                    instagramIcon.href = 'https://www.instagram.com/cycsalta';
                    instagramIcon.target = '_blank';
                    instagramIcon.className = 'c-social-icon instagram';
                    instagramIcon.innerHTML = '<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>';
                    
                    socialContainer.appendChild(whatsappIcon);
                    socialContainer.appendChild(instagramIcon);
                    headerGroup.appendChild(socialContainer);
                }
            }
        }, 500);
    });
    </script>
    <?php
});

/**
 * Project catalog shared between front-end components
 *
 * @return array[]
 */
function cyc_child_get_projects_data(): array {
    $whatsapp_base = 'https://wa.me/5493875058555?text=';
    // Construir base URL sin codificar, luego codificar solo las partes del path que tienen espacios
    $uploads_base = home_url('/imagenes/');
    
    $projects = [
        'arenales-742' => [
            'slug' => 'arenales-742',
            'title' => 'Arenales 742',
            'description' => 'Torre de 8 pisos que ofrece unidades que van de monoambientes a departamentos de 1 y 2 dormitorios. Con excelentes vistas de la ciudad de salta',
            'excerpt' => 'Torre de 8 pisos que ofrece unidades que van de monoambientes a departamentos de 1 y 2 dormitorios.',
            'type' => 'Residencial',
            'location' => 'Arenales 742, Salta',
            'stage' => 'finalizado',
            'stage_label' => 'Finalizado',
            'availability' => 'agotado',
            'availability_label' => 'Unidades agotadas',
            'badge_class' => 'c-badge-soldout',
            'primary_image' => $uploads_base . rawurlencode('arenales 742') . '/' . rawurlencode('Arenales 742.jpg'),
            'hero_images' => [
                $uploads_base . rawurlencode('arenales 742') . '/' . rawurlencode('Arenales 742.jpg'),
                $uploads_base . rawurlencode('arenales 742') . '/' . rawurlencode('arenales 742(1).jpg'),
                $uploads_base . rawurlencode('arenales 742') . '/' . rawurlencode('arenales 742(2).jpg'),
            ],
            'gallery' => [
                $uploads_base . rawurlencode('arenales 742') . '/' . rawurlencode('Arenales 742.jpg'),
                $uploads_base . rawurlencode('arenales 742') . '/' . rawurlencode('arenales 742(1).jpg'),
                $uploads_base . rawurlencode('arenales 742') . '/' . rawurlencode('arenales 742(2).jpg'),
                $uploads_base . rawurlencode('arenales 742') . '/arenales.jpg',
            ],
            'characteristics' => [
                'Amenities',
                'Cocheras',
                'Ubicación estratégica',
                'Construcción tradicional',
            ],
            'metrics' => [
                ['label' => 'Finalización', 'value' => '2023'],
                ['label' => 'Unidades', 'value' => '24'],
                ['label' => 'Pisos', 'value' => '8'],
            ],
            'highlights' => [
                'Excelentes vistas de la ciudad de Salta',
                'Unidades desde monoambientes hasta 2 dormitorios',
                'Amenities y cocheras incluidas',
            ],
            'has_video' => true,
            'video_url' => '', // Video removido
            'investment_link' => $whatsapp_base . rawurlencode('Hola! Quiero información sobre Arenales 742 o proyectos similares'),
        ],
        'guemes-1768' => [
            'slug' => 'guemes-1768',
            'title' => 'Güemes 1768',
            'description' => 'Torre de 6 pisos que ofrece unidades de 1 dormitorio amplias. Con terminaciones de calidad premium y estética moderna.',
            'excerpt' => 'Torre de 6 pisos que ofrece unidades de 1 dormitorio amplias.',
            'type' => 'Residencial',
            'location' => 'Güemes 1768, Salta',
            'stage' => 'finalizado',
            'stage_label' => 'Finalizado',
            'availability' => 'agotado',
            'availability_label' => 'Unidades agotadas',
            'badge_class' => 'c-badge-soldout',
            'primary_image' => $uploads_base . rawurlencode('guemes 1768') . '/' . rawurlencode('guemes 1768.jpg'),
            'hero_images' => [
                $uploads_base . rawurlencode('guemes 1768') . '/' . rawurlencode('guemes 1768.jpg'),
                $uploads_base . rawurlencode('guemes 1768') . '/' . rawurlencode('guemes 1768(1).jpg'),
                $uploads_base . rawurlencode('guemes 1768') . '/guemes1768.jpg',
            ],
            'gallery' => [
                $uploads_base . rawurlencode('guemes 1768') . '/' . rawurlencode('guemes 1768.jpg'),
                $uploads_base . rawurlencode('guemes 1768') . '/' . rawurlencode('guemes 1768(1).jpg'),
                $uploads_base . rawurlencode('guemes 1768') . '/guemes1768.jpg',
            ],
            'characteristics' => [
                'Ubicación estratégica',
                'Construcción tradicional',
                'Calidad premium',
                'Diseño eficiente',
            ],
            'metrics' => [
                ['label' => 'Finalización', 'value' => '2022'],
                ['label' => 'Unidades', 'value' => '18'],
                ['label' => 'Pisos', 'value' => '6'],
            ],
            'highlights' => [
                'Terminaciones de calidad premium',
                'Estética moderna',
                'Unidades amplias de 1 dormitorio',
            ],
            'investment_link' => $whatsapp_base . rawurlencode('Hola! Quiero información sobre Güemes 1768 o proyectos similares'),
        ],
        'guemes-1853' => [
            'slug' => 'guemes-1853',
            'title' => 'Güemes 1853',
            'description' => '2 Torres de 6 pisos que ofrece unidades monoambientes y departamento de 1,2 y 3 dormitorios. Luce su frente vidriado que jerarquiza la fachada del edificio.',
            'excerpt' => '2 Torres de 6 pisos que ofrece unidades monoambientes y departamento de 1,2 y 3 dormitorios.',
            'type' => 'Residencial',
            'location' => 'Güemes 1853, Salta',
            'stage' => 'finalizado',
            'stage_label' => 'Finalizado',
            'availability' => 'agotado',
            'availability_label' => 'Unidades agotadas',
            'badge_class' => 'c-badge-soldout',
            'primary_image' => $uploads_base . rawurlencode('Guemes 1853') . '/' . rawurlencode('guemes 1853.jpg'),
            'hero_images' => [
                $uploads_base . rawurlencode('Guemes 1853') . '/' . rawurlencode('guemes 1853.jpg'),
                $uploads_base . rawurlencode('Guemes 1853') . '/' . rawurlencode('Güemes 1853.jpg'),
            ],
            'gallery' => [
                $uploads_base . rawurlencode('Guemes 1853') . '/' . rawurlencode('guemes 1853.jpg'),
                $uploads_base . rawurlencode('Guemes 1853') . '/' . rawurlencode('Güemes 1853.jpg'),
            ],
            'characteristics' => [
                'Construcción tradicional',
                'Diseño disruptivo',
                'Ambientes iluminados',
            ],
            'metrics' => [
                ['label' => 'Finalización', 'value' => '2024'],
                ['label' => 'Unidades', 'value' => '36'],
                ['label' => 'Torres', 'value' => '2'],
            ],
            'highlights' => [
                'Frente vidriado que jerarquiza la fachada',
                'Unidades desde monoambientes hasta 3 dormitorios',
                'Diseño disruptivo y moderno',
            ],
            'investment_link' => $whatsapp_base . rawurlencode('Hola! Quiero información sobre Güemes 1853 o proyectos similares'),
        ],
        'libera' => [
            'slug' => 'libera',
            'title' => 'Edificio Libera',
            'description' => 'Se emplaza en 2 Torres de, 6 y 4 pisos que ofrece unidades monoambientes y departamentos de 1 y 2 dormitorios. Con terminaciones de calidad premium y estética moderna.',
            'excerpt' => '2 Torres de 6 y 4 pisos que ofrece unidades monoambientes y departamentos de 1 y 2 dormitorios.',
            'type' => 'Residencial - En desarrollo',
            'location' => 'Coronel Suarez 486, Leguizamón 2073',
            'stage' => 'en-construccion',
            'stage_label' => 'En desarrollo',
            'availability' => 'disponible',
            'availability_label' => 'Unidades disponibles',
            'badge_class' => 'c-badge-available',
            'primary_image' => home_url('/imagenes/libera/liberaPic.jpg'),
            'hero_images' => [
                home_url('/imagenes/libera/liberaPic.jpg'),
            ],
            'gallery' => [
                home_url('/imagenes/libera/liberaPic.jpg'),
            ],
            'characteristics' => [
                'Ubicación estratégica',
                'Construcción tradicional',
                'Salón de usos múltiples',
                'Comodidad y conexión',
            ],
            'metrics' => [
                ['label' => 'Entrega estimada', 'value' => '2026'],
                ['label' => 'Unidades', 'value' => '28'],
                ['label' => 'Torres', 'value' => '2'],
            ],
            'highlights' => [
                'Terminaciones de calidad premium',
                'Estética moderna',
                'Salón de usos múltiples',
            ],
            'brochure' => $uploads_base . 'libera/' . rawurlencode('Flyer LIBERA.pdf'),
            'investment_link' => $whatsapp_base . rawurlencode('Hola! Quiero invertir en Edificio Libera'),
        ],
        'belgrano-office' => [
            'slug' => 'belgrano-office',
            'title' => 'Edificio Belgrano Office',
            'description' => 'Torre de 4 pisos con frente vidriado, ubicada en corredor Belgrano. Destinado al desarrollo personal y profesional de quienes buscan aprovechar sus espacios.',
            'excerpt' => 'Torre de 4 pisos con frente vidriado, ubicada en corredor Belgrano.',
            'type' => 'Corporativo - En desarrollo',
            'location' => 'Belgrano 2131',
            'stage' => 'en-construccion',
            'stage_label' => 'En desarrollo',
            'availability' => 'disponible',
            'availability_label' => 'Oficinas disponibles',
            'badge_class' => 'c-badge-available',
            'primary_image' => $uploads_base . rawurlencode('belgrano office') . '/bOffice.png',
            'hero_images' => [
                $uploads_base . rawurlencode('belgrano office') . '/bOffice.png',
            ],
            'gallery' => [
                $uploads_base . rawurlencode('belgrano office') . '/bOffice.png',
            ],
            'characteristics' => [
                'Ubicación estratégica',
                'Construcción tradicional',
                'Sinergia profesional',
                'Oficinas tecnológicas y funcionales',
            ],
            'metrics' => [
                ['label' => 'Entrega estimada', 'value' => '2025'],
                ['label' => 'Oficinas', 'value' => '16'],
                ['label' => 'Pisos', 'value' => '4'],
            ],
            'highlights' => [
                'Frente vidriado moderno',
                'Ubicado en corredor Belgrano',
                'Espacios para desarrollo profesional',
            ],
            'brochure' => $uploads_base . rawurlencode('belgrano office') . '/' . rawurlencode('BELGRANO OFFICE.pdf'),
            'investment_link' => $whatsapp_base . rawurlencode('Hola! Quiero invertir en Edificio Belgrano Office'),
        ],
        'atocha' => [
            'slug' => 'atocha',
            'title' => 'Atocha',
            'description' => 'Proyecto residencial con diseño moderno y espacios funcionales.',
            'excerpt' => 'Proyecto residencial con diseño moderno y espacios funcionales.',
            'type' => 'Residencial',
            'location' => 'Atocha, Salta',
            'stage' => 'finalizado',
            'stage_label' => 'Finalizado',
            'availability' => 'agotado',
            'availability_label' => 'Unidades agotadas',
            'badge_class' => 'c-badge-soldout',
            'primary_image' => $uploads_base . 'atocha/atocha.jpg',
            'hero_images' => [
                $uploads_base . 'atocha/atocha.jpg',
                $uploads_base . 'atocha/atocha(1).jpg',
                $uploads_base . 'atocha/atocha_.jpg',
            ],
            'gallery' => [
                $uploads_base . 'atocha/atocha.jpg',
                $uploads_base . 'atocha/atocha(1).jpg',
                $uploads_base . 'atocha/atocha_.jpg',
            ],
            'characteristics' => [
                'Diseño moderno',
                'Espacios funcionales',
                'Ubicación estratégica',
            ],
            'metrics' => [
                ['label' => 'Finalización', 'value' => '2021'],
                ['label' => 'Unidades', 'value' => '16'],
            ],
            'highlights' => [
                'Diseño contemporáneo',
                'Espacios optimizados',
            ],
            'investment_link' => $whatsapp_base . rawurlencode('Hola! Quiero información sobre Atocha o proyectos similares'),
        ],
        'balcarce-2302' => [
            'slug' => 'balcarce-2302',
            'title' => 'Balcarce 2302',
            'description' => 'Desarrollo residencial con excelente ubicación y diseño arquitectónico destacado.',
            'excerpt' => 'Desarrollo residencial con excelente ubicación y diseño arquitectónico destacado.',
            'type' => 'Residencial',
            'location' => 'Balcarce 2302, Salta',
            'stage' => 'finalizado',
            'stage_label' => 'Finalizado',
            'availability' => 'agotado',
            'availability_label' => 'Unidades agotadas',
            'badge_class' => 'c-badge-soldout',
            'primary_image' => $uploads_base . rawurlencode('balcarce 2302') . '/' . rawurlencode('Balcarce 2302.jpg'),
            'hero_images' => [
                $uploads_base . rawurlencode('balcarce 2302') . '/' . rawurlencode('Balcarce 2302.jpg'),
                $uploads_base . rawurlencode('balcarce 2302') . '/' . rawurlencode('balcarce 2302(1).jpg'),
            ],
            'gallery' => [
                $uploads_base . rawurlencode('balcarce 2302') . '/' . rawurlencode('Balcarce 2302.jpg'),
                $uploads_base . rawurlencode('balcarce 2302') . '/' . rawurlencode('balcarce 2302(1).jpg'),
            ],
            'characteristics' => [
                'Excelente ubicación',
                'Diseño arquitectónico destacado',
                'Calidad constructiva',
            ],
            'metrics' => [
                ['label' => 'Finalización', 'value' => '2020'],
                ['label' => 'Unidades', 'value' => '12'],
            ],
            'highlights' => [
                'Ubicación privilegiada',
                'Arquitectura destacada',
            ],
            'investment_link' => $whatsapp_base . rawurlencode('Hola! Quiero información sobre Balcarce 2302 o proyectos similares'),
        ],
        'duplex-grand-bourg' => [
            'slug' => 'duplex-grand-bourg',
            'title' => 'Duplex Grand Bourg',
            'description' => 'Desarrollo de unidades dúplex con diseño exclusivo y espacios amplios.',
            'excerpt' => 'Desarrollo de unidades dúplex con diseño exclusivo y espacios amplios.',
            'type' => 'Residencial',
            'location' => 'Grand Bourg, Salta',
            'stage' => 'finalizado',
            'stage_label' => 'Finalizado',
            'availability' => 'agotado',
            'availability_label' => 'Unidades agotadas',
            'badge_class' => 'c-badge-soldout',
            'primary_image' => $uploads_base . rawurlencode('dueplex grand bourg') . '/' . rawurlencode('Duplex Grand Bourg.jpg'),
            'hero_images' => [
                $uploads_base . rawurlencode('dueplex grand bourg') . '/' . rawurlencode('Duplex Grand Bourg.jpg'),
                $uploads_base . rawurlencode('dueplex grand bourg') . '/' . rawurlencode('duplex gb.jpg'),
            ],
            'gallery' => [
                $uploads_base . rawurlencode('dueplex grand bourg') . '/' . rawurlencode('Duplex Grand Bourg.jpg'),
                $uploads_base . rawurlencode('dueplex grand bourg') . '/' . rawurlencode('duplex gb.jpg'),
            ],
            'characteristics' => [
                'Unidades dúplex',
                'Diseño exclusivo',
                'Espacios amplios',
            ],
            'metrics' => [
                ['label' => 'Finalización', 'value' => '2018'],
                ['label' => 'Unidades', 'value' => '8'],
            ],
            'highlights' => [
                'Concepto dúplex exclusivo',
                'Amplios espacios',
            ],
            'investment_link' => $whatsapp_base . rawurlencode('Hola! Quiero información sobre Duplex Grand Bourg o proyectos similares'),
        ],
    ];

    return $projects;
}

/**
 * Helper to access a single project
 */
function cyc_child_get_project(string $slug): ?array {
    $projects = cyc_child_get_projects_data();
    return $projects[$slug] ?? null;
}

/**
 * Hero image rotation data for homepage
 *
 * @return string[]
 */
function cyc_child_get_homepage_hero_images(): array {
    $uploads_base = home_url('/imagenes/');
    return [
        $uploads_base . rawurlencode('arenales 742') . '/' . rawurlencode('Arenales 742.jpg'),
        $uploads_base . rawurlencode('arenales 742') . '/' . rawurlencode('arenales 742(1).jpg'),
        $uploads_base . rawurlencode('guemes 1768') . '/' . rawurlencode('guemes 1768.jpg'),
        $uploads_base . rawurlencode('Guemes 1853') . '/' . rawurlencode('guemes 1853.jpg'),
        $uploads_base . rawurlencode('arenales 742') . '/' . rawurlencode('arenales 742(2).jpg'),
        $uploads_base . rawurlencode('guemes 1768') . '/' . rawurlencode('guemes 1768(1).jpg'),
        $uploads_base . 'atocha/atocha.jpg',
        $uploads_base . rawurlencode('balcarce 2302') . '/' . rawurlencode('Balcarce 2302.jpg'),
        $uploads_base . rawurlencode('dueplex grand bourg') . '/' . rawurlencode('Duplex Grand Bourg.jpg'),
    ];
}

/**
 * Data exposed to front-end scripts
 */
function cyc_child_get_projects_for_js(): array {
    $projects = cyc_child_get_projects_data();
    $data = [];

    foreach ($projects as $slug => $project) {
        $data[] = [
            'slug' => $slug,
            'title' => $project['title'],
            'stage' => $project['stage'],
            'availability' => $project['availability'],
            'shareLink' => home_url('/proyectos/' . $slug . '/'),
        ];
    }

    return $data;
}

/**
 * Register custom rewrite rules for project endpoints
 */
function cyc_child_register_project_routes(): void {
    add_rewrite_rule('^proyectos/([^/]+)/?$', 'index.php?project_slug=$matches[1]', 'top');
}
add_action('init', 'cyc_child_register_project_routes');

/**
 * Make custom project slug query var available
 */
function cyc_child_project_query_vars(array $vars): array {
    $vars[] = 'project_slug';
    return $vars;
}
add_filter('query_vars', 'cyc_child_project_query_vars');

/**
 * Inject custom project template when needed
 */
function cyc_child_project_template_include(string $template): string {
    $slug = get_query_var('project_slug');

    if ($slug) {
        $project = cyc_child_get_project($slug);
        if ($project) {
            set_query_var('cyc_project', $project);
            return get_stylesheet_directory() . '/project-single.php';
        }
    }

    return $template;
}
add_filter('template_include', 'cyc_child_project_template_include');

/**
 * Flush rewrite rules when theme is activated
 */
function cyc_child_flush_rewrite_rules(): void {
    cyc_child_register_project_routes();
    flush_rewrite_rules();
}
add_action('after_switch_theme', 'cyc_child_flush_rewrite_rules');

/**
 * Localize project data for scripts
 */
add_action('wp_enqueue_scripts', function() {
    wp_localize_script(
        'twentytwentythree-child-script',
        'cycThemeData',
        [
            'heroImages' => cyc_child_get_homepage_hero_images(),
            'projects' => cyc_child_get_projects_for_js(),
        ]
    );
}, 25);

/**
 * Load homepage content from HTML file automatically (for Docker/local development only)
 * This allows editing homepage_content.html and seeing changes immediately
 * 
 * IMPORTANT: This function only works in local development. In staging/production,
 * the content should be copied directly into WordPress pages.
 */
function cyc_child_load_homepage_from_file($content) {
    // Solo activar en desarrollo local (verificar si estamos en localhost o Docker)
    $is_local = (
        isset($_SERVER['HTTP_HOST']) && 
        (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false || 
         strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false ||
         strpos($_SERVER['HTTP_HOST'], '.local') !== false)
    );
    
    // Si no es local, usar siempre el contenido de WordPress
    if (!$is_local) {
        return $content;
    }
    
    // Only on homepage/front page
    if (!is_front_page() && !is_home()) {
        return $content;
    }
    
    $html_file = get_stylesheet_directory() . '/homepage_content.html';
    
    // Check if file exists
    if (!file_exists($html_file)) {
        return $content;
    }
    
    // Read file content
    $html_content = file_get_contents($html_file);
    
    // Return HTML content (bypass WordPress content filters for raw HTML)
    if ($html_content !== false) {
        // Remover filtros que pueden modificar el HTML
        remove_filter('the_content', 'wpautop');
        remove_filter('the_content', 'wptexturize');
        return $html_content;
    }
    
    return $content;
}
// Prioridad alta para ejecutar antes de otros filtros
add_filter('the_content', 'cyc_child_load_homepage_from_file', 1);
