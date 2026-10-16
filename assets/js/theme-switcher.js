document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("theme-toggle");
  const htmlElement = document.documentElement;

  const SUN_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
  const MOON_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';

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
      toggleButton.innerHTML = theme === "dark" ? SUN_ICON : MOON_ICON;
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
