/** Expected to be a class name that resolves to a button type, e.g. 'component-feature-button-color-1'. */
export type CtaComponentClass = string;
export type CtaButtonStyle = 'primary' | 'white' | 'tonal';

/**
 * Simplified for single-theme mode.
 * Multi-brand/theme CTA style resolution has been removed.
 * Always returns 'primary' as the default button style.
 */
export function useCtaComponentClass(
  _ctaComponentClass: CtaComponentClass | undefined
): CtaButtonStyle {
  return 'primary';
}
