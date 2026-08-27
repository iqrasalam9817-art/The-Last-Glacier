import * as THREE from "three";

/** Radial soft glow sprite used for snow, stars and flow particles. */
export function makeGlowTexture(color = "#8DE7F5") {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, color);
  g.addColorStop(0.35, color + "aa");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Vertical aurora band gradient. */
export function makeAuroraTexture() {
  const w = 256;
  const h = 256;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, h, 0, 0);
  g.addColorStop(0, "rgba(73,201,217,0)");
  g.addColorStop(0.25, "rgba(73,201,217,0.35)");
  g.addColorStop(0.55, "rgba(185,246,211,0.45)");
  g.addColorStop(0.8, "rgba(141,231,245,0.18)");
  g.addColorStop(1, "rgba(7,19,31,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  // horizontal ripple mask
  const m = ctx.getImageData(0, 0, w, h);
  for (let x = 0; x < w; x++) {
    const wave = 0.55 + 0.45 * Math.sin(x * 0.045) * Math.cos(x * 0.017 + 1.3);
    for (let y = 0; y < h; y++) {
      const i = (y * w + x) * 4 + 3;
      m.data[i] = m.data[i]! * wave;
    }
  }
  ctx.putImageData(m, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Stratified ice-core texture: banded firn, soot, ash, pollen horizons. */
export function makeCoreTexture(highlight: number, bands: number) {
  const w = 128;
  const h = 1024;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  const base = ctx.createLinearGradient(0, 0, 0, h);
  base.addColorStop(0, "#d8f4fb");
  base.addColorStop(0.5, "#9fd8e8");
  base.addColorStop(1, "#5aa5bd");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 320; i++) {
    const y = Math.random() * h;
    ctx.globalAlpha = 0.05 + Math.random() * 0.12;
    ctx.fillStyle = Math.random() > 0.5 ? "#ffffff" : "#3d7d94";
    ctx.fillRect(0, y, w, 1 + Math.random() * 2);
  }
  ctx.globalAlpha = 1;

  const bandH = h / bands;
  for (let i = 0; i < bands; i++) {
    const y = i * bandH;
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = ["#e8f7fb", "#2b3742", "#4a4038", "#bfe3ee", "#8a7f5f"][i % 5]!;
    ctx.fillRect(0, y + bandH * 0.42, w, bandH * 0.16);
    ctx.globalAlpha = 1;
    if (i === highlight) {
      ctx.fillStyle = "rgba(243,250,248,0.85)";
      ctx.fillRect(0, y + bandH * 0.36, w, 3);
      ctx.fillRect(0, y + bandH * 0.62, w, 3);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  return t;
}
