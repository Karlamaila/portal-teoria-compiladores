/* ==========================================================================
   Portal de Teoría de Compiladores — JavaScript principal (vanilla, ES6+)
   Estructura: datos -> utilidades -> módulos (cada uno se activa solo si
   existen sus elementos en la página) -> arranque.
   ========================================================================== */
(function () {
  "use strict";

  /* ======================================================================
     1. DATOS (índice de búsqueda, compiladores, glosario, quiz)
     ====================================================================== */

  /** Secciones del portal (también alimentan el buscador). */
  const SECTIONS = [
    { title: "Compiladores", url: "compiladores.html", desc: "Qué es un compilador, diferencia con intérpretes y vínculo con autómatas y lenguajes formales. Jerarquía de Chomsky, expresiones regulares, AFD, gramáticas libres de contexto." },
    { title: "Estructura", url: "estructura.html", desc: "Front-end, middle-end y back-end; tabla de símbolos, manejador de errores, representación intermedia, pasadas, bootstrapping y diagrama T." },
    { title: "Fases", url: "fases.html", desc: "Léxico, sintáctico, semántico, código intermedio, optimización y código final con un único ejemplo recorrido." },
    { title: "Código intermedio", url: "codigo-intermedio.html", desc: "IR, código de tres direcciones, cuádruplas, SSA, bytecode, LLVM IR, optimización, enlazado y carga." },
    { title: "Compiladores actuales", url: "compiladores-actuales.html", desc: "GCC, Clang/LLVM, MSVC, rustc, Go, HotSpot, Roslyn, V8, TypeScript, Swift, Kotlin, CPython, GraalVM, Babel." },
    { title: "Extras", url: "extras.html", desc: "Demo de analizador léxico, glosario, línea de tiempo, quiz y herramientas para construir compiladores." },
    { title: "Referencias", url: "referencias.html", desc: "Fuentes en formato APA 7: libros clásicos y documentación oficial." },
  ];

  /** Compiladores (tarjetas y filtros de compiladores-actuales.html). */
  const COMPILERS = [
    { id: "gcc", name: "GCC", langs: "C, C++, Fortran, Ada, entre otros", org: "Proyecto GNU", types: ["AOT"], platforms: "Linux, BSD, Windows (MinGW), macOS", note: "Una familia de front-ends de varios lenguajes con back-ends para muchas arquitecturas." },
    { id: "clang", name: "Clang / LLVM", langs: "C, C++, Objective-C", org: "Proyecto LLVM", types: ["AOT"], platforms: "Linux, macOS, Windows, BSD", note: "Clang es el front-end; genera LLVM IR y el back-end de LLVM produce el código máquina." },
    { id: "msvc", name: "MSVC", langs: "C, C++", org: "Microsoft", types: ["AOT"], platforms: "Windows (x86, x64, ARM64)", note: "Compilador de Visual Studio; es el predeterminado para programar en C++ nativo en Windows." },
    { id: "rustc", name: "rustc", langs: "Rust", org: "Proyecto Rust", types: ["AOT"], platforms: "Multiplataforma", note: "Comprueba propiedad y préstamos (borrow checker) en compilación y usa LLVM como back-end principal." },
    { id: "go", name: "Go (gc)", langs: "Go", org: "Equipo de Go (Google)", types: ["AOT"], platforms: "Linux, macOS, Windows y más", note: "Compila muy rápido y produce binarios estáticos sin necesidad de una máquina virtual." },
    { id: "hotspot", name: "javac + HotSpot", langs: "Java", org: "Oracle / OpenJDK", types: ["Bytecode", "JIT"], platforms: "Multiplataforma (JVM)", note: "javac genera bytecode; la JVM HotSpot lo interpreta y compila a código nativo las partes más usadas." },
    { id: "roslyn", name: "Roslyn", langs: "C#, Visual Basic", org: "Microsoft / .NET", types: ["Bytecode", "JIT"], platforms: "Multiplataforma (.NET)", note: "Compila a CIL (código intermedio de .NET); el runtime lo compila a nativo. Expone el compilador como API." },
    { id: "v8", name: "V8", langs: "JavaScript, WebAssembly", org: "Google", types: ["JIT"], platforms: "Chrome, Node.js, Deno", note: "Combina un intérprete (Ignition) con un compilador optimizador (TurboFan)." },
    { id: "tsc", name: "TypeScript (tsc)", langs: "TypeScript", org: "Microsoft", types: ["Transpilador"], platforms: "Multiplataforma (Node.js)", note: "Verifica tipos estáticos y emite JavaScript; los tipos se eliminan al generar la salida." },
    { id: "swift", name: "Swift", langs: "Swift", org: "Apple", types: ["AOT"], platforms: "Plataformas Apple, Linux, Windows", note: "Usa LLVM y su propia representación intermedia (SIL) para optimizar antes de generar código." },
    { id: "kotlin", name: "Kotlin", langs: "Kotlin", org: "JetBrains", types: ["Bytecode", "Transpilador", "AOT"], platforms: "JVM, JavaScript, nativo, WebAssembly", note: "Un mismo lenguaje con varios destinos: bytecode de JVM, JavaScript o código nativo." },
    { id: "cpython", name: "CPython", langs: "Python", org: "Python Software Foundation", types: ["Bytecode"], platforms: "Multiplataforma", note: "Compila el código fuente a bytecode y lo ejecuta en su máquina virtual; se puede inspeccionar con el módulo dis." },
    { id: "pypy", name: "PyPy", langs: "Python", org: "Proyecto PyPy", types: ["JIT"], platforms: "Multiplataforma", note: "Implementación alternativa de Python con compilador JIT que acelera programas de ejecución larga." },
    { id: "graalvm", name: "GraalVM", langs: "Java y otros lenguajes JVM; JavaScript, Python, Ruby", org: "Oracle", types: ["JIT", "AOT"], platforms: "Linux, macOS, Windows", note: "Incluye un compilador JIT escrito en Java y Native Image para compilar aplicaciones antes de ejecutarlas." },
    { id: "babel", name: "Babel", langs: "JavaScript moderno, JSX", org: "Comunidad de código abierto", types: ["Transpilador"], platforms: "Multiplataforma (Node.js)", note: "Transforma sintaxis reciente de JavaScript a versiones compatibles con más navegadores." },
  ];

  /** Glosario (extras.html). */
  const GLOSSARY = [
    { t: "AFD / AFND", d: "Autómata finito determinista o no determinista. Reconocen lenguajes regulares y son la base teórica del análisis léxico." },
    { t: "Ambigüedad", d: "Una gramática es ambigua si una misma cadena tiene más de un árbol de derivación. Los compiladores la eliminan o la resuelven con reglas de precedencia." },
    { t: "AOT (Ahead-Of-Time)", d: "Compilación completa a código nativo antes de ejecutar el programa." },
    { t: "AST (árbol de sintaxis abstracta)", d: "Árbol que representa la estructura del programa sin los detalles superficiales como paréntesis o punto y coma." },
    { t: "Autómata de pila", d: "Autómata con una pila como memoria. Reconoce lenguajes libres de contexto y modela el funcionamiento del analizador sintáctico." },
    { t: "Backtracking", d: "Retroceso: probar una alternativa de análisis y, si falla, volver atrás para intentar otra. Es costoso, por eso se prefieren gramáticas que no lo necesiten." },
    { t: "BNF", d: "Notación de Backus-Naur: forma estándar de escribir las reglas de una gramática libre de contexto." },
    { t: "Bootstrapping", d: "Escribir un compilador en el mismo lenguaje que compila, de modo que pueda compilarse a sí mismo." },
    { t: "Bytecode", d: "Código intermedio compacto pensado para ejecutarse en una máquina virtual (por ejemplo, la JVM o la VM de Python)." },
    { t: "Cross-compiler (compilador cruzado)", d: "Compilador que se ejecuta en una plataforma pero genera código para otra distinta." },
    { t: "Expresión regular", d: "Notación compacta para describir patrones de texto; define lenguajes regulares y se usa para especificar tokens." },
    { t: "Front-end / back-end", d: "El front-end analiza el programa fuente (léxico, sintáctico, semántico). El back-end genera y optimiza el código para una máquina concreta." },
    { t: "Gramática de atributos", d: "Gramática libre de contexto con valores (atributos) asociados a los símbolos, usada para describir el análisis semántico." },
    { t: "Gramática libre de contexto (GLC)", d: "Conjunto de reglas de producción donde el lado izquierdo es un único no terminal. Describe la sintaxis de la mayoría de los lenguajes de programación." },
    { t: "IR (representación intermedia)", d: "Forma del programa independiente del lenguaje fuente y de la máquina destino que usan las fases intermedias del compilador." },
    { t: "JIT (Just-In-Time)", d: "Compilación a código nativo durante la ejecución, aprovechando información de cómo se está usando el programa." },
    { t: "Lexema", d: "Secuencia concreta de caracteres del código fuente que coincide con el patrón de un token, por ejemplo precio." },
    { t: "Linker (enlazador)", d: "Programa que une archivos objeto y bibliotecas en un único ejecutable, resolviendo las referencias entre ellos." },
    { t: "LL(1)", d: "Familia de analizadores descendentes que leen la entrada de izquierda a derecha, derivan por la izquierda y usan un símbolo de anticipación." },
    { t: "Loader (cargador)", d: "Parte del sistema operativo que coloca el ejecutable en memoria y lo prepara para correr." },
    { t: "LR", d: "Familia de analizadores ascendentes que construyen el árbol desde las hojas. Reconocen más gramáticas que LL; Bison genera analizadores de esta familia." },
    { t: "Optimización", d: "Transformaciones que mejoran velocidad, tamaño o consumo de energía del programa sin cambiar su comportamiento observable." },
    { t: "Parser (analizador sintáctico)", d: "Fase que verifica que la secuencia de tokens cumple la gramática y construye un árbol de derivación o un AST." },
    { t: "SSA (asignación estática única)", d: "Forma de IR en la que cada variable se asigna exactamente una vez; facilita muchas optimizaciones. LLVM IR está en esta forma." },
    { t: "Tabla de símbolos", d: "Estructura que guarda información de cada identificador (tipo, ámbito, posición) y que consultan todas las fases." },
    { t: "Terminal / no terminal", d: "Los terminales son los símbolos básicos que aparecen en el programa (tokens). Los no terminales son categorías sintácticas que se definen con reglas." },
    { t: "Token", d: "Unidad léxica mínima con significado: un par formado por un tipo (como identificador o número) y, a menudo, su lexema." },
    { t: "Transpilador", d: "Compilador que traduce de un lenguaje de alto nivel a otro de nivel similar, por ejemplo de TypeScript a JavaScript." },
  ];

  /** Quiz (extras.html). answer = índice de la opción correcta. */
  const QUIZ = [
    { q: "¿Qué tipo de autómata se usa como base teórica del análisis léxico?", o: ["Autómata de pila", "Autómata finito", "Máquina de Turing", "Autómata linealmente acotado"], a: 1, e: "Los tokens se describen con expresiones regulares, que equivalen a autómatas finitos." },
    { q: "¿Qué fase recibe una secuencia de tokens y verifica que respete la gramática?", o: ["Análisis léxico", "Análisis sintáctico", "Optimización", "Generación de código final"], a: 1, e: "El analizador sintáctico (parser) comprueba la estructura con una gramática libre de contexto." },
    { q: "Si tienes N lenguajes fuente y M máquinas destino, ¿cuántos compiladores necesitas con una IR común?", o: ["N × M", "N + M", "N − M", "Siempre uno"], a: 1, e: "Con IR se escriben N front-ends y M back-ends, en lugar de N×M compiladores completos." },
    { q: "¿Cuál es la diferencia principal entre un compilador y un intérprete clásico?", o: ["El compilador traduce el programa antes de ejecutarlo; el intérprete lo ejecuta mientras lo lee", "El intérprete siempre es más rápido", "El compilador no detecta errores", "No hay ninguna diferencia"], a: 0, e: "Existen enfoques híbridos (bytecode + VM, JIT) que combinan ambas ideas." },
    { q: "¿Qué hace la optimización de plegado de constantes (constant folding)?", o: ["Elimina variables sin usar", "Calcula en compilación expresiones con valores conocidos, como 3 * 4", "Repite el cuerpo de un bucle", "Convierte código a bytecode"], a: 1, e: "Por ejemplo, x = 3 * 4 + y se transforma en x = 12 + y." },
    { q: "¿Qué significa que un compilador haga bootstrapping?", o: ["Que se ejecuta sin sistema operativo", "Que está escrito en el lenguaje que compila y puede compilarse a sí mismo", "Que solo compila código de arranque", "Que genera código para varias arquitecturas"], a: 1, e: "Típicamente se parte de una versión mínima o de un compilador previo para compilar la primera versión." },
    { q: "¿Cuál de estos compiladores genera bytecode que luego ejecuta una máquina virtual con JIT?", o: ["GCC", "javac con la JVM HotSpot", "rustc", "Go (gc)"], a: 1, e: "javac produce bytecode y HotSpot compila a nativo las partes más ejecutadas." },
    { q: "En el ejemplo resultado = precio * 2 + impuesto;, ¿qué detecta el análisis semántico?", o: ["Que falta un punto y coma", "Que los tipos son compatibles y que 2 debe convertirse a float", "Que * tiene mayor precedencia que +", "Que resultado es una palabra reservada"], a: 1, e: "La verificación de tipos y las conversiones implícitas son tarea del análisis semántico." },
  ];

  /** Ejemplos precargados del analizador léxico. */
  const LEXER_EXAMPLES = [
    { label: "Asignación", code: "resultado = precio * 2 + impuesto;" },
    { label: "Condicional", code: "if (x >= 10) {\n  return x - 1;\n} else {\n  x = x + 1; // incrementa\n}" },
    { label: "Con error", code: "int a = 5 @ 3;\nfloat b = 2.5 # 1;" },
  ];

  /* ======================================================================
     2. UTILIDADES
     ====================================================================== */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /** Quita acentos y pasa a minúsculas para comparar texto. */
  const norm = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  /** Almacenamiento seguro: localStorage puede fallar (modo privado, file://, etc.). */
  const store = {
    get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* sin persistencia */ } },
  };

  const create = (tag, props = {}, children = []) => {
    const el = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (k === "class") el.className = v;
      else if (k === "text") el.textContent = v;
      else el.setAttribute(k, v);
    });
    children.forEach((c) => el.append(c));
    return el;
  };

  /* ======================================================================
     3. MÓDULOS
     ====================================================================== */

  /* ---- Tema claro / oscuro ---- */
  function initTheme() {
    const root = document.documentElement;
    const btns = $$(".theme-toggle");
    if (!btns.length) return;
    const isDark = () => {
      const t = root.getAttribute("data-theme");
      return t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    };
    const sync = () => btns.forEach((b) => {
      b.setAttribute("aria-pressed", String(isDark()));
      b.setAttribute("aria-label", isDark() ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
    });
    btns.forEach((b) => b.addEventListener("click", () => {
      const next = isDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      store.set("theme", next);
      sync();
    }));
    sync();
  }

  /* ---- Menú móvil y enlace activo ---- */
  function initNav() {
    const toggle = $(".nav-toggle");
    const nav = $("#site-nav");
    const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    $$(".nav__link").forEach((a) => {
      const target = (a.getAttribute("href") || "").split("#")[0].toLowerCase();
      if (target === here || (here === "" && target === "index.html")) a.setAttribute("aria-current", "page");
    });
    if (!toggle || !nav) return;
    const close = () => { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); };
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { close(); toggle.focus(); }
    });
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) close(); });
  }

  /* ---- Aparición suave al hacer scroll ---- */
  function initReveal() {
    const items = $$(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) { items.forEach((i) => i.classList.add("is-visible")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { threshold: 0.08 });
    items.forEach((i) => io.observe(i));
  }

  /* ---- Avatares con iniciales (generadas a partir del nombre) ---- */
  function initAvatars() {
    $$(".member").forEach((m) => {
      const name = ($(".member__name", m) || {}).textContent || "";
      const av = $(".member__avatar", m);
      if (!av) return;
      const clean = name.trim();
      if (!clean || clean.startsWith("[")) { av.textContent = "?"; return; }
      const parts = clean.split(/\s+/);
      av.textContent = (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
    });
  }

  /* ---- Buscador global de la portada ---- */
  function initSearch() {
    const input = $("#global-search");
    const list = $("#search-results");
    if (!input || !list) return;

    const index = [
      ...SECTIONS.map((s) => ({ title: s.title, meta: "Sección", url: s.url, text: s.title + " " + s.desc })),
      ...GLOSSARY.map((g) => ({ title: g.t, meta: "Glosario", url: "extras.html#glosario", text: g.t + " " + g.d })),
      ...COMPILERS.map((c) => ({ title: c.name, meta: "Compilador · " + c.langs, url: "compiladores-actuales.html#" + c.id, text: c.name + " " + c.langs + " " + c.org + " " + c.note })),
    ];

    const close = () => { list.hidden = true; input.setAttribute("aria-expanded", "false"); };
    const open = () => { list.hidden = false; input.setAttribute("aria-expanded", "true"); };

    function render(q) {
      list.textContent = "";
      const query = norm(q.trim());
      if (!query) { close(); return; }
      const words = query.split(/\s+/);
      const hits = index
        .map((it) => {
          const hay = norm(it.text);
          if (!words.every((w) => hay.includes(w))) return null;
          const titleHit = norm(it.title).includes(query) ? 2 : 0;
          return { it, score: titleHit + (it.meta === "Sección" ? 1 : 0) };
        })
        .filter(Boolean)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);
      if (!hits.length) {
        list.append(create("li", { class: "search__empty", role: "status", text: "Sin resultados para «" + q.trim() + "». Prueba con otra palabra, como «token» o «fases»." }));
      } else {
        hits.forEach(({ it }) => {
          const a = create("a", { class: "search__link", href: it.url }, [
            create("span", { class: "search__title", text: it.title }),
            create("span", { class: "search__meta", text: it.meta }),
          ]);
          list.append(create("li", { class: "search__item" }, [a]));
        });
      }
      open();
    }

    input.addEventListener("input", () => render(input.value));
    input.addEventListener("focus", () => { if (input.value.trim()) render(input.value); });
    input.addEventListener("keydown", (e) => {
      const links = $$(".search__link", list);
      if (e.key === "Escape") { close(); input.value = ""; }
      else if (e.key === "ArrowDown" && links.length) { e.preventDefault(); links[0].focus(); }
    });
    list.addEventListener("keydown", (e) => {
      const links = $$(".search__link", list);
      const i = links.indexOf(document.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); (links[i + 1] || links[0]).focus(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); if (i <= 0) input.focus(); else links[i - 1].focus(); }
      else if (e.key === "Escape") { close(); input.focus(); }
    });
    document.addEventListener("click", (e) => { if (!e.target.closest(".search")) close(); });
  }

  /* ---- Stepper de fases (tablist accesible) ---- */
  function initStepper() {
    const root = $("[data-stepper]");
    if (!root) return;
    const tabs = $$('[role="tab"]', root);
    const panels = $$('[role="tabpanel"]', root);
    const bar = $(".stepper__bar", root);
    const status = $(".stepper__status", root);
    const prev = $("[data-step-prev]", root);
    const next = $("[data-step-next]", root);
    let current = 0;

    function select(i, focus) {
      current = Math.max(0, Math.min(tabs.length - 1, i));
      tabs.forEach((t, k) => {
        const on = k === current;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        panels[k].hidden = !on;
      });
      if (bar) bar.style.width = ((current + 1) / tabs.length) * 100 + "%";
      if (status) status.textContent = "Fase " + (current + 1) + " de " + tabs.length + ": " + tabs[current].dataset.title;
      if (prev) prev.disabled = current === 0;
      if (next) next.disabled = current === tabs.length - 1;
      if (focus) tabs[current].focus();
    }

    tabs.forEach((t, k) => {
      t.addEventListener("click", () => select(k));
      t.addEventListener("keydown", (e) => {
        const map = { ArrowRight: current + 1, ArrowDown: current + 1, ArrowLeft: current - 1, ArrowUp: current - 1, Home: 0, End: tabs.length - 1 };
        if (e.key in map) { e.preventDefault(); select(map[e.key], true); }
      });
    });
    if (prev) prev.addEventListener("click", () => select(current - 1));
    if (next) next.addEventListener("click", () => select(current + 1));
    select(0);
  }

  /* ---- Compiladores actuales: tarjetas, filtros y búsqueda ---- */
  function initCompilers() {
    const grid = $("#comp-grid");
    if (!grid) return;
    const search = $("#comp-search");
    const chips = $$("[data-filter]");
    const empty = $("#comp-empty");
    const count = $("#comp-count");
    let filter = "Todos";

    const card = (c) => {
      const tags = create("div", { class: "comp__tags" }, c.types.map((t) => create("span", { class: "badge", text: t })));
      const dl = create("dl", {}, [
        create("dt", { text: "Lenguajes" }), create("dd", { text: c.langs }),
        create("dt", { text: "Organización" }), create("dd", { text: c.org }),
        create("dt", { text: "Plataformas" }), create("dd", { text: c.platforms }),
      ]);
      return create("article", { class: "tile comp", id: c.id }, [
        create("div", { class: "comp__head" }, [create("h3", { class: "comp__name", text: c.name }), tags]),
        dl,
        create("p", { class: "comp__note", text: c.note }),
      ]);
    };

    function render() {
      const q = norm((search && search.value) || "").trim();
      const shown = COMPILERS.filter((c) =>
        (filter === "Todos" || c.types.includes(filter)) && (!q || norm(c.name + " " + c.langs + " " + c.org).includes(q)));
      grid.textContent = "";
      shown.forEach((c) => grid.append(card(c)));
      if (empty) empty.hidden = shown.length > 0;
      if (count) count.textContent = shown.length === 1 ? "1 compilador" : shown.length + " compiladores";
    }

    chips.forEach((ch) => ch.addEventListener("click", () => {
      filter = ch.dataset.filter;
      chips.forEach((o) => o.setAttribute("aria-pressed", String(o === ch)));
      render();
    }));
    if (search) search.addEventListener("input", render);
    const reset = $("#comp-reset");
    if (reset) reset.addEventListener("click", () => {
      filter = "Todos"; if (search) search.value = "";
      chips.forEach((o) => o.setAttribute("aria-pressed", String(o.dataset.filter === "Todos")));
      render();
    });
    render();
    // Si se llegó con un ancla (#gcc), desplazar a la tarjeta una vez generada
    if (location.hash) {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) target.scrollIntoView();
    }
  }

  /* ---- Analizador léxico (demo) ---- */
  function tokenize(src) {
    const KEYWORDS = new Set(["int", "float", "char", "void", "if", "else", "while", "for", "return"]);
    // Orden importa: la primera regla que coincide gana (como en un generador léxico)
    const RULES = [
      { type: null, re: /\s+/y },
      { type: null, re: /\/\/[^\n]*/y },
      { type: "Número", re: /\d+(?:\.\d+)?/y },
      { type: "Identificador", re: /[A-Za-z_][A-Za-z0-9_]*/y },
      { type: "Operador", re: /==|!=|<=|>=|&&|\|\||[+\-*/%=<>!]/y },
      { type: "Delimitador", re: /[(){}\[\];,]/y },
    ];
    const tokens = [];
    let pos = 0, line = 1, col = 1;
    while (pos < src.length) {
      let matched = false;
      for (const rule of RULES) {
        rule.re.lastIndex = pos;
        const m = rule.re.exec(src);
        if (!m) continue;
        matched = true;
        const text = m[0];
        if (rule.type) {
          const type = rule.type === "Identificador" && KEYWORDS.has(text) ? "Palabra reservada" : rule.type;
          tokens.push({ type, text, line, col });
        }
        for (const ch of text) { if (ch === "\n") { line++; col = 1; } else col++; }
        pos += text.length;
        break;
      }
      if (!matched) {
        const ch = String.fromCodePoint(src.codePointAt(pos));
        tokens.push({ type: "Desconocido", text: ch, line, col });
        pos += ch.length; col++;
      }
    }
    return tokens;
  }

  function initLexer() {
    const input = $("#lexer-input");
    const run = $("#lexer-run");
    const body = $("#lexer-body");
    const msg = $("#lexer-msg");
    const table = $("#lexer-table");
    if (!input || !run || !body || !msg) return;

    const say = (kind, text) => { msg.hidden = false; msg.className = "lexer__msg lexer__msg--" + kind; msg.textContent = text; };
    const badgeClass = { "Palabra reservada": "badge--pink", "Número": "badge--ok", "Desconocido": "badge--danger" };

    function analyze() {
      body.textContent = "";
      const src = input.value;
      if (!src.trim()) {
        table.hidden = true;
        say("error", "El campo está vacío. Escribe algo de código o elige un ejemplo para analizarlo.");
        input.focus();
        return;
      }
      let tokens;
      try { tokens = tokenize(src); } catch (err) {
        table.hidden = true; say("error", "No se pudo analizar la entrada: " + err.message); return;
      }
      tokens.forEach((t, i) => {
        const tr = create("tr", {}, [
          create("td", { text: String(i + 1) }),
          create("td", {}, [create("span", { class: "badge " + (badgeClass[t.type] || ""), text: t.type })]),
          create("td", {}, [create("code", { text: t.text })]),
          create("td", { text: t.line + ":" + t.col }),
        ]);
        body.append(tr);
      });
      table.hidden = false;
      const bad = tokens.filter((t) => t.type === "Desconocido");
      if (bad.length) {
        const first = bad[0];
        say("error", "Se encontraron " + bad.length + " carácter(es) inválido(s). El primero es «" + first.text + "» en la línea " + first.line + ", columna " + first.col + ". Quítalo o reemplázalo por un símbolo válido.");
      } else {
        say("ok", "Análisis correcto: " + tokens.length + " tokens, ningún carácter inválido.");
      }
    }

    run.addEventListener("click", analyze);
    const clear = $("#lexer-clear");
    if (clear) clear.addEventListener("click", () => {
      input.value = ""; body.textContent = ""; table.hidden = true; msg.hidden = true; input.focus();
    });
    const exBox = $("#lexer-examples");
    if (exBox) LEXER_EXAMPLES.forEach((ex) => {
      const b = create("button", { type: "button", class: "chip", text: ex.label });
      b.addEventListener("click", () => { input.value = ex.code; analyze(); });
      exBox.append(b);
    });
    table.hidden = true;
    msg.hidden = true;
    input.value = LEXER_EXAMPLES[0].code;
  }

  /* ---- Glosario con búsqueda ---- */
  function initGlossary() {
    const list = $("#glossary-list");
    if (!list) return;
    const search = $("#glossary-search");
    const empty = $("#glossary-empty");
    const count = $("#glossary-count");
    const sorted = GLOSSARY.slice().sort((a, b) => a.t.localeCompare(b.t, "es"));

    function render() {
      const q = norm((search && search.value) || "").trim();
      const shown = sorted.filter((g) => !q || norm(g.t + " " + g.d).includes(q));
      list.textContent = "";
      shown.forEach((g) => list.append(create("div", { class: "glossary__item" }, [
        create("dt", { class: "glossary__term", text: g.t }),
        create("dd", { class: "glossary__def", text: g.d }),
      ])));
      if (empty) empty.hidden = shown.length > 0;
      if (count) count.textContent = shown.length + " de " + sorted.length + " términos";
    }
    if (search) search.addEventListener("input", render);
    render();
  }

  /* ---- Quiz ---- */
  function initQuiz() {
    const root = $("#quiz");
    if (!root) return;
    let i = 0, score = 0, answered = false;

    function renderQuestion() {
      const item = QUIZ[i];
      answered = false;
      root.textContent = "";
      root.append(create("p", { class: "quiz__progress", text: "Pregunta " + (i + 1) + " de " + QUIZ.length + " · Aciertos: " + score }));
      const fs = create("fieldset", { class: "quiz__question", style: "margin:0" });
      fs.append(create("legend", { class: "quiz__question", text: item.q }));
      const ul = create("ul", { class: "quiz__options" });
      item.o.forEach((opt, k) => {
        const b = create("button", { type: "button", class: "quiz__option", text: opt });
        b.addEventListener("click", () => choose(k, ul));
        ul.append(create("li", {}, [b]));
      });
      fs.append(ul);
      const fb = create("div", { class: "quiz__feedback", id: "quiz-feedback", role: "status", hidden: "" });
      const next = create("button", { type: "button", class: "btn", id: "quiz-next", text: i === QUIZ.length - 1 ? "Ver resultado" : "Siguiente pregunta", hidden: "", style: "margin-top:16px" });
      next.addEventListener("click", () => { i++; i < QUIZ.length ? renderQuestion() : renderResult(); });
      root.append(fs, fb, next);
    }

    function choose(k, ul) {
      if (answered) return;
      answered = true;
      const item = QUIZ[i];
      const btns = $$(".quiz__option", ul);
      btns.forEach((b, idx) => {
        b.disabled = true;
        if (idx === item.a) b.classList.add("quiz__option--correct");
        else if (idx === k) b.classList.add("quiz__option--wrong");
      });
      const ok = k === item.a;
      if (ok) score++;
      const fb = $("#quiz-feedback");
      fb.hidden = false;
      fb.textContent = (ok ? "Correcto. " : "No es esa. ") + item.e;
      const next = $("#quiz-next");
      next.hidden = false;
      next.focus();
    }

    function renderResult() {
      root.textContent = "";
      const pct = Math.round((score / QUIZ.length) * 100);
      const text = score === QUIZ.length ? "Puntaje perfecto." : score >= QUIZ.length * 0.6 ? "Buen resultado. Repasa las preguntas que fallaste en las secciones del portal." : "Vale la pena repasar las secciones Fases y Compiladores y volver a intentarlo.";
      const box = create("div", { class: "quiz__result", role: "status" }, [
        create("p", { class: "quiz__score", text: score + " / " + QUIZ.length }),
        create("p", { text: pct + " % de aciertos. " + text }),
      ]);
      const again = create("button", { type: "button", class: "btn", text: "Intentar de nuevo" });
      again.addEventListener("click", () => { i = 0; score = 0; renderQuestion(); });
      box.append(again);
      root.append(box);
      again.focus();
    }

    renderQuestion();
  }

  /* ---- Botón «Volver arriba» ---- */
  function initBackToTop() {
    const btn = create("button", { type: "button", class: "to-top", "aria-label": "Volver arriba" });
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    document.body.append(btn);
    const toggle = () => btn.classList.toggle("is-visible", window.scrollY > 600);
    window.addEventListener("scroll", toggle, { passive: true });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }));
    toggle();
  }

  /* ---- Botón «Copiar» en bloques de código ---- */
  function initCopy() {
    $$(".code__copy").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const pre = $("pre", btn.closest(".code"));
        if (!pre) return;
        const text = pre.innerText;
        let ok = false;
        try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
          // Respaldo para file:// o navegadores sin Clipboard API
          const ta = create("textarea", { "aria-hidden": "true", style: "position:fixed;opacity:0" });
          ta.value = text; document.body.append(ta); ta.select();
          try { ok = document.execCommand("copy"); } catch (e2) { ok = false; }
          ta.remove();
        }
        const old = btn.textContent;
        btn.textContent = ok ? "Copiado" : "No se pudo copiar";
        setTimeout(() => { btn.textContent = old; }, 1600);
      });
    });
  }

  /* ---- Índice de la página (resalta la sección visible) ---- */
  function initToc() {
    const links = $$(".toc a");
    if (!links.length || !("IntersectionObserver" in window)) return;
    const map = new Map();
    links.forEach((a) => { const t = document.getElementById(a.getAttribute("href").slice(1)); if (t) map.set(t, a); });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { links.forEach((l) => l.classList.remove("is-active")); map.get(en.target).classList.add("is-active"); }
      });
    }, { rootMargin: "0px 0px -65% 0px" });
    map.forEach((_, el) => io.observe(el));
  }

  /* ======================================================================
     4. ARRANQUE
     ====================================================================== */
  function init() {
    document.documentElement.classList.add("js");
    [initTheme, initNav, initAvatars, initSearch, initStepper, initCompilers, initLexer, initGlossary, initQuiz, initCopy, initToc, initBackToTop, initReveal]
      .forEach((fn) => { try { fn(); } catch (err) { console.error("Error en módulo " + fn.name, err); } });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
