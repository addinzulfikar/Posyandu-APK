import { Dimensions } from 'react-native';
import { useState, useEffect } from 'react';

// Hook untuk mendapatkan dimensions secara real-time
export const useResponsiveDimensions = () => {
  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  return dimensions;
};

// Function untuk mendapatkan breakpoint saat ini
export const getBreakpoint = (width) => {
  if (width <= 480) return 'mobile';
  if (width <= 1200) return 'tablet';
  return 'desktop';
};

// Dynamic responsive values
export const getResponsiveValue = (width, values) => {
  const breakpoint = getBreakpoint(width);
  return values[breakpoint] || values.mobile || values.default;
};

// Spacing berdasarkan breakpoint
export const getSpacing = (width) => ({
  xs: getResponsiveValue(width, { mobile: 2, tablet: 4, desktop: 4 }),
  sm: getResponsiveValue(width, { mobile: 4, tablet: 8, desktop: 8 }),
  md: getResponsiveValue(width, { mobile: 8, tablet: 12, desktop: 16 }),
  lg: getResponsiveValue(width, { mobile: 12, tablet: 16, desktop: 20 }),
  xl: getResponsiveValue(width, { mobile: 16, tablet: 20, desktop: 24 }),
});

// Font sizes berdasarkan breakpoint
export const getFontSize = (width) => ({
  xs: getResponsiveValue(width, { mobile: 10, tablet: 12, desktop: 12 }),
  sm: getResponsiveValue(width, { mobile: 12, tablet: 14, desktop: 14 }),
  md: getResponsiveValue(width, { mobile: 14, tablet: 16, desktop: 16 }),
  lg: getResponsiveValue(width, { mobile: 16, tablet: 18, desktop: 18 }),
  xl: getResponsiveValue(width, { mobile: 18, tablet: 20, desktop: 20 }),
  xxl: getResponsiveValue(width, { mobile: 20, tablet: 24, desktop: 24 }),
});

// Card dimensions berdasarkan breakpoint  
export const getCardDimensions = (width) => ({
  padding: getResponsiveValue(width, { mobile: 8, tablet: 12, desktop: 16 }),
  margin: getResponsiveValue(width, { mobile: 4, tablet: 6, desktop: 8 }),
  borderRadius: getResponsiveValue(width, { mobile: 6, tablet: 8, desktop: 8 }),
});

// Utility component untuk responsive container
export const ResponsiveProvider = ({ children }) => {
  const dimensions = useResponsiveDimensions();
  
  return children({
    ...dimensions,
    breakpoint: getBreakpoint(dimensions.width),
    spacing: getSpacing(dimensions.width),
    fontSize: getFontSize(dimensions.width),
    cardDimensions: getCardDimensions(dimensions.width),
  });
};

export default {
  useResponsiveDimensions,
  getBreakpoint,
  getResponsiveValue,
  getSpacing,
  getFontSize,
  getCardDimensions,
  ResponsiveProvider,
};