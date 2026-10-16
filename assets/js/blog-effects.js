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

  // "Copy" button on every fenced code block (div.highlighter-rouge wraps
  // Rouge's div.highlight > pre.highlight > code; inline code is a bare
  // <code class="... highlighter-rouge"> and is skipped automatically)
  document.querySelectorAll("div.highlighter-rouge").forEach(function (block) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-code-button";
    button.textContent = "Copy";
    button.setAttribute("aria-label", "Copy code to clipboard");

    button.addEventListener("click", function () {
      const code = block.querySelector("pre code, pre");
      if (!code) return;

      const done = function () {
        button.textContent = "Copied";
        button.classList.add("copied");
        setTimeout(function () {
          button.textContent = "Copy";
          button.classList.remove("copied");
        }, 1500);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code.innerText).then(done);
      } else {
        // Fallback for non-secure contexts
        const textarea = document.createElement("textarea");
        textarea.value = code.innerText;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand("copy");
          done();
        } catch (e) {
          button.textContent = "Error";
        }
        document.body.removeChild(textarea);
      }
    });

    block.appendChild(button);
  });
});
