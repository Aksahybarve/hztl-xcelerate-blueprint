// Simplified: multi-brand/theme switching removed. Single static theme.
// All exports are kept for backward compatibility with consumers.
import { SiteName } from 'helpers/Constants/Constant';
import { createContext, HTMLAttributes, useContext } from 'react';

export const BRAND_MAPPING = {} as Record<string, string[]>;
export const ALL_BRANDS: string[] = [];
export const THEME_MAPPING = {} as Record<string, string[]>;
export const ALL_THEMES: string[] = [];

export interface BrandAndTheme {
  brand: string;
  theme: string;
  allowThemeSwitching: boolean;
}

export const DefaultBrand = '';
export const DefaultTheme = '';

export const BrandAndThemeContext = createContext<BrandAndTheme>({
  brand: DefaultBrand,
  theme: DefaultTheme,
  allowThemeSwitching: false,
});

export const useBrandAndTheme = () => useContext(BrandAndThemeContext);

/** No-op: site-to-brand mapping removed. Returns undefined always. */
export const getBrandForSiteName = (_siteName: SiteName): string | undefined => undefined;

type BrandAndThemeProviderProps = HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  brand?: string;
  theme?: string;
  applyToBody?: boolean;
};

/**
 * Simplified provider — no brand/theme switching.
 * Renders children directly. `brand-root` class is applied statically in app/layout.tsx.
 */
export const BrandAndThemeProvider = ({ children }: BrandAndThemeProviderProps) => {
  return (
    <BrandAndThemeContext.Provider
      value={{ brand: DefaultBrand, theme: DefaultTheme, allowThemeSwitching: false }}
    >
      {children}
    </BrandAndThemeContext.Provider>
  );
};
