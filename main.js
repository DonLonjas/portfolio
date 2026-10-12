/* Portfolio — vanilla JS, sin dependencias ni build. */
(function () {
  "use strict";

  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reduceMotion = motionQuery.matches;
  motionQuery.addEventListener("change", function (event) {
    reduceMotion = event.matches;
  });

  function safe(name, fn) {
    try {
      fn();
    } catch (err) {
      // Un fallo en una mejora no debe romper el resto de la página.
      if (window.console) console.warn("[" + name + "]", err);
    }
  }

  /* Año del footer (formato local, sin hardcodear). */
  safe("year", function () {
    var el = document.getElementById("year");
    if (!el) return;
    el.textContent = new Intl.DateTimeFormat("es-ES", { year: "numeric" }).format(new Date());
  });

  /* Firma: la línea mono se teclea una vez. */
  safe("typed", function () {
    var out = document.getElementById("typed");
    if (!out) return;
    var text = "const rol = \u201Cdesarrollador full-stack junior\u201D;";
    document.body.classList.add("has-typed");

    if (reduceMotion) {
      out.textContent = text;
      return;
    }

    var i = 0;
    var done = false;
    var timer = 0;

    function cleanup() {
      window.removeEventListener("pointerdown", finish);
      window.removeEventListener("keydown", finish);
      window.removeEventListener("scroll", finish, { passive: true });
    }

    function finish() {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      out.textContent = text;
      cleanup();
    }

    function step() {
      if (done) return;
      out.textContent = text.slice(0, i);
      i += 1;
      if (i <= text.length) {
        timer = window.setTimeout(step, 34);
      } else {
        done = true;
        cleanup();
      }
    }

    // Se puede interrumpir: si el usuario interactúa, salta al texto completo.
    window.addEventListener("pointerdown", finish, { passive: true });
    window.addEventListener("keydown", finish);
    window.addEventListener("scroll", finish, { passive: true });

    step();
  });

  /* Reveal al hacer scroll. Los elementos solo se marcan si JS está activo,
     así el contenido sigue visible sin JS. */
  safe("reveal", function () {
    var targets = document.querySelectorAll(".section-head, .card, .contact__panel");
    if (!targets.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("reveal", "is-in"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -8% 0px" });

    targets.forEach(function (el) {
      el.classList.add("reveal");
      observer.observe(el);
    });

    // Red de seguridad: nada queda oculto si el observer no dispara.
    window.setTimeout(function () {
      targets.forEach(function (el) { el.classList.add("is-in"); });
    }, 6000);
  });
})();
