import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

// Simple responsive breakpoints
const isMobile = screenWidth <= 480;
const isTablet = screenWidth > 480 && screenWidth <= 1200;
const isDesktop = screenWidth > 1200;

export const Card = ({ children, onPress, style }) => (
  <TouchableOpacity 
    style={[
      styles.card,
      style
    ]} 
    onPress={onPress} 
    activeOpacity={0.7}
  >
    {children}
  </TouchableOpacity>
);

export const InfoRow = ({ label, value, icon }) => (
  <View style={styles.infoRow}>
    {icon && <Ionicons name={icon} size={isMobile ? 18 : 22} color="#666" style={styles.infoIcon} />}
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || '-'}</Text>
    </View>
  </View>
);

export const StatusBadge = ({ status, type = 'default' }) => {
  const getBadgeStyle = () => {
    switch (status?.toLowerCase()) {
      case 'normal':
        return { backgroundColor: '#27AE60', color: 'white' };
      case 'kurang':
        return { backgroundColor: '#E74C3C', color: 'white' };
      case 'berlebih':
        return { backgroundColor: '#F39C12', color: 'white' };
      default:
        return { backgroundColor: '#95A5A6', color: 'white' };
    }
  };

  return (
    <View style={[styles.badge, getBadgeStyle()]}>
      <Text style={[styles.badgeText, { color: getBadgeStyle().color }]}>
        {status || 'Belum Ada Data'}
      </Text>
    </View>
  );
};

export const SectionHeader = ({ title, onAddPress, addButtonTitle = "Tambah" }) => (
  <View style={[
    styles.sectionHeader,
    isDesktop && styles.sectionHeaderDesktop
  ]}>
    <Text style={[
      styles.sectionTitle,
      isDesktop && styles.sectionTitleDesktop
    ]}>{title}</Text>
    {onAddPress && (
      <TouchableOpacity style={[
        styles.addButton,
        isDesktop && styles.addButtonDesktop
      ]} onPress={onAddPress}>
        <Ionicons name="add-circle" size={isDesktop ? 28 : 24} color="#4A90E2" />
        <Text style={[
          styles.addButtonText,
          isDesktop && styles.addButtonTextDesktop
        ]}>{addButtonTitle}</Text>
      </TouchableOpacity>
    )}
  </View>
);

// New responsive grid component
export const ResponsiveGrid = ({ children, columns }) => {
  const getColumns = () => {
    if (isDesktop) return columns?.desktop || 3;
    if (isTablet) return columns?.tablet || 2;
    return columns?.mobile || 1;
  };

  return (
    <View style={[styles.grid, { 
      flexDirection: isDesktop ? 'row' : 'column',
      flexWrap: isDesktop ? 'wrap' : 'nowrap'
    }]}>
      {React.Children.map(children, (child, index) => (
        <View style={[
          styles.gridItem,
          { width: isDesktop ? `${100/getColumns()}%` : '100%' }
        ]}>
          {child}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: isMobile ? 12 : 16,
    marginHorizontal: isMobile ? 8 : 16,
    marginVertical: isMobile ? 6 : 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    marginVertical: 2,
  },
  infoIcon: {
    marginRight: 10,
    width: 24,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: isMobile ? 12 : 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: isMobile ? 14 : 16,
    color: '#333',
    fontWeight: '600',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
  },
  sectionHeaderDesktop: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionTitleDesktop: {
    fontSize: 28,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addButtonText: {
    marginLeft: 4,
    color: '#4A90E2',
    fontWeight: '600',
  },
  addButtonDesktop: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  addButtonTextDesktop: {
    fontSize: 16,
    marginLeft: 6,
  },
  // Grid styles
  grid: {
    padding: 8,
  },
  gridItem: {
    padding: 8,
  },
});