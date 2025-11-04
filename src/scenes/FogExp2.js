import { Color } from '../math/Color.js';

/**
 * DSRT FogExp2
 * ------------
 * Defines an exponential squared fog that grows denser with distance.
 */
class FogExp2 {

  /**
   * Construct a new FogExp2 instance.
   *
   * @param {number|Color} color - The fog color.
   * @param {number} [density=0.00025] - Density factor controlling growth rate.
   */
  constructor(color, density = 0.00025) {

    /**
     * Type flag for DSRT.
     * Replaces isFogExp2 → inFogExp2.
     *
     * @type {boolean}
     * @readonly
     * @default true
     */
    this.inFogExp2 = true;

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
     * Density factor.
     *
     * @type {number}
     * @default 0.00025
     */
    this.density = density;
  }

  /**
   * Clone this FogExp2 instance.
   *
   * @return {FogExp2} A new FogExp2 with the same values.
   */
  clone() {
    return new FogExp2(this.color, this.density);
  }

  /**
   * Serialize FogExp2 into DSRT JSON schema.
   *
   * @return {Object} DSRT JSON object representing this FogExp2.
   */
  toJSON(/* meta */) {
    return {
      type: "DSRT.FogExp2",
      name: this.name || "",
      color: this.color ? this.color.getHexString() : null,
      density: this.density,
      devtools: "DSRT_DEVTOOLS"
    };
  }
}

export { FogExp2 };
