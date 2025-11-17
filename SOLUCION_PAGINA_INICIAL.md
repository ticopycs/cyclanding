# Solución: Página Inicial Mostrando HTML como Texto

## Problema
La página inicial está mostrando el código HTML como texto plano en lugar de renderizarlo correctamente. También hay shortcodes de Divi (`[et_pb_section`, `[et_pb_text`) que no deberían estar.

## Solución Paso a Paso

### Paso 1: Limpiar el Contenido Actual

1. Ve a **WordPress Admin** → **Páginas** → **Todas las páginas**
2. Encuentra la página de inicio (la que está configurada como página principal)
3. Haz clic en **"Editar"**

### Paso 2: Eliminar TODO el Contenido Actual

1. En el editor, selecciona **TODO** el contenido (Ctrl+A / Cmd+A)
2. **Borra completamente** todo el contenido
3. Esto incluye cualquier shortcode de Divi que pueda estar ahí

### Paso 3: Cambiar al Editor de Código HTML

1. En la barra superior del editor, haz clic en los **tres puntos** (⋮) en la esquina superior derecha
2. Selecciona **"Editor de código"** o **"Code Editor"**
3. Si no ves esta opción, busca un botón que diga **"HTML"** o **"Texto"** (depende de la versión de WordPress)

### Paso 4: Insertar el Contenido HTML

1. Abre el archivo `homepage_content.html` desde tu computadora
2. **Copia TODO el contenido** (desde `<div class="c-hero"` hasta el final)
3. En WordPress, en el editor de código, **pega el contenido completo**
4. **NO** cambies al editor visual después de pegar

### Paso 5: Guardar

1. Haz clic en **"Actualizar"** o **"Publicar"** (botón azul en la esquina superior derecha)
2. **NO** cambies al editor visual antes de guardar

### Paso 6: Verificar

1. Visita la página en el navegador
2. Debería renderizarse correctamente ahora

---

## Si el Problema Persiste

### Opción A: Usar un Bloque HTML Personalizado

1. En el editor de bloques de WordPress, haz clic en **"+"** para agregar un bloque
2. Busca y selecciona el bloque **"HTML personalizado"** o **"Custom HTML"**
3. Pega el contenido HTML completo dentro de ese bloque
4. Guarda

### Opción B: Verificar Permisos de Usuario

1. Asegúrate de que tu usuario tenga permisos de **Administrador**
2. Ve a **Usuarios** → **Tu Perfil**
3. Verifica que tengas el rol de **Administrador**

### Opción C: Desactivar Filtros de HTML

Si WordPress sigue escapando el HTML, puedes agregar esto temporalmente a `functions.php`:

```php
// Permitir HTML sin filtrar en páginas específicas (SOLO TEMPORAL)
add_filter('the_content', function($content) {
    if (is_front_page() || is_page('home')) {
        return $content; // No filtrar en página de inicio
    }
    return $content;
}, 1);
```

**⚠️ ADVERTENCIA:** Esto es solo para debugging. Una vez que funcione, deberías remover este código.

---

## Verificar que NO Haya Contenido de Divi

Antes de pegar el nuevo contenido, asegúrate de que NO haya nada como:

- `[et_pb_section`
- `[et_pb_text`
- `[et_pb_row`
- Cualquier shortcode que empiece con `[et_`

Si encuentras estos shortcodes, **elimínalos completamente** antes de pegar el nuevo contenido.

---

## Checklist Final

- [ ] Contenido anterior completamente eliminado
- [ ] Editor cambiado a modo "Código" / "HTML"
- [ ] Contenido de `homepage_content.html` pegado completo
- [ ] Guardado sin cambiar al editor visual
- [ ] Página verificada en el navegador
- [ ] No hay shortcodes de Divi en el contenido

---

## Si Nada Funciona

Si después de seguir estos pasos el problema persiste, puede ser que:

1. **Hay un plugin conflictivo** - Desactiva todos los plugins temporalmente y prueba
2. **El tema tiene restricciones** - Verifica que el tema hijo esté activo correctamente
3. **Permisos de archivo** - Verifica que `functions.php` tenga permisos correctos (644)

Avísame si necesitas ayuda con alguno de estos pasos.

