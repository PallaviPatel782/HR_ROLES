import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    TraceId: null,
    ResultIndex: null
};

const authSlice = createSlice({
    name: 'flightStore',
    initialState,
    reducers: {
        setTraceId: (state, action) => {
            state.TraceId = action.payload;
        },
        setResultIndex: (state, action) => {
            state.ResultIndex = action.payload;
        },
    },
});

export const { setTraceId, setResultIndex } = authSlice.actions;
export default authSlice.reducer;
