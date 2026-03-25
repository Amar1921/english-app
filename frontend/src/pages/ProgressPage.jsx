import React, { useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, LinearProgress,
  Stack, Chip, Avatar, CircularProgress, Divider,
} from '@mui/material';
import {
  TrendingUpRounded, EmojiEventsRounded, CheckCircleRounded,
  CancelRounded, LocalFireDepartmentRounded,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProgress, fetchLeaderboard } from '../store/slices/progressSlice';

const LEVEL_COLORS = {
  A1: '#22C55E', A2: '#84CC16', B1: '#F59E0B',
  B2: '#F97316', C1: '#EF4444', C2: '#8B5CF6',
};
const CATEGORY_ICONS = { GRAMMAR: '📐', VOCABULARY: '📚', READING: '📖', LISTENING: '🎧' };

function AccuracyGauge({ value }) {
  const color = value >= 80 ? '#22C55E' : value >= 50 ? '#F59E0B' : '#EF4444';
  const r = 46;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);

  return (
    <Box sx={{ position: 'relative', width: 120, height: 120, mx: 'auto' }}>
      <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="60" cy="60" r={r} fill="none" stroke="currentColor" strokeWidth="10" style={{ opacity: 0.12 }} />
        <circle
          cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" fontWeight={800} sx={{ color }}>{value}%</Typography>
        <Typography variant="caption" color="text.secondary">accuracy</Typography>
      </Box>
    </Box>
  );
}

export default function ProgressPage() {
  const dispatch = useDispatch();
  const { stats, byCategory, byLevel, recentActivity, leaderboard, loading } = useSelector((s) => s.progress);
  const user = useSelector((s) => s.auth.user);

  useEffect(() => {
    dispatch(fetchProgress());
    dispatch(fetchLeaderboard());
  }, []);

  if (loading && !stats) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>Your Progress</Typography>

      <Grid container spacing={3}>
        {/* Accuracy gauge + overall stats */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" fontWeight={700} mb={2}>Overall</Typography>
              <AccuracyGauge value={stats?.accuracy ?? 0} />
              <Divider sx={{ my: 2 }} />
              <Stack spacing={1.5}>
                {[
                  { label: 'Total questions', value: stats?.total ?? 0, icon: <TrendingUpRounded fontSize="small" /> },
                  { label: 'Correct answers', value: stats?.correct ?? 0, icon: <CheckCircleRounded fontSize="small" />, color: 'success.main' },
                  { label: 'Total XP', value: stats?.totalScore ?? 0, icon: <EmojiEventsRounded fontSize="small" />, color: 'warning.main' },
                  { label: 'Current streak', value: `${user?.streak ?? 0} days`, icon: <LocalFireDepartmentRounded fontSize="small" />, color: 'error.main' },
                ].map(({ label, value, icon, color }) => (
                  <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: color || 'text.secondary' }}>
                      {icon}
                      <Typography variant="body2" color="text.secondary">{label}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={700}>{value}</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* By level */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>By level</Typography>
              {Object.keys(byLevel).length === 0 ? (
                <Typography color="text.secondary" variant="body2">No data yet</Typography>
              ) : (
                <Stack spacing={2}>
                  {Object.entries(byLevel).map(([lvl, data]) => {
                    const acc = data.total ? Math.round((data.correct / data.total) * 100) : 0;
                    return (
                      <Box key={lvl}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: LEVEL_COLORS[lvl] }} />
                            <Typography variant="body2" fontWeight={700}>{lvl}</Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">{data.correct}/{data.total} · {acc}%</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate" value={acc}
                          sx={{ '& .MuiLinearProgress-bar': { bgcolor: LEVEL_COLORS[lvl] } }}
                        />
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* By category */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>By category</Typography>
              {Object.keys(byCategory).length === 0 ? (
                <Typography color="text.secondary" variant="body2">No data yet</Typography>
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
                          <Typography variant="body2" color="text.secondary">{acc}%</Typography>
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

        {/* Recent activity */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>Recent activity</Typography>
              {recentActivity.length === 0 ? (
                <Typography color="text.secondary" variant="body2">No activity yet — take a quiz!</Typography>
              ) : (
                <Stack spacing={1}>
                  {recentActivity.slice(0, 10).map((a) => (
                    <Box key={a.id} sx={{
                      display: 'flex', alignItems: 'center', gap: 1.5,
                      p: 1.5, borderRadius: 2, bgcolor: 'action.hover',
                    }}>
                      {a.isCorrect
                        ? <CheckCircleRounded sx={{ color: 'success.main', fontSize: 20, flexShrink: 0 }} />
                        : <CancelRounded sx={{ color: 'error.main', fontSize: 20, flexShrink: 0 }} />}
                      <Box flex={1}>
                        <Stack direction="row" spacing={0.8}>
                          <Chip label={a.level} size="small" sx={{ fontSize: '0.65rem', height: 18, fontWeight: 700 }} />
                          <Chip label={a.category} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 18 }} />
                        </Stack>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        +{a.score} XP
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Leaderboard */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>
                🏆 Leaderboard
              </Typography>
              {leaderboard.length === 0 ? (
                <Typography color="text.secondary" variant="body2">No players yet</Typography>
              ) : (
                <Stack spacing={1}>
                  {leaderboard.map((u, i) => (
                    <Box key={u.id} sx={{
                      display: 'flex', alignItems: 'center', gap: 1.5,
                      p: 1.5, borderRadius: 2,
                      bgcolor: u.id === user?.id ? 'primary.main' + '12' : 'action.hover',
                      border: u.id === user?.id ? '1px solid' : '1px solid transparent',
                      borderColor: u.id === user?.id ? 'primary.main' + '44' : 'transparent',
                    }}>
                      <Typography variant="body2" fontWeight={800} sx={{ minWidth: 20, color: i < 3 ? ['#FFD700','#C0C0C0','#CD7F32'][i] : 'text.secondary' }}>
                        #{i + 1}
                      </Typography>
                      <Avatar sx={{ width: 30, height: 30, fontSize: 13, fontWeight: 700, bgcolor: 'primary.main' }}>
                        {u.name[0].toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" fontWeight={u.id === user?.id ? 700 : 400} flex={1} noWrap>
                        {u.name} {u.id === user?.id ? '(you)' : ''}
                      </Typography>
                      <Typography variant="body2" fontWeight={700} color="warning.main">
                        {u.xp} XP
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
