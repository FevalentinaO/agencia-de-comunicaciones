# Talitha · Comunicación Estratégica

Sitio web de Talitha, construido sobre su manual de identidad v1.0.
Next.js (App Router) + TypeScript + Tailwind v4.

## Correr el proyecto

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Identidad aplicada

- **Color** (tokens en `app/globals.css`): azul medianoche `#1E2440` (base y texto),
  primera luz `#C8963A` (acento: trazo, sello, números grandes; nunca superficies de
  texto), bruma `#B5B3C3` (filetes), papel marfil `#F4EFE6` (fondo). Para texto
  pequeño dorado se usa `#7D5A1C` (contraste AA sobre marfil).
- **Tipografía**: Cormorant Garamond (regular e itálica, sin negritas) para titulares
  y logotipo; Lora para párrafos y para el descriptor en versales espaciadas.
- **Logotipo**: `components/Logo.tsx` reproduce el sello (arco, trazo largo, curva y
  dos gotas) con la construcción del manual. Versión horizontal, claro/oscuro.
- **Reglas de uso**: sin sombras ni efectos sobre el logo, terminaciones redondas,
  filete en bruma. Botones planos con filete; sin neumorfismo.
- **Voz**: frases cortas, sin fórmulas vacías ni lenguaje corporativo.

## Páginas

| Ruta | Contenido |
|---|---|
| `/` (Home) | Hero, esencia y pilares, galerías con globo interactivo, llamada a contacto |
| `/trayectoria` | Tres propuestas de galería (parallax 3D, bento, WebGL con scroll) |
| `/servicios` | Pendiente |
| `/contacto` | Formulario conectado a Google Sheets y Gmail |

## Contenido editable

- Pines y fotos del globo: `lib/galerias.ts` y `public/images/galerias/<pin>/`.
- Fotos de Trayectoria: `lib/trayectoria.ts` y `public/images/trayectoria/`.

## Formulario de contacto

`app/api/contact/route.ts`: validación con Zod, honeypot, límite por IP,
`Promise.allSettled` hacia Google Sheets (service account) y Gmail (OAuth2 con
Nodemailer). Variables en `.env.example`:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEET_ID=
GMAIL_USER=
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REFRESH_TOKEN=
CONTACT_TO_EMAIL=
```
