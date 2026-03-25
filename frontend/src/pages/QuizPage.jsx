import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, Chip,
  Select, MenuItem, FormControl, InputLabel, LinearProgress,
  Alert, Stack, CircularProgress, Collapse, Divider, useTheme, Grid,
} from '@mui/material';
import {
  CheckCircleRounded, CancelRounded, ArrowForwardRounded,
  RefreshRounded, EmojiEventsRounded, SchoolRounded,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchQuestions, submitAnswer, nextQuestion,
  resetSession, setFilters,
} from '../store/slices/quizSlice';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const CATEGORIES = ['', 'GRAMMAR', 'VOCABULARY', 'READING', 'LISTENING'];
const LEVEL_COLORS = { A1: '#22C55E', A2: '#84CC16', B1: '#F59E0B', B2: '#F97316', C1: '#EF4444', C2: '#8B5CF6' };

function QuizSetup({ filters, onStart, loading }) {
  const dispatch = useDispatch();
  return (
    <Box sx={{ maxWidth: 500, mx: 'auto' }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{
          width: 72, height: 72, borderRadius: '20px', mx: 'auto', mb: 2,
          background: 'linear-gradient(135deg, #1A6EFF 0%, #0D4FC2 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(26,110,255,0.3)',
        }}>
          <SchoolRounded sx={{ color: 'white', fontSize: 36 }} />
        </Box>
        <Typography variant="h5" fontWeight={700}>Configure your quiz</Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Choose your level and category to get started
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <FormControl fullWidth>
            <InputLabel>Level</InputLabel>
            <Select
              value={filters.level}
              label="Level"
              onChange={(e) => dispatch(setFilters({ level: e.target.value }))}
            >
              {LEVELS.map((l) => (
                <MenuItem key={l} value={l}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: LEVEL_COLORS[l] }} />
                    {l}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category}
              label="Category"
              onChange={(e) => dispatch(setFilters({ category: e.target.value }))}
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>{c || 'All categories'}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Number of questions</InputLabel>
            <Select
              value={filters.limit}
              label="Number of questions"
              onChange={(e) => dispatch(setFilters({ limit: e.target.value }))}
            >
              {[5, 10, 15, 20].map((n) => (
                <MenuItem key={n} value={n}>{n} questions</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={onStart}
            disabled={loading}
            sx={{ mt: 1, py: 1.5 }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : 'Start quiz →'}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

function QcmQuestion({ question, onSubmit, submitting, result }) {
  const [selected, setSelected] = useState(null);
  const choices = Array.isArray(question.choices) ? question.choices : JSON.parse(question.choices || '[]');
  const answered = !!result;

  const handleSubmit = () => { if (selected !== null) onSubmit(choices[selected]); };

  const getChoiceColor = (choice) => {
    if (!answered) return selected === choices.indexOf(choice) ? 'primary' : 'default';
    if (choice === result?.correctAnswer) return 'success';
    if (choice === result?.userAnswer && !result?.isCorrect) return 'error';
    return 'default';
  };

  return (
    <Box>
      <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
        {choices.map((choice, i) => {
          const isSelected = selected === i;
          const isCorrect = answered && choice === result?.correctAnswer;
          const isWrong = answered && choice === result?.userAnswer && !result?.isCorrect;
          return (
            <Grid item xs={12} sm={6} key={i}>
              <Box
                onClick={() => !answered && setSelected(i)}
                sx={{
                  p: 2, borderRadius: 3, border: '2px solid',
                  cursor: answered ? 'default' : 'pointer',
                  transition: 'all 0.15s ease',
                  borderColor: isCorrect ? 'success.main' : isWrong ? 'error.main'
                    : isSelected ? 'primary.main' : 'divider',
                  bgcolor: isCorrect ? 'success.main' + '12' : isWrong ? 'error.main' + '12'
                    : isSelected ? 'primary.main' + '12' : 'background.default',
                  display: 'flex', alignItems: 'center', gap: 1.5,
                  '&:hover': !answered ? { borderColor: 'primary.main', bgcolor: 'primary.main' + '08' } : {},
                }}
              >
                <Box sx={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderColor: isCorrect ? 'success.main' : isWrong ? 'error.main'
                    : isSelected ? 'primary.main' : 'divider',
                  bgcolor: isSelected && !answered ? 'primary.main' : 'transparent',
                }}>
                  {isCorrect && <CheckCircleRounded sx={{ fontSize: 16, color: 'success.main' }} />}
                  {isWrong && <CancelRounded sx={{ fontSize: 16, color: 'error.main' }} />}
                  {!answered && (
                    <Typography variant="caption" fontWeight={700}
                      sx={{ color: isSelected ? 'white' : 'text.secondary' }}>
                      {String.fromCharCode(65 + i)}
                    </Typography>
                  )}
                </Box>
                <Typography variant="body2" fontWeight={isSelected || isCorrect ? 600 : 400}>
                  {choice}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {!answered && (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={selected === null || submitting}
          fullWidth sx={{ mt: 3, py: 1.4 }}
        >
          {submitting ? <CircularProgress size={20} color="inherit" /> : 'Confirm answer'}
        </Button>
      )}
    </Box>
  );
}

function OpenQuestion({ question, onSubmit, submitting, result }) {
  const [answer, setAnswer] = useState('');
  const answered = !!result;

  return (
    <Box>
      <TextField
        fullWidth multiline rows={3}
        label="Your answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={answered}
        placeholder="Type your answer here..."
        sx={{ mt: 1 }}
      />
      {!answered && (
        <Button
          variant="contained" fullWidth
          onClick={() => onSubmit(answer)}
          disabled={!answer.trim() || submitting}
          sx={{ mt: 2, py: 1.4 }}
        >
          {submitting ? <CircularProgress size={20} color="inherit" /> : 'Submit answer'}
        </Button>
      )}
    </Box>
  );
}

function ResultFeedback({ result }) {
  if (!result) return null;
  return (
    <Collapse in={!!result}>
      <Alert
        severity={result.isCorrect ? 'success' : 'error'}
        sx={{ mt: 2, borderRadius: 2 }}
        icon={result.isCorrect ? <CheckCircleRounded /> : <CancelRounded />}
      >
        <Typography variant="body2" fontWeight={700}>
          {result.isCorrect ? `Correct! +${result.score} XP` : `Incorrect — correct answer: "${result.correctAnswer}"`}
        </Typography>
        {result.explanation && (
          <Typography variant="caption" display="block" mt={0.5} sx={{ opacity: 0.85 }}>
            {result.explanation}
          </Typography>
        )}
      </Alert>
    </Collapse>
  );
}

function SessionSummary({ questions, answers, onRestart }) {
  const total = questions.length;
  const correct = Object.values(answers).filter((a) => a.isCorrect).length;
  const score = Object.values(answers).reduce((s, a) => s + a.score, 0);
  const accuracy = total ? Math.round((correct / total) * 100) : 0;

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', textAlign: 'center' }}>
      <Box sx={{
        width: 88, height: 88, borderRadius: '24px', mx: 'auto', mb: 3,
        background: accuracy >= 80
          ? 'linear-gradient(135deg, #22C55E, #16A34A)'
          : accuracy >= 50
          ? 'linear-gradient(135deg, #F59E0B, #D97706)'
          : 'linear-gradient(135deg, #EF4444, #DC2626)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 12px 32px ${accuracy >= 80 ? '#22C55E' : accuracy >= 50 ? '#F59E0B' : '#EF4444'}44`,
      }}>
        <EmojiEventsRounded sx={{ color: 'white', fontSize: 44 }} />
      </Box>

      <Typography variant="h4" fontWeight={800} mb={0.5}>
        {accuracy >= 80 ? 'Excellent! 🎉' : accuracy >= 50 ? 'Good job! 👍' : 'Keep practicing 💪'}
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        You scored {correct} out of {total} questions
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-around">
            {[
              { label: 'Accuracy', value: `${accuracy}%` },
              { label: 'Correct', value: `${correct}/${total}` },
              { label: 'XP earned', value: `+${score}` },
            ].map(({ label, value }) => (
              <Box key={label}>
                <Typography variant="h5" fontWeight={800}>{value}</Typography>
                <Typography variant="caption" color="text.secondary">{label}</Typography>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Button
        variant="contained" size="large" fullWidth
        startIcon={<RefreshRounded />}
        onClick={onRestart}
        sx={{ py: 1.4 }}
      >
        Try again
      </Button>
    </Box>
  );
}

export default function QuizPage() {
  const dispatch = useDispatch();
  const { questions, currentIndex, answers, loading, submitting, sessionComplete, filters } = useSelector((s) => s.quiz);

  const started = questions.length > 0;
  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;

  const handleStart = () => {
    dispatch(fetchQuestions(filters));
  };

  const handleSubmit = (userAnswer) => {
    dispatch(submitAnswer({ questionId: currentQuestion.id, userAnswer }));
  };

  const handleNext = () => dispatch(nextQuestion());
  const handleRestart = () => dispatch(resetSession());

  if (!started && !loading) return (
    <QuizSetup filters={filters} onStart={handleStart} loading={loading} />
  );

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
      <CircularProgress />
    </Box>
  );

  if (sessionComplete) return (
    <SessionSummary questions={questions} answers={answers} onRestart={handleRestart} />
  );

  const progress = ((currentIndex + (currentAnswer ? 1 : 0)) / questions.length) * 100;

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto' }}>
      {/* Progress bar */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            Question {currentIndex + 1} of {questions.length}
          </Typography>
          <Stack direction="row" spacing={0.8}>
            <Chip label={currentQuestion?.level} size="small" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
            <Chip label={currentQuestion?.category} size="small" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
          </Stack>
        </Box>
        <LinearProgress variant="determinate" value={progress} />
      </Box>

      <Card>
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Typography variant="h6" fontWeight={700} mb={2.5} lineHeight={1.5}>
            {currentQuestion?.question}
          </Typography>

          <Divider sx={{ mb: 2.5 }} />

          {currentQuestion?.type === 'QCM' ? (
            <QcmQuestion
              question={currentQuestion}
              onSubmit={handleSubmit}
              submitting={submitting}
              result={currentAnswer}
            />
          ) : (
            <OpenQuestion
              question={currentQuestion}
              onSubmit={handleSubmit}
              submitting={submitting}
              result={currentAnswer}
            />
          )}

          <ResultFeedback result={currentAnswer} />

          {currentAnswer && (
            <Button
              variant="contained" fullWidth
              endIcon={<ArrowForwardRounded />}
              onClick={handleNext}
              sx={{ mt: 2, py: 1.4 }}
            >
              {currentIndex < questions.length - 1 ? 'Next question' : 'See results'}
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
