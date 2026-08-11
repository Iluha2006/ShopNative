import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  RefreshControl,

} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCart, 
  deleteCartItem, 
  clearCartItems,
} from '../../store/Cart';
import { useNavigation } from '@react-navigation/native'; 
import QuantityCart from './QuantityCart';


function CartStore() {  
  const dispatch = useDispatch();
  const { cartItems } = useSelector(state => state.cart);
  const [refreshing, setRefreshing] = useState(false);
   const nav= useNavigation();
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);
 
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchCart());
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  const handleDeleteItem = async (cartItemId) => {
    Alert.alert(
      'Удаление из корзины',
      'Вы уверены, что хотите удалить этот товар из корзины?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            await dispatch(deleteCartItem(cartItemId));
            Alert.alert('Успешно', 'Товар удалён из корзины');
          },
        },
      ]
    );
  };

  const handleClearCart = async () => {
    Alert.alert(
      'Очистка корзины',
      'Вы уверены, что хотите очистить всю корзину?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Очистить',
          style: 'destructive',
          onPress: async () => {
            await dispatch(clearCartItems());
            Alert.alert('Успешно', 'Корзина очищена');
          },
        },
      ]
    );
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = parseFloat(item.product?.price || 0);
      const quantity = item.quantity || 1;
      return sum + (price * quantity);
    }, 0).toFixed(2);
  };

  const renderCartItem = ({ item }) => {
    const product = item?.product || {};
    const imageUrl = item.selected_image || product.imageUrl ;
    const name = product.name ;
    const price = parseInt(product.price );
    const size = item.size

    return (

      <TouchableOpacity  
      onPress={() => nav.navigate('ViewProduct', { productId: product.id })}
      >  


      <View style={styles.cartItem}>
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.productImage}
          resizeMode="cover"
        />
        
        <View style={styles.itemInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {name}
          </Text>
          <Text style={styles.productSize}>Размер: {size}</Text>
          <Text style={styles.productPrice}>
            {price.toFixed(0)} ₽
          </Text>
          
          <View style={styles.itemActions}>
            <QuantityCart
              cartItemId={item.id} 
              initialQuantity={item.quantity} 
            />
            
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => handleDeleteItem(item.id)}
            >
              <Ionicons name="trash" size={20} color="#FF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cart-outline" size={80} color="#CCCCCC" />
      <Text style={styles.emptyTitle}>Корзина пуста</Text>
      <Text style={styles.emptyText}>Добавьте товары в корзину, чтобы продолжить</Text>
    </View>
  );

  const total = calculateTotal();

  return (
    <View style={styles.container}>
     
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Корзина</Text>
        {cartItems.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={handleClearCart}
          >
            <Text style={styles.clearButtonText}>Очистить</Text>
          </TouchableOpacity>
        )}
      </View>

      
      {cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <View style={styles.contentContainer}>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id?.toString() || `cart_${item.product_id}`}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#FF9E58']}
                tintColor="#FF9E58"
              />
            }
            showsVerticalScrollIndicator={true}
          />

        
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Итого:</Text>
              <Text style={styles.totalAmount}>{parseInt(total)} ₽</Text>
            </View>
            <TouchableOpacity 
  style={styles.checkoutButton}
  onPress={() => nav.navigate('MakingProduct')}
>
  <Text style={styles.checkoutButtonText}>Оформить заказ</Text>
</TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height:"100%",
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
   
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  clearButton: {
    padding: 6,
  },
  clearButtonText: {
    fontSize: 15,
    color: '#FF6B35',
    fontWeight: '600',
  },

  contentContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '35%',
    maxWidth: 160,
    aspectRatio: 2,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FF9E58',
    marginBottom: 8,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    marginLeft: 8,
    padding: 6,
  },

  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
   
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF9E58',
  },
  checkoutButton: {
    backgroundColor: '#FF9E58',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#555',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default CartStore;