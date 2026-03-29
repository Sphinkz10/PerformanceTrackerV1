/**
 * RESPONSIVE UTILITIES
 * Sistema centralizado de breakpoints e helpers responsivos
 * Baseado em Tailwind CSS v4 breakpoints
 */

// ============================================
// BREAKPOINTS CONSTANTS
// ============================================

export const BREAKPOINTS = {
  mobile: 640,   // sm: até 640px
  tablet: 768,   // md: 768px - 1024px
  desktop: 1024, // lg: 1024px+
  wide: 1280,    // xl: 1280px+
  ultrawide: 1536 // 2xl: 1536px+
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

// ============================================
// DETECTION FUNCTIONS
// ============================================

/**
 * Verifica se está em mobile (< 768px)
 * @returns boolean
 */
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < BREAKPOINTS.tablet;
};

/**
 * Verifica se está em tablet (768px - 1024px)
 * @returns boolean
 */
export const isTablet = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= BREAKPOINTS.tablet && window.innerWidth < BREAKPOINTS.desktop;
};

/**
 * Verifica se está em desktop (>= 1024px)
 * @returns boolean
 */
export const isDesktop = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= BREAKPOINTS.desktop;
};

/**
 * Retorna o breakpoint atual
 * @returns 'mobile' | 'tablet' | 'desktop' | 'wide' | 'ultrawide'
 */
export const getBreakpoint = (): BreakpointKey => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  
  if (width < BREAKPOINTS.mobile) return 'mobile';
  if (width < BREAKPOINTS.tablet) return 'mobile';
  if (width < BREAKPOINTS.desktop) return 'tablet';
  if (width < BREAKPOINTS.wide) return 'desktop';
  if (width < BREAKPOINTS.ultrawide) return 'wide';
  return 'ultrawide';
};

/**
 * Verifica se a largura é menor que um breakpoint
 * @param breakpoint - Breakpoint a comparar
 * @returns boolean
 */
export const isSmallerThan = (breakpoint: BreakpointKey): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < BREAKPOINTS[breakpoint];
};

/**
 * Verifica se a largura é maior que um breakpoint
 * @param breakpoint - Breakpoint a comparar
 * @returns boolean
 */
export const isLargerThan = (breakpoint: BreakpointKey): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= BREAKPOINTS[breakpoint];
};

// ============================================
// MEDIA QUERY HELPERS
// ============================================

/**
 * Retorna media query string para um breakpoint
 * @param breakpoint - Breakpoint desejado
 * @returns string - Media query CSS
 */
export const getMediaQuery = (breakpoint: BreakpointKey): string => {
  return `(min-width: ${BREAKPOINTS[breakpoint]}px)`;
};

/**
 * Retorna media query para max-width
 * @param breakpoint - Breakpoint desejado
 * @returns string - Media query CSS
 */
export const getMaxMediaQuery = (breakpoint: BreakpointKey): string => {
  return `(max-width: ${BREAKPOINTS[breakpoint] - 1}px)`;
};

// ============================================
// TOUCH DETECTION
// ============================================

/**
 * Verifica se o dispositivo suporta touch
 * @returns boolean
 */
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// ============================================
// RESPONSIVE CLASS HELPERS
// ============================================

/**
 * Retorna classes Tailwind responsivas baseadas no contexto
 * @param mobileClasses - Classes para mobile
 * @param desktopClasses - Classes para desktop
 * @param tabletClasses - Classes opcionais para tablet
 * @returns string - Classes combinadas
 */
export const responsiveClasses = (
  mobileClasses: string,
  desktopClasses: string,
  tabletClasses?: string
): string => {
  const tablet = tabletClasses ? `md:${tabletClasses}` : '';
  return `${mobileClasses} ${tablet} lg:${desktopClasses}`;
};

// ============================================
// ORIENTATION DETECTION
// ============================================

/**
 * Verifica se está em landscape
 * @returns boolean
 */
export const isLandscape = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth > window.innerHeight;
};

/**
 * Verifica se está em portrait
 * @returns boolean
 */
export const isPortrait = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= window.innerHeight;
};

// ============================================
// SAFE AREA (Mobile notch/island)
// ============================================

/**
 * Retorna padding para safe area (notch/island em mobile)
 * @returns string - Tailwind classes
 */
export const getSafeAreaPadding = (): string => {
  if (!isMobile()) return '';
  return 'pt-safe pb-safe pl-safe pr-safe';
};

// ============================================
// RESPONSIVE VALUES
// ============================================

/**
 * Retorna valor responsivo baseado no breakpoint
 * @param values - Objeto com valores por breakpoint
 * @returns T - Valor correspondente ao breakpoint atual
 */
export const getResponsiveValue = <T>(values: {
  mobile?: T;
  tablet?: T;
  desktop?: T;
  default: T;
}): T => {
  if (isMobile() && values.mobile !== undefined) return values.mobile;
  if (isTablet() && values.tablet !== undefined) return values.tablet;
  if (isDesktop() && values.desktop !== undefined) return values.desktop;
  return values.default;
};

// ============================================
// GRID COLUMNS HELPER
// ============================================

/**
 * Retorna número de colunas de grid responsivo
 * @returns number - Número de colunas baseado no breakpoint
 */
export const getGridColumns = (): number => {
  return getResponsiveValue({
    mobile: 1,
    tablet: 2,
    desktop: 4,
    default: 3
  });
};

// ============================================
// BUTTON SIZE HELPER
// ============================================

/**
 * Retorna tamanho de botão responsivo
 * @returns 'sm' | 'md' | 'lg'
 */
export const getButtonSize = (): 'sm' | 'md' | 'lg' => {
  return getResponsiveValue({
    mobile: 'md', // Botões um pouco maiores em mobile para touch
    tablet: 'md',
    desktop: 'sm',
    default: 'md'
  });
};

// ============================================
// EXPORTS
// ============================================

export default {
  BREAKPOINTS,
  isMobile,
  isTablet,
  isDesktop,
  getBreakpoint,
  isSmallerThan,
  isLargerThan,
  getMediaQuery,
  getMaxMediaQuery,
  isTouchDevice,
  responsiveClasses,
  isLandscape,
  isPortrait,
  getSafeAreaPadding,
  getResponsiveValue,
  getGridColumns,
  getButtonSize
};
