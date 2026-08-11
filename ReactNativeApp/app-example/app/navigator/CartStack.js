import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ViewProduct from '../components/ProductShop/ViewingProduct';
import CartProduct from '../screens/CartScreen';
import MakingProduct from '../components/Orders/MakingOrder';

const Stack = createStackNavigator();

function CartNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Cart"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' }
      }}
    >
      <Stack.Screen 
        name="Cart" 
        component={CartProduct} 
      />
    <Stack.Screen 
        name="MakingProduct" 
        component={MakingProduct} 
        options={{
          headerShown: false,
        
        }}
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

export default CartNavigator;