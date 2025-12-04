import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SALARY_API, GET_DEPARTMENT, GET_DESIGNATION } from "../../utils/BASE_URL";

export const fetchSalaryHistory = createAsyncThunk(
  "salary/fetchSalaryHistory",
  async ({ month, year } = {}, { rejectWithValue }) => {
    try {
      const stored = await AsyncStorage.getItem("userInfo");
      const userInfo = stored ? JSON.parse(stored) : null;

      if (!userInfo?.id) {
        return rejectWithValue("User not found");
      }

      const url = `${SALARY_API}/${userInfo.id}`;
      let params = {};

      if (month) params.month = month;
      if (year) params.year = year;

      console.log("Calling Salary API:", url, "Params:", params);

      const res = await api.get(url, { params });

      if (res?.data?.success) {
        return res.data.data || [];
      } else {
        return rejectWithValue(res.data?.message || "No salary records found");
      }
    } catch (error) {
      console.log("Salary API Error:", error.response?.data || error.message);
      return rejectWithValue(error.message);
    }
  }
);



export const fetchSalaryMeta = createAsyncThunk(
  "salary/fetchSalaryMeta",
  async (_, { rejectWithValue }) => {
    try {
      const companyId = await AsyncStorage.getItem("companyId");
      if (!companyId) return rejectWithValue("Company ID missing");
      const deptRes = await api.get(`${GET_DEPARTMENT}/${companyId}`);
      console.log("Department API Response:", JSON.stringify(deptRes.data, null, 2));
      const desigRes = await api.get(`${GET_DESIGNATION}/${companyId}`);
      console.log("Designation API Response:", JSON.stringify(desigRes.data, null, 2));

      return {
        departmentsList: deptRes.data?.response || [],
        designationsList: desigRes.data?.response || [],
      };
    } catch (error) {
      console.log("Meta API Error:", error.response?.data || error.message);
      return rejectWithValue(error.message);
    }
  }
);

const salarySlice = createSlice({
  name: "salary",
  initialState: {
    loading: false,
    salaryHistory: [],
    error: null,
    departmentsList: [],
    designationsList: [],
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
      })
      .addCase(fetchSalaryHistory.rejected, (state, action) => {
        state.loading = false;
        state.salaryHistory = [];
        state.error = action.payload;
      })
      .addCase(fetchSalaryMeta.fulfilled, (state, action) => {
        state.departmentsList = action.payload.departmentsList;
        state.designationsList = action.payload.designationsList;
      })
      .addCase(fetchSalaryMeta.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearSalaryHistory } = salarySlice.actions;
export default salarySlice.reducer;
