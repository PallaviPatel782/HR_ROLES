import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import loginReducer from './slices/LoginSlice';
import AttendanceReducer from './slices/attendanceSlice';
import salaryReducer from './slices/salarySlice';
import profileReducer from './slices/profileSlice';
import CompanyReducer from './slices/companyProfileSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    auth_credencials: loginReducer,
    attendance: AttendanceReducer,
    salary: salaryReducer,
     profile: profileReducer,
     companyProfile:CompanyReducer,
  },
});

export default store;