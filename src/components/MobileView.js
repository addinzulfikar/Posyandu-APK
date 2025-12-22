import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useResponsiveDimensions, getSpacing } from '../utils/dynamicResponsive';

// Fullscreen responsive container
export const MobileView = ({ children, style }) => {
  const dimensions = useResponsiveDimensions();
  const spacing = getSpacing(dimensions.width);
  
  return (
    <View style={[
      styles.container,
      {
        paddingHorizontal: spacing.sm,
        width: dimensions.width,
        minHeight: dimensions.height,
      },
      style
    ]}>
      {children}
    </View>
  );
};

// Fullscreen app container
export const FullScreenContainer = ({ children, style }) => {
  const dimensions = useResponsiveDimensions();
  
  return (
    <View style={[
      styles.fullScreenContainer,
      {
        width: dimensions.width,
        height: dimensions.height,
      },
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullScreenContainer: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      width: '100vw',
      height: '100vh',
    }),
  },
});

export default MobileView;