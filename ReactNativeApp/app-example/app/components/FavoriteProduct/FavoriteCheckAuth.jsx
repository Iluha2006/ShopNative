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
  

  const { isAuthenticated, loading } = useSelector(state => state.user);

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
      <View style={styles.authScreenContainer}>
        <View style={styles.authContainer}>
          <Ionicons name="log-in-outline" size={80} color="#FF9E58" style={{margin:"auto"}} />
          <Text style={styles.authTitle}>Требуется авторизация</Text>
          <Text style={styles.authText}>
            Войдите в аккаунт, чтобы просматривать избранные товары
          </Text>
          <TouchableOpacity 
            style={styles.authButton}
            onPress={handleLogin}
          >
            <Text style={styles.authButtonText}>Войти</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  return children;
}

const styles = StyleSheet.create({

  authScreenContainer:{ 
    marginTop:100, 
    paddingHorizontal: 20,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  authText: {
    fontSize: 16,
    color: '#777777',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  authButton: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: '#FF9E58',
    
    paddingVertical: 14, 
    margin:'auto',
    borderRadius: 12,
    shadowColor: '#FF9E58',
    
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
});

export default FavoriteAuth;