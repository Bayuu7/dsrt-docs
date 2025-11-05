// DSRTColor.test.js
import { DSRTColor } from './DSRTColor.js';

describe('DSRTColor', () => {
  test('constructor defaults to white', () => {
    const c = new DSRTColor();
    expect(c.r).toBe(1);
    expect(c.g).toBe(1);
    expect(c.b).toBe(1);
    expect(c.type).toBe('DSRT.Color');
  });

  test('set from hex', () => {
    const c = new DSRTColor().setHex(0xff0000);
    expect(c.r).toBeCloseTo(1);
    expect(c.g).toBeCloseTo(0);
    expect(c.b).toBeCloseTo(0);
  });

  test('set from RGB', () => {
    const c = new DSRTColor().setRGB(0.2, 0.4, 0.6);
    expect(c.r).toBeCloseTo(0.2);
    expect(c.g).toBeCloseTo(0.4);
    expect(c.b).toBeCloseTo(0.6);
  });

  test('set from HSL', () => {
    const c = new DSRTColor().setHSL(0, 1, 0.5); // pure red
    expect(c.r).toBeCloseTo(1);
    expect(c.g).toBeCloseTo(0);
    expect(c.b).toBeCloseTo(0);
  });

  test('set from style name', () => {
    const c = new DSRTColor().setStyle('blue');
    expect(c.r).toBeCloseTo(0);
    expect(c.g).toBeCloseTo(0);
    expect(c.b).toBeCloseTo(1);
  });

  test('clone and copy', () => {
    const a = new DSRTColor(0.1, 0.2, 0.3);
    const b = a.clone();
    expect(b.equals(a)).toBe(true);

    const c = new DSRTColor().copy(a);
    expect(c.equals(a)).toBe(true);
  });

  test('arithmetic operations', () => {
    const a = new DSRTColor(0.2, 0.3, 0.4);
    const b = new DSRTColor(0.1, 0.1, 0.1);

    a.add(b);
    expect(a.r).toBeCloseTo(0.3);

    a.sub(new DSRTColor(0.1, 0.2, 0.3));
    expect(a.r).toBeCloseTo(0.2);

    a.multiplyScalar(2);
    expect(a.r).toBeCloseTo(0.4);
  });

  test('lerp', () => {
    const a = new DSRTColor(0, 0, 0);
    const b = new DSRTColor(1, 1, 1);
    a.lerp(b, 0.5);
    expect(a.r).toBeCloseTo(0.5);
    expect(a.g).toBeCloseTo(0.5);
    expect(a.b).toBeCloseTo(0.5);
  });

  test('toArray and fromArray', () => {
    const c = new DSRTColor(0.1, 0.2, 0.3);
    const arr = c.toArray();
    expect(arr).toEqual([0.1, 0.2, 0.3]);

    const d = new DSRTColor().fromArray([0.4, 0.5, 0.6]);
    expect(d.r).toBeCloseTo(0.4);
    expect(d.g).toBeCloseTo(0.5);
    expect(d.b).toBeCloseTo(0.6);
  });

  test('JSON serialization', () => {
    const c = new DSRTColor(0.2, 0.3, 0.4);
    const json = c.toJSON();
    const d = new DSRTColor().fromJSON(json);
    expect(d.equals(c)).toBe(true);
  });

  test('iterator yields r,g,b', () => {
    const c = new DSRTColor(0.1, 0.2, 0.3);
    const values = [...c];
    expect(values).toEqual([0.1, 0.2, 0.3]);
  });

  test('dictionary lookup', () => {
    expect(DSRTColor.NAMES.red).toBe(0xff0000);
    expect(DSRTColor.NAMES.white).toBe(0xffffff);
  });
});
