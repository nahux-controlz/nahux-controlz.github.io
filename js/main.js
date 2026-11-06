// JavaScript vanilla: solo mejoras progresivas. El sitio se puede leer y navegar sin él.
(function () {
  var root = document.documentElement;
  var temaMeta = document.querySelector('meta[name="theme-color"]');

  /* ----- Tema claro / oscuro ----- */
  var toggle = document.querySelector("[data-theme-toggle]");

  function pintarTema() {
    var oscuro = root.dataset.theme === "dark";
    if (toggle) {
      toggle.setAttribute("aria-pressed", String(oscuro));
    }
    if (temaMeta) {
      temaMeta.setAttribute("content", oscuro ? "#0f1d1d" : "#f7f2e8");
    }
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("tema", root.dataset.theme);
      } catch (e) {
        /* La elección dura solo esta visita. */
      }
      pintarTema();
    });
  }
  pintarTema();

  /* ----- Menú mobile ----- */
  var boton = document.querySelector("[data-menu-toggle]");
  var menu = document.getElementById("menu-principal");

  function setMenu(abierto) {
    boton.setAttribute("aria-expanded", String(abierto));
    boton.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    menu.classList.toggle("is-open", abierto);
  }

  if (boton && menu) {
    boton.addEventListener("click", function () {
      setMenu(boton.getAttribute("aria-expanded") !== "true");
    });
    menu.addEventListener("click", function (evento) {
      if (evento.target.closest("a")) {
        setMenu(false);
      }
    });
    document.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape" && boton.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        boton.focus();
      }
    });
    // Al pasar a desktop el menú vuelve a su estado normal.
    window.matchMedia("(min-width: 1024px)").addEventListener("change", function () {
      setMenu(false);
    });
  }

  /* ----- Sección actual en la navegación ----- */
  var links = Array.prototype.slice.call(document.querySelectorAll('#menu-principal a[href^="#"]'));
  var secciones = links
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && secciones.length) {
    var marcar = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (!entrada.isIntersecting) {
            return;
          }
          links.forEach(function (link) {
            if (link.getAttribute("href") === "#" + entrada.target.id) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );
    secciones.forEach(function (seccion) {
      marcar.observe(seccion);
    });
  }

  /* ----- Línea de tiempo: el hito se "llena" al entrar en pantalla ----- */
  var hitos = document.querySelectorAll(".timeline__item");
  if ("IntersectionObserver" in window && hitos.length) {
    var llenar = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("is-reached");
            llenar.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    hitos.forEach(function (hito) {
      llenar.observe(hito);
    });
  } else {
    hitos.forEach(function (hito) {
      hito.classList.add("is-reached");
    });
  }

  /* ----- Copiar el email ----- */
  var copiar = document.querySelector("[data-copy]");
  var aviso = document.querySelector("[data-copy-status]");
  if (copiar && aviso && navigator.clipboard) {
    copiar.hidden = false;
    copiar.addEventListener("click", function () {
      navigator.clipboard.writeText(copiar.dataset.copy).then(
        function () {
          aviso.textContent = "Email copiado";
        },
        function () {
          aviso.textContent = "No se pudo copiar: usá el enlace de email";
        }
      );
      window.setTimeout(function () {
        aviso.textContent = "";
      }, 3000);
    });
  }

  /* ----- Año del copyright ----- */
  document.querySelectorAll("[data-year]").forEach(function (nodo) {
    nodo.textContent = String(new Date().getFullYear());
  });
})();
