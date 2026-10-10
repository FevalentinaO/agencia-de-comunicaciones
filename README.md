# Caro & Diana — AGENCIA DE COMUNICACIONES

Inicio (hero) de la web de la agencia. Next.js (App Router) + TypeScript + Tailwind v4 + GSAP.

## Correr el proyecto

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

```bash
npm run build && npm start   # build de producción
```

## Configurar Google Sheets + Gmail (formulario de contacto)

1. **Service account de Google Cloud:**
   - Crea un proyecto en [Google Cloud Console](https://console.cloud.google.com/), habilita la **Google Sheets API**.
   - Crea una *service account*, genera una clave JSON.
   - Comparte tu Google Sheet (modo edición) con el correo de la service account (`xxx@xxx.iam.gserviceaccount.com`).
   - Copia a `.env.local`: `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` (el `private_key` del JSON, con los `\n` literales), `GOOGLE_SHEET_ID` (el ID en la URL de la hoja).

2. **Gmail (OAuth2):**
   - Se eligió **Nodemailer + OAuth2 sobre Gmail** en vez de llamar la Gmail API directo: menos código, misma seguridad, y Nodemailer maneja el armado MIME.
   - Crea credenciales OAuth2 (tipo *Desktop app*) en Cloud Console, habilita la Gmail API.
   - Genera un `refresh_token` una vez (OAuth Playground o un script local) autorizando el scope `https://mail.google.com/`.
   - Completa `GMAIL_USER`, `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`, `CONTACT_TO_EMAIL`.

Copia `.env.example` a `.env.local` y rellena los valores. Nunca subas `.env.local`.

## Decisiones de diseño donde la referencia era ambigua

- **Menú duplicado:** la referencia repite la nav arriba y en medio del hero. Se dejó **una sola nav**, flotante y sticky — la repetición es ruido.
- **"Directores" → "Directoras":** corregido a femenino, como pide el prompt.
- **Logos de Google:** no se usan como marca. El bloque de contacto usa iconos propios (sobre, hoja de cálculo) con el mismo lenguaje neumórfico, sin asociar la UI a Google.
- **Botones "Animaciones/Fotos":** retirados del hero por decisión de diseño; el portafolio se accede desde la nav.
- **Foto:** tarjeta neumórfica redondeada más baja que la imagen, para que las cabezas sobresalgan del marco. Detrás, dos anillos de línea de 1px anclados a la izquierda, uno con un punto en órbita lenta. Sin `clip-path` (el `box-shadow` sigue la caja rectangular, no el recorte, y ensuciaba la silueta).

## Rendimiento

Lighthouse (mobile, build de producción, local): **Performance 96 · Accessibility 100 · Best Practices 100 · SEO 100.** CLS 0, TBT ~130ms.

Puntos clave para mantenerlo así:
- La foto del hero (candidata a LCP) **nunca anima opacidad** — permanece visible desde el primer paint y solo rota/traslada en 3D al entrar. Ocultarla con `opacity`/`visibility` hasta que GSAP corra agrega cientos de ms al LCP real.
- Los demás elementos de entrada (blobs, líneas de título, nav, quicklinks, contacto) se ocultan por **stylesheet** (`opacity:0` en `globals.css`), no por una clase que tape toda la página — así no se retrasa el pintado del LCP mientras se evita el flash de contenido sin animar.
- Formas orgánicas y sombras: CSS/SVG, cero PNG decorativo.
- `next/font` con `display: swap`, subset `latin`.
- `fetchPriority="high"` explícito en la imagen del hero (en Next 16 ya no se infiere solo de `priority`).

## Estructura

```
app/
  layout.tsx          # fuentes, metadata
  page.tsx             # ensambla Nav + Hero + ContactBar
  globals.css          # tokens neumórficos, utilidades .neu-*, anillos
  api/contact/route.ts # Zod + Sheets + Gmail + rate limit + honeypot
components/
  AnimatedPage.tsx     # "use client": timeline GSAP + parallax de mouse
  Nav.tsx
  Hero.tsx
  OrganicFrame.tsx     # foto pop-out + anillos de línea
  ContactBar.tsx       # "use client": formulario
  BackgroundBlobs.tsx
lib/
  validation.ts         # Zod
  google.ts             # clientes Sheets/Gmail
  rate-limit.ts         # limitador en memoria por IP (por instancia; para
                          # multi-instancia real usar Redis o similar)
```
