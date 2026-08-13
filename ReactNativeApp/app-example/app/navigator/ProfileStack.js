import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';


import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register'
import ProfileScreen from '../screens/ProfileScreen';


import OrdersHistory from '../components/Orders/OrderHistory';
import PaymentSuccess from '../components/Payment/PaymentSuccses';

const Stack = createStackNavigator();

function ProfileStackNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Profile"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' }
      }}
    >
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
      />
      <Stack.Screen 
        name="Login" 
        component={Login} 
        options={{
          headerShown: false,
        
        }}
      />

        <Stack.Screen
    name="PaymentSuccess"
    component={PaymentSuccess}
    options={{ title: 'Оплата' }}
  />

   <Stack.Screen
    name="Orders"
    component={OrdersHistory}
    options={{ title: 'Мои заказы' }}
  />
      <Stack.Screen 
        name="Register" 
        component={Register} 
        options={{
          headerShown: false,
       
        }}
      />
    </Stack.Navigator>
  );
}

export default ProfileStackNavigator;