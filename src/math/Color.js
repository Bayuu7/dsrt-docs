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
  /**
   * Construct a new DSRT.Color.
   * @param {(number|string|DSRT.Color)} [r] - Hex, CSS string, or DSRT.Color.
   * @param {number} [g] - Green channel [0..1].
   * @param {number} [b] - Blue channel [0..1].
   */
  constructor(r, g, b) {
    this.isColor = true;
    this.type = 'DSRT.Color';
    this.r = 1;
    this.g = 1;
    this.b = 1;
    return this.set(r, g, b);
  }

  /**
   * Set this color from another color, hex, or CSS string.
   * @param {(number|string|DSRT.Color)} r
   * @param {number} [g]
   * @param {number} [b]
   * @returns {DSRT.Color}
   */
  set(r, g, b) { /* implementation */ }

  /** @param {number} s - Scalar value. @returns {DSRT.Color} */
  setScalar(s) { /* implementation */ }

  /** @param {number} hex - Hex value. @param {string} [colorSpace] @returns {DSRT.Color} */
  setHex(hex, colorSpace = SRGBColorSpace) { /* implementation */ }

  /** @param {number} r @param {number} g @param {number} b @param {string} [colorSpace] @returns {DSRT.Color} */
  setRGB(r, g, b, colorSpace = ColorManagement.workingColorSpace) { /* implementation */ }

  /** @param {number} h @param {number} s @param {number} l @param {string} [colorSpace] @returns {DSRT.Color} */
  setHSL(h, s, l, colorSpace = ColorManagement.workingColorSpace) { /* implementation */ }

  /** @param {string} style - CSS string. @param {string} [colorSpace] @returns {DSRT.Color} */
  setStyle(style, colorSpace = SRGBColorSpace) { /* implementation */ }

  /** @param {string} style - X11 name. @param {string} [colorSpace] @returns {DSRT.Color} */
  setColorName(style, colorSpace = SRGBColorSpace) { /* implementation */ }

  /** @returns {DSRT.Color} */
  clone() { return new Color(this.r, this.g, this.b); }

  /** @param {DSRT.Color} color @returns {DSRT.Color} */
  copy(color) { /* implementation */ }

  /** @param {DSRT.Color} color @returns {DSRT.Color} */
  copySRGBToLinear(color) { /* implementation */ }

  /** @param {DSRT.Color} color @returns {DSRT.Color} */
  copyLinearToSRGB(color) { /* implementation */ }

  /** @returns {DSRT.Color} */
  convertSRGBToLinear() { /* implementation */ }

  /** @returns {DSRT.Color} */
  convertLinearToSRGB() { /* implementation */ }

  /** @param {string} [colorSpace] @returns {number} */
  getHex(colorSpace = SRGBColorSpace) { /* implementation */ }

  /** @param {string} [colorSpace] @returns {string} */
  getHexString(colorSpace = SRGBColorSpace) { /* implementation */ }

  /** @param {Object} target @param {string} [colorSpace] @returns {Object} */
  getHSL(target, colorSpace = ColorManagement.workingColorSpace) { /* implementation */ }

  /** @param {DSRT.Color} target @param {string} [colorSpace] @returns {DSRT.Color} */
  getRGB(target, colorSpace = ColorManagement.workingColorSpace) { /* implementation */ }

  /** @param {string} [colorSpace] @returns {string} */
  getStyle(colorSpace = SRGBColorSpace) { /* implementation */ }

  /** @param {number} h @param {number} s @param {number} l @returns {DSRT.Color} */
  offsetHSL(h, s, l) { /* implementation */ }

  /** @param {DSRT.Color} color @returns {DSRT.Color} */
  add(color) { /* implementation */ }

    /**
   * Add the RGB values of two colors and store the result in this instance.
   * @param {DSRT.Color} c1 - First color.
   * @param {DSRT.Color} c2 - Second color.
   * @returns {DSRT.Color} Reference to this color.
   */
  addColors(c1, c2) { /* implementation */ }

  /**
   * Add a scalar to all channels.
   * @param {number} s - Scalar value.
   * @returns {DSRT.Color}
   */
  addScalar(s) { /* implementation */ }

  /**
   * Subtract another color (clamped at 0).
   * @param {DSRT.Color} color
   * @returns {DSRT.Color}
   */
  sub(color) { /* implementation */ }

  /**
   * Multiply by another color.
   * @param {DSRT.Color} color
   * @returns {DSRT.Color}
   */
  multiply(color) { /* implementation */ }

  /**
   * Multiply by scalar.
   * @param {number} s
   * @returns {DSRT.Color}
   */
  multiplyScalar(s) { /* implementation */ }

  /**
   * Linearly interpolate towards another color.
   * @param {DSRT.Color} color - Target color.
   * @param {number} alpha - Interpolation factor [0..1].
   * @returns {DSRT.Color}
   */
  lerp(color, alpha) { /* implementation */ }

  /**
   * Interpolate between two colors and store result.
   * @param {DSRT.Color} c1
   * @param {DSRT.Color} c2
   * @param {number} alpha - Interpolation factor [0..1].
   * @returns {DSRT.Color}
   */
  lerpColors(c1, c2, alpha) { /* implementation */ }

  /**
   * Interpolate in HSL space towards another color.
   * @param {DSRT.Color} color
   * @param {number} alpha
   * @returns {DSRT.Color}
   */
  lerpHSL(color, alpha) { /* implementation */ }

  /**
   * Set from a Vector3.
   * @param {Vector3} v
   * @returns {DSRT.Color}
   */
  setFromVector3(v) { /* implementation */ }

  /**
   * Apply a 3x3 matrix transform.
   * @param {Matrix3} m
   * @returns {DSRT.Color}
   */
  applyMatrix3(m) { /* implementation */ }

  /**
   * Test equality with another color.
   * @param {DSRT.Color} c
   * @returns {boolean}
   */
  equals(c) { /* implementation */ }

  /**
   * Load from array.
   * @param {Array<number>} arr
   * @param {number} [offset=0]
   * @returns {DSRT.Color}
   */
  fromArray(arr, offset = 0) { /* implementation */ }

  /**
   * Write to array.
   * @param {Array<number>} [arr=[]]
   * @param {number} [offset=0]
   * @returns {Array<number>}
   */
  toArray(arr = [], offset = 0) { /* implementation */ }

  /**
   * Load from buffer attribute.
   * @param {BufferAttribute} attr
   * @param {number} index
   * @returns {DSRT.Color}
   */
  fromBufferAttribute(attr, index) { /* implementation */ }

  /**
   * Serialize to DSRT JSON schema.
   * @param {string} [colorSpace=SRGBColorSpace]
   * @returns {Object}
   */
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

  /**
   * Load from DSRT JSON schema.
   * @param {Object} json
   * @returns {DSRT.Color}
   */
  fromJSON(json) {
    if (json && json.hex !== undefined) {
      this.setHex(json.hex, json.colorSpace || SRGBColorSpace);
    }
    return this;
  }

  /**
   * Iterate over [r,g,b].
   * @yields {number}
   */
  *[Symbol.iterator]() {
    yield this.r;
    yield this.g;
    yield this.b;
  }
}

Color.NAMES = _colorKeywords;
export { Color as DSRTColor };
