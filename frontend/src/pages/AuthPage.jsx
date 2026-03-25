import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Alert, IconButton, InputAdornment, Divider, useTheme, CircularProgress,
} from '@mui/material';
import {
  Visibility, VisibilityOff, SchoolRounded, LightMode, DarkMode,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, clearError } from '../store/slices/authSlice';
import { toggleTheme } from '../store/slices/themeSlice';

export default function AuthPage({ mode }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const themeMode = useSelector((s) => s.theme.mode);
  const { loading, error, token } = useSelector((s) => s.auth);
  const isLogin = mode === 'login';

  const [form, setForm] = useState({ email: '', name: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (token) navigate('/', { replace: true });
    return () => dispatch(clearError());
  }, [token]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) dispatch(login({ email: form.email, password: form.password }));
    else dispatch(register(form));
  };

  const isDark = themeMode === 'dark';

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'background.default',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2,
      position: 'relative',
    }}>
      {/* Background decoration */}
      <Box sx={{
        position: 'fixed', top: -100, right: -100,
        width: 400, height: 400, borderRadius: '50%',
        background: isDark
          ? 'radial-gradient(circle, rgba(77,143,255,0.08) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(26,110,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'fixed', bottom: -100, left: -100,
        width: 350, height: 350, borderRadius: '50%',
        background: isDark
          ? 'radial-gradient(circle, rgba(255,94,108,0.06) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(255,94,108,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Theme toggle */}
      <IconButton
        onClick={() => dispatch(toggleTheme())}
        sx={{ position: 'fixed', top: 20, right: 20 }}
        size="small"
      >
        {isDark ? <LightMode /> : <DarkMode />}
      </IconButton>

      <Box sx={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{
            width: 56, height: 56, borderRadius: '16px',
            background: 'linear-gradient(135deg, #1A6EFF 0%, #0D4FC2 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            mx: 'auto', mb: 2,
            boxShadow: '0 8px 24px rgba(26,110,255,0.35)',
          }}>
            <SchoolRounded sx={{ color: 'white', fontSize: 30 }} />
          </Box>
          <Typography variant="h4" fontWeight={700} letterSpacing={-0.5}>
            English<span style={{ color: theme.palette.primary.main }}>Up</span>
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {isLogin ? 'Welcome back! Ready to learn?' : 'Start your English journey today'}
          </Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} mb={0.5}>
              {isLogin ? 'Sign in' : 'Create account'}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              {isLogin ? 'Enter your credentials below' : 'Fill in your details to get started'}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => dispatch(clearError())}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {!isLogin && (
                <TextField
                  label="Full name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  fullWidth
                  autoFocus
                  placeholder="John Doe"
                />
              )}
              <TextField
                label="Email address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                fullWidth
                autoFocus={isLogin}
                placeholder="you@example.com"
              />
              <TextField
                label="Password"
                name="password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                required
                fullWidth
                placeholder={isLogin ? '••••••••' : 'Min. 6 characters'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPass((p) => !p)} edge="end" size="small">
                        {showPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ mt: 1, py: 1.4 }}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : (isLogin ? 'Sign in' : 'Create account')}
              </Button>
            </Box>

            <Divider sx={{ my: 2.5 }}>
              <Typography variant="caption" color="text.secondary">or</Typography>
            </Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <Link
                  to={isLogin ? '/register' : '/login'}
                  style={{ color: theme.palette.primary.main, fontWeight: 700, textDecoration: 'none' }}
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 3 }}>
          Free to use · No credit card required
        </Typography>
      </Box>
    </Box>
  );
}
