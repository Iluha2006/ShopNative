import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAuthHeaders } from './AuthorizationCheck';
import { API_URL } from '../config/api';

const CartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: [],
        loading: false,
        error: null,
        total: 0,
    },
    reducers: {
        setCartItems(state, action) {
            state.cartItems = action.payload.items || action.payload;
            state.total = action.payload.total || 0;
        },
        addCartItem(state, action) {
            const existingIndex = state.cartItems.findIndex(
                item => item.product_id === action.payload.product_id
            );
            if (existingIndex !== -1) {
                state.cartItems[existingIndex].quantity += action.payload.quantity || 1;
                state.cartItems[existingIndex].size +=action.payload.size;
                state.cartItems[existingIndex].selected_image += action.payload.selected_image 
            } 
            else {
                state.cartItems.push(action.payload);
            }
        },
        updateCartItem(state, action) {
            const index = state.cartItems.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.cartItems[index] = action.payload;
            }
        },
        removeCartItem(state, action) {
            state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
        },
        clearCart(state) {
            state.cartItems = [];
            state.total = 0;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        clearError(state) {
            state.error = null;
        },
        updateTotal(state, action) {
            state.total = action.payload;
        }
    }
});


export const {
    setCartItems,
    addCartItem,
    updateCartItem,
    removeCartItem,
    clearCart,
    setLoading,
    setError,
    clearError,
    updateTotal
} = CartSlice.actions;



export const fetchCart = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());
        
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API_URL}/cart`, { headers });
        
        dispatch(setCartItems(response.data.data || []));
        dispatch(setLoading(false));
        return response.data;
    } catch (err) {
        dispatch(setError(err.response?.data?.message ));
        dispatch(setLoading(false));
        throw err;
    }
};


export const addToCart = (productId, size, selectedImage ) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());
        console.log('Sending to server:', {
            product_id: productId,
            size,
            selected_image: selectedImage,
            quantity: 1
          });
        const headers = await getAuthHeaders();
        const response = await axios.post(`${API_URL}/cart/add`, { 
            product_id: productId,
            quantity: 1,
            size:size,  
            selected_image: selectedImage,
        }, { headers });
         
        dispatch(addCartItem(response.data.data));
        dispatch(setLoading(false));
        return response.data;
    } catch (err) {
        dispatch(setError(err.response?.data?.message ));
        dispatch(setLoading(false));
        throw err;
    }
};


export const incrementCartItem = (cartItemId) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());
        
        const headers = await getAuthHeaders();
        const response = await axios.post(`${API_URL}/cart/increment/${cartItemId}`, {}, { headers });
        
        dispatch(updateCartItem(response.data.data));
        dispatch(setLoading(false));
        return response.data;
    } catch (err) {
        dispatch(setError(err.response?.data?.message ));
        dispatch(setLoading(false));
        throw err;
    }
};


export const decrementCartItem = (cartItemId) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());
        
        const headers = await getAuthHeaders();
        const response = await axios.post(`${API_URL}/cart/decrement/${cartItemId}`, {}, { headers });
        
        dispatch(updateCartItem(response.data.data));
        dispatch(setLoading(false));
        return response.data;
    } catch (err) {
        dispatch(setError(err.response?.data?.message ));
        dispatch(setLoading(false));
        throw err;
    }
};


export const deleteCartItem = (cartItemId) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());
        
        const headers = await getAuthHeaders();
        await axios.delete(`${API_URL}/cart/delete/${cartItemId}`, { headers });
        
        dispatch(removeCartItem(cartItemId));
        dispatch(setLoading(false));
        return { success: true };
    } catch (err) {
        dispatch(setError(err.response?.data?.message ));
        dispatch(setLoading(false));
        throw err;
    }
};


export const clearCartItems = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());
        
        const headers = await getAuthHeaders();
        await axios.delete(`${API_URL}/cart/clear`, { headers });
        
        dispatch(clearCart());
        dispatch(setLoading(false));
        return { success: true };
    } catch (err) {
        dispatch(setError(err.response?.data?.message ));
        dispatch(setLoading(false));
        throw err;
    }
};

export default CartSlice.reducer;