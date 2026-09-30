# UN DIEZ — landing page

Sitio estático (HTML + Tailwind CDN + JS vanilla, sin build) para "UN DIEZ", venta directa de fábrica de hamburguesas en Villa Ballester. Repo: `samuelsoveron-stack/un-diez`. Producción: `https://un-diez.vercel.app` (proyecto `un-diez`, team `undiez` en Vercel).

## ⚠️ Antes de tocar nada relacionado con "mayoristas" o "revendedores"

Son **dos programas distintos** — no asumir que son lo mismo:

- **Mayoristas** = página de precios por bulto para negocios. Se eliminó a propósito (commit `aec1eb5`, 2026-09-29) y **no vuelve a la web** — esos precios ahora se comparten por privado.
- **Revendedores** = programa activo de personas individuales con link propio (`?ref=<id>`) que redirige el WhatsApp de todo el sitio a su número. Vive en [script.js](script.js) (`gestionarRevendedor`, `buildWhatsAppUrl`) + banner en [index.html](index.html) (`#revendedor-banner`) + una Google Sheet publicada como CSV que el dueño edita él mismo para dar altas/bajas, sin deploy.

**Esto ya se rompió una vez**: una sesión de Claude, al recibir el pedido "eliminar todo lo relacionado con mayorista", interpretó por su cuenta que el sistema de revendedores "era lo mismo en esencia" y lo borró también, sin confirmar ese alcance. El dueño no se dio cuenta hasta que las altas nuevas de la planilla dejaron de funcionar. Se restauró en el commit `0b9534a`.

**Regla:** si te piden tocar "mayoristas", NO toques nada de `?ref=`, `gestionarRevendedor`, el banner de revendedor, ni la planilla — son cosas separadas. Si hay ambigüedad, preguntar antes de borrar.

## Deploy

La integración Git↔Vercel de este proyecto quedó mal conectada (autorizada con otra cuenta de GitHub del usuario, `familiadehaburguesa-creator`, por una sesión que trabajó este repo desde la carpeta equivocada). Hasta que eso se resuelva a mano en el dashboard de Vercel, **`git push` NO dispara deploy automático**. Deployar así:

```bash
export VERCEL_TOKEN="<token del usuario, ver vercel.com/account/tokens>"
npx --yes vercel@latest --prod --token="$VERCEL_TOKEN" --yes
```

Además hacer `git add` + `git commit` + `git push origin master` como siempre, para mantener el historial — solo no esperar que el push solo ya publique.

## Carpeta

`C:\Users\Samuel\OneDrive\Escritorio\C  L  I  E  N  T  E  S\UN DIEZ` (ojo: "C L I E N T E S" con espacios dobles entre letras, es el nombre real).

**Si esta sesión no está corriendo en esta carpeta, no toques este repo.** El cruce de sesiones (una sesión de otro proyecto del mismo usuario editando este repo por tener la ruta a mano) es exactamente lo que causó el incidente de arriba.

## Estructura

- `index.html` — single-page completa (hero, combos, galería de clientes, envíos, footer).
- `script.js` — WhatsApp dinámico (revendedores), carrusel, carrito, lightbox de galería, badge de horario.
- `assets/` — fotos reales del usuario. No inventar ni usar stock.
- `manifest.json`, `sw.js`, `icons/` — PWA.
- `qr-share/` — QRs generados para difusión (no forma parte del sitio servido).

## Preferencias del usuario

- Verificar en el navegador (mobile y desktop) antes de dar un cambio por terminado.
- Cambios de precio/mínimos de compra: confirmar antes de aplicar, son números de negocio.
- No inventar fotos ni contenido — todo el material visual sale de lo que el usuario mandó.
