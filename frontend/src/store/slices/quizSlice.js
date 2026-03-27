// ─── quizSlice.js — version complète avec gestion levelUp ────────────────────
//
// Ajoute `levelUp` dans le state et le récupère depuis submitAnswer.
// Merges dans ton slice existant ou remplace-le entièrement.

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchQuestions = createAsyncThunk(
    'quiz/fetchQuestions',
    async (filters, { rejectWithValue }) => {
      try {
        const params = { limit: filters.limit };
        if (filters.level)    params.level    = filters.level;
        if (filters.category) params.category = filters.category;
        const { data } = await api.get('/quiz', { params });
        return data.questions;
      } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to fetch questions');
      }
    }
);

export const submitAnswer = createAsyncThunk(
    'quiz/submitAnswer',
    async ({ questionId, userAnswer }, { rejectWithValue }) => {
      try {
        const { data } = await api.post('/quiz/submit', { questionId, userAnswer });
        return { questionId, ...data };
        // data = { isCorrect, score, correctAnswer, explanation, levelUp }
      } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to submit answer');
      }
    }
);

const quizSlice = createSlice({
  name: 'quiz',
  initialState: {
    questions:       [],
    currentIndex:    0,
    answers:         {},   // { [questionId]: { isCorrect, score, correctAnswer, explanation } }
    sessionComplete: false,
    filters: {
      level:    'A1',
      category: '',
      limit:    10,
    },
    loading:    false,
    submitting: false,
    error:      null,
    // ── NEW ──
    levelUp: null,  // null | { from: 'A1', to: 'A2' } — remis à null au reset
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    nextQuestion: (state, action) => {
      const forceComplete = action.payload?.forceComplete;
      if (forceComplete || state.currentIndex >= state.questions.length - 1) {
        state.sessionComplete = true;
      } else {
        state.currentIndex += 1;
      }
    },
    resetSession: (state) => {
      state.questions       = [];
      state.currentIndex    = 0;
      state.answers         = {};
      state.sessionComplete = false;
      state.error           = null;
      state.levelUp         = null;  // ← reset aussi levelUp
    },
    clearLevelUp: (state) => {
      state.levelUp = null;
    },
  },
  extraReducers: (builder) => {
    builder
        // fetchQuestions
        .addCase(fetchQuestions.pending, (state) => {
          state.loading    = true;
          state.error      = null;
          state.levelUp    = null;
        })
        .addCase(fetchQuestions.fulfilled, (state, action) => {
          state.loading         = false;
          state.questions       = action.payload;
          state.currentIndex    = 0;
          state.answers         = {};
          state.sessionComplete = false;
        })
        .addCase(fetchQuestions.rejected, (state, action) => {
          state.loading = false;
          state.error   = action.payload;
        })

        // submitAnswer
        .addCase(submitAnswer.pending, (state) => {
          state.submitting = true;
          state.error      = null;
        })
        .addCase(submitAnswer.fulfilled, (state, action) => {
          state.submitting = false;
          const { questionId, isCorrect, score, correctAnswer, explanation, levelUp } = action.payload;

          // Stocker la réponse
          state.answers[questionId] = { isCorrect, score, correctAnswer, explanation };

          // Stocker levelUp si le serveur signale une montée de niveau
          if (levelUp) {
            state.levelUp = levelUp; // { from, to }
          }

          // Auto-compléter si c'était la dernière question
          const allAnswered = Object.keys(state.answers).length === state.questions.length;
          if (allAnswered) {
            state.sessionComplete = true;
          }
        })
        .addCase(submitAnswer.rejected, (state, action) => {
          state.submitting = false;
          state.error      = action.payload;
        });
  },
});

export const { setFilters, nextQuestion, resetSession, clearLevelUp } = quizSlice.actions;
export default quizSlice.reducer;