import React from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFiltersSearch } from '../../hooks/useFiltersSearch';
import { useNavigation } from '@react-navigation/native';

export default function Search() {
  const { searchTerm, setSearchTerm, filteredProducts } = useFiltersSearch();
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('ViewProduct', { productId: item.id })}
    >
      <View style={styles.productItem}>
        <Text style={styles.productName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

 
  const isSearchEmpty = !searchTerm.trim();
  const hasNoResults = !isSearchEmpty && filteredProducts.length === 0;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Поиск по товарам..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {isSearchEmpty ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Используйте поиск, чтобы найти товары</Text>
        </View>
      ) : hasNoResults ? (
       
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Товары не найдены</Text>
        </View>
      ) : (
      
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          style={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    padding: 16,
  },
  searchInput: {
    width: 350,
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  productItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});