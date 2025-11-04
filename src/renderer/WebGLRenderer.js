/**
 * @dsrt.module renderer
 * @dsrt.class WebGLRenderer
 * @dsrt.description
 * DSRT WebGLRenderer is a WebGL2-only renderer.
 */
class WebGLRenderer {
  /**
   * @dsrt.method setSize
   * @dsrt.param {number} width - Logical width of the canvas.
   * @dsrt.param {number} height - Logical height of the canvas.
   * @dsrt.param {boolean} [updateStyle=true] - Whether to update the DOM style.
   * @dsrt.description Resize the canvas and update the viewport.
   */
  setSize(width, height, updateStyle = true) {
    this.width = width;
    this.height = height;
    if (updateStyle && this.domElement) {
      this.domElement.style.width = `${width}px`;
      this.domElement.style.height = `${height}px`;
    }
  }
}

export { WebGLRenderer };
