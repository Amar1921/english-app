// src/pages/AuthPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Alert, IconButton, InputAdornment, Divider, CircularProgress,
  Stack,
} from '@mui/material';
import {
  Visibility, VisibilityOff, SchoolRounded, LightMode, DarkMode,
  MarkEmailReadRounded, ArrowBackRounded, CheckCircleRounded,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  login, register, verifyEmail, resendVerification,
  forgotPassword, resetPassword,
  clearError, startResetFlow, cancelResetFlow,
} from '../store/slices/authSlice';
import { toggleTheme } from '../store/slices/themeSlice';

// ─── Code Input (6 chiffres) ──────────────────────────────────────────────────

function CodeInput({ value, onChange, disabled }) {
  const inputRefs = Array.from({ length: 6 }, () => useRef(null));

  const handleChange = (i, e) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    const chars = value.split('');
    chars[i] = val;
    onChange(chars.join(''));
    if (val && i < 5) inputRefs[i + 1].current?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) {
      inputRefs[i - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      onChange(pasted);
      inputRefs[5].current?.focus();
      e.preventDefault();
    }
  };

  return (
      <Stack direction="row" spacing={1} justifyContent="center" onPaste={handlePaste}>
        {Array.from({ length: 6 }).map((_, i) => (
            <Box
                key={i}
                component="input"
                ref={inputRefs[i]}
                maxLength={1}
                value={value[i] || ''}
                onChange={(e) => handleChange(i, e)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                disabled={disabled}
                inputMode="numeric"
                sx={{
                  width: { xs: 40, sm: 48 },
                  height: { xs: 48, sm: 56 },
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  border: '2px solid',
                  borderColor: value[i] ? 'primary.main' : 'divider',
                  borderRadius: 2,
                  outline: 'none',
                  bgcolor: 'background.paper',
                  color: 'text.primary',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.15s',
                  cursor: disabled ? 'not-allowed' : 'text',
                  '&:focus': { borderColor: 'primary.main' },
                  '&:disabled': { opacity: 0.5 },
                }}
            />
        ))}
      </Stack>
  );
}

// ─── Vue : vérification email ─────────────────────────────────────────────────

function VerifyEmailView({ email }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);
  const [code, setCode] = useState('');
  const [resent, setResent] = useState(false);

  const handleVerify = () => {
    if (code.length === 6) dispatch(verifyEmail({ email, code }));
  };

  const handleResend = async () => {
    setResent(false);
    const result = await dispatch(resendVerification(email));
    if (!result.error) setResent(true);
  };

  return (
      <Box sx={{ textAlign: 'center' }}>
        <Box sx={{
          width: 60, height: 60, borderRadius: '16px', mx: 'auto', mb: 2,
          background: 'linear-gradient(135deg, #1A6EFF 0%, #0D4FC2 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(26,110,255,0.3)',
        }}>
          <MarkEmailReadRounded sx={{ color: 'white', fontSize: 30 }} />
        </Box>

        <Typography variant="h6" fontWeight={700} mb={0.5}>Check your email</Typography>
        <Typography variant="body2" color="text.secondary" mb={0.5}>
          We sent a 6-digit code to
        </Typography>
        <Typography variant="body2" fontWeight={700} color="primary.main" mb={3}>
          {email}
        </Typography>

        {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2, textAlign: 'left' }} onClose={() => dispatch(clearError())}>
              {error}
            </Alert>
        )}
        {resent && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
              A new code has been sent!
            </Alert>
        )}

        <CodeInput value={code} onChange={setCode} disabled={loading} />

        <Button
            variant="contained" fullWidth size="large"
            onClick={handleVerify}
            disabled={code.length < 6 || loading}
            sx={{ mt: 3, py: 1.4 }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Verify my account'}
        </Button>

        <Typography variant="body2" color="text.secondary" mt={2}>
          Didn't receive the code?{' '}
          <Box
              component="span"
              onClick={!loading ? handleResend : undefined}
              sx={{
                color: 'primary.main', fontWeight: 700, cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
          >
            Resend
          </Box>
        </Typography>
      </Box>
  );
}

// ─── Vue : reset password ─────────────────────────────────────────────────────

function ForgotPasswordView({ initialEmail, onBack }) {
  const dispatch = useDispatch();
  const { loading, error, resetStep } = useSelector((s) => s.auth);
  const [email, setEmail] = useState(initialEmail || '');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSendCode = () => {
    if (email) dispatch(forgotPassword(email));
  };

  const handleReset = () => {
    if (email && code.length === 6 && newPassword.length >= 6)
      dispatch(resetPassword({ email, code, newPassword }));
  };

  // Succès
  if (resetStep === 'done') {
    return (
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{
            width: 60, height: 60, borderRadius: '16px', mx: 'auto', mb: 2,
            background: 'linear-gradient(135deg, #22C55E, #16A34A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(34,197,94,0.3)',
          }}>
            <CheckCircleRounded sx={{ color: 'white', fontSize: 30 }} />
          </Box>
          <Typography variant="h6" fontWeight={700} mb={1}>Password updated!</Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Your password has been reset successfully. You can now sign in.
          </Typography>
          <Button
              variant="contained" fullWidth
              onClick={() => { dispatch(cancelResetFlow()); onBack(); }}
              sx={{ py: 1.4 }}
          >
            Back to sign in
          </Button>
        </Box>
    );
  }

  return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <IconButton size="small" onClick={() => { dispatch(cancelResetFlow()); onBack(); }}>
            <ArrowBackRounded fontSize="small" />
          </IconButton>
          <Box>
            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>Reset password</Typography>
            <Typography variant="body2" color="text.secondary">
              {resetStep === 'code' ? 'Enter the code you received' : "We'll send you a reset code"}
            </Typography>
          </Box>
        </Box>

        {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => dispatch(clearError())}>
              {error}
            </Alert>
        )}

        {/* Étape 1 : saisie email */}
        {resetStep === 'email' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                  label="Email address" type="email"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  fullWidth autoFocus placeholder="you@example.com"
              />
              <Button
                  variant="contained" fullWidth size="large"
                  onClick={handleSendCode}
                  disabled={!email || loading}
                  sx={{ py: 1.4 }}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Send reset code →'}
              </Button>
            </Box>
        )}

        {/* Étape 2 : code + nouveau mot de passe */}
        {resetStep === 'code' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Enter the 6-digit code sent to <strong>{email}</strong>
              </Typography>

              <CodeInput value={code} onChange={setCode} disabled={loading} />

              <TextField
                  label="New password"
                  type={showPass ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  fullWidth placeholder="Min. 6 characters"
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
                  variant="contained" fullWidth size="large"
                  onClick={handleReset}
                  disabled={code.length < 6 || newPassword.length < 6 || loading}
                  sx={{ py: 1.4 }}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Reset my password'}
              </Button>

              <Typography variant="body2" color="text.secondary" textAlign="center">
                Didn't get the code?{' '}
                <Box
                    component="span"
                    onClick={!loading ? handleSendCode : undefined}
                    sx={{ color: 'primary.main', fontWeight: 700, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                >
                  Resend
                </Box>
              </Typography>
            </Box>
        )}
      </Box>
  );
}

// ─── Main AuthPage ─────────────────────────────────────────────────────────────

export default function AuthPage({ mode }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const themeMode = useSelector((s) => s.theme.mode);
  const { loading, error, token, pendingVerification, pendingEmail, resetStep } = useSelector((s) => s.auth);
  const isLogin = mode === 'login';
  const isDark = themeMode === 'dark';

  const [form, setForm] = useState({ email: '', name: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    if (token) navigate('/', { replace: true });
    return () => dispatch(clearError());
  }, [token]);

  // Nettoyage si on quitte le reset sans terminer
  useEffect(() => {
    if (!showReset && resetStep && resetStep !== 'done') {
      dispatch(cancelResetFlow());
    }
  }, [showReset]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) dispatch(login({ email: form.email, password: form.password }));
    else dispatch(register(form));
  };

  const handleForgot = () => {
    dispatch(clearError());
    dispatch(startResetFlow());
    setShowReset(true);
  };

  const isShowingModal = pendingVerification || showReset;

  const renderContent = () => {
    if (pendingVerification && pendingEmail) {
      return <VerifyEmailView email={pendingEmail} />;
    }
    if (showReset && resetStep) {
      return (
          <ForgotPasswordView
              initialEmail={form.email}
              onBack={() => setShowReset(false)}
          />
      );
    }

    // Formulaire login / register
    return (
        <>
          <Typography variant="h6" fontWeight={700} mb={0.5}>
            {isLogin ? 'Sign in' : 'Create account'}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2.5}>
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
                    label="Full name" name="name"
                    value={form.name} onChange={handleChange}
                    required fullWidth autoFocus placeholder="John Doe"
                />
            )}
            <TextField
                label="Email address" name="email" type="email"
                value={form.email} onChange={handleChange}
                required fullWidth autoFocus={isLogin} placeholder="you@example.com"
            />

            <Box>
              <TextField
                  label="Password" name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password} onChange={handleChange}
                  required fullWidth
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
              {isLogin && (
                  <Box sx={{ textAlign: 'right', mt: 0.75 }}>
                    <Box
                        component="span"
                        onClick={handleForgot}
                        sx={{
                          fontSize: '0.8rem', color: 'primary.main', fontWeight: 600,
                          cursor: 'pointer', '&:hover': { textDecoration: 'underline' },
                        }}
                    >
                      Forgot password?
                    </Box>
                  </Box>
              )}
            </Box>

            <Button
                type="submit" variant="contained" fullWidth size="large"
                disabled={loading} sx={{ mt: 0.5, py: 1.4 }}
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
                  style={{ color: '#1A6EFF', fontWeight: 700, textDecoration: 'none' }}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </Link>
            </Typography>
          </Box>
        </>
    );
  };

  return (
      <Box sx={{
        minHeight: '100dvh',
        bgcolor: 'background.default',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        p: { xs: 1.5, sm: 2 },
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Blobs décoratifs */}
        <Box sx={{
          position: 'fixed', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%',
          background: isDark
              ? 'radial-gradient(circle, rgba(77,143,255,0.08) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(26,110,255,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'fixed', bottom: -80, left: -80, width: 260, height: 260, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,94,108,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <IconButton onClick={() => dispatch(toggleTheme())} sx={{ position: 'fixed', top: 16, right: 16 }} size="small">
          {isDark ? <LightMode /> : <DarkMode />}
        </IconButton>

        <Box sx={{ width: '100%', maxWidth: 420 }}>
          {/* Logo — caché pendant les flux secondaires pour gagner de la place */}
          {!isShowingModal && (
              <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
                <Box sx={{
                  width: 52, height: 52, borderRadius: '14px',
                  background: 'linear-gradient(135deg, #1A6EFF 0%, #0D4FC2 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  mx: 'auto', mb: 1.5,
                  boxShadow: '0 8px 24px rgba(26,110,255,0.35)',
                }}>
                  <SchoolRounded sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Typography variant="h4" fontWeight={700} letterSpacing={-0.5}>
                  English<span style={{ color: '#1A6EFF' }}>Up</span>
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  {isLogin ? 'Welcome back! Ready to learn?' : 'Start your English journey today'}
                </Typography>
              </Box>
          )}

          <Card>
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              {renderContent()}
            </CardContent>
          </Card>

          {!isShowingModal && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2.5 }}>
                Free to use · No credit card required
              </Typography>
          )}
        </Box>
      </Box>
  );
}