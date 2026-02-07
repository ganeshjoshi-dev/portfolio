import { describe, it, expect } from 'vitest';
import { jsonToXml, jsonToCsv } from './json-converters';

describe('jsonToXml', () => {
  it('converts a simple object to XML', () => {
    const xml = jsonToXml({ name: 'test', count: 2 }, 'root');
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<root>');
    expect(xml).toContain('<name>test</name>');
    expect(xml).toContain('<count>2</count>');
  });

  it('escapes special characters in string values', () => {
    const xml = jsonToXml({ value: 'a < b & c > d' }, 'root');
    expect(xml).toContain('&lt;');
    expect(xml).toContain('&amp;');
    expect(xml).toContain('&gt;');
  });

  it('handles arrays as repeated elements', () => {
    const xml = jsonToXml({ items: [1, 2, 3] }, 'root');
    expect(xml).toContain('<items>1</items>');
    expect(xml).toContain('<items>2</items>');
    expect(xml).toContain('<items>3</items>');
  });

  it('uses default root name when not provided', () => {
    const xml = jsonToXml({ x: 1 });
    expect(xml).toContain('<root>');
  });
});

describe('jsonToCsv', () => {
  it('converts array of objects to CSV with headers', () => {
    const data = [
      { a: 1, b: 'x' },
      { a: 2, b: 'y' },
    ];
    const csv = jsonToCsv(data);
    expect(csv).toContain('a,b');
    expect(csv).toContain('1,x');
    expect(csv).toContain('2,y');
  });

  it('converts single object to one row', () => {
    const csv = jsonToCsv({ name: 'Alice', age: 30 });
    expect(csv).toContain('age,name');
    expect(csv).toContain('30,Alice');
  });

  it('returns empty string for empty array', () => {
    expect(jsonToCsv([])).toBe('');
  });

  it('uses custom delimiter', () => {
    const csv = jsonToCsv([{ a: 1, b: 2 }], ';');
    expect(csv).toContain('a;b');
    expect(csv).toContain('1;2');
  });
});
