import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import quizReducer from './slices/quizSlice';
import progressReducer from './slices/progressSlice';
import themeReducer from './slices/themeSlice';
import lessonsReducer from './slices/lessonsSlice';
//import userReducer from './slices/userSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    quiz: quizReducer,
    progress: progressReducer,
    theme: themeReducer,
    lessons: lessonsReducer,
   // user:     userReducer,
  },
});
