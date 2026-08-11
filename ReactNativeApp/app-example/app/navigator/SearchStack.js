import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ViewProduct from '../components/ProductShop/ViewingProduct';
import SearchScreen from '../screens/SearchScreen';

const Stack = createStackNavigator();

function SearchNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Search"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' }
      }}
    >
      <Stack.Screen 
        name="Search" 
        component={SearchScreen} 
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

export default SearchNavigator;