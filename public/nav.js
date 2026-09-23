document.addEventListener("DOMContentLoaded", function () {
  var nav = document.querySelector(".site-nav");
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("menu-open");
    });
  }
  // Na mobile dotknięcie przycisku podmenu rozwija je zamiast od razu
  // podążać za linkiem docelowym (na desktopie działa hover z CSS).
  document.querySelectorAll(".nav-menu > li > button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var li = btn.closest("li");
      var wasOpen = li.classList.contains("open");
      document.querySelectorAll(".nav-menu > li").forEach(function (li2) {
        li2.classList.remove("open");
      });
      if (!wasOpen) li.classList.add("open");
    });
  });
});
