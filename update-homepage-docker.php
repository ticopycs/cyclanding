<?php
/**
 * Script para actualizar el contenido de la página de inicio en WordPress desde homepage_content.html
 * Ejecutar: docker-compose exec wordpress php /var/www/html/wp-content/update-homepage-docker.php
 * O desde el host: docker-compose exec wordpress wp eval-file /var/www/html/wp-content/update-homepage-docker.php --allow-root
 */

// Cargar WordPress
require_once('/var/www/html/wp-load.php');

// Ruta al archivo HTML
$html_file = '/var/www/html/wp-content/themes/twentytwentythree-child/homepage_content.html';

// Verificar que el archivo existe
if (!file_exists($html_file)) {
    echo "ERROR: No se encontró el archivo: $html_file\n";
    exit(1);
}

// Leer el contenido del archivo HTML
$html_content = file_get_contents($html_file);

if ($html_content === false) {
    echo "ERROR: No se pudo leer el archivo: $html_file\n";
    exit(1);
}

// Obtener la página de inicio (front page)
$front_page_id = get_option('page_on_front');

if (!$front_page_id) {
    // Si no hay página configurada como front page, buscar la primera página o crear una
    $pages = get_pages(array('number' => 1, 'sort_column' => 'post_date', 'sort_order' => 'ASC'));
    
    if (empty($pages)) {
        // Crear una nueva página
        $front_page_id = wp_insert_post(array(
            'post_title' => 'Inicio',
            'post_content' => $html_content,
            'post_status' => 'publish',
            'post_type' => 'page'
        ));
        
        if (is_wp_error($front_page_id)) {
            echo "ERROR: No se pudo crear la página de inicio\n";
            exit(1);
        }
        
        // Configurar como página de inicio
        update_option('show_on_front', 'page');
        update_option('page_on_front', $front_page_id);
        
        echo "✓ Página de inicio creada y configurada (ID: $front_page_id)\n";
    } else {
        $front_page_id = $pages[0]->ID;
        update_option('show_on_front', 'page');
        update_option('page_on_front', $front_page_id);
        echo "✓ Página de inicio configurada (ID: $front_page_id)\n";
    }
}

// Actualizar el contenido de la página
$result = wp_update_post(array(
    'ID' => $front_page_id,
    'post_content' => $html_content
));

if (is_wp_error($result)) {
    echo "ERROR: No se pudo actualizar la página: " . $result->get_error_message() . "\n";
    exit(1);
}

echo "✓ Contenido de la página de inicio actualizado exitosamente (ID: $front_page_id)\n";
echo "✓ Archivo fuente: $html_file\n";
echo "✓ Tamaño del contenido: " . strlen($html_content) . " caracteres\n";
echo "\n";
echo "Puedes ver los cambios en: http://localhost:8080\n";
exit(0);

