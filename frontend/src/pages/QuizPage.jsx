import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Alert,
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
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Typography,
} from '@mui/material';
import {
    ArrowForwardRounded,
    AutoStoriesRounded,
    BoltRounded,
    CancelRounded,
    CheckCircleRounded,
    EmojiEventsRounded,
    RefreshRounded,
    SchoolRounded,
    SentimentNeutralRounded,
    SentimentVeryDissatisfiedRounded,
    SentimentVerySatisfiedRounded,
    StopRounded,
    TrendingUpRounded,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { clearLevelUp, fetchQuestions, nextQuestion, resetSession, setFilters, submitAnswer } from '../store/slices/quizSlice';

const LEVELS     = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const CATEGORIES = ['', 'GRAMMAR', 'VOCABULARY', 'READING', 'LISTENING'];

const LEVEL_COLORS = {
    A1: '#22C55E', A2: '#84CC16', B1: '#F59E0B',
    B2: '#F97316', C1: '#EF4444', C2: '#8B5CF6',
};
const LEVEL_BG = {
    A1: '#dcfce7', A2: '#ecfccb', B1: '#fef9c3',
    B2: '#ffedd5', C1: '#fee2e2', C2: '#ede9fe',
};
const CAT_LABELS = {
    '': 'Toutes / All',
    GRAMMAR: 'Grammaire / Grammar',
    VOCABULARY: 'Vocabulaire / Vocabulary',
    READING: 'Lecture / Reading',
    LISTENING: 'Écoute / Listening',
};

// ─── Stop confirmation dialog ─────────────────────────────────────────────────

function StopDialog({ open, onConfirm, onCancel, answeredCount, totalCount }) {
    return (
        <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
                ⏹ Arrêter le quiz ?
            </DialogTitle>
            <DialogContent>
                <Typography color="text.secondary" variant="body2">
                    Tu as répondu à <strong>{answeredCount}</strong> question{answeredCount > 1 ? 's' : ''} sur <strong>{totalCount}</strong>.
                    Ton score partiel sera sauvegardé, mais le quiz ne sera pas validé.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                <Button onClick={onCancel} variant="outlined" sx={{ borderRadius: 2 }}>
                    Continuer
                </Button>
                <Button onClick={onConfirm} variant="contained" color="error" sx={{ borderRadius: 2 }}>
                    Arrêter
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// ─── Validate confirmation dialog ─────────────────────────────────────────────

function ValidateDialog({ open, onConfirm, onCancel, remaining }) {
    return (
        <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
                ✅ Valider le quiz ?
            </DialogTitle>
            <DialogContent>
                <Typography color="text.secondary" variant="body2">
                    Il reste encore <strong>{remaining}</strong> question{remaining > 1 ? 's' : ''}.
                    Veux-tu valider maintenant et voir ton résultat ?
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                <Button onClick={onCancel} variant="outlined" sx={{ borderRadius: 2 }}>
                    Continuer
                </Button>
                <Button onClick={onConfirm} variant="contained" color="success" sx={{ borderRadius: 2 }}>
                    Valider
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// ─── Setup ────────────────────────────────────────────────────────────────────

function QuizSetup({ filters, onStart, loading }) {
    const dispatch = useDispatch();
    const [hovered, setHovered] = useState(null);
    const levelSelect = (l) => dispatch(setFilters({ level: l }));

    return (
        <Box sx={{ maxWidth: 520, mx: 'auto', pt: 2 }}>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Box sx={{
                    width: 72, height: 72, borderRadius: '20px', mx: 'auto', mb: 2.5,
                    background: 'linear-gradient(135deg, #1A6EFF 0%, #0D4FC2 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 12px 32px rgba(26,110,255,0.25)',
                }}>
                    <SchoolRounded sx={{ color: 'white', fontSize: 34 }} />
                </Box>
                <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: -0.5 }}>
                    Quiz
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    Choisissez votre niveau et lancez-vous
                </Typography>
            </Box>

            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.5, fontWeight: 700, display: 'block', mb: 1.5 }}>
                Niveau / Level
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 3.5, flexWrap: 'wrap' }}>
                {LEVELS.map((l) => {
                    const active = filters.level === l;
                    return (
                        <Box
                            key={l}
                            onClick={() => levelSelect(l)}
                            onMouseEnter={() => setHovered(l)}
                            onMouseLeave={() => setHovered(null)}
                            sx={{
                                flex: 1, minWidth: 68, textAlign: 'center',
                                py: 1.5, px: 1, borderRadius: 2, cursor: 'pointer',
                                fontWeight: 800, fontSize: 15, letterSpacing: 0.5,
                                border: '2px solid',
                                transition: 'all 0.16s ease',
                                borderColor: active ? LEVEL_COLORS[l] : 'divider',
                                bgcolor: active ? LEVEL_BG[l] : hovered === l ? 'action.hover' : 'background.paper',
                                color: active ? LEVEL_COLORS[l] : 'text.secondary',
                                transform: active ? 'scale(1.04)' : 'scale(1)',
                            }}
                        >
                            {l}
                        </Box>
                    );
                })}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3.5 }}>
                <FormControl fullWidth>
                    <InputLabel>Catégorie / Category</InputLabel>
                    <Select
                        value={filters.category}
                        label="Catégorie / Category"
                        onChange={(e) => dispatch(setFilters({ category: e.target.value }))}
                    >
                        {CATEGORIES.map((c) => (
                            <MenuItem key={c} value={c}>{CAT_LABELS[c]}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel>Nombre de questions</InputLabel>
                    <Select
                        value={filters.limit}
                        label="Nombre de questions"
                        onChange={(e) => dispatch(setFilters({ limit: e.target.value }))}
                    >
                        {[5, 10, 15, 20].map((n) => (
                            <MenuItem key={n} value={n}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {n} questions
                                    <Chip label={`~${n * 1.5} min`} size="small" sx={{ ml: 'auto', fontSize: 11, bgcolor: 'action.hover' }} />
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Button
                variant="contained" size="large" fullWidth
                onClick={onStart} disabled={loading}
                sx={{
                    py: 1.75, fontSize: 16, fontWeight: 700, borderRadius: 2.5,
                    background: 'linear-gradient(135deg, #1A6EFF 0%, #0D4FC2 100%)',
                    boxShadow: '0 8px 24px rgba(26,110,255,0.3)',
                    '&:hover': { boxShadow: '0 12px 32px rgba(26,110,255,0.4)' },
                }}
            >
                {loading
                    ? <CircularProgress size={22} color="inherit" />
                    : <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        Commencer le quiz <ArrowForwardRounded />
                    </Box>
                }
            </Button>
        </Box>
    );
}

// ─── QCM ──────────────────────────────────────────────────────────────────────

function ChoiceItem({ choice, index, answered, isSelected, isCorrect, isWrong, onSelect }) {
    const letter = String.fromCharCode(65 + index);
    return (
        <Box
            onClick={onSelect}
            sx={{
                p: 2, borderRadius: 2.5, border: '2px solid', cursor: answered ? 'default' : 'pointer',
                transition: 'all 0.18s ease',
                borderColor: isCorrect ? '#22C55E' : isWrong ? '#EF4444' : isSelected ? 'primary.main' : 'divider',
                bgcolor: isCorrect ? '#f0fdf4' : isWrong ? '#fef2f2' : isSelected ? 'primary.main' + '0d' : 'background.paper',
                display: 'flex', alignItems: 'center', gap: 1.5,
                '&:hover': !answered ? { borderColor: 'primary.main', bgcolor: 'primary.main' + '08' } : {},
            }}
        >
            <Box sx={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 12,
                bgcolor: isCorrect ? '#22C55E' : isWrong ? '#EF4444' : isSelected ? 'primary.main' : 'action.hover',
                color: (isCorrect || isWrong || isSelected) ? 'white' : 'text.secondary',
            }}>
                {letter}
            </Box>
            <Typography variant="body2" fontWeight={isSelected || isCorrect ? 600 : 400} flex={1}>
                {choice}
            </Typography>
            {isCorrect && <CheckCircleRounded sx={{ color: '#22C55E', fontSize: 18, flexShrink: 0 }} />}
            {isWrong   && <CancelRounded      sx={{ color: '#EF4444', fontSize: 18, flexShrink: 0 }} />}
        </Box>
    );
}

function QcmQuestion({ question, onSubmit, submitting, result }) {
    const [selected, setSelected] = useState(null);
    const answered = !!result;

    // choices peut arriver comme string JSON depuis la DB (Prisma Json field)
    const choices = (() => {
        const raw = question.choices;
        if (!raw) return [];
        if (Array.isArray(raw)) return raw;
        try { return JSON.parse(raw); } catch { return []; }
    })();

    useEffect(() => { setSelected(null); }, [question.id]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            {choices.map((choice, i) => {
                const isSelected = selected === choice;
                const isCorrect  = answered && choice === result.correctAnswer;
                const isWrong    = answered && isSelected && !result.isCorrect;
                return (
                    <ChoiceItem
                        key={i} choice={choice} index={i}
                        answered={answered} isSelected={isSelected || (answered && selected === choice)}
                        isCorrect={isCorrect} isWrong={isWrong}
                        onSelect={() => {
                            if (answered || submitting) return;
                            setSelected(choice);
                            onSubmit(choice);
                        }}
                    />
                );
            })}
        </Box>
    );
}

// ─── Open question ─────────────────────────────────────────────────────────────

function OpenQuestion({ question, onSubmit, submitting, result }) {
    const [value, setValue] = useState('');
    const answered = !!result;

    useEffect(() => { setValue(''); }, [question.id]);

    return (
        <Box>
            <Box
                component="input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && value.trim() && !answered && !submitting) onSubmit(value.trim());
                }}
                disabled={answered || submitting}
                placeholder="Type your answer…"
                sx={{
                    width: '100%', p: 1.75, fontSize: 15, fontWeight: 500,
                    borderRadius: 2, border: '2px solid',
                    borderColor: answered ? (result.isCorrect ? '#22C55E' : '#EF4444') : 'divider',
                    bgcolor: answered ? (result.isCorrect ? '#f0fdf4' : '#fef2f2') : 'background.paper',
                    color: 'text.primary', outline: 'none', fontFamily: 'inherit',
                    '&:focus': { borderColor: 'primary.main' },
                    transition: 'border-color 0.18s',
                    boxSizing: 'border-box',
                }}
            />
            {!answered && (
                <Button
                    variant="contained" fullWidth
                    onClick={() => value.trim() && onSubmit(value.trim())}
                    disabled={!value.trim() || submitting}
                    sx={{ mt: 1.5, borderRadius: 2, fontWeight: 700 }}
                >
                    {submitting ? <CircularProgress size={18} color="inherit" /> : 'Valider / Submit'}
                </Button>
            )}
        </Box>
    );
}

// ─── Feedback ────────────────────────────────────────────────────────────────

function ResultFeedback({ result }) {
    if (!result) return null;
    return (
        <Box sx={{
            mt: 2, p: 2, borderRadius: 2,
            bgcolor: result.isCorrect ? '#f0fdf4' : '#fef2f2',
            border: `1.5px solid ${result.isCorrect ? '#22C55E44' : '#EF444444'}`,
            animation: 'fadeIn 0.2s ease',
            '@keyframes fadeIn': { from: { opacity: 0, transform: 'translateY(4px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: result.explanation ? 1 : 0 }}>
                {result.isCorrect
                    ? <CheckCircleRounded sx={{ color: '#22C55E', fontSize: 18 }} />
                    : <CancelRounded      sx={{ color: '#EF4444', fontSize: 18 }} />
                }
                <Typography variant="body2" fontWeight={700} color={result.isCorrect ? '#22C55E' : '#EF4444'}>
                    {result.isCorrect ? `Correct ! +${result.score} XP` : `Incorrect — Réponse : ${result.correctAnswer}`}
                </Typography>
            </Box>
            {result.explanation && (
                <Typography variant="body2" color="text.secondary" sx={{ pl: 3.25 }}>
                    {result.explanation}
                </Typography>
            )}
        </Box>
    );
}

// ─── Session summary ──────────────────────────────────────────────────────────

function SessionSummary({ questions, answers, onRestart, wasValidated, onGoLessons }) {
    const totalAnswered  = Object.keys(answers).length;
    const correct        = Object.values(answers).filter((a) => a.isCorrect).length;
    const totalXp        = Object.values(answers).reduce((s, a) => s + a.score, 0);
    const accuracy       = totalAnswered ? Math.round((correct / totalAnswered) * 100) : 0;
    const allAnswered    = totalAnswered === questions.length;

    // "Terminé" si toutes les questions ont été répondues (naturellement ou via Valider)
    const isCompleted = allAnswered || wasValidated;

    const Icon = accuracy >= 80
        ? SentimentVerySatisfiedRounded
        : accuracy >= 50
            ? SentimentNeutralRounded
            : SentimentVeryDissatisfiedRounded;

    const color = accuracy >= 80 ? '#22C55E' : accuracy >= 50 ? '#F59E0B' : '#EF4444';

    const title = isCompleted ? 'Quiz terminé ! 🎉' : 'Quiz arrêté';
    const chipLabel = isCompleted ? 'Résultats sauvegardés' : `${totalAnswered}/${questions.length} questions répondues`;
    const chipColor = isCompleted ? '#22C55E' : '#F59E0B';

    return (
        <Box sx={{ maxWidth: 500, mx: 'auto', textAlign: 'center', pt: 2 }}>
            <Icon sx={{ fontSize: 72, color, mb: 2 }} />
            <Typography variant="h4" fontWeight={800} mb={1}>
                {title}
            </Typography>

            <Chip
                icon={<EmojiEventsRounded sx={{ fontSize: '16px !important', color: `${chipColor} !important` }} />}
                label={chipLabel}
                sx={{ mb: 2, bgcolor: chipColor + '18', color: chipColor, fontWeight: 700 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                {[
                    { label: 'Questions', value: `${totalAnswered}/${questions.length}` },
                    { label: 'Réponses correctes', value: correct, color: '#22C55E' },
                    { label: 'XP gagnés', value: `+${totalXp}`, color: '#F59E0B' },
                    { label: 'Précision', value: `${accuracy}%`, color },
                ].map(({ label, value, color: c }) => (
                    <Box key={label} sx={{
                        p: 2, borderRadius: 2, minWidth: 100,
                        border: '1px solid', borderColor: 'divider',
                        bgcolor: 'background.paper',
                    }}>
                        <Typography variant="h5" fontWeight={800} sx={{ color: c || 'text.primary' }}>{value}</Typography>
                        <Typography variant="caption" color="text.secondary">{label}</Typography>
                    </Box>
                ))}
            </Box>

            {/* Per-question recap */}
            <Box sx={{ textAlign: 'left', mb: 3 }}>
                {questions.filter((q) => answers[q.id]).map((q, i) => {
                    const ans = answers[q.id];
                    return (
                        <Box key={q.id} sx={{
                            display: 'flex', alignItems: 'center', gap: 1.5,
                            p: 1.5, mb: 1, borderRadius: 2, bgcolor: 'action.hover',
                        }}>
                            <Typography variant="caption" color="text.disabled" sx={{ minWidth: 20, flexShrink: 0 }}>
                                {i + 1}.
                            </Typography>
                            {ans.isCorrect
                                ? <CheckCircleRounded sx={{ color: '#22C55E', fontSize: 16, flexShrink: 0 }} />
                                : <CancelRounded      sx={{ color: '#EF4444', fontSize: 16, flexShrink: 0 }} />
                            }
                            <Typography variant="body2" flex={1} noWrap sx={{ fontSize: 13 }}>{q.question}</Typography>
                            <Typography variant="caption" fontWeight={700} color={ans.isCorrect ? '#22C55E' : 'text.disabled'} sx={{ flexShrink: 0 }}>
                                +{ans.score} XP
                            </Typography>
                        </Box>
                    );
                })}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                    variant="outlined" size="large" onClick={onGoLessons}
                    startIcon={<AutoStoriesRounded />}
                    sx={{
                        py: 1.5, px: 3, borderRadius: 2.5, fontWeight: 700,
                        borderColor: '#22C55E', color: '#22C55E',
                        '&:hover': { bgcolor: '#22C55E12', borderColor: '#22C55E' },
                    }}
                >
                    Voir les leçons
                </Button>
                <Button
                    variant="contained" size="large" onClick={onRestart}
                    startIcon={<RefreshRounded />}
                    sx={{
                        py: 1.5, px: 3, borderRadius: 2.5, fontWeight: 700,
                        background: 'linear-gradient(135deg, #1A6EFF 0%, #0D4FC2 100%)',
                        boxShadow: '0 8px 24px rgba(26,110,255,0.3)',
                    }}
                >
                    Nouveau quiz
                </Button>
            </Box>
        </Box>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function QuizPage() {
    const dispatch  = useDispatch();
    const navigate  = useNavigate();
    const { questions, currentIndex, answers, sessionComplete, filters, loading, submitting, levelUp } =
        useSelector((s) => s.quiz);

    const [stopDialogOpen,     setStopDialogOpen]     = useState(false);
    const [validateDialogOpen, setValidateDialogOpen] = useState(false);
    const [wasValidated,       setWasValidated]       = useState(false);
    const [levelUpSnack,       setLevelUpSnack]       = useState(null); // { from, to }

    const started         = questions.length > 0;
    const currentQuestion = questions[currentIndex];
    const currentAnswer   = currentQuestion ? answers[currentQuestion.id] : null;
    const answeredCount   = Object.keys(answers).length;
    const remaining       = questions.length - answeredCount;
    const allAnswered     = answeredCount === questions.length;

    // Reset wasValidated on new session
    useEffect(() => {
        if (!started) setWasValidated(false);
    }, [started]);

    // Déclencher le snackbar dès que levelUp est détecté dans le slice
    useEffect(() => {
        if (levelUp) {
            setLevelUpSnack(levelUp);
            dispatch(clearLevelUp());
        }
    }, [levelUp]);

    if (loading) return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, gap: 2 }}>
            <CircularProgress size={40} />
            <Typography color="text.secondary">Chargement des questions…</Typography>
        </Box>
    );

    if (!started) return (
        <QuizSetup
            filters={filters}
            onStart={() => dispatch(fetchQuestions(filters))}
            loading={loading}
        />
    );

    if (sessionComplete) return (
        <SessionSummary
            questions={questions}
            answers={answers}
            wasValidated={wasValidated}
            onRestart={() => { dispatch(resetSession()); setWasValidated(false); }}
            onGoLessons={() => navigate('/lessons')}
        />
    );

    const levelColor = LEVEL_COLORS[currentQuestion?.level] || '#1A6EFF';

    const handleStop = () => {
        setStopDialogOpen(false);
        setWasValidated(false);
        dispatch(resetSession());
    };

    const handleValidate = () => {
        setValidateDialogOpen(false);
        setWasValidated(true);
        // Force session complete with current answers
        dispatch(nextQuestion({ forceComplete: true }));
    };

    return (
        <Box sx={{ maxWidth: 620, mx: 'auto' }}>
            {/* Progress header */}
            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.25 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={700} color="text.secondary">
                            {currentIndex + 1}
                        </Typography>
                        <Typography variant="body2" color="text.disabled">
                            / {questions.length}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
                        <Chip
                            label={currentQuestion?.level}
                            size="small"
                            sx={{ fontWeight: 800, fontSize: 11, height: 22, bgcolor: levelColor + '18', color: levelColor, border: `1px solid ${levelColor}44` }}
                        />
                        <Chip label={currentQuestion?.category} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: 11, height: 22 }} />

                        {/* Stop button */}
                        <Button
                            size="small" color="error" variant="outlined"
                            startIcon={<StopRounded />}
                            onClick={() => setStopDialogOpen(true)}
                            sx={{ ml: 1, height: 26, fontSize: 11, fontWeight: 700, px: 1.25, borderRadius: 1.5 }}
                        >
                            Arrêter
                        </Button>

                        {/* Validate button (shown when at least 1 question answered) */}
                        {answeredCount > 0 && !allAnswered && (
                            <Button
                                size="small" color="success" variant="outlined"
                                startIcon={<CheckCircleRounded />}
                                onClick={() => setValidateDialogOpen(true)}
                                sx={{ height: 26, fontSize: 11, fontWeight: 700, px: 1.25, borderRadius: 1.5 }}
                            >
                                Valider
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* Segmented progress bar */}
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {questions.map((q, i) => {
                        const ans       = answers[q.id];
                        const isCurrent = i === currentIndex;
                        return (
                            <Box key={i} sx={{
                                flex: 1, height: 5, borderRadius: 1, transition: 'all 0.3s ease',
                                bgcolor: ans
                                    ? (ans.isCorrect ? '#22C55E' : '#EF4444')
                                    : isCurrent ? levelColor + '60' : 'action.hover',
                            }} />
                        );
                    })}
                </Box>
            </Box>

            {/* Question card */}
            <Card
                elevation={0}
                sx={{ border: '1.5px solid', borderColor: 'divider', borderRadius: 3, overflow: 'visible',
                    animation: 'cardIn 0.22s ease',
                    '@keyframes cardIn': { from: { opacity: 0, transform: 'translateY(6px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
                }}
                key={currentIndex}
            >
                <Box sx={{ height: 4, bgcolor: levelColor, borderRadius: '12px 12px 0 0' }} />
                <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                    <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.55, mb: 2.5, fontSize: { xs: 16, sm: 18 } }}>
                        {currentQuestion?.question}
                    </Typography>
                    <Divider sx={{ mb: 2.5 }} />

                    {currentQuestion?.type === 'QCM' ? (
                        <QcmQuestion
                            question={currentQuestion}
                            questionIndex={currentIndex}
                            onSubmit={(a) => dispatch(submitAnswer({ questionId: currentQuestion.id, userAnswer: a }))}
                            submitting={submitting}
                            result={currentAnswer}
                        />
                    ) : (
                        <OpenQuestion
                            question={currentQuestion}
                            questionIndex={currentIndex}
                            onSubmit={(a) => dispatch(submitAnswer({ questionId: currentQuestion.id, userAnswer: a }))}
                            submitting={submitting}
                            result={currentAnswer}
                        />
                    )}

                    <ResultFeedback result={currentAnswer} />

                    {currentAnswer && (
                        <Button
                            variant="contained" fullWidth
                            endIcon={<ArrowForwardRounded />}
                            onClick={() => dispatch(nextQuestion())}
                            sx={{
                                mt: 2.5, py: 1.4, borderRadius: 2, fontWeight: 700,
                                background: 'linear-gradient(135deg, #1A6EFF 0%, #0D4FC2 100%)',
                                animation: 'fadeUp 0.2s ease',
                                '@keyframes fadeUp': { from: { opacity: 0, transform: 'translateY(6px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
                            }}
                        >
                            {currentIndex < questions.length - 1 ? 'Question suivante / Next' : 'Voir les résultats / Results'}
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* XP streak */}
            {answeredCount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#F59E0B', fontSize: 13, fontWeight: 700 }}>
                        <BoltRounded sx={{ fontSize: 16 }} />
                        {Object.values(answers).reduce((s, a) => s + a.score, 0)} XP
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#22C55E', fontSize: 13, fontWeight: 700 }}>
                        <CheckCircleRounded sx={{ fontSize: 16 }} />
                        {Object.values(answers).filter((a) => a.isCorrect).length} correct
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#EF4444', fontSize: 13, fontWeight: 700 }}>
                        <CancelRounded sx={{ fontSize: 16 }} />
                        {Object.values(answers).filter((a) => !a.isCorrect).length} incorrect
                    </Box>
                </Box>
            )}

            {/* Dialogs */}
            <StopDialog
                open={stopDialogOpen}
                onCancel={() => setStopDialogOpen(false)}
                onConfirm={handleStop}
                answeredCount={answeredCount}
                totalCount={questions.length}
            />
            <ValidateDialog
                open={validateDialogOpen}
                onCancel={() => setValidateDialogOpen(false)}
                onConfirm={handleValidate}
                remaining={remaining}
            />

            {/* Level-up notification */}
            <Snackbar
                open={!!levelUpSnack}
                autoHideDuration={6000}
                onClose={() => setLevelUpSnack(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    icon={<TrendingUpRounded />}
                    onClose={() => setLevelUpSnack(null)}
                    sx={{
                        fontWeight: 700, fontSize: 15,
                        bgcolor: '#8B5CF6',
                        '& .MuiAlert-icon': { alignItems: 'center' },
                    }}
                >
                    🎉 Niveau débloqué ! Tu passes de <strong style={{ margin: '0 4px' }}>{levelUpSnack?.from}</strong> à <strong style={{ margin: '0 4px' }}>{levelUpSnack?.to}</strong>
                </Alert>
            </Snackbar>
        </Box>
    );
}