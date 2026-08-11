import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchProductById } from '../../store/Product';
import { addToFavorites } from '../../store/Favorite';
import { checkIsAuth } from '../../store/AuthorizationCheck';
import AddToCartButton from '../CartItems/CartButton';

function ViewProduct() {    
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const { productId } = route.params || {};
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { products, loading } = useSelector(state => state.product);
  const product = products.find(p => p.id === productId); 

  useEffect(() => {  
    if (productId && !product) {
      dispatch(fetchProductById(productId));
    }
  }, [productId, product, dispatch]);

  if (loading && !product) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9E58" />
        <Text style={styles.loadingText}>Загрузка товара...</Text>
      </View>
    );
  }

  if (!product && !loading) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Товар не найден</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Назад</Text>
        </TouchableOpacity>
      </View>
    );
  }


  const allImages = product.images_product && Array.isArray(product.images_product)
  ? product.images_product  
  : [product.imageUrl];

  const mainImage = allImages[selectedImageIndex] || product.imageUrl;

  const handleAddToFavorites = async () => {
    try {
      const auth = await checkIsAuth();
      if (!auth.isAuthenticated) {
        Alert.alert('Внимание', 'Для добавления в избранное необходимо авторизоваться');
        return;
      }
      await dispatch(addToFavorites(productId));
      Alert.alert('Успешно', 'Товар добавлен в избранное');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось добавить в избранное');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <Image 
        source={{ uri: mainImage }} 
        style={styles.productImage}
        resizeMode="contain"
      />

      {allImages.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnailsContainer}>
          {allImages.map((img, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedImageIndex(index)}
              style={[
                styles.thumbnail,
                selectedImageIndex === index && styles.selectedThumbnail
              ]}
            >
              <Image source={{ uri: img }} style={styles.thumbnailImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <View style={styles.content}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.price}>{parseInt(product.price)} ₽</Text>

        {product.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Описание</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
        )}
        {product.size && product.size.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Доступные размеры</Text>
            <View style={styles.sizeContainer}>
              {product.size.map((size, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedSize(size)}
                  style={[
                    styles.sizeItem,
                    selectedSize === size && styles.selectedSize
                  ]}
                >
                  <Text style={styles.sizeText}>{size}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {product.quantity !== undefined && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>В наличии</Text>
            <Text style={styles.quantity}>{product.quantity} шт.</Text>
          </View>
        )}

        <View style={styles.actionButtons}>
          <AddToCartButton 
            productId={productId}
            size={selectedSize}
            selectedImage={allImages[selectedImageIndex]}
            style={{ flex: 1 }}
          />
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={handleAddToFavorites}
          >
            <Ionicons name="heart" size={20} color="#FF4444" />
            <Text style={styles.favoriteButtonText}>В избранное</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backIcon: {
    position: 'absolute',
    top: 40,
    left: 15,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 250,
  },
  thumbnailsContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 6,
  },
  selectedThumbnail: {
    borderColor: '#FF9E58',
    borderWidth: 2,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  content: {
    padding: 20,
  },
 
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  selectedSize: {
    backgroundColor: '#FF9E58',
    borderColor: '#FF9E58',
  },
  sizeText: {
    fontSize: 14,
    color: '#333',
  },
  
  selectedSizeText: {
    color: '#fff',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#FF9E58',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
 


 
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF9E58',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  sizeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sizeItem: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 10,
    marginBottom: 10,
  },
 
  quantity: {
    fontSize: 16,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 30,
    gap: 10,
  },
  cartButton: {
    flex: 1,
    backgroundColor: '#FF9E58',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8,
  },
  cartButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  favoriteButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8,
  },
  favoriteButtonText: {
    color: '#FF4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ViewProduct;