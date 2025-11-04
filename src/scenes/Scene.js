import { Object3D } from '../core/Object3D.js';
import { Euler } from '../math/Euler.js';

class Scene extends Object3D {

  constructor() {
    super();

    // Flag tipe DSRT
    this.inScene = true;
    this.type = "DSRT.Scene";

    this.background = null;
    this.environment = null;
    this.fog = null;

    this.backgroundBlurriness = 0;
    this.backgroundIntensity = 1;
    this.backgroundRotation = new Euler();

    this.environmentIntensity = 1;
    this.environmentRotation = new Euler();

    this.overrideMaterial = null;

    // Hook DSRT DevTools
    if (typeof window !== "undefined" && window["DSRT_DEVTOOLS"]) {
      window["DSRT_DEVTOOLS"].dispatchEvent(
        new CustomEvent("observe", { detail: this })
      );
    }
  }

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
   * Serialize Scene ke schema DSRT
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
