import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAuthHeaders } from './AuthorizationCheck';
import { API_URL } from '../config/api';

const initialState = {
  loading: false,
  error: null,
  currentPayment: null,      
  paymentHistory: [],        
};

const PaymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPaymentLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPaymentError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearPaymentError: (state) => {
      state.error = null;
    },
    setCurrentPayment: (state, action) => {
      state.currentPayment = action.payload;
      state.loading = false;
      state.error = null;
    },

    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    },
  },
});

export const {
  setPaymentLoading,
  setPaymentError,
  clearPaymentError,
  setCurrentPayment,

  clearCurrentPayment,
} = PaymentSlice.actions;


export const createPayment = (product_id, quantity, size) => async (dispatch) => {
  try {
    dispatch(setPaymentLoading(true));
    dispatch(clearPaymentError());
    const headers = await getAuthHeaders();
    const response = await axios.post(
      `${API_URL}/payment/create`,
      { product_id, quantity, size },
      { headers }
    );

    dispatch(setCurrentPayment(response.data));
    return response.data;
  } catch (err) {
    const message = err.response?.data?.error || 'Ошибка создания платежа';
    dispatch(setPaymentError(message));
    throw err;
  }
};

export default PaymentSlice.reducer;