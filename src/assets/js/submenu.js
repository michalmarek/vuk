// Experiment: submenu výrobků zůstává sticky a po odscrollování se zmenší.
(function () {
  var submenu = document.querySelector(".submenu");
  var sentinel = document.querySelector(".submenu-sentinel");
  if (!submenu || !sentinel || !("IntersectionObserver" in window)) return;

  var io = new IntersectionObserver(
    function (entries) {
      submenu.classList.toggle("is-stuck", !entries[0].isIntersecting);
    },
    // horní okraj posuneme o výšku hlavičky, aby přepnutí sedělo pod ní
    { rootMargin: "-93px 0px 0px 0px", threshold: 0 }
  );
  io.observe(sentinel);
})();
