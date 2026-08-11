
import { configureStore } from '@reduxjs/toolkit';
import productReducer from './Product'; 
import favoriteReducer from './Favorite'
import cartReducer from './Cart'
import userReducer from './Auth';
import profileReducer from './Profile'
import paymentReducer from './Payment';
export const store = configureStore({
  reducer: {
    cart:cartReducer,
    product: productReducer, 
    payment: paymentReducer,
    favorite: favoriteReducer, 
    user: userReducer,
    profile:profileReducer
  },
});