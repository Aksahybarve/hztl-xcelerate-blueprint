// Global
export type SiteName = 'BrandX' | 'HelloWorld' | 'Nimbus';

// Themes — kept as a type for component rendering params (selectTheme param from Sitecore)
export type Themes =
  | 'ThemesWhite'
  | 'ThemesLight'
  | 'ThemesDark'
  | 'ThemesBrandPrimary'
  | 'ThemesBrandSecondary';

// Alignment
export type Alignment = 'Left' | 'Center' | 'Right' | undefined;

// Layout
export type Layout = 'Wide' | 'Full' | undefined;

// Video type
export type VideoType = 'youtube' | 'vimeo' | undefined;
