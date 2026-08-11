import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; 
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    RefreshControl,
    ActivityIndicator,
    useWindowDimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../store/Product';
import { addToFavorites } from '../../store/Favorite';
import { checkIsAuth } from '../../store/AuthorizationCheck';


function Product() {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector(state => state.product);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const numColumns = 2;
    const gap = 15;
    const cardWidth = (width - 30 - gap * (numColumns - 1)) / numColumns;

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleFavoriteToggle = async (item) => {
        try { 
               
            const auth = await checkIsAuth();
            if (!auth.isAuthenticated) {
                Alert.alert('Внимание', 'Для добавления в избранное необходимо авторизоваться');
                return;
            }
            const productId = item.id;

            await dispatch(addToFavorites(productId));
            Alert.alert('Успешно', 'Товар добавлен в избранное');
        } catch (error) {
        
            Alert.alert('Ошибка', error.response?.data?.message || 'Не удалось добавить в избранное');
        }
    };
    
    const navigateToProduct = (productId) => {   
        navigation.navigate('ViewProduct', { productId });
    };
    const onRefresh = () => {
        setRefreshing(true);
        dispatch(fetchProducts()).finally(() => {
            setRefreshing(false);
        });
    };

    const renderProductCard = ({ item }) => (
        <TouchableOpacity 
          style={[styles.card, { width: cardWidth }]}
          onPress={() => navigateToProduct(item.id)}
        >
        
          <View style={styles.imageContainer}>
            {item.imageUrl ? (
              <Image 
                source={{ uri: item.imageUrl }} 
                style={styles.productImage}
                resizeMode="contain"
              />
            ) : (
              <View style={[styles.productImage, styles.placeholderImage]}>
                <Ionicons name="image" size={40} color="#ccc" />
              </View>
            )}
            
        
            <TouchableOpacity 
              style={styles.favoriteIcon}
            
              onPress={(e) => {
                e.stopPropagation(); 
                handleFavoriteToggle(item);
              }}
            >
              <Ionicons name="heart-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
      
          <View style={styles.textContainer}>
            <Text style={styles.productName} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.productPrice}>
              {parseInt(item.price)} ₽
            </Text>
          </View>
        </TouchableOpacity>
      );
    return (
        <View style={styles.container}>
            {loading && products.length === 0 ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#FF9E58" />
                    <Text style={styles.centerText}>Загрузка товаров...</Text>
                </View>
            ) : error && products.length === 0 ? (
                <View style={styles.center}>
                    <Text style={styles.errorTitle}>Не удалось загрузить товары</Text>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={() => dispatch(fetchProducts())}>
                        <Text style={styles.retryButtonText}>Повторить</Text>
                    </TouchableOpacity>
                </View>
            ) : products.length === 0 ? (
                <View style={styles.center}>
                    <Text style={styles.errorTitle}>Товаров пока нет</Text>
                    <Text style={styles.errorText}>Обновите список, потянув экран вниз</Text>
                </View>
            ) : (
                <FlatList
                    key={`grid-${numColumns}`}
                    data={products}
                    renderItem={renderProductCard}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={numColumns}
                    columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : null}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#FF9E58']}
                            tintColor="#FF9E58"
                        />
                    }
                    
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}


const styles = StyleSheet.create({
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
    errorTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 8,
    },
    errorText: {
        color: '#c00',
        textAlign: 'center',
        marginBottom: 16,
        fontSize: 13,
    },
    retryButton: {
        backgroundColor: '#FF9E58',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    listContent: {
      padding: 15,
      paddingBottom: 30,
    },
    columnWrapper: {
      justifyContent: 'space-between',
      marginBottom: 15,
    },
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
  
    productImage: {
        width: '100%',
        aspectRatio: 1,
      },
    imageContainer:{ 
        width:'100%',
       
    },
    placeholderImage: {
      backgroundColor: '#f0f0f0',
      justifyContent: 'center',
      alignItems: 'center',
    },
    favoriteIcon: {
      position: 'absolute',
      top: 10,
      right: 10,
      width: 32,
      height: 32,
      borderRadius: 16,
       
      backgroundColor: "black",
     
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    textContainer: {
      padding: 12,
    },
    productName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      marginBottom: 6,
      lineHeight: 20,
    },
    productPrice: {
      fontSize: 17,
      fontWeight: '700',
      color: '#FF9E58',
    },
  });
export default Product; 