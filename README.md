# UN DIEZ — Landing Page

Landing page de "UN DIEZ" (hamburguesas, venta directa de fábrica, Villa Ballester). Sitio estático (HTML + Tailwind CSS vía CDN + JavaScript vanilla + AOS para animaciones on-scroll), sin build ni dependencias — listo para desplegar gratis.

## Estructura

```
index.html      → toda la página
script.js       → lógica de WhatsApp (mensajes por combo), QR e inicialización de AOS
assets/         → logo y fotos de producto
```

## Notas de diseño

- **Logo recortado**: `assets/logo-un-diez.png` trae un fondo cuadrado con una cuadrícula de "falsa transparencia" (son píxeles opacos, no transparencia real). Se resuelve 100% con CSS: la clase `.logo-badge` (en `index.html`) envuelve cada uso del logo en un contenedor circular con `overflow: hidden` y la imagen escalada (`transform: scale(1.08)`) para que ese sobrante quede siempre fuera del círculo visible. Se usa en el header, el hero y el footer.
- **Animaciones**: scroll-reveal con [AOS](https://michalsnik.github.io/aos/) (`data-aos="..."` en las secciones), efecto de levitación continua en el logo del hero (`.float-anim`), hover 3D en tarjetas de combos y galería (`.card-hover`, con elevación + sombra de color), y botón flotante de WhatsApp con halo pulsante (`.pulse-ring`).

## Correr en local

No hace falta instalar nada. Con Python:

```bash
python -m http.server 8000
```

o con Node:

```bash
npx serve .
```

Después abrí `http://localhost:8000`.

## Deploy gratis

### Opción A: GitHub Pages

1. Subí este repo a GitHub.
2. Andá a **Settings → Pages**.
3. En "Build and deployment" elegí **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
4. Guardá. El sitio queda publicado en `https://<usuario>.github.io/<repo>/`.

### Opción B: Vercel

1. Importá el repo en [vercel.com/new](https://vercel.com/new).
2. Framework preset: **Other** (sitio estático, no requiere build command).
3. Deploy. Vercel te da la URL al toque.

## Configuración de WhatsApp

El número y los mensajes predefinidos están en `script.js`:

- `WHATSAPP_NUMBER`: número de WhatsApp (`5491132644106`).
- Botón genérico (header, hero, footer): mensaje fijo de saludo.
- Botones de cada combo: arman el mensaje incluyendo el combo elegido, para que el cliente solo tenga que completar su dirección.
- El código QR se genera dinámicamente apuntando al mismo link de WhatsApp genérico.

## Contenido a actualizar a futuro

- Precios de los combos (`index.html`, sección `#combos`).
- Fotos de producto en `assets/` (se usaron fotos existentes del emprendimiento).
