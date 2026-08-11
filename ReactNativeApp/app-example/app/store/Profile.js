import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAuthHeaders } from './AuthorizationCheck';
import { API_URL } from '../config/api';



const ProfileSlice = createSlice({
    name: 'profile',
    initialState: {
        token:null,
        profile:null,
        loading: false,
        viewedProfile: null,
        error: null
    },

    reducers: {

        setLoading(state, action) {
            state.loading = action.payload;
        },
        setProfile(state, action) {
            state.profile = action.payload;
        },
        setViewedProfile(state, action) {
            state.viewedProfile = action.payload;
        },
        clearViewedProfile(state) {
            state.viewedProfile = null;
        },
        setError(state, action) {
            state.error = action.payload;
        },



    }
});
export const updateProfile = (data, userId) => async (dispatch, getState) => {
    try {
        dispatch(setLoading(true));
       
      
        const headers= await getAuthHeaders();


        const response = await axios.put(`${API_URL}/profile/update/${userId}`, data,{ 
           
            headers
            
        }) 


        if (response.data) {
            dispatch(setProfile(response.data));
        }

        return response.data;
    } catch (err) {
        dispatch(setError(err.response?.data?.message || 'Ошибка обновления профиля'));
        throw err;
    } finally {
        dispatch(setLoading(false));
    }
};



export const fetchProfile = (userId) => async (dispatch, getState) => {
    try {
        dispatch(setLoading(true));
      
        const header = await getAuthHeaders();
        const response = await axios.get(`${API_URL}/profile/${userId}`, {
            headers: header
        });

        const currentUserId = getState().user.user?.id;
        if (userId === currentUserId) {
            dispatch(setProfile(response.data));
        } else {
            dispatch(setViewedProfile(response.data));
        }

        return response.data;
    } catch (err) {

        dispatch(setError(err.response?.data?.message || 'Ошибка загрузки профиля'));
        throw err;
    } finally {
        dispatch(setLoading(false));
    }
};


export const {
 setAllProfiles,
 setLoading ,
 setError,
 setProfile,
 setViewedProfile,
 clearViewedProfile
} = ProfileSlice.actions;

export default ProfileSlice.reducer;