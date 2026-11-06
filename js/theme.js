// Se carga en <head> para aplicar el tema antes de pintar y evitar el parpadeo.
(function () {
  var root = document.documentElement;
  root.classList.add("js");
  var guardado = null;
  try {
    guardado = localStorage.getItem("tema");
  } catch (e) {
    /* Sin acceso a localStorage: se usa la preferencia del sistema. */
  }
  var oscuro =
    guardado === "dark" ||
    (guardado !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.dataset.theme = oscuro ? "dark" : "light";
})();
