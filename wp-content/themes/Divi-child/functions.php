<?php
// Exit if accessed directly
if ( !defined( 'ABSPATH' ) ) exit;

// BEGIN ENQUEUE PARENT ACTION
// AUTO GENERATED - Do not modify or remove comment markers above or below:

if ( !function_exists( 'chld_thm_cfg_locale_css' ) ):
    function chld_thm_cfg_locale_css( $uri ){
        if ( empty( $uri ) && is_rtl() && file_exists( get_template_directory() . '/rtl.css' ) )
            $uri = get_template_directory_uri() . '/rtl.css';
        return $uri;
    }
endif;
add_filter( 'locale_stylesheet_uri', 'chld_thm_cfg_locale_css' );

// END ENQUEUE PARENT ACTION

// Enqueue child theme styles and modern font
add_action('wp_enqueue_scripts', function() {
    // Ensure parent style loads
    wp_enqueue_style('divi-style', get_template_directory_uri() . '/style.css', [], null);

    // Google Fonts: Gotham alternative (Montserrat) with Latin subset
    wp_enqueue_style(
        'child-google-fonts',
        'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap',
        [],
        null
    );

    // Child stylesheet last to override
    wp_enqueue_style('divi-child-style', get_stylesheet_uri(), ['divi-style', 'child-google-fonts'], filemtime(get_stylesheet_directory() . '/style.css'));

    // Small UX script
    wp_enqueue_script('divi-child-script', get_stylesheet_directory_uri() . '/script.js', [], filemtime(get_stylesheet_directory() . '/script.js'), true);
});
