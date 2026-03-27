import React, { useEffect, useState } from 'react';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    LinearProgress,
    Snackbar,
    Stack,
    Tab,
    Tabs,
    TextField,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import {
    AutoStoriesRounded,
    BoltRounded,
    CancelRounded,
    CheckCircleRounded,
    DeleteForeverRounded,
    EditRounded,
    EmojiEventsRounded,
    LocalFireDepartmentRounded,
    LockRounded,
    PersonRounded,
    SaveRounded,
    SchoolRounded,
    TrendingUpRounded,
    VisibilityOffRounded,
    VisibilityRounded,
    WarningAmberRounded,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import api from "../../utils/api.js";
//import api from '../utils/api';

// ── Constants ────────────────────────────────────────────────────────────────

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const LEVEL_COLORS = {
    A1: '#22C55E', A2: '#84CC16', B1: '#F59E0B',
    B2: '#F97316', C1: '#EF4444', C2: '#8B5CF6',
};
const LEVEL_LABELS = {
    A1: 'Débutant', A2: 'Élémentaire', B1: 'Intermédiaire',
    B2: 'Inter. supérieur', C1: 'Avancé', C2: 'Maîtrise',
};
const CATEGORY_ICONS  = { GRAMMAR: '📐', VOCABULARY: '📚', READING: '📖', LISTENING: '🎧' };
const CATEGORY_LABELS = { GRAMMAR: 'Grammaire', VOCABULARY: 'Vocabulaire', READING: 'Lecture', LISTENING: 'Écoute' };

// ── Helpers ───────────────────────────────────────────────────────────────────

function initials(name = '') {
    return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

function fmtDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatBadge({ icon, label, value, color }) {
    return (
        <Box sx={{
            flex: 1, minWidth: 100, p: 2, borderRadius: 2.5, textAlign: 'center',
            border: '1.5px solid', borderColor: (color || '#1A6EFF') + '33',
            bgcolor: (color || '#1A6EFF') + '08',
        }}>
            <Box sx={{ color: color || '#1A6EFF', mb: 0.5, display: 'flex', justifyContent: 'center' }}>
                {React.cloneElement(icon, { sx: { fontSize: 22 } })}
            </Box>
            <Typography variant="h5" fontWeight={800} sx={{ color: color || '#1A6EFF', lineHeight: 1 }}>
                {value}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2, display: 'block', mt: 0.5 }}>
                {label}
            </Typography>
        </Box>
    );
}

// ── Tab: Overview ─────────────────────────────────────────────────────────────

function OverviewTab({ data }) {
    const { user, stats, recentActivity } = data;
    const levelIdx   = LEVEL_ORDER.indexOf(user.level);
    const levelColor = LEVEL_COLORS[user.level] || '#22C55E';

    return (
        <Box>
            {/* Hero card */}
            <Card elevation={0} sx={{ mb: 3, border: '1.5px solid', borderColor: levelColor + '33', borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ height: 6, bgcolor: levelColor }} />
                <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                        {/* Avatar */}
                        <Avatar sx={{
                            width: 72, height: 72, fontSize: 24, fontWeight: 800,
                            bgcolor: levelColor, flexShrink: 0,
                            boxShadow: `0 8px 24px ${levelColor}44`,
                        }}>
                            {initials(user.name)}
                        </Avatar>

                        {/* Info */}
                        <Box flex={1} minWidth={160}>
                            <Typography variant="h5" fontWeight={800} lineHeight={1.2}>{user.name}</Typography>
                            <Typography color="text.secondary" variant="body2" mt={0.5}>{user.email}</Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                                <Chip
                                    label={`${user.level} · ${LEVEL_LABELS[user.level]}`}
                                    size="small"
                                    sx={{ bgcolor: levelColor + '18', color: levelColor, fontWeight: 700 }}
                                />
                                {user.isVerified && (
                                    <Chip
                                        icon={<CheckCircleRounded sx={{ fontSize: '13px !important', color: '#22C55E !important' }} />}
                                        label="Vérifié"
                                        size="small"
                                        sx={{ bgcolor: '#22C55E18', color: '#22C55E', fontWeight: 600 }}
                                    />
                                )}
                                <Chip
                                    label={`Membre depuis ${fmtDate(user.createdAt)}`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: 11 }}
                                />
                            </Box>
                        </Box>

                        {/* Level progress */}
                        <Box sx={{ minWidth: 160, flex: 1, maxWidth: 240 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>Progression</Typography>
                                <Typography variant="caption" fontWeight={700} sx={{ color: levelColor }}>
                                    {levelIdx + 1}/{LEVEL_ORDER.length}
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={((levelIdx + 1) / LEVEL_ORDER.length) * 100}
                                sx={{
                                    height: 8, borderRadius: 4,
                                    '& .MuiLinearProgress-bar': { bgcolor: levelColor, borderRadius: 4 },
                                }}
                            />
                            <Box sx={{ display: 'flex', gap: 0.5, mt: 1.25, flexWrap: 'wrap' }}>
                                {LEVEL_ORDER.map((lvl, i) => (
                                    <Box key={lvl} sx={{
                                        px: 0.75, py: 0.2, borderRadius: 0.75, fontSize: 10, fontWeight: 800,
                                        bgcolor: i <= levelIdx ? LEVEL_COLORS[lvl] + '22' : 'action.hover',
                                        color: i <= levelIdx ? LEVEL_COLORS[lvl] : 'text.disabled',
                                        border: `1px solid ${i <= levelIdx ? LEVEL_COLORS[lvl] + '44' : 'transparent'}`,
                                    }}>
                                        {lvl}
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Stat badges */}
            <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
                <StatBadge icon={<EmojiEventsRounded />}        label="Total XP"         value={user.xp}                          color="#8B5CF6" />
                <StatBadge icon={<LocalFireDepartmentRounded />} label="Streak"           value={`${user.streak}j`}               color="#EF4444" />
                <StatBadge icon={<TrendingUpRounded />}          label="Précision quiz"   value={`${stats.quiz.accuracy}%`}       color="#F59E0B" />
                <StatBadge icon={<SchoolRounded />}              label="Questions"         value={stats.quiz.totalAnswered}        color="#1A6EFF" />
                <StatBadge icon={<AutoStoriesRounded />}         label="Leçons validées"  value={stats.lessons.completed}         color="#22C55E" />
            </Box>

            <Grid container spacing={2.5}>
                {/* Par catégorie */}
                <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5, height: '100%' }}>
                        <CardContent sx={{ p: 2.5 }}>
                            <Typography variant="h6" fontWeight={700} mb={2}>Par catégorie</Typography>
                            {Object.keys(stats.byCategory).length === 0 ? (
                                <Typography color="text.secondary" variant="body2">Aucune donnée — fais un quiz !</Typography>
                            ) : (
                                <Stack spacing={2}>
                                    {Object.entries(stats.byCategory).map(([cat, d]) => {
                                        const acc = d.total ? Math.round((d.correct / d.total) * 100) : 0;
                                        const isFav = cat === stats.favouriteCategory;
                                        return (
                                            <Box key={cat}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                                        <Typography variant="body2" fontWeight={600}>
                                                            {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
                                                        </Typography>
                                                        {isFav && (
                                                            <Chip label="Favori" size="small" sx={{ fontSize: 10, height: 16, bgcolor: '#F59E0B18', color: '#F59E0B', fontWeight: 700 }} />
                                                        )}
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {d.correct}/{d.total} · {acc}%
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

                {/* Activité récente */}
                <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5, height: '100%' }}>
                        <CardContent sx={{ p: 2.5 }}>
                            <Typography variant="h6" fontWeight={700} mb={2}>Activité récente</Typography>
                            {recentActivity.length === 0 ? (
                                <Typography color="text.secondary" variant="body2">Aucune activité</Typography>
                            ) : (
                                <Stack spacing={1}>
                                    {recentActivity.slice(0, 8).map((a) => (
                                        <Box key={a.id} sx={{
                                            display: 'flex', alignItems: 'center', gap: 1.5,
                                            p: 1.25, borderRadius: 1.5, bgcolor: 'action.hover',
                                        }}>
                                            {a.isCorrect
                                                ? <CheckCircleRounded sx={{ color: '#22C55E', fontSize: 16, flexShrink: 0 }} />
                                                : <CancelRounded      sx={{ color: '#EF4444', fontSize: 16, flexShrink: 0 }} />
                                            }
                                            <Stack direction="row" spacing={0.5} flex={1} flexWrap="wrap" useFlexGap>
                                                <Chip label={a.level}    size="small" sx={{ fontSize: '0.6rem', height: 17, fontWeight: 700 }} />
                                                <Chip label={CATEGORY_LABELS[a.category] || a.category} size="small" variant="outlined" sx={{ fontSize: '0.6rem', height: 17 }} />
                                            </Stack>
                                            <Typography variant="caption" fontWeight={700} color={a.isCorrect ? '#22C55E' : 'text.disabled'} sx={{ flexShrink: 0 }}>
                                                +{a.score} XP
                                            </Typography>
                                            <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0, fontSize: 10 }}>
                                                {new Date(a.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
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

// ── Tab: Informations ─────────────────────────────────────────────────────────

function InfoTab({ data, onSaved }) {
    const { user } = data;
    const [name,    setName]    = useState(user.name);
    const [email,   setEmail]   = useState(user.email);
    const [saving,  setSaving]  = useState(false);
    const [error,   setError]   = useState('');
    const [success, setSuccess] = useState(false);

    const dirty = name !== user.name || email !== user.email;

    const handleSave = async () => {
        if (!name.trim()) return setError('Le nom est requis.');
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return setError('Email invalide.');
        setSaving(true); setError('');
        try {
            await api.patch('/user/profile', { name: name.trim(), email: email.trim() });
            setSuccess(true);
            onSaved({ name: name.trim(), email: email.trim() });
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de la mise à jour.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5, maxWidth: 560 }}>
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <PersonRounded sx={{ color: 'primary.main' }} />
                    <Typography variant="h6" fontWeight={700}>Informations personnelles</Typography>
                </Box>

                <Stack spacing={2.5}>
                    <TextField
                        label="Nom complet"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Adresse e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth type="email"
                    />

                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.5}>
                            Informations du compte
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Membre depuis le <strong>{fmtDate(user.createdAt)}</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Dernière connexion : <strong>{fmtDate(user.lastLogin)}</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Statut : <strong style={{ color: user.isVerified ? '#22C55E' : '#F59E0B' }}>
                            {user.isVerified ? 'Compte vérifié ✓' : 'Non vérifié'}
                        </strong>
                        </Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

                    <Button
                        variant="contained" onClick={handleSave}
                        disabled={!dirty || saving}
                        startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveRounded />}
                        sx={{ alignSelf: 'flex-start', fontWeight: 700, borderRadius: 2, px: 3 }}
                    >
                        {saving ? 'Enregistrement…' : 'Sauvegarder'}
                    </Button>
                </Stack>
            </CardContent>

            <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity="success" variant="filled" sx={{ fontWeight: 600 }}>Profil mis à jour ✓</Alert>
            </Snackbar>
        </Card>
    );
}

// ── Tab: Sécurité ─────────────────────────────────────────────────────────────

function SecurityTab({ onDelete }) {
    const [current,  setCurrent]  = useState('');
    const [newPwd,   setNewPwd]   = useState('');
    const [confirm,  setConfirm]  = useState('');
    const [showC,    setShowC]    = useState(false);
    const [showN,    setShowN]    = useState(false);
    const [saving,   setSaving]   = useState(false);
    const [error,    setError]    = useState('');
    const [success,  setSuccess]  = useState(false);

    // Delete dialog
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletePwd,  setDeletePwd]  = useState('');
    const [deleting,   setDeleting]   = useState(false);
    const [deleteErr,  setDeleteErr]  = useState('');

    const strength = newPwd.length === 0 ? null : newPwd.length < 8 ? 'Trop court' : /[A-Z]/.test(newPwd) && /[0-9]/.test(newPwd) ? 'Fort' : 'Moyen';
    const strengthColor = { 'Trop court': '#EF4444', Moyen: '#F59E0B', Fort: '#22C55E' }[strength] || '#ccc';
    const strengthValue = { 'Trop court': 33, Moyen: 66, Fort: 100 }[strength] || 0;

    const handleSave = async () => {
        if (!current) return setError('Mot de passe actuel requis.');
        if (newPwd.length < 8) return setError('Le nouveau mot de passe doit faire au moins 8 caractères.');
        if (newPwd !== confirm) return setError('Les mots de passe ne correspondent pas.');
        setSaving(true); setError('');
        try {
            await api.patch('/user/password', { currentPassword: current, newPassword: newPwd });
            setCurrent(''); setNewPwd(''); setConfirm('');
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors du changement.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deletePwd) return setDeleteErr('Mot de passe requis.');
        setDeleting(true); setDeleteErr('');
        try {
            await api.delete('/user/account', { data: { password: deletePwd } });
            onDelete();
        } catch (err) {
            setDeleteErr(err.response?.data?.error || 'Erreur lors de la suppression.');
            setDeleting(false);
        }
    };

    return (
        <Stack spacing={3} sx={{ maxWidth: 560 }}>
            {/* Change password */}
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
                <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <LockRounded sx={{ color: 'primary.main' }} />
                        <Typography variant="h6" fontWeight={700}>Changer le mot de passe</Typography>
                    </Box>

                    <Stack spacing={2.5}>
                        <TextField
                            label="Mot de passe actuel" type={showC ? 'text' : 'password'}
                            value={current} onChange={(e) => setCurrent(e.target.value)} fullWidth
                            InputProps={{ endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowC(!showC)} edge="end" size="small">
                                            {showC ? <VisibilityOffRounded fontSize="small" /> : <VisibilityRounded fontSize="small" />}
                                        </IconButton>
                                    </InputAdornment>
                                )}}
                        />
                        <Box>
                            <TextField
                                label="Nouveau mot de passe" type={showN ? 'text' : 'password'}
                                value={newPwd} onChange={(e) => setNewPwd(e.target.value)} fullWidth
                                InputProps={{ endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowN(!showN)} edge="end" size="small">
                                                {showN ? <VisibilityOffRounded fontSize="small" /> : <VisibilityRounded fontSize="small" />}
                                            </IconButton>
                                        </InputAdornment>
                                    )}}
                            />
                            {strength && (
                                <Box sx={{ mt: 1 }}>
                                    <LinearProgress
                                        variant="determinate" value={strengthValue}
                                        sx={{ height: 4, borderRadius: 2, '& .MuiLinearProgress-bar': { bgcolor: strengthColor } }}
                                    />
                                    <Typography variant="caption" sx={{ color: strengthColor, fontWeight: 600 }}>{strength}</Typography>
                                </Box>
                            )}
                        </Box>
                        <TextField
                            label="Confirmer le nouveau mot de passe" type="password"
                            value={confirm} onChange={(e) => setConfirm(e.target.value)} fullWidth
                            error={!!confirm && confirm !== newPwd}
                            helperText={confirm && confirm !== newPwd ? 'Les mots de passe ne correspondent pas' : ''}
                        />

                        {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

                        <Button
                            variant="contained" onClick={handleSave} disabled={saving}
                            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <LockRounded />}
                            sx={{ alignSelf: 'flex-start', fontWeight: 700, borderRadius: 2, px: 3 }}
                        >
                            {saving ? 'Enregistrement…' : 'Mettre à jour'}
                        </Button>
                    </Stack>
                </CardContent>
            </Card>

            {/* Danger zone */}
            <Card elevation={0} sx={{ border: '1.5px solid #EF444444', borderRadius: 2.5 }}>
                <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <WarningAmberRounded sx={{ color: '#EF4444' }} />
                        <Typography variant="h6" fontWeight={700} color="error">Zone dangereuse</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" mb={2.5}>
                        La suppression de ton compte est irréversible. Toutes tes données (progression, XP, historique) seront définitivement perdues.
                    </Typography>
                    <Button
                        variant="outlined" color="error"
                        startIcon={<DeleteForeverRounded />}
                        onClick={() => setDeleteOpen(true)}
                        sx={{ fontWeight: 700, borderRadius: 2 }}
                    >
                        Supprimer mon compte
                    </Button>
                </CardContent>
            </Card>

            {/* Delete dialog */}
            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle sx={{ fontWeight: 700, color: '#EF4444' }}>
                    ⚠️ Supprimer le compte ?
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Cette action est <strong>irréversible</strong>. Confirme avec ton mot de passe.
                    </Typography>
                    <TextField
                        label="Mot de passe" type="password" fullWidth
                        value={deletePwd} onChange={(e) => setDeletePwd(e.target.value)}
                        error={!!deleteErr} helperText={deleteErr}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <Button onClick={() => { setDeleteOpen(false); setDeletePwd(''); setDeleteErr(''); }} variant="outlined" sx={{ borderRadius: 2 }}>
                        Annuler
                    </Button>
                    <Button onClick={handleDelete} variant="contained" color="error" disabled={deleting} sx={{ borderRadius: 2, fontWeight: 700 }}>
                        {deleting ? <CircularProgress size={18} color="inherit" /> : 'Supprimer'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity="success" variant="filled" sx={{ fontWeight: 600 }}>Mot de passe mis à jour ✓</Alert>
            </Snackbar>
        </Stack>
    );
}

// ── Tab: Progression ──────────────────────────────────────────────────────────

function ProgressionTab({ data }) {
    const { stats, lessonProgress } = data;
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const completedLessons  = (lessonProgress || []).filter((p) => p.status === 'COMPLETED');
    const inProgressLessons = (lessonProgress || []).filter((p) => p.status === 'IN_PROGRESS');

    return (
        <Grid container spacing={2.5}>
            {/* Quiz stats */}
            <Grid item xs={12} md={6}>
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5, height: '100%' }}>
                    <CardContent sx={{ p: 2.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                            <SchoolRounded sx={{ color: '#1A6EFF', fontSize: 20 }} />
                            <Typography variant="h6" fontWeight={700}>Quiz</Typography>
                        </Box>
                        <Stack spacing={1.5}>
                            {[
                                { label: 'Questions répondues', value: stats.quiz.totalAnswered, color: '#1A6EFF' },
                                { label: 'Réponses correctes',  value: stats.quiz.totalCorrect,  color: '#22C55E' },
                                { label: 'Précision globale',   value: `${stats.quiz.accuracy}%`, color: '#F59E0B' },
                                { label: 'XP gagnés (quiz)',    value: `+${stats.quiz.totalXpQuiz}`, color: '#8B5CF6' },
                            ].map(({ label, value, color }) => (
                                <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.25, borderRadius: 1.5, bgcolor: 'action.hover' }}>
                                    <Typography variant="body2" color="text.secondary">{label}</Typography>
                                    <Typography variant="body2" fontWeight={700} sx={{ color }}>{value}</Typography>
                                </Box>
                            ))}
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>

            {/* Lesson stats */}
            <Grid item xs={12} md={6}>
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5, height: '100%' }}>
                    <CardContent sx={{ p: 2.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                            <AutoStoriesRounded sx={{ color: '#22C55E', fontSize: 20 }} />
                            <Typography variant="h6" fontWeight={700}>Leçons</Typography>
                        </Box>
                        <Stack spacing={1.5}>
                            {[
                                { label: 'Leçons validées',    value: stats.lessons.completed,   color: '#22C55E' },
                                { label: 'En cours',            value: stats.lessons.inProgress,  color: '#F59E0B' },
                                { label: 'XP gagnés (leçons)', value: `+${stats.lessons.totalXpLessons}`, color: '#8B5CF6' },
                            ].map(({ label, value, color }) => (
                                <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.25, borderRadius: 1.5, bgcolor: 'action.hover' }}>
                                    <Typography variant="body2" color="text.secondary">{label}</Typography>
                                    <Typography variant="body2" fontWeight={700} sx={{ color }}>{value}</Typography>
                                </Box>
                            ))}
                        </Stack>

                        {/* Recently completed lessons */}
                        {completedLessons.length > 0 && (
                            <>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="body2" fontWeight={700} color="text.secondary" mb={1}>
                                    Dernières leçons validées
                                </Typography>
                                <Stack spacing={0.75}>
                                    {completedLessons.slice(0, 5).map((p) => (
                                        <Box key={p.lessonId} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, borderRadius: 1.5, bgcolor: '#22C55E0A' }}>
                                            <CheckCircleRounded sx={{ color: '#22C55E', fontSize: 14, flexShrink: 0 }} />
                                            <Typography variant="caption" flex={1} noWrap sx={{ fontWeight: 600 }}>{p.lessonId}</Typography>
                                            <Typography variant="caption" color="#22C55E" fontWeight={700}>+{p.xpEarned} XP</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </>
                        )}
                    </CardContent>
                </Card>
            </Grid>

            {/* XP breakdown */}
            <Grid item xs={12}>
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
                    <CardContent sx={{ p: 2.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <BoltRounded sx={{ color: '#F59E0B', fontSize: 20 }} />
                            <Typography variant="h6" fontWeight={700}>Total XP : {stats.totalXp}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                            {[
                                { label: 'Quiz',    value: stats.quiz.totalXpQuiz,         color: '#1A6EFF', pct: stats.totalXp ? Math.round((stats.quiz.totalXpQuiz / stats.totalXp) * 100) : 0 },
                                { label: 'Leçons', value: stats.lessons.totalXpLessons,   color: '#22C55E', pct: stats.totalXp ? Math.round((stats.lessons.totalXpLessons / stats.totalXp) * 100) : 0 },
                            ].map(({ label, value, color, pct }) => (
                                <Box key={label} flex={1} minWidth={140}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                                        <Typography variant="body2" fontWeight={600} sx={{ color }}>{label}</Typography>
                                        <Typography variant="body2" color="text.secondary">+{value} XP · {pct}%</Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate" value={pct}
                                        sx={{ height: 8, borderRadius: 4, '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 4 } }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ProfilePage() {
    const dispatch = useDispatch();
    const authUser = useSelector((s) => s.auth.user);

    const [tab,     setTab]     = useState(0);
    const [data,    setData]    = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState('');

    const load = async () => {
        setLoading(true);
        setError('');
        try {
            const { data: d } = await api.get('/user');
            setData(d);
        } catch (err) {
            const status = err.response?.status;
            if (status === 404) {
                setError('Route introuvable (404). Vérifie que app.use("/api/user", userRouter) est déclaré dans app.js.');
            } else if (status === 401) {
                setError('Session expirée — reconnecte-toi.');
            } else {
                setError(err.response?.data?.error || `Erreur ${status || 'réseau'} lors du chargement du profil.`);
            }
            console.error('[ProfilePage] load error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleSaved = (updates) => {
        setData((prev) => ({ ...prev, user: { ...prev.user, ...updates } }));
    };

    const handleDelete = () => {
        // Déconnecter et rediriger
        dispatch({ type: 'auth/logout' });
        window.location.href = '/login';
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <CircularProgress />
        </Box>
    );

    if (error) return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
            <Alert severity="error" sx={{ maxWidth: 400, mx: 'auto' }}>{error}</Alert>
        </Box>
    );

    const tabs = [
        { label: 'Vue d\'ensemble', icon: <PersonRounded sx={{ fontSize: 18 }} /> },
        { label: 'Informations',   icon: <EditRounded    sx={{ fontSize: 18 }} /> },
        { label: 'Progression',    icon: <TrendingUpRounded sx={{ fontSize: 18 }} /> },
        { label: 'Sécurité',       icon: <LockRounded    sx={{ fontSize: 18 }} /> },
    ];

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} mb={3}>Mon profil</Typography>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ '& .MuiTab-root': { fontWeight: 600, fontSize: 13, minHeight: 48, textTransform: 'none' } }}
                >
                    {tabs.map((t, i) => (
                        <Tab key={i} label={t.label} icon={t.icon} iconPosition="start" />
                    ))}
                </Tabs>
            </Box>

            {/* Tab content */}
            {tab === 0 && <OverviewTab    data={data} />}
            {tab === 1 && <InfoTab        data={data} onSaved={handleSaved} />}
            {tab === 2 && <ProgressionTab data={data} />}
            {tab === 3 && <SecurityTab    onDelete={handleDelete} />}
        </Box>
    );
}