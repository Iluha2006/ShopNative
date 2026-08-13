import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { getAuthHeaders } from '../../store/AuthorizationCheck';
import { API_URL } from '../../config/api';

const statusLabels = {
  pending: 'Ожидает оплаты',
  success: 'Оплачен',
  completed: 'Завершен',
  cancelled: 'Отменен',
};

const statusColors = {
  pending: '#f59e0b',
  success: '#22c55e',
  completed: '#3b82f6',
  cancelled: '#ef4444',
};

const OrdersHistory = () => {
  const navigation = useNavigation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const headers = await getAuthHeaders();

      const response = await axios.get(`${API_URL}/orders`, {
        headers,
      });

      const payload = response.data;

      if (Array.isArray(payload)) {
        setOrders(payload);
      } else if (Array.isArray(payload?.data)) {
        setOrders(payload.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Orders fetch error:', error);
      Alert.alert(
        'Ошибка',
        error.response?.data?.message || 'Не удалось загрузить заказы'
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const getStatusText = (status) => {
    return statusLabels[status] || status;
  };

  const getStatusColor = (status) => {
    return statusColors[status] || '#666';
  };

  const completedOrders = orders.filter(
    (order) => order.status === 'completed'
  );

  const renderOrder = ({ item }) => {
    const product = item.product || {};

    const imageUrl = item.selected_image || product.imageUrl || product.image_url || null;

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => {
          navigation.navigate('OrderDetails', {
            orderId: item.id,
          });
        }}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
             style={styles.orderImage}

            resizeMode="contain"
          />
        ) : (
          <View style={styles.orderImagePlaceholder}>
            <Text>Нет фото</Text>
          </View>
        )}

        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Заказ № {item.id}</Text>

          <Text style={styles.productName} numberOfLines={2}>
            {product.name || 'Товар'}
          </Text>

          <Text style={styles.orderText}>
            Размер: {item.selected_size || '-'}
          </Text>

          <Text style={styles.orderText}>
            Количество: {item.quantity}
          </Text>

          <Text style={styles.orderTotal}>
            {parseFloat(item.total_amount || 0).toFixed(0)} ₽
          </Text>

          <Text
            style={[
              styles.status,
              { color: getStatusColor(item.status) },
            ]}
          >
            {getStatusText(item.status)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF9E58" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Мои заказы</Text>

      {completedOrders.length === 0 ? (
        <Text style={styles.emptyText}>Заказов пока нет</Text>
      ) : (
        <FlatList
          data={completedOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOrder}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 30,
  },
  listContent: {
    paddingBottom: 30,
  },
  orderCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
    marginBottom: 12,
  },
  orderImage: {
    width: 120,
    height: 150,
    borderRadius: 10,
  
    marginRight: 12,
  },
  orderImagePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  orderText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9E58',
    marginTop: 6,
    marginBottom: 6,
  },
  
  status: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default OrdersHistory;