import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux'; 

function FavoriteAuth({ children, onAuthStatusChange }) {
  const navigation = useNavigation();

  const { isAuthenticated } = useSelector(state => state.user);

  useEffect(() => {
    if (onAuthStatusChange) {
      onAuthStatusChange(isAuthenticated);
    }
  }, [isAuthenticated, onAuthStatusChange]);
  
  const handleLogin = () => {
    navigation.navigate('Login');
  };
  
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Ionicons name="heart-outline" size={56} color="#FF9E58" />
        </View>
        <Text style={styles.title}>Требуется авторизация</Text>
        <Text style={styles.text}>
          Войдите в аккаунт, чтобы просматривать и управлять избранными товарами
        </Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={handleLogin}
          activeOpacity={0.85}
        >
          <Ionicons name="log-in-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Войти в аккаунт</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return children;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#fff',
  },
  iconCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: '#FFF3E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#222',
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 21,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9E58',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#FF9E58',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default FavoriteAuth;
