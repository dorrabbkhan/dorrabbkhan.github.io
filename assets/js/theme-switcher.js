document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("theme-toggle");
  const htmlElement = document.documentElement;

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

  function setTheme(theme) {
    htmlElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    setFavicon(theme);
    if (toggleButton) {
      toggleButton.innerHTML = theme === "dark" ? "☀️" : "🌙";
      toggleButton.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
      );
    }
  }

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  const initialTheme = getPreferredTheme();
  setTheme(initialTheme);

  if (toggleButton) {
    toggleButton.addEventListener("click", function () {
      const currentTheme = htmlElement.getAttribute("data-theme") || "dark";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      setTheme(newTheme);
    });
  }
});
