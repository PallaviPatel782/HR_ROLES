import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { GET_ALL_NOTIFICATION, MARK_AS_READ } from "../../utils/BASE_URL";

export const fetchAllNotifications = createAsyncThunk(
  "notification/fetchAllNotifications",
  async (employeeId, { rejectWithValue }) => {
    try {
      if (!employeeId) throw new Error("Employee ID is missing");

      console.log("FETCHING NOTIFICATIONS FOR EMPLOYEE:", employeeId);

      const url = `${GET_ALL_NOTIFICATION}/${employeeId}`;
      console.log("API URL:", url);

      const res = await api.get(url);

      console.log("API RESPONSE (NOTIFICATIONS):", res.data);

      return res.data?.data || [];
    } catch (err) {
      console.log("ERROR FETCHING NOTIFICATIONS:", err);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const markAsRead = createAsyncThunk(
  "notification/markAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      console.log("MARKING NOTIFICATION AS READ:", notificationId);

      const res = await api.patch(MARK_AS_READ, { notificationId });

      console.log("MARK AS READ RESPONSE:", res.data);

      return { notificationId };
    } catch (err) {
      console.log("ERROR MARKING AS READ:", err);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("FETCHING NOTIFICATIONS...");
      })

      .addCase(fetchAllNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;

        console.log("FETCH SUCCESS — Notifications Stored in Redux:");
        console.log(action.payload);
      })

      .addCase(fetchAllNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load notifications";

        console.log("FETCH FAILED:", action.payload);
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        console.log("UPDATING READ STATUS IN REDUX FOR ID:", action.payload.notificationId);

        state.notifications = state.notifications.map((item) =>
          item._id === action.payload.notificationId
            ? { ...item, read: true }
            : item
        );

        console.log("UPDATED NOTIFICATIONS LIST:", state.notifications);
      });
  },
});

export default notificationSlice.reducer;
