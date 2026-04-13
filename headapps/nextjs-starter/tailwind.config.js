const figmaConfigImport = require('./tailwind-figma-config');
// In storybook, we need .default.
const figmaConfig = figmaConfigImport.default ?? figmaConfigImport;

/**
 * Deep merge two objects so nested token categories (colors, fontSize, spacing…)
 * from Brand/Theme don't overwrite Global — they extend it.
 */
function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return mergeDeep(target, ...sources);
}

// Merge all token layers so every category (colors, fontSize, spacing…) is fully populated.
// NOTE: typography tokens (fontSize, fontFamily, fontWeight, letterSpacing) live inside
// figmaConfig.Device — NOT figmaConfig.Global — so Device MUST be included here.
// The CSS variable values are overridden per breakpoint via @media rules in tokens.css.
const merged = mergeDeep(figmaConfig.Global, figmaConfig.Device, figmaConfig.Brand, figmaConfig.Theme);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      ...merged,
    },
  },
  plugins: [require('tailwind-variants')],
};
