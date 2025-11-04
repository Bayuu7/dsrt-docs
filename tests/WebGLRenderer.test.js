import { WebGLRenderer } from '../src/renderer/WebGLRenderer.js';

describe('WebGLRenderer', () => {
  let renderer;

  beforeEach(() => {
    renderer = new WebGLRenderer();
  });

  test('should create a canvas element', () => {
    expect(renderer.domElement).toBeInstanceOf(HTMLCanvasElement);
  });

  test('should set size correctly', () => {
    renderer.setSize(800, 600);
    expect(renderer.domElement.width).toBe(800);
    expect(renderer.domElement.height).toBe(600);
  });

  test('should clear without throwing', () => {
    expect(() => renderer.clear()).not.toThrow();
  });
});
