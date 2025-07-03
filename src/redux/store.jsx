import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import FlightData from './slices/FlightStore';
import loginReducer from './slices/LoginSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    flightStore: FlightData,
    auth_credencials:loginReducer
  },
});

export default store;