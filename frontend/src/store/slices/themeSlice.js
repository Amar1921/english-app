import {createSlice} from '@reduxjs/toolkit';

const saved = localStorage.getItem('themeMode');

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: saved || 'light' },
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', state.mode);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
