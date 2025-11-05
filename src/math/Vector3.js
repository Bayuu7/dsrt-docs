// DSRT Math Utilities
import { clamp } from './MathUtils.js';
import { Quaternion } from './Quaternion.js';

/**
 * DSRT Vector3
 * ------------
 * Foundational 3D vector for DSRT (x, y, z).
 * Complete API: construction, mutation, algebra, transforms, projections,
 * distances, randomization, serialization, and iteration.
 */
class Vector3 {
  /**
   * Create a new DSRT Vector3.
   * @param {number} [x=0]
   * @param {number} [y=0]
   * @param {number} [z=0]
   */
  constructor(x = 0, y = 0, z = 0) {
    /** DSRT identity flag for type testing. */
    this.inVector3 = true;

    /** @type {number} */ this.x = x;
    /** @type {number} */ this.y = y;
    /** @type {number} */ this.z = z;
  }

  // --- setters/getters ---

  set(x, y, z) { this.x = x; this.y = y; this.z = z; return this; }
  setScalar(s) { this.x = s; this.y = s; this.z = s; return this; }
  setX(x) { this.x = x; return this; }
  setY(y) { this.y = y; return this; }
  setZ(z) { this.z = z; return this; }

  setComponent(index, value) {
    switch (index) {
      case 0: this.x = value; break;
      case 1: this.y = value; break;
      case 2: this.z = value; break;
      default: throw new Error('index is out of range: ' + index);
    }
    return this;
  }

  getComponent(index) {
    switch (index) {
      case 0: return this.x;
      case 1: return this.y;
      case 2: return this.z;
      default: throw new Error('index is out of range: ' + index);
    }
  }

  clone() { return new this.constructor(this.x, this.y, this.z); }
  copy(v) { this.x = v.x; this.y = v.y; this.z = v.z; return this; }

  // --- addition/subtraction ---

  add(v) { this.x += v.x; this.y += v.y; this.z += v.z; return this; }
  addScalar(s) { this.x += s; this.y += s; this.z += s; return this; }
  addVectors(a, b) { this.x = a.x + b.x; this.y = a.y + b.y; this.z = a.z + b.z; return this; }
  addScaledVector(v, s) { this.x += v.x * s; this.y += v.y * s; this.z += v.z * s; return this; }

  sub(v) { this.x -= v.x; this.y -= v.y; this.z -= v.z; return this; }
  subScalar(s) { this.x -= s; this.y -= s; this.z -= s; return this; }
  subVectors(a, b) { this.x = a.x - b.x; this.y = a.y - b.y; this.z = a.z - b.z; return this; }

  // --- multiplication/division ---

  multiply(v) { this.x *= v.x; this.y *= v.y; this.z *= v.z; return this; }
  multiplyScalar(s) { this.x *= s; this.y *= s; this.z *= s; return this; }
  multiplyVectors(a, b) { this.x = a.x * b.x; this.y = a.y * b.y; this.z = a.z * b.z; return this; }

  divide(v) { this.x /= v.x; this.y /= v.y; this.z /= v.z; return this; }
  divideScalar(s) { return this.multiplyScalar(1 / s); }

  // --- min/max/clamp/rounding ---

  min(v) { this.x = Math.min(this.x, v.x); this.y = Math.min(this.y, v.y); this.z = Math.min(this.z, v.z); return this; }
  max(v) { this.x = Math.max(this.x, v.x); this.y = Math.max(this.y, v.y); this.z = Math.max(this.z, v.z); return this; }

  clamp(min, max) {
    this.x = clamp(this.x, min.x, max.x);
    this.y = clamp(this.y, min.y, max.y);
    this.z = clamp(this.z, min.z, max.z);
    return this;
  }

  clampScalar(minVal, maxVal) {
    this.x = clamp(this.x, minVal, maxVal);
    this.y = clamp(this.y, minVal, maxVal);
    this.z = clamp(this.z, minVal, maxVal);
    return this;
  }

  clampLength(min, max) {
    const len = this.length();
    return this.divideScalar(len || 1).multiplyScalar(clamp(len, min, max));
  }

  floor() { this.x = Math.floor(this.x); this.y = Math.floor(this.y); this.z = Math.floor(this.z); return this; }
  ceil() { this.x = Math.ceil(this.x); this.y = Math.ceil(this.y); this.z = Math.ceil(this.z); return this; }
  round() { this.x = Math.round(this.x); this.y = Math.round(this.y); this.z = Math.round(this.z); return this; }
  roundToZero() { this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x); this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y); this.z = this.z < 0 ? Math.ceil(this.z) : Math.floor(this.z); return this; }

  // --- algebra & metrics ---

  negate() { this.x = -this.x; this.y = -this.y; this.z = -this.z; return this; }

  dot(v) { return this.x * v.x + this.y * v.y + this.z * v.z; }
  lengthSq() { return this.x * this.x + this.y * this.y + this.z * this.z; }
  length() { return Math.sqrt(this.lengthSq()); }
  manhattanLength() { return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z); }

  normalize() { return this.divideScalar(this.length() || 1); }
  setLength(l) { return this.normalize().multiplyScalar(l); }

  lerp(v, alpha) { this.x += (v.x - this.x) * alpha; this.y += (v.y - this.y) * alpha; this.z += (v.z - this.z) * alpha; return this; }
  lerpVectors(v1, v2, alpha) { this.x = v1.x + (v2.x - v1.x) * alpha; this.y = v1.y + (v2.y - v1.y) * alpha; this.z = v1.z + (v2.z - v1.z) * alpha; return this; }

  cross(v) { return this.crossVectors(this, v); }
  crossVectors(a, b) {
    const ax = a.x, ay = a.y, az = a.z;
    const bx = b.x, by = b.y, bz = b.z;
    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;
    return this;
  }

  angleTo(v) {
    const denom = Math.sqrt(this.lengthSq() * v.lengthSq());
    if (denom === 0) return Math.PI / 2;
    const theta = clamp(this.dot(v) / denom, -1, 1);
    return Math.acos(theta);
  }

  distanceTo(v) { return Math.sqrt(this.distanceToSquared(v)); }
  distanceToSquared(v) { const dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z; return dx * dx + dy * dy + dz * dz; }
  manhattanDistanceTo(v) { return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z); }

  // --- projections & reflection ---

  projectOnVector(v) {
    const denom = v.lengthSq();
    if (denom === 0) return this.set(0, 0, 0);
    const s = this.dot(v) / denom;
    return this.copy(v).multiplyScalar(s);
  }

  projectOnPlane(planeNormal) {
    vectorHelper.copy(this).projectOnVector(planeNormal);
    return this.sub(vectorHelper);
  }

  reflect(normal) {
    return this.sub(vectorHelper.copy(normal).multiplyScalar(2 * this.dot(normal)));
  }

  // --- transforms: matrices & quaternions ---

  applyMatrix3(m) {
    const x = this.x, y = this.y, z = this.z;
    const e = m.elements;
    this.x = e[0] * x + e[3] * y + e[6] * z;
    this.y = e[1] * x + e[4] * y + e[7] * z;
    this.z = e[2] * x + e[5] * y + e[8] * z;
    return this;
  }

  applyNormalMatrix(m) { return this.applyMatrix3(m).normalize(); }

  applyMatrix4(m) {
    const x = this.x, y = this.y, z = this.z;
    const e = m.elements;
    const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
    this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
    this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
    this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;
    return this;
  }

  applyQuaternion(q) {
    // v' = q * v * q^-1, optimized
    const vx = this.x, vy = this.y, vz = this.z;
    const qx = q.x, qy = q.y, qz = q.z, qw = q.w;

    const ix = qw * vx + qy * vz - qz * vy;
    const iy = qw * vy + qz * vx - qx * vz;
    const iz = qw * vz + qx * vy - qy * vx;
    const iw = -qx * vx - qy * vy - qz * vz;

    this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

    return this;
  }

  applyEuler(euler) {
    return this.applyQuaternion(quaternionHelper.setFromEuler(euler));
  }

  applyAxisAngle(axis, angle) {
    return this.applyQuaternion(quaternionHelper.setFromAxisAngle(axis, angle));
  }

  transformDirection(m) {
    const x = this.x, y = this.y, z = this.z;
    const e = m.elements;
    this.x = e[0] * x + e[4] * y + e[8] * z;
    this.y = e[1] * x + e[5] * y + e[9] * z;
    this.z = e[2] * x + e[6] * y + e[10] * z;
    return this.normalize();
  }

  project(camera) {
    return this.applyMatrix4(camera.matrixWorldInverse).applyMatrix4(camera.projectionMatrix);
  }

  unproject(camera) {
    return this.applyMatrix4(camera.projectionMatrixInverse).applyMatrix4(camera.matrixWorld);
  }

  // --- conversions from other structures ---

  setFromSpherical(s) {
    return this.setFromSphericalCoords(s.radius, s.phi, s.theta);
  }

  setFromSphericalCoords(radius, phi, theta) {
    const sinPhiRadius = Math.sin(phi) * radius;
    this.x = sinPhiRadius * Math.sin(theta);
    this.y = Math.cos(phi) * radius;
    this.z = sinPhiRadius * Math.cos(theta);
    return this;
  }

  setFromCylindrical(c) {
    return this.setFromCylindricalCoords(c.radius, c.theta, c.y);
  }

  setFromCylindricalCoords(radius, theta, y) {
    this.x = radius * Math.sin(theta);
    this.y = y;
    this.z = radius * Math.cos(theta);
    return this;
  }

  setFromMatrixPosition(m) {
    const e = m.elements;
    this.x = e[12]; this.y = e[13]; this.z = e[14];
    return this;
  }

  setFromMatrixScale(m) {
    const sx = this.setFromMatrixColumn(m, 0).length();
    const sy = this.setFromMatrixColumn(m, 1).length();
    const sz = this.setFromMatrixColumn(m, 2).length();
    this.x = sx; this.y = sy; this.z = sz;
    return this;
  }

  setFromMatrixColumn(m, index) {
    return this.fromArray(m.elements, index * 4);
  }

  setFromMatrix3Column(m, index) {
    return this.fromArray(m.elements, index * 3);
  }

  setFromEuler(e) { this.x = e._x; this.y = e._y; this.z = e._z; return this; }
  setFromColor(c) { this.x = c.r; this.y = c.g; this.z = c.b; return this; }

  // --- equality & array i/o ---

  equals(v) { return v.x === this.x && v.y === this.y && v.z === this.z; }

  fromArray(array, offset = 0) {
    this.x = array[offset];
    this.y = array[offset + 1];
    this.z = array[offset + 2];
    return this;
  }

  toArray(array = [], offset = 0) {
    array[offset] = this.x;
    array[offset + 1] = this.y;
    array[offset + 2] = this.z;
    return array;
  }

  fromBufferAttribute(attribute, index) {
    this.x = attribute.getX(index);
    this.y = attribute.getY(index);
    this.z = attribute.getZ(index);
    return this;
  }

  // --- randomization ---

  random() {
    this.x = Math.random();
    this.y = Math.random();
    this.z = Math.random();
    return this;
  }

  /**
   * Uniform random direction on unit sphere using DSRT formulation.
   * u ~ U[-1,1], theta ~ U[0,2π], map to (x,y,z).
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

  // --- serialization & iteration ---

  toJSON() {
    return {
      type: 'DSRT.Vector3',
      x: this.x,
      y: this.y,
      z: this.z,
      devtools: 'DSRT_DEVTOOLS'
    };
  }

  *[Symbol.iterator]() { yield this.x; yield this.y; yield this.z; }
}

// DSRT internal helpers (no underscores, no pure annotations)
const vectorHelper = new Vector3();
const quaternionHelper = new Quaternion();
/**
 * DSRT Vector3
 * ------------
 * A foundational 3D vector (x, y, z) for DSRT math, simulation, and rendering pipelines.
 * Provides complete component operations, matrix/quaternion transforms, distances,
 * projections, serialization, and developer-friendly iteration.
 */
class Vector3 {
  /**
   * Construct a new DSRT.Vector3.
   *
   * DSRT Notes:
   * - Default components are (0,0,0).
   * - This class is mutable: operations modify the instance.
   * - For immutability, clone() before applying operations.
   *
   * @param {number} [x=0] - Initial X component.
   * @param {number} [y=0] - Initial Y component.
   * @param {number} [z=0] - Initial Z component.
   *
   * @example
   * const v = new DSRT.Vector3(); // (0,0,0)
   * const u = new DSRT.Vector3(1,2,3); // (1,2,3)
   */
  constructor(x = 0, y = 0, z = 0) {
    /** DSRT identity flag for type testing. */
    this.inVector3 = true;

    /** X component. @type {number} */
    this.x = x;
    /** Y component. @type {number} */
    this.y = y;
    /** Z component. @type {number} */
    this.z = z;
  }

  /**
   * Set all components at once.
   *
   * DSRT Notes:
   * - Overwrites x,y,z with provided values.
   * - Returns this for chaining.
   *
   * @param {number} x - New X value.
   * @param {number} y - New Y value.
   * @param {number} z - New Z value.
   * @returns {Vector3} this
   *
   * @example
   * v.set(5,6,7); // v = (5,6,7)
   */
  set(x, y, z) { this.x = x; this.y = y; this.z = z; return this; }

  /**
   * Set all components to the same scalar.
   *
   * DSRT Notes:
   * - Useful for initializing or resetting.
   *
   * @param {number} s - Scalar value.
   * @returns {Vector3} this
   *
   * @example
   * v.setScalar(1); // v = (1,1,1)
   */
  setScalar(s) { this.x = s; this.y = s; this.z = s; return this; }

  /**
   * Set only the X component.
   * @param {number} x
   * @returns {Vector3} this
   *
   * @example
   * v.setX(10); // v.x = 10
   */
  setX(x) { this.x = x; return this; }

  /**
   * Set only the Y component.
   * @param {number} y
   * @returns {Vector3} this
   *
   * @example
   * v.setY(20); // v.y = 20
   */
  setY(y) { this.y = y; return this; }

  /**
   * Set only the Z component.
   * @param {number} z
   * @returns {Vector3} this
   *
   * @example
   * v.setZ(30); // v.z = 30
   */
  setZ(z) { this.z = z; return this; }
}
  /**
   * Set a single component by index.
   *
   * DSRT Notes:
   * - Index mapping: 0 → x, 1 → y, 2 → z.
   * - Throws error if index is out of range.
   * - Useful for generic loops over components.
   *
   * @param {number} index - Component index (0,1,2).
   * @param {number} value - Value to assign.
   * @returns {Vector3} this
   *
   * @example
   * v.setComponent(0, 42); // v.x = 42
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
   * Get a single component by index.
   *
   * DSRT Notes:
   * - Index mapping: 0 → x, 1 → y, 2 → z.
   * - Throws error if index is invalid.
   *
   * @param {number} index - Component index (0,1,2).
   * @returns {number} Component value.
   *
   * @example
   * const y = v.getComponent(1); // returns v.y
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
   * Clone this vector into a new instance.
   *
   * DSRT Notes:
   * - Returns a new Vector3 with identical components.
   * - Safe for immutability patterns.
   *
   * @returns {Vector3} New vector with same x,y,z.
   *
   * @example
   * const a = new DSRT.Vector3(1,2,3);
   * const b = a.clone(); // b is (1,2,3), independent copy
   */
  clone() { return new this.constructor(this.x, this.y, this.z); }

  /**
   * Copy components from another vector.
   *
   * DSRT Notes:
   * - Overwrites this.x,y,z with v.x,y,z.
   * - Returns this for chaining.
   *
   * @param {Vector3} v - Source vector.
   * @returns {Vector3} this
   *
   * @example
   * const a = new DSRT.Vector3(1,2,3);
   * const b = new DSRT.Vector3();
   * b.copy(a); // b = (1,2,3)
   */
  copy(v) { this.x = v.x; this.y = v.y; this.z = v.z; return this; }

  /**
   * Add another vector component-wise.
   *
   * DSRT Notes:
   * - (x,y,z) += (vx,vy,vz).
   * - Mutates this vector.
   *
   * @param {Vector3} v - Vector to add.
   * @returns {Vector3} this
   *
   * @example
   * const a = new DSRT.Vector3(1,2,3);
   * const b = new DSRT.Vector3(4,5,6);
   * a.add(b); // a = (5,7,9)
   */
  add(v) { this.x += v.x; this.y += v.y; this.z += v.z; return this; }

  /**
   * Add scalar to all components.
   *
   * DSRT Notes:
   * - (x,y,z) += s.
   *
   * @param {number} s - Scalar to add.
   * @returns {Vector3} this
   *
   * @example
   * const v = new DSRT.Vector3(1,2,3);
   * v.addScalar(10); // v = (11,12,13)
   */
  addScalar(s) { this.x += s; this.y += s; this.z += s; return this; }

  /**
   * Add two vectors and store result in this.
   *
   * DSRT Notes:
   * - this = a + b.
   * - Overwrites current values.
   *
   * @param {Vector3} a
   * @param {Vector3} b
   * @returns {Vector3} this
   *
   * @example
   * const a = new DSRT.Vector3(1,2,3);
   * const b = new DSRT.Vector3(4,5,6);
   * const c = new DSRT.Vector3();
   * c.addVectors(a,b); // c = (5,7,9)
   */
  addVectors(a, b) { this.x = a.x + b.x; this.y = a.y + b.y; this.z = a.z + b.z; return this; }

  /**
   * Add scaled vector: this += v * s.
   *
   * DSRT Notes:
   * - Equivalent to: this.x += v.x*s, etc.
   * - Useful for weighted sums.
   *
   * @param {Vector3} v - Vector to scale and add.
   * @param {number} s - Scalar multiplier.
   * @returns {Vector3} this
   *
   * @example
   * const a = new DSRT.Vector3(1,1,1);
   * const b = new DSRT.Vector3(2,0,0);
   * a.addScaledVector(b, 3); // a = (7,1,1)
   */
  addScaledVector(v, s) { this.x += v.x * s; this.y += v.y * s; this.z += v.z * s; return this; }
  /**
   * Subtract another vector component-wise.
   *
   * DSRT Notes:
   * - (x,y,z) -= (vx,vy,vz).
   * - Mutates this vector.
   *
   * @param {Vector3} v - Vector to subtract.
   * @returns {Vector3} this
   *
   * @example
   * const a = new DSRT.Vector3(5,7,9);
   * const b = new DSRT.Vector3(1,2,3);
   * a.sub(b); // a = (4,5,6)
   */
  sub(v) { this.x -= v.x; this.y -= v.y; this.z -= v.z; return this; }

  /**
   * Subtract scalar from all components.
   *
   * DSRT Notes:
   * - (x,y,z) -= s.
   *
   * @param {number} s - Scalar to subtract.
   * @returns {Vector3} this
   *
   * @example
   * const v = new DSRT.Vector3(10,10,10);
   * v.subScalar(3); // v = (7,7,7)
   */
  subScalar(s) { this.x -= s; this.y -= s; this.z -= s; return this; }

  /**
   * Subtract two vectors and store result in this.
   *
   * DSRT Notes:
   * - this = a - b.
   * - Overwrites current values.
   *
   * @param {Vector3} a
   * @param {Vector3} b
   * @returns {Vector3} this
   *
   * @example
   * const a = new DSRT.Vector3(5,5,5);
   * const b = new DSRT.Vector3(2,3,4);
   * const c = new DSRT.Vector3();
   * c.subVectors(a,b); // c = (3,2,1)
   */
  subVectors(a, b) { this.x = a.x - b.x; this.y = a.y - b.y; this.z = a.z - b.z; return this; }

  /**
   * Multiply component-wise by another vector.
   *
   * DSRT Notes:
   * - (x,y,z) *= (vx,vy,vz).
   *
   * @param {Vector3} v - Vector to multiply.
   * @returns {Vector3} this
   *
   * @example
   * const a = new DSRT.Vector3(2,3,4);
   * const b = new DSRT.Vector3(5,6,7);
   * a.multiply(b); // a = (10,18,28)
   */
  multiply(v) { this.x *= v.x; this.y *= v.y; this.z *= v.z; return this; }

  /**
   * Multiply all components by scalar.
   *
   * @param {number} s - Scalar multiplier.
   * @returns {Vector3} this
   *
   * @example
   * const v = new DSRT.Vector3(1,2,3);
   * v.multiplyScalar(10); // v = (10,20,30)
   */
  multiplyScalar(s) { this.x *= s; this.y *= s; this.z *= s; return this; }

  /**
   * Multiply two vectors component-wise and store result.
   *
   * @param {Vector3} a
   * @param {Vector3} b
   * @returns {Vector3} this
   *
   * @example
   * const a = new DSRT.Vector3(1,2,3);
   * const b = new DSRT.Vector3(4,5,6);
   * const c = new DSRT.Vector3();
   * c.multiplyVectors(a,b); // c = (4,10,18)
   */
  multiplyVectors(a, b) { this.x = a.x * b.x; this.y = a.y * b.y; this.z = a.z * b.z; return this; }

  /**
   * Divide component-wise by another vector.
   *
   * @param {Vector3} v
   * @returns {Vector3} this
   *
   * @example
   * const a = new DSRT.Vector3(10,20,30);
   * const b = new DSRT.Vector3(2,5,3);
   * a.divide(b); // a = (5,4,10)
   */
  divide(v) { this.x /= v.x; this.y /= v.y; this.z /= v.z; return this; }

  /**
   * Divide all components by scalar.
   *
   * DSRT Notes:
   * - Equivalent to multiplyScalar(1/s).
   *
   * @param {number} s - Scalar divisor.
   * @returns {Vector3} this
   *
   * @example
   * const v = new DSRT.Vector3(10,20,30);
   * v.divideScalar(10); // v = (1,2,3)
   */
  divideScalar(s) { return this.multiplyScalar(1 / s); }

  /**
   * Component-wise minimum with another vector.
   *
   * @param {Vector3} v
   * @returns {Vector3} this
   *
   * @example
   * const a = new DSRT.Vector3(5,1,9);
   * const b = new DSRT.Vector3(3,7,4);
   * a.min(b); // a = (3,1,4)
   */
  min(v) { this.x = Math.min(this.x, v.x); this.y = Math.min(this.y, v.y); this.z = Math.min(this.z, v.z); return this; }

  /**
   * Component-wise maximum with another vector.
   *
   * @param {Vector3} v
   * @returns {Vector3} this
   *
   * @example
   * const a = new DSRT.Vector3(5,1,9);
   * const b = new DSRT.Vector3(3,7,4);
   * a.max(b); // a = (5,7,9)
   */
  max(v) { this.x = Math.max(this.x, v.x); this.y = Math.max(this.y, v.y); this.z = Math.max(this.z, v.z); return this; }

  /**
   * Clamp each component between min and max vectors.
   *
   * @param {Vector3} min - Minimum allowed values.
   * @param {Vector3} max - Maximum allowed values.
   * @returns {Vector3} this
   *
   * @example
   * const v = new DSRT.Vector3(10,-5,20);
   * v.clamp(new DSRT.Vector3(0,0,0), new DSRT.Vector3(5,5,5));
   * // v = (5,0,5)
   */
  clamp(min, max) {
    this.x = clamp(this.x, min.x, max.x);
    this.y = clamp(this.y, min.y, max.y);
    this.z = clamp(this.z, min.z, max.z);
    return this;
  }

  /**
   * Clamp each component between scalar min and max.
   *
   * @param {number} minVal
   * @param {number} maxVal
   * @returns {Vector3} this
   *
   * @example
   * const v = new DSRT.Vector3(10,-5,20);
   * v.clampScalar(0,10); // v = (10,0,10)
   */
  clampScalar(minVal, maxVal) {
    this.x = clamp(this.x, minVal, maxVal);
    this.y = clamp(this.y, minVal, maxVal);
    this.z = clamp(this.z, minVal, maxVal);
    return this;
  }

  /**
   * Clamp vector length between min and max.
   *
   * DSRT Notes:
   * - Normalizes then scales to clamped length.
   *
   * @param {number} min
   * @param {number} max
   * @returns {Vector3} this
   *
   * @example
   * const v = new DSRT.Vector3(10,0,0);
   * v.clampLength(2,5); // v = (5,0,0)
   */
  clampLength(min, max) {
    const len = this.length();
    return this.divideScalar(len || 1).multiplyScalar(clamp(len, min, max));
  }
  /**
   * Floor each component.
   *
   * DSRT Notes:
   * - Equivalent to Math.floor on x,y,z.
   * - Useful for grid snapping.
   *
   * @returns {Vector3} this
   *
   * @example
   * const v = new DSRT.Vector3(1.9, -2.1, 3.7);
   * v.floor(); // v = (1,-3,3)
   */
  floor() { this.x = Math.floor(this.x); this.y = Math.floor(this.y); this.z = Math.floor(this.z); return this; }

  /**
   * Ceil each component.
   *
   * @returns {Vector3} this
   *
   * @example
   * const v = new DSRT.Vector3(1.2, -2.8, 3.1);
   * v.ceil(); // v = (2,-2,4)
   */
  ceil() { this.x = Math.ceil(this.x); this.y = Math.ceil(this.y); this.z = Math.ceil(this.z); return this; }

  /**
   * Round each component to nearest integer.
   *
   * @returns {Vector3} this
   *
   * @example
   * const v = new DSRT.Vector3(1.4, 2.6, -3.5);
   * v.round(); // v = (1,3,-4)
   */
  round() { this.x = Math.round(this.x); this.y = Math.round(this.y); this.z = Math.round(this.z); return this; }

  /**
   * Round each component toward zero.
   *
   * DSRT Notes:
   * - Positive values truncated down, negative values truncated up.
   *
   * @returns {Vector3} this
   *
   * @example
   * const v = new DSRT.Vector3(1.9, -2.9, 3.1);
   * v.roundToZero(); // v = (1,-2,3)
   */
  roundToZero() {
    this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x);
    this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y);
    this.z = this.z < 0 ? Math.ceil(this.z) : Math.floor(this.z);
    return this;
  }

  /**
   * Negate all components.
   *
   * @returns {Vector3} this
   *
   * @example
   * const v = new DSRT.Vector3(1,-2,3);
   * v.negate(); // v = (-1,2,-3)
   */
  negate() { this.x = -this.x; this.y = -this.y; this.z = -this.z; return this; }

  /**
   * Dot product with another vector.
   *
   * DSRT Notes:
   * - Returns scalar projection measure.
   * - Symmetric: a.dot(b) = b.dot(a).
   *
   * @param {Vector3} v
   * @returns {number}
   *
   * @example
   * const a = new DSRT.Vector3(1,0,0);
   * const b = new DSRT.Vector3(0,1,0);
   * a.dot(b); // 0
   */
  dot(v) { return this.x * v.x + this.y * v.y + this.z * v.z; }

  /**
   * Squared length (magnitude^2).
   *
   * DSRT Notes:
   * - Avoids sqrt, faster for comparisons.
   *
   * @returns {number}
   *
   * @example
   * const v = new DSRT.Vector3(3,4,0);
   * v.lengthSq(); // 25
   */
  lengthSq() { return this.x * this.x + this.y * this.y + this.z * this.z; }

  /**
   * Euclidean length (magnitude).
   *
   * @returns {number}
   *
   * @example
   * const v = new DSRT.Vector3(3,4,0);
   * v.length(); // 5
   */
  length() { return Math.sqrt(this.lengthSq()); }

  /**
   * Manhattan length (L1 norm).
   *
   * @returns {number}
   *
   * @example
   * const v = new DSRT.Vector3(1,-2,3);
   * v.manhattanLength(); // 6
   */
  manhattanLength() { return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z); }

  /**
   * Normalize this vector to unit length.
   *
   * DSRT Notes:
   * - If length=0, leaves vector unchanged.
   *
   * @returns {Vector3} this
   *
   * @example
   * const v = new DSRT.Vector3(10,0,0);
   * v.normalize(); // (1,0,0)
   */
  normalize() { return this.divideScalar(this.length() || 1); }

  /**
   * Set this vector to a specific length.
   *
   * @param {number} l - Desired length.
   * @returns {Vector3} this
   *
   * @example
   * const v = new DSRT.Vector3(2,0,0);
   * v.setLength(5); // (5,0,0)
   */
  setLength(l) { return this.normalize().multiplyScalar(l); }

  /**
   * Linear interpolate towards another vector.
   *
   * DSRT Notes:
   * - this = this + (v - this) * alpha.
   *
   * @param {Vector3} v - Target vector.
   * @param {number} alpha - Interpolation factor [0,1].
   * @returns {Vector3} this
   *
   * @example
   * const a = new DSRT.Vector3(0,0,0);
   * const b = new DSRT.Vector3(10,0,0);
   * a.lerp(b,0.5); // (5,0,0)
   */
  lerp(v, alpha) {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;
    this.z += (v.z - this.z) * alpha;
    return this;
  }

  /**
   * Linear interpolate between two vectors.
   *
   * @param {Vector3} v1
   * @param {Vector3} v2
   * @param {number} alpha
   * @returns {Vector3} this
   *
   * @example
   * const v1 = new DSRT.Vector3(0,0,0);
   * const v2 = new DSRT.Vector3(10,0,0);
   * const v = new DSRT.Vector3();
   * v.lerpVectors(v1,v2,0.25); // (2.5,0,0)
   */
  lerpVectors(v1, v2, alpha) {
    this.x = v1.x + (v2.x - v1.x) * alpha;
    this.y = v1.y + (v2.y - v1.y) * alpha;
    this.z = v1.z + (v2.z - v1.z) * alpha;
    return this;
  }

  /**
   * Cross product with another vector.
   *
   * DSRT Notes:
   * - this = this × v.
   * - Result is perpendicular to both.
   *
   * @param {Vector3} v
   * @returns {Vector3} this
   *
   * @example
   * const a = new DSRT.Vector3(1,0,0);
   * const b = new DSRT.Vector3(0,1,0);
   * a.cross(b); // (0,0,1)
   */
  cross(v) { return this.crossVectors(this, v); }

  /**
   * Cross product of two vectors.
   *
   * @param {Vector3} a
   * @param {Vector3} b
   * @returns {Vector3} this
   *
   * @example
   * const a = new DSRT.Vector3(1,0,0);
   * const b = new DSRT.Vector3(0,1,0);
   * const c = new DSRT.Vector3();
   * c.crossVectors(a,b); // (0,0,1)
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
   * Project this vector onto another vector.
   *
   * DSRT Notes:
   * - Formula: proj_v(u) = (u·v / |v|²) * v
   * - If v has zero length, result is (0,0,0).
   * - Mutates this vector to the projection result.
   *
   * @param {Vector3} v - Vector to project onto.
   * @returns {Vector3} this
   *
   * @example
   * const u = new DSRT.Vector3(2,3,0);
   * const v = new DSRT.Vector3(1,0,0);
   * u.projectOnVector(v); // u = (2,0,0)
   */
  projectOnVector(v) {
    const denom = v.lengthSq();
    if (denom === 0) return this.set(0,0,0);
    const s = this.dot(v) / denom;
    return this.copy(v).multiplyScalar(s);
  }

  /**
   * Project this vector onto a plane defined by its normal.
   *
   * DSRT Notes:
   * - Equivalent to: this - proj_n(this).
   * - If normal is not normalized, result still valid.
   *
   * @param {Vector3} planeNormal - Plane normal vector.
   * @returns {Vector3} this
   *
   * @example
   * const v = new DSRT.Vector3(1,2,3);
   * const n = new DSRT.Vector3(0,1,0);
   * v.projectOnPlane(n); // removes y component
   */
  projectOnPlane(planeNormal) {
    vectorHelper.copy(this).projectOnVector(planeNormal);
    return this.sub(vectorHelper);
  }

  /**
   * Reflect this vector across a plane normal.
   *
   * DSRT Notes:
   * - Formula: r = v - 2*(v·n)*n
   * - Normal should be normalized for geometric correctness.
   *
   * @param {Vector3} normal - Plane normal.
   * @returns {Vector3} this
   *
   * @example
   * const v = new DSRT.Vector3(1,-1,0);
   * const n = new DSRT.Vector3(0,1,0);
   * v.reflect(n); // v = (1,1,0)
   */
  reflect(normal) {
    return this.sub(vectorHelper.copy(normal).multiplyScalar(2 * this.dot(normal)));
  }

  /**
   * Compute angle to another vector in radians.
   *
   * DSRT Notes:
   * - Uses arccos of normalized dot product.
   * - Returns [0,π].
   * - If either vector is zero, returns π/2.
   *
   * @param {Vector3} v
   * @returns {number} Angle in radians.
   *
   * @example
   * const a = new DSRT.Vector3(1,0,0);
   * const b = new DSRT.Vector3(0,1,0);
   * a.angleTo(b); // ~1.5708 (90°)
   */
  angleTo(v) {
    const denom = Math.sqrt(this.lengthSq() * v.lengthSq());
    if (denom === 0) return Math.PI / 2;
    const theta = this.dot(v) / denom;
    return Math.acos(clamp(theta, -1, 1));
  }

  /**
   * Euclidean distance to another vector.
   *
   * @param {Vector3} v
   * @returns {number}
   *
   * @example
   * const a = new DSRT.Vector3(0,0,0);
   * const b = new DSRT.Vector3(3,4,0);
   * a.distanceTo(b); // 5
   */
  distanceTo(v) { return Math.sqrt(this.distanceToSquared(v)); }

  /**
   * Squared Euclidean distance to another vector.
   *
   * DSRT Notes:
   * - Avoids sqrt, faster for comparisons.
   *
   * @param {Vector3} v
   * @returns {number}
   *
   * @example
   * const a = new DSRT.Vector3(0,0,0);
   * const b = new DSRT.Vector3(3,4,0);
   * a.distanceToSquared(b); // 25
   */
  distanceToSquared(v) {
    const dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;
    return dx*dx + dy*dy + dz*dz;
  }

  /**
   * Manhattan (L1) distance to another vector.
   *
   * @param {Vector3} v
   * @returns {number}
   *
   * @example
   * const a = new DSRT.Vector3(1,2,3);
   * const b = new DSRT.Vector3(4,6,0);
   * a.manhattanDistanceTo(b); // |1-4|+|2-6|+|3-0| = 10
   */
  manhattanDistanceTo(v) {
    return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z);
  }
  /**
   * Set this vector from a DSRT.Spherical object.
   *
   * DSRT Notes:
   * - Reads radius, phi, theta from spherical coordinates.
   * - Equivalent to calling setFromSphericalCoords.
   *
   * @param {Spherical} s - DSRT.Spherical with radius, phi, theta.
   * @returns {Vector3} this
   *
   * @example
   * const s = new DSRT.Spherical(5, Math.PI/2, 0);
   * const v = new DSRT.Vector3().setFromSpherical(s);
   * // v = (0,0,5)
   */
  setFromSpherical(s) {
    return this.setFromSphericalCoords(s.radius, s.phi, s.theta);
  }

  /**
   * Set this vector from spherical coordinates.
   *
   * DSRT Notes:
   * - radius ≥ 0
   * - phi = polar angle from positive Y axis [0,π]
   * - theta = azimuthal angle around Y axis [0,2π]
   *
   * @param {number} radius
   * @param {number} phi
   * @param {number} theta
   * @returns {Vector3} this
   *
   * @example
   * const v = new DSRT.Vector3().setFromSphericalCoords(1, Math.PI/2, Math.PI/2);
   * // v ≈ (1,0,0)
   */
  setFromSphericalCoords(radius, phi, theta) {
    const sinPhiRadius = Math.sin(phi) * radius;
    this.x = sinPhiRadius * Math.sin(theta);
    this.y = Math.cos(phi) * radius;
    this.z = sinPhiRadius * Math.cos(theta);
    return this;
  }

  /**
   * Set this vector from a DSRT.Cylindrical object.
   *
   * DSRT Notes:
   * - Reads radius, theta, y.
   * - Equivalent to setFromCylindricalCoords.
   *
   * @param {Cylindrical} c
   * @returns {Vector3} this
   *
   * @example
   * const c = new DSRT.Cylindrical(5, Math.PI/2, 2);
   * const v = new DSRT.Vector3().setFromCylindrical(c);
   * // v ≈ (5,2,0)
   */
  setFromCylindrical(c) {
    return this.setFromCylindricalCoords(c.radius, c.theta, c.y);
  }

  /**
   * Set this vector from cylindrical coordinates.
   *
   * DSRT Notes:
   * - radius ≥ 0
   * - theta = azimuthal angle around Y axis
   * - y = vertical component
   *
   * @param {number} radius
   * @param {number} theta
   * @param {number} y
   * @returns {Vector3} this
   *
   * @example
   * const v = new DSRT.Vector3().setFromCylindricalCoords(1, Math.PI/2, 3);
   * // v ≈ (1,3,0)
   */
  setFromCylindricalCoords(radius, theta, y) {
    this.x = radius * Math.sin(theta);
    this.y = y;
    this.z = radius * Math.cos(theta);
    return this;
  }

  /**
   * Set this vector from the position of a DSRT.Matrix4.
   *
   * DSRT Notes:
   * - Reads translation components (e[12],e[13],e[14]).
   *
   * @param {Matrix4} m
   * @returns {Vector3} this
   *
   * @example
   * const m = new DSRT.Matrix4().makeTranslation(1,2,3);
   * const v = new DSRT.Vector3().setFromMatrixPosition(m);
   * // v = (1,2,3)
   */
  setFromMatrixPosition(m) {
    const e = m.elements;
    this.x = e[12]; this.y = e[13]; this.z = e[14];
    return this;
  }

  /**
   * Set this vector from the scale of a DSRT.Matrix4.
   *
   * DSRT Notes:
   * - Computes length of each column vector.
   *
   * @param {Matrix4} m
   * @returns {Vector3} this
   *
   * @example
   * const m = new DSRT.Matrix4().makeScale(2,3,4);
   * const v = new DSRT.Vector3().setFromMatrixScale(m);
   * // v = (2,3,4)
   */
  setFromMatrixScale(m) {
    const sx = this.setFromMatrixColumn(m,0).length();
    const sy = this.setFromMatrixColumn(m,1).length();
    const sz = this.setFromMatrixColumn(m,2).length();
    this.x = sx; this.y = sy; this.z = sz;
    return this;
  }

  /**
   * Set this vector from a column of a DSRT.Matrix4.
   *
   * @param {Matrix4} m
   * @param {number} index - Column index (0,1,2,3).
   * @returns {Vector3} this
   *
   * @example
   * const m = new DSRT.Matrix4().identity();
   * const v = new DSRT.Vector3().setFromMatrixColumn(m,0);
   * // v = (1,0,0)
   */
  setFromMatrixColumn(m,index) {
    return this.fromArray(m.elements,index*4);
  }

  /**
   * Set this vector from a column of a DSRT.Matrix3.
   *
   * @param {Matrix3} m
   * @param {number} index - Column index (0,1,2).
   * @returns {Vector3} this
   *
   * @example
   * const m = new DSRT.Matrix3().identity();
   * const v = new DSRT.Vector3().setFromMatrix3Column(m,1);
   * // v = (0,1,0)
   */
  setFromMatrix3Column(m,index) {
    return this.fromArray(m.elements,index*3);
  }

  /**
   * Set this vector from a DSRT.Euler.
   *
   * DSRT Notes:
   * - Copies raw Euler angles (x,y,z).
   * - Not a rotation application, just assignment.
   *
   * @param {Euler} e
   * @returns {Vector3} this
   *
   * @example
   * const e = new DSRT.Euler(1,2,3);
   * const v = new DSRT.Vector3().setFromEuler(e);
   * // v = (1,2,3)
   */
  setFromEuler(e) { this.x = e._x; this.y = e._y; this.z = e._z; return this; }

  /**
   * Set this vector from a DSRT.Color.
   *
   * DSRT Notes:
   * - Copies r,g,b into x,y,z.
   *
   * @param {Color} c
   * @returns {Vector3} this
   *
   * @example
   * const c = new DSRT.Color(0.1,0.2,0.3);
   * const v = new DSRT.Vector3().setFromColor(c);
   * // v = (0.1,0.2,0.3)
   */
  setFromColor(c) { this.x = c.r; this.y = c.g; this.z = c.b; return this; }
  /**
   * Check strict equality with another vector.
   *
   * DSRT Notes:
   * - Compares x,y,z exactly (===).
   * - For floating point tolerance, use custom compare.
   *
   * @param {Vector3} v
   * @returns {boolean}
   *
   * @example
   * const a = new DSRT.Vector3(1,2,3);
   * const b = new DSRT.Vector3(1,2,3);
   * a.equals(b); // true
   */
  equals(v) { return (v.x === this.x && v.y === this.y && v.z === this.z); }

  /**
   * Load components from array.
   *
   * @param {ArrayLike<number>} array
   * @param {number} [offset=0]
   * @returns {Vector3} this
   *
   * @example
   * const arr = [10,20,30];
   * const v = new DSRT.Vector3().fromArray(arr);
   * // v = (10,20,30)
   */
  fromArray(array, offset=0) {
    this.x = array[offset];
    this.y = array[offset+1];
    this.z = array[offset+2];
    return this;
  }

  /**
   * Write components to array.
   *
   * @param {Array<number>} [array=[]]
   * @param {number} [offset=0]
   * @returns {Array<number>} array with written values
   *
   * @example
   * const v = new DSRT.Vector3(1,2,3);
   * const arr = v.toArray(); // [1,2,3]
   */
  toArray(array=[],offset=0) {
    array[offset] = this.x;
    array[offset+1] = this.y;
    array[offset+2] = this.z;
    return array;
  }

  /**
   * Load components from DSRT.BufferAttribute.
   *
   * @param {BufferAttribute} attribute
   * @param {number} index
   * @returns {Vector3} this
   *
   * @example
   * const attr = new DSRT.BufferAttribute(new Float32Array([1,2,3]),3);
   * const v = new DSRT.Vector3().fromBufferAttribute(attr,0);
   * // v = (1,2,3)
   */
  fromBufferAttribute(attribute,index) {
    this.x = attribute.getX(index);
    this.y = attribute.getY(index);
    this.z = attribute.getZ(index);
    return this;
  }

  /**
   * Fill with random components in [0,1).
   *
   * @returns {Vector3} this
   *
   * @example
   * const v = new DSRT.Vector3().random();
   * // v.x,y,z ∈ [0,1)
   */
  random() {
    this.x = Math.random();
    this.y = Math.random();
    this.z = Math.random();
    return this;
  }

  /**
   * Set to a random unit vector direction.
   *
   * DSRT Notes:
   * - Uniform distribution on sphere.
   * - Uses rejection sampling formula with u,θ.
   *
   * @returns {Vector3} this
   *
   * @example
   * const v = new DSRT.Vector3().randomDirection();
   * v.length(); // ≈ 1
   */
  randomDirection() {
    const theta = Math.random() * Math.PI * 2;
    const u = Math.random() * 2 - 1;
    const c = Math.sqrt(1 - u*u);
    this.x = c * Math.cos(theta);
    this.y = u;
    this.z = c * Math.sin(theta);
    return this;
  }

  /**
   * Serialize to DSRT JSON schema.
   *
   * DSRT Notes:
   * - Includes type and devtools marker.
   *
   * @returns {{type:string,x:number,y:number,z:number,devtools:string}}
   *
   * @example
   * const v = new DSRT.Vector3(1,2,3);
   * v.toJSON();
   * // { type:"DSRT.Vector3", x:1, y:2, z:3, devtools:"DSRT_DEVTOOLS" }
   */
  toJSON() {
    return {
      type: "DSRT.Vector3",
      x: this.x,
      y: this.y,
      z: this.z,
      devtools: "DSRT_DEVTOOLS"
    };
  }

  /**
   * Iterator over components.
   *
   * DSRT Notes:
   * - Enables for..of loops.
   *
   * @example
   * const v = new DSRT.Vector3(1,2,3);
   * for (const c of v) console.log(c);
   * // logs 1,2,3
   */
  *[Symbol.iterator]() {
    yield this.x;
    yield this.y;
    yield this.z;
  }
}

export { Vector3 };
