// DSRT
import { clamp } from './MathUtils.js';
import { Quaternion } from './Quaternion.js';

/**
 * DSRT Vector3
 * ------------
 * Foundational 3D vector (x, y, z) for DSRT math, simulation, and rendering.
 *
 * Use cases:
 * - A point in 3D space
 * - A direction and magnitude (Euclidean length from (0,0,0) to (x,y,z))
 * - Any ordered triplet
 *
 * Iteration yields components in order (x, y, z).
 * Example:
 * const a = new DSRT.Vector3(0, 1, 0);
 * const b = new DSRT.Vector3(); // (0,0,0)
 * const d = a.distanceTo(b); // 1
 */
class Vector3 {
  /**
   * Construct a new DSRT.Vector3.
   * @param {number} [x=0]
   * @param {number} [y=0]
   * @param {number} [z=0]
   */
  constructor(x = 0, y = 0, z = 0) {
    /** Identity flag for DSRT type testing. */
    this.inVector3 = true;

    /** @type {number} */ this.x = x;
    /** @type {number} */ this.y = y;
    /** @type {number} */ this.z = z;
  }

  // ---------------------------------------
  // set/get components
  // ---------------------------------------

  /**
   * Set the vector components.
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {Vector3} this
   */
  set(x, y, z) {
    if (z === undefined) z = this.z; // compatibility with 2-arg scale.set(x,y)
    this.x = x; this.y = y; this.z = z;
    return this;
  }

  /**
   * Set all components to the same scalar.
   * @param {number} scalar
   * @returns {Vector3} this
   */
  setScalar(scalar) {
    this.x = scalar; this.y = scalar; this.z = scalar;
    return this;
  }

  /**
   * Set only X.
   * @param {number} x
   * @returns {Vector3} this
   */
  setX(x) { this.x = x; return this; }

  /**
   * Set only Y.
   * @param {number} y
   * @returns {Vector3} this
   */
  setY(y) { this.y = y; return this; }

  /**
   * Set only Z.
   * @param {number} z
   * @returns {Vector3} this
   */
  setZ(z) { this.z = z; return this; }

  /**
   * Set component by index (0→x, 1→y, 2→z).
   * @param {number} index
   * @param {number} value
   * @returns {Vector3} this
   */
  setComponent(index, value) {
    switch (index) {
      case 0: this.x = value; break;
      case 1: this.y = value; break;
      case 2: this.z = value; break;
      default: throw new Error('index is out of range: ' + index);
    }
    return this;
  }

  /**
   * Get component by index.
   * @param {number} index
   * @returns {number}
   */
  getComponent(index) {
    switch (index) {
      case 0: return this.x;
      case 1: return this.y;
      case 2: return this.z;
      default: throw new Error('index is out of range: ' + index);
    }
  }

  /**
   * Clone this vector.
   * @returns {Vector3}
   */
  clone() { return new this.constructor(this.x, this.y, this.z); }

  /**
   * Copy components from another vector.
   * @param {Vector3} v
   * @returns {Vector3} this
   */
  copy(v) { this.x = v.x; this.y = v.y; this.z = v.z; return this; }

  // ---------------------------------------
  // addition / subtraction
  // ---------------------------------------

  /**
   * Add vector v to this.
   * @param {Vector3} v
   * @returns {Vector3} this
   */
  add(v) { this.x += v.x; this.y += v.y; this.z += v.z; return this; }

  /**
   * Add scalar s to all components.
   * @param {number} s
   * @returns {Vector3} this
   */
  addScalar(s) { this.x += s; this.y += s; this.z += s; return this; }

  /**
   * this = a + b
   * @param {Vector3} a
   * @param {Vector3} b
   * @returns {Vector3} this
   */
  addVectors(a, b) { this.x = a.x + b.x; this.y = a.y + b.y; this.z = a.z + b.z; return this; }

  /**
   * this += v * s
   * @param {Vector3} v
   * @param {number} s
   * @returns {Vector3} this
   */
  addScaledVector(v, s) { this.x += v.x * s; this.y += v.y * s; this.z += v.z * s; return this; }

  /**
   * Subtract vector v from this.
   * @param {Vector3} v
   * @returns {Vector3} this
   */
  sub(v) { this.x -= v.x; this.y -= v.y; this.z -= v.z; return this; }

  /**
   * Subtract scalar from all components.
   * @param {number} s
   * @returns {Vector3} this
   */
  subScalar(s) { this.x -= s; this.y -= s; this.z -= s; return this; }

  /**
   * this = a - b
   * @param {Vector3} a
   * @param {Vector3} b
   * @returns {Vector3} this
   */
  subVectors(a, b) { this.x = a.x - b.x; this.y = a.y - b.y; this.z = a.z - b.z; return this; }

  // ---------------------------------------
  // multiplication / division
  // ---------------------------------------

  /**
   * Multiply component-wise by v.
   * @param {Vector3} v
   * @returns {Vector3} this
   */
  multiply(v) { this.x *= v.x; this.y *= v.y; this.z *= v.z; return this; }

  /**
   * Multiply all components by scalar.
   * @param {number} scalar
   * @returns {Vector3} this
   */
  multiplyScalar(scalar) { this.x *= scalar; this.y *= scalar; this.z *= scalar; return this; }

  /**
   * this = a * b (component-wise)
   * @param {Vector3} a
   * @param {Vector3} b
   * @returns {Vector3} this
   */
  multiplyVectors(a, b) { this.x = a.x * b.x; this.y = a.y * b.y; this.z = a.z * b.z; return this; }

  /**
   * Divide component-wise by v.
   * @param {Vector3} v
   * @returns {Vector3} this
   */
  divide(v) { this.x /= v.x; this.y /= v.y; this.z /= v.z; return this; }

  /**
   * Divide all components by scalar.
   * @param {number} scalar
   * @returns {Vector3} this
   */
  divideScalar(scalar) { return this.multiplyScalar(1 / scalar); }

  // ---------------------------------------
  // clamp / rounding
  // ---------------------------------------

  /**
   * Component-wise min with v.
   * @param {Vector3} v
   * @returns {Vector3} this
   */
  min(v) { this.x = Math.min(this.x, v.x); this.y = Math.min(this.y, v.y); this.z = Math.min(this.z, v.z); return this; }

  /**
   * Component-wise max with v.
   * @param {Vector3} v
   * @returns {Vector3} this
   */
  max(v) { this.x = Math.max(this.x, v.x); this.y = Math.max(this.y, v.y); this.z = Math.max(this.z, v.z); return this; }

  /**
   * Clamp each component between min and max vectors.
   * @param {Vector3} min
   * @param {Vector3} max
   * @returns {Vector3} this
   */
  clamp(min, max) {
    this.x = clamp(this.x, min.x, max.x);
    this.y = clamp(this.y, min.y, max.y);
    this.z = clamp(this.z, min.z, max.z);
    return this;
  }

  /**
   * Clamp components between scalar min/max.
   * @param {number} minVal
   * @param {number} maxVal
   * @returns {Vector3} this
   */
  clampScalar(minVal, maxVal) {
    this.x = clamp(this.x, minVal, maxVal);
    this.y = clamp(this.y, minVal, maxVal);
    this.z = clamp(this.z, minVal, maxVal);
    return this;
  }

  /**
   * Clamp length between min and max.
   * Normalizes then scales to clamped length.
   * @param {number} min
   * @param {number} max
   * @returns {Vector3} this
   */
  clampLength(min, max) {
    const length = this.length();
    return this.divideScalar(length || 1).multiplyScalar(clamp(length, min, max));
  }

  /**
   * Floor components.
   * @returns {Vector3} this
   */
  floor() { this.x = Math.floor(this.x); this.y = Math.floor(this.y); this.z = Math.floor(this.z); return this; }

  /**
   * Ceil components.
   * @returns {Vector3} this
   */
  ceil() { this.x = Math.ceil(this.x); this.y = Math.ceil(this.y); this.z = Math.ceil(this.z); return this; }

  /**
   * Round components.
   * @returns {Vector3} this
   */
  round() { this.x = Math.round(this.x); this.y = Math.round(this.y); this.z = Math.round(this.z); return this; }

  /**
   * Round toward zero (trunc).
   * @returns {Vector3} this
   */
  roundToZero() { this.x = Math.trunc(this.x); this.y = Math.trunc(this.y); this.z = Math.trunc(this.z); return this; }

  // ---------------------------------------
  // algebra & metrics
  // ---------------------------------------

  /**
   * Negate all components.
   * @returns {Vector3} this
   */
  negate() { this.x = -this.x; this.y = -this.y; this.z = -this.z; return this; }

  /**
   * Dot product with v.
   * @param {Vector3} v
   * @returns {number}
   */
  dot(v) { return this.x * v.x + this.y * v.y + this.z * v.z; }

  /**
   * Squared length (avoids sqrt).
   * @returns {number}
   */
  lengthSq() { return this.x * this.x + this.y * this.y + this.z * this.z; }

  /**
   * Euclidean length.
   * @returns {number}
   */
  length() { return Math.sqrt(this.lengthSq()); }

  /**
   * Manhattan length (L1 norm).
   * @returns {number}
   */
  manhattanLength() { return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z); }

  /**
   * Normalize to unit length. If length=0, no change.
   * @returns {Vector3} this
   */
  normalize() { return this.divideScalar(this.length() || 1); }

  /**
   * Set magnitude to given length.
   * @param {number} length
   * @returns {Vector3} this
   */
  setLength(length) { return this.normalize().multiplyScalar(length); }

  /**
   * Lerp toward v.
   * @param {Vector3} v
   * @param {number} alpha
   * @returns {Vector3} this
   */
  lerp(v, alpha) {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;
    this.z += (v.z - this.z) * alpha;
    return this;
  }

  /**
   * Lerp between v1 and v2.
   * @param {Vector3} v1
   * @param {Vector3} v2
   * @param {number} alpha
   * @returns {Vector3} this
   */
  lerpVectors(v1, v2, alpha) {
    this.x = v1.x + (v2.x - v1.x) * alpha;
    this.y = v1.y + (v2.y - v1.y) * alpha;
    this.z = v1.z + (v2.z - v1.z) * alpha;
    return this;
  }

  /**
   * Cross product this × v.
   * @param {Vector3} v
   * @returns {Vector3} this
   */
  cross(v) { return this.crossVectors(this, v); }

  /**
   * Cross product a × b.
   * @param {Vector3} a
   * @param {Vector3} b
   * @returns {Vector3} this
   */
  crossVectors(a, b) {
    const ax = a.x, ay = a.y, az = a.z;
    const bx = b.x, by = b.y, bz = b.z;
    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;
    return this;
  }

  /**
   * Angle to v in radians. Returns [0, π]. If either is zero, returns π/2.
   * @param {Vector3} v
   * @returns {number}
   */
  angleTo(v) {
    const denominator = Math.sqrt(this.lengthSq() * v.lengthSq());
    if (denominator === 0) return Math.PI / 2;
    const theta = this.dot(v) / denominator;
    return Math.acos(clamp(theta, -1, 1));
    }

  /**
   * Euclidean distance to v.
   * @param {Vector3} v
   * @returns {number}
   */
  distanceTo(v) { return Math.sqrt(this.distanceToSquared(v)); }

  /**
   * Squared Euclidean distance to v.
   * @param {Vector3} v
   * @returns {number}
   */
  distanceToSquared(v) {
    const dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;
    return dx * dx + dy * dy + dz * dz;
  }

  /**
   * Manhattan distance to v.
   * @param {Vector3} v
   * @returns {number}
   */
  manhattanDistanceTo(v) {
    return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z);
  }

  // ---------------------------------------
  // projections / reflection
  // ---------------------------------------

  /**
   * Project this onto v: proj_v(this) = (this·v / |v|²) v
   * @param {Vector3} v
   * @returns {Vector3} this
   */
  projectOnVector(v) {
    const denominator = v.lengthSq();
    if (denominator === 0) return this.set(0, 0, 0);
    const scalar = this.dot(v) / denominator;
    return this.copy(v).multiplyScalar(scalar);
  }

  /**
   * Project this onto a plane defined by its normal.
   * @param {Vector3} planeNormal
   * @returns {Vector3} this
   */
  projectOnPlane(planeNormal) {
    vectorHelper.copy(this).projectOnVector(planeNormal);
    return this.sub(vectorHelper);
  }

  /**
   * Reflect this vector across a plane orthogonal to normal.
   * @param {Vector3} normal
   * @returns {Vector3} this
   */
  reflect(normal) {
    return this.sub(vectorHelper.copy(normal).multiplyScalar(2 * this.dot(normal)));
  }

  // ---------------------------------------
  // transforms: matrices & quaternions
  // ---------------------------------------

  /**
   * Apply 3x3 matrix m to this.
   * @param {import('./Matrix3.js').Matrix3} m
   * @returns {Vector3} this
   */
  applyMatrix3(m) {
    const x = this.x, y = this.y, z = this.z;
    const e = m.elements;
    this.x = e[0] * x + e[3] * y + e[6] * z;
    this.y = e[1] * x + e[4] * y + e[7] * z;
    this.z = e[2] * x + e[5] * y + e[8] * z;
    return this;
  }

  /**
   * Apply normal matrix and normalize.
   * @param {import('./Matrix3.js').Matrix3} m
   * @returns {Vector3} this
   */
  applyNormalMatrix(m) { return this.applyMatrix3(m).normalize(); }

  /**
   * Apply 4x4 matrix m with perspective divide.
   * @param {import('./Matrix4.js').Matrix4} m
   * @returns {Vector3} this
   */
  applyMatrix4(m) {
    const x = this.x, y = this.y, z = this.z;
    const e = m.elements;
    const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
    this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
    this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
    this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;
    return this;
  }

  /**
   * Apply quaternion q to this (unit assumed).
   * @param {Quaternion} q
   * @returns {Vector3} this
   */
  applyQuaternion(q) {
    const vx = this.x, vy = this.y, vz = this.z;
    const qx = q.x, qy = q.y, qz = q.z, qw = q.w;

    // t = 2 * cross(q.xyz, v)
    const tx = 2 * (qy * vz - qz * vy);
    const ty = 2 * (qz * vx - qx * vz);
    const tz = 2 * (qx * vy - qy * vx);

    // v' = v + q.w*t + cross(q.xyz, t)
    this.x = vx + qw * tx + qy * tz - qz * ty;
    this.y = vy + qw * ty + qz * tx - qx * tz;
    this.z = vz + qw * tz + qx * ty - qy * tx;

    return this;
  }

  /**
   * Apply Euler rotation via helper quaternion.
   * @param {import('./Euler.js').Euler} euler
   * @returns {Vector3} this
   */
  applyEuler(euler) { return this.applyQuaternion(quaternionHelper.setFromEuler(euler)); }

  /**
   * Apply axis-angle via helper quaternion.
   * @param {Vector3} axis
   * @param {number} angle
   * @returns {Vector3} this
   */
  applyAxisAngle(axis, angle) { return this.applyQuaternion(quaternionHelper.setFromAxisAngle(axis, angle)); }

  /**
   * Transform direction by upper-left 3x3 of Matrix4 and normalize.
   * @param {import('./Matrix4.js').Matrix4} m
   * @returns {Vector3} this
   */
  transformDirection(m) {
    const x = this.x, y = this.y, z = this.z;
    const e = m.elements;
    this.x = e[0] * x + e[4] * y + e[8] * z;
    this.y = e[1] * x + e[5] * y + e[9] * z;
    this.z = e[2] * x + e[6] * y + e[10] * z;
    return this.normalize();
  }

  /**
   * Project this world-space vector into camera NDC.
   * @param {import('./Camera.js').Camera} camera
   * @returns {Vector3} this
   */
  project(camera) {
    return this.applyMatrix4(camera.matrixWorldInverse).applyMatrix4(camera.projectionMatrix);
  }

  /**
   * Unproject from camera NDC into world space.
   * @param {import('./Camera.js').Camera} camera
   * @returns {Vector3} this
   */
  unproject(camera) {
    return this.applyMatrix4(camera.projectionMatrixInverse).applyMatrix4(camera.matrixWorld);
  }

  // ---------------------------------------
  // conversions from other structures
  // ---------------------------------------

  /**
   * Set from DSRT.Spherical.
   * @param {import('./Spherical.js').Spherical} s
   * @returns {Vector3} this
   */
  setFromSpherical(s) { return this.setFromSphericalCoords(s.radius, s.phi, s.theta); }

  /**
   * Set from spherical coordinates (radius, phi, theta).
   * phi: polar from +Y; theta: azimuth around Y.
   * @param {number} radius
   * @param {number} phi
   * @param {number} theta
   * @returns {Vector3} this
   */
  setFromSphericalCoords(radius, phi, theta) {
    const sinPhiRadius = Math.sin(phi) * radius;
    this.x = sinPhiRadius * Math.sin(theta);
    this.y = Math.cos(phi) * radius;
    this.z = sinPhiRadius * Math.cos(theta);
    return this;
  }

  /**
   * Set from DSRT.Cylindrical.
   * @param {import('./Cylindrical.js').Cylindrical} c
   * @returns {Vector3} this
   */
  setFromCylindrical(c) { return this.setFromCylindricalCoords(c.radius, c.theta, c.y); }

  /**
   * Set from cylindrical coordinates (radius, theta, y).
   * @param {number} radius
   * @param {number} theta
   * @param {number} y
   * @returns {Vector3} this
   */
  setFromCylindricalCoords(radius, theta, y) {
    this.x = radius * Math.sin(theta);
    this.y = y;
    this.z = radius * Math.cos(theta);
    return this;
  }

  /**
   * Set from Matrix4 position (translation).
   * @param {import('./Matrix4.js').Matrix4} m
   * @returns {Vector3} this
   */
  setFromMatrixPosition(m) {
    const e = m.elements;
    this.x = e[12]; this.y = e[13]; this.z = e[14];
    return this;
  }

  /**
   * Set from Matrix4 scale (column lengths).
   * @param {import('./Matrix4.js').Matrix4} m
   * @returns {Vector3} this
   */
  setFromMatrixScale(m) {
    const sx = this.setFromMatrixColumn(m, 0).length();
    const sy = this.setFromMatrixColumn(m, 1).length();
    const sz = this.setFromMatrixColumn(m, 2).length();
    this.x = sx; this.y = sy; this.z = sz;
    return this;
  }

  /**
   * Set from Matrix4 column at index.
   * @param {import('./Matrix4.js').Matrix4} m
   * @param {number} index
   * @returns {Vector3} this
   */
  setFromMatrixColumn(m, index) { return this.fromArray(m.elements, index * 4); }

  /**
   * Set from Matrix3 column at index.
   * @param {import('./Matrix3.js').Matrix3} m
   * @param {number} index
   * @returns {Vector3} this
   */
  setFromMatrix3Column(m, index) { return this.fromArray(m.elements, index * 3); }

  /**
   * Set from DSRT.Euler components (assignment, not rotation).
   * @param {import('./Euler.js').Euler} e
   * @returns {Vector3} this
   */
  setFromEuler(e) { this.x = e._x; this.y = e._y; this.z = e._z; return this; }

  /**
   * Set from DSRT.Color (r,g,b → x,y,z).
   * @param {import('./Color.js').Color} c
   * @returns {Vector3} this
   */
  setFromColor(c) { this.x = c.r; this.y = c.g; this.z = c.b; return this; }

  // ---------------------------------------
  // equality & array IO
  // ---------------------------------------

  /**
   * Strict equality (===) of components.
   * @param {Vector3} v
   * @returns {boolean}
   */
  equals(v) { return (v.x === this.x) && (v.y === this.y) && (v.z === this.z); }

  /**
   * Read components from array.
   * @param {ArrayLike<number>} array
   * @param {number} [offset=0]
   * @returns {Vector3} this
   */
  fromArray(array, offset = 0) {
    this.x = array[offset];
    this.y = array[offset + 1];
    this.z = array[offset + 2];
    return this;
  }

  /**
   * Write components to array (creates if omitted).
   * @param {Array<number>} [array=[]]
   * @param {number} [offset=0]
   * @returns {Array<number>}
   */
  toArray(array = [], offset = 0) {
    array[offset] = this.x;
    array[offset + 1] = this.y;
    array[offset + 2] = this.z;
    return array;
  }

  /**
   * Read components from buffer attribute.
   * @param {import('./BufferAttribute.js').BufferAttribute} attribute
   * @param {number} index
   * @returns {Vector3} this
   */
  fromBufferAttribute(attribute, index) {
    this.x = attribute.getX(index);
    this.y = attribute.getY(index);
    this.z = attribute.getZ(index);
    return this;
  }

  // ---------------------------------------
  // randomization
  // ---------------------------------------

  /**
   * Random components in [0,1).
   * @returns {Vector3} this
   */
  random() {
    this.x = Math.random();
    this.y = Math.random();
    this.z = Math.random();
    return this;
  }

  /**
   * Uniform random direction on unit sphere.
   * @returns {Vector3} this
   */
  randomDirection() {
    const theta = Math.random() * Math.PI * 2;
    const u = Math.random() * 2 - 1;
    const c = Math.sqrt(1 - u * u);
    this.x = c * Math.cos(theta);
    this.y = u;
    this.z = c * Math.sin(theta);
    return this;
  }

  // ---------------------------------------
  // serialization & iteration
  // ---------------------------------------

  /**
   * Serialize to DSRT JSON schema.
   * @returns {{type:string,x:number,y:number,z:number,devtools:string}}
   */
  toJSON() {
    return {
      type: 'DSRT.Vector3',
      x: this.x,
      y: this.y,
      z: this.z,
      devtools: 'DSRT_DEVTOOLS'
    };
  }

  /**
   * Iterator over components (x,y,z).
   */
  *[Symbol.iterator]() { yield this.x; yield this.y; yield this.z; }
}

// Internal DSRT helpers (no underscores, no /*@__PURE__*/ markers)
const vectorHelper = new Vector3();
const quaternionHelper = new Quaternion();

export { Vector3 };
