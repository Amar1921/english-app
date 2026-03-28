import React, { useEffect, useRef } from 'react';
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
    AutoStoriesRounded,
    BoltRounded,
    CancelRounded,
    CheckCircleRounded,
    EmojiEventsRounded,
    LocalFireDepartmentRounded,
    TrendingUpRounded,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProgress } from '../store/slices/progressSlice';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const LEVEL_COLORS = {
    A1: '#22C55E', A2: '#84CC16', B1: '#F59E0B',
    B2: '#F97316', C1: '#EF4444', C2: '#8B5CF6',
};
const LEVEL_COLORS_FADED = {
    A1: '#22C55E33', A2: '#84CC1633', B1: '#F59E0B33',
    B2: '#F9731633', C1: '#EF444433', C2: '#8B5CF633',
};

const CATEGORY_ICONS = { GRAMMAR: '📐', VOCABULARY: '📚', READING: '📖', LISTENING: '🎧' };

// ─── Accuracy gauge ───────────────────────────────────────────────────────────

function AccuracyGauge({ value }) {
    const color = value >= 80 ? '#22C55E' : value >= 50 ? '#F59E0B' : '#EF4444';
    const r = 44, circ = 2 * Math.PI * r;
    return (
        <Box sx={{ position: 'relative', width: 110, height: 110, mx: 'auto' }}>
            <svg width="110" height="110" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="55" cy="55" r={r} fill="none" stroke="currentColor" strokeWidth="9" style={{ opacity: 0.12 }} />
                <circle cx="55" cy="55" r={r} fill="none" stroke={color} strokeWidth="9"
                        strokeDasharray={circ} strokeDashoffset={circ * (1 - value / 100)}
                        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
            </svg>
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h5" fontWeight={800} sx={{ color }}>{value}%</Typography>
                <Typography variant="caption" color="text.secondary">précision</Typography>
            </Box>
        </Box>
    );
}

// ─── Progress row ─────────────────────────────────────────────────────────────

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

// ─── Chart par niveau (Chart.js) ──────────────────────────────────────────────

function LevelChart({ byLevel }) {
    const canvasRef = useRef(null);
    const chartRef  = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Charge Chart.js dynamiquement depuis CDN
        const scriptId = 'chartjs-cdn';
        const init = () => {
            if (chartRef.current) chartRef.current.destroy();

            const labels   = LEVELS;
            const correct  = labels.map((l) => byLevel[l]?.correct   ?? 0);
            const incorrect = labels.map((l) => byLevel[l]?.incorrect ?? 0);

            chartRef.current = new window.Chart(canvasRef.current, {
                type: 'bar',
                data: {
                    labels,
                    datasets: [
                        {
                            label:           'Correctes',
                            data:            correct,
                            backgroundColor: labels.map((l) => LEVEL_COLORS[l]),
                            borderRadius:    6,
                            borderSkipped:   false,
                        },
                        {
                            label:           'Incorrectes',
                            data:            incorrect,
                            backgroundColor: labels.map((l) => LEVEL_COLORS_FADED[l]),
                            borderRadius:    6,
                            borderSkipped:   false,
                        },
                    ],
                },
                options: {
                    responsive:          true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    plugins: {
                        legend:  { display: false },
                        tooltip: {
                            callbacks: {
                                label: (ctx) => {
                                    const lvl   = labels[ctx.dataIndex];
                                    const total = (byLevel[lvl]?.total ?? 0);
                                    const pct   = total ? Math.round((ctx.raw / total) * 100) : 0;
                                    return ` ${ctx.dataset.label} : ${ctx.raw}  (${pct}%)`;
                                },
                            },
                        },
                    },
                    scales: {
                        x: {
                            stacked: false,
                            grid:    { display: false },
                            ticks:   { font: { weight: '700', size: 13 } },
                        },
                        y: {
                            stacked:   false,
                            beginAtZero: true,
                            grid:      { color: 'rgba(128,128,128,0.12)' },
                            ticks: {
                                precision: 0,
                                font:      { size: 11 },
                            },
                        },
                    },
                },
            });
        };

        if (window.Chart) {
            init();
        } else if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id  = scriptId;
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
            script.onload = init;
            document.head.appendChild(script);
        } else {
            // Script déjà en cours de chargement
            document.getElementById(scriptId).addEventListener('load', init);
        }

        return () => { chartRef.current?.destroy(); };
    }, [byLevel]);

    const totalCorrect   = LEVELS.reduce((s, l) => s + (byLevel[l]?.correct   ?? 0), 0);
    const totalIncorrect = LEVELS.reduce((s, l) => s + (byLevel[l]?.incorrect ?? 0), 0);
    const grandTotal     = totalCorrect + totalIncorrect;

    return (
        <Card>
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="h6" fontWeight={700}>
                        Réponses correctes par niveau
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {grandTotal} question{grandTotal > 1 ? 's' : ''} au total
                    </Typography>
                </Box>

                {/* Légende custom */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: '#22C55E' }} />
                        <Typography variant="caption" color="text.secondary">
                            Correctes — {totalCorrect}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: '#22C55E33', border: '1px solid #22C55E66' }} />
                        <Typography variant="caption" color="text.secondary">
                            Incorrectes — {totalIncorrect}
                        </Typography>
                    </Box>
                </Box>

                {/* Canvas */}
                {grandTotal === 0 ? (
                    <Box sx={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography color="text.secondary" variant="body2">
                            Aucune donnée — fais un quiz !
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ position: 'relative', height: 220 }}>
                        <canvas ref={canvasRef} />
                    </Box>
                )}

                {/* Détail par niveau sous le graphique */}
                {grandTotal > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                        {LEVELS.filter((l) => (byLevel[l]?.total ?? 0) > 0).map((l) => {
                            const d   = byLevel[l];
                            const acc = d.total ? Math.round((d.correct / d.total) * 100) : 0;
                            return (
                                <Box key={l} sx={{
                                    flex: '1 1 80px',
                                    p: 1, borderRadius: 1.5, textAlign: 'center',
                                    bgcolor: LEVEL_COLORS[l] + '12',
                                    border: `1px solid ${LEVEL_COLORS[l]}33`,
                                }}>
                                    <Typography variant="caption" fontWeight={800} sx={{ color: LEVEL_COLORS[l], display: 'block' }}>
                                        {l}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                        {d.correct}/{d.total}
                                    </Typography>
                                    <Typography variant="caption" fontWeight={700} sx={{ color: LEVEL_COLORS[l] }}>
                                        {acc}%
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ProgressPage() {
    const dispatch = useDispatch();
    const { stats, byCategory, byLevel, recentActivity, lessonProgress, loading } =
        useSelector((s) => s.progress);
    const user = useSelector((s) => s.auth.user);

    useEffect(() => { dispatch(fetchProgress()); }, []);

    if (loading && !stats) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
        </Box>
    );

    const lessonsCompleted  = (lessonProgress || []).filter((p) => p.status === 'COMPLETED').length;
    const lessonsInProgress = (lessonProgress || []).filter((p) => p.status === 'IN_PROGRESS').length;
    const lessonsXp         = (lessonProgress || []).reduce((s, p) => s + (p.xpEarned ?? 0), 0);

    const overallStats = [
        { label: 'Questions répondues', value: stats?.total ?? 0,      icon: <TrendingUpRounded fontSize="small" /> },
        { label: 'Réponses correctes',  value: stats?.correct ?? 0,    icon: <CheckCircleRounded fontSize="small" />, color: 'success.main' },
        { label: 'XP quiz',             value: stats?.totalScore ?? 0, icon: <EmojiEventsRounded fontSize="small" />, color: 'warning.main' },
        { label: 'XP leçons',           value: lessonsXp,               icon: <AutoStoriesRounded fontSize="small" />, color: '#22C55E' },
        { label: 'Streak actuel',       value: `${user?.streak ?? 0} j`, icon: <LocalFireDepartmentRounded fontSize="small" />, color: 'error.main' },
    ];

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} mb={3}>Ma progression</Typography>

            <Grid container spacing={{ xs: 2, sm: 3 }}>
                {/* Vue d'ensemble */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ p: { xs: 2.5, sm: 3 }, textAlign: 'center' }}>
                            <Typography variant="h6" fontWeight={700} mb={2}>Vue d'ensemble</Typography>
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

                {/* Par niveau */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                            <Typography variant="h6" fontWeight={700} mb={2}>Par niveau</Typography>
                            {Object.keys(byLevel || {}).length === 0 ? (
                                <Typography color="text.secondary" variant="body2">Aucune donnée</Typography>
                            ) : (
                                <Stack spacing={2}>
                                    {LEVELS.filter((l) => (byLevel[l]?.total ?? 0) > 0).map((lvl) => (
                                        <ProgressRow
                                            key={lvl}
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: LEVEL_COLORS[lvl], flexShrink: 0 }} />
                                                    {lvl}
                                                </Box>
                                            }
                                            correct={byLevel[lvl].correct}
                                            total={byLevel[lvl].total}
                                            colorOverride={LEVEL_COLORS[lvl]}
                                        />
                                    ))}
                                </Stack>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Par catégorie */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                            <Typography variant="h6" fontWeight={700} mb={2}>Par catégorie</Typography>
                            {Object.keys(byCategory || {}).length === 0 ? (
                                <Typography color="text.secondary" variant="body2">Aucune donnée</Typography>
                            ) : (
                                <Stack spacing={2}>
                                    {Object.entries(byCategory).map(([cat, data]) => (
                                        <ProgressRow
                                            key={cat}
                                            label={`${CATEGORY_ICONS[cat] ?? ''} ${cat.charAt(0) + cat.slice(1).toLowerCase()}`}
                                            correct={data.correct} total={data.total}
                                        />
                                    ))}
                                </Stack>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* ── NOUVEAU : graphique par niveau ───────────────────────── */}
                <Grid item xs={12}>
                    <LevelChart byLevel={byLevel ?? {}} />
                </Grid>

                {/* Leçons */}
                <Grid item xs={12} md={5}>
                    <Card>
                        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                            <Typography variant="h6" fontWeight={700} mb={2}>Leçons</Typography>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2.5, flexWrap: 'wrap' }}>
                                {[
                                    { label: 'Validées',  value: lessonsCompleted,  color: '#22C55E' },
                                    { label: 'En cours',  value: lessonsInProgress, color: '#F59E0B' },
                                    { label: 'XP gagnés', value: `+${lessonsXp}`,   color: '#8B5CF6' },
                                ].map(({ label, value, color }) => (
                                    <Box key={label} sx={{
                                        flex: 1, minWidth: 80, textAlign: 'center',
                                        p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider',
                                    }}>
                                        <Typography variant="h5" fontWeight={800} sx={{ color }}>{value}</Typography>
                                        <Typography variant="caption" color="text.secondary">{label}</Typography>
                                    </Box>
                                ))}
                            </Box>
                            {(lessonProgress || []).length > 0 && (
                                <>
                                    <LinearProgress
                                        variant="determinate"
                                        value={lessonsCompleted / (lessonProgress || []).length * 100}
                                        sx={{ height: 8, borderRadius: 4, mb: 1, '& .MuiLinearProgress-bar': { bgcolor: '#22C55E', borderRadius: 4 } }}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        {lessonsCompleted} / {(lessonProgress || []).length} leçons commencées validées
                                    </Typography>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Activité récente */}
                <Grid item xs={12} md={7}>
                    <Card>
                        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                            <Typography variant="h6" fontWeight={700} mb={2}>Activité récente</Typography>
                            {(recentActivity || []).length === 0 ? (
                                <Typography color="text.secondary" variant="body2">Aucune activité — fais un quiz !</Typography>
                            ) : (
                                <Stack spacing={1}>
                                    {(recentActivity || []).slice(0, 3).map((a) => (
                                        <Box key={a.id} sx={{
                                            display: 'flex', alignItems: 'center', gap: 1.5,
                                            p: 1.5, borderRadius: 2, bgcolor: 'action.hover',
                                        }}>
                                            {a.isCorrect
                                                ? <CheckCircleRounded sx={{ color: 'success.main', fontSize: 18, flexShrink: 0 }} />
                                                : <CancelRounded      sx={{ color: 'error.main',   fontSize: 18, flexShrink: 0 }} />
                                            }
                                            <Stack direction="row" spacing={0.6} flex={1} flexWrap="wrap" useFlexGap>
                                                <Chip label={a.level}    size="small" sx={{ fontSize: '0.6rem', height: 18, fontWeight: 700 }} />
                                                <Chip label={a.category} size="small" variant="outlined" sx={{ fontSize: '0.6rem', height: 18 }} />
                                                {a.source === 'session' && (
                                                    <Chip label="session" size="small" color="primary" variant="outlined" sx={{ fontSize: '0.6rem', height: 18 }} />
                                                )}
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
            </Grid>
        </Box>
    );
}