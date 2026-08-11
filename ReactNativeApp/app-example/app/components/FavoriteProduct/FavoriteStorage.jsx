import React, { useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  ActivityIndicator,
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

function formatPrice(price) {
  const num = parseInt(price, 10);
  return isNaN(num) ? 0 : num.toLocaleString('ru-RU');
}

function FavoriteStore() {  
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const numColumns = 2;
  const cardWidth = (width - PADDING * 2 - GAP) / numColumns;
  
  const { favorites, loading } = useSelector(state => state.favorite);
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
          },
        },
      ]
    );
  };

  const renderEmptyFavorites = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Ionicons name="heart-outline" size={56} color="#FF9E58" />
      </View>
      <Text style={styles.emptyTitle}>В избранном пока пусто</Text>
      <Text style={styles.emptyText}>
        Нажимайте на сердечко у товаров, чтобы сохранять их здесь и возвращаться к покупке
      </Text>
      <TouchableOpacity 
        style={styles.browseButton}
        onPress={() => navigation.navigate('Home')}
        activeOpacity={0.85}
      >
        <Ionicons 
          name="bag-handle-outline" 
          size={20} 
          color="#fff" 
          style={{ marginRight: 8 }} 
        />
        <Text style={styles.browseButtonText}>Перейти к товарам</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFavoriteCard = ({ item }) => {
    const product = item.product || item;
    const price = formatPrice(product.price);
  
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
            activeOpacity={0.8}
          >
            <Ionicons name="heart" size={15} color="#FF4444" />
          </TouchableOpacity>
        </View>
  
        <View style={styles.textContainer}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={styles.productPrice}>{price} ₽</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    if (loading && favorites.length === 0) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF9E58" />
          <Text style={styles.centerText}>Загрузка избранного...</Text>
        </View>
      );
    }

    if (favorites.length === 0) {
      return <View style={styles.center}>{renderEmptyFavorites()}</View>;
    }

    return (
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
    );
  };

  return( 
    <FavoriteAuth>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Избранное</Text>
            <Text style={styles.headerSubtitle}>
              Сохранённые товары в вашем списке желаний
            </Text>
          </View>
          {isAuthenticated && favorites.length > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{favorites.length}</Text>
            </View>
          )}
        </View>
        {renderContent()}
      </View>
    </FavoriteAuth>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  centerText: {
    marginTop: 10,
    color: '#888',
    fontSize: 14,
  },
  header: {
    paddingHorizontal: PADDING,
    paddingTop: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#222',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  countBadge: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 9,
    backgroundColor: '#FFF3E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FF9E58',
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
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
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
    borderRadius: 16,
    width: 30,
    height: 30,
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
  productPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FF9E58',
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
