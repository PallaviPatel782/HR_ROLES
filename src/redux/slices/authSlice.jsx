// src/redux/slices/authSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tokenId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokenId: (state, action) => {
      state.tokenId = action.payload;
    },
    clearTokenId: (state) => {
      state.tokenId = null;
    },
  },
});

export const { setTokenId, clearTokenId } = authSlice.actions;
export default authSlice.reducer;
