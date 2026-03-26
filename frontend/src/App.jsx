import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getTheme } from './theme/theme';
import { fetchMe } from './store/slices/authSlice';

import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import QuizPage from './pages/QuizPage';
import ProgressPage from './pages/ProgressPage';
// import LessonsPage from './pages/LessonsPage';
import Layout from './components/Layout';
import LessonsPage from "./pages/lessons/LessonsPage.jsx";
import LessonDetail from "./pages/lessons/LessonDetail.jsx";

function ProtectedRoute({ children }) {
  const { token, initialized } = useSelector((s) => s.auth);
  if (!initialized) return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <CircularProgress />
    </Box>
  );
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const dispatch = useDispatch();
  const themeMode = useSelector((s) => s.theme.mode);
  const { token } = useSelector((s) => s.auth);
  const theme = getTheme(themeMode);

  useEffect(() => {
    if (token) dispatch(fetchMe());
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="quiz" element={<QuizPage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="lessons" element={<LessonsPage />} />
            <Route path="lessons/:slug" element={<LessonDetail />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
