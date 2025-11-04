import { WebGLCoordinateSystem } from '../constants.js';
import { Matrix4 } from '../math/Matrix4.js';
import { Object3D } from '../core/Object3D.js';

/**
 * DSRT Camera
 * -----------
 * Abstract base class for cameras. Always extend this class when building a new camera.
 */
class Camera extends Object3D {

  constructor() {
    super();

    /**
     * Type flag for DSRT.
     * Replaces isCamera → inCamera.
     */
    this.inCamera = true;

    /**
     * Explicit type branding.
     */
    this.type = "DSRT.Camera";

    /**
     * The inverse of the camera's world matrix.
     */
    this.matrixWorldInverse = new Matrix4();

    /**
     * The camera's projection matrix.
     */
    this.projectionMatrix = new Matrix4();

    /**
     * The inverse of the camera's projection matrix.
     */
    this.projectionMatrixInverse = new Matrix4();

    /**
     * The coordinate system in which the camera is used.
     */
    this.coordinateSystem = WebGLCoordinateSystem;

    /**
     * Internal flag for reversed depth buffer.
     */
    this._reversedDepth = false;
  }

  /**
   * Indicates whether the camera uses a reversed depth buffer.
   */
  get reversedDepth() {
    return this._reversedDepth;
  }

  copy(source, recursive) {
    super.copy(source, recursive);

    this.matrixWorldInverse.copy(source.matrixWorldInverse);
    this.projectionMatrix.copy(source.projectionMatrix);
    this.projectionMatrixInverse.copy(source.projectionMatrixInverse);

    this.coordinateSystem = source.coordinateSystem;

    return this;
  }

  /**
   * Returns the forward direction of the camera in world space.
   * Cameras look down their local negative z-axis by default.
   */
  getWorldDirection(target) {
    return super.getWorldDirection(target).negate();
  }

  updateMatrixWorld(force) {
    super.updateMatrixWorld(force);
    this.matrixWorldInverse.copy(this.matrixWorld).invert();
  }

  updateWorldMatrix(updateParents, updateChildren) {
    super.updateWorldMatrix(updateParents, updateChildren);
    this.matrixWorldInverse.copy(this.matrixWorld).invert();
  }

  clone() {
    return new this.constructor().copy(this);
  }

  /**
   * Serialize Camera into DSRT JSON schema.
   */
  toJSON(meta) {
    const base = super.toJSON(meta);

    return {
      type: "DSRT.Camera",
      id: this.uuid,
      projectionMatrix: this.projectionMatrix.toArray(),
      projectionMatrixInverse: this.projectionMatrixInverse.toArray(),
      matrixWorldInverse: this.matrixWorldInverse.toArray(),
      coordinateSystem: this.coordinateSystem,
      reversedDepth: this._reversedDepth,
      devtools: "DSRT_DEVTOOLS"
    };
  }
}

export { Camera };
