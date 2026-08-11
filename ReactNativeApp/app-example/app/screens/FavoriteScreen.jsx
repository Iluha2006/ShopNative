import { View, StyleSheet } from 'react-native';
import FavoriteStore from '../components/FavoriteProduct/FavoriteStorage';


function FavoriteProduct() {
    return (
        <View style={styles.container}>
            <FavoriteStore/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default FavoriteProduct;