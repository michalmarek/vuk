// Mobilní menu: přepínání, zavření klávesou Esc a klikem mimo.
(function () {
  var header = document.querySelector("[data-header]");
  var toggle = document.querySelector("[data-menu-toggle]");
  if (!header || !toggle) return;

  function open() {
    header.setAttribute("data-menu-open", "");
    toggle.setAttribute("aria-expanded", "true");
  }
  function close() {
    header.removeAttribute("data-menu-open");
    toggle.setAttribute("aria-expanded", "false");
  }
  function isOpen() {
    return header.hasAttribute("data-menu-open");
  }

  toggle.addEventListener("click", function () {
    isOpen() ? close() : open();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen()) close();
  });
  document.addEventListener("click", function (e) {
    if (isOpen() && !header.contains(e.target)) close();
  });
})();
