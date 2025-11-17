# Documentación Completa del Carousel de Proyectos

## 📍 Ubicación de Archivos

### 1. **HTML - Estructura del Carousel**
**Archivo:** `wp-content/themes/twentytwentythree-child/homepage_content.html`  
**Líneas:** 94-151

### 2. **CSS - Estilos del Carousel**
**Archivo:** `wp-content/themes/twentytwentythree-child/style.css`  
**Líneas:** 369-490

### 3. **JavaScript - Funcionalidad y Animaciones**
**Archivo:** `wp-content/themes/twentytwentythree-child/script.js`  
**Líneas:** 522-639

---

## 🏗️ 1. ESTRUCTURA HTML

### Contenedor Principal
```html
<div class="c-carousel-container" style="margin-top: var(--c-spacing-md);">
```

### Botones de Navegación
```html
<button class="c-carousel-btn c-carousel-prev" aria-label="Anterior">‹</button>
<button class="c-carousel-btn c-carousel-next" aria-label="Siguiente">›</button>
```

### Wrapper y Track
```html
<div class="c-carousel-wrapper">
    <div class="c-carousel-track">
        <!-- Tarjetas aquí -->
    </div>
</div>
```

### Estructura de Cada Tarjeta
```html
<a href="/proyectos/[slug]/" class="c-project-card-grid" data-project="[slug]">
    <img src="/imagenes/..." alt="..." class="c-project-card-image-grid">
    <div class="c-project-card-content-grid">
        <h3>Título del Proyecto</h3>
        <p><strong>Tipo:</strong> ...</p>
        <p><strong>Ubicación:</strong> ...</p>
        <span class="c-button c-button-grid">Ver Proyecto</span>
    </div>
</a>
```

**Tarjetas actuales en el carousel:**
1. Arenales 742
2. Güemes 1768
3. Güemes 1853
4. Edificio Libera
5. Edificio Belgrano Office

---

## 🎨 2. ESTILOS CSS

### Contenedor del Carousel
```css
.c-carousel-container {
    position: relative;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 60px;
}
```

### Wrapper (Área con Overflow)
```css
.c-carousel-wrapper {
    position: relative;
    width: 100%;
    overflow: hidden;
}
```

### Track (Contenedor de Tarjetas)
```css
.c-carousel-track {
    display: flex;
    gap: 24px;
    width: fit-content;
    will-change: transform;
}

.c-carousel-track:hover {
    animation-play-state: paused; /* Pausa la animación al hacer hover */
}
```

### Estilos Específicos de Tarjetas en el Carousel
```css
.c-carousel-container .c-carousel-track .c-project-card-grid {
    width: 350px !important;
    min-width: 350px !important;
    max-width: 350px !important;
    flex-shrink: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    background-color: var(--c-white) !important;
    border-radius: var(--c-border-radius) !important;
    overflow: hidden !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
    text-decoration: none !important;
    color: inherit !important;
    position: relative !important;
    margin: 0 !important;
    padding: 0 !important;
    height: auto !important;
}
```

### Imagen de la Tarjeta
```css
.c-carousel-container .c-carousel-track .c-project-card-grid > img,
.c-carousel-container .c-carousel-track .c-project-card-grid > .c-project-card-image-grid {
    width: 100% !important;
    height: 250px !important;
    min-height: 250px !important;
    max-height: 250px !important;
    object-fit: cover !important;
    display: block !important;
    background-color: #f0f0f0 !important;
    flex-shrink: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
}
```

### Contenido de la Tarjeta
```css
.c-carousel-container .c-carousel-track .c-project-card-grid > .c-project-card-content-grid {
    display: flex !important;
    flex-direction: column !important;
    padding: var(--c-spacing-lg) !important;
    flex: 1 1 auto !important;
    gap: var(--c-spacing-sm) !important;
    width: 100% !important;
    box-sizing: border-box !important;
    margin: 0 !important;
}
```

### Botones de Navegación
```css
.c-carousel-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: var(--c-primary);
    color: var(--c-white);
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    font-size: 2em;
    cursor: pointer;
    z-index: 10;
    transition: all var(--c-transition-speed) ease;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
}

.c-carousel-btn:hover {
    background: var(--c-secondary);
    transform: translateY(-50%) scale(1.1);
}

.c-carousel-prev {
    left: 10px;
}

.c-carousel-next {
    right: 10px;
}
```

---

## ⚙️ 3. JAVASCRIPT - FUNCIONALIDAD

### Inicialización
**Ubicación:** `script.js` líneas 522-639

```javascript
const carouselContainer = document.querySelector('.c-carousel-container');
if (carouselContainer) {
    const track = carouselContainer.querySelector('.c-carousel-track');
    const prevBtn = carouselContainer.querySelector('.c-carousel-prev');
    const nextBtn = carouselContainer.querySelector('.c-carousel-next');
```

### Configuración de Dimensiones
```javascript
const cardWidth = 350;        // Ancho de cada tarjeta
const gap = 24;               // Espacio entre tarjetas
const cardTotalWidth = cardWidth + gap;  // Ancho total por tarjeta
const totalWidth = originalCards.length * cardTotalWidth;  // Ancho total del track
```

### Clonación de Tarjetas (Scroll Infinito)
```javascript
// Remover clones existentes
while (track.children.length > originalCount) {
    track.removeChild(track.lastChild);
}

// Obtener tarjetas originales (primeras 5)
const originalCards = Array.from(track.children).slice(0, originalCount);

// Clonar cada tarjeta para scroll infinito
originalCards.forEach(card => {
    const img = card.querySelector('img, .c-project-card-image-grid');
    const content = card.querySelector('.c-project-card-content-grid');
    
    if (img && content) {
        const clone = card.cloneNode(true);
        clone.style.display = 'flex';
        clone.style.flexDirection = 'column';
        track.appendChild(clone);
    }
});
```

### Animación CSS Dinámica
```javascript
// Crear animación única con ID dinámico
const animationId = 'cyc-carousel-' + Date.now();

const style = document.createElement('style');
style.id = 'cyc-carousel-style';
style.textContent = `
    .c-carousel-track {
        animation: ${animationId} 20s linear infinite;
    }
    @keyframes ${animationId} {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(-${totalWidth}px);
        }
    }
`;
document.head.appendChild(style);
```

**Características de la animación:**
- **Duración:** 20 segundos
- **Tipo:** Linear (velocidad constante)
- **Repetición:** Infinite (infinito)
- **Dirección:** De izquierda a derecha (translateX negativo)

### Navegación Manual
```javascript
function scrollCarousel(direction) {
    if (isAnimating) return;  // Prevenir múltiples clics
    isAnimating = true;
    
    track.style.animationPlayState = 'paused';  // Pausar animación automática
    
    if (direction === 'next') {
        currentPosition -= cardTotalWidth;  // Mover hacia la izquierda
    } else {
        currentPosition += cardTotalWidth;  // Mover hacia la derecha
    }
    
    // Lógica de bucle infinito
    if (currentPosition <= -totalWidth) {
        currentPosition = 0;  // Reset al inicio
        track.style.transition = 'none';
        track.style.transform = 'translateX(0)';
    } else if (currentPosition > 0) {
        currentPosition = -totalWidth + cardTotalWidth;  // Reset al final
        track.style.transition = 'none';
        track.style.transform = `translateX(${currentPosition}px)`;
    } else {
        track.style.transition = 'transform 0.5s ease';
        track.style.transform = `translateX(${currentPosition}px)`;
    }
    
    // Reanudar animación después de 500ms
    setTimeout(() => {
        isAnimating = false;
        track.style.animation = 'none';
        setTimeout(() => {
            track.style.animation = `${animationId} 20s linear infinite`;
            track.style.animationPlayState = 'running';
        }, 10);
    }, 500);
}
```

### Event Listeners
```javascript
prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    scrollCarousel('prev');
});

nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    scrollCarousel('next');
});
```

---

## 🎭 4. ANIMACIONES Y EFECTOS

### Animación Automática
- **Tipo:** CSS Keyframes
- **Duración:** 20 segundos por ciclo completo
- **Efecto:** Desplazamiento continuo de izquierda a derecha
- **Pausa:** Se pausa automáticamente al hacer hover sobre el track

### Animación Manual
- **Duración:** 0.5 segundos (500ms)
- **Easing:** ease
- **Efecto:** Desplazamiento suave al hacer clic en botones

### Efectos Hover
- **Track:** Pausa la animación automática
- **Tarjetas:** Transformación hacia arriba (`translateY(-8px)`) y sombra aumentada
- **Imagen:** Escala al 105% (`scale(1.05)`)
- **Botones:** Escala al 110% y cambio de color

---

## 📐 5. DIMENSIONES Y ESPACIOS

### Tarjetas
- **Ancho:** 350px (fijo)
- **Alto de imagen:** 250px (fijo)
- **Gap entre tarjetas:** 24px
- **Ancho total por tarjeta:** 374px (350px + 24px)

### Contenedor
- **Ancho máximo:** 1400px
- **Padding lateral:** 60px (para espacio de botones)

### Botones
- **Tamaño:** 50px × 50px
- **Posición:** Absoluta, centrada verticalmente
- **Izquierda/Derecha:** 10px desde el borde

---

## 🔄 6. FLUJO DE FUNCIONAMIENTO

1. **Carga de la página:**
   - JavaScript detecta el contenedor `.c-carousel-container`
   - Espera 300ms para asegurar que el DOM esté listo

2. **Inicialización:**
   - Obtiene las 5 tarjetas originales
   - Clona cada tarjeta para crear scroll infinito
   - Calcula dimensiones totales

3. **Animación automática:**
   - Crea keyframes CSS dinámicos
   - Aplica animación al track
   - El carousel se mueve automáticamente

4. **Interacción del usuario:**
   - **Hover:** Pausa la animación automática
   - **Click en botones:** Desplaza manualmente y reanuda animación
   - **Click en tarjeta:** Navega a la página del proyecto

---

## 🎯 7. CLASES CSS UTILIZADAS

### Contenedor
- `.c-carousel-container` - Contenedor principal
- `.c-carousel-wrapper` - Wrapper con overflow hidden
- `.c-carousel-track` - Track con las tarjetas

### Tarjetas
- `.c-project-card-grid` - Tarjeta individual
- `.c-project-card-image-grid` - Imagen de la tarjeta
- `.c-project-card-content-grid` - Contenido de la tarjeta
- `.c-button-grid` - Botón "Ver Proyecto"

### Navegación
- `.c-carousel-btn` - Botón de navegación base
- `.c-carousel-prev` - Botón anterior
- `.c-carousel-next` - Botón siguiente

---

## 🛠️ 8. VARIABLES CSS UTILIZADAS

```css
--c-spacing-md    /* Espaciado medio */
--c-spacing-lg    /* Espaciado grande */
--c-spacing-sm    /* Espaciado pequeño */
--c-primary       /* Color primario (azul) */
--c-secondary     /* Color secundario (naranja) */
--c-white         /* Color blanco */
--c-border-radius /* Radio de borde */
--c-transition-speed /* Velocidad de transición */
```

---

## 📝 9. NOTAS IMPORTANTES

1. **Scroll Infinito:** Se logra clonando las tarjetas originales
2. **Validación:** Antes de clonar, verifica que la tarjeta tenga imagen y contenido
3. **ID Único:** La animación CSS usa un ID único basado en timestamp para evitar conflictos
4. **Prevención de Duplicados:** Elimina clones existentes antes de crear nuevos
5. **Delay de Inicialización:** Usa `setTimeout(300ms)` para asegurar que el DOM esté listo
6. **Compatibilidad:** Usa las mismas clases que las tarjetas del grid para mantener consistencia

---

## 🔍 10. BÚSQUEDA RÁPIDA

Para encontrar código relacionado con el carousel, busca:
- `carousel` (case-insensitive)
- `.c-carousel-`
- `c-carousel-track`
- `scrollCarousel`
- `animationId`

---

## 📊 Resumen de Ubicaciones

| Componente | Archivo | Líneas |
|------------|---------|--------|
| HTML Estructura | `homepage_content.html` | 94-151 |
| CSS Estilos | `style.css` | 369-490 |
| JavaScript Lógica | `script.js` | 522-639 |
| Estilos Grid Cards | `style.css` | 552-650 |

---

¿Necesitas modificar algo específico del carousel? Avísame qué quieres cambiar.

