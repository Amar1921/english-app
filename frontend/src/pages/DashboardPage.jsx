import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Grid, Card, CardContent, Typography, Button,
  LinearProgress, Chip, Avatar, Stack, useTheme,
} from '@mui/material';
import {
  SchoolRounded, BarChartRounded, LocalFireDepartmentRounded,
  EmojiEventsRounded, ArrowForwardRounded, StarRounded,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProgress } from '../store/slices/progressSlice';

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const LEVEL_COLORS = {
  A1: '#22C55E', A2: '#84CC16', B1: '#F59E0B',
  B2: '#F97316', C1: '#EF4444', C2: '#8B5CF6',
};
const CATEGORY_ICONS = { GRAMMAR: '📐', VOCABULARY: '📚', READING: '📖', LISTENING: '🎧' };

function StatCard({ icon, label, value, color, sub }) {
  const theme = useTheme();
  return (
    <Card>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>{label}</Typography>
            <Typography variant="h4" fontWeight={700} mt={0.5} color={color || 'text.primary'}>{value}</Typography>
            {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
          </Box>
          <Box sx={{
            width: 44, height: 44, borderRadius: '12px',
            bgcolor: (color || theme.palette.primary.main) + '18',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {React.cloneElement(icon, { sx: { color: color || 'primary.main', fontSize: 22 } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const user = useSelector((s) => s.auth.user);
  const { stats, byCategory, byLevel } = useSelector((s) => s.progress);

  useEffect(() => { dispatch(fetchProgress()); }, []);

  const levelIndex = LEVEL_ORDER.indexOf(user?.level || 'A1');
  const levelProgress = ((levelIndex + 1) / LEVEL_ORDER.length) * 100;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main', fontWeight: 700, fontSize: 20 }}>
            {user?.name?.[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Hey, {user?.name?.split(' ')[0]} 👋
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Keep going — consistency is key!
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <StatCard icon={<SchoolRounded />} label="Total answers" value={stats?.total ?? '—'} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard icon={<StarRounded />} label="Accuracy" value={stats ? `${stats.accuracy}%` : '—'} color="#F59E0B" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard icon={<EmojiEventsRounded />} label="Total XP" value={user?.xp ?? 0} color="#8B5CF6" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard icon={<LocalFireDepartmentRounded />} label="Streak" value={`${user?.streak ?? 0}d`} color="#EF4444" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Level progress */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>Your Level</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{
                  width: 70, height: 70, borderRadius: '18px',
                  bgcolor: (LEVEL_COLORS[user?.level] || '#22C55E') + '18',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `2px solid ${LEVEL_COLORS[user?.level] || '#22C55E'}44`,
                }}>
                  <Typography variant="h4" fontWeight={800} sx={{ color: LEVEL_COLORS[user?.level] }}>
                    {user?.level || 'A1'}
                  </Typography>
                </Box>
                <Box flex={1}>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Level progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={levelProgress}
                    sx={{ '& .MuiLinearProgress-bar': { bgcolor: LEVEL_COLORS[user?.level] } }}
                  />
                  <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                    {levelIndex + 1} of {LEVEL_ORDER.length} levels
                  </Typography>
                </Box>
              </Box>
              <Stack direction="row" spacing={0.8} flexWrap="wrap" gap={0.8}>
                {LEVEL_ORDER.map((lvl, i) => (
                  <Chip
                    key={lvl}
                    label={lvl}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      bgcolor: i <= levelIndex ? LEVEL_COLORS[lvl] + '22' : 'action.hover',
                      color: i <= levelIndex ? LEVEL_COLORS[lvl] : 'text.disabled',
                      border: lvl === user?.level ? `1.5px solid ${LEVEL_COLORS[lvl]}` : '1.5px solid transparent',
                    }}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Category breakdown */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>By category</Typography>
              {Object.keys(byCategory).length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography color="text.secondary">No data yet — take a quiz!</Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {Object.entries(byCategory).map(([cat, data]) => {
                    const acc = data.total ? Math.round((data.correct / data.total) * 100) : 0;
                    return (
                      <Box key={cat}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" fontWeight={600}>
                            {CATEGORY_ICONS[cat]} {cat.charAt(0) + cat.slice(1).toLowerCase()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {data.correct}/{data.total} · {acc}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={acc}
                          color={acc >= 80 ? 'success' : acc >= 50 ? 'warning' : 'error'}
                        />
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* CTA */}
        <Grid item xs={12}>
          <Card sx={{
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1a2744 0%, #0f1e3d 100%)'
              : 'linear-gradient(135deg, #1A6EFF 0%, #0D4FC2 100%)',
            color: 'white',
          }}>
            <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight={700} color="white">Ready to practice?</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                  Take a quiz and earn XP to level up your English!
                </Typography>
              </Box>
              <Button
                variant="contained"
                endIcon={<ArrowForwardRounded />}
                onClick={() => navigate('/quiz')}
                sx={{
                  bgcolor: 'white', color: '#1A6EFF', fontWeight: 700,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                }}
              >
                Start quiz
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
