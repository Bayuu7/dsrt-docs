import { Object3D } from '../core/Object3D.js';
import { Object3D } from '../core/Object3D.js';
import { Euler } from '../math/Euler.js';

/**
 * DSRT Scene
 * ----------
 * Defines the root container for all renderable objects.
 * Holds background, environment, fog, and pipeline configuration.
 */
class Scene extends Object3D {

  constructor() {
    super();

    /**
     * Type flag for DSRT.
     * Replaces isScene → inScene.
     */
    this.inScene = true;

    /**
     * Explicit type branding.
     */
    this.type = "DSRT.Scene";

    /**
     * Background definition (Color or Texture).
     */
    this.background = null;

    /**
     * Environment texture for PBR materials.
     */
    this.environment = null;

    /**
     * Fog instance (Fog or FogExp2).
     */
    this.fog = null;

    /**
     * Background blurriness factor [0..1].
     */
    this.backgroundBlurriness = 0;

    /**
     * Background intensity multiplier.
     */
    this.backgroundIntensity = 1;

    /**
     * Background rotation (Euler).
     */
    this.backgroundRotation = new Euler();

    /**
     * Environment intensity multiplier.
     */
    this.environmentIntensity = 1;

    /**
     * Environment rotation (Euler).
     */
    this.environmentRotation = new Euler();

    /**
     * Override material for forced rendering.
     */
    this.overrideMaterial = null;

    /**
     * Hook DSRT DevTools.
     */
    if (typeof window !== "undefined" && window["DSRT_DEVTOOLS"]) {
      window["DSRT_DEVTOOLS"].dispatchEvent(
        new CustomEvent("observe", { detail: this })
      );
    }
  }

  /**
   * Copy values from another Scene.
   */
  copy(source, recursive) {
    super.copy(source, recursive);

    if (source.background !== null) this.background = source.background.clone();
    if (source.environment !== null) this.environment = source.environment.clone();
    if (source.fog !== null) this.fog = source.fog.clone();

    this.backgroundBlurriness = source.backgroundBlurriness;
    this.backgroundIntensity = source.backgroundIntensity;
    this.backgroundRotation.copy(source.backgroundRotation);

    this.environmentIntensity = source.environmentIntensity;
    this.environmentRotation.copy(source.environmentRotation);

    if (source.overrideMaterial !== null) this.overrideMaterial = source.overrideMaterial.clone();

    this.matrixAutoUpdate = source.matrixAutoUpdate;

    return this;
  }

  /**
   * Serialize Scene into DSRT JSON schema.
   */
  toJSON(meta) {
    const base = super.toJSON(meta);

    return {
      type: "DSRT.Scene",
      id: this.uuid,
      profile: this.profile || "default",

      background: this.background
        ? {
            kind: this.background.isColor ? "Color" : "Texture",
            value: this.background.isColor
              ? this.background.getHexString()
              : this.background.src,
            blurriness: this.backgroundBlurriness,
            intensity: this.backgroundIntensity,
            rotation: this.backgroundRotation.toArray()
          }
        : null,

      environment: this.environment
        ? {
            kind: "Texture",
            src: this.environment.src,
            intensity: this.environmentIntensity,
            rotation: this.environmentRotation.toArray()
          }
        : null,

      fog: this.fog ? this.fog.toJSON() : null,

      overrideMaterial: this.overrideMaterial
        ? this.overrideMaterial.toJSON()
        : null,

      children: this.children.map(child => ({
        id: child.uuid,
        type: child.type
      })),

      pipeline: {
        binder: !!this.pipelineBinder,
        passes: ["background", "environment", "fog"].filter(
          p => this[`_${p}`] !== null
        )
      },

      devtools: "DSRT_DEVTOOLS"
    };
  }
}

export { Scene };
