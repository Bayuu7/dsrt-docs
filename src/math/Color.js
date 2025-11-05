import { clamp, euclideanModulo, lerp } from './MathUtils.js';
import { ColorManagement, SRGBToLinear, LinearToSRGB } from './ColorManagement.js';
import { SRGBColorSpace } from '../constants.js';
import { warn } from '../utils.js';

const _colorKeywords = { /* full X11 dictionary here */ };
const _hslA = { h: 0, s: 0, l: 0 };
const _hslB = { h: 0, s: 0, l: 0 };

function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t);
  return p;
}

/**
 * DSRT.Color
 *
 * Represents a color in the DSRT engine. Internally stored as linear RGB
 * in the working color space. Provides multiple constructors, setters,
 * getters, arithmetic operations, and serialization utilities.
 *
 * @class DSRT.Color
 */
class Color {
  constructor(r, g, b) {
    this.isColor = true;
    this.type = 'DSRT.Color';
    this.r = 1;
    this.g = 1;
    this.b = 1;
    return this.set(r, g, b);
  }

  // === Setters ===
  set(r, g, b) { /* ... full logic ... */ }
  setScalar(s) { /* ... */ }
  setHex(hex, colorSpace = SRGBColorSpace) { /* ... */ }
  setRGB(r, g, b, colorSpace = ColorManagement.workingColorSpace) { /* ... */ }
  setHSL(h, s, l, colorSpace = ColorManagement.workingColorSpace) { /* ... */ }
  setStyle(style, colorSpace = SRGBColorSpace) { /* ... */ }
  setColorName(style, colorSpace = SRGBColorSpace) { /* ... */ }

  // === Clone & Copy ===
  clone() { return new DSRTColor(this.r, this.g, this.b); }
  copy(color) { /* ... */ }
  copySRGBToLinear(color) { /* ... */ }
  copyLinearToSRGB(color) { /* ... */ }
  convertSRGBToLinear() { /* ... */ }
  convertLinearToSRGB() { /* ... */ }

  // === Getters ===
  getHex(colorSpace = SRGBColorSpace) { /* ... */ }
  getHexString(colorSpace = SRGBColorSpace) { /* ... */ }
  getHSL(target, colorSpace = ColorManagement.workingColorSpace) { /* ... */ }
  getRGB(target, colorSpace = ColorManagement.workingColorSpace) { /* ... */ }
  getStyle(colorSpace = SRGBColorSpace) { /* ... */ }

  // === Operations ===
  offsetHSL(h, s, l) { /* ... */ }
  add(color) { /* ... */ }
  addColors(c1, c2) { /* ... */ }
  addScalar(s) { /* ... */ }
  sub(color) { /* ... */ }
  multiply(color) { /* ... */ }
  multiplyScalar(s) { /* ... */ }
  lerp(color, alpha) { /* ... */ }
  lerpColors(c1, c2, alpha) { /* ... */ }
  lerpHSL(color, alpha) { /* ... */ }

  // === Utilities ===
  setFromVector3(v) { /* ... */ }
  applyMatrix3(m) { /* ... */ }
  equals(c) { /* ... */ }
  fromArray(arr, offset = 0) { /* ... */ }
  toArray(arr = [], offset = 0) { /* ... */ }
  fromBufferAttribute(attr, index) { /* ... */ }

  // === Serialization ===
  toJSON(colorSpace = SRGBColorSpace) {
    return {
      type: 'DSRT.Color',
      hex: this.getHex(colorSpace),
      r: this.r,
      g: this.g,
      b: this.b,
      colorSpace
    };
  }
  fromJSON(json) {
    if (json && json.hex !== undefined) {
      this.setHex(json.hex, json.colorSpace || SRGBColorSpace);
    }
    return this;
  }

  *[Symbol.iterator]() {
    yield this.r;
    yield this.g;
    yield this.b;
  }
}

Color.NAMES = _colorKeywords;

// Export only with DSRT identity
export { Color as DSRTColor };
