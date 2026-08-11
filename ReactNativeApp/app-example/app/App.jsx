import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import { store } from './store/store';

import FavoriteProduct from './screens/FavoriteScreen';
import ProfileStackNavigator from './navigator/ProfileStack';
import ProductNavigator from './navigator/ProductStack';
import { checkIsAuth } from './store/AuthorizationCheck';
import SearchNavigator from './navigator/SearchStack';
import CartNavigator from './navigator/CartStack';
import FavoriteNavigator from './navigator/Favorite';
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const updateAuthStatus = async () => {
    try {
      const authResult = await checkIsAuth();
      setIsAuthenticated(authResult.isAuthenticated);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };


  useEffect(() => {
    updateAuthStatus();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Profile' || route.name === 'Login') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Favorite') {
            iconName = focused ? 'heart' : 'heart-outline';
          }

          if (route.name === 'Home' && focused) {
            return (
              <View style={styles.homeIconContainer}>
                <View style={styles.homeIconBackground}>
                  <Ionicons name={iconName} size={28} color="#FF9E58" />
                </View>
              </View>
            );
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: {
          backgroundColor: '#FF9E58',
          borderTopWidth: 0,
          height: 70, 
          paddingBottom: 5,
          paddingTop: 5,
          position: 'relative',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          color: '#FFFFFF',
          marginBottom: 5,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
      })}
    >
      <Tab.Screen 
        name="Search" 
        component={SearchNavigator} 
        options={{ 
          title: 'Поиск',
          headerShown: false
        }}
      />

      {isAuthenticated ? (
        <Tab.Screen 
          name="Profile" 
          component={ProfileStackNavigator} 
          options={{ 
            title: 'Профиль',
            headerShown: false
          }}
          listeners={{
            tabPress: async () => {
              await updateAuthStatus();
            },
          }}
        />
      ) : (
        <Tab.Screen 
          name="Login" 
          component={ProfileStackNavigator} 
          options={{ 
            title: 'Войти',
            headerShown: false
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
           
              updateAuthStatus();
              navigation.navigate('Login');
            },
          })}
        />
      )}
      
      <Tab.Screen 
  name="Home" 
  component={ProductNavigator} 
  options={{ 
    title: 'Sneakers-Shop',
    headerTitleAlign: 'center',
    headerStyle: {
      backgroundColor: '#FF9E58',
      elevation: 0,
      shadowOpacity: 0,
      shadowColor: 'transparent',
    },
    headerTintColor: '#FFFFFF',
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    headerShown: true,
    statusBarStyle: 'light',
    statusBarBackgroundColor: '#FF9E58',
  
    tabBarLabel: '', 
    tabBarIconStyle: {
      marginTop: -18,
    },
  }}
/>
      
      <Tab.Screen 
        name="Cart" 
        component={CartNavigator} 
        options={{ 
          title: 'Корзина',
          headerShown: false
        }}
      />
      
      <Tab.Screen 
        name="Favorite" 
        component={FavoriteNavigator} 
        options={{ 
          title: 'Избранное',
          headerShown: false
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  homeIconContainer: {
    position: 'absolute',
    top: -10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIconBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});