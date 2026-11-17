# Portal de Teoría de Compiladores

Portal web educativo sobre **Teoría de Compiladores**, hecho solo con HTML5, CSS3 y JavaScript (sin frameworks ni dependencias).

**Actividad 12: Creación del Portal Web** · Teoría de Autómatas y Compiladores (TI3310-01), sección 1 · Profesor: Santiago Ramirez · Entrega: 17/11/2026

**Equipo:** Karla Báez (25-0661), Sara Mendoza (25-0444), Luis Merejildo (25-0620), Victor Olmo (25-1007) y Rosalía Robles (25-0566).

**Sitio publicado:** https://karlamaila.github.io/portal-teoria-compiladores/

## Secciones

| Archivo | Contenido |
| --- | --- |
| `index.html` | Portada con buscador, tarjetas de categorías, participantes, centro de conocimiento y datos del proyecto |
| `compiladores.html` | Compilador vs intérprete, historia, jerarquía de Chomsky, AFD y árbol de derivación en SVG, ejemplo de Tetris como pila |
| `estructura.html` | Front-end, middle-end y back-end, tabla de símbolos, errores, IR, pasadas, bootstrapping y diagramas T |
| `fases.html` | Las seis fases con un ejemplo único (`resultado = precio * 2 + impuesto;`) y stepper interactivo |
| `codigo-intermedio.html` | IR, tres direcciones, cuádruplas, SSA, optimización, código final, enlazado y carga |
| `compiladores-actuales.html` | Catálogo de 15 compiladores con filtros por tipo y búsqueda |
| `extras.html` | Analizador léxico interactivo, glosario, línea de tiempo, quiz y herramientas |
| `referencias.html` | Referencias en formato APA 7 |

Otras funciones: modo claro/oscuro (respeta la preferencia del sistema), menú móvil accesible, buscador global, botón «Volver arriba» y botón «Copiar» en los bloques de código.

## Estructura de archivos

```
/index.html
/compiladores.html
/estructura.html
/fases.html
/codigo-intermedio.html
/compiladores-actuales.html
/extras.html
/referencias.html
/css/styles.css
/js/main.js
/README.md
/.gitignore
```

## Cómo abrirlo en local

No necesita servidor ni instalación. Haz doble clic en `index.html` y se abrirá en tu navegador. Todas las rutas son relativas, así que funciona igual desde una carpeta del computador que desde GitHub Pages.

La fuente (Poppins y JetBrains Mono) se descarga de Google Fonts. Sin conexión se usan fuentes del sistema y el portal se ve igual de bien.

## Marcadores por rellenar

Los datos de los integrantes, la sección, el profesor y la fecha de entrega ya están completos. Quedan estos marcadores, fáciles de buscar con `Ctrl + F` o con «Buscar en archivos» del editor:

| Marcador | Dónde está |
| --- | --- |
| `[NOMBRE DEL EQUIPO]` | `index.html` (tarjeta «Sobre el proyecto») |
| `[NOMBRE DE LA UNIVERSIDAD]` | `index.html` (tarjeta «Sobre el proyecto») |
| `[FECHA DE CONSULTA]` | `referencias.html` (nota inicial) |

Los marcadores se resaltan en amarillo en la página para que no se olviden. Al reemplazarlos, quita también la clase `ph` del `<span>` que los envuelve si quieres que el resaltado desaparezca.

Los participantes están en `index.html`, cada uno dentro de un bloque marcado con un comentario HTML (`<!-- Integrante N -->`). Para añadir otro, duplica el bloque `<li class="member">…</li>`; para quitar uno, bórralo. Las iniciales del avatar se generan solas en JavaScript a partir del nombre.

## Cómo publicar cambios

```bash
git add .
git commit -m "docs: actualizar datos del equipo"
git push
```

## GitHub Pages

1. En el repositorio, ve a **Settings → Pages**.
2. En **Build and deployment**, elige **Deploy from a branch**.
3. Selecciona la rama `main` y la carpeta `/ (root)`, y pulsa **Save**.
4. Tras un par de minutos, el sitio queda en `https://karlamaila.github.io/portal-teoria-compiladores/`.

## Créditos y licencia de contenido

Contenido redactado para una actividad universitaria. Las fuentes consultadas están en `referencias.html`. Los íconos e ilustraciones son SVG propios, sin imágenes externas.
