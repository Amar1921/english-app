// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('token', data.token);
    return data;
  } catch (err) {
    const errorData = err.response?.data;
    // Cas spécial : compte non vérifié
    if (errorData?.pendingVerification) {
      return rejectWithValue({ message: errorData.error, pendingVerification: true, email: errorData.email });
    }
    return rejectWithValue({ message: errorData?.error || 'Login failed' });
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', userData);
    // Retourne { pendingVerification: true, email } — pas de token encore
    return { ...data, email: userData.email };
  } catch (err) {
    return rejectWithValue({ message: err.response?.data?.error || 'Registration failed' });
  }
});

export const verifyEmail = createAsyncThunk('auth/verifyEmail', async ({ email, code }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/verify-email', { email, code });
    localStorage.setItem('token', data.token);
    return data; // { token, user }
  } catch (err) {
    return rejectWithValue({ message: err.response?.data?.error || 'Verification failed' });
  }
});

export const resendVerification = createAsyncThunk('auth/resendVerification', async (email, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/resend-verification', { email });
    return data;
  } catch (err) {
    return rejectWithValue({ message: err.response?.data?.error || 'Failed to resend code' });
  }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  } catch (err) {
    return rejectWithValue({ message: err.response?.data?.error || 'Request failed' });
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ email, code, newPassword }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/reset-password', { email, code, newPassword });
    return data;
  } catch (err) {
    return rejectWithValue({ message: err.response?.data?.error || 'Reset failed' });
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me');
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to fetch user');
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
    initialized: !localStorage.getItem('token'),

    // Verification flow
    pendingVerification: false,
    pendingEmail: null,       // email en attente de vérification
    verifySuccess: false,

    // Reset password flow
    resetStep: null,          // null | 'email' | 'code' | 'done'
    resetEmail: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.initialized = true;
      state.pendingVerification = false;
      state.pendingEmail = null;
      localStorage.removeItem('token');
    },
    clearError(state) {
      state.error = null;
    },
    // Permet de basculer manuellement vers le flow vérification (ex: depuis login bloqué)
    setPendingVerification(state, action) {
      state.pendingVerification = true;
      state.pendingEmail = action.payload;
    },
    clearVerifySuccess(state) {
      state.verifySuccess = false;
    },
    // Reset password flow
    startResetFlow(state) {
      state.resetStep = 'email';
      state.resetEmail = null;
      state.error = null;
    },
    cancelResetFlow(state) {
      state.resetStep = null;
      state.resetEmail = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── Login
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.initialized = true;
        state.pendingVerification = false;
        state.pendingEmail = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        state.initialized = true;
        // Basculer vers le flow vérification si besoin
        if (action.payload?.pendingVerification) {
          state.pendingVerification = true;
          state.pendingEmail = action.payload.email;
        }
      });

    // ── Register
    builder
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingVerification = true;
        state.pendingEmail = action.payload.email;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });

    // ── Verify email
    builder
      .addCase(verifyEmail.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.initialized = true;
        state.pendingVerification = false;
        state.pendingEmail = null;
        state.verifySuccess = true;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });

    // ── Resend verification
    builder
      .addCase(resendVerification.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(resendVerification.fulfilled, (state) => { state.loading = false; })
      .addCase(resendVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });

    // ── Forgot password
    builder
      .addCase(forgotPassword.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.resetStep = 'code'; // passer à la saisie du code
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });

    // ── Reset password
    builder
      .addCase(resetPassword.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.resetStep = 'done';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });

    // ── Fetch me
    builder
      .addCase(fetchMe.pending, (state) => { state.loading = true; })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.initialized = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.token = null;
        localStorage.removeItem('token');
      });
  },
});

export const {
  logout, clearError,
  setPendingVerification, clearVerifySuccess,
  startResetFlow, cancelResetFlow,
} = authSlice.actions;

export default authSlice.reducer;
