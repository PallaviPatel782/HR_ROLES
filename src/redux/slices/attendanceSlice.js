import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ATTENDANCE_RECORD, PUNCH_IN_API, PUNCH_Out_API, ATTENDANCES_API_DATA } from '../../utils/BASE_URL';

export const fetchTodayPunch = createAsyncThunk(
  'attendance/fetchTodayPunch',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };

      const res = await axios.get(ATTENDANCE_RECORD, { headers });
      console.log("FetchTodayPunch Response:", res.data);

      const timestamps = res.data?.data?.timestamps || [];
      if (timestamps.length > 0) {
        const today = new Date().toISOString().split("T")[0]; 
        const todayRecord = timestamps.find(
          (t) => t.date.startsWith(today) 
        );

        if (todayRecord) {
          return {
            punchIn: todayRecord.punchIn || null,
            punchOut: todayRecord.punchOut || null,
          };
        }
      }
      return { punchIn: null, punchOut: null };
    } catch (err) {
      console.error("Fetch Punch Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchAttendanceHistory = createAsyncThunk(
  'attendance/fetchAttendanceHistory',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };

      const res = await axios.get(ATTENDANCES_API_DATA, { headers });
      console.log("Attendance History Response:", res.data);

      return res.data?.data || [];
    } catch (err) {
      console.error("Attendance History Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


export const punchIn = createAsyncThunk(
  'attendance/punchIn',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const res = await axios.post(PUNCH_IN_API, {}, { headers: { Authorization: `Bearer ${token}` } });
      console.log(" PunchIn Response:", res.data);
      return res.data;
    } catch (err) {
      console.error(" PunchIn Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


export const punchOut = createAsyncThunk(
  'attendance/punchOut',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const res = await axios.post(PUNCH_Out_API, {}, { headers: { Authorization: `Bearer ${token}` } });
      console.log(" PunchOut Response:", res.data);
      return res.data;
    } catch (err) {
      console.error(" PunchOut Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    punchInTime: null,
    punchOutTime: null,
    history: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Today Punch
      .addCase(fetchTodayPunch.fulfilled, (state, action) => {
        state.punchInTime = action.payload?.punchIn || null;
        state.punchOutTime = action.payload?.punchOut || null;
      })

      // Full Attendance History
      .addCase(fetchAttendanceHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchAttendanceHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(punchIn.fulfilled, (state, action) => {
        state.punchInTime = action.payload?.punchIn || null;
      })

      .addCase(punchOut.fulfilled, (state, action) => {
        state.punchOutTime = action.payload?.punchOut || null;
      })
  },
});

export default attendanceSlice.reducer;
