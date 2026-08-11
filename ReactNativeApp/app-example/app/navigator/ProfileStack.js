import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';


import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register'
import ProfileScreen from '../screens/ProfileScreen';

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