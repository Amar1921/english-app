import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Card, CardContent, Typography, Button, TextField, Chip,
    Select, MenuItem, FormControl, InputLabel, LinearProgress,
    Stack, CircularProgress, Divider,
} from '@mui/material';
import {
    CheckCircleRounded, CancelRounded, ArrowForwardRounded,
    RefreshRounded, EmojiEventsRounded, SchoolRounded,
    BoltRounded, TimerRounded, TrendingUpRounded,
    SentimentVerySatisfiedRounded, SentimentNeutralRounded, SentimentVeryDissatisfiedRounded,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchQuestions, submitAnswer, nextQuestion,
    resetSession, setFilters,
} from '../store/slices/quizSlice';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
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

// ─── Setup ────────────────────────────────────────────────────────────────────

function QuizSetup({ filters, onStart, loading }) {
    const dispatch = useDispatch();
    const [hovered, setHovered] = useState(null);

    const levelSelect = (l) => dispatch(setFilters({ level: l }));

    return (
        <Box sx={{ maxWidth: 520, mx: 'auto', pt: 2 }}>
            {/* Hero */}
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

            {/* Level picker — visual pills */}
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

            {/* Category + limit */}
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
                                    <Chip
                                        label={`~${n * 1.5} min`}
                                        size="small"
                                        sx={{ ml: 'auto', fontSize: 11, bgcolor: 'action.hover' }}
                                    />
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Start */}
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
                        Commencer le quiz
                        <ArrowForwardRounded />
                    </Box>
                }
            </Button>
        </Box>
    );
}

// ─── QCM ─────────────────────────────────────────────────────────────────────

function ChoiceItem({ choice, index, answered, isSelected, isCorrect, isWrong, onSelect }) {
    const letter = String.fromCharCode(65 + index);

    return (
        <Box
            onClick={onSelect}
            sx={{
                p: 2, borderRadius: 2.5,
                border: '2px solid',
                cursor: answered ? 'default' : 'pointer',
                transition: 'all 0.18s ease',
                borderColor: isCorrect ? '#22C55E' : isWrong ? '#EF4444' : isSelected ? 'primary.main' : 'divider',
                bgcolor: isCorrect ? '#f0fdf4' : isWrong ? '#fef2f2' : isSelected ? 'primary.main' + '0d' : 'background.paper',
                display: 'flex', alignItems: 'center', gap: 1.5,
                transform: isCorrect || isWrong ? 'scale(1.01)' : 'scale(1)',
                '&:hover': !answered ? {
                    borderColor: 'primary.main',
                    bgcolor: 'primary.main' + '08',
                    transform: 'translateX(3px)',
                } : {},
            }}
        >
            {/* Letter badge */}
            <Box sx={{
                width: 30, height: 30, borderRadius: '8px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 13,
                bgcolor: isCorrect ? '#22C55E' : isWrong ? '#EF4444'
                    : isSelected ? 'primary.main' : 'action.hover',
                color: isCorrect || isWrong || isSelected ? 'white' : 'text.secondary',
                transition: 'all 0.18s',
            }}>
                {isCorrect
                    ? <CheckCircleRounded sx={{ fontSize: 16 }} />
                    : isWrong
                        ? <CancelRounded sx={{ fontSize: 16 }} />
                        : letter}
            </Box>
            <Typography variant="body2" fontWeight={isSelected || isCorrect ? 600 : 400} sx={{ lineHeight: 1.5 }}>
                {choice}
            </Typography>
        </Box>
    );
}

function QcmQuestion({ question, questionIndex, onSubmit, submitting, result }) {
    const [selected, setSelected] = useState(null);
    const choices = Array.isArray(question.choices) ? question.choices : JSON.parse(question.choices || '[]');
    const answered = !!result;

    useEffect(() => { setSelected(null); }, [questionIndex]);

    return (
        <Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, mt: 1 }}>
                {choices.map((choice, i) => (
                    <ChoiceItem
                        key={i} choice={choice} index={i}
                        answered={answered} isSelected={selected === i}
                        isCorrect={answered && choice === result?.correctAnswer}
                        isWrong={answered && choice === result?.userAnswer && !result?.isCorrect}
                        onSelect={() => !answered && setSelected(i)}
                    />
                ))}
            </Box>
            {!answered && (
                <Button
                    variant="contained" fullWidth
                    onClick={() => onSubmit(choices[selected])}
                    disabled={selected === null || submitting}
                    sx={{ mt: 2.5, py: 1.4, borderRadius: 2, fontWeight: 700 }}
                >
                    {submitting ? <CircularProgress size={20} color="inherit" /> : 'Valider / Confirm'}
                </Button>
            )}
        </Box>
    );
}

// ─── Open ─────────────────────────────────────────────────────────────────────

function OpenQuestion({ question, questionIndex, onSubmit, submitting, result }) {
    const [answer, setAnswer] = useState('');
    const answered = !!result;

    useEffect(() => { setAnswer(''); }, [questionIndex]);

    return (
        <Box>
            <TextField
                fullWidth multiline rows={3}
                label="Votre réponse / Your answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={answered}
                placeholder="Écrivez votre réponse ici…"
                sx={{
                    mt: 1,
                    '& .MuiOutlinedInput-root': { borderRadius: 2 },
                }}
            />
            {!answered && (
                <Button
                    variant="contained" fullWidth
                    onClick={() => onSubmit(answer)}
                    disabled={!answer.trim() || submitting}
                    sx={{ mt: 2, py: 1.4, borderRadius: 2, fontWeight: 700 }}
                >
                    {submitting ? <CircularProgress size={20} color="inherit" /> : 'Soumettre / Submit'}
                </Button>
            )}
        </Box>
    );
}

// ─── Feedback ─────────────────────────────────────────────────────────────────

function ResultFeedback({ result }) {
    if (!result) return null;

    return (
        <Box
            sx={{
                mt: 2.5, p: 2, borderRadius: 2.5,
                border: '1.5px solid',
                borderColor: result.isCorrect ? '#86efac' : '#fca5a5',
                bgcolor: result.isCorrect ? '#f0fdf4' : '#fef2f2',
                animation: 'feedbackIn 0.25s ease',
                '@keyframes feedbackIn': {
                    from: { opacity: 0, transform: 'translateY(8px)' },
                    to:   { opacity: 1, transform: 'translateY(0)' },
                },
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Box sx={{
                    width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    bgcolor: result.isCorrect ? '#22C55E' : '#EF4444',
                }}>
                    {result.isCorrect
                        ? <CheckCircleRounded sx={{ color: 'white', fontSize: 20 }} />
                        : <CancelRounded sx={{ color: 'white', fontSize: 20 }} />}
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={700} sx={{ color: result.isCorrect ? '#15803d' : '#b91c1c', fontSize: 14 }}>
                        {result.isCorrect
                            ? `Correct ! +${result.score} XP 🎉`
                            : `Incorrect — Bonne réponse : "${result.correctAnswer}"`}
                    </Typography>
                    {result.explanation && (
                        <Typography variant="body2" sx={{ mt: 0.75, color: result.isCorrect ? '#166534' : '#991b1b', lineHeight: 1.6 }}>
                            {result.explanation}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

// ─── Summary ──────────────────────────────────────────────────────────────────

function MiniBar({ value, color }) {
    return (
        <Box sx={{ height: 6, borderRadius: 3, bgcolor: 'action.hover', overflow: 'hidden', mt: 0.75 }}>
            <Box sx={{
                height: '100%', width: `${value}%`, borderRadius: 3, bgcolor: color,
                transition: 'width 1s ease',
            }} />
        </Box>
    );
}

function SessionSummary({ questions, answers, onRestart }) {
    const total = questions.length;
    const correct = Object.values(answers).filter((a) => a.isCorrect).length;
    const score = Object.values(answers).reduce((s, a) => s + a.score, 0);
    const accuracy = total ? Math.round((correct / total) * 100) : 0;

    const mood =
        accuracy >= 80
            ? { label: 'Excellent !', sublabel: 'Outstanding performance', icon: <SentimentVerySatisfiedRounded sx={{ fontSize: 40 }} />, color: '#22C55E', bg: '#f0fdf4' }
            : accuracy >= 50
                ? { label: 'Bien joué !', sublabel: 'Good effort, keep going', icon: <SentimentNeutralRounded sx={{ fontSize: 40 }} />, color: '#F59E0B', bg: '#fffbeb' }
                : { label: 'Continuez !', sublabel: 'Practice makes perfect', icon: <SentimentVeryDissatisfiedRounded sx={{ fontSize: 40 }} />, color: '#EF4444', bg: '#fef2f2' };

    // Stats by category from answered questions
    const byCategory = {};
    questions.forEach((q) => {
        const ans = answers[q.id];
        if (!ans) return;
        if (!byCategory[q.category]) byCategory[q.category] = { total: 0, correct: 0 };
        byCategory[q.category].total++;
        if (ans.isCorrect) byCategory[q.category].correct++;
    });

    return (
        <Box sx={{ maxWidth: 480, mx: 'auto' }}>
            {/* Result card */}
            <Box sx={{
                textAlign: 'center', p: 4, borderRadius: 3, mb: 2.5,
                bgcolor: mood.bg,
                border: `1.5px solid ${mood.color}44`,
                animation: 'summaryIn 0.4s ease',
                '@keyframes summaryIn': {
                    from: { opacity: 0, transform: 'scale(0.96)' },
                    to:   { opacity: 1, transform: 'scale(1)' },
                },
            }}>
                <Box sx={{
                    width: 72, height: 72, borderRadius: '20px', mx: 'auto', mb: 2,
                    bgcolor: mood.color + '22', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: mood.color,
                }}>
                    {mood.icon}
                </Box>
                <Typography variant="h4" fontWeight={800} sx={{ color: mood.color, letterSpacing: -0.5 }}>
                    {mood.label}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
                    {mood.sublabel}
                </Typography>

                {/* 3 stats */}
                <Box sx={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2,
                    p: 2, borderRadius: 2, bgcolor: 'background.paper',
                }}>
                    {[
                        { label: 'Précision', value: `${accuracy}%`, icon: <TrendingUpRounded sx={{ fontSize: 18 }} />, color: mood.color },
                        { label: 'Correct', value: `${correct}/${total}`, icon: <CheckCircleRounded sx={{ fontSize: 18 }} />, color: '#22C55E' },
                        { label: 'XP gagnés', value: `+${score}`, icon: <BoltRounded sx={{ fontSize: 18 }} />, color: '#F59E0B' },
                    ].map(({ label, value, icon, color }) => (
                        <Box key={label} sx={{ textAlign: 'center' }}>
                            <Box sx={{ color, display: 'flex', justifyContent: 'center', mb: 0.5 }}>{icon}</Box>
                            <Typography fontWeight={800} fontSize={20}>{value}</Typography>
                            <Typography variant="caption" color="text.secondary">{label}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* By category */}
            {Object.keys(byCategory).length > 1 && (
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5, mb: 2.5 }}>
                    <CardContent>
                        <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ letterSpacing: 1.5 }}>
                            Par catégorie
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1.5 }}>
                            {Object.entries(byCategory).map(([cat, { total: t, correct: c }]) => {
                                const pct = Math.round((c / t) * 100);
                                return (
                                    <Box key={cat}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" fontWeight={600}>{cat}</Typography>
                                            <Typography variant="caption" color="text.secondary">{c}/{t} — {pct}%</Typography>
                                        </Box>
                                        <MiniBar
                                            value={pct}
                                            color={pct >= 80 ? '#22C55E' : pct >= 50 ? '#F59E0B' : '#EF4444'}
                                        />
                                    </Box>
                                );
                            })}
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Review — wrong answers */}
            {Object.entries(answers).some(([, a]) => !a.isCorrect) && (
                <Card elevation={0} sx={{ border: '1px solid', borderColor: '#fca5a5', borderRadius: 2.5, mb: 2.5 }}>
                    <CardContent>
                        <Typography variant="overline" fontWeight={700} sx={{ letterSpacing: 1.5, color: '#ef4444' }}>
                            À revoir / To review
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                            {questions
                                .filter((q) => answers[q.id] && !answers[q.id].isCorrect)
                                .slice(0, 4)
                                .map((q) => (
                                    <Box key={q.id} sx={{
                                        p: 1.5, borderRadius: 1.5,
                                        bgcolor: '#fef2f2', border: '1px solid #fecaca',
                                    }}>
                                        <Typography variant="body2" fontWeight={600} sx={{ color: '#991b1b', mb: 0.25 }} noWrap>
                                            {q.question}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#b91c1c' }}>
                                            ✓ {answers[q.id]?.correctAnswer}
                                        </Typography>
                                    </Box>
                                ))}
                        </Box>
                    </CardContent>
                </Card>
            )}

            <Button
                variant="contained" size="large" fullWidth
                startIcon={<RefreshRounded />}
                onClick={onRestart}
                sx={{
                    py: 1.6, borderRadius: 2.5, fontWeight: 700,
                    background: 'linear-gradient(135deg, #1A6EFF 0%, #0D4FC2 100%)',
                    boxShadow: '0 8px 24px rgba(26,110,255,0.25)',
                }}
            >
                Rejouer / Play again
            </Button>
        </Box>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function QuizPage() {
    const dispatch = useDispatch();
    const { questions, currentIndex, answers, loading, submitting, sessionComplete, filters } =
        useSelector((s) => s.quiz);

    const started = questions.length > 0;
    const currentQuestion = questions[currentIndex];
    const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;
    const progress = questions.length
        ? ((currentIndex + (currentAnswer ? 1 : 0)) / questions.length) * 100
        : 0;

    // Loading screen
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
            onRestart={() => dispatch(resetSession())}
        />
    );

    const levelColor = LEVEL_COLORS[currentQuestion?.level] || '#1A6EFF';

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
                    <Box sx={{ display: 'flex', gap: 0.75 }}>
                        <Chip
                            label={currentQuestion?.level}
                            size="small"
                            sx={{
                                fontWeight: 800, fontSize: 11, height: 22,
                                bgcolor: levelColor + '18', color: levelColor,
                                border: `1px solid ${levelColor}44`,
                            }}
                        />
                        <Chip
                            label={currentQuestion?.category}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 600, fontSize: 11, height: 22 }}
                        />
                    </Box>
                </Box>

                {/* Segmented progress bar */}
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {questions.map((q, i) => {
                        const ans = answers[q.id];
                        const isCurrent = i === currentIndex;
                        return (
                            <Box
                                key={i}
                                sx={{
                                    flex: 1, height: 5, borderRadius: 1,
                                    transition: 'all 0.3s ease',
                                    bgcolor: ans
                                        ? (ans.isCorrect ? '#22C55E' : '#EF4444')
                                        : isCurrent
                                            ? levelColor + '60'
                                            : 'action.hover',
                                }}
                            />
                        );
                    })}
                </Box>
            </Box>

            {/* Question card */}
            <Card
                elevation={0}
                sx={{
                    border: '1.5px solid', borderColor: 'divider', borderRadius: 3,
                    overflow: 'visible',
                    animation: 'cardIn 0.22s ease',
                    '@keyframes cardIn': {
                        from: { opacity: 0, transform: 'translateY(6px)' },
                        to:   { opacity: 1, transform: 'translateY(0)' },
                    },
                }}
                key={currentIndex} // forces remount + animation on question change
            >
                {/* Colored top accent */}
                <Box sx={{ height: 4, bgcolor: levelColor, borderRadius: '12px 12px 0 0' }} />

                <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                    {/* Question text */}
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ lineHeight: 1.55, mb: 2.5, fontSize: { xs: 16, sm: 18 } }}
                    >
                        {currentQuestion?.question}
                    </Typography>

                    <Divider sx={{ mb: 2.5 }} />

                    {/* Answer component */}
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

                    {/* Feedback */}
                    <ResultFeedback result={currentAnswer} />

                    {/* Next button */}
                    {currentAnswer && (
                        <Button
                            variant="contained" fullWidth
                            endIcon={<ArrowForwardRounded />}
                            onClick={() => dispatch(nextQuestion())}
                            sx={{
                                mt: 2.5, py: 1.4, borderRadius: 2, fontWeight: 700,
                                background: 'linear-gradient(135deg, #1A6EFF 0%, #0D4FC2 100%)',
                                animation: 'fadeUp 0.2s ease',
                                '@keyframes fadeUp': {
                                    from: { opacity: 0, transform: 'translateY(6px)' },
                                    to:   { opacity: 1, transform: 'translateY(0)' },
                                },
                            }}
                        >
                            {currentIndex < questions.length - 1
                                ? 'Question suivante / Next'
                                : 'Voir les résultats / Results'}
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* XP streak indicator */}
            {Object.values(answers).length > 0 && (
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
        </Box>
    );
}