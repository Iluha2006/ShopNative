import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL, API_TIMEOUT } from '../config/api';

const ProductSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
      
        loading: false,
        error: null,
    },
    reducers: {
        setProducts(state, action) {
            state.products = action.payload;
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
        addProduct(state, action) {
            state.products.unshift(action.payload);
        },
        updateProduct(state, action) {
            const index = state.products.findIndex(p => p.id === action.payload.id);
            if (index !== -1) {
                state.products[index] = action.payload;
            }
        },
        deleteProduct(state, action) {
            state.products = state.products.filter(p => p.id !== action.payload);
        }
    }
});


export const fetchProducts = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());
        
        const response = await axios.get(`${API_URL}/products`, { timeout: API_TIMEOUT });
        
        dispatch(setProducts(response.data));
        dispatch(setLoading(false));
    } catch (err) {
        dispatch(setError(err.response?.data?.message || err.message || 'Неизвестная ошибка'));
        dispatch(setLoading(false));
    }
};


export const fetchProductById = (id) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());
        
        const response = await axios.get(`${API_URL}/products/${id}`);
        
        dispatch(setProducts(response.data));
        dispatch(setLoading(false));
    } catch (err) {
        dispatch(setError(err.response?.data?.message ));
        dispatch(setLoading(false));
    }
};


export const createProduct = (productData) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());
        
        const response = await axios.post(`${API_URL}/products`, productData);
        
        dispatch(addProduct(response.data));
        dispatch(setLoading(false));
        return response.data;
    } catch (err) {
        dispatch(setError(err.response?.data?.message || 'Failed to create product'));
        dispatch(setLoading(false));
        throw err;
    }
};


export const updateProductById = (id, productData) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());
        
        const response = await axios.put(`${API_URL}/products/${id}`, productData);
        
        dispatch(updateProduct(response.data));
        dispatch(setLoading(false));
        return response.data;
    } catch (err) {
        dispatch(setError(err.response?.data?.message || 'Failed to update product'));
        dispatch(setLoading(false));
        throw err;
    }
};


export const deleteProductById = (id) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());
        
        await axios.delete(`${API_URL}/products/${id}`);
        
        dispatch(deleteProduct(id));
        dispatch(setLoading(false));
    } catch (err) {
        dispatch(setError(err.response?.data?.message || 'Failed to delete product'));
        dispatch(setLoading(false));
        throw err;
    }
};

export const {
    setImagesProd,
    setProducts,
    setLoading,
    setError,
    clearError,
    addProduct,
    updateProduct,
    deleteProduct
} = ProductSlice.actions;

export default ProductSlice.reducer;