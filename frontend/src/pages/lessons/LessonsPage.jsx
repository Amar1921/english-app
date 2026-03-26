import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Chip, TextField, InputAdornment,
  Card, CardActionArea, CardContent, LinearProgress,
  useTheme, ToggleButtonGroup, ToggleButton, Tooltip,
} from '@mui/material';
import {
  SearchRounded, MenuBookRounded, AutoStoriesRounded,
  EmojiObjectsRounded, AccessTimeRounded, BoltRounded,
  SchoolRounded, CheckCircleRounded,
} from '@mui/icons-material';
import lessonsData from '../../data/lessons.json';

const LEVEL_COLORS = {
  A1: '#22C55E', A2: '#84CC16', B1: '#F59E0B',
  B2: '#F97316', C1: '#EF4444', C2: '#8B5CF6',
};

const THEME_META = {
  grammar:    { label: 'Grammaire',    color: '#3B82F6', icon: <MenuBookRounded sx={{ fontSize: 14 }} /> },
  vocabulary: { label: 'Vocabulaire',  color: '#10B981', icon: <AutoStoriesRounded sx={{ fontSize: 14 }} /> },
  idioms:     { label: 'Expressions',  color: '#F59E0B', icon: <EmojiObjectsRounded sx={{ fontSize: 14 }} /> },
};

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function LessonsPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [search, setSearch]         = useState('');
  const [activeLevel, setActiveLevel] = useState('ALL');
  const [activeTheme, setActiveTheme] = useState('ALL');

  const filtered = useMemo(() => {
    return lessonsData.lessons.filter((l) => {
      const matchLevel = activeLevel === 'ALL' || l.level === activeLevel;
      const matchTheme = activeTheme === 'ALL' || l.themeIcon === activeTheme;
      const matchSearch = !search ||
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.summary.toLowerCase().includes(search.toLowerCase());
      return matchLevel && matchTheme && matchSearch;
    });
  }, [search, activeLevel, activeTheme]);

  // Grouper par niveau
  const grouped = useMemo(() => {
    const map = {};
    LEVELS.forEach((lvl) => {
      const items = filtered.filter((l) => l.level === lvl);
      if (items.length) map[lvl] = items;
    });
    return map;
  }, [filtered]);

  const totalCount = lessonsData.lessons.length;
  const completedCount = 0; // à brancher sur Redux plus tard

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: -0.5, mb: 0.5 }}>
          Leçons
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {totalCount} leçons de A1 à C2 — grammaire, vocabulaire et expressions
        </Typography>

        {/* Stats bar */}
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap',
          p: 2, borderRadius: 2,
          bgcolor: isDark ? 'background.paper' : '#F8FAFF',
          border: '1px solid', borderColor: 'divider',
          mb: 3,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleRounded sx={{ color: '#22C55E', fontSize: 18 }} />
            <Typography variant="body2" color="text.secondary">
              <strong style={{ color: 'inherit' }}>{completedCount}</strong> / {totalCount} complétées
            </Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 120 }}>
            <LinearProgress
              variant="determinate"
              value={(completedCount / totalCount) * 100}
              sx={{
                height: 6, borderRadius: 3,
                bgcolor: isDark ? '#2a2a2a' : '#E5E7EB',
                '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: '#22C55E' },
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {LEVELS.map((lvl) => {
              const count = lessonsData.lessons.filter((l) => l.level === lvl).length;
              return (
                <Tooltip key={lvl} title={`${count} leçons ${lvl}`}>
                  <Box sx={{
                    px: 1, py: 0.25, borderRadius: 1, fontSize: 11, fontWeight: 700,
                    bgcolor: LEVEL_COLORS[lvl] + '18', color: LEVEL_COLORS[lvl],
                    border: `1px solid ${LEVEL_COLORS[lvl]}33`, cursor: 'default',
                  }}>
                    {lvl} · {count}
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        </Box>

        {/* Filtres */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-start' }}>
          {/* Search */}
          <TextField
            size="small"
            placeholder="Rechercher une leçon…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded sx={{ fontSize: 18, color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 220, flex: 1, maxWidth: 320 }}
          />

          {/* Filtre niveau */}
          <ToggleButtonGroup
            value={activeLevel}
            exclusive
            onChange={(_, v) => v && setActiveLevel(v)}
            size="small"
            sx={{ flexWrap: 'wrap', gap: 0.25 }}
          >
            <ToggleButton value="ALL" sx={{ px: 1.5, fontSize: 12, fontWeight: 600 }}>Tous</ToggleButton>
            {LEVELS.map((lvl) => (
              <ToggleButton
                key={lvl} value={lvl}
                sx={{
                  px: 1.5, fontSize: 12, fontWeight: 700,
                  '&.Mui-selected': {
                    bgcolor: LEVEL_COLORS[lvl] + '22',
                    color: LEVEL_COLORS[lvl],
                    borderColor: LEVEL_COLORS[lvl] + '66',
                  },
                }}
              >
                {lvl}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          {/* Filtre thème */}
          <ToggleButtonGroup
            value={activeTheme}
            exclusive
            onChange={(_, v) => v && setActiveTheme(v)}
            size="small"
          >
            <ToggleButton value="ALL" sx={{ px: 1.5, fontSize: 12, fontWeight: 600 }}>Tous</ToggleButton>
            {Object.entries(THEME_META).map(([key, meta]) => (
              <ToggleButton key={key} value={key} sx={{
                px: 1.5, fontSize: 12, fontWeight: 600, gap: 0.5,
                '&.Mui-selected': {
                  bgcolor: meta.color + '18',
                  color: meta.color,
                  borderColor: meta.color + '44',
                },
              }}>
                {meta.icon} {meta.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Résultats vide */}
      {filtered.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <SchoolRounded sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <Typography color="text.secondary">Aucune leçon trouvée pour ces filtres.</Typography>
        </Box>
      )}

      {/* Grouped by level */}
      {Object.entries(grouped).map(([lvl, lessons]) => (
        <Box key={lvl} sx={{ mb: 5 }}>
          {/* Level header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Box sx={{
              px: 1.5, py: 0.5, borderRadius: 1.5,
              bgcolor: LEVEL_COLORS[lvl] + '18',
              color: LEVEL_COLORS[lvl],
              border: `1.5px solid ${LEVEL_COLORS[lvl]}44`,
              fontWeight: 800, fontSize: 15,
            }}>
              {lvl}
            </Box>
            <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: -0.3 }}>
              {{
                A1: 'Débutant', A2: 'Élémentaire', B1: 'Intermédiaire',
                B2: 'Intermédiaire supérieur', C1: 'Avancé', C2: 'Maîtrise',
              }[lvl]}
            </Typography>
            <Chip
              label={`${lessons.length} leçon${lessons.length > 1 ? 's' : ''}`}
              size="small"
              sx={{ bgcolor: 'action.hover', fontWeight: 600, fontSize: 11 }}
            />
          </Box>

          {/* Cards grid */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 2,
          }}>
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                levelColor={LEVEL_COLORS[lvl]}
                isDark={isDark}
                onClick={() => navigate(`/lessons/${lesson.slug}`)}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function LessonCard({ lesson, levelColor, isDark, onClick }) {
  const meta = THEME_META[lesson.themeIcon] || THEME_META.grammar;

  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid', borderColor: 'divider',
        borderRadius: 2,
        transition: 'all 0.18s ease',
        '&:hover': {
          borderColor: levelColor + '88',
          boxShadow: `0 4px 20px ${levelColor}18`,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardActionArea onClick={onClick} sx={{ p: 0 }}>
        <CardContent sx={{ p: 2.5 }}>
          {/* Top row */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 0.75,
              px: 1, py: 0.3, borderRadius: 1,
              bgcolor: meta.color + '15',
              color: meta.color,
              fontSize: 11, fontWeight: 700,
            }}>
              {meta.icon}
              {meta.label}
            </Box>
            <Box sx={{
              px: 1, py: 0.2, borderRadius: 1,
              bgcolor: levelColor + '18',
              color: levelColor,
              fontSize: 11, fontWeight: 800,
              border: `1px solid ${levelColor}33`,
            }}>
              {lesson.level}
            </Box>
          </Box>

          {/* Title */}
          <Typography fontWeight={700} sx={{ fontSize: 15, lineHeight: 1.35, mb: 0.75 }}>
            {lesson.title}
          </Typography>

          {/* Summary */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', lineHeight: 1.55, mb: 2, minHeight: 36 }}
          >
            {lesson.summary}
          </Typography>

          {/* Bottom row */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, color: 'text.disabled', fontSize: 12 }}>
                <AccessTimeRounded sx={{ fontSize: 13 }} />
                {lesson.duration} min
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, color: '#F59E0B', fontSize: 12, fontWeight: 600 }}>
                <BoltRounded sx={{ fontSize: 13 }} />
                +{lesson.xpReward} XP
              </Box>
            </Box>
            {lesson.exceptions?.length > 0 && (
              <Tooltip title={`${lesson.exceptions.length} exception${lesson.exceptions.length > 1 ? 's' : ''}`}>
                <Box sx={{
                  px: 0.75, py: 0.2, borderRadius: 0.75,
                  bgcolor: '#EF444418', color: '#EF4444',
                  fontSize: 11, fontWeight: 700,
                }}>
                  ⚠ {lesson.exceptions.length}
                </Box>
              </Tooltip>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
