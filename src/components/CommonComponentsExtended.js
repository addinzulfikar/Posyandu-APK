import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Button Component
export const Button = ({ title, onPress, variant = 'primary', icon, style, disabled }) => {
  const buttonStyles = [
    styles.button,
    variant === 'primary' && styles.buttonPrimary,
    variant === 'secondary' && styles.buttonSecondary,
    variant === 'danger' && styles.buttonDanger,
    variant === 'success' && styles.buttonSuccess,
    disabled && styles.buttonDisabled,
    style
  ];

  const textStyles = [
    styles.buttonText,
    variant === 'secondary' && styles.buttonTextSecondary,
  ];

  return (
    <TouchableOpacity 
      style={buttonStyles} 
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon && <Ionicons name={icon} size={20} color={variant === 'secondary' ? '#4A90E2' : 'white'} style={styles.buttonIcon} />}
      <Text style={textStyles}>{title}</Text>
    </TouchableOpacity>
  );
};

// Input Component
export const Input = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  editable = true,
  error,
  icon
}) => {
  return (
    <View style={styles.inputContainer}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <View style={styles.inputWrapper}>
        {icon && <Ionicons name={icon} size={20} color="#666" style={styles.inputIcon} />}
        <TextInput
          style={[
            styles.input, 
            multiline && styles.inputMultiline,
            icon && styles.inputWithIcon,
            error && styles.inputError
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          placeholderTextColor="#999"
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// Search Bar Component
export const SearchBar = ({ value, onChangeText, placeholder = "Cari..." }) => {
  return (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
      />
      {value !== '' && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Ionicons name="close-circle" size={20} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  );
};

// Tab View Component
export const TabView = ({ tabs, activeTab, onTabChange }) => {
  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.tab,
            activeTab === index && styles.activeTab
          ]}
          onPress={() => onTabChange(index)}
        >
          {tab.icon && (
            <Ionicons 
              name={tab.icon} 
              size={20} 
              color={activeTab === index ? '#4A90E2' : '#666'} 
              style={styles.tabIcon}
            />
          )}
          <Text style={[
            styles.tabText,
            activeTab === index && styles.activeTabText
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Badge Component (extended)
export const Badge = ({ text, variant = 'default' }) => {
  const badgeStyles = [
    styles.badge,
    variant === 'success' && styles.badgeSuccess,
    variant === 'warning' && styles.badgeWarning,
    variant === 'danger' && styles.badgeDanger,
    variant === 'info' && styles.badgeInfo,
  ];

  return (
    <View style={badgeStyles}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
};

// Empty State Component
export const EmptyState = ({ icon, title, message, actionText, onAction }) => {
  return (
    <View style={styles.emptyState}>
      <Ionicons name={icon || 'folder-open-outline'} size={64} color="#ccc" />
      <Text style={styles.emptyStateTitle}>{title}</Text>
      {message && <Text style={styles.emptyStateMessage}>{message}</Text>}
      {actionText && onAction && (
        <Button title={actionText} onPress={onAction} style={styles.emptyStateButton} />
      )}
    </View>
  );
};

// Stats Card Component
export const StatsCard = ({ title, value, icon, color = '#4A90E2' }) => {
  return (
    <View style={[styles.statsCard, { borderLeftColor: color }]}>
      <View style={styles.statsContent}>
        <Text style={styles.statsTitle}>{title}</Text>
        <Text style={[styles.statsValue, { color }]}>{value}</Text>
      </View>
      {icon && (
        <View style={[styles.statsIconContainer, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={30} color={color} />
        </View>
      )}
    </View>
  );
};

// List Item Component
export const ListItem = ({ 
  title, 
  subtitle, 
  value, 
  icon, 
  onPress, 
  rightIcon = 'chevron-forward',
  badge
}) => {
  return (
    <TouchableOpacity style={styles.listItem} onPress={onPress} activeOpacity={0.7}>
      {icon && (
        <View style={styles.listItemIconContainer}>
          <Ionicons name={icon} size={24} color="#4A90E2" />
        </View>
      )}
      <View style={styles.listItemContent}>
        <Text style={styles.listItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.listItemSubtitle}>{subtitle}</Text>}
      </View>
      {badge && <Badge text={badge.text} variant={badge.variant} />}
      {value && <Text style={styles.listItemValue}>{value}</Text>}
      {rightIcon && <Ionicons name={rightIcon} size={20} color="#ccc" />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Button Styles
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonPrimary: {
    backgroundColor: '#4A90E2',
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  buttonDanger: {
    backgroundColor: '#E74C3C',
  },
  buttonSuccess: {
    backgroundColor: '#27AE60',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#4A90E2',
  },
  buttonIcon: {
    marginRight: 8,
  },

  // Input Styles
  inputContainer: {
    marginVertical: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputWithIcon: {
    paddingLeft: 45,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#E74C3C',
  },
  inputIcon: {
    position: 'absolute',
    left: 15,
    top: 14,
    zIndex: 1,
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    marginTop: 4,
  },

  // Search Bar Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    height: 45,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },

  // Tab Styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4A90E2',
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4A90E2',
    fontWeight: '600',
  },

  // Badge Styles
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
  },
  badgeSuccess: {
    backgroundColor: '#d4edda',
  },
  badgeWarning: {
    backgroundColor: '#fff3cd',
  },
  badgeDanger: {
    backgroundColor: '#f8d7da',
  },
  badgeInfo: {
    backgroundColor: '#d1ecf1',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },

  // Empty State Styles
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyStateButton: {
    marginTop: 20,
  },

  // Stats Card Styles
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
  },
  statsContent: {
    flex: 1,
  },
  statsTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  statsValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statsIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // List Item Styles
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  listItemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  listItemSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  listItemValue: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
});
