// quizSlice.js — flow sessions complet
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../utils/api';

// ─── Thunks ───────────────────────────────────────────────────────────────────

/**
 * Crée une session de quiz côté serveur et récupère les questions.
 * Remplace l'ancien fetchQuestions qui appelait GET /quiz.
 */
export const fetchQuestions = createAsyncThunk(
    'quiz/fetchQuestions',
    async (filters, { rejectWithValue }) => {
      try {
        // Mode session : on a un lessonSlug → POST /quiz/sessions
        if (filters.lessonSlug) {
          const { data } = await api.post('/quiz/sessions', {
            lessonSlug: filters.lessonSlug,
            limit:      filters.limit || 10,
          });
          // data = { session: { id, lessonSlug, maxScore, ... }, questions: [] }
          return { questions: data.questions, sessionId: data.session.id };
        }

        // Mode entraînement libre (sans lesson) : GET /quiz — pas de session créée
        const params = { limit: filters.limit || 10 };
        if (filters.level)    params.level    = filters.level;
        if (filters.category) params.category = filters.category;
        const { data } = await api.get('/quiz', { params });
        return { questions: data.questions, sessionId: null };
      } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to fetch questions');
      }
    }
);

/**
 * Soumet une réponse.
 * - Si une sessionId existe → POST /quiz/sessions/:id/answer (nouveau)
 * - Sinon → POST /quiz/submit (rétrocompat mode libre)
 */
export const submitAnswer = createAsyncThunk(
    'quiz/submitAnswer',
    async ({ questionId, userAnswer }, { getState, rejectWithValue }) => {
      try {
        const { sessionId } = getState().quiz;

        if (sessionId) {
          const { data } = await api.post(
              `/quiz/sessions/${sessionId}/answer`,
              { questionId, userAnswer }
          );
          // data = { isCorrect, score, correctAnswer, explanation }
          return { questionId, ...data, levelUp: null };
        }

        // Mode libre (rétrocompat)
        const { data } = await api.post('/quiz/submit', { questionId, userAnswer });
        return { questionId, ...data };
      } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to submit answer');
      }
    }
);

/**
 * Complète la session côté serveur.
 * Appelé automatiquement quand toutes les questions sont répondues,
 * ou manuellement via le bouton "Valider".
 * Ne fait rien si pas de sessionId (mode libre).
 */
export const completeSession = createAsyncThunk(
    'quiz/completeSession',
    async (_, { getState, rejectWithValue }) => {
      try {
        const { sessionId } = getState().quiz;
        if (!sessionId) return null;

        const { data } = await api.post(`/quiz/sessions/${sessionId}/complete`);
        // data = { score, maxScore, passed, xpAwarded, levelUp }
        return data;
      } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to complete session');
      }
    }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const quizSlice = createSlice({
  name: 'quiz',
  initialState: {
    questions:       [],
    currentIndex:    0,
    answers:         {},   // { [questionId]: { isCorrect, score, correctAnswer, explanation } }
    sessionComplete: false,
    sessionId:       null, // UUID de la session en cours (null = mode libre)
    sessionResult:   null, // { score, maxScore, passed, xpAwarded } reçu de /complete
    filters: {
      level:      'A1',
      category:   '',
      limit:      10,
      lessonSlug: null,   // null = mode libre, string = mode lesson
    },
    loading:    false,
    submitting: false,
    completing: false,    // true pendant l'appel /complete
    error:      null,
    levelUp:    null,     // null | { from, to }
  },

  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    /**
     * Avance à la question suivante.
     * Si forceComplete=true ou dernière question → déclenche la complétion.
     * La complétion réelle (appel API) est faite via le thunk completeSession,
     * déclenché depuis le composant via useEffect sur sessionComplete.
     */
    nextQuestion: (state, action) => {
      const forceComplete = action.payload?.forceComplete ?? false;
      const isLast = state.currentIndex >= state.questions.length - 1;

      if (forceComplete || isLast) {
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
      state.sessionId       = null;
      state.sessionResult   = null;
      state.error           = null;
      state.levelUp         = null;
      state.completing      = false;
    },

    clearLevelUp: (state) => {
      state.levelUp = null;
    },
  },

  extraReducers: (builder) => {
    builder
        // ── fetchQuestions ──────────────────────────────────────────────────────
        .addCase(fetchQuestions.pending, (state) => {
          state.loading    = true;
          state.error      = null;
          state.levelUp    = null;
          state.sessionId  = null;
        })
        .addCase(fetchQuestions.fulfilled, (state, action) => {
          state.loading         = false;
          state.questions       = action.payload.questions;
          state.sessionId       = action.payload.sessionId; // null si mode libre
          state.currentIndex    = 0;
          state.answers         = {};
          state.sessionComplete = false;
          state.sessionResult   = null;
        })
        .addCase(fetchQuestions.rejected, (state, action) => {
          state.loading = false;
          state.error   = action.payload;
        })

        // ── submitAnswer ────────────────────────────────────────────────────────
        .addCase(submitAnswer.pending, (state) => {
          state.submitting = true;
          state.error      = null;
        })
        .addCase(submitAnswer.fulfilled, (state, action) => {
          state.submitting = false;
          const { questionId, isCorrect, score, correctAnswer, explanation, levelUp } = action.payload;

          state.answers[questionId] = { isCorrect, score, correctAnswer, explanation };

          if (levelUp) state.levelUp = levelUp;

          // Auto-complétion si toutes les questions sont répondues
          const allAnswered = Object.keys(state.answers).length === state.questions.length;
          if (allAnswered) {
            state.sessionComplete = true;
            // NB : l'appel API /complete est déclenché par le composant
            // via useEffect sur sessionComplete (voir QuizPage)
          }
        })
        .addCase(submitAnswer.rejected, (state, action) => {
          state.submitting = false;
          state.error      = action.payload;
        })

        // ── completeSession ─────────────────────────────────────────────────────
        .addCase(completeSession.pending, (state) => {
          state.completing = true;
        })
        .addCase(completeSession.fulfilled, (state, action) => {
          state.completing     = false;
          state.sessionResult  = action.payload; // { score, maxScore, passed, xpAwarded, levelUp }
          if (action.payload?.levelUp) {
            state.levelUp = action.payload.levelUp;
          }
        })
        .addCase(completeSession.rejected, (state, action) => {
          state.completing = false;
          state.error      = action.payload;
        });
  },
});

export const { setFilters, nextQuestion, resetSession, clearLevelUp } = quizSlice.actions;
export default quizSlice.reducer;