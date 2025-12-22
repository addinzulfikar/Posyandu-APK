import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import screens - Balita
import BalitaListScreen from '../screens/BalitaListScreen';
import BalitaDetailScreen from '../screens/BalitaDetailScreen';
import BalitaFormScreen from '../screens/BalitaFormScreen';
import BalitaPenimbanganScreen from '../screens/BalitaPenimbanganScreen';

// Import screens - Ibu Hamil
import IbuHamilListScreen from '../screens/IbuHamilListScreen';
import IbuHamilDetailScreen from '../screens/IbuHamilDetailScreen';
import IbuHamilFormScreen from '../screens/IbuHamilFormScreen';
import IbuHamilPenimbanganScreen from '../screens/IbuHamilPenimbanganScreen';

// Import screens - Lansia
import LansiaListScreen from '../screens/LansiaListScreen';
import LansiaDetailScreen from '../screens/LansiaDetailScreen';
import LansiaFormScreen from '../screens/LansiaFormScreen';
import LansiaPenimbanganScreen from '../screens/LansiaPenimbanganScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator for Balita
function BalitaStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#4A90E2' }, headerTintColor: 'white' }}>
      <Stack.Screen name="BalitaList" component={BalitaListScreen} options={{ title: 'Data Balita' }} />
      <Stack.Screen name="BalitaDetail" component={BalitaDetailScreen} options={{ title: 'Detail Balita' }} />
      <Stack.Screen name="BalitaForm" component={BalitaFormScreen} options={{ title: 'Input Data Balita' }} />
      <Stack.Screen name="BalitaPenimbangan" component={BalitaPenimbanganScreen} options={{ title: 'Penimbangan Balita' }} />
    </Stack.Navigator>
  );
}

// Stack Navigator for Ibu Hamil
function IbuHamilStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#E74C3C' }, headerTintColor: 'white' }}>
      <Stack.Screen name="IbuHamilList" component={IbuHamilListScreen} options={{ title: 'Data Ibu Hamil' }} />
      <Stack.Screen name="IbuHamilDetail" component={IbuHamilDetailScreen} options={{ title: 'Detail Ibu Hamil' }} />
      <Stack.Screen name="IbuHamilForm" component={IbuHamilFormScreen} options={{ title: 'Input Data Ibu Hamil' }} />
      <Stack.Screen name="IbuHamilPenimbangan" component={IbuHamilPenimbanganScreen} options={{ title: 'Pemeriksaan Ibu Hamil' }} />
    </Stack.Navigator>
  );
}

// Stack Navigator for Lansia
function LansiaStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#27AE60' }, headerTintColor: 'white' }}>
      <Stack.Screen name="LansiaList" component={LansiaListScreen} options={{ title: 'Data Lansia' }} />
      <Stack.Screen name="LansiaDetail" component={LansiaDetailScreen} options={{ title: 'Detail Lansia' }} />
      <Stack.Screen name="LansiaForm" component={LansiaFormScreen} options={{ title: 'Input Data Lansia' }} />
      <Stack.Screen name="LansiaPenimbangan" component={LansiaPenimbanganScreen} options={{ title: 'Pemeriksaan Lansia' }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Balita') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'IbuHamil') {
              iconName = focused ? 'woman' : 'woman-outline';
            } else if (route.name === 'Lansia') {
              iconName = focused ? 'accessibility' : 'accessibility-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4A90E2',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen 
          name="Balita" 
          component={BalitaStack} 
          options={{ title: 'Balita' }}
        />
        <Tab.Screen 
          name="IbuHamil" 
          component={IbuHamilStack} 
          options={{ title: 'Ibu Hamil' }} 
        />
        <Tab.Screen 
          name="Lansia" 
          component={LansiaStack}
          options={{ title: 'Lansia' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}