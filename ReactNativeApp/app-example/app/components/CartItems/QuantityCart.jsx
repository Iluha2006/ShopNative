import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { incrementCartItem, decrementCartItem } from '../../store/Cart';

function  QuantityCart({ cartItemId, initialQuantity = 1 }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleIncrement = async () => {
    try {
      setLoading(true);
      const result = await dispatch(incrementCartItem(cartItemId));
      if (result.success !== false) {
        setQuantity(prev => prev + 1);
      }
    } catch (error) {
      Alert.alert('Внимание', error.response?.data?.message || 'Не удалось увеличить количество');
    } finally {
      setLoading(false);
    }
  };

  const handleDecrement = async () => {
    if (quantity <= 1) {
      Alert.alert('Внимание', 'Количество не может быть меньше 1');
      return;
    }
    
    try {
      setLoading(true);
      const result = await dispatch(decrementCartItem(cartItemId));
      if (result.success !== false) {
        setQuantity(prev => prev - 1);
      }
    } catch (error) {
      Alert.alert('Внимание', error.response?.data?.message || 'Не удалось уменьшить количество');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleDecrement}
        disabled={loading || quantity <= 1}
      >
        <Ionicons name="remove" size={20} color={quantity <= 1 ? '#CCCCCC' : '#FF9E58'} />
      </TouchableOpacity>
      
      <Text style={styles.quantity}>{quantity}</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleIncrement}
        disabled={loading}
      >
        <Ionicons name="add" size={20} color="#FF9E58" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  button: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginHorizontal: 12,
    minWidth: 30,
    textAlign: 'center',
  },
});

export default QuantityCart;