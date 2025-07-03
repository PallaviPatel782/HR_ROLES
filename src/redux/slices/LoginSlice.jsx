import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth_credencials',
  initialState: {
    token: null,
    user: null,
  },
  reducers: {
    setAuthToken: (state, action) => {
      state.token = action.payload;
    },
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setAuthToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;
