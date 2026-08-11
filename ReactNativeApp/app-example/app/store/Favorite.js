import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { 
    getAuthHeaders, 
    
} from './AuthorizationCheck';
import { API_URL } from '../config/api';

const FavoriteSlice = createSlice({
    name: 'favorite',
    initialState: {
        favorites: [],
        loading: false,
        error: null,
    },
    reducers: {
        setFavorites(state, action) {
            state.favorites = action.payload;
        },
        addFavorite(state, action) {
            const existingIndex = state.favorites.findIndex(
                fav => fav.product_id === action.payload.product_id
            );
            if (existingIndex === -1) {
                state.favorites.push(action.payload);
            }
        },
        removeFavorite(state, action) {
            state.favorites = state.favorites.filter(
                fav => fav.product_id !== action.payload
            );
        },
        clearFavorites(state) {
            state.favorites = [];
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        clearError(state) {
            state.error = null;
        }
    }
});


export const fetchFavorites = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());
        
        const headers = await getAuthHeaders();
    
        const response = await axios.get(`${API_URL}/favorites`, { headers });
        dispatch(setFavorites(response.data.favorites));
        dispatch(setLoading(false));
    } catch (err) {
        dispatch(setError(err.response?.data?.message || 'Failed to load favorites'));
        dispatch(setLoading(false));
    }
};

export const addToFavorites = (productId) => async (dispatch, getState) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());
        
        const headers = await getAuthHeaders();
        
      
        const response = await axios.post(`${API_URL}/favorites/add`, {
            product_id: productId
        }, {
           headers        
        });

        
        
        dispatch(addFavorite(response.data.favorite));
        dispatch(setLoading(false));
        return response.data;
    } catch (err) {
        
        dispatch(setError(err.response?.data?.message ));
        dispatch(setLoading(false));
        throw err;
    }
};


export const removeFromFavorites = (productId) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());
        

        const headers = await getAuthHeaders();

        await axios.delete(`${API_URL}/favorites/${productId}`, { headers });
        
        dispatch(removeFavorite(productId));
        dispatch(setLoading(false));
    } catch (err) {
        dispatch(setError(err.response?.data?.message || 'Failed to remove from favorites'));
        dispatch(setLoading(false));
        throw err;
    }
};


export const checkIsFavorite = (productId) => async (dispatch) => {
    try {
        const response = await axios.get(`${API_URL}/favorites/check/${productId}`);
        return response.data.is_favorite;
    } catch (err) {
        console.error('Failed to check favorite:', err);
        return false;
    }
};

export const {
    setFavorites,
    addFavorite,
    removeFavorite,
    clearFavorites,
    setLoading,
    setError,
    clearError
} = FavoriteSlice.actions;

export default FavoriteSlice.reducer;