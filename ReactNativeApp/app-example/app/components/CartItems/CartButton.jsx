import React, { useState } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Alert,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/Cart';


function AddToCartButton({ productId, size,  selectedImage}) {
  const dispatch = useDispatch();
  const [adding, setAdding] = useState(false);
  
  const handleAddToCart = async () => {
    try {
      setAdding(true);
      
      
      await dispatch(addToCart(productId, size, selectedImage));
      Alert.alert('Успешно', 'Товар добавлен в корзину');
    } catch (error) {
      console.log('Add to cart error:', error);
      Alert.alert('Ошибка', error.response?.data?.message || 'Не удалось добавить в корзину');
    } finally {
      setAdding(false);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.cartButton}
      onPress={handleAddToCart}
      disabled={adding}
    >
       <Ionicons name="cart" size={18} color="#FFFFFF" />
      <Text style={styles.cartButtonText}>
        Добавить
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cartButton: {
    backgroundColor: '#FF9E58',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  cartButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default AddToCartButton;