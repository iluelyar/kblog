document.addEventListener("DOMContentLoaded", () => {
  const img = document.getElementById("image");
  const controls = document.querySelectorAll(".controls input[type=range]");
  const fileInput = document.getElementById("upload");
  controls.forEach((control) => {
    control.addEventListener("input", updateFilters);
  });
  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
  function updateFilters() {
    const blur = document.getElementById("blur").value;
    const brightness = document.getElementById("brightness").value;
    const contrast = document.getElementById("contrast").value;
    const grayscale = document.getElementById("grayscale").value;
    const hueRotate = document.getElementById("hue-rotate").value;
    const invert = document.getElementById("invert").value;
    const opacity = document.getElementById("opacity").value;
    const saturate = document.getElementById("saturate").value;
    const sepia = document.getElementById("sepia").value;
    const dropShadow = document.getElementById("drop-shadow").value;
    const dropShadowX = document.getElementById("drop-shadowX").value;
    const dropShadowY = document.getElementById("drop-shadowY").value;
    img.style.filter = `
        blur(${blur}px)
        brightness(${brightness})
        contrast(${contrast})
        grayscale(${grayscale})
        hue-rotate(${hueRotate}deg)
        invert(${invert})
        opacity(${opacity})
        saturate(${saturate})
        sepia(${sepia})
        drop-shadow(${dropShadowX}px ${dropShadowY}px ${dropShadow}px #000)
      `;
    document.getElementById("blur-value").textContent = blur;
    document.getElementById("brightness-value").textContent = brightness;
    document.getElementById("contrast-value").textContent = contrast;
    document.getElementById("grayscale-value").textContent = grayscale;
    document.getElementById("hue-rotate-value").textContent = hueRotate;
    document.getElementById("invert-value").textContent = invert;
    document.getElementById("opacity-value").textContent = opacity;
    document.getElementById("saturate-value").textContent = saturate;
    document.getElementById("sepia-value").textContent = sepia;
    document.getElementById("drop-shadow-value").textContent = dropShadow;
    document.getElementById("drop-shadowX-value").textContent = dropShadowX;
    document.getElementById("drop-shadowY-value").textContent = dropShadowY;
  }
  updateFilters();
});