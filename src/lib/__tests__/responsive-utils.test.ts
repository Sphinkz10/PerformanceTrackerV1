/**
 * RESPONSIVE UTILS - TESTS
 * Testes unitários para as utility functions de responsividade
 */

import {
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
  getResponsiveValue,
  getGridColumns,
  getButtonSize
} from '../responsive-utils';

// Mock window.innerWidth
const setWindowWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width
  });
};

// Mock window.innerHeight
const setWindowHeight = (height: number) => {
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height
  });
};

describe('Responsive Utils', () => {
  
  // ==========================================
  // CONSTANTS TESTS
  // ==========================================
  
  describe('BREAKPOINTS', () => {
    it('should have correct breakpoint values', () => {
      expect(BREAKPOINTS.mobile).toBe(640);
      expect(BREAKPOINTS.tablet).toBe(768);
      expect(BREAKPOINTS.desktop).toBe(1024);
      expect(BREAKPOINTS.wide).toBe(1280);
      expect(BREAKPOINTS.ultrawide).toBe(1536);
    });
  });

  // ==========================================
  // DETECTION FUNCTIONS TESTS
  // ==========================================

  describe('isMobile', () => {
    it('should return true for widths < 768px', () => {
      setWindowWidth(767);
      expect(isMobile()).toBe(true);

      setWindowWidth(375); // iPhone
      expect(isMobile()).toBe(true);

      setWindowWidth(640);
      expect(isMobile()).toBe(true);
    });

    it('should return false for widths >= 768px', () => {
      setWindowWidth(768);
      expect(isMobile()).toBe(false);

      setWindowWidth(1024);
      expect(isMobile()).toBe(false);
    });
  });

  describe('isTablet', () => {
    it('should return true for widths between 768px and 1024px', () => {
      setWindowWidth(768);
      expect(isTablet()).toBe(true);

      setWindowWidth(800);
      expect(isTablet()).toBe(true);

      setWindowWidth(1023);
      expect(isTablet()).toBe(true);
    });

    it('should return false for widths outside tablet range', () => {
      setWindowWidth(767);
      expect(isTablet()).toBe(false);

      setWindowWidth(1024);
      expect(isTablet()).toBe(false);

      setWindowWidth(1440);
      expect(isTablet()).toBe(false);
    });
  });

  describe('isDesktop', () => {
    it('should return true for widths >= 1024px', () => {
      setWindowWidth(1024);
      expect(isDesktop()).toBe(true);

      setWindowWidth(1440);
      expect(isDesktop()).toBe(true);

      setWindowWidth(1920);
      expect(isDesktop()).toBe(true);
    });

    it('should return false for widths < 1024px', () => {
      setWindowWidth(1023);
      expect(isDesktop()).toBe(false);

      setWindowWidth(768);
      expect(isDesktop()).toBe(false);
    });
  });

  describe('getBreakpoint', () => {
    it('should return "mobile" for small widths', () => {
      setWindowWidth(375);
      expect(getBreakpoint()).toBe('mobile');

      setWindowWidth(640);
      expect(getBreakpoint()).toBe('mobile');

      setWindowWidth(767);
      expect(getBreakpoint()).toBe('mobile');
    });

    it('should return "tablet" for medium widths', () => {
      setWindowWidth(768);
      expect(getBreakpoint()).toBe('tablet');

      setWindowWidth(900);
      expect(getBreakpoint()).toBe('tablet');

      setWindowWidth(1023);
      expect(getBreakpoint()).toBe('tablet');
    });

    it('should return "desktop" for large widths', () => {
      setWindowWidth(1024);
      expect(getBreakpoint()).toBe('desktop');

      setWindowWidth(1200);
      expect(getBreakpoint()).toBe('desktop');

      setWindowWidth(1279);
      expect(getBreakpoint()).toBe('desktop');
    });

    it('should return "wide" for extra large widths', () => {
      setWindowWidth(1280);
      expect(getBreakpoint()).toBe('wide');

      setWindowWidth(1440);
      expect(getBreakpoint()).toBe('wide');

      setWindowWidth(1535);
      expect(getBreakpoint()).toBe('wide');
    });

    it('should return "ultrawide" for ultra large widths', () => {
      setWindowWidth(1536);
      expect(getBreakpoint()).toBe('ultrawide');

      setWindowWidth(1920);
      expect(getBreakpoint()).toBe('ultrawide');

      setWindowWidth(2560);
      expect(getBreakpoint()).toBe('ultrawide');
    });
  });

  // ==========================================
  // COMPARISON FUNCTIONS TESTS
  // ==========================================

  describe('isSmallerThan', () => {
    it('should correctly compare against breakpoints', () => {
      setWindowWidth(600);
      expect(isSmallerThan('mobile')).toBe(true);
      expect(isSmallerThan('tablet')).toBe(true);
      expect(isSmallerThan('desktop')).toBe(true);

      setWindowWidth(800);
      expect(isSmallerThan('mobile')).toBe(false);
      expect(isSmallerThan('tablet')).toBe(false);
      expect(isSmallerThan('desktop')).toBe(true);

      setWindowWidth(1200);
      expect(isSmallerThan('mobile')).toBe(false);
      expect(isSmallerThan('tablet')).toBe(false);
      expect(isSmallerThan('desktop')).toBe(false);
      expect(isSmallerThan('wide')).toBe(true);
    });
  });

  describe('isLargerThan', () => {
    it('should correctly compare against breakpoints', () => {
      setWindowWidth(600);
      expect(isLargerThan('mobile')).toBe(false);
      expect(isLargerThan('tablet')).toBe(false);

      setWindowWidth(800);
      expect(isLargerThan('mobile')).toBe(true);
      expect(isLargerThan('tablet')).toBe(true);
      expect(isLargerThan('desktop')).toBe(false);

      setWindowWidth(1440);
      expect(isLargerThan('desktop')).toBe(true);
      expect(isLargerThan('wide')).toBe(true);
    });
  });

  // ==========================================
  // MEDIA QUERY TESTS
  // ==========================================

  describe('getMediaQuery', () => {
    it('should return correct min-width media queries', () => {
      expect(getMediaQuery('mobile')).toBe('(min-width: 640px)');
      expect(getMediaQuery('tablet')).toBe('(min-width: 768px)');
      expect(getMediaQuery('desktop')).toBe('(min-width: 1024px)');
      expect(getMediaQuery('wide')).toBe('(min-width: 1280px)');
      expect(getMediaQuery('ultrawide')).toBe('(min-width: 1536px)');
    });
  });

  describe('getMaxMediaQuery', () => {
    it('should return correct max-width media queries', () => {
      expect(getMaxMediaQuery('mobile')).toBe('(max-width: 639px)');
      expect(getMaxMediaQuery('tablet')).toBe('(max-width: 767px)');
      expect(getMaxMediaQuery('desktop')).toBe('(max-width: 1023px)');
      expect(getMaxMediaQuery('wide')).toBe('(max-width: 1279px)');
    });
  });

  // ==========================================
  // TOUCH DETECTION TESTS
  // ==========================================

  describe('isTouchDevice', () => {
    it('should detect touch support', () => {
      // Mock touch support
      Object.defineProperty(window, 'ontouchstart', {
        writable: true,
        configurable: true,
        value: null
      });

      expect(isTouchDevice()).toBe(true);
    });

    it('should return false when no touch support', () => {
      // Remove touch support
      Object.defineProperty(window, 'ontouchstart', {
        writable: true,
        configurable: true,
        value: undefined
      });

      Object.defineProperty(navigator, 'maxTouchPoints', {
        writable: true,
        configurable: true,
        value: 0
      });

      expect(isTouchDevice()).toBe(false);
    });
  });

  // ==========================================
  // CLASS HELPERS TESTS
  // ==========================================

  describe('responsiveClasses', () => {
    it('should combine mobile and desktop classes', () => {
      const result = responsiveClasses('flex-col', 'flex-row');
      expect(result).toBe('flex-col  lg:flex-row');
    });

    it('should include tablet classes when provided', () => {
      const result = responsiveClasses('flex-col', 'flex-row', 'grid');
      expect(result).toBe('flex-col md:grid lg:flex-row');
    });

    it('should handle empty strings', () => {
      const result = responsiveClasses('', 'flex-row');
      expect(result).toBe('  lg:flex-row');
    });
  });

  // ==========================================
  // ORIENTATION TESTS
  // ==========================================

  describe('isLandscape', () => {
    it('should return true when width > height', () => {
      setWindowWidth(1024);
      setWindowHeight(768);
      expect(isLandscape()).toBe(true);
    });

    it('should return false when width <= height', () => {
      setWindowWidth(768);
      setWindowHeight(1024);
      expect(isLandscape()).toBe(false);
    });
  });

  describe('isPortrait', () => {
    it('should return true when width <= height', () => {
      setWindowWidth(768);
      setWindowHeight(1024);
      expect(isPortrait()).toBe(true);

      setWindowWidth(800);
      setWindowHeight(800);
      expect(isPortrait()).toBe(true);
    });

    it('should return false when width > height', () => {
      setWindowWidth(1024);
      setWindowHeight(768);
      expect(isPortrait()).toBe(false);
    });
  });

  // ==========================================
  // RESPONSIVE VALUE TESTS
  // ==========================================

  describe('getResponsiveValue', () => {
    it('should return mobile value on mobile', () => {
      setWindowWidth(375);
      const result = getResponsiveValue({
        mobile: 'mobile-value',
        tablet: 'tablet-value',
        desktop: 'desktop-value',
        default: 'default-value'
      });
      expect(result).toBe('mobile-value');
    });

    it('should return tablet value on tablet', () => {
      setWindowWidth(800);
      const result = getResponsiveValue({
        mobile: 'mobile-value',
        tablet: 'tablet-value',
        desktop: 'desktop-value',
        default: 'default-value'
      });
      expect(result).toBe('tablet-value');
    });

    it('should return desktop value on desktop', () => {
      setWindowWidth(1440);
      const result = getResponsiveValue({
        mobile: 'mobile-value',
        tablet: 'tablet-value',
        desktop: 'desktop-value',
        default: 'default-value'
      });
      expect(result).toBe('desktop-value');
    });

    it('should return default value when specific value is undefined', () => {
      setWindowWidth(375);
      const result = getResponsiveValue({
        tablet: 'tablet-value',
        desktop: 'desktop-value',
        default: 'default-value'
      });
      expect(result).toBe('default-value');
    });
  });

  // ==========================================
  // HELPER FUNCTIONS TESTS
  // ==========================================

  describe('getGridColumns', () => {
    it('should return 1 column on mobile', () => {
      setWindowWidth(375);
      expect(getGridColumns()).toBe(1);
    });

    it('should return 2 columns on tablet', () => {
      setWindowWidth(800);
      expect(getGridColumns()).toBe(2);
    });

    it('should return 4 columns on desktop', () => {
      setWindowWidth(1440);
      expect(getGridColumns()).toBe(4);
    });
  });

  describe('getButtonSize', () => {
    it('should return "md" on mobile for better touch targets', () => {
      setWindowWidth(375);
      expect(getButtonSize()).toBe('md');
    });

    it('should return "md" on tablet', () => {
      setWindowWidth(800);
      expect(getButtonSize()).toBe('md');
    });

    it('should return "sm" on desktop', () => {
      setWindowWidth(1440);
      expect(getButtonSize()).toBe('sm');
    });
  });
});
