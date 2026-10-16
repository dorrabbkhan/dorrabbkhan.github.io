document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("theme-toggle");
  const htmlElement = document.documentElement;

  function getSavedTheme() {
    try {
      return localStorage.getItem("theme");
    } catch (e) {
      return null;
    }
  }

  function setFavicon(theme) {
    const suffix = theme === "light" ? "-light" : "";
    const svgIcon = document.querySelector(
      'link[rel="icon"][type="image/svg+xml"]',
    );
    const pngIcon = document.querySelector(
      'link[rel="icon"][type="image/png"]',
    );
    if (svgIcon) svgIcon.href = `/assets/favicon/favicon${suffix}.svg`;
    if (pngIcon) pngIcon.href = `/assets/favicon/favicon${suffix}-96x96.png`;
  }

  function setTheme(theme, persist) {
    htmlElement.setAttribute("data-theme", theme);
    if (persist) {
      try {
        localStorage.setItem("theme", theme);
      } catch (e) {}
    }
    setFavicon(theme);
    if (toggleButton) {
      toggleButton.innerHTML = theme === "dark" ? "☀️" : "🌙";
      toggleButton.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
      );
    }
  }

  // Theme was already applied by the inline theme-init script; just sync
  // the favicon and toggle button to it.
  setTheme(htmlElement.getAttribute("data-theme") || "dark", false);

  if (toggleButton) {
    toggleButton.addEventListener("click", function () {
      const currentTheme = htmlElement.getAttribute("data-theme") || "dark";
      setTheme(currentTheme === "dark" ? "light" : "dark", true);
    });
  }

  // Follow OS theme changes only while the user hasn't chosen a theme.
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", function (event) {
      if (!getSavedTheme()) {
        setTheme(event.matches ? "dark" : "light", false);
      }
    });
});
