# 🎓 Mi Graduación - Landing Page

## Estructura de archivos

```
graduacion/
├── index.html                  ← página principal
├── css/
│   └── styles.css
├── js/
│   ├── countdown.js            ← cuenta regresiva
│   └── form.js                 ← lógica del formulario
├── images/                     ← ACÁ VAN TUS IMÁGENES
│   ├── fondo.png               ← imagen de fondo (textura papel)
│   ├── logo-mi-graduacion.png  ← el título "Mi Graduación" con birrete
│   ├── ilustracion-graduada.png← la chica con toga (hero desktop)
│   └── ilustracion-lograste.png← la chica en el podio (pantalla confirmación)
└── GOOGLE_APPS_SCRIPT.js       ← código para Google Sheets
```

---

## 🖼️ Paso 1: Agregar tus imágenes

Copiá tus imágenes a la carpeta `images/` con estos nombres exactos:

| Archivo                      | Qué es                                  |
|------------------------------|-----------------------------------------|
| `fondo.png`                  | La textura de papel de fondo            |
| `logo-mi-graduacion.png`     | El logo "Mi Graduación" con birrete     |
| `ilustracion-graduada.png`   | Chica con toga (aparece en desktop)     |
| `ilustracion-lograste.png`   | Chica en el podio "Lo lograste"         |

Si tus imágenes tienen otros nombres, podés cambiarlos en `index.html`.

---

## 📊 Paso 2: Configurar Google Sheets

1. Creá un Google Sheet nuevo (o usá uno existente)
2. Abrilo y andá al menú: **Extensiones → Apps Script**
3. Borrá el código por defecto y pegá el contenido de `GOOGLE_APPS_SCRIPT.js`
4. Guardá con **Ctrl+S** y poné un nombre al proyecto (ej: "Confirmaciones Graduación")
5. Hacé click en **Implementar → Nueva implementación**
6. Configurá:
   - Tipo: **Aplicación web**
   - Ejecutar como: **Yo (tu email)**
   - Quién tiene acceso: **Cualquier persona**
7. Hacé click en **Implementar** (puede pedir que autorices permisos — aceptá)
8. **Copiá la URL** que aparece (empieza con `https://script.google.com/macros/s/...`)
9. Pegá esa URL en `js/form.js`, en la línea:
   ```js
   const APPS_SCRIPT_URL = 'PEGÁ TU URL ACÁ';
   ```

### ¿Cómo se ve el Sheet cuando alguien confirma?
La primera vez se crean los encabezados automáticamente:
| Nombre | Apellido | Asistencia | Fecha y Hora |
|--------|----------|------------|--------------|
| María  | García   | Sí asisto  | 11/3/2025, 14:30:00 |
| Juan   | López    | No puedo   | 11/3/2025, 15:00:00 |

---

## 🚀 Paso 3: Deploy en Vercel

### Opción A: Drag & Drop (más fácil)
1. Andá a [vercel.com](https://vercel.com) y logueate
2. En el dashboard, hacé click en **Add New → Project**
3. Elegí **"Import Third-Party Git Repository"** o simplemente arrastrá la carpeta del proyecto

### Opción B: Con Vercel CLI
```bash
npm i -g vercel
cd graduacion/
vercel
```
Seguí los pasos que te indica. Para un sitio HTML estático, Vercel lo detecta solo.

---

## ✏️ Personalizaciones comunes

### Cambiar la fecha del evento
En `js/countdown.js`, línea 7:
```js
const FECHA_EVENTO = new Date('2025-04-11T21:00:00');
// Formato: AÑO-MES-DÍATHORARIO:MINUTOS:SEGUNDOS
```

### Cambiar fecha límite de confirmación
En `index.html`, buscá:
```html
Por favor, confirmanos tu asistencia antes del 4 de Abril.
```

### Cambiar la dirección del mapa
En `index.html` y `js/form.js`, buscá `maps.google.com/?q=` y cambiá la dirección.

### Cambiar el link de regalo
En `index.html`, buscá `kmariescurrena.nx` y cambiá por tu link real.

---

## 🎨 Colores del diseño

| Variable      | Color       | Uso                      |
|---------------|-------------|--------------------------|
| `--teal`      | `#2a9d8f`   | Botones principales, títulos |
| `--pink`      | `#c87b8a`   | Acentos, textos especiales   |
| `--pink-btn`  | `#c47a89`   | Botón "Sí asisto" y modales  |
| `--bg`        | `#f0ede8`   | Fondo general                |

Podés cambiarlos en `css/styles.css`, sección `:root`.
