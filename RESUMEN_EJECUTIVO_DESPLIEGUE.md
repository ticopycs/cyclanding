# 📋 Resumen Ejecutivo - Despliegue a DonWeb

## 🎯 Objetivo
Subir todos los cambios del proyecto CyC Landing Page a WordPress hosteado en DonWeb.

## ⚡ Pasos Rápidos (5 minutos)

### 1. Subir Archivos del Tema (2 min)
```
📁 wp-content/themes/twentytwentythree-child/
   ├── functions.php
   ├── style.css
   ├── script.js
   └── project-single.php
```

**Método:** FTP/File Manager → Subir a `wp-content/themes/twentytwentythree-child/`

### 2. Activar Tema (30 seg)
WordPress Admin → Apariencia → Temas → Activar "Twenty Twenty-Three Child"

### 3. Subir Imágenes (2 min)
WordPress Admin → Medios → Añadir nuevo → Subir todas las imágenes de `imagenes/`

### 4. Configurar (30 seg)
- Configuración → Enlaces permanentes → Guardar cambios
- Limpiar caché (navegador: Ctrl+Shift+R)

---

## 📂 Estructura de Archivos

### Archivos del Tema (4 archivos)
```
twentytwentythree-child/
├── functions.php      ← Funcionalidades PHP
├── style.css          ← Estilos CSS
├── script.js          ← JavaScript
└── project-single.php ← Plantilla proyectos
```

### Imágenes a Subir
- **Logo:** `logoCyc.png`
- **Proyectos:** Toda la carpeta `imagenes/` con subcarpetas:
  - `arenales 742/`
  - `guemes 1768/`
  - `guemes 1853/`
  - `libera/` (incluye PDF)
  - `belgrano office/` (incluye PDF y bOffice.png)
  - `balcarce 2302/`
  - `dueplex grand bourg/`
  - `atocha/`

---

## 🔑 Información Importante

### URLs y Configuración
- **WhatsApp:** `+5493875058555`
- **Instagram:** `https://www.instagram.com/cycsalta`
- **Ruta logo:** Se actualizará automáticamente al subir a Medios

### Dependencias Externas
El tema carga automáticamente:
- ✅ Google Fonts (Montserrat)
- ✅ Leaflet.js 1.9.4 (para mapas)
- ✅ jQuery (incluido en WordPress)

### Requisitos del Servidor
- ✅ PHP 7.4 o superior
- ✅ WordPress 6.0 o superior
- ✅ Tema padre "Twenty Twenty-Three" instalado

---

## ⚠️ Puntos Críticos

1. **NO subir `homepage_content.html`** - Es solo referencia
2. **Subir imágenes a Biblioteca de Medios**, no directamente al servidor
3. **Activar tema hijo**, no el padre
4. **Guardar Enlaces permanentes** después de subir archivos
5. **Limpiar caché** después de cada cambio

---

## 🆘 Problemas Comunes

| Problema | Solución Rápida |
|----------|----------------|
| Tema no aparece | Verificar nombre de carpeta: `twentytwentythree-child` |
| Imágenes no cargan | Subir a Biblioteca de Medios, no al servidor |
| Estilos no aplican | Limpiar caché (Ctrl+Shift+R) |
| JavaScript no funciona | Verificar consola del navegador (F12) |
| 404 en proyectos | Guardar Enlaces permanentes |

---

## 📞 Soporte

- **Guía completa:** Ver `GUIA_DESPLIEGUE_DONWEB.md`
- **Checklist:** Ver `CHECKLIST_DESPLIEGUE.md`
- **Soporte DonWeb:** Panel de control → Soporte

---

**Tiempo estimado total:** 10-15 minutos
**Dificultad:** ⭐⭐☆☆☆ (Básico)



