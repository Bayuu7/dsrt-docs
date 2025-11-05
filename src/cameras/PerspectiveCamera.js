import { Camera } from './Camera.js';
import { RAD2DEG, DEG2RAD } from '../math/MathUtils.js';
import { Vector2 } from '../math/Vector2.js';
import { Vector3 } from '../math/Vector3.js';

const _v3 = new Vector3();
const _minTarget = new Vector2();
const _maxTarget = new Vector2();

/**
 * DSRT PerspectiveCamera
 * ----------------------
 * Perspective projection camera, mimicking human eye perception.
 */
class PerspectiveCamera extends Camera {

  constructor(fov = 50, aspect = 1, near = 0.1, far = 2000) {
    super();

    /**
     * Type flag for DSRT.
     */
    this.inPerspectiveCamera = true;

    /**
     * Explicit type branding.
     */
    this.type = "DSRT.PerspectiveCamera";

    this.fov = fov;
    this.zoom = 1;
    this.near = near;
    this.far = far;
    this.focus = 10;
    this.aspect = aspect;
    this.view = null;
    this.filmGauge = 35;
    this.filmOffset = 0;

    this.updateProjectionMatrix();
  }

  copy(source, recursive) {
    super.copy(source, recursive);

    this.fov = source.fov;
    this.zoom = source.zoom;
    this.near = source.near;
    this.far = source.far;
    this.focus = source.focus;
    this.aspect = source.aspect;
    this.view = source.view === null ? null : Object.assign({}, source.view);
    this.filmGauge = source.filmGauge;
    this.filmOffset = source.filmOffset;

    return this;
  }

  setFocalLength(focalLength) {
    const vExtentSlope = 0.5 * this.getFilmHeight() / focalLength;
    this.fov = RAD2DEG * 2 * Math.atan(vExtentSlope);
    this.updateProjectionMatrix();
  }

  getFocalLength() {
    const vExtentSlope = Math.tan(DEG2RAD * 0.5 * this.fov);
    return 0.5 * this.getFilmHeight() / vExtentSlope;
  }

  getEffectiveFOV() {
    return RAD2DEG * 2 * Math.atan(
      Math.tan(DEG2RAD * 0.5 * this.fov) / this.zoom
    );
  }

  getFilmWidth() {
    return this.filmGauge * Math.min(this.aspect, 1);
  }

  getFilmHeight() {
    return this.filmGauge / Math.max(this.aspect, 1);
  }

  getViewBounds(distance, minTarget, maxTarget) {
    _v3.set(-1, -1, 0.5).applyMatrix4(this.projectionMatrixInverse);
    minTarget.set(_v3.x, _v3.y).multiplyScalar(-distance / _v3.z);

    _v3.set(1, 1, 0.5).applyMatrix4(this.projectionMatrixInverse);
    maxTarget.set(_v3.x, _v3.y).multiplyScalar(-distance / _v3.z);
  }

  getViewSize(distance, target) {
    this.getViewBounds(distance, _minTarget, _maxTarget);
    return target.subVectors(_maxTarget, _minTarget);
  }

  setViewOffset(fullWidth, fullHeight, x, y, width, height) {
    this.aspect = fullWidth / fullHeight;

    if (this.view === null) {
      this.view = {
        enabled: true,
        fullWidth: 1,
        fullHeight: 1,
        offsetX: 0,
        offsetY: 0,
        width: 1,
        height: 1
      };
    }

    this.view.enabled = true;
    this.view.fullWidth = fullWidth;
    this.view.fullHeight = fullHeight;
    this.view.offsetX = x;
    this.view.offsetY = y;
    this.view.width = width;
    this.view.height = height;

    this.updateProjectionMatrix();
  }

  clearViewOffset() {
    if (this.view !== null) {
      this.view.enabled = false;
    }
    this.updateProjectionMatrix();
  }

  updateProjectionMatrix() {
    const near = this.near;
    let top = near * Math.tan(DEG2RAD * 0.5 * this.fov) / this.zoom;
    let height = 2 * top;
    let width = this.aspect * height;
    let left = -0.5 * width;

    if (this.view !== null && this.view.enabled) {
      const fullWidth = this.view.fullWidth;
      const fullHeight = this.view.fullHeight;

      left += this.view.offsetX * width / fullWidth;
      top -= this.view.offsetY * height / fullHeight;
      width *= this.view.width / fullWidth;
      height *= this.view.height / fullHeight;
    }

    const skew = this.filmOffset;
    if (skew !== 0) left += near * skew / this.getFilmWidth();

    this.projectionMatrix.makePerspective(
      left, left + width, top, top - height,
      near, this.far, this.coordinateSystem, this.reversedDepth
    );

    this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }

  /**
   * Serialize PerspectiveCamera into DSRT JSON schema.
   */
  toJSON(meta) {
    const base = super.toJSON(meta);

    return {
      type: "DSRT.PerspectiveCamera",
      id: this.uuid,
      fov: this.fov,
      zoom: this.zoom,
      near: this.near,
      far: this.far,
      focus: this.focus,
      aspect: this.aspect,
      view: this.view ? Object.assign({}, this.view) : null,
      filmGauge: this.filmGauge,
      filmOffset: this.filmOffset,
      projectionMatrix: this.projectionMatrix.toArray(),
      projectionMatrixInverse: this.projectionMatrixInverse.toArray(),
      devtools: "DSRT_DEVTOOLS"
    };
  }
}

export { PerspectiveCamera };
