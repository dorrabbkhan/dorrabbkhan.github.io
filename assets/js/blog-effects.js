document.addEventListener("DOMContentLoaded", function () {
  // Spotlight hover: track cursor position inside previews and post titles
  document
    .querySelectorAll(".article-preview, .post-title")
    .forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--x", e.clientX - rect.left + "px");
        el.style.setProperty("--y", e.clientY - rect.top + "px");
      });
    });

  // Scroll progress bar on post pages
  const progress = document.querySelector(".scroll-progress");
  if (progress) {
    function updateProgress() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width =
        (scrollable > 0 ? (scrollTop / scrollable) * 100 : 0) + "%";
    }
    document.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
  }
});
