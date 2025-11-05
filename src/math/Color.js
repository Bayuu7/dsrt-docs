import { clamp, euclideanModulo, lerp } from './MathUtils.js';
import { ColorManagement, SRGBToLinear, LinearToSRGB } from './ColorManagement.js';
import { SRGBColorSpace } from '../constants.js';
import { warn } from '../utils.js';

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
 * @class DSRTColor
 */
class DSRTColor {
  /**
   * Create a new DSRTColor.
   * @param {number|string|DSRTColor} [r] - Red component, hex value, CSS string, or DSRTColor.
   * @param {number} [g] - Green component if using RGB.
   * @param {number} [b] - Blue component if using RGB.
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
   * Set this color from various input types.
   * @param {number|string|DSRTColor} r - Hex number, CSS string, or DSRTColor.
   * @param {number} [g] - Green component if using RGB.
   * @param {number} [b] - Blue component if using RGB.
   * @returns {DSRTColor}
   */
  set(r, g, b) {
    if (g === undefined && b === undefined) {
      if (r && r.isColor) {
        return this.copy(r);
      } else if (typeof r === 'number') {
        return this.setHex(r);
      } else if (typeof r === 'string') {
        return this.setStyle(r);
      }
    } else {
      return this.setRGB(r, g, b);
    }
    return this;
  }

  /**
   * Set all components to the same scalar value.
   * @param {number} s - Scalar value.
   * @returns {DSRTColor}
   */
  setScalar(s) {
    this.r = this.g = this.b = s;
    return this;
  }

  /**
   * Set this color from a hex value.
   * @param {number} hex - Hexadecimal color value.
   * @param {string} [colorSpace=SRGBColorSpace] - Color space.
   * @returns {DSRTColor}
   */
  setHex(hex, colorSpace = SRGBColorSpace) {
    hex = Math.floor(hex);
    this.r = (hex >> 16 & 255) / 255;
    this.g = (hex >> 8 & 255) / 255;
    this.b = (hex & 255) / 255;
    ColorManagement.colorSpaceToWorking(this, colorSpace);
    return this;
  }

  /**
   * Set this color from RGB values.
   * @param {number} r - Red component.
   * @param {number} g - Green component.
   * @param {number} b - Blue component.
   * @param {string} [colorSpace=ColorManagement.workingColorSpace] - Color space.
   * @returns {DSRTColor}
   */
  setRGB(r, g, b, colorSpace = ColorManagement.workingColorSpace) {
    this.r = r;
    this.g = g;
    this.b = b;
    ColorManagement.colorSpaceToWorking(this, colorSpace);
    return this;
  }

  /**
   * Set this color from HSL values.
   * @param {number} h - Hue [0,1].
   * @param {number} s - Saturation [0,1].
   * @param {number} l - Lightness [0,1].
   * @param {string} [colorSpace=ColorManagement.workingColorSpace] - Color space.
   * @returns {DSRTColor}
   */
  setHSL(h, s, l, colorSpace = ColorManagement.workingColorSpace) {
    h = euclideanModulo(h, 1);
    s = clamp(s, 0, 1);
    l = clamp(l, 0, 1);

    if (s === 0) {
      this.r = this.g = this.b = l;
    } else {
      const p = l <= 0.5 ? l * (1 + s) : l + s - (l * s);
      const q = (2 * l) - p;
      this.r = hue2rgb(q, p, h + 1 / 3);
      this.g = hue2rgb(q, p, h);
      this.b = hue2rgb(q, p, h - 1 / 3);
    }
    ColorManagement.colorSpaceToWorking(this, colorSpace);
    return this;
  }

  /**
   * Set this color from a CSS style string.
   * @param {string} style - CSS color name.
   * @param {string} [colorSpace=SRGBColorSpace] - Color space.
   * @returns {DSRTColor}
   */
  setStyle(style, colorSpace = SRGBColorSpace) {
    const hex = DSRTColor.NAMES[style.toLowerCase()];
    if (hex !== undefined) {
      return this.setHex(hex, colorSpace);
    }
    warn('DSRT.Color: Unknown style ' + style);
    return this;
  }

  /**
   * Set this color from a named color.
   * @param {string} style - Named color.
   * @param {string} [colorSpace=SRGBColorSpace] - Color space.
   * @returns {DSRTColor}
   */
  setColorName(style, colorSpace = SRGBColorSpace) {
    const hex = DSRTColor.NAMES[style.toLowerCase()];
    if (hex !== undefined) {
      this.setHex(hex, colorSpace);
    } else {
      warn('DSRT.Color: Unknown color ' + style);
    }
    return this;
  }

  /**
   * Clone this color.
   * @returns {DSRTColor}
   */
  clone() {
    return new DSRTColor(this.r, this.g, this.b);
  }

  /**
   * Copy another color into this one.
   * @param {DSRTColor} color - Source color.
   * @returns {DSRTColor}
   */
  copy(color) {
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;
    return this;
  }

  /**
   * Copy from SRGB to linear space.
   * @param {DSRTColor} color - Source color.
   * @returns {DSRTColor}
   */
  copySRGBToLinear(color) {
    this.r = SRGBToLinear(color.r);
    this.g = SRGBToLinear(color.g);
    this.b = SRGBToLinear(color.b);
    return this;
  }

  /**
   * Copy from linear to SRGB space.
   * @param {DSRTColor} color - Source color.
   * @returns {DSRTColor}
   */
  copyLinearToSRGB(color) {
    this.r = LinearToSRGB(color.r);
    this.g = LinearToSRGB(color.g);
    this.b = LinearToSRGB(color.b);
    return this;
  }

  /**
   * Convert this color from SRGB to linear.
   * @returns {DSRTColor}
   */
  convertSRGBToLinear() {
    return this.copySRGBToLinear(this);
  }

  /**
   * Convert this color from linear to SRGB.
   * @returns {DSRTColor}
   */
  convertLinearToSRGB() {
    return this.copyLinearToSRGB(this);
  }

  /**
   * Get this color as a hex value.
   * @param {string} [colorSpace=SRGBColorSpace] - Color space.
   * @returns {number}
   */
  getHex(colorSpace = SRGBColorSpace) {
    const r = clamp(this.r * 255, 0, 255);
    const g = clamp(this.g * 255, 0, 255);
    const b = clamp(this.b * 255, 0, 255);
    return (Math.round(r) << 16) ^ (Math.round(g) << 8) ^ Math.round(b);
  }

    /**
   * Get this color as a hex string.
   * @param {string} [colorSpace=SRGBColorSpace] - Color space.
   * @returns {string} Hex string (e.g. "ff0000").
   */
  getHexString(colorSpace = SRGBColorSpace) {
    return ('000000' + this.getHex(colorSpace).toString(16)).slice(-6);
  }

  /**
   * Get this color as HSL values.
   * @param {{h:number,s:number,l:number}} target - Target object to receive HSL.
   * @param {string} [colorSpace=ColorManagement.workingColorSpace] - Color space.
   * @returns {{h:number,s:number,l:number}} The target object with HSL values.
   */
  getHSL(target, colorSpace = ColorManagement.workingColorSpace) {
    const r = this.r, g = this.g, b = this.b;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s;
    const l = (min + max) / 2;
    if (min === max) {
      h = 0; s = 0;
    } else {
      const d = max - min;
      s = l <= 0.5 ? d / (max + min) : d / (2 - max - min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    target.h = h; target.s = s; target.l = l;
    return target;
  }

  /**
   * Get this color as RGB values.
   * @param {{r:number,g:number,b:number}} target - Target object to receive RGB.
   * @param {string} [colorSpace=ColorManagement.workingColorSpace] - Color space.
   * @returns {{r:number,g:number,b:number}} The target object with RGB values.
   */
  getRGB(target, colorSpace = ColorManagement.workingColorSpace) {
    target.r = this.r;
    target.g = this.g;
    target.b = this.b;
    return target;
  }

  /**
   * Get this color as a CSS rgb() string.
   * @param {string} [colorSpace=SRGBColorSpace] - Color space.
   * @returns {string} CSS rgb() string.
   */
  getStyle(colorSpace = SRGBColorSpace) {
    return `rgb(${Math.round(this.r * 255)},${Math.round(this.g * 255)},${Math.round(this.b * 255)})`;
  }

  /**
   * Offset this color in HSL space.
   * @param {number} h - Hue offset.
   * @param {number} s - Saturation offset.
   * @param {number} l - Lightness offset.
   * @returns {DSRTColor}
   */
  offsetHSL(h, s, l) {
    this.getHSL(_hslA);
    return this.setHSL(_hslA.h + h, _hslA.s + s, _hslA.l + l);
  }

  /**
   * Add another color to this one.
   * @param {DSRTColor} color - Color to add.
   * @returns {DSRTColor}
   */
  add(color) {
    this.r += color.r;
    this.g += color.g;
    this.b += color.b;
    return this;
  }

  /**
   * Set this color to the sum of two colors.
   * @param {DSRTColor} c1 - First color.
   * @param {DSRTColor} c2 - Second color.
   * @returns {DSRTColor}
   */
  addColors(c1, c2) {
    this.r = c1.r + c2.r;
    this.g = c1.g + c2.g;
    this.b = c1.b + c2.b;
    return this;
  }

  /**
   * Add a scalar to all components.
   * @param {number} s - Scalar value.
   * @returns {DSRTColor}
   */
  addScalar(s) {
    this.r += s;
    this.g += s;
    this.b += s;
    return this;
  }

  /**
   * Subtract another color from this one (clamped at 0).
   * @param {DSRTColor} color - Color to subtract.
   * @returns {DSRTColor}
   */
  sub(color) {
    this.r = Math.max(0, this.r - color.r);
    this.g = Math.max(0, this.g - color.g);
    this.b = Math.max(0, this.b - color.b);
    return this;
  }

  /**
   * Multiply this color by another.
   * @param {DSRTColor} color - Color to multiply with.
   * @returns {DSRTColor}
   */
  multiply(color) {
    this.r *= color.r;
    this.g *= color.g;
    this.b *= color.b;
    return this;
  }

  /**
   * Multiply this color by a scalar.
   * @param {number} s - Scalar value.
   * @returns {DSRTColor}
   */
  multiplyScalar(s) {
    this.r *= s;
    this.g *= s;
    this.b *= s;
    return this;
  }

  /**
   * Linearly interpolate this color towards another.
   * @param {DSRTColor} color - Target color.
   * @param {number} alpha - Interpolation factor [0,1].
   * @returns {DSRTColor}
   */
  lerp(color, alpha) {
    this.r += (color.r - this.r) * alpha;
    this.g += (color.g - this.g) * alpha;
    this.b += (color.b - this.b) * alpha;
    return this;
  }

  /**
   * Set this color to the linear interpolation of two colors.
   * @param {DSRTColor} c1 - First color.
   * @param {DSRTColor} c2 - Second color.
   * @param {number} alpha - Interpolation factor [0,1].
   * @returns {DSRTColor}
   */
  lerpColors(c1, c2, alpha) {
    this.r = c1.r + (c2.r - c1.r) * alpha;
    this.g = c1.g + (c2.g - c1.g) * alpha;
    this.b = c1.b + (c2.b - c1.b) * alpha;
    return this;
  }

  /**
   * Linearly interpolate this color towards another in HSL space.
   * @param {DSRTColor} color - Target color.
   * @param {number} alpha - Interpolation factor [0,1].
   * @returns {DSRTColor}
   */
  lerpHSL(color, alpha) {
    this.getHSL(_hslA);
    color.getHSL(_hslB);
    const h = lerp(_hslA.h, _hslB.h, alpha);
    const s = lerp(_hslA.s, _hslB.s, alpha);
    const l = lerp(_hslA.l, _hslB.l, alpha);
    return this.setHSL(h, s, l);
  }

  /**
   * Set this color from a Vector3.
   * @param {{x:number,y:number,z:number}} v - Vector3 with x,y,z mapped to r,g,b.
   * @returns {DSRTColor}
   */
  setFromVector3(v) {
    this.r = v.x;
    this.g = v.y;
    this.b = v.z;
    return this;
  }

  /**
   * Apply a 3x3 matrix to this color.
   * @param {{elements:number[]}} m - Matrix3 with elements array.
   * @returns {DSRTColor}
   */
  applyMatrix3(m) {
    const r = this.r, g = this.g, b = this.b;
    const e = m.elements;
    this.r = e[0] * r + e[3] * g + e[6] * b;
    this.g = e[1] * r + e[4] * g + e[7] * b;
    this.b = e[2] * r + e[5] * g + e[8] * b;
    return this;
  }

  /**
   * Test equality with another color.
   * @param {DSRTColor} c - Color to compare.
   * @returns {boolean}
   */
  equals(c) {
    return (c.r === this.r) && (c.g === this.g) && (c.b === this.b);
  }

    /**
   * Set this color from an array of numbers.
   * @param {number[]} arr - Array containing color components.
   * @param {number} [offset=0] - Index offset in the array.
   * @returns {DSRTColor}
   * @example
   * const c = new DSRTColor().fromArray([0.2, 0.4, 0.6]);
   * // c.r=0.2, c.g=0.4, c.b=0.6
   */
  fromArray(arr, offset = 0) {
    this.r = arr[offset];
    this.g = arr[offset + 1];
    this.b = arr[offset + 2];
    return this;
  }

  /**
   * Write this color into an array.
   * @param {number[]} [arr=[]] - Target array.
   * @param {number} [offset=0] - Index offset in the array.
   * @returns {number[]} The target array with r,g,b written.
   * @example
   * const c = new DSRTColor(0.1,0.2,0.3);
   * const arr = c.toArray();
   * // arr = [0.1,0.2,0.3]
   */
  toArray(arr = [], offset = 0) {
    arr[offset] = this.r;
    arr[offset + 1] = this.g;
    arr[offset + 2] = this.b;
    return arr;
  }

  /**
   * Set this color from a buffer attribute.
   * @param {{getX:function, getY:function, getZ:function}} attr - Buffer attribute.
   * @param {number} index - Index of the attribute.
   * @returns {DSRTColor}
   */
  fromBufferAttribute(attr, index) {
    this.r = attr.getX(index);
    this.g = attr.getY(index);
    this.b = attr.getZ(index);
    return this;
  }

  /**
   * Serialize this color to JSON.
   * @param {string} [colorSpace=SRGBColorSpace] - Color space.
   * @returns {{type:string,hex:number,r:number,g:number,b:number,colorSpace:string}}
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
   * Deserialize this color from JSON.
   * @param {{hex:number,colorSpace?:string}} json - JSON object.
   * @returns {DSRTColor}
   */
  fromJSON(json) {
    if (json && json.hex !== undefined) {
      this.setHex(json.hex, json.colorSpace || SRGBColorSpace);
    }
    return this;
  }

  /**
   * Iterator for r,g,b values.
   * Enables `for...of` iteration.
   * @yields {number} r, g, b components.
   */
  *[Symbol.iterator]() {
    yield this.r;
    yield this.g;
    yield this.b;
  }
}

// Attach the full X11 color dictionary
DSRTColor.NAMES = {
  'aliceblue': 0xF0F8FF, 'antiquewhite': 0xFAEBD7, 'aqua': 0x00FFFF, 'aquamarine': 0x7FFFD4,
  'azure': 0xF0FFFF, 'beige': 0xF5F5DC, 'bisque': 0xFFE4C4, 'black': 0x000000,
  'blanchedalmond': 0xFFEBCD, 'blue': 0x0000FF, 'blueviolet': 0x8A2BE2, 'brown': 0xA52A2A,
  'burlywood': 0xDEB887, 'cadetblue': 0x5F9EA0, 'chartreuse': 0x7FFF00, 'chocolate': 0xD2691E,
  'coral': 0xFF7F50, 'cornflowerblue': 0x6495ED, 'cornsilk': 0xFFF8DC, 'crimson': 0xDC143C,
  'cyan': 0x00FFFF, 'darkblue': 0x00008B, 'darkcyan': 0x008B8B, 'darkgoldenrod': 0xB8860B,
  'darkgray': 0xA9A9A9, 'darkgreen': 0x006400, 'darkgrey': 0xA9A9A9, 'darkkhaki': 0xBDB76B,
  'darkmagenta': 0x8B008B, 'darkolivegreen': 0x556B2F, 'darkorange': 0xFF8C00, 'darkorchid': 0x9932CC,
  'darkred': 0x8B0000, 'darksalmon': 0xE9967A, 'darkseagreen': 0x8FBC8F, 'darkslateblue': 0x483D8B,
  'darkslategray': 0x2F4F4F, 'darkslategrey': 0x2F4F4F, 'darkturquoise': 0x00CED1, 'darkviolet': 0x9400D3,
  'deeppink': 0xFF1493, 'deepskyblue': 0x00BFFF, 'dimgray': 0x696969, 'dimgrey': 0x696969,
  'dodgerblue': 0x1E90FF, 'firebrick': 0xB22222, 'floralwhite': 0xFFFAF0, 'forestgreen': 0x228B22,
  'fuchsia': 0xFF00FF, 'gainsboro': 0xDCDCDC, 'ghostwhite': 0xF8F8FF, 'gold': 0xFFD700,
  'goldenrod': 0xDAA520, 'gray': 0x808080, 'green': 0x008000, 'greenyellow': 0xADFF2F,
  'grey': 0x808080, 'honeydew': 0xF0FFF0, 'hotpink': 0xFF69B4, 'indianred': 0xCD5C5C,
  'indigo': 0x4B0082, 'ivory': 0xFFFFF0, 'khaki': 0xF0E68C, 'lavender': 0xE6E6FA,
  'lavenderblush': 0xFFF0F5, 'lawngreen': 0x7CFC00, 'lemonchiffon': 0xFFFACD, 'lightblue': 0xADD8E6,
  'lightcoral': 0xF08080, 'lightcyan': 0xE0FFFF, 'lightgoldenrodyellow': 0xFAFAD2, 'lightgray': 0xD3D3D3,
  'lightgreen': 0x90EE90, 'lightgrey': 0xD3D3D3, 'lightpink': 0xFFB6C1, 'lightsalmon': 0xFFA07A,
  'lightseagreen': 0x20B2AA, 'lightskyblue': 0x87CEFA, 'lightslategray': 0x778899, 'lightslategrey': 0x778899,
  'lightsteelblue': 0xB0C4DE, 'lightyellow': 0xFFFFE0, 'lime': 0x00FF00, 'limegreen': 0x32CD32,
  'linen': 0xFAF0E6, 'magenta': 0xFF00FF, 'maroon': 0x800000, 'mediumaquamarine': 0x66CDAA,
  'mediumblue': 0x0000CD, 'mediumorchid': 0xBA55D3, 'mediumpurple': 0x9370DB, 'mediumseagreen': 0x3CB371,
  'mediumslateblue': 0x7B68EE, 'mediumspringgreen': 0x00FA9A, 'mediumturquoise': 0x48D1CC, 'mediumvioletred': 0xC71585,
  'midnightblue': 0x191970, 'mintcream': 0xF5FFFA, 'mistyrose': 0xFFE4E1, 'moccasin': 0xFFE4B5,
  'navajowhite': 0xFFDEAD, 'navy': 0x000080, 'oldlace': 0xFDF5E6, 'olive': 0x808000,
  'olivedrab': 0x6B8E23, 'orange': 0xFFA500, 'orangered': 0xFF4500, 'orchid': 0xDA70D6,
  'palegoldenrod': 0xEEE8AA, 'palegreen': 0x98FB98, 'paleturquoise': 0xAFEEEE, 'palevioletred': 0xDB7093,
  'papayawhip': 0xFFEFD5, 'peachpuff': 0xFFDAB9, 'peru': 0xCD853F, 'pink': 0xFFC0CB,
  'plum': 0xDDA0DD, 'powderblue': 0xB0E0E6, 'purple': 0x800080, 'rebeccapurple': 0x663399,
  'red': 0xFF0000, 'rosybrown': 0xBC8F8F, 'royalblue': 0x4169E1, 'saddlebrown': 0x8B4513,
  'salmon': 0xFA8072, 'sandybrown': 0xF4A460, 'seagreen': 0x2E8B57, 'seashell': 0xFFF5EE,
  'sienna': 0xA0522D, 'silver': 0xC0C0C0, 'skyblue': 0x87CEEB, 'slateblue': 0x6A5ACD,
  'slategray': 0x708090, 'slategrey': 0x708090, 'snow': 0xFFFAFA, 'springgreen': 0x00FF7F,
  'steelblue': 0x4682B4, 'tan': 0xD2B48C, 'teal': 0x008080, 'thistle': 0xD8BFD8,
  'tomato': 0xFF6347, 'turquoise': 0x40E0D0, 'violet': 0xEE82EE, 'wheat': 0xF5DEB3,
  'white': 0xFFFFFF, 'whitesmoke': 0xF5F5F5, 'yellow': 0xFFFF00, 'yellowgreen': 0x9ACD32
};

export { DSRTColor };
