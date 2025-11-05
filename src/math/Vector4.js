// DSRT Math Utilities
import { clamp } from './MathUtils.js';

/**
 * DSRT Vector4
 * ------------
 * Foundational 4D vector for DSRT (x, y, z, w).
 *
 * Purpose:
 * - Represent points, directions, and homogeneous coordinates for transforms.
 * - Provide complete, production-grade API with DSRT branding and onboarding-friendly documentation.
 *
 * DSRT Principles:
 * - Identity flags use explicit instance properties (no prototype or double-underscore patterns).
 * - Comments are exhaustive and practical: describe behavior, edge cases, and expected usage.
 * - Serialization uses DSRT-native schema (no legacy formats).
 * - Methods are mutable; clone() provides immutability when needed.
 *
 * Conventions:
 * - Components: x, y, z, w (w defaults to 1 for homogeneous operations).
 * - All operations return `this` for chaining unless they return a number or array.
 * - Equality is strict (===). For tolerance-based comparisons, implement separately.
 */
class Vector4 {
  /**
   * Construct a new DSRT.Vector4.
   *
   * Notes:
   * - Default components: (0, 0, 0, 1). This plays well with homogeneous transforms.
   * - Mutable class: operations change the instance.
   *
   * @param {number} [x=0] Initial X component.
   * @param {number} [y=0] Initial Y component.
   * @param {number} [z=0] Initial Z component.
   * @param {number} [w=1] Initial W component (homogeneous coordinate).
   */
  constructor(x = 0, y = 0, z = 0, w = 1) {
    /** DSRT identity flag for type testing. */
    this.inVector4 = true;

    /** X component. */ this.x = x;
    /** Y component. */ this.y = y;
    /** Z component. */ this.z = z;
    /** W component. */ this.w = w;
  }

  // --------------------------------------------------------------------------
  // Aliases (UI-oriented semantics)
  // --------------------------------------------------------------------------

  /**
   * Alias of z; useful for 2D layout semantics mapping into 4D slots.
   */
  get width() { return this.z; }
  set width(value) { this.z = value; }

  /**
   * Alias of w; useful for 2D layout semantics mapping into 4D slots.
   */
  get height() { return this.w; }
  set height(value) { this.w = value; }

  // --------------------------------------------------------------------------
  // Setters / getters
  // --------------------------------------------------------------------------

  /**
   * Set all components at once.
   *
   * @returns {Vector4} this
   *
   * @example
   * v.set(1,2,3,1); // v = (1,2,3,1)
   */
  set(x, y, z, w) {
    this.x = x; this.y = y; this.z = z; this.w = w;
    return this;
  }

  /**
   * Set all components to the same scalar.
   *
   * @returns {Vector4} this
   *
   * @example
   * v.setScalar(0); // (0,0,0,0)
   */
  setScalar(s) {
    this.x = s; this.y = s; this.z = s; this.w = s;
    return this;
  }

  /** Set X only. */ setX(x) { this.x = x; return this; }
  /** Set Y only. */ setY(y) { this.y = y; return this; }
  /** Set Z only. */ setZ(z) { this.z = z; return this; }
  /** Set W only. */ setW(w) { this.w = w; return this; }

  /**
   * Set a component by index.
   *
   * Index map:
   * - 0 → x
   * - 1 → y
   * - 2 → z
   * - 3 → w
   *
   * @returns {Vector4} this
   */
  setComponent(index, value) {
    switch (index) {
      case 0: this.x = value; break;
      case 1: this.y = value; break;
      case 2: this.z = value; break;
      case 3: this.w = value; break;
      default: throw new Error('index is out of range: ' + index);
    }
    return this;
  }

  /**
   * Get a component by index.
   *
   * @returns {number}
   */
  getComponent(index) {
    switch (index) {
      case 0: return this.x;
      case 1: return this.y;
      case 2: return this.z;
      case 3: return this.w;
      default: throw new Error('index is out of range: ' + index);
    }
  }

  /**
   * Clone into a new instance.
   *
   * @returns {Vector4}
   */
  clone() { return new this.constructor(this.x, this.y, this.z, this.w); }

  /**
   * Copy components from another vector (Vector3 or Vector4).
   *
   * Notes:
   * - If source has no w, default to 1 (homogeneous-friendly).
   *
   * @param {Vector3|Vector4} v
   * @returns {Vector4} this
   */
  copy(v) {
    this.x = v.x; this.y = v.y; this.z = v.z;
    this.w = (v.w !== undefined) ? v.w : 1;
    return this;
  }

  // --------------------------------------------------------------------------
  // Addition / subtraction
  // --------------------------------------------------------------------------

  /**
   * Add another vector component-wise.
   *
   * @param {Vector4} v
   * @returns {Vector4} this
   */
  add(v) { this.x += v.x; this.y += v.y; this.z += v.z; this.w += v.w; return this; }

  /**
   * Add a scalar to all components.
   *
   * @param {number} s
   * @returns {Vector4} this
   */
  addScalar(s) { this.x += s; this.y += s; this.z += s; this.w += s; return this; }

  /**
   * Set to sum of two vectors: this = a + b.
   *
   * @param {Vector4} a
   * @param {Vector4} b
   * @returns {Vector4} this
   */
  addVectors(a, b) {
    this.x = a.x + b.x; this.y = a.y + b.y; this.z = a.z + b.z; this.w = a.w + b.w;
    return this;
  }

  /**
   * Add a scaled vector: this += v * s.
   *
   * @param {Vector4} v
   * @param {number} s
   * @returns {Vector4} this
   */
  addScaledVector(v, s) {
    this.x += v.x * s; this.y += v.y * s; this.z += v.z * s; this.w += v.w * s;
    return this;
  }

  /**
   * Subtract another vector component-wise.
   *
   * @param {Vector4} v
   * @returns {Vector4} this
   */
  sub(v) { this.x -= v.x; this.y -= v.y; this.z -= v.z; this.w -= v.w; return this; }

  /**
   * Subtract a scalar from all components.
   *
   * @param {number} s
   * @returns {Vector4} this
   */
  subScalar(s) { this.x -= s; this.y -= s; this.z -= s; this.w -= s; return this; }

  /**
   * Set to difference of two vectors: this = a - b.
   *
   * @param {Vector4} a
   * @param {Vector4} b
   * @returns {Vector4} this
   */
  subVectors(a, b) {
    this.x = a.x - b.x; this.y = a.y - b.y; this.z = a.z - b.z; this.w = a.w - b.w;
    return this;
  }

  // --------------------------------------------------------------------------
  // Multiplication / division
  // --------------------------------------------------------------------------

  /**
   * Multiply component-wise by another vector.
   *
   * @param {Vector4} v
   * @returns {Vector4} this
   */
  multiply(v) { this.x *= v.x; this.y *= v.y; this.z *= v.z; this.w *= v.w; return this; }

  /**
   * Multiply all components by a scalar.
   *
   * @param {number} s
   * @returns {Vector4} this
   */
  multiplyScalar(s) { this.x *= s; this.y *= s; this.z *= s; this.w *= s; return this; }

  /**
   * Apply Matrix4 (homogeneous transform) to this vector.
   *
   * Notes:
   * - Uses full 4x4 multiplication including w.
   * - Suitable for affine and projective transforms.
   *
   * @param {import('./Matrix4.js').Matrix4} m
   * @returns {Vector4} this
   */
  applyMatrix4(m) {
    const x = this.x, y = this.y, z = this.z, w = this.w;
    const e = m.elements;
    this.x = e[0] * x + e[4] * y + e[8]  * z + e[12] * w;
    this.y = e[1] * x + e[5] * y + e[9]  * z + e[13] * w;
    this.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w;
    this.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w;
    return this;
  }

  /**
   * Divide component-wise by another vector.
   *
   * @param {Vector4} v
   * @returns {Vector4} this
   */
  divide(v) { this.x /= v.x; this.y /= v.y; this.z /= v.z; this.w /= v.w; return this; }

  /**
   * Divide all components by a scalar.
   *
   * @param {number} s
   * @returns {Vector4} this
   */
  divideScalar(s) { return this.multiplyScalar(1 / s); }

  // --------------------------------------------------------------------------
  // Clamp / min / max
  // --------------------------------------------------------------------------

  /**
   * Component-wise minimum with another vector.
   *
   * @param {Vector4} v
   * @returns {Vector4} this
   */
  min(v) { this.x = Math.min(this.x, v.x); this.y = Math.min(this.y, v.y); this.z = Math.min(this.z, v.z); this.w = Math.min(this.w, v.w); return this; }

  /**
   * Component-wise maximum with another vector.
   *
   * @param {Vector4} v
   * @returns {Vector4} this
   */
  max(v) { this.x = Math.max(this.x, v.x); this.y = Math.max(this.y, v.y); this.z = Math.max(this.z, v.z); this.w = Math.max(this.w, v.w); return this; }

  /**
   * Clamp components between min and max vectors.
   *
   * @param {Vector4} min
   * @param {Vector4} max
   * @returns {Vector4} this
   */
  clamp(min, max) {
    this.x = clamp(this.x, min.x, max.x);
    this.y = clamp(this.y, min.y, max.y);
    this.z = clamp(this.z, min.z, max.z);
    this.w = clamp(this.w, min.w, max.w);
    return this;
  }

  /**
   * Clamp components between scalar min/max.
   *
   * @param {number} minVal
   * @param {number} maxVal
   * @returns {Vector4} this
   */
  clampScalar(minVal, maxVal) {
    this.x = clamp(this.x, minVal, maxVal);
    this.y = clamp(this.y, minVal, maxVal);
    this.z = clamp(this.z, minVal, maxVal);
    this.w = clamp(this.w, minVal, maxVal);
    return this;
  }

  /**
   * Clamp vector length (magnitude) between min and max.
   *
   * Implementation:
   * - Normalize (safe if length=0 via divideScalar(length || 1)).
   * - Scale to clamped length.
   *
   * @param {number} min
   * @param {number} max
   * @returns {Vector4} this
   */
  clampLength(min, max) {
    const len = this.length();
    return this.divideScalar(len || 1).multiplyScalar(clamp(len, min, max));
  }

  // --------------------------------------------------------------------------
  // Rounding
  // --------------------------------------------------------------------------

  /** Floor each component. */ floor() { this.x = Math.floor(this.x); this.y = Math.floor(this.y); this.z = Math.floor(this.z); this.w = Math.floor(this.w); return this; }
  /** Ceil each component. */ ceil() { this.x = Math.ceil(this.x); this.y = Math.ceil(this.y); this.z = Math.ceil(this.z); this.w = Math.ceil(this.w); return this; }
  /** Round each component. */ round() { this.x = Math.round(this.x); this.y = Math.round(this.y); this.z = Math.round(this.z); this.w = Math.round(this.w); return this; }
  /** Truncate toward zero. */ roundToZero() { this.x = Math.trunc(this.x); this.y = Math.trunc(this.y); this.z = Math.trunc(this.z); this.w = Math.trunc(this.w); return this; }

  // --------------------------------------------------------------------------
  // Algebra & metrics
  // --------------------------------------------------------------------------

  /**
   * Negate all components.
   *
   * @returns {Vector4} this
   */
  negate() { this.x = -this.x; this.y = -this.y; this.z = -this.z; this.w = -this.w; return this; }

  /**
   * Dot product with another Vector4.
   *
   * @param {Vector4} v
   * @returns {number}
   */
  dot(v) { return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w; }

  /**
   * Squared length (avoids sqrt).
   *
   * @returns {number}
   */
  lengthSq() { return this.x*this.x + this.y*this.y + this.z*this.z + this.w*this.w; }

  /**
   * Euclidean length.
   *
   * @returns {number}
   */
  length() { return Math.sqrt(this.lengthSq()); }

  /**
   * Manhattan (L1) length.
   *
   * @returns {number}
   */
  manhattanLength() { return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w); }

  /**
   * Normalize to unit length. If length is 0, leaves vector unchanged.
   *
   * @returns {Vector4} this
   */
  normalize() { return this.divideScalar(this.length() || 1); }

  /**
   * Set this vector to a given length (magnitude).
   *
   * @param {number} l
   * @returns {Vector4} this
   */
  setLength(l) { return this.normalize().multiplyScalar(l); }

  /**
   * Linear interpolate toward another vector.
   *
   * Formula:
   * - this = this + (v - this) * alpha
   *
   * @param {Vector4} v
   * @param {number} alpha
   * @returns {Vector4} this
   */
  lerp(v, alpha) {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;
    this.z += (v.z - this.z) * alpha;
    this.w += (v.w - this.w) * alpha;
    return this;
  }

  /**
   * Linear interpolate between two vectors and store into this.
   *
   * @param {Vector4} v1
   * @param {Vector4} v2
   * @param {number} alpha
   * @returns {Vector4} this
   */
  lerpVectors(v1, v2, alpha) {
    this.x = v1.x + (v2.x - v1.x) * alpha;
    this.y = v1.y + (v2.y - v1.y) * alpha;
    this.z = v1.z + (v2.z - v1.z) * alpha;
    this.w = v1.w + (v2.w - v1.w) * alpha;
    return this;
  }

  // --------------------------------------------------------------------------
  // Equality & Array/Buffer I/O
  // --------------------------------------------------------------------------

  /**
   * Strict equality of components (===).
   *
   * @param {Vector4} v
   * @returns {boolean}
   */
  equals(v) { return (v.x === this.x) && (v.y === this.y) && (v.z === this.z) && (v.w === this.w); }

  /**
   * Read components from an array.
   *
   * @param {ArrayLike<number>} array
   * @param {number} [offset=0]
   * @returns {Vector4} this
   */
  fromArray(array, offset = 0) {
    this.x = array[offset];
    this.y = array[offset + 1];
    this.z = array[offset + 2];
    this.w = array[offset + 3];
    return this;
  }

  /**
   * Write components to an array (creates if omitted).
   *
   * @param {Array<number>} [array=[]]
   * @param {number} [offset=0]
   * @returns {Array<number>}
   */
  toArray(array = [], offset = 0) {
    array[offset] = this.x;
    array[offset + 1] = this.y;
    array[offset + 2] = this.z;
    array[offset + 3] = this.w;
    return array;
  }

  /**
   * Read components from a BufferAttribute.
   *
   * @param {import('./BufferAttribute.js').BufferAttribute} attribute
   * @param {number} index
   * @returns {Vector4} this
   */
  fromBufferAttribute(attribute, index) {
    this.x = attribute.getX(index);
    this.y = attribute.getY(index);
    this.z = attribute.getZ(index);
    this.w = attribute.getW(index);
    return this;
  }

  // --------------------------------------------------------------------------
  // Randomization
  // --------------------------------------------------------------------------

  /**
   * Fill with random components in [0, 1).
   *
   * @returns {Vector4} this
   */
  random() {
    this.x = Math.random();
    this.y = Math.random();
    this.z = Math.random();
    this.w = Math.random();
    return this;
  }

  // --------------------------------------------------------------------------
  // Serialization & Iteration
  // --------------------------------------------------------------------------

  /**
   * Serialize to DSRT JSON schema.
   *
   * Schema:
   * {
   *   type: "DSRT.Vector4",
   *   x: number, y: number, z: number, w: number,
   *   devtools: "DSRT_DEVTOOLS"
   * }
   *
   * @returns {{type:string,x:number,y:number,z:number,w:number,devtools:string}}
   */
  toJSON() {
    return {
      type: 'DSRT.Vector4',
      x: this.x,
      y: this.y,
      z: this.z,
      w: this.w,
      devtools: 'DSRT_DEVTOOLS'
    };
  }

  /**
   * Iterator over components (x, y, z, w).
   */
  *[Symbol.iterator]() { yield this.x; yield this.y; yield this.z; yield this.w; }
}

export { Vector4 };
