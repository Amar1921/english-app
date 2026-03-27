import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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

export const markLessonComplete = createAsyncThunk(
    'progress/markLessonComplete',
    async ({ lessonId, xpReward }, { rejectWithValue }) => {
      try {
        const { data } = await api.patch(`/progress/${lessonId}`, {
          status: 'COMPLETED',
          xpEarned: xpReward,
        });
        return data; // { lessonId, status, xpEarned, completedAt, userXp?, userLevel? }
      } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to update lesson progress');
      }
    }
);

const progressSlice = createSlice({
  name: 'progress',
  initialState: {
    stats: null,
    byCategory: {},
    byLevel: {},
    recentActivity: [],
    leaderboard: [],
    lessonProgress: [], // { lessonId, status, xpEarned, completedAt }
    loading: false,
    validating: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
        // ── fetchProgress ──────────────────────────────────────────────────────
        .addCase(fetchProgress.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchProgress.fulfilled, (state, action) => {
          state.loading = false;
          state.stats          = action.payload.stats;
          state.byCategory     = action.payload.byCategory;
          state.byLevel        = action.payload.byLevel;
          state.recentActivity = action.payload.recentActivity;
          state.lessonProgress = action.payload.lessons?.items ?? [];
        })
        .addCase(fetchProgress.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        // ── fetchLeaderboard ───────────────────────────────────────────────────
        .addCase(fetchLeaderboard.fulfilled, (state, action) => {
          state.leaderboard = action.payload;
        })

        // ── markLessonComplete ─────────────────────────────────────────────────
        .addCase(markLessonComplete.pending, (state) => {
          state.validating = true;
          state.error = null;
        })
        .addCase(markLessonComplete.fulfilled, (state, action) => {
          state.validating = false;
          const payload = action.payload;
          // Upsert dans lessonProgress
          const idx = state.lessonProgress.findIndex((p) => p.lessonId === payload.lessonId);
          if (idx >= 0) {
            state.lessonProgress[idx] = { ...state.lessonProgress[idx], ...payload };
          } else {
            state.lessonProgress.push(payload);
          }
        })
        .addCase(markLessonComplete.rejected, (state, action) => {
          state.validating = false;
          state.error = action.payload;
        });
  },
});

export default progressSlice.reducer;