import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchQuestions = createAsyncThunk('quiz/fetchQuestions', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/quiz', { params });
    return data.questions;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to fetch questions');
  }
});

export const submitAnswer = createAsyncThunk('quiz/submitAnswer', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/quiz/submit', payload);
    return { ...data, questionId: payload.questionId };
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to submit answer');
  }
});

const quizSlice = createSlice({
  name: 'quiz',
  initialState: {
    questions: [],
    currentIndex: 0,
    answers: {},       // questionId -> { userAnswer, isCorrect, score, correctAnswer, explanation }
    loading: false,
    submitting: false,
    error: null,
    sessionComplete: false,
    filters: { level: 'A1', category: '', limit: 10 },
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    nextQuestion(state) {
      if (state.currentIndex < state.questions.length - 1) {
        state.currentIndex += 1;
      } else {
        state.sessionComplete = true;
      }
    },
    resetSession(state) {
      state.questions = [];
      state.currentIndex = 0;
      state.answers = {};
      state.sessionComplete = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => { state.loading = true; state.error = null; state.sessionComplete = false; state.currentIndex = 0; state.answers = {}; })
      .addCase(fetchQuestions.fulfilled, (state, action) => { state.loading = false; state.questions = action.payload; })
      .addCase(fetchQuestions.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(submitAnswer.pending, (state) => { state.submitting = true; })
      .addCase(submitAnswer.fulfilled, (state, action) => {
        state.submitting = false;
        state.answers[action.payload.questionId] = action.payload;
      })
      .addCase(submitAnswer.rejected, (state, action) => { state.submitting = false; state.error = action.payload; });
  },
});

export const { setFilters, nextQuestion, resetSession } = quizSlice.actions;
export default quizSlice.reducer;
