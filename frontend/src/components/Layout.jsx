import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Box, IconButton, Typography, Button,
  Avatar, Chip, Tooltip, useTheme, Container,
} from '@mui/material';
import {
  DarkMode, LightMode, LogoutRounded,
  SchoolRounded, BarChartRounded, HomeRounded, MenuBookRounded,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/slices/themeSlice';
import { logout } from '../store/slices/authSlice';

const LEVEL_COLORS = {
  A1: '#22C55E', A2: '#84CC16', B1: '#F59E0B',
  B2: '#F97316', C1: '#EF4444', C2: '#8B5CF6',
};

export default function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const themeMode = useSelector((s) => s.theme.mode);
  const user = useSelector((s) => s.auth.user);

  const navItems = [
    { label: 'Home', path: '/', icon: <HomeRounded fontSize="small" /> },
    { label: 'Lessons', path: '/lessons', icon: <MenuBookRounded fontSize="small" /> },
    { label: 'Quiz', path: '/quiz', icon: <SchoolRounded fontSize="small" /> },
    { label: 'Progress', path: '/progress', icon: <BarChartRounded fontSize="small" /> },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'white',
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 }, gap: 1 }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 3 }}>
            <Box sx={{
              width: 34, height: 34, borderRadius: '10px',
              background: 'linear-gradient(135deg, #1A6EFF 0%, #0D4FC2 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <SchoolRounded sx={{ color: 'white', fontSize: 20 }} />
            </Box>
            <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: -0.5 }}>
              English<span style={{ color: theme.palette.primary.main }}>Up</span>
            </Typography>
          </Box>

          {/* Nav */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 0.5, flex: 1 }}>
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  size="small"
                  sx={{
                    color: active ? 'primary.main' : 'text.secondary',
                    bgcolor: active ? 'primary.main' + '18' : 'transparent',
                    fontWeight: active ? 700 : 500,
                    px: 2,
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
            {user && (
              <>
                <Chip
                  label={user.level}
                  size="small"
                  sx={{
                    bgcolor: LEVEL_COLORS[user.level] + '22',
                    color: LEVEL_COLORS[user.level],
                    fontWeight: 700,
                    border: `1px solid ${LEVEL_COLORS[user.level]}44`,
                  }}
                />
                <Chip
                  label={`${user.xp} XP`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 700 }}
                />
                <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 14, fontWeight: 700 }}>
                  {user.name?.[0]?.toUpperCase()}
                </Avatar>
              </>
            )}

            <Tooltip title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}>
              <IconButton onClick={() => dispatch(toggleTheme())} size="small">
                {themeMode === 'dark' ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Logout">
              <IconButton onClick={handleLogout} size="small" color="error">
                <LogoutRounded fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
