export type AnimationCategory =
  | 'fade'
  | 'slide'
  | 'scale'
  | 'rotate'
  | 'bounce'
  | 'shake'
  | 'attention';

export type TimingFunction =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'cubic-bezier';

export type AnimationDirection =
  | 'normal'
  | 'reverse'
  | 'alternate'
  | 'alternate-reverse';

export type AnimationFillMode = 'none' | 'forwards' | 'backwards' | 'both';

export type AnimationPlayState = 'running' | 'paused';

export interface Keyframe {
  offset: number; // 0-100 percentage
  properties: Record<string, string>; // CSS properties
}

export interface AnimationPreset {
  id: string;
  name: string;
  category: AnimationCategory;
  keyframes: Keyframe[];
  defaultDuration: number; // in seconds
  defaultTimingFunction: TimingFunction | string;
  description: string;
}

export interface AnimationConfig {
  preset: AnimationPreset;
  duration: number; // in seconds
  delay: number; // in seconds
  timingFunction: TimingFunction | string;
  iterationCount: number | 'infinite';
  direction: AnimationDirection;
  fillMode: AnimationFillMode;
  playState: AnimationPlayState;
}

export interface TimingFunctionPreset {
  name: string;
  value: string;
  label: string;
}

export interface CategoryInfo {
  id: AnimationCategory;
  name: string;
  description: string;
}
