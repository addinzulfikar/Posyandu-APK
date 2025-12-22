import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

// Adjusted breakpoints for better mobile experience
const isDesktop = screenWidth > 1200;
const isTablet = screenWidth > 480 && screenWidth <= 1200;
const isMobile = screenWidth <= 480;

export const ResponsiveContainer = ({ children, style, maxWidth = 1200 }) => (
  <View style={[
    styles.container,
    isDesktop && { maxWidth, alignSelf: 'center', width: '100%' },
    style
  ]}>
    {children}
  </View>
);

export const ResponsiveScrollView = ({ children, style, contentContainerStyle, maxWidth = 1200 }) => (
  <ScrollView 
    style={[styles.scrollView, style]}
    contentContainerStyle={[
      contentContainerStyle,
      isDesktop && { maxWidth, alignSelf: 'center', width: '100%' }
    ]}
    showsVerticalScrollIndicator={false}
  >
    {children}
  </ScrollView>
);

// Responsive form container
export const FormContainer = ({ children, style }) => (
  <View style={[
    styles.formContainer,
    isDesktop && styles.formContainerDesktop,
    isTablet && styles.formContainerTablet,
    style
  ]}>
    {children}
  </View>
);

// Responsive two-column layout
export const TwoColumnLayout = ({ leftContent, rightContent, style }) => {
  if (!isDesktop) {
    return (
      <View style={[styles.singleColumn, style]}>
        {leftContent}
        {rightContent}
      </View>
    );
  }

  return (
    <View style={[styles.twoColumn, style]}>
      <View style={styles.leftColumn}>
        {leftContent}
      </View>
      <View style={styles.rightColumn}>
        {rightContent}
      </View>
    </View>
  );
};

// Responsive card grid
export const CardGrid = ({ children, columns = { mobile: 1, tablet: 2, desktop: 3 } }) => {
  const getColumns = () => {
    if (isDesktop) return columns.desktop;
    if (isTablet) return columns.tablet;
    return columns.mobile;
  };

  const numColumns = getColumns();

  return (
    <View style={styles.cardGrid}>
      {React.Children.map(children, (child, index) => (
        <View style={[
          styles.cardGridItem,
          { 
            width: `${100/numColumns}%`,
            paddingHorizontal: isDesktop ? 8 : 4
          }
        ]}>
          {child}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  formContainerDesktop: {
    padding: 40,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  formContainerTablet: {
    padding: 30,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  singleColumn: {
    flex: 1,
  },
  twoColumn: {
    flexDirection: 'row',
    flex: 1,
  },
  leftColumn: {
    flex: 1,
    marginRight: 16,
  },
  rightColumn: {
    flex: 1,
    marginLeft: 16,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
  },
  cardGridItem: {
    paddingVertical: 12,
  },
});

export { isDesktop, isTablet };
export default ResponsiveContainer;