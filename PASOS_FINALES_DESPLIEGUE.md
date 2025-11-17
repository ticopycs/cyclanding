# Pasos Finales para Completar el Despliegue en DonWeb

## ✅ Lo que ya hiciste:
- [x] Subiste las carpetas de imágenes
- [x] Instalaste el tema `twentytwentythree-child`
- [x] Subiste los 4 archivos del tema (style.css, functions.php, script.js, project-single.php)
- [x] Activaste el tema

---

## 📋 Pasos que faltan:

### 1. Actualizar el Contenido de la Página de Inicio

El archivo `homepage_content.html` es solo de referencia. Necesitas insertar su contenido en WordPress:

**Paso 1.1: Abrir la Página de Inicio**
1. Ve a **WordPress Admin** → **Páginas** → **Todas las páginas**
2. Busca la página que está configurada como "Página de inicio" (o crea una nueva)
3. Haz clic en **"Editar"**

**Paso 1.2: Cambiar al Editor de Código**
1. En el editor de bloques, haz clic en los **tres puntos** (⋮) en la esquina superior derecha
2. Selecciona **"Editor de código"** o **"Code Editor"**
3. Esto te permitirá pegar HTML directamente

**Paso 1.3: Pegar el Contenido**
1. Abre el archivo `homepage_content.html` desde tu computadora
2. Copia **TODO el contenido** (desde `<div class="c-hero"` hasta el final)
3. En WordPress, **elimina todo el contenido existente** de la página
4. Pega el contenido HTML completo
5. Haz clic en **"Actualizar"** o **"Publicar"**

**Paso 1.4: Configurar como Página de Inicio (si no está configurada)**
1. Ve a **Configuración** → **Lectura**
2. En **"Tu página de inicio muestra"**, selecciona **"Una página estática"**
3. En **"Página de inicio"**, selecciona la página que acabas de editar
4. Haz clic en **"Guardar cambios"**

---

### 2. Crear la Página de Proyectos

**Paso 2.1: Crear la Página**
1. Ve a **Páginas** → **Añadir nueva**
2. Título: **"Proyectos"**
3. Slug/URL: **"proyectos"** (importante: debe ser exactamente "proyectos")

**Paso 2.2: Insertar el Contenido**
1. Cambia al **Editor de código** (tres puntos → Editor de código)
2. Abre el archivo `proyectos_full_content.html` desde tu computadora
3. Copia **TODO el contenido**
4. Pega en la página de WordPress
5. Haz clic en **"Publicar"**

---

### 3. Regenerar Enlaces Permanentes (IMPORTANTE)

Esto es **crítico** para que las páginas de proyectos individuales funcionen:

1. Ve a **Configuración** → **Enlaces permanentes**
2. Asegúrate de que esté seleccionado algo diferente a **"Simple"** (recomendado: **"Nombre de la entrada"**)
3. Haz clic en **"Guardar cambios"** (aunque no cambies nada, esto regenera las reglas)
4. Esto activa las rutas personalizadas como `/proyectos/arenales-742/`

---

### 4. Verificar Rutas de Imágenes

**Paso 4.1: Verificar la Carpeta `imagenes/`**
- Confirma que la carpeta `imagenes/` esté en: `public_html/staging/imagenes/`
- O si usas `wp-content/uploads`, debe estar en: `public_html/staging/wp-content/uploads/2025/`

**Paso 4.2: Verificar la Imagen de Libera**
- Confirma que `liberaPic.jpg` esté en: `public_html/staging/imagenes/libera/liberaPic.jpg`

**Paso 4.3: Si las imágenes están en otra ubicación**
- Si subiste las imágenes a `wp-content/uploads/2025/`, necesitarás actualizar las rutas en `functions.php`
- O puedes mover la carpeta `imagenes/` a la raíz de `public_html/staging/`

---

### 5. Verificar que Todo Funcione

**5.1. Página Principal (`/staging/` o `/staging/home`)**
- [ ] Header con logo, botón Proyectos, iconos sociales
- [ ] Hero con slider de imágenes rotando
- [ ] Carousel de proyectos funcionando
- [ ] Sección "Nosotros"
- [ ] Sección "A qué nos dedicamos"
- [ ] Mapa interactivo con pines
- [ ] Botón flotante de WhatsApp

**5.2. Página de Proyectos (`/staging/proyectos`)**
- [ ] Todas las tarjetas de proyectos visibles
- [ ] Imágenes cargando correctamente
- [ ] Filtros "Finalizados" / "En desarrollo" funcionando
- [ ] Botones "Ver Proyecto" funcionando
- [ ] Botones "Descargar Brochure" (para Libera y Belgrano Office)

**5.3. Página Individual de Proyecto (ej: `/staging/proyectos/arenales-742`)**
- [ ] Galería de imágenes visible
- [ ] Hover en imágenes (se ponen grises)
- [ ] Modal de imágenes con flechas funcionando
- [ ] Botones de compartir (Facebook, Twitter, WhatsApp)
- [ ] Botón de WhatsApp para inversión
- [ ] PDF descargable (si aplica)

---

### 6. Solución de Problemas Comunes

**Problema: Las imágenes no se muestran**
- Abre la consola del navegador (F12) y revisa errores 404
- Verifica que las rutas en `functions.php` coincidan con la ubicación real de las imágenes
- Si las imágenes están en `imagenes/`, las rutas deben ser `/imagenes/...`
- Si están en `wp-content/uploads/2025/`, las rutas deben ser `/wp-content/uploads/2025/...`

**Problema: El carousel no funciona**
- Verifica que `script.js` esté cargando (F12 → Network → busca `script.js`)
- Revisa la consola del navegador (F12 → Console) por errores JavaScript
- Asegúrate de que jQuery esté cargado (WordPress lo incluye por defecto)

**Problema: Las páginas de proyectos dan 404**
- Ve a **Configuración** → **Enlaces permanentes** → **Guardar cambios** (regenera las reglas)
- Verifica que el archivo `.htaccess` tenga permisos de escritura

**Problema: El mapa no carga**
- Verifica que Leaflet CSS y JS estén cargando (F12 → Network)
- Revisa la consola del navegador por errores
- Asegúrate de que no haya bloqueadores de scripts activos

---

### 7. Checklist Final

Antes de considerar el despliegue completo:

- [ ] Tema activo y funcionando
- [ ] Página de inicio con todo el contenido HTML insertado
- [ ] Página de proyectos creada y publicada
- [ ] Enlaces permanentes regenerados
- [ ] Todas las imágenes cargando correctamente
- [ ] Carousel funcionando
- [ ] Mapa interactivo funcionando
- [ ] Botones de WhatsApp funcionando
- [ ] Páginas individuales de proyectos accesibles
- [ ] PDFs descargables (Libera y Belgrano Office)
- [ ] Sin errores en la consola del navegador (F12)

---

## 🎯 Resumen de Archivos Necesarios

**En el servidor:**
```
public_html/staging/
├── wp-content/
│   └── themes/
│       └── twentytwentythree-child/
│           ├── style.css ✅
│           ├── functions.php ✅
│           ├── script.js ✅
│           └── project-single.php ✅
└── imagenes/ ✅
    ├── arenales 742/
    ├── guemes 1768/
    ├── guemes 1853/
    ├── libera/
    │   └── liberaPic.jpg ✅ (actualizado)
    ├── belgrano office/
    ├── balcarce 2302/
    ├── duplex grand bourg/
    └── atocha/
```

**En WordPress Admin:**
- Página de inicio con contenido de `homepage_content.html` ✅ (pendiente)
- Página "Proyectos" con contenido de `proyectos_full_content.html` ✅ (pendiente)

---

## 📝 Notas Importantes

1. **El archivo `homepage_content.html` NO se sube al servidor**, solo se usa como referencia para copiar el contenido a WordPress.

2. **Las imágenes pueden estar en dos ubicaciones:**
   - `public_html/staging/imagenes/` (ruta: `/imagenes/...`)
   - `public_html/staging/wp-content/uploads/2025/` (ruta: `/wp-content/uploads/2025/...`)

3. **Si cambias la ubicación de las imágenes**, actualiza las rutas en `functions.php` antes de subir el archivo.

4. **Siempre regenera los enlaces permanentes** después de activar el tema o hacer cambios en las rutas.

---

¿Necesitas ayuda con algún paso específico? Avísame y te guío paso a paso.

