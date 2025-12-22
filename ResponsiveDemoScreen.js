import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  ScrollView,
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/CommonComponents';
import { ResponsiveContainer, FormContainer, CardGrid, isDesktop, isTablet } from '../components/ResponsiveLayout';

export default function ResponsiveDemoScreen() {
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData(window);
    });

    return () => subscription?.remove();
  }, []);

  const getDeviceType = () => {
    if (screenData.width > 1024) return 'Desktop';
    if (screenData.width > 768) return 'Tablet';
    return 'Mobile';
  };

  const getBreakpointColor = () => {
    if (screenData.width > 1024) return '#27AE60'; // Green for desktop
    if (screenData.width > 768) return '#F39C12';  // Orange for tablet
    return '#E74C3C'; // Red for mobile
  };

  return (
    <ScrollView style={styles.container}>
      <ResponsiveContainer maxWidth={1200}>
        {/* Device Info Header */}
        <View style={[styles.infoCard, { backgroundColor: getBreakpointColor() }]}>
          <Text style={styles.infoTitle}>Responsive Layout Demo</Text>
          <Text style={styles.infoSubtitle}>
            Device: {getDeviceType()} | Width: {Math.round(screenData.width)}px
          </Text>
        </View>

        {/* Layout Examples */}
        <FormContainer>
          <Text style={styles.sectionTitle}>📱 Responsive Features</Text>
          
          {/* Grid Demo */}
          <View style={styles.section}>
            <Text style={styles.subTitle}>Card Grid Layout</Text>
            <Text style={styles.description}>
              Grid otomatis menyesuaikan: {isDesktop ? '3 kolom' : isTablet ? '2 kolom' : '1 kolom'}
            </Text>
            
            <CardGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
              <Card style={styles.demoCard}>
                <Ionicons name="people" size={24} color="#4A90E2" />
                <Text style={styles.cardText}>Card 1</Text>
              </Card>
              <Card style={styles.demoCard}>
                <Ionicons name="woman" size={24} color="#E74C3C" />
                <Text style={styles.cardText}>Card 2</Text>
              </Card>
              <Card style={styles.demoCard}>
                <Ionicons name="accessibility" size={24} color="#27AE60" />
                <Text style={styles.cardText}>Card 3</Text>
              </Card>
            </CardGrid>
          </View>

          {/* Typography Scale */}
          <View style={styles.section}>
            <Text style={styles.subTitle}>Typography Scale</Text>
            <Text style={[
              styles.sampleText,
              isDesktop && { fontSize: 28 },
              isTablet && { fontSize: 24 }
            ]}>
              Teks ini menyesuaikan ukuran layar
            </Text>
            <Text style={styles.description}>
              Font size: {isDesktop ? '24px (Desktop)' : isTablet ? '20px (Tablet)' : '16px (Mobile)'}
            </Text>
          </View>

          {/* Padding & Margins */}
          <View style={styles.section}>
            <Text style={styles.subTitle}>Spacing System</Text>
            <View style={[
              styles.spacingDemo,
              {
                padding: isDesktop ? 32 : isTablet ? 24 : 16,
                backgroundColor: getBreakpointColor() + '20'
              }
            ]}>
              <Text style={styles.description}>
                Padding: {isDesktop ? '32px' : isTablet ? '24px' : '16px'}
              </Text>
            </View>
          </View>

          {/* Navigation Adaptation */}
          <View style={styles.section}>
            <Text style={styles.subTitle}>Navigation Layout</Text>
            <View style={[
              styles.navDemo,
              isDesktop && styles.navDesktop,
              isTablet && styles.navTablet
            ]}>
              {['Home', 'Balita', 'Ibu Hamil', 'Lansia'].map((item, index) => (
                <TouchableOpacity key={index} style={[
                  styles.navItem,
                  isDesktop && styles.navItemDesktop
                ]}>
                  <Text style={[
                    styles.navText,
                    isDesktop && styles.navTextDesktop
                  ]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.description}>
              Layout: {isDesktop ? 'Horizontal dengan padding besar' : 'Vertikal dengan padding kecil'}
            </Text>
          </View>

          {/* Breakpoint Info */}
          <View style={styles.section}>
            <Text style={styles.subTitle}>Breakpoint System</Text>
            <View style={styles.breakpointContainer}>
              <View style={[styles.breakpointItem, { 
                backgroundColor: screenData.width <= 768 ? '#E74C3C' : '#f0f0f0',
                borderColor: screenData.width <= 768 ? '#E74C3C' : '#ddd'
              }]}>
                <Text style={[styles.breakpointText, {
                  color: screenData.width <= 768 ? 'white' : '#666'
                }]}>Mobile (≤768px)</Text>
              </View>
              
              <View style={[styles.breakpointItem, { 
                backgroundColor: screenData.width > 768 && screenData.width <= 1024 ? '#F39C12' : '#f0f0f0',
                borderColor: screenData.width > 768 && screenData.width <= 1024 ? '#F39C12' : '#ddd'
              }]}>
                <Text style={[styles.breakpointText, {
                  color: screenData.width > 768 && screenData.width <= 1024 ? 'white' : '#666'
                }]}>Tablet (768-1024px)</Text>
              </View>
              
              <View style={[styles.breakpointItem, { 
                backgroundColor: screenData.width > 1024 ? '#27AE60' : '#f0f0f0',
                borderColor: screenData.width > 1024 ? '#27AE60' : '#ddd'
              }]}>
                <Text style={[styles.breakpointText, {
                  color: screenData.width > 1024 ? 'white' : '#666'
                }]}>Desktop ({'>'}1024px)</Text>
              </View>
            </View>
          </View>

          {/* Feature List */}
          <View style={styles.section}>
            <Text style={styles.subTitle}>✨ Fitur Responsive</Text>
            {[
              'Auto-adjust grid columns',
              'Responsive typography scale', 
              'Dynamic spacing system',
              'Breakpoint-based layouts',
              'Container max-width limits',
              'Touch-friendly on mobile',
              'Mouse-optimized on desktop'
            ].map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#27AE60" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </FormContainer>
      </ResponsiveContainer>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  infoCard: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
  },
  infoSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  demoCard: {
    alignItems: 'center',
    padding: 16,
  },
  cardText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  sampleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  spacingDemo: {
    borderRadius: 8,
    marginBottom: 12,
  },
  navDemo: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  navDesktop: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  navItem: {
    padding: 8,
    marginVertical: 4,
  },
  navItemDesktop: {
    padding: 12,
    marginHorizontal: 8,
  },
  navText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  navTextDesktop: {
    fontSize: 16,
  },
  breakpointContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  breakpointItem: {
    flex: 1,
    margin: 4,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  breakpointText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  featureText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
});