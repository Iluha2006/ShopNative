import React from 'react';
import { View } from 'react-native';
import InfoProfile from '../components/ProductShop/InfoProfile';

export default function ProfileScreen({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <InfoProfile navigation={navigation} />
    </View>
  );
}
