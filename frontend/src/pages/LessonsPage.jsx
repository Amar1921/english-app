import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Chip, Stack,
  CircularProgress, Divider, Button, Select, MenuItem,
  FormControl, InputLabel, Alert, useTheme,
} from '@mui/material';
import {
  ArrowBackRounded, MenuBookRounded, LightbulbRounded,
  WarningAmberRounded, FormatQuoteRounded, CheckCircleRounded,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLessons, fetchLesson, clearCurrent } from '../store/slices/lessonsSlice';

const SUBJECT_COLORS = {
  GRAMMAR:     { bg: '#3B82F6', light: '#EFF6FF' },
  CONJUGATION: { bg: '#8B5CF6', light: '#F5F3FF' },
  SPELLING:    { bg: '#F59E0B', light: '#FFFBEB' },
  VOCABULARY:  { bg: '#10B981', light: '#ECFDF5' },
};

const SUBJECT_ICONS = {
  GRAMMAR: '📐', CONJUGATION: '🔄', SPELLING: '✏️', VOCABULARY: '📚',
};

const LEVEL_COLORS = {
  A1: '#22C55E', A2: '#84CC16', B1: '#F59E0B',
  B2: '#F97316', C1: '#EF4444', C2: '#8B5CF6',
};

const BLOCK_STYLES = {
  rule:    { icon: <CheckCircleRounded sx={{ fontSize: 18, color: '#3B82F6' }} />, border: '#3B82F6', bg: '#EFF6FF', darkBg: '#1e2d4a' },
  example: { icon: <FormatQuoteRounded sx={{ fontSize: 18, color: '#10B981' }} />, border: '#10B981', bg: '#ECFDF5', darkBg: '#1a3329' },
  tip:     { icon: <LightbulbRounded sx={{ fontSize: 18, color: '#F59E0B' }} />, border: '#F59E0B', bg: '#FFFBEB', darkBg: '#2e2310' },
  warning: { icon: <WarningAmberRounded sx={{ fontSize: 18, color: '#EF4444' }} />, border: '#EF4444', bg: '#FEF2F2', darkBg: '#2e1515' },
};

function ContentBlock({ block, isDark }) {
  const style = BLOCK_STYLES[block.type] || BLOCK_STYLES.rule;
  return (
    <Box sx={{
      display: 'flex', gap: 1.5, p: 2, borderRadius: 2,
      bgcolor: isDark ? style.darkBg : style.bg,
      borderLeft: `3px solid ${style.border}`,
      mb: 1.5,
    }}>
      <Box sx={{ mt: 0.2, flexShrink: 0 }}>{style.icon}</Box>
      <Typography variant="body2" lineHeight={1.7} sx={{ fontFamily: block.type === 'example' ? '"Courier New", monospace' : 'inherit' }}>
        {block.text}
      </Typography>
    </Box>
  );
}

function LessonReader({ lesson, onBack }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const color = SUBJECT_COLORS[lesson.subject];

  return (
    <Box sx={{ maxWidth: 760, mx: 'auto' }}>
      <Button startIcon={<ArrowBackRounded />} onClick={onBack} sx={{ mb: 3 }} size="small">
        All lessons
      </Button>

      <Card>
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
            <Box sx={{
              width: 52, height: 52, borderRadius: '14px', flexShrink: 0,
              bgcolor: color.bg + '22',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26,
              border: `1.5px solid ${color.bg}44`,
            }}>
              {SUBJECT_ICONS[lesson.subject]}
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800} lineHeight={1.3}>{lesson.title}</Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>{lesson.description}</Typography>
              <Stack direction="row" spacing={0.8} mt={1}>
                <Chip
                  label={lesson.level} size="small"
                  sx={{ fontWeight: 700, bgcolor: LEVEL_COLORS[lesson.level] + '22', color: LEVEL_COLORS[lesson.level] }}
                />
                <Chip
                  label={lesson.subject} size="small"
                  sx={{ fontWeight: 700, bgcolor: color.bg + '18', color: color.bg }}
                />
              </Stack>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Content blocks */}
          {Array.isArray(lesson.content) && lesson.content.map((block, i) => (
            <ContentBlock key={i} block={block} isDark={isDark} />
          ))}

          <Box sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: 'action.hover', textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              💡 Practise this lesson in the <strong>Quiz</strong> section
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

function LessonCard({ lesson, onClick }) {
  const color = SUBJECT_COLORS[lesson.subject] || SUBJECT_COLORS.GRAMMAR;
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer', height: '100%',
        transition: 'transform 0.15s, box-shadow 0.15s',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: 6 },
      }}
    >
      <CardContent sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: '10px',
            bgcolor: color.bg + '18', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 20, flexShrink: 0,
            border: `1px solid ${color.bg}33`,
          }}>
            {SUBJECT_ICONS[lesson.subject]}
          </Box>
          <Stack direction="row" spacing={0.7}>
            <Chip label={lesson.level} size="small" sx={{ fontWeight: 700, fontSize: '0.65rem', bgcolor: LEVEL_COLORS[lesson.level] + '22', color: LEVEL_COLORS[lesson.level] }} />
            <Chip label={lesson.subject} size="small" sx={{ fontWeight: 600, fontSize: '0.65rem', bgcolor: color.bg + '12', color: color.bg }} />
          </Stack>
        </Box>
        <Typography variant="body1" fontWeight={700} mb={0.5} lineHeight={1.4}>{lesson.title}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>{lesson.description}</Typography>
        <Button size="small" sx={{ mt: 1.5, alignSelf: 'flex-start', p: 0 }}>Read lesson →</Button>
      </CardContent>
    </Card>
  );
}

const SUBJECTS = ['', 'GRAMMAR', 'CONJUGATION', 'SPELLING', 'VOCABULARY'];
const LEVELS = ['', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function LessonsPage() {
  const dispatch = useDispatch();
  const { list, current, loading, error } = useSelector((s) => s.lessons);
  const [filters, setFilters] = useState({ subject: '', level: '' });

  useEffect(() => {
    const params = {};
    if (filters.subject) params.subject = filters.subject;
    if (filters.level) params.level = filters.level;
    dispatch(fetchLessons(params));
  }, [filters]);

  const handleOpen = (slug) => dispatch(fetchLesson(slug));
  const handleBack = () => dispatch(clearCurrent());

  if (current) return <LessonReader lesson={current} onBack={handleBack} />;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={700}>
            <MenuBookRounded sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
            Lessons
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Grammar, conjugation, spelling — {list.length} lessons available
          </Typography>
        </Box>

        {/* Filters */}
        <Stack direction="row" spacing={1.5}>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Subject</InputLabel>
            <Select value={filters.subject} label="Subject" onChange={(e) => setFilters((p) => ({ ...p, subject: e.target.value }))}>
              {SUBJECTS.map((s) => <MenuItem key={s} value={s}>{s || 'All subjects'}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Level</InputLabel>
            <Select value={filters.level} label="Level" onChange={(e) => setFilters((p) => ({ ...p, level: e.target.value }))}>
              {LEVELS.map((l) => <MenuItem key={l} value={l}>{l || 'All'}</MenuItem>)}
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* Subject summary chips */}
      <Stack direction="row" spacing={1} mb={3} flexWrap="wrap" gap={1}>
        {Object.entries(SUBJECT_COLORS).map(([subj, color]) => {
          const count = list.filter((l) => l.subject === subj).length;
          if (!count) return null;
          return (
            <Chip
              key={subj}
              label={`${SUBJECT_ICONS[subj]} ${subj} (${count})`}
              onClick={() => setFilters((p) => ({ ...p, subject: p.subject === subj ? '' : subj }))}
              sx={{
                fontWeight: 700, cursor: 'pointer',
                bgcolor: filters.subject === subj ? color.bg + '33' : 'action.hover',
                color: filters.subject === subj ? color.bg : 'text.secondary',
                border: filters.subject === subj ? `1.5px solid ${color.bg}` : '1.5px solid transparent',
              }}
            />
          );
        })}
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : list.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography color="text.secondary">No lessons found for this filter.</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {list.map((lesson) => (
            <Grid item xs={12} sm={6} md={4} key={lesson.id}>
              <LessonCard lesson={lesson} onClick={() => handleOpen(lesson.slug)} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
