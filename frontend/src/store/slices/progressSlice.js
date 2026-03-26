import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchProgress = createAsyncThunk('progress/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/progress');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to fetch progress');
  }
});

export const fetchLeaderboard = createAsyncThunk('progress/leaderboard', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/progress/leaderboard');
    return data.leaderboard;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to fetch leaderboard');
  }
});

const progressSlice = createSlice({
  name: 'progress',
  initialState: {
    stats: null,
    byCategory: {},
    byLevel: {},
    recentActivity: [],
    leaderboard: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgress.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.byCategory = action.payload.byCategory;
        state.byLevel = action.payload.byLevel;
        state.recentActivity = action.payload.recentActivity;
      })
      .addCase(fetchProgress.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => { state.leaderboard = action.payload; });
  },
});

export default progressSlice.reducer;
