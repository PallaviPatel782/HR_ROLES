import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SALARY_API } from "../../utils/BASE_URL";

export const fetchSalaryHistory = createAsyncThunk(
  "salary/fetchSalaryHistory",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const stored = await AsyncStorage.getItem("userInfo");
      const userInfo = stored ? JSON.parse(stored) : null;

      if (!userInfo?.id) {
        return rejectWithValue("User not found");
      }

      const finalUrl = `${SALARY_API}/${userInfo.id}?userId=${userInfo.id}&month=${month}&year=${year}`;
      console.log("Calling API with URL:", finalUrl);

      const res = await api.get(finalUrl);

      console.log("API Response:", res?.data);

      if (res?.data?.success && res?.data?.data?.length > 0) {
        return res.data.data;
      } else {
        return rejectWithValue(res.data?.message || "No salary records found for this month/year");
      }
    } catch (error) {
      console.log("API Error:", error?.response?.data || error.message);
      return rejectWithValue(error.message || "API Error");
    }
  }
);

const salarySlice = createSlice({
  name: "salary",
  initialState: {
    loading: false,
    salaryHistory: [],
    error: null,
  },
  reducers: {
    clearSalaryHistory: (state) => {
      state.salaryHistory = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalaryHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.salaryHistory = []; 
      })
      .addCase(fetchSalaryHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.salaryHistory = action.payload || [];
        state.error = null;
      })
      .addCase(fetchSalaryHistory.rejected, (state, action) => {
        state.loading = false;
        state.salaryHistory = []; 
        state.error = action.payload;
      });
  },
});

export const { clearSalaryHistory } = salarySlice.actions;
export default salarySlice.reducer;
