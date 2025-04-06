import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  user: null,
  isAuthenticated: false,
};


export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {

    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },


    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },


    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});


export const {
  login,
  logout,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;
