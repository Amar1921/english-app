import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Box, IconButton, Typography, Button,
  Avatar, Chip, Tooltip, useTheme, Container,
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Divider,
} from '@mui/material';
import {
  DarkMode, LightMode, LogoutRounded,
  SchoolRounded, BarChartRounded, HomeRounded, MenuBookRounded,
  MenuRounded, CloseRounded,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/slices/themeSlice';
import { logout } from '../store/slices/authSlice';
import Footer from "./Footer.jsx";

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

  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/', icon: <HomeRounded fontSize="small" /> },
    { label: 'Lessons', path: '/lessons', icon: <MenuBookRounded fontSize="small" /> },
    { label: 'Quiz', path: '/quiz', icon: <SchoolRounded fontSize="small" /> },
    { label: 'Progress', path: '/progress', icon: <BarChartRounded fontSize="small" /> },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setDrawerOpen(false);
  };

  const handleNav = (path) => {
    navigate(path);
    setDrawerOpen(false);
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
          <Toolbar sx={{ px: { xs: 2, md: 4 }, gap: 1, minHeight: { xs: 52, sm: 64 } }}>

            {/* Hamburger — mobile only */}
            <IconButton
                onClick={() => setDrawerOpen(true)}
                size="small"
                sx={{ display: { xs: 'flex', sm: 'none' }, mr: 0.5 }}
            >
              <MenuRounded fontSize="small" />
            </IconButton>

            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: { xs: 0, sm: 3 } }}>
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

            {/* Nav desktop — sm+ */}
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
              {/* Chips — cachés sur xs */}
              {user && (
                  <>
                    <Chip
                        label={user.level}
                        size="small"
                        sx={{
                          display: { xs: 'none', sm: 'flex' },
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
                        sx={{ display: { xs: 'none', sm: 'flex' }, fontWeight: 700 }}
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

              {/* Logout bouton — desktop only (sur mobile c'est dans le drawer) */}
              <Tooltip title="Logout">
                <IconButton
                    onClick={handleLogout}
                    size="small"
                    color="error"
                    sx={{ display: { xs: 'none', sm: 'flex' } }}
                >
                  <LogoutRounded fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Drawer mobile */}
        <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{ sx: { width: 240 } }}
        >
          {/* Header drawer avec infos user */}
          <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            px: 2, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}`,
          }}>
            {user && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 14, fontWeight: 700 }}>
                    {user.name?.[0]?.toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>{user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.level} · {user.xp} XP
                    </Typography>
                  </Box>
                </Box>
            )}
            <IconButton size="small" onClick={() => setDrawerOpen(false)}>
              <CloseRounded fontSize="small" />
            </IconButton>
          </Box>

          {/* Nav items */}
          <List sx={{ pt: 1 }}>
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                  <ListItemButton
                      key={item.path}
                      onClick={() => handleNav(item.path)}
                      selected={active}
                      sx={{
                        borderRadius: '8px',
                        mx: 1,
                        mb: 0.25,
                        '&.Mui-selected': {
                          bgcolor: 'primary.main' + '18',
                          color: 'primary.main',
                          '& .MuiListItemIcon-root': { color: 'primary.main' },
                        },
                      }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                    <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 700 : 500 }}
                    />
                  </ListItemButton>
              );
            })}
          </List>

          <Divider sx={{ my: 1 }} />

          <List>
            <ListItemButton
                onClick={handleLogout}
                sx={{ borderRadius: '8px', mx: 1, color: 'error.main' }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'error.main' }}>
                <LogoutRounded fontSize="small" />
              </ListItemIcon>
              <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
              />
            </ListItemButton>
          </List>
        </Drawer>

        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 52px)' }}>
          <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
            <Outlet />
          </Container>
          <Footer />
        </Box>
      </Box>
  );
}