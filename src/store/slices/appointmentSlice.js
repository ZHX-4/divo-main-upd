import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  data: [],
  loading: false,
  error: null,
};


export const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {

    fetchAppointmentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },


    fetchAppointmentsSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },


    fetchAppointmentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});


export const {
  fetchAppointmentsStart,
  fetchAppointmentsSuccess,
  fetchAppointmentsFailure,
} = appointmentSlice.actions;


export default appointmentSlice.reducer;
