import React, {useEffect} from 'react';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    LinearProgress,
    Stack,
    Typography,
} from '@mui/material';
import {
    CancelRounded,
    CheckCircleRounded,
    EmojiEventsRounded,
    LocalFireDepartmentRounded,
    TrendingUpRounded,
} from '@mui/icons-material';
import {useDispatch, useSelector} from 'react-redux';
import {fetchLeaderboard, fetchProgress} from '../store/slices/progressSlice';

const LEVEL_COLORS = {
  A1: '#22C55E', A2: '#84CC16', B1: '#F59E0B',
  B2: '#F97316', C1: '#EF4444', C2: '#8B5CF6',
};
const CATEGORY_ICONS = { GRAMMAR: '📐', VOCABULARY: '📚', READING: '📖', LISTENING: '🎧' };

function AccuracyGauge({ value }) {
  const color = value >= 80 ? '#22C55E' : value >= 50 ? '#F59E0B' : '#EF4444';
  const r = 44;
  const circ = 2 * Math.PI * r;
  return (
    <Box sx={{ position: 'relative', width: 110, height: 110, mx: 'auto' }}>
      <svg width="110" height="110" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="55" cy="55" r={r} fill="none" stroke="currentColor" strokeWidth="9" style={{ opacity: 0.12 }} />
        <circle
          cx="55" cy="55" r={r} fill="none" stroke={color} strokeWidth="9"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - value / 100)}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" fontWeight={800} sx={{ color }}>{value}%</Typography>
        <Typography variant="caption" color="text.secondary">accuracy</Typography>
      </Box>
    </Box>
  );
}

function ProgressRow({ label, correct, total, colorOverride }) {
  const acc = total ? Math.round((correct / total) * 100) : 0;
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2" fontWeight={600}>{label}</Typography>
        <Typography variant="body2" color="text.secondary">{correct}/{total} · {acc}%</Typography>
      </Box>
      <LinearProgress
        variant="determinate" value={acc}
        sx={colorOverride ? { '& .MuiLinearProgress-bar': { bgcolor: colorOverride } } : undefined}
        color={!colorOverride ? (acc >= 80 ? 'success' : acc >= 50 ? 'warning' : 'error') : undefined}
      />
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

  const overallStats = [
    { label: 'Total questions', value: stats?.total ?? 0, icon: <TrendingUpRounded fontSize="small" /> },
    { label: 'Correct answers', value: stats?.correct ?? 0, icon: <CheckCircleRounded fontSize="small" />, color: 'success.main' },
    { label: 'Total XP', value: stats?.totalScore ?? 0, icon: <EmojiEventsRounded fontSize="small" />, color: 'warning.main' },
    { label: 'Current streak', value: `${user?.streak ?? 0} days`, icon: <LocalFireDepartmentRounded fontSize="small" />, color: 'error.main' },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>Your Progress</Typography>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Overall stats */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2.5, sm: 3 }, textAlign: 'center' }}>
              <Typography variant="h6" fontWeight={700} mb={2}>Overall</Typography>
              <AccuracyGauge value={stats?.accuracy ?? 0} />
              <Divider sx={{ my: 2 }} />
              <Stack spacing={1.5}>
                {overallStats.map(({ label, value, icon, color }) => (
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
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Typography variant="h6" fontWeight={700} mb={2}>By level</Typography>
              {Object.keys(byLevel).length === 0 ? (
                <Typography color="text.secondary" variant="body2">No data yet</Typography>
              ) : (
                <Stack spacing={2}>
                  {Object.entries(byLevel).map(([lvl, data]) => (
                    <ProgressRow
                      key={lvl}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: LEVEL_COLORS[lvl], flexShrink: 0 }} />
                          {lvl}
                        </Box>
                      }
                      correct={data.correct} total={data.total}
                      colorOverride={LEVEL_COLORS[lvl]}
                    />
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* By category */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Typography variant="h6" fontWeight={700} mb={2}>By category</Typography>
              {Object.keys(byCategory).length === 0 ? (
                <Typography color="text.secondary" variant="body2">No data yet</Typography>
              ) : (
                <Stack spacing={2}>
                  {Object.entries(byCategory).map(([cat, data]) => (
                    <ProgressRow
                      key={cat}
                      label={`${CATEGORY_ICONS[cat]} ${cat.charAt(0) + cat.slice(1).toLowerCase()}`}
                      correct={data.correct} total={data.total}
                    />
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent activity */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
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
                        ? <CheckCircleRounded sx={{ color: 'success.main', fontSize: 18, flexShrink: 0 }} />
                        : <CancelRounded sx={{ color: 'error.main', fontSize: 18, flexShrink: 0 }} />}
                      <Stack direction="row" spacing={0.6} flex={1} flexWrap="wrap" useFlexGap>
                        <Chip label={a.level} size="small" sx={{ fontSize: '0.6rem', height: 18, fontWeight: 700 }} />
                        <Chip label={a.category} size="small" variant="outlined" sx={{ fontSize: '0.6rem', height: 18 }} />
                      </Stack>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ flexShrink: 0 }}>
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
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Typography variant="h6" fontWeight={700} mb={2}>🏆 Leaderboard</Typography>
              {leaderboard.length === 0 ? (
                <Typography color="text.secondary" variant="body2">No players yet</Typography>
              ) : (
                <Stack spacing={1}>
                  {leaderboard.map((u, i) => {
                    const isMe = u.id === user?.id;
                    return (
                      <Box key={u.id} sx={{
                        display: 'flex', alignItems: 'center', gap: 1.5,
                        p: 1.5, borderRadius: 2,
                        bgcolor: isMe ? 'primary.main' + '12' : 'action.hover',
                        border: '1px solid',
                        borderColor: isMe ? 'primary.main' + '44' : 'transparent',
                      }}>
                        <Typography variant="body2" fontWeight={800} sx={{
                          minWidth: 18, flexShrink: 0,
                          color: i < 3 ? ['#FFD700', '#C0C0C0', '#CD7F32'][i] : 'text.secondary',
                        }}>
                          #{i + 1}
                        </Typography>
                        <Avatar sx={{ width: 28, height: 28, fontSize: 12, fontWeight: 700, bgcolor: 'primary.main', flexShrink: 0 }}>
                          {u.name[0].toUpperCase()}
                        </Avatar>
                        <Typography variant="body2" fontWeight={isMe ? 700 : 400} flex={1} noWrap>
                          {u.name}{isMe ? ' (you)' : ''}
                        </Typography>
                        <Typography variant="body2" fontWeight={700} color="warning.main" sx={{ flexShrink: 0 }}>
                          {u.xp} XP
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
