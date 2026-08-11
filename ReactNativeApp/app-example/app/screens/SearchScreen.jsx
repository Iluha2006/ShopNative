import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Search from '../components/SeacrhProducts/Search';

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <Search/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});