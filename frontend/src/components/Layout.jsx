import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import {
  BarChartRounded,
  CloseRounded,
  DarkMode,
  HomeRounded,
  LightMode,
  LogoutRounded,
  MenuBookRounded,
  MenuRounded,
  SchoolRounded,
  TranslateRounded,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/slices/themeSlice';
import { logout } from '../store/slices/authSlice';
import Footer from './Footer.jsx';

// ─── Constants ────────────────────────────────────────────────────────────────

const LEVEL_COLORS = {
  A1: '#22C55E', A2: '#84CC16', B1: '#F59E0B',
  B2: '#F97316', C1: '#EF4444', C2: '#8B5CF6',
};

const NAV_ITEMS = [
  { label: 'Accueil',       path: '/',            icon: <HomeRounded      fontSize="small" /> },
  { label: 'Leçons',        path: '/lessons',     icon: <MenuBookRounded  fontSize="small" /> },
  { label: 'Quiz',          path: '/quiz',        icon: <SchoolRounded    fontSize="small" /> },
  { label: 'Progression',   path: '/progress',   icon: <BarChartRounded  fontSize="small" /> },
  { label: 'Dictionnaire',  path: '/dictionary', icon: <TranslateRounded fontSize="small" /> },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Logo() {
  const theme = useTheme();
  return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: { xs: 0, sm: 2 }, flexShrink: 0 }}>
        <Box sx={{
          width: 34, height: 34, borderRadius: '10px',
          background: 'linear-gradient(135deg, #1A6EFF 0%, #0D4FC2 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <SchoolRounded sx={{ color: 'white', fontSize: 20 }} />
        </Box>
        <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: -0.5, whiteSpace: 'nowrap' }}>
          English<span style={{ color: theme.palette.primary.main }}>Up</span>
        </Typography>
      </Box>
  );
}

function UserChips({ user }) {
  if (!user) return null;
  return (
      <>
        <Chip
            label={user.level}
            size="small"
            sx={{
              bgcolor: LEVEL_COLORS[user.level] + '22',
              color:   LEVEL_COLORS[user.level],
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
      </>
  );
}

// ─── Main Layout ──────────────────────────────────────────────────────────────

export default function Layout() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const theme     = useTheme();
  const themeMode = useSelector((s) => s.theme.mode);
  const user      = useSelector((s) => s.auth.user);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = () => setDrawerOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    closeDrawer();
  };

  const handleNav = (path) => {
    navigate(path);
    closeDrawer();
  };

  const isDark = themeMode === 'dark';

  return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>

        {/* ── AppBar ─────────────────────────────────────────────────────────── */}
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
              bgcolor: isDark ? 'background.paper' : 'white',
              borderBottom: `1px solid ${theme.palette.divider}`,
              color: 'text.primary',
            }}
        >
          <Toolbar sx={{ px: { xs: 2, md: 4 }, gap: 1, minHeight: { xs: 52, sm: 60 } }}>

            {/* Hamburger — mobile */}
            <IconButton
                onClick={() => setDrawerOpen(true)}
                size="small"
                sx={{ display: { xs: 'flex', md: 'none' }, mr: 0.5 }}
            >
              <MenuRounded fontSize="small" />
            </IconButton>

            <Logo />

            {/* Nav desktop */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.25, flex: 1 }}>
              {NAV_ITEMS.map(({ label, path, icon }) => {
                const active = location.pathname === path ||
                    (path !== '/' && location.pathname.startsWith(path));
                return (
                    <Button
                        key={path}
                        startIcon={icon}
                        onClick={() => navigate(path)}
                        size="small"
                        sx={{
                          color:   active ? 'primary.main' : 'text.secondary',
                          bgcolor: active ? 'primary.main' + '14' : 'transparent',
                          fontWeight: active ? 700 : 500,
                          fontSize: 13,
                          px: 1.5,
                          borderRadius: 1.5,
                          whiteSpace: 'nowrap',
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                    >
                      {label}
                    </Button>
                );
              })}
            </Box>

            {/* Right side */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, ml: 'auto', flexShrink: 0 }}>

              {/* User chips — sm+ */}
              {user && (
                  <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.75 }}>
                    <UserChips user={user} />
                  </Box>
              )}

              {/* Avatar → profile */}
              {user && (
                  <Tooltip title="Mon profil">
                    <Avatar
                        onClick={() => navigate('/profile')}
                        sx={{
                          width: 32, height: 32, bgcolor: 'primary.main',
                          fontSize: 13, fontWeight: 700, cursor: 'pointer',
                          '&:hover': { opacity: 0.85 },
                        }}
                    >
                      {user.name?.[0]?.toUpperCase()}
                    </Avatar>
                  </Tooltip>
              )}

              {/* Theme toggle */}
              <Tooltip title={`Mode ${isDark ? 'clair' : 'sombre'}`}>
                <IconButton onClick={() => dispatch(toggleTheme())} size="small">
                  {isDark
                      ? <LightMode fontSize="small" />
                      : <DarkMode  fontSize="small" />
                  }
                </IconButton>
              </Tooltip>

              {/* Logout — desktop */}
              <Tooltip title="Se déconnecter">
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

        {/* ── Drawer mobile ──────────────────────────────────────────────────── */}
        <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={closeDrawer}
            PaperProps={{ sx: { width: 256 } }}
        >
          {/* Header drawer */}
          <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            px: 2, py: 1.5,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}>
            {user ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 14, fontWeight: 700 }}>
                    {user.name?.[0]?.toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight={600} lineHeight={1.3}>{user.name}</Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.25 }}>
                      <Chip
                          label={user.level} size="small"
                          sx={{
                            height: 16, fontSize: '0.6rem', fontWeight: 700,
                            bgcolor: LEVEL_COLORS[user.level] + '22',
                            color:   LEVEL_COLORS[user.level],
                          }}
                      />
                      <Chip
                          label={`${user.xp} XP`} size="small" color="primary" variant="outlined"
                          sx={{ height: 16, fontSize: '0.6rem', fontWeight: 700 }}
                      />
                    </Box>
                  </Box>
                </Box>
            ) : <Logo />}
            <IconButton size="small" onClick={closeDrawer}>
              <CloseRounded fontSize="small" />
            </IconButton>
          </Box>

          {/* Nav items */}
          <List sx={{ pt: 1, px: 1 }}>
            {NAV_ITEMS.map(({ label, path, icon }) => {
              const active = location.pathname === path ||
                  (path !== '/' && location.pathname.startsWith(path));
              return (
                  <ListItemButton
                      key={path}
                      onClick={() => handleNav(path)}
                      selected={active}
                      sx={{
                        borderRadius: '8px', mb: 0.25,
                        '&.Mui-selected': {
                          bgcolor: 'primary.main' + '14',
                          color:   'primary.main',
                          '& .MuiListItemIcon-root': { color: 'primary.main' },
                        },
                      }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
                    <ListItemText
                        primary={label}
                        primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 700 : 500 }}
                    />
                  </ListItemButton>
              );
            })}
          </List>

          <Divider sx={{ mx: 2 }} />

          <List sx={{ px: 1 }}>
            <ListItemButton
                onClick={() => { handleNav('/profile'); }}
                sx={{ borderRadius: '8px', mb: 0.25 }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Avatar sx={{ width: 20, height: 20, bgcolor: 'primary.main', fontSize: 10 }}>
                  {user?.name?.[0]?.toUpperCase()}
                </Avatar>
              </ListItemIcon>
              <ListItemText
                  primary="Mon profil"
                  primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
              />
            </ListItemButton>

            <ListItemButton
                onClick={handleLogout}
                sx={{ borderRadius: '8px', color: 'error.main' }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'error.main' }}>
                <LogoutRounded fontSize="small" />
              </ListItemIcon>
              <ListItemText
                  primary="Se déconnecter"
                  primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
              />
            </ListItemButton>
          </List>
        </Drawer>

        {/* ── Content ────────────────────────────────────────────────────────── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 52px)' }}>
          <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 }, flex: 1 }}>
            <Outlet />
          </Container>
          <Footer />
        </Box>
      </Box>
  );
}