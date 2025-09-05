import { describe, it, expect } from 'vitest';
import MapboxStyleParser from './MapboxStyleParser';
import { Style } from 'geostyler-style';

describe('Writer fixes: defaults propagation and mark support', () => {
  it('propagates stroke/layout defaults to sibling line layers', async () => {
    const style: Style = {
      name: 'line-defaults',
      rules: [
        {
          name: 'r0',
          filter: ['==', 'TYPEPSC', '07'],
          symbolizers: [
            {
              kind: 'Line',
              color: '#67B551',
              width: 0.13,
              opacity: 1,
              cap: 'square',
              join: 'bevel',
              perpendicularOffset: 0
            },
            {
              kind: 'Line',
              perpendicularOffset: 0
            }
          ]
        }
      ]
    };

    const parser = new MapboxStyleParser();
    const { output } = await parser.writeStyle(style);
    const layers = output.layers || [];
    expect(layers.length).toBe(2);
    const l0 = layers[0];
    const l1 = layers[1];
    expect(l0.type).toBe('line');
    expect(l1.type).toBe('line');
    // First layer has explicit stroke/layout
    expect(l0.paint['line-color']).toBe('#67B551');
    expect(l0.paint['line-width']).toBe(0.13);
    expect(l0.paint['line-opacity']).toBe(1);
    expect(l0.layout['line-cap']).toBe('square');
    expect(l0.layout['line-join']).toBe('bevel');
    // Second layer should inherit defaults
    expect(l1.paint['line-color']).toBe('#67B551');
    expect(l1.paint['line-width']).toBe(0.13);
    expect(l1.paint['line-opacity']).toBe(1);
    expect(l1.layout['line-cap']).toBe('square');
    expect(l1.layout['line-join']).toBe('bevel');
    // And retain its own provided properties
    expect(l1.paint['line-offset']).toBe(0);
  });

  it('supports MarkSymbolizer for basic shapes by mapping to circle layer', async () => {
    const style: Style = {
      name: 'mark-fallback',
      rules: [
        {
          name: 'r0',
          symbolizers: [
            {
              kind: 'Mark',
              wellKnownName: 'square',
              radius: 5,
              color: '#ff0000',
              fillOpacity: 0.8,
              strokeColor: '#000000',
              strokeWidth: 1
            }
          ]
        }
      ]
    };

    const parser = new MapboxStyleParser();
    const { output } = await parser.writeStyle(style);
    const layers = output.layers || [];
    expect(layers.length).toBe(1);
    const lyr = layers[0];
    expect(lyr.type).toBe('circle');
    expect(lyr.paint['circle-color']).toBe('#ff0000');
    expect(lyr.paint['circle-opacity']).toBe(0.8);
    expect(lyr.paint['circle-stroke-color']).toBe('#000000');
    expect(lyr.paint['circle-stroke-width']).toBe(1);
    expect(lyr.paint['circle-radius']).toBe(5);
  });
});

