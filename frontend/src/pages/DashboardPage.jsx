import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    AutoStoriesRounded,
    BoltRounded,
    CheckCircleRounded,
    EmojiEventsRounded,
    LocalFireDepartmentRounded,
    SchoolRounded,
    StarRounded,
    TrendingUpRounded,
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
    const c = color || theme.palette.primary.main;
    return (
        <Card>
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight={500} noWrap>{label}</Typography>
                        <Typography variant="h4" fontWeight={700} mt={0.5} color={color || 'text.primary'}>{value}</Typography>
                        {sub && <Typography variant="caption" color="text.disabled">{sub}</Typography>}
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
    const navigate  = useNavigate();
    const dispatch  = useDispatch();
    const theme     = useTheme();
    const user      = useSelector((s) => s.auth.user);
    const { stats, byCategory, byLevel, lessonProgress, loading } = useSelector((s) => s.progress);

    useEffect(() => { dispatch(fetchProgress()); }, []);

    const levelIndex      = LEVEL_ORDER.indexOf(user?.level || 'A1');
    const lessonsTotal    = lessonProgress?.length ?? 0;
    const lessonsCompleted = (lessonProgress || []).filter((p) => p.status === 'COMPLETED').length;
    const lessonsXp       = (lessonProgress || []).reduce((s, p) => s + (p.xpEarned ?? 0), 0);

    // Recent activity — last 5 quiz answers (only current user, already from API)
    const recentActivity = useSelector((s) => s.progress.recentActivity) || [];

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
                        Niveau actuel : <strong>{user?.level || 'A1'}</strong> · {user?.xp ?? 0} XP total
                    </Typography>
                </Box>
            </Box>

            {/* Stats row — user-only */}
            <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3}>
                    <StatCard
                        icon={<SchoolRounded />}
                        label="Questions répondues"
                        value={stats?.total ?? 0}
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <StatCard
                        icon={<StarRounded />}
                        label="Précision"
                        value={stats ? `${stats.accuracy}%` : '—'}
                        color="#F59E0B"
                        sub={stats ? `${stats.correct} correctes` : undefined}
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <StatCard
                        icon={<EmojiEventsRounded />}
                        label="Total XP"
                        value={user?.xp ?? 0}
                        color="#8B5CF6"
                        sub={`+${lessonsXp} leçons`}
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <StatCard
                        icon={<LocalFireDepartmentRounded />}
                        label="Streak"
                        value={`${user?.streak ?? 0}j`}
                        color="#EF4444"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={{ xs: 2, sm: 3 }}>
                {/* Level progress */}
                <Grid item xs={12} md={5}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                            <Typography variant="h6" fontWeight={700} mb={2}>Mon niveau</Typography>
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
                                    <Typography variant="body2" color="text.secondary" mb={1}>Progression</Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={((levelIndex + 1) / LEVEL_ORDER.length) * 100}
                                        sx={{ '& .MuiLinearProgress-bar': { bgcolor: LEVEL_COLORS[user?.level] } }}
                                    />
                                    <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                                        {levelIndex + 1} / {LEVEL_ORDER.length} niveaux
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

                {/* Lessons progress */}
                <Grid item xs={12} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6" fontWeight={700}>Leçons</Typography>
                                <AutoStoriesRounded sx={{ color: 'text.disabled', fontSize: 20 }} />
                            </Box>

                            <Box sx={{ textAlign: 'center', mb: 2 }}>
                                <Typography variant="h3" fontWeight={800} color="#22C55E">{lessonsCompleted}</Typography>
                                <Typography variant="body2" color="text.secondary">leçons validées</Typography>
                            </Box>

                            <LinearProgress
                                variant="determinate"
                                value={lessonsTotal ? (lessonsCompleted / lessonsTotal) * 100 : 0}
                                sx={{
                                    mb: 1.5, height: 8, borderRadius: 4,
                                    '& .MuiLinearProgress-bar': { bgcolor: '#22C55E', borderRadius: 4 },
                                }}
                            />

                            <Button
                                size="small" fullWidth variant="outlined"
                                onClick={() => navigate('/lessons')}
                                sx={{ mt: 2, fontWeight: 700, borderRadius: 2 }}
                            >
                                Voir les leçons
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Category breakdown */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                            <Typography variant="h6" fontWeight={700} mb={2}>Par catégorie</Typography>
                            {Object.keys(byCategory).length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 3 }}>
                                    <TrendingUpRounded sx={{ fontSize: 36, color: 'text.disabled', mb: 1 }} />
                                    <Typography color="text.secondary" variant="body2">
                                        Aucune donnée — fais un quiz !
                                    </Typography>
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

                {/* Recent activity — user-only */}
                {recentActivity.length > 0 && (
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                                <Typography variant="h6" fontWeight={700} mb={2}>Activité récente</Typography>
                                <Stack spacing={1}>
                                    {recentActivity.slice(0, 5).map((a) => (
                                        <Box key={a.id} sx={{
                                            display: 'flex', alignItems: 'center', gap: 1.5,
                                            p: 1.5, borderRadius: 2, bgcolor: 'action.hover',
                                        }}>
                                            {a.isCorrect
                                                ? <CheckCircleRounded sx={{ color: 'success.main', fontSize: 18, flexShrink: 0 }} />
                                                : <SchoolRounded      sx={{ color: 'error.main',   fontSize: 18, flexShrink: 0 }} />
                                            }
                                            <Stack direction="row" spacing={0.6} flex={1} flexWrap="wrap" useFlexGap>
                                                <Chip label={a.level}    size="small" sx={{ fontSize: '0.6rem', height: 18, fontWeight: 700 }} />
                                                <Chip label={a.category} size="small" variant="outlined" sx={{ fontSize: '0.6rem', height: 18 }} />
                                            </Stack>
                                            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ flexShrink: 0 }}>
                                                +{a.score} XP
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* By level breakdown */}
                {Object.keys(byLevel).length > 0 && (
                    <Grid item xs={12} md={recentActivity.length > 0 ? 6 : 12}>
                        <Card>
                            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                                <Typography variant="h6" fontWeight={700} mb={2}>Par niveau</Typography>
                                <Stack spacing={2}>
                                    {Object.entries(byLevel).map(([lvl, data]) => {
                                        const acc = data.total ? Math.round((data.correct / data.total) * 100) : 0;
                                        return (
                                            <Box key={lvl}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: LEVEL_COLORS[lvl] }} />
                                                        <Typography variant="body2" fontWeight={600}>{lvl}</Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {data.correct}/{data.total} · {acc}%
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate" value={acc}
                                                    sx={{ '& .MuiLinearProgress-bar': { bgcolor: LEVEL_COLORS[lvl] } }}
                                                />
                                            </Box>
                                        );
                                    })}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

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
                                <Typography variant="h6" fontWeight={700} color="white">Prêt à pratiquer ?</Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                                    Lance un quiz et gagne des XP pour progresser en anglais !
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/lessons')}
                                    startIcon={<AutoStoriesRounded />}
                                    sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', fontWeight: 700, whiteSpace: 'nowrap',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: 'white' } }}
                                >
                                    Leçons
                                </Button>
                                <Button
                                    variant="contained"
                                    endIcon={<ArrowForwardRounded />}
                                    onClick={() => navigate('/quiz')}
                                    sx={{ bgcolor: 'white', color: '#1A6EFF', fontWeight: 700, whiteSpace: 'nowrap',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}
                                >
                                    Démarrer un quiz
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}