import React, { useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchFavorites, 
  removeFromFavorites,

} from "../../store/Favorite";
import { checkAuth } from "../../store/Auth"; 
import FavoriteAuth from './FavoriteCheckAuth';

const GAP = 15;
const PADDING = 15;

function FavoriteStore() {  
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const numColumns = 2;
  const cardWidth = (width - PADDING * 2 - GAP) / numColumns;
  
  const { favorites } = useSelector(state => state.favorite);
  const { isAuthenticated } = useSelector(state => state.user);
  
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavorites());
    }
  }, [isAuthenticated, dispatch]);

  useFocusEffect(
    useCallback(() => {
      dispatch(checkAuth());
    }, [dispatch])
  );
  
  const handleRemoveFavorite = async (productId) => {
    if (!isAuthenticated) {
      Alert.alert('Ошибка', 'Требуется авторизация');
      return;
    }
    
    Alert.alert(
      'Удаление из избранного',
      'Вы уверены, что хотите удалить этот товар из избранного?',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            await dispatch(removeFromFavorites(productId));
            Alert.alert('Успешно', 'Товар удален из избранного');
          },
        },
      ]
    );
  };

  const renderEmptyFavorites = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Ionicons name="heart-outline" size={64} color="#FF9E58" />
      </View>
      <Text style={styles.emptyTitle}>
        {isAuthenticated ? 'В избранном пока пусто' : 'Требуется авторизация'}
      </Text>
      <Text style={styles.emptyText}>
        {isAuthenticated 
          ? 'Нажимайте на сердечко у товаров, чтобы сохранить их здесь'
          : 'Войдите в аккаунт, чтобы видеть избранные товары'
        }
      </Text>
      <TouchableOpacity 
        style={styles.browseButton}
        onPress={() => navigation.navigate(isAuthenticated ? 'Home' : 'Login')}
      >
        <Ionicons 
          name={isAuthenticated ? 'bag-handle-outline' : 'log-in-outline'} 
          size={20} 
          color="#fff" 
          style={{ marginRight: 8 }} 
        />
        <Text style={styles.browseButtonText}>
          {isAuthenticated ? 'Перейти к товарам' : 'Войти в аккаунт'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderFavoriteCard = ({ item }) => {
    const product = item.product || item;
  
    return (
      <TouchableOpacity
        style={[styles.card, { width: cardWidth }]}
        onPress={() => navigation.navigate('ViewProduct', { productId: product.id })}
        activeOpacity={0.85}
      >
        <View style={styles.imageContainer}>
          {product.imageUrl ? (
            <Image 
              source={{ uri: product.imageUrl }} 
              style={styles.productImage}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.productImage, styles.placeholderImage]}>
              <Ionicons name="image" size={40} color="#ccc" />
            </View>
          )}
        
          <TouchableOpacity 
            style={styles.removeIcon}
            onPress={(e) => {
              e.stopPropagation(); 
              handleRemoveFavorite(product.id);
            }}
          >
            <Ionicons name="heart" size={16} color="#FF4444" />
          </TouchableOpacity>
        </View>
  
        <View style={styles.textContainer}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.productPrice}>
              {product.price ? parseInt(product.price) : 0} ₽
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return( 
    <FavoriteAuth>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Избранное</Text>
          {isAuthenticated && favorites.length > 0 && (
            <Text style={styles.headerCount}>
              {favorites.length} {favorites.length === 1 ? 'товар' : 
                favorites.length > 1 && favorites.length < 5 ? 'товара' : 'товаров'}
            </Text>
          )}
        </View>
        
        {!isAuthenticated || favorites.length === 0 ? (
          <View style={styles.emptyWrapper}>
            {renderEmptyFavorites()}
          </View>
        ) : (
          <FlatList
            key={`fav-grid-${numColumns}`}
            data={favorites}
            renderItem={renderFavoriteCard}
            keyExtractor={(item, index) => (item?.product_id || item?.id || index).toString()}
            numColumns={numColumns}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </FavoriteAuth>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    paddingHorizontal: PADDING,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: '#F7F7F7',
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#222',
    letterSpacing: 0.3,
  },
  headerCount: {
    fontSize: 14,
    color: '#FF9E58',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: PADDING,
    paddingBottom: 30,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: GAP,
  },
  card: {
   
   
    backgroundColor:"#FFFFFF",
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    backgroundColor: '#F4F4F4',
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  textContainer: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    lineHeight: 18,
    minHeight: 36,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FF9E58',
  },

  emptyWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    maxWidth: 320,
  },
  emptyIcon: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FFF3E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 20,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9E58',
    paddingHorizontal: 26,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#FF9E58',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
export default FavoriteStore;
