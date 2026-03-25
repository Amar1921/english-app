import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchLessons = createAsyncThunk('lessons/fetch', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/lessons', { params });
    return data.lessons;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to fetch lessons');
  }
});

export const fetchLesson = createAsyncThunk('lessons/fetchOne', async (slug, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/lessons/${slug}`);
    return data.lesson;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Lesson not found');
  }
});

const lessonsSlice = createSlice({
  name: 'lessons',
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrent(state) { state.current = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLessons.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchLessons.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchLessons.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchLesson.pending, (state) => { state.loading = true; state.current = null; })
      .addCase(fetchLesson.fulfilled, (state, action) => { state.loading = false; state.current = action.payload; })
      .addCase(fetchLesson.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearCurrent } = lessonsSlice.actions;
export default lessonsSlice.reducer;
