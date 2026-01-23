import { AnimationConfig, Keyframe } from './types';

/**
 * Convert keyframes to CSS @keyframes syntax
 */
export const generateCSSKeyframes = (config: AnimationConfig): string => {
  const { preset } = config;
  const keyframesName = preset.id;
  
  let css = `@keyframes ${keyframesName} {\n`;
  
  preset.keyframes.forEach((keyframe) => {
    const percentLabel = keyframe.offset === 0 ? 'from' : keyframe.offset === 100 ? 'to' : `${keyframe.offset}%`;
    css += `  ${percentLabel} {\n`;
    
    Object.entries(keyframe.properties).forEach(([prop, value]) => {
      css += `    ${prop}: ${value};\n`;
    });
    
    css += `  }\n`;
  });
  
  css += `}`;
  
  return css;
};

/**
 * Generate CSS animation property
 */
export const generateCSSAnimation = (config: AnimationConfig): string => {
  const { preset, duration, delay, timingFunction, iterationCount, direction, fillMode } = config;
  
  const parts = [
    preset.id,
    `${duration}s`,
    timingFunction,
  ];
  
  if (delay > 0) {
    parts.push(`${delay}s`);
  }
  
  if (iterationCount !== 1) {
    parts.push(iterationCount.toString());
  }
  
  if (direction !== 'normal') {
    parts.push(direction);
  }
  
  if (fillMode !== 'none') {
    parts.push(fillMode);
  }
  
  return `animation: ${parts.join(' ')};`;
};

/**
 * Generate complete CSS code
 */
export const generateCSSCode = (config: AnimationConfig): string => {
  const keyframes = generateCSSKeyframes(config);
  const animation = generateCSSAnimation(config);
  const className = `.animate-${config.preset.id}`;
  
  return `${keyframes}

${className} {
  ${animation}
}`;
};

/**
 * Generate Tailwind config keyframes object
 */
export const generateTailwindKeyframes = (config: AnimationConfig): string => {
  const { preset } = config;
  
  let obj = `    ${preset.id}: {\n`;
  
  preset.keyframes.forEach((keyframe) => {
    const percentLabel = keyframe.offset === 0 ? "'0%'" : keyframe.offset === 100 ? "'100%'" : `'${keyframe.offset}%'`;
    obj += `      ${percentLabel}: {\n`;
    
    Object.entries(keyframe.properties).forEach(([prop, value]) => {
      obj += `        ${prop}: '${value}',\n`;
    });
    
    obj += `      },\n`;
  });
  
  obj += `    }`;
  
  return obj;
};

/**
 * Generate Tailwind animation config
 */
export const generateTailwindAnimation = (config: AnimationConfig): string => {
  const { preset, duration, delay, timingFunction, iterationCount, direction, fillMode } = config;
  
  const parts = [
    preset.id,
    `${duration}s`,
    timingFunction,
  ];
  
  if (delay > 0) {
    parts.push(`${delay}s`);
  }
  
  if (iterationCount !== 1) {
    parts.push(iterationCount.toString());
  }
  
  if (direction !== 'normal') {
    parts.push(direction);
  }
  
  if (fillMode !== 'none') {
    parts.push(fillMode);
  }
  
  return `    '${preset.id}': '${parts.join(' ')}'`;
};

/**
 * Generate complete Tailwind config
 */
export const generateTailwindConfig = (config: AnimationConfig): string => {
  const keyframes = generateTailwindKeyframes(config);
  const animation = generateTailwindAnimation(config);
  
  return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
${keyframes},
      },
      animation: {
${animation},
      },
    },
  },
}`;
};

/**
 * Generate ready-to-use class examples
 */
export const generateClassExamples = (config: AnimationConfig): string => {
  const { preset, duration, delay, timingFunction, iterationCount, direction, fillMode } = config;
  
  const className = `animate-${preset.id}`;
  
  // Build arbitrary value for alternative usage
  const parts = [
    preset.id,
    `${duration}s`,
    timingFunction,
  ];
  
  if (delay > 0) {
    parts.push(`${delay}s`);
  }
  
  if (iterationCount !== 1) {
    parts.push(iterationCount.toString());
  }
  
  if (direction !== 'normal') {
    parts.push(direction);
  }
  
  if (fillMode !== 'none') {
    parts.push(fillMode);
  }
  
  const arbitraryValue = parts.join('_').replace(/\(|\)/g, '');
  
  return `<!-- Using Tailwind config class -->
<div class="${className}">
  Your content here
</div>

<!-- Using arbitrary value (no config needed) -->
<div class="animate-[${arbitraryValue}]">
  Your content here
</div>

<!-- With additional Tailwind classes -->
<div class="${className} bg-blue-500 text-white p-4 rounded-lg">
  Animated element
</div>`;
};

/**
 * Generate inline style for React/HTML
 */
export const generateInlineStyle = (config: AnimationConfig): string => {
  const { preset, duration, delay, timingFunction, iterationCount, direction, fillMode } = config;
  
  const animationValue = [
    preset.id,
    `${duration}s`,
    timingFunction,
    delay > 0 ? `${delay}s` : '',
    iterationCount !== 1 ? iterationCount : '',
    direction !== 'normal' ? direction : '',
    fillMode !== 'none' ? fillMode : '',
  ].filter(Boolean).join(' ');
  
  return `style={{ animation: '${animationValue}' }}`;
};
