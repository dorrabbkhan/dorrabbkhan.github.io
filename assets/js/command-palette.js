// Command palette: Ctrl/Cmd+K or / to open, arrows to navigate, Enter to open, Esc to close
document.addEventListener("DOMContentLoaded", function () {
  var palette = document.getElementById("command-palette");
  if (!palette) return;

  var input = palette.querySelector(".command-palette-input");
  var list = palette.querySelector(".command-palette-list");
  var items = (window.__cmdkItems || []).map(function (i) {
    return {
      title: i.title,
      url: i.url,
      type: i.type || "action",
      action: i.action,
      newTab: i.newTab,
    };
  });

  var results = items;
  var active = 0;

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c];
    });
  }

  function render() {
    var q = input.value.trim().toLowerCase();
    results = items.filter(function (i) {
      return i.title.toLowerCase().indexOf(q) !== -1;
    });
    active = 0;

    if (results.length === 0) {
      list.innerHTML = '<li class="command-palette-empty">No results</li>';
      return;
    }

    list.innerHTML = results
      .map(function (r, i) {
        return (
          '<li class="command-palette-item' +
          (i === active ? " active" : "") +
          '" data-index="' +
          i +
          '" role="option">' +
          "<span>" +
          escapeHtml(r.title) +
          "</span>" +
          '<span class="command-palette-type">' +
          r.type +
          "</span>" +
          "</li>"
        );
      })
      .join("");
  }

  function setActive(i) {
    active = i;
    var els = list.querySelectorAll(".command-palette-item");
    els.forEach(function (el, idx) {
      el.classList.toggle("active", idx === i);
      if (idx === i) el.scrollIntoView({ block: "nearest" });
    });
  }

  function choose(i) {
    var r = results[i];
    if (!r) return;
    if (r.action === "theme") {
      var btn = document.getElementById("theme-toggle");
      if (btn) btn.click();
      close();
    } else if (r.action === "email" && window.__cmdkEmail) {
      window.location.href = "mailto:" + atob(window.__cmdkEmail);
      close();
    } else if (r.action === "random") {
      var posts = items.filter(function (i) {
        return i.type === "post";
      });
      if (posts.length) {
        window.location.href =
          posts[Math.floor(Math.random() * posts.length)].url;
      }
    } else if (r.action === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      close();
    } else if (r.action === "copy") {
      navigator.clipboard.writeText(window.location.href);
      close();
    } else if (r.url) {
      if (r.newTab) {
        window.open(r.url, "_blank", "noopener noreferrer");
        close();
      } else {
        window.location.href = r.url;
      }
    }
  }

  function open() {
    palette.hidden = false;
    input.value = "";
    render();
    input.focus();
    document.body.style.overflow = "hidden";
  }

  function close() {
    palette.hidden = true;
    document.body.style.overflow = "";
  }

  function isOpen() {
    return !palette.hidden;
  }

  document.addEventListener("keydown", function (e) {
    var k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && k === "k") {
      e.preventDefault();
      isOpen() ? close() : open();
      return;
    }
    if (isOpen() && e.key === "Escape") {
      close();
      return;
    }
    // "/" opens too, unless already typing in an input
    if (
      !isOpen() &&
      e.key === "/" &&
      !/^(input|textarea|select)$/i.test(document.activeElement.tagName)
    ) {
      e.preventDefault();
      open();
    }
  });

  input.addEventListener("input", render);
  input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(Math.min(active + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(Math.max(active - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(active);
    }
  });

  list.addEventListener("click", function (e) {
    var el = e.target.closest(".command-palette-item");
    if (el) choose(parseInt(el.dataset.index, 10));
  });
  list.addEventListener("mousemove", function (e) {
    var el = e.target.closest(".command-palette-item");
    if (el && parseInt(el.dataset.index, 10) !== active) {
      setActive(parseInt(el.dataset.index, 10));
    }
  });
  palette
    .querySelector(".command-palette-backdrop")
    .addEventListener("click", close);

  var trigger = document.getElementById("command-palette-trigger");
  if (trigger) {
    trigger.addEventListener("click", open);
    var platform =
      (navigator.userAgentData && navigator.userAgentData.platform) ||
      navigator.platform ||
      navigator.userAgent ||
      "";
    if (/Mac|iPhone|iPad|iPod/i.test(platform)) {
      var kbd = trigger.querySelector(".command-palette-kbd");
      if (kbd) kbd.textContent = "⌘K";
    }
  }
});
