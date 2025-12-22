import React from 'react';
import { View, StyleSheet, Dimensions, Platform, ScrollView } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Mobile-first responsive breakpoints
const isMobile = screenWidth <= 480;
const isTablet = screenWidth > 480 && screenWidth <= 1200;
const isDesktop = screenWidth > 1200;

// Mobile-optimized container
export const MobileContainer = ({ children, style }) => (
  <View style={[
    styles.mobileContainer,
    isMobile && styles.mobileContainerCompact,
    style
  ]}>
    {children}
  </View>
);

// Compact card for mobile
export const CompactCard = ({ children, style }) => (
  <View style={[
    styles.compactCard,
    isMobile && styles.compactCardMobile,
    style
  ]}>
    {children}
  </View>
);

// Mobile-optimized scroll view
export const MobileScrollView = ({ children, style, contentContainerStyle }) => (
  <ScrollView
    style={[styles.scrollView, style]}
    contentContainerStyle={[
      styles.scrollContent,
      isMobile && styles.scrollContentMobile,
      contentContainerStyle
    ]}
    showsVerticalScrollIndicator={false}
    bounces={Platform.OS === 'ios'}
  >
    {children}
  </ScrollView>
);

// Full-width container for mobile
export const FullWidthContainer = ({ children, style }) => (
  <View style={[
    styles.fullWidth,
    isMobile && styles.fullWidthMobile,
    style
  ]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  mobileContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  mobileContainerCompact: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  compactCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  compactCardMobile: {
    padding: 8,
    marginHorizontal: 4,
    marginVertical: 3,
    borderRadius: 6,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 8,
  },
  scrollContentMobile: {
    paddingVertical: 4,
  },
  fullWidth: {
    width: '100%',
    paddingHorizontal: 16,
  },
  fullWidthMobile: {
    paddingHorizontal: 8,
  },
});

export { isMobile, isTablet, isDesktop };
export default MobileContainer;