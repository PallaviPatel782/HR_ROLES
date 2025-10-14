import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { GET_USER_PROFILE } from "../../utils/BASE_URL";

export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error("User ID is missing for fetchUserProfile");
      const url = `${GET_USER_PROFILE}/${userId}`;
      const res = await api.get(url);
      console.log("fetching profile data", res.data?.response);
      return res.data?.response || {};
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    userInfo: null,
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    clearProfile: (state) => {
      state.userInfo = null;
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { setUserInfo, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
