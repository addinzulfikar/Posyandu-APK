import { Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

// Screen size categorization
export const isMobile = screenWidth <= 480;
export const isTablet = screenWidth > 480 && screenWidth <= 1200;
export const isDesktop = screenWidth > 1200;

// Responsive spacing utilities
export const spacing = {
  xs: isMobile ? 2 : 4,
  sm: isMobile ? 4 : 8,
  md: isMobile ? 6 : 12,
  lg: isMobile ? 8 : 16,
  xl: isMobile ? 12 : 20,
  xxl: isMobile ? 16 : 24,
};

// Responsive font sizes
export const fontSize = {
  xs: isMobile ? 10 : 12,
  sm: isMobile ? 12 : 14,
  md: isMobile ? 14 : 16,
  lg: isMobile ? 16 : 18,
  xl: isMobile ? 18 : 20,
  xxl: isMobile ? 20 : 24,
  xxxl: isMobile ? 24 : 28,
};

// Responsive dimensions
export const dimensions = {
  cardPadding: isMobile ? 8 : 16,
  cardMargin: isMobile ? 4 : 8,
  iconSize: isMobile ? 20 : 24,
  avatarSize: isMobile ? 50 : 60,
  buttonHeight: isMobile ? 40 : 44,
};

// Screen breakpoints
export const breakpoints = {
  mobile: 480,
  tablet: 1200,
};

// Responsive utility function
export const responsive = (mobileValue, tabletValue, desktopValue) => {
  if (isMobile) return mobileValue;
  if (isTablet) return tabletValue || mobileValue;
  return desktopValue || tabletValue || mobileValue;
};

export default {
  spacing,
  fontSize,
  dimensions,
  breakpoints,
  responsive,
  isMobile,
  isTablet,
  isDesktop,
};