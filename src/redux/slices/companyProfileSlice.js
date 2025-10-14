import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { COMPANY_PROFILE, COMPANY_POLICIES } from "../../utils/BASE_URL";

export const fetchCompanyById = createAsyncThunk(
  "companyProfile/fetchCompanyById",
  async (companyId, { rejectWithValue }) => {
    try {
      const res = await api.get(`${COMPANY_PROFILE}/${companyId}`);
      return res.data?.data || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchPoliciesByCompany = createAsyncThunk(
  "companyProfile/fetchPoliciesByCompany",
  async (companyId, { rejectWithValue }) => {
    try {
      const res = await api.get(`${COMPANY_POLICIES}/${companyId}`);
      return res.data?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const companyProfileSlice = createSlice({
  name: "companyProfile",
  initialState: {
    company: null,
    policies: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCompanyProfile: (state) => {
      state.company = null;
      state.policies = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload;
      })
      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPoliciesByCompany.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPoliciesByCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.policies = action.payload;
      })
      .addCase(fetchPoliciesByCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCompanyProfile } = companyProfileSlice.actions;
export default companyProfileSlice.reducer;
