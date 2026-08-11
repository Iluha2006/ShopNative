
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { API_URL } from '../config/api';

export const getTokenFromStore = async () => {
    try {
        const token = await SecureStore.getItemAsync('auth_token');
        return token;
    } catch (error) {
        console.error('Error getting token from SecureStore:', error);
        return null;
    }
};

export const getAuthHeaders = async () => {
    const token = await getTokenFromStore();
    
    if (!token) {
        throw new Error('Пользователь не авторизован');
    }
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
};


export const checkIsAuth = async () => {
    try {
        const token = await getTokenFromStore();
        return {
            isAuthenticated: !!token,
            token: token
        };
    } catch (error) {
        console.error('Auth check error:', error);
        return {
            isAuthenticated: false,
            token: null
        };
    }
};


export const checkIsAuthWithUser = async () => {
    try {
        const token = await getTokenFromStore();
        
        if (!token) {
            return {
                isAuthenticated: false,
                user: null,
                token: null
            };
        }
    
        const response = await axios.get(`${API_URL}/user`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        
        return {
            isAuthenticated: true,
            user: response.data.user,
            token: token
        };
    } catch (error) {
        
        return {
            isAuthenticated: false,
            user: null,
            token: null
        };
    }
};