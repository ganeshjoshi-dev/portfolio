export interface ColorStop {
  color: string;
  position: number;
  id: string;
}

export type GradientType = 'linear' | 'radial' | 'conic';

export interface GradientConfig {
  type: GradientType;
  angle: number;
  colorStops: ColorStop[];
  // For radial gradients
  radialShape?: 'circle' | 'ellipse';
  radialPosition?: string;
  // For conic gradients
  conicPosition?: string;
}

export interface GradientPreset {
  id: string;
  name: string;
  config: GradientConfig;
}

export const defaultColorStops: ColorStop[] = [
  { id: '1', color: '#00D9FF', position: 0 },
  { id: '2', color: '#3B82F6', position: 100 },
];

export const gradientPresets: GradientPreset[] = [
  {
    id: 'ocean',
    name: 'Ocean',
    config: {
      type: 'linear',
      angle: 135,
      colorStops: [
        { id: '1', color: '#667eea', position: 0 },
        { id: '2', color: '#764ba2', position: 100 },
      ],
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    config: {
      type: 'linear',
      angle: 90,
      colorStops: [
        { id: '1', color: '#f093fb', position: 0 },
        { id: '2', color: '#f5576c', position: 100 },
      ],
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    config: {
      type: 'linear',
      angle: 180,
      colorStops: [
        { id: '1', color: '#11998e', position: 0 },
        { id: '2', color: '#38ef7d', position: 100 },
      ],
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    config: {
      type: 'linear',
      angle: 135,
      colorStops: [
        { id: '1', color: '#0a0e27', position: 0 },
        { id: '2', color: '#1a1f3a', position: 50 },
        { id: '3', color: '#252d47', position: 100 },
      ],
    },
  },
  {
    id: 'fire',
    name: 'Fire',
    config: {
      type: 'linear',
      angle: 45,
      colorStops: [
        { id: '1', color: '#f12711', position: 0 },
        { id: '2', color: '#f5af19', position: 100 },
      ],
    },
  },
  {
    id: 'aurora',
    name: 'Aurora',
    config: {
      type: 'linear',
      angle: 90,
      colorStops: [
        { id: '1', color: '#00D9FF', position: 0 },
        { id: '2', color: '#8B5CF6', position: 50 },
        { id: '3', color: '#EC4899', position: 100 },
      ],
    },
  },
];
