import { Color } from '../math/Color.js';

/**
 * DSRT Fog
 * --------
 * Defines a linear fog that increases in density with distance.
 */
class Fog {

  /**
   * Construct a new Fog instance.
   *
   * @param {number|Color} color - The fog color.
   * @param {number} [near=1] - Minimum distance where fog starts.
   * @param {number} [far=1000] - Maximum distance where fog ends.
   */
  constructor(color, near = 1, far = 1000) {

    /**
     * Type flag for DSRT.
     * Replaces isFog → inFog.
     *
     * @type {boolean}
     * @readonly
     * @default true
     */
    this.inFog = true;

    /**
     * Optional name for identification.
     *
     * @type {string}
     */
    this.name = '';

    /**
     * Fog color.
     *
     * @type {Color}
     */
    this.color = new Color(color);

    /**
     * Minimum distance where fog starts.
     *
     * @type {number}
     * @default 1
     */
    this.near = near;

    /**
     * Maximum distance where fog ends.
     *
     * @type {number}
     * @default 1000
     */
    this.far = far;
  }

  /**
   * Clone this Fog instance.
   *
   * @return {Fog} A new Fog with the same values.
   */
  clone() {
    return new Fog(this.color, this.near, this.far);
  }

  /**
   * Serialize Fog into DSRT JSON schema.
   *
   * @return {Object} DSRT JSON object representing this Fog.
   */
  toJSON(/* meta */) {
    return {
      type: "DSRT.Fog",
      name: this.name || "",
      color: this.color ? this.color.getHexString() : null,
      near: this.near,
      far: this.far,
      devtools: "DSRT_DEVTOOLS"
    };
  }
}

export { Fog };
