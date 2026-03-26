import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Grid,
    LinearProgress,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';
import {
    ArrowForwardRounded,
    EmojiEventsRounded,
    LocalFireDepartmentRounded,
    SchoolRounded,
    StarRounded,
} from '@mui/icons-material';
import {useDispatch, useSelector} from 'react-redux';
import {fetchProgress} from '../store/slices/progressSlice';

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const LEVEL_COLORS = {
  A1: '#22C55E', A2: '#84CC16', B1: '#F59E0B',
  B2: '#F97316', C1: '#EF4444', C2: '#8B5CF6',
};
const CATEGORY_ICONS = { GRAMMAR: '📐', VOCABULARY: '📚', READING: '📖', LISTENING: '🎧' };

const STAT_CONFIG = (stats, user) => [
  { icon: <SchoolRounded />, label: 'Total answers', value: stats?.total ?? '—' },
  { icon: <StarRounded />, label: 'Accuracy', value: stats ? `${stats.accuracy}%` : '—', color: '#F59E0B' },
  { icon: <EmojiEventsRounded />, label: 'Total XP', value: user?.xp ?? 0, color: '#8B5CF6' },
  { icon: <LocalFireDepartmentRounded />, label: 'Streak', value: `${user?.streak ?? 0}d`, color: '#EF4444' },
];

function StatCard({ icon, label, value, color }) {
  const theme = useTheme();
  const c = color || theme.palette.primary.main;
  return (
    <Card>
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight={500} noWrap>{label}</Typography>
            <Typography variant="h4" fontWeight={700} mt={0.5} color={color || 'text.primary'}>{value}</Typography>
          </Box>
          <Box sx={{
            width: 40, height: 40, borderRadius: '10px', flexShrink: 0,
            bgcolor: c + '18',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {React.cloneElement(icon, { sx: { color: c, fontSize: 20 } })}
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

  return (
    <Box sx={{ pb: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Avatar sx={{ width: 44, height: 44, bgcolor: 'primary.main', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
          {user?.name?.[0]?.toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
            Hey, {user?.name?.split(' ')[0]} 👋
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Keep going — consistency is key!
          </Typography>
        </Box>
      </Box>

      {/* Stats row */}
      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 3 }}>
        {STAT_CONFIG(stats, user).map((s) => (
          <Grid item xs={6} sm={3} key={s.label}>
            <StatCard {...s} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Level progress */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Typography variant="h6" fontWeight={700} mb={2}>Your Level</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{
                  width: 64, height: 64, borderRadius: '16px', flexShrink: 0,
                  bgcolor: (LEVEL_COLORS[user?.level] || '#22C55E') + '18',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `2px solid ${(LEVEL_COLORS[user?.level] || '#22C55E')}44`,
                }}>
                  <Typography variant="h4" fontWeight={800} sx={{ color: LEVEL_COLORS[user?.level] || '#22C55E' }}>
                    {user?.level || 'A1'}
                  </Typography>
                </Box>
                <Box flex={1} minWidth={0}>
                  <Typography variant="body2" color="text.secondary" mb={1}>Level progress</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={((levelIndex + 1) / LEVEL_ORDER.length) * 100}
                    sx={{ '& .MuiLinearProgress-bar': { bgcolor: LEVEL_COLORS[user?.level] } }}
                  />
                  <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                    {levelIndex + 1} of {LEVEL_ORDER.length} levels
                  </Typography>
                </Box>
              </Box>
              <Stack direction="row" spacing={0.8} flexWrap="wrap" gap={0.8}>
                {LEVEL_ORDER.map((lvl, i) => (
                  <Chip key={lvl} label={lvl} size="small" sx={{
                    fontWeight: 700, fontSize: '0.7rem',
                    bgcolor: i <= levelIndex ? LEVEL_COLORS[lvl] + '22' : 'action.hover',
                    color: i <= levelIndex ? LEVEL_COLORS[lvl] : 'text.disabled',
                    border: lvl === user?.level ? `1.5px solid ${LEVEL_COLORS[lvl]}` : '1.5px solid transparent',
                  }} />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Category breakdown */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
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
                          variant="determinate" value={acc}
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
          }}>
            <CardContent sx={{
              p: { xs: 2.5, sm: 3 },
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', flexWrap: 'wrap', gap: 2,
            }}>
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
                  whiteSpace: 'nowrap',
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
