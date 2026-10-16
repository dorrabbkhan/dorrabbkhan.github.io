document.addEventListener("DOMContentLoaded", function () {
  const blob = document.querySelector(".cursor-gradient-blob");
  if (!blob) return;

  // No cursor to chase on touch devices
  if (window.matchMedia("(pointer: coarse)").matches) return;

  let mouseX = 0;
  let mouseY = 0;
  let blobX = 0;
  let blobY = 0;
  let hasMoved = false;
  let rafId = null;
  const speed = 0.08;
  const epsilon = 0.5;

  function animate() {
    blobX += (mouseX - blobX) * speed;
    blobY += (mouseY - blobY) * speed;

    blob.style.left = blobX + "px";
    blob.style.top = blobY + "px";

    // Stop the loop once the blob has settled on the cursor
    if (
      Math.abs(mouseX - blobX) < epsilon &&
      Math.abs(mouseY - blobY) < epsilon
    ) {
      rafId = null;
      return;
    }

    rafId = requestAnimationFrame(animate);
  }

  document.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!hasMoved) {
      hasMoved = true;
      blobX = mouseX;
      blobY = mouseY;
      blob.classList.add("active");
    }
    // Restart the loop only if it isn't already running
    if (rafId === null) {
      rafId = requestAnimationFrame(animate);
    }
  });
});
