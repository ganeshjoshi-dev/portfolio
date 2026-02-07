import { describe, it, expect } from 'vitest';
import { parseColor, toHex, toHex8, toRgb, toRgba } from './converter';

describe('parseColor', () => {
  it('parses 3-digit hex', () => {
    expect(parseColor('#fff')).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    expect(parseColor('f00')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it('parses 6-digit hex', () => {
    expect(parseColor('#ffffff')).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    expect(parseColor('#000000')).toEqual({ r: 0, g: 0, b: 0, a: 1 });
    expect(parseColor('#10a020')).toEqual({ r: 16, g: 160, b: 32, a: 1 });
  });

  it('parses 8-digit hex with alpha', () => {
    const result = parseColor('#00000080');
    expect(result).not.toBeNull();
    expect(result!.r).toBe(0);
    expect(result!.g).toBe(0);
    expect(result!.b).toBe(0);
    expect(result!.a).toBeCloseTo(128 / 255, 4);
  });

  it('parses rgb() and rgba()', () => {
    expect(parseColor('rgb(255, 0, 0)')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(parseColor('rgba(0, 128, 255, 0.5)')).toEqual({
      r: 0,
      g: 128,
      b: 255,
      a: 0.5,
    });
  });

  it('parses hsl() and hsla()', () => {
    const red = parseColor('hsl(0, 100%, 50%)');
    expect(red).not.toBeNull();
    expect(red!.r).toBe(255);
    expect(red!.g).toBe(0);
    expect(red!.b).toBe(0);
  });

  it('returns null for invalid input', () => {
    expect(parseColor('')).toBeNull();
    expect(parseColor('not a color')).toBeNull();
    expect(parseColor('#gggggg')).toBeNull();
  });
});

describe('toHex', () => {
  it('formats RGBA to 6-digit hex', () => {
    expect(toHex({ r: 255, g: 255, b: 255, a: 1 })).toBe('#ffffff');
    expect(toHex({ r: 0, g: 0, b: 0, a: 1 })).toBe('#000000');
    expect(toHex({ r: 16, g: 160, b: 32, a: 1 })).toBe('#10a020');
  });
});

describe('toHex8', () => {
  it('formats RGBA to 8-digit hex', () => {
    expect(toHex8({ r: 255, g: 0, b: 0, a: 1 })).toBe('#ff0000ff');
    expect(toHex8({ r: 0, g: 0, b: 0, a: 0.5 })).toBe('#00000080');
  });
});

describe('toRgb / toRgba', () => {
  it('formats to rgb() and rgba() strings', () => {
    expect(toRgb({ r: 255, g: 128, b: 0, a: 1 })).toBe('rgb(255, 128, 0)');
    expect(toRgba({ r: 255, g: 128, b: 0, a: 0.5 })).toBe('rgba(255, 128, 0, 0.5)');
  });
});
