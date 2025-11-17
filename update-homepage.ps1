# Script PowerShell para actualizar el contenido de la pagina de inicio en Docker
# Ejecutar: .\update-homepage.ps1

Write-Host "Actualizando contenido de la pagina de inicio desde homepage_content.html..." -ForegroundColor Cyan

docker-compose exec -T wordpress php /var/www/html/wp-content/update-homepage-docker.php

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Actualizacion completada exitosamente!" -ForegroundColor Green
    Write-Host "Visita http://localhost:8080 para ver los cambios" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "Error al actualizar el contenido" -ForegroundColor Red
    exit 1
}
