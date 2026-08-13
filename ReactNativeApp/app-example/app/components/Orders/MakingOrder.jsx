import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';
import { useDispatch, useSelector } from 'react-redux';
import { createPayment, clearCurrentPayment } from '../../store/Payment';
import { clearCart, clearCartItems } from '../../store/Cart';
import { getAuthHeaders } from '../../store/AuthorizationCheck';
import { API_URL } from '../../config/api';

const MakingProduct = ({ navigation }) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const [total, setTotal] = useState(0);
  const [paying, setPaying] = useState(false);
  const { error } = useSelector((state) => state.payment);
  useEffect(() => {
    const sum = cartItems.reduce((acc, item) => {
      return acc + (parseFloat(item.product?.price || 0) * (item.quantity || 1));
    }, 0);
    setTotal(sum.toFixed(2));
  }, [cartItems]);

  
  const handlePay = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Ошибка', 'Корзина пуста');
      return;
    }

    try {
      setPaying(true);

      const items = cartItems.map((item) => ({
        product_id: item.product?.id ?? item.product_id,
        quantity: item.quantity || 1,
        size: item.size,
      }));

      const paymentData = await dispatch(createPayment(items));

      const paymentUrl = paymentData.url;
      if (!paymentUrl) {
        Alert.alert('Ошибка', 'Не удалось получить ссылку на оплату');
        return;
      }

      await WebBrowser.openBrowserAsync(paymentUrl);

      const headers = await getAuthHeaders();

      let check = null;
      for (let attempt = 0; attempt < 10; attempt += 1) {
        const res = await axios.get(
          `${API_URL}/payment/success?session_id=${paymentData.session_id}`,
          { headers }
        );
        check = res.data;
        if (check?.paid) break;
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      if (check?.paid) {
        const orderIds =
          check?.orders?.map((order) => order.id) ||
          (check?.order?.id ? [check.order.id] : paymentData?.order_ids || []);

        dispatch(clearCart());
        dispatch(clearCurrentPayment());

        try {
          await dispatch(clearCartItems());
        } catch (e) {
          // корзина на сервере уже очищена при подтверждении оплаты
        }

        navigation.replace('PaymentSuccess', {
          orderIds,
          total,
        });
      } else {
        Alert.alert('Оплата не завершена', 'Вы можете повторить попытку оплаты');
      }
    } catch (err) {
      console.error('Payment failed:', err);
      Alert.alert('Ошибка', err.response?.data?.error || 'Не удалось провести оплату');
    } finally {
      setPaying(false);
    }
  };
  const renderCartItem = ({ item }) => {
    const product = item.product || {};
    const imageUrl = item.selected_image || product.imageUrl; 
  
    return (
      <View style={styles.cartItem}>
        <Image 
          source={{ uri: imageUrl }}
          style={styles.productImage}
          resizeMode="cover"
        />
  
        <View style={styles.itemInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={styles.productSize}>Размер: {item.size}</Text>
          <Text style={styles.productPrice}>
            {(parseFloat(product.price) * item.quantity).toFixed(0)} ₽
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Подтверждение заказа</Text>

      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Корзина пуста</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id?.toString()}
            style={styles.itemsContainer}
          />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Итого:</Text>
            <Text style={styles.totalAmount}>{total} ₽</Text>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={[styles.payButton, (paying || cartItems.length === 0) && styles.disabledButton]}
            onPress={handlePay}
            disabled={paying || cartItems.length === 0}
          >
            {paying ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.payButtonText}>Оплатить</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding:20, paddingTop:30,  backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  itemsContainer: { marginBottom: 20 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 2,
    borderTopColor: '#FF9E58',
    marginTop: 10,
  },
  totalLabel: { fontSize: 18, fontWeight: '600' },
  totalAmount: { fontSize: 20, fontWeight: 'bold', color: '#FF9E58' },
  payButton: {
    backgroundColor: '#FF9E58',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',

    shadowRadius: 10,
    elevation: 5,
  },
  productImage: {
    width: '35%',
    maxWidth: 150,
    aspectRatio: 2,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productSize: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF9E58',
  },
  disabledButton: { opacity: 0.6 },
  payButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 40 },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 10 },
});

export default MakingProduct;