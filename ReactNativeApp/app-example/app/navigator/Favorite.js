import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ViewProduct from '../components/ProductShop/ViewingProduct';

import FavoriteProduct from '../screens/FavoriteScreen';

const Stack = createStackNavigator();

function FavoriteNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Favorite"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' }
      }}
    >
      <Stack.Screen 
        name="Favorite" 
        component={FavoriteProduct} 
      />
      <Stack.Screen 
        name="ViewProduct" 
        component={ViewProduct} 
        options={{
          headerShown: false,
        
        }}
      />
    
    </Stack.Navigator>
  );
}

export default FavoriteNavigator;