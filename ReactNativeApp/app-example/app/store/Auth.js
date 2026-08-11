// store/userSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { checkIsAuth, checkIsAuthWithUser } from './AuthorizationCheck';
import { API_URL, API_TIMEOUT } from '../config/api';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    token: null,
    loading: false,    
    error: null,
    isAuthenticated: false, 
    authChecked: false, 
  },
  reducers: {
    setUserLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setAuthData: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = !!action.payload.token;
    },
    setAuthChecked: (state, action) => {
      state.authChecked = action.payload;
    },
 
    setAuthStatus: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.token = action.payload.token;
      state.user = action.payload.user || null;
      state.authChecked = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.authChecked = true;
    },
  },
});

export const {
  setAuthData,
  setError,
  clearUser,
  setUserLoading,
  setAuthStatus,
  clearAuth,
  setAuthChecked,
} = userSlice.actions;


export const checkAuth = () => async (dispatch) => {
  try {
    dispatch(setUserLoading(true));
    
    const authResult = await checkIsAuthWithUser(); 
    
    dispatch(setAuthStatus({
      isAuthenticated: authResult.isAuthenticated,
      token: authResult.token,
      user: authResult.user
    }));
    
    return authResult;
  } catch (error) {
    console.error('Auth check error in Redux:', error);
    dispatch(clearAuth());
    return {
      isAuthenticated: false,
      token: null,
      user: null
    };
  } finally {
    dispatch(setUserLoading(false));
  }
};


export const checkAuthQuick = () => async (dispatch) => {
  try {
    const authResult = await checkIsAuth(); 
    
    dispatch(setAuthStatus({
      isAuthenticated: authResult.isAuthenticated,
      token: authResult.token,
      user: null 
    }));
    
    return authResult;
  } catch (error) {
    dispatch(clearAuth());
    return {
      isAuthenticated: false,
      token: null,
      user: null
    };
  }
};



export const login = (credentials) => async (dispatch) => {
  try {
    dispatch(setUserLoading(true));
    dispatch(setError(null)); 
    
    const response = await axios.post(`${API_URL}/auth/login`, credentials, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: API_TIMEOUT,
    });
    
    console.log('Server response:', response.data);
   
    if (response.data.success) {
      const { user, token } = response.data;
      
      await SecureStore.setItemAsync('auth_token', token);
      await SecureStore.setItemAsync('user_data', JSON.stringify(user));
      
      dispatch(setAuthStatus({
        isAuthenticated: true,
        token: token,
        user: user
      }));
      
      return {
        success: true,
        user: user,
        token: token,
        message: response.data.message
      };
    } 
    
  } catch (error) {
    console.log("Ошибка входа", error);

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return {
        success: false,
        message: 'Сервер не отвечает. Проверьте, что сервер запущен, и повторите попытку'
      };
    }

    if (error.response) {
      return {
        success: false,
        errors: error.response.data.errors,
        message: error.response.data.message || 'Ошибка валидации'
      };
    }

    return {
      success: false,
      message: 'Не удалось подключиться к серверу. Проверьте соединение'
    };
  } finally {
    dispatch(setUserLoading(false));
  }
};

export const register = (userData) => async (dispatch) => {
  try {
    dispatch(setUserLoading(true));
    dispatch(setError(null));
    
    const response = await axios.post(`${API_URL}/auth/register`, userData, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json', 
      },
      timeout: API_TIMEOUT,
    });

    await SecureStore.setItemAsync('auth_token', response.data.token);
    await SecureStore.setItemAsync('user_data', JSON.stringify(response.data.user));
    
  
    dispatch(setAuthStatus({
      isAuthenticated: true,
      token: response.data.token,
      user: response.data.user
    }));

    return response.data;
  } catch (error) {
    console.error('Register error:', error);
    
    const errorData = error.response?.data || {};
    dispatch(setError(errorData.message || 'Ошибка регистрации'));
    throw {
      message: errorData.message || 'Неизвестная ошибка',
      errors: errorData.errors || {}
    };
  } finally {
    dispatch(setUserLoading(false));
  }
};

export const logout = () => async (dispatch) => {
  try {
    dispatch(setUserLoading(true));
  
    const token = await SecureStore.getItemAsync('auth_token');
    
    if (token) {
      await axios.post(`${API_URL}/auth/logout`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        timeout: API_TIMEOUT,
      });
    }

    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('user_data');
    
    dispatch(clearAuth());
    
    return true;
  } catch (err) {
    
    
    
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('user_data');
    dispatch(clearAuth());
    
    return false;
  } finally {
    dispatch(setUserLoading(false));
  }
};




export default userSlice.reducer;