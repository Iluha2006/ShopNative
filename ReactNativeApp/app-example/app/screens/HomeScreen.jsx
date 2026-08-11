import React from 'react';
import { View, StyleSheet } from 'react-native';
import Product from '../components/ProductShop/Product';
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      
      <Product/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});