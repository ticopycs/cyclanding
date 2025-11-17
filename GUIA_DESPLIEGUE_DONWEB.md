# Guía de Despliegue a DonWeb - Proyecto CyC Landing Page

## 📋 Índice
1. [Preparación](#preparación)
2. [Acceso al Servidor](#acceso-al-servidor)
3. [Subir Archivos del Tema](#subir-archivos-del-tema)
4. [Subir Imágenes](#subir-imágenes)
5. [Verificar y Activar el Tema](#verificar-y-activar-el-tema)
6. [Configuración Final](#configuración-final)
7. [Verificación](#verificación)
8. [Solución de Problemas](#solución-de-problemas)

---

## 1. Preparación

### 1.1. Archivos Necesarios

Asegúrate de tener listos los siguientes archivos desde tu proyecto local:

**Tema Hijo:**
- `wp-content/themes/twentytwentythree-child/functions.php`
- `wp-content/themes/twentytwentythree-child/style.css`
- `wp-content/themes/twentytwentythree-child/script.js`
- `wp-content/themes/twentytwentythree-child/project-single.php`
- `wp-content/themes/twentytwentythree-child/homepage_content.html` (referencia)

**Imágenes:**
- `logoCyc.png` (logo principal)
- Carpeta `imagenes/` completa con todas las subcarpetas de proyectos

### 1.2. Información Necesaria de DonWeb

Antes de comenzar, necesitas:
- ✅ Credenciales de acceso FTP/SFTP o acceso al File Manager del panel
- ✅ URL de tu sitio WordPress
- ✅ Acceso al panel de administración de WordPress (wp-admin)

---

## 2. Acceso al Servidor

### Opción A: File Manager (Recomendado para principiantes)

1. Inicia sesión en el **Panel de Control de DonWeb**
2. Busca la opción **"File Manager"** o **"Administrador de Archivos"**
3. Navega a la carpeta raíz de tu sitio WordPress (generalmente `public_html` o `www`)

### Opción B: FTP/SFTP (Para usuarios avanzados)

1. Usa un cliente FTP como **FileZilla**, **WinSCP** o **Cyberduck**
2. Configura la conexión con:
   - **Host/Servidor:** `ftp.tudominio.com` o la IP proporcionada por DonWeb
   - **Usuario:** Tu usuario FTP
   - **Contraseña:** Tu contraseña FTP
   - **Puerto:** 21 (FTP) o 22 (SFTP)
3. Conéctate al servidor

---

## 3. Subir Archivos del Tema

### 3.1. Verificar Estructura de Carpetas

En el servidor, navega a:
```
public_html/wp-content/themes/
```

Debes ver las carpetas de temas instalados. Si no existe `twentytwentythree-child`, créala.

### 3.2. Subir Archivos del Tema Hijo

**Paso 1:** Navega a `wp-content/themes/twentytwentythree-child/`

**Paso 2:** Sube los siguientes archivos (reemplaza los existentes si los hay):

1. **functions.php** - Funcionalidades del tema
2. **style.css** - Estilos CSS
3. **script.js** - JavaScript e interactividad
4. **project-single.php** - Plantilla para páginas de proyectos individuales

**Nota:** El archivo `homepage_content.html` es solo de referencia y NO necesita subirse.

### 3.3. Verificar Permisos de Archivos

Asegúrate de que los archivos tengan permisos correctos:
- **Archivos PHP, CSS, JS:** `644` o `755`
- **Carpetas:** `755`

En File Manager, puedes cambiar permisos haciendo clic derecho → "Cambiar permisos"

---

## 4. Subir Imágenes

### 4.1. Subir el Logo

**Método 1: Desde WordPress (Recomendado)**

1. Accede a **WordPress Admin** → **Medios** → **Añadir nuevo**
2. Sube `logoCyc.png`
3. Copia la URL completa de la imagen (ej: `https://tudominio.com/wp-content/uploads/2025/01/logoCyc.png`)
4. Esta URL se usará en `functions.php` si es necesario

**Método 2: Directo por FTP**

1. Navega a `wp-content/uploads/` en el servidor
2. Crea una carpeta con el año actual (ej: `2025`)
3. Sube `logoCyc.png` allí
4. Anota la ruta completa

### 4.2. Subir Imágenes de Proyectos

**IMPORTANTE:** Las imágenes deben subirse a la **Biblioteca de Medios de WordPress**, no directamente al servidor.

**Paso 1: Preparar las Imágenes**

Organiza las imágenes por proyecto:
- `imagenes/arenales 742/` → Todas las imágenes de Arenales 742
- `imagenes/guemes 1768/` → Todas las imágenes de Güemes 1768
- `imagenes/guemes 1853/` → Todas las imágenes de Güemes 1853
- `imagenes/libera/` → Imágenes y PDFs de Libera
- `imagenes/belgrano office/` → Imágenes y PDFs de Belgrano Office
- `imagenes/balcarce 2302/` → Imágenes de Balcarce 2302
- `imagenes/dueplex grand bourg/` → Imágenes de Duplex Grand Bourg
- `imagenes/atocha/` → Imágenes de Atocha

**Paso 2: Subir a WordPress**

1. Ve a **WordPress Admin** → **Medios** → **Añadir nuevo**
2. Arrastra y suelta todas las imágenes de un proyecto a la vez
3. **Renombra las imágenes** para que tengan nombres consistentes:
   - Ejemplo: `arenales-742-1.jpg`, `arenales-742-2.jpg`, etc.
4. Repite para cada proyecto

**Paso 3: Organizar en Carpetas (Opcional pero Recomendado)**

Puedes usar un plugin como **Media Library Folders** para organizar:
1. Instala el plugin desde **Plugins** → **Añadir nuevo**
2. Busca "Media Library Folders"
3. Crea carpetas por proyecto y mueve las imágenes

**Paso 4: Subir PDFs de Brochures**

Para los proyectos en desarrollo (Libera y Belgrano Office):
1. Sube los PDFs a **Medios** → **Añadir nuevo**
2. Anota las URLs de los PDFs:
   - `brochureLibera.pdf`
   - `BELGRANO OFFICE.pdf`

---

## 5. Verificar y Activar el Tema

### 5.1. Verificar que el Tema Esté Instalado

1. Ve a **WordPress Admin** → **Apariencia** → **Temas**
2. Debes ver **"Twenty Twenty-Three Child"** en la lista
3. Si no aparece, verifica que los archivos estén en la carpeta correcta

### 5.2. Activar el Tema Hijo

1. En **Apariencia** → **Temas**
2. Busca **"Twenty Twenty-Three Child"**
3. Haz clic en **"Activar"**

**IMPORTANTE:** El tema padre "Twenty Twenty-Three" debe estar instalado. Si no lo está:
1. Ve a **Apariencia** → **Temas** → **Añadir nuevo**
2. Busca "Twenty Twenty-Three"
3. Instálalo y actívalo primero
4. Luego activa el tema hijo

---

## 6. Configuración Final

### 6.1. Actualizar Rutas de Imágenes en functions.php

Si las imágenes se subieron a la biblioteca de medios, verifica que las rutas en `functions.php` sean correctas.

**Ubicación:** `wp-content/themes/twentytwentythree-child/functions.php`

Busca la función `cyc_child_get_projects_data()` y verifica que las rutas de imágenes apunten a:
- `/wp-content/uploads/YYYY/MM/nombre-imagen.jpg` (formato WordPress)
- O URLs completas si usas CDN

### 6.2. Limpiar Caché

1. **Caché de WordPress:**
   - Si usas un plugin de caché (WP Super Cache, W3 Total Cache, etc.), ve a su configuración y limpia el caché

2. **Caché del Navegador:**
   - Presiona `Ctrl + Shift + R` (Windows) o `Cmd + Shift + R` (Mac) para recargar sin caché

3. **Caché de DonWeb (si aplica):**
   - En el panel de DonWeb, busca opciones de caché y límpialo

### 6.3. Verificar Permalinks

1. Ve a **Configuración** → **Enlaces permanentes**
2. Asegúrate de que esté configurado (no "Simple")
3. Haz clic en **"Guardar cambios"** (esto regenera las reglas de reescritura)

---

## 7. Verificación

### 7.1. Verificar Página Principal

1. Visita la URL de tu sitio
2. Verifica que:
   - ✅ El header se muestre correctamente (logo, botón Proyectos, iconos sociales)
   - ✅ La imagen hero rote correctamente
   - ✅ El carousel de proyectos funcione
   - ✅ Todas las secciones se muestren

### 7.2. Verificar Página de Proyectos

1. Visita `/proyectos`
2. Verifica que:
   - ✅ Todas las tarjetas de proyectos se muestren
   - ✅ Las imágenes se carguen correctamente
   - ✅ Los filtros funcionen
   - ✅ Los botones "Ver Proyecto" funcionen

### 7.3. Verificar Páginas Individuales de Proyectos

1. Haz clic en cualquier proyecto
2. Verifica que:
   - ✅ La galería de imágenes funcione
   - ✅ El modal de imágenes funcione con las flechas
   - ✅ Los botones de compartir funcionen
   - ✅ El botón de WhatsApp funcione
   - ✅ Los PDFs se descarguen (para proyectos en desarrollo)

### 7.4. Verificar Funcionalidades Específicas

- ✅ Mapa interactivo con pines
- ✅ Botón flotante de WhatsApp
- ✅ Header sticky al hacer scroll
- ✅ Carousel infinito en la página principal

---

## 8. Solución de Problemas

### Problema: El tema no aparece en la lista

**Solución:**
1. Verifica que la carpeta se llame exactamente `twentytwentythree-child`
2. Verifica que `style.css` tenga el header correcto:
   ```css
   /*
   Theme Name: Twenty Twenty-Three Child
   Template: twentytwentythree
   */
   ```
3. Verifica permisos de archivos (644 para archivos, 755 para carpetas)

### Problema: Las imágenes no se muestran

**Solución:**
1. Verifica las rutas en `functions.php`
2. Asegúrate de que las imágenes estén en la biblioteca de medios
3. Verifica permisos de la carpeta `uploads` (debe ser 755)
4. Revisa la consola del navegador (F12) para ver errores 404

### Problema: Los estilos no se aplican

**Solución:**
1. Limpia el caché del navegador y del servidor
2. Verifica que `style.css` esté correctamente enlazado
3. Revisa la consola del navegador para errores de carga de CSS
4. Verifica que no haya conflictos con otros plugins

### Problema: JavaScript no funciona

**Solución:**
1. Verifica que `script.js` esté correctamente enlazado en `functions.php`
2. Revisa la consola del navegador (F12) para errores JavaScript
3. Verifica que jQuery esté cargado (requisito para algunos scripts)
4. Asegúrate de que Leaflet.js esté cargado (para el mapa)

### Problema: Error 404 en páginas de proyectos

**Solución:**
1. Ve a **Configuración** → **Enlaces permanentes**
2. Haz clic en **"Guardar cambios"** (regenera las reglas)
3. Verifica que `.htaccess` tenga permisos de escritura
4. Revisa que las reglas de reescritura estén en `functions.php`

### Problema: El mapa no carga

**Solución:**
1. Verifica que Leaflet CSS y JS estén correctamente enlazados en `functions.php`
2. Revisa la consola del navegador para errores
3. Verifica que las coordenadas de los pines sean correctas
4. Asegúrate de que no haya bloqueadores de scripts activos

---

## 9. Checklist Final

Antes de considerar el despliegue completo, verifica:

- [ ] Todos los archivos del tema están subidos
- [ ] El tema hijo está activado
- [ ] Todas las imágenes están en la biblioteca de medios
- [ ] El logo está subido y configurado
- [ ] Los PDFs de brochures están subidos
- [ ] La página principal se ve correctamente
- [ ] La página de proyectos funciona
- [ ] Las páginas individuales de proyectos funcionan
- [ ] El mapa interactivo funciona
- [ ] El carousel funciona
- [ ] Los botones de WhatsApp funcionan
- [ ] El header sticky funciona
- [ ] El caché está limpio
- [ ] Los enlaces permanentes están configurados
- [ ] No hay errores en la consola del navegador

---

## 10. Contacto y Soporte

Si encuentras problemas durante el despliegue:

1. **Revisa los logs de error:**
   - WordPress: `wp-content/debug.log` (si WP_DEBUG está activado)
   - Servidor: Panel de DonWeb → Logs

2. **Verifica la documentación:**
   - [Documentación de WordPress](https://wordpress.org/support/)
   - [Documentación de DonWeb](https://www.donweb.com/centro-de-ayuda/)

3. **Contacta al soporte:**
   - Soporte de DonWeb para problemas de servidor
   - Desarrollador para problemas específicos del código

---

## Notas Adicionales

### Backup Antes de Desplegar

**SIEMPRE** haz un backup completo antes de hacer cambios:
1. Backup de la base de datos (desde phpMyAdmin o plugin)
2. Backup de archivos (descarga la carpeta `wp-content` completa)

### Actualizaciones Futuras

Para futuras actualizaciones:
1. Modifica los archivos localmente
2. Prueba en un entorno de desarrollo
3. Sube solo los archivos modificados
4. Limpia el caché
5. Verifica que todo funcione

### Seguridad

- Mantén WordPress y los plugins actualizados
- Usa contraseñas seguras
- Considera instalar un plugin de seguridad (Wordfence, Sucuri, etc.)
- No subas archivos con información sensible

---

**Última actualización:** Enero 2025
**Versión del proyecto:** Desarrollo

