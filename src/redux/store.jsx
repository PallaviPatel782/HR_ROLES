import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import loginReducer from './slices/LoginSlice';
import AttendanceReducer from './slices/attendanceSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    auth_credencials: loginReducer,
    attendance: AttendanceReducer
  },
});

export default store;