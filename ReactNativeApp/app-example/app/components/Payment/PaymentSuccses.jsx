import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const PaymentSuccess = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const orderId = route.params?.orderId ?? null;
  const total = route.params?.total ?? null;

  const goToHome = () => {
    const parent = navigation.getParent();
    if (parent) {
      navigation.popToTop();
      parent.navigate('Home');
    }
  };

  const goToOrders = () => {
    const parent = navigation.getParent();
    if (parent) {
      navigation.popToTop();
      parent.navigate('Profile', { screen: 'Orders' });
    } else {
      navigation.navigate('Orders');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>✅</Text>

        <Text style={styles.title}>Оплата прошла успешно</Text>

        {orderId ? (
          <Text style={styles.subtitle}>Заказ № {orderId}</Text>
        ) : null}

        {total ? (
          <Text style={styles.subtitle}>Сумма: {total} ₽</Text>
        ) : null}

        <TouchableOpacity
          style={styles.button}
          onPress={goToHome}
        >
          <Text style={styles.buttonText}>На главную</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={goToOrders}
        >
          <Text style={styles.secondaryButtonText}>Мои заказы</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
  },
  button: {
    backgroundColor: '#FF9E58',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF9E58',
  },
  secondaryButtonText: {
    color: '#FF9E58',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentSuccess;