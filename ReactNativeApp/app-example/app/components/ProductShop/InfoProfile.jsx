import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image,
  TouchableOpacity, 
  ScrollView,
  Alert,

} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';

import { fetchProfile } from '../../store/Profile';
import { logout } from '../../store/Auth';
import { checkIsAuthWithUser } from '../../store/AuthorizationCheck';

export default function InfoProfile({ navigation }) {
  const dispatch = useDispatch();
  const { profile } = useSelector(state => state.profile);

  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [checkUser, setCheckingAuth] = useState(true);
  
  const navigat = useNavigation(); 

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      setCheckingAuth(true);
      
      const authResult = await checkIsAuthWithUser();
      
      setIsAuthenticated(authResult.isAuthenticated);
      setUser(authResult.user);
      
      if (authResult.isAuthenticated && authResult.user) {
        dispatch(fetchProfile());
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigateToLogin = () => {
    navigat.navigate("Login");
  };

  const navigateToRegister = () => {
    navigat.navigate("Register");
  };

  const navigateToFavorites = () => {
    if (isAuthenticated) {
      navigat.navigate("Favorite");
    } else {
      Alert.alert(
        "Требуется авторизация",
        "Войдите в аккаунт для просмотра избранного",
        [
          { text: "Отмена", style: "cancel" },
          { text: "Войти", onPress: navigateToLogin }
        ]
      );
    }
  };



  const userData = user || {};
  const profileData = profile || {};
  const displayName = profileData.name || userData.name ;


  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {isAuthenticated ? (
        <View>
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
             
               <Ionicons name='person'  size={65} style={{color:'white'}} />
                
              </View>
              <TouchableOpacity style={styles.avatarOverlay}>
                <Ionicons name="camera" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.greeting}>{displayName}!</Text>
           
          </View>

          <View style={styles.infoCard}>
            <TouchableOpacity style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="person" size={24} color="#FF9E58" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Личные данные</Text>
                <Text style={styles.infoText}>Изменить информацию профиля</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.infoItem}
              onPress={navigateToFavorites}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="heart" size={24} color="#FF9E58" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Избранное</Text>
                <Text style={styles.infoText}>Просмотреть сохраненные товары</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.infoItem}
              onPress={() => navigat.navigate('Orders')}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="cart" size={24} color="#FF9E58" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>История заказов</Text>
                <Text style={styles.infoText}>Ваши предыдущие покупки</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </View>

          <View style={styles.actionSection}>
           
             
              

            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out" size={20} color="#fff" />
              <Text style={styles.logoutButtonText}>Выйти</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={50} color="#FF9E58" />
              </View>
            </View>
            
            <Text style={styles.greeting}>Добро пожаловать!</Text>
            <Text style={styles.subtitle}>Войдите или зарегистрируйтесь</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="heart" size={24} color="#FF9E58" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Избранное</Text>
                <Text style={styles.infoText}>Сохраняйте любимые товары</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="cart" size={24} color="#FF9E58" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>История заказов</Text>
                <Text style={styles.infoText}>Следите за вашими покупками</Text>
              </View>
            </View>
          </View>

          <View style={styles.authSection}>
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={navigateToLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>Войти в аккаунт</Text>
              <Ionicons name="log-in" size={20} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.registerButton}
              onPress={navigateToRegister}
              activeOpacity={0.8}
            >
              <Text style={styles.registerButtonText}>Создать аккаунт</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    backgroundColor: '#FF9E58',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF9E58',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 158, 88, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 20,
  },
  authSection: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  actionSection: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  loginButton: {
    backgroundColor: '#FF9E58',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#FF9E58',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#FF9E58',
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#FF9E58',
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#FF9E58',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  editButtonText: {
    color: '#FF9E58',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9E58',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#F0F0F0',
  },
  benefitsCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    flex: 1,
  },
});