document.addEventListener('DOMContentLoaded', function() {
  const blob = document.querySelector('.cursor-gradient-blob');
  if (!blob) return;

  let mouseX = 0;
  let mouseY = 0;
  let blobX = 0;
  let blobY = 0;
  const speed = 0.08;

  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    blobX += (mouseX - blobX) * speed;
    blobY += (mouseY - blobY) * speed;
    
    blob.style.left = blobX + 'px';
    blob.style.top = blobY + 'px';
    
    requestAnimationFrame(animate);
  }

  animate();
});
