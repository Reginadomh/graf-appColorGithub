// Utilidades
const clamp = (n, min = 0, max = 255) => Math.min(max, Math.max(min, Number(n) || 0));
const toHex = (v) => {
  const h = clamp(v).toString(16).toUpperCase();
  return h.length === 1 ? "0" + h : h;
};
const rgbToHex = (r, g, b) => `#${toHex(r)}${toHex(g)}${toHex(b)}`;
const hexToRgb = (hex) => {
  let h = (hex || "").replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  if (Number.isNaN(n) || h.length !== 6) return { r: 0, g: 0, b: 0 };
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};

// Elementos
const preview = document.getElementById("colorPreview");
const hexValue = document.getElementById("hexValue");
const colorPicker = document.getElementById("colorPicker");

const rRange = document.getElementById("rRange");
const gRange = document.getElementById("gRange");
const bRange = document.getElementById("bRange");

const rInput = document.getElementById("rInput");
const gInput = document.getElementById("gInput");
const bInput = document.getElementById("bInput");

const rBadge = document.getElementById("rBadge");
const gBadge = document.getElementById("gBadge");
const bBadge = document.getElementById("bBadge");

const btnCopyHex = document.getElementById("btnCopyHex");
const btnReset = document.getElementById("btnReset");
const btnRandom = document.getElementById("btnRandom");

// Estado principal y sincronización
function applyRGB(r, g, b, source = "") {
  r = clamp(r); g = clamp(g); b = clamp(b);
  // Actualizar vista previa y HEX
  const hex = rgbToHex(r, g, b);
  preview.style.backgroundColor = hex;
  hexValue.value = hex;
  colorPicker.value = hex;

  // Sincronizar sliders
  if (source !== "range") {
    rRange.value = r; gRange.value = g; bRange.value = b;
  }
  // Sincronizar entradas numéricas
  if (source !== "number") {
    rInput.value = r; gInput.value = g; bInput.value = b;
  }
  // Badges
  rBadge.textContent = r;
  gBadge.textContent = g;
  bBadge.textContent = b;
}

// Listeners - sliders
[rRange, gRange, bRange].forEach(el => {
  el.addEventListener("input", () => {
    applyRGB(rRange.value, gRange.value, bRange.value, "range");
  });
});

// Listeners - inputs decimales
[rInput, gInput, bInput].forEach(el => {
  el.addEventListener("input", () => {
    applyRGB(rInput.value, gInput.value, bInput.value, "number");
  });
});

// Listener - color picker
colorPicker.addEventListener("input", () => {
  const { r, g, b } = hexToRgb(colorPicker.value);
  applyRGB(r, g, b, "picker");
});

// Botones
btnCopyHex.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(hexValue.value);
    btnCopyHex.textContent = "¡Copiado!";
    setTimeout(() => (btnCopyHex.textContent = "Copiar"), 1200);
  } catch {
    // Silencioso
  }
});

btnReset.addEventListener("click", () => applyRGB(128, 128, 128, "reset"));
btnRandom.addEventListener("click", () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  applyRGB(r, g, b, "random");
});

// Inicial
applyRGB(128, 64, 192, "init");
