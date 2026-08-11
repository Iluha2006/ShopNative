import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ViewProduct from '../components/ProductShop/ViewingProduct';
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

function ProductNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' }
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
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

export default ProductNavigator;