import { AnimationPreset, AnimationCategory, CategoryInfo, TimingFunctionPreset } from './types';

export const animationCategories: CategoryInfo[] = [
  { id: 'fade', name: 'Fade', description: 'Smooth opacity transitions' },
  { id: 'slide', name: 'Slide', description: 'Movement along axes' },
  { id: 'scale', name: 'Scale', description: 'Size transformations' },
  { id: 'rotate', name: 'Rotate', description: 'Rotation and flips' },
  { id: 'bounce', name: 'Bounce', description: 'Elastic movements' },
  { id: 'shake', name: 'Shake', description: 'Vibration effects' },
  { id: 'attention', name: 'Attention', description: 'Eye-catching effects' },
];

export const timingFunctions: TimingFunctionPreset[] = [
  { name: 'linear', value: 'linear', label: 'Linear' },
  { name: 'ease', value: 'ease', label: 'Ease' },
  { name: 'ease-in', value: 'ease-in', label: 'Ease In' },
  { name: 'ease-out', value: 'ease-out', label: 'Ease Out' },
  { name: 'ease-in-out', value: 'ease-in-out', label: 'Ease In Out' },
  { name: 'cubic-bezier', value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', label: 'Custom (Back)' },
];

export const animationPresets: AnimationPreset[] = [
  // Fade Category
  {
    id: 'fade-in',
    name: 'Fade In',
    category: 'fade',
    keyframes: [
      { offset: 0, properties: { opacity: '0' } },
      { offset: 100, properties: { opacity: '1' } },
    ],
    defaultDuration: 0.6,
    defaultTimingFunction: 'ease-out',
    description: 'Smoothly fade element into view',
  },
  {
    id: 'fade-out',
    name: 'Fade Out',
    category: 'fade',
    keyframes: [
      { offset: 0, properties: { opacity: '1' } },
      { offset: 100, properties: { opacity: '0' } },
    ],
    defaultDuration: 0.6,
    defaultTimingFunction: 'ease-in',
    description: 'Smoothly fade element out of view',
  },
  {
    id: 'fade-in-up',
    name: 'Fade In Up',
    category: 'fade',
    keyframes: [
      { offset: 0, properties: { opacity: '0', transform: 'translateY(24px)' } },
      { offset: 100, properties: { opacity: '1', transform: 'translateY(0)' } },
    ],
    defaultDuration: 0.6,
    defaultTimingFunction: 'ease-out',
    description: 'Fade in while moving upward',
  },
  {
    id: 'fade-in-down',
    name: 'Fade In Down',
    category: 'fade',
    keyframes: [
      { offset: 0, properties: { opacity: '0', transform: 'translateY(-24px)' } },
      { offset: 100, properties: { opacity: '1', transform: 'translateY(0)' } },
    ],
    defaultDuration: 0.6,
    defaultTimingFunction: 'ease-out',
    description: 'Fade in while moving downward',
  },
  {
    id: 'fade-in-left',
    name: 'Fade In Left',
    category: 'fade',
    keyframes: [
      { offset: 0, properties: { opacity: '0', transform: 'translateX(-24px)' } },
      { offset: 100, properties: { opacity: '1', transform: 'translateX(0)' } },
    ],
    defaultDuration: 0.6,
    defaultTimingFunction: 'ease-out',
    description: 'Fade in from the left',
  },
  {
    id: 'fade-in-right',
    name: 'Fade In Right',
    category: 'fade',
    keyframes: [
      { offset: 0, properties: { opacity: '0', transform: 'translateX(24px)' } },
      { offset: 100, properties: { opacity: '1', transform: 'translateX(0)' } },
    ],
    defaultDuration: 0.6,
    defaultTimingFunction: 'ease-out',
    description: 'Fade in from the right',
  },

  // Slide Category
  {
    id: 'slide-in-up',
    name: 'Slide In Up',
    category: 'slide',
    keyframes: [
      { offset: 0, properties: { transform: 'translateY(100%)' } },
      { offset: 100, properties: { transform: 'translateY(0)' } },
    ],
    defaultDuration: 0.5,
    defaultTimingFunction: 'ease-out',
    description: 'Slide element up into view',
  },
  {
    id: 'slide-in-down',
    name: 'Slide In Down',
    category: 'slide',
    keyframes: [
      { offset: 0, properties: { transform: 'translateY(-100%)' } },
      { offset: 100, properties: { transform: 'translateY(0)' } },
    ],
    defaultDuration: 0.5,
    defaultTimingFunction: 'ease-out',
    description: 'Slide element down into view',
  },
  {
    id: 'slide-in-left',
    name: 'Slide In Left',
    category: 'slide',
    keyframes: [
      { offset: 0, properties: { transform: 'translateX(-100%)' } },
      { offset: 100, properties: { transform: 'translateX(0)' } },
    ],
    defaultDuration: 0.5,
    defaultTimingFunction: 'ease-out',
    description: 'Slide element in from the left',
  },
  {
    id: 'slide-in-right',
    name: 'Slide In Right',
    category: 'slide',
    keyframes: [
      { offset: 0, properties: { transform: 'translateX(100%)' } },
      { offset: 100, properties: { transform: 'translateX(0)' } },
    ],
    defaultDuration: 0.5,
    defaultTimingFunction: 'ease-out',
    description: 'Slide element in from the right',
  },

  // Scale Category
  {
    id: 'scale-in',
    name: 'Scale In',
    category: 'scale',
    keyframes: [
      { offset: 0, properties: { transform: 'scale(0)' } },
      { offset: 100, properties: { transform: 'scale(1)' } },
    ],
    defaultDuration: 0.5,
    defaultTimingFunction: 'ease-out',
    description: 'Scale element from zero to full size',
  },
  {
    id: 'scale-out',
    name: 'Scale Out',
    category: 'scale',
    keyframes: [
      { offset: 0, properties: { transform: 'scale(1)' } },
      { offset: 100, properties: { transform: 'scale(0)' } },
    ],
    defaultDuration: 0.5,
    defaultTimingFunction: 'ease-in',
    description: 'Scale element down to zero',
  },
  {
    id: 'scale-bounce',
    name: 'Scale Bounce',
    category: 'scale',
    keyframes: [
      { offset: 0, properties: { transform: 'scale(0)' } },
      { offset: 50, properties: { transform: 'scale(1.1)' } },
      { offset: 100, properties: { transform: 'scale(1)' } },
    ],
    defaultDuration: 0.6,
    defaultTimingFunction: 'ease-out',
    description: 'Scale with a bounce effect',
  },
  {
    id: 'scale-rotate',
    name: 'Scale Rotate',
    category: 'scale',
    keyframes: [
      { offset: 0, properties: { transform: 'scale(0) rotate(0deg)' } },
      { offset: 100, properties: { transform: 'scale(1) rotate(360deg)' } },
    ],
    defaultDuration: 0.8,
    defaultTimingFunction: 'ease-out',
    description: 'Scale while rotating',
  },

  // Rotate Category
  {
    id: 'rotate-360',
    name: 'Rotate 360',
    category: 'rotate',
    keyframes: [
      { offset: 0, properties: { transform: 'rotate(0deg)' } },
      { offset: 100, properties: { transform: 'rotate(360deg)' } },
    ],
    defaultDuration: 1,
    defaultTimingFunction: 'linear',
    description: 'Full 360-degree rotation',
  },
  {
    id: 'rotate-in',
    name: 'Rotate In',
    category: 'rotate',
    keyframes: [
      { offset: 0, properties: { opacity: '0', transform: 'rotate(-180deg) scale(0)' } },
      { offset: 100, properties: { opacity: '1', transform: 'rotate(0deg) scale(1)' } },
    ],
    defaultDuration: 0.7,
    defaultTimingFunction: 'ease-out',
    description: 'Rotate and scale into view',
  },
  {
    id: 'flip',
    name: 'Flip',
    category: 'rotate',
    keyframes: [
      { offset: 0, properties: { transform: 'perspective(400px) rotateY(0)' } },
      { offset: 100, properties: { transform: 'perspective(400px) rotateY(360deg)' } },
    ],
    defaultDuration: 0.8,
    defaultTimingFunction: 'ease-in-out',
    description: 'Flip around Y-axis',
  },
  {
    id: 'flip-x',
    name: 'Flip X',
    category: 'rotate',
    keyframes: [
      { offset: 0, properties: { transform: 'perspective(400px) rotateX(0)' } },
      { offset: 100, properties: { transform: 'perspective(400px) rotateX(360deg)' } },
    ],
    defaultDuration: 0.8,
    defaultTimingFunction: 'ease-in-out',
    description: 'Flip around X-axis',
  },

  // Bounce Category
  {
    id: 'bounce',
    name: 'Bounce',
    category: 'bounce',
    keyframes: [
      { offset: 0, properties: { transform: 'translateY(0)' } },
      { offset: 30, properties: { transform: 'translateY(-30px)' } },
      { offset: 50, properties: { transform: 'translateY(0)' } },
      { offset: 65, properties: { transform: 'translateY(-15px)' } },
      { offset: 80, properties: { transform: 'translateY(0)' } },
      { offset: 95, properties: { transform: 'translateY(-4px)' } },
      { offset: 100, properties: { transform: 'translateY(0)' } },
    ],
    defaultDuration: 1,
    defaultTimingFunction: 'ease',
    description: 'Classic bounce effect',
  },
  {
    id: 'bounce-in',
    name: 'Bounce In',
    category: 'bounce',
    keyframes: [
      { offset: 0, properties: { opacity: '0', transform: 'scale(0.3)' } },
      { offset: 50, properties: { opacity: '1', transform: 'scale(1.05)' } },
      { offset: 70, properties: { transform: 'scale(0.9)' } },
      { offset: 100, properties: { transform: 'scale(1)' } },
    ],
    defaultDuration: 0.8,
    defaultTimingFunction: 'ease',
    description: 'Bounce into view with scale',
  },
  {
    id: 'bounce-in-down',
    name: 'Bounce In Down',
    category: 'bounce',
    keyframes: [
      { offset: 0, properties: { opacity: '0', transform: 'translateY(-100%)' } },
      { offset: 60, properties: { opacity: '1', transform: 'translateY(25px)' } },
      { offset: 75, properties: { transform: 'translateY(-10px)' } },
      { offset: 90, properties: { transform: 'translateY(5px)' } },
      { offset: 100, properties: { transform: 'translateY(0)' } },
    ],
    defaultDuration: 1,
    defaultTimingFunction: 'ease',
    description: 'Bounce down into view',
  },

  // Shake Category
  {
    id: 'shake',
    name: 'Shake',
    category: 'shake',
    keyframes: [
      { offset: 0, properties: { transform: 'translateX(0)' } },
      { offset: 10, properties: { transform: 'translateX(-10px)' } },
      { offset: 20, properties: { transform: 'translateX(10px)' } },
      { offset: 30, properties: { transform: 'translateX(-10px)' } },
      { offset: 40, properties: { transform: 'translateX(10px)' } },
      { offset: 50, properties: { transform: 'translateX(-10px)' } },
      { offset: 60, properties: { transform: 'translateX(10px)' } },
      { offset: 70, properties: { transform: 'translateX(-10px)' } },
      { offset: 80, properties: { transform: 'translateX(10px)' } },
      { offset: 90, properties: { transform: 'translateX(-10px)' } },
      { offset: 100, properties: { transform: 'translateX(0)' } },
    ],
    defaultDuration: 0.8,
    defaultTimingFunction: 'ease',
    description: 'Horizontal shake effect',
  },
  {
    id: 'shake-y',
    name: 'Shake Y',
    category: 'shake',
    keyframes: [
      { offset: 0, properties: { transform: 'translateY(0)' } },
      { offset: 10, properties: { transform: 'translateY(-10px)' } },
      { offset: 20, properties: { transform: 'translateY(10px)' } },
      { offset: 30, properties: { transform: 'translateY(-10px)' } },
      { offset: 40, properties: { transform: 'translateY(10px)' } },
      { offset: 50, properties: { transform: 'translateY(-10px)' } },
      { offset: 60, properties: { transform: 'translateY(10px)' } },
      { offset: 70, properties: { transform: 'translateY(-10px)' } },
      { offset: 80, properties: { transform: 'translateY(10px)' } },
      { offset: 90, properties: { transform: 'translateY(-10px)' } },
      { offset: 100, properties: { transform: 'translateY(0)' } },
    ],
    defaultDuration: 0.8,
    defaultTimingFunction: 'ease',
    description: 'Vertical shake effect',
  },
  {
    id: 'wobble',
    name: 'Wobble',
    category: 'shake',
    keyframes: [
      { offset: 0, properties: { transform: 'translateX(0) rotate(0deg)' } },
      { offset: 15, properties: { transform: 'translateX(-25%) rotate(-5deg)' } },
      { offset: 30, properties: { transform: 'translateX(20%) rotate(3deg)' } },
      { offset: 45, properties: { transform: 'translateX(-15%) rotate(-3deg)' } },
      { offset: 60, properties: { transform: 'translateX(10%) rotate(2deg)' } },
      { offset: 75, properties: { transform: 'translateX(-5%) rotate(-1deg)' } },
      { offset: 100, properties: { transform: 'translateX(0) rotate(0deg)' } },
    ],
    defaultDuration: 1,
    defaultTimingFunction: 'ease',
    description: 'Wobble side to side',
  },
  {
    id: 'swing',
    name: 'Swing',
    category: 'shake',
    keyframes: [
      { offset: 0, properties: { transform: 'rotate(0deg)', transformOrigin: 'top center' } },
      { offset: 20, properties: { transform: 'rotate(15deg)' } },
      { offset: 40, properties: { transform: 'rotate(-10deg)' } },
      { offset: 60, properties: { transform: 'rotate(5deg)' } },
      { offset: 80, properties: { transform: 'rotate(-5deg)' } },
      { offset: 100, properties: { transform: 'rotate(0deg)' } },
    ],
    defaultDuration: 1,
    defaultTimingFunction: 'ease',
    description: 'Swing like a pendulum',
  },

  // Attention Category
  {
    id: 'pulse',
    name: 'Pulse',
    category: 'attention',
    keyframes: [
      { offset: 0, properties: { transform: 'scale(1)' } },
      { offset: 50, properties: { transform: 'scale(1.05)' } },
      { offset: 100, properties: { transform: 'scale(1)' } },
    ],
    defaultDuration: 1,
    defaultTimingFunction: 'ease-in-out',
    description: 'Gentle pulsing effect',
  },
  {
    id: 'heartbeat',
    name: 'Heartbeat',
    category: 'attention',
    keyframes: [
      { offset: 0, properties: { transform: 'scale(1)' } },
      { offset: 14, properties: { transform: 'scale(1.3)' } },
      { offset: 28, properties: { transform: 'scale(1)' } },
      { offset: 42, properties: { transform: 'scale(1.3)' } },
      { offset: 70, properties: { transform: 'scale(1)' } },
    ],
    defaultDuration: 1.3,
    defaultTimingFunction: 'ease-in-out',
    description: 'Heartbeat rhythm animation',
  },
  {
    id: 'flash',
    name: 'Flash',
    category: 'attention',
    keyframes: [
      { offset: 0, properties: { opacity: '1' } },
      { offset: 25, properties: { opacity: '0' } },
      { offset: 50, properties: { opacity: '1' } },
      { offset: 75, properties: { opacity: '0' } },
      { offset: 100, properties: { opacity: '1' } },
    ],
    defaultDuration: 1,
    defaultTimingFunction: 'ease',
    description: 'Quick flashing effect',
  },
  {
    id: 'rubber-band',
    name: 'Rubber Band',
    category: 'attention',
    keyframes: [
      { offset: 0, properties: { transform: 'scale(1)' } },
      { offset: 30, properties: { transform: 'scaleX(1.25) scaleY(0.75)' } },
      { offset: 40, properties: { transform: 'scaleX(0.75) scaleY(1.25)' } },
      { offset: 50, properties: { transform: 'scaleX(1.15) scaleY(0.85)' } },
      { offset: 65, properties: { transform: 'scaleX(0.95) scaleY(1.05)' } },
      { offset: 75, properties: { transform: 'scaleX(1.05) scaleY(0.95)' } },
      { offset: 100, properties: { transform: 'scale(1)' } },
    ],
    defaultDuration: 1,
    defaultTimingFunction: 'ease',
    description: 'Rubber band stretch effect',
  },
  {
    id: 'jello',
    name: 'Jello',
    category: 'attention',
    keyframes: [
      { offset: 0, properties: { transform: 'skewX(0deg) skewY(0deg)' } },
      { offset: 30, properties: { transform: 'skewX(-12.5deg) skewY(-12.5deg)' } },
      { offset: 40, properties: { transform: 'skewX(6.25deg) skewY(6.25deg)' } },
      { offset: 50, properties: { transform: 'skewX(-3.125deg) skewY(-3.125deg)' } },
      { offset: 65, properties: { transform: 'skewX(1.5625deg) skewY(1.5625deg)' } },
      { offset: 75, properties: { transform: 'skewX(-0.78125deg) skewY(-0.78125deg)' } },
      { offset: 100, properties: { transform: 'skewX(0deg) skewY(0deg)' } },
    ],
    defaultDuration: 0.9,
    defaultTimingFunction: 'ease',
    description: 'Jello-like wobble',
  },
];

export const getPresetsByCategory = (category: AnimationCategory): AnimationPreset[] => {
  return animationPresets.filter((preset) => preset.category === category);
};

export const getPresetById = (id: string): AnimationPreset | undefined => {
  return animationPresets.find((preset) => preset.id === id);
};
