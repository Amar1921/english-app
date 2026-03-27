import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import {
  AccessTimeRounded,
  ArrowBackRounded,
  AutoStoriesRounded,
  BoltRounded,
  CheckCircleRounded,
  EmojiObjectsRounded,
  ErrorRounded,
  InfoRounded,
  MenuBookRounded,
  ReplayRounded,
  StarRounded,
  TipsAndUpdatesRounded,
  WarningAmberRounded,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import lessonsData from '../../data/lessons.json';
import {markLessonComplete} from "../../store/slices/progressSlice.js";

const LEVEL_COLORS = {
  A1: '#22C55E', A2: '#84CC16', B1: '#F59E0B',
  B2: '#F97316', C1: '#EF4444', C2: '#8B5CF6',
};

const THEME_META = {
  grammar:    { label: 'Grammaire',   color: '#3B82F6', icon: <MenuBookRounded sx={{ fontSize: 14 }} /> },
  vocabulary: { label: 'Vocabulaire', color: '#10B981', icon: <AutoStoriesRounded sx={{ fontSize: 14 }} /> },
  idioms:     { label: 'Expressions', color: '#F59E0B', icon: <EmojiObjectsRounded sx={{ fontSize: 14 }} /> },
};

const NOTE_CONFIG = {
  tip:       { icon: <TipsAndUpdatesRounded sx={{ fontSize: 16 }} />, color: '#3B82F6', bg: '#EFF6FF', label: 'Astuce' },
  warning:   { icon: <WarningAmberRounded  sx={{ fontSize: 16 }} />, color: '#F59E0B', bg: '#FFFBEB', label: 'Attention' },
  important: { icon: <StarRounded          sx={{ fontSize: 16 }} />, color: '#8B5CF6', bg: '#F5F3FF', label: 'Important' },
  info:      { icon: <InfoRounded          sx={{ fontSize: 16 }} />, color: '#06B6D4', bg: '#ECFEFF', label: 'Info' },
};

const EXCEPTION_CONFIG = {
  error:     { icon: <ErrorRounded         sx={{ fontSize: 15 }} />, color: '#EF4444', bg: '#FEF2F2', border: '#FCA5A5' },
  rule:      { icon: <CheckCircleRounded   sx={{ fontSize: 15 }} />, color: '#10B981', bg: '#ECFDF5', border: '#6EE7B7' },
  info:      { icon: <InfoRounded          sx={{ fontSize: 15 }} />, color: '#3B82F6', bg: '#EFF6FF', border: '#93C5FD' },
  warning:   { icon: <WarningAmberRounded  sx={{ fontSize: 15 }} />, color: '#F59E0B', bg: '#FFFBEB', border: '#FCD34D' },
  important: { icon: <StarRounded          sx={{ fontSize: 15 }} />, color: '#8B5CF6', bg: '#F5F3FF', border: '#C4B5FD' },
};

export default function LessonDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const { lessonProgress, validating } = useSelector((s) => s.progress);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const lesson = lessonsData.lessons.find((l) => l.slug === slug);

  const currentProgress = lessonProgress?.find((p) => p.lessonId === slug);
  const isCompleted = currentProgress?.status === 'COMPLETED';
  const isInProgress = currentProgress?.status === 'IN_PROGRESS';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!lesson) {
    return (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>Leçon introuvable</Typography>
          <Button onClick={() => navigate('/lessons')} startIcon={<ArrowBackRounded />}>
            Retour aux leçons
          </Button>
        </Box>
    );
  }

  const levelColor = LEVEL_COLORS[lesson.level];
  const meta = THEME_META[lesson.themeIcon] || THEME_META.grammar;

  const allLessons = lessonsData.lessons;
  const currentIndex = allLessons.findIndex((l) => l.slug === slug);
  const prevLesson = allLessons[currentIndex - 1];
  const nextLesson = allLessons[currentIndex + 1];

  const handleValidate = async () => {
    try {
      await dispatch(markLessonComplete({ lessonId: slug, xpReward: lesson.xpReward })).unwrap();
      setSnackbar({
        open: true,
        message: isCompleted
            ? 'Leçon déjà validée — relecture enregistrée !'
            : `Leçon validée ! +${lesson.xpReward} XP gagnés 🎉`,
        severity: 'success',
      });
    } catch {
      setSnackbar({ open: true, message: 'Erreur lors de la validation.', severity: 'error' });
    }
  };

  return (
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        {/* Back button */}
        <Button
            startIcon={<ArrowBackRounded />}
            onClick={() => navigate('/lessons')}
            size="small"
            sx={{ mb: 3, color: 'text.secondary' }}
        >
          Toutes les leçons
        </Button>

        {/* Already completed banner */}
        {isCompleted && (
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 1.5,
              p: 2, mb: 3, borderRadius: 2,
              bgcolor: '#22C55E18',
              border: '1.5px solid #22C55E44',
            }}>
              <CheckCircleRounded sx={{ color: '#22C55E', fontSize: 20, flexShrink: 0 }} />
              <Box flex={1}>
                <Typography variant="body2" fontWeight={700} sx={{ color: '#22C55E' }}>
                  Leçon déjà validée ✓
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Validée le {new Date(currentProgress.completedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} · +{currentProgress.xpEarned} XP
                </Typography>
              </Box>
              <Chip
                  label="Relire"
                  size="small"
                  icon={<ReplayRounded sx={{ fontSize: '14px !important' }} />}
                  sx={{ bgcolor: '#22C55E22', color: '#22C55E', fontWeight: 700, fontSize: 11 }}
              />
            </Box>
        )}

        {/* Hero header */}
        <Box sx={{
          p: { xs: 2.5, sm: 4 },
          borderRadius: 3,
          border: `1.5px solid ${levelColor}44`,
          background: isDark
              ? `linear-gradient(135deg, ${levelColor}08 0%, transparent 60%)`
              : `linear-gradient(135deg, ${levelColor}08 0%, #fff 60%)`,
          mb: 4,
        }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 0.75,
              px: 1.25, py: 0.4, borderRadius: 1.5,
              bgcolor: meta.color + '15', color: meta.color,
              fontSize: 12, fontWeight: 700,
            }}>
              {meta.icon} {meta.label}
            </Box>
            <Box sx={{
              px: 1.25, py: 0.4, borderRadius: 1.5, fontSize: 12, fontWeight: 800,
              bgcolor: levelColor + '18', color: levelColor,
              border: `1.5px solid ${levelColor}44`,
            }}>
              {lesson.level}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.disabled', fontSize: 12 }}>
              <AccessTimeRounded sx={{ fontSize: 14 }} /> {lesson.duration} min
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#F59E0B', fontSize: 12, fontWeight: 700 }}>
              <BoltRounded sx={{ fontSize: 14 }} />
              {isCompleted ? `+${lesson.xpReward} XP (déjà gagnés)` : `+${lesson.xpReward} XP`}
            </Box>
          </Box>

          <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: -0.5, mb: 1.5, lineHeight: 1.2 }}>
            {lesson.title}
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7, fontSize: 16 }}>
            {lesson.explanation}
          </Typography>

          {lesson.keyPoints?.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 2.5 }}>
                {lesson.keyPoints.map((kp, i) => (
                    <Chip
                        key={i} label={kp} size="small"
                        sx={{ bgcolor: levelColor + '12', color: levelColor, fontWeight: 600, fontSize: 11 }}
                    />
                ))}
              </Box>
          )}
        </Box>

        {/* Conjugation table */}
        {lesson.conjugation && (
            <Section title={lesson.conjugation.title} icon="📋" mb>
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small" sx={{ minWidth: 400 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: isDark ? 'action.hover' : '#F8FAFC' }}>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Pronom</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Forme affirmative</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Forme négative</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Contraction</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lesson.conjugation.rows.map((row, i) => (
                        <TableRow key={i} hover>
                          <TableCell sx={{ fontWeight: 600, color: levelColor, fontSize: 13 }}>{row.pronoun}</TableCell>
                          <TableCell sx={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 600 }}>{row.form}</TableCell>
                          <TableCell sx={{ fontFamily: 'monospace', fontSize: 13, color: '#EF4444' }}>{row.negative}</TableCell>
                          <TableCell sx={{ fontFamily: 'monospace', fontSize: 13, color: '#3B82F6' }}>{row.short}</TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Section>
        )}

        {/* Vocabulary list */}
        {lesson.vocabulary && (
            <Section title="Vocabulaire" icon="📚" mb>
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 1,
              }}>
                {lesson.vocabulary.map((v, i) => (
                    <Box key={i} sx={{
                      display: 'flex', alignItems: 'flex-start', gap: 1.5,
                      p: 1.5, borderRadius: 1.5,
                      border: '1px solid', borderColor: 'divider',
                      bgcolor: isDark ? 'background.paper' : '#FAFAFA',
                    }}>
                      <Box sx={{
                        minWidth: 32, height: 32, borderRadius: 1, flexShrink: 0,
                        bgcolor: levelColor + '12',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14,
                      }}>
                        {v.emoji || '📝'}
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: 13 }}>{v.en}</Typography>
                        <Typography variant="caption" color="text.secondary">{v.fr}</Typography>
                      </Box>
                    </Box>
                ))}
              </Box>
            </Section>
        )}

        {/* Irregular verbs */}
        {lesson.irregularVerbs && (
            <Section title="Verbes irréguliers" icon="🔀" mb>
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: isDark ? 'action.hover' : '#FFF7ED' }}>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Infinitif</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Prétérit</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Traduction</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lesson.irregularVerbs.map((v, i) => (
                        <TableRow key={i} hover>
                          <TableCell sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#3B82F6', fontSize: 13 }}>{v.base}</TableCell>
                          <TableCell sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#F97316', fontSize: 13 }}>{v.past}</TableCell>
                          <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{v.fr}</TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Section>
        )}

        {/* Idioms list */}
        {lesson.idioms && (
            <Section title="Expressions" icon="💬" mb>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {lesson.idioms.map((idiom, i) => (
                    <Box key={i} sx={{
                      p: 2, borderRadius: 2,
                      border: '1px solid', borderColor: 'divider',
                      bgcolor: isDark ? 'background.paper' : '#FAFAFA',
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1, mb: 0.5 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: 14, fontStyle: 'italic', color: meta.color }}>
                          "{idiom.en}"
                        </Typography>
                        <Chip
                            label={idiom.usage}
                            size="small"
                            sx={{ fontSize: 11, bgcolor: meta.color + '12', color: meta.color, fontWeight: 600 }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        🇫🇷 {idiom.fr}
                      </Typography>
                    </Box>
                ))}
              </Box>
            </Section>
        )}

        {/* Examples */}
        {lesson.examples && (
            <Section title="Exemples" icon="✏️" mb>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                {lesson.examples.map((ex, i) => (
                    <Box key={i} sx={{
                      display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 0,
                      border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflow: 'hidden',
                    }}>
                      <Box sx={{
                        p: 1.5,
                        borderRight: { xs: 'none', sm: '1px solid' },
                        borderBottom: { xs: '1px solid', sm: 'none' },
                        borderColor: 'divider',
                        bgcolor: isDark ? levelColor + '10' : levelColor + '08',
                      }}>
                        <Box sx={{ fontSize: 10, fontWeight: 700, color: levelColor, mb: 0.4, textTransform: 'uppercase', letterSpacing: 0.5 }}>🇬🇧 EN</Box>
                        <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{ex.en}</Typography>
                      </Box>
                      <Box sx={{ p: 1.5, bgcolor: isDark ? 'action.hover' : '#FAFAFA' }}>
                        <Box sx={{ fontSize: 10, fontWeight: 700, color: 'text.disabled', mb: 0.4, textTransform: 'uppercase', letterSpacing: 0.5 }}>🇫🇷 FR</Box>
                        <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>{ex.fr}</Typography>
                      </Box>
                    </Box>
                ))}
              </Box>
            </Section>
        )}

        {/* Exceptions */}
        {lesson.exceptions?.length > 0 && (
            <Section title="Exceptions & Règles importantes" icon="⚠️" mb>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {lesson.exceptions.map((exc, i) => {
                  const cfg = EXCEPTION_CONFIG[exc.type] || EXCEPTION_CONFIG.info;
                  return (
                      <Box key={i} sx={{
                        display: 'flex', gap: 1.25, alignItems: 'flex-start',
                        p: 1.5, borderRadius: 1.5,
                        bgcolor: isDark ? cfg.color + '15' : cfg.bg,
                        border: `1px solid ${isDark ? cfg.color + '40' : cfg.border}`,
                      }}>
                        <Box sx={{ color: cfg.color, flexShrink: 0, mt: 0.15 }}>{cfg.icon}</Box>
                        <Typography sx={{ fontSize: 13.5, lineHeight: 1.6, color: isDark ? '#fff' : '#1a1a1a' }}>
                          {exc.text}
                        </Typography>
                      </Box>
                  );
                })}
              </Box>
            </Section>
        )}

        {/* Notes */}
        {lesson.notes?.length > 0 && (
            <Section title="À retenir" icon="📌" mb>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {lesson.notes.map((note, i) => {
                  const cfg = NOTE_CONFIG[note.icon] || NOTE_CONFIG.tip;
                  return (
                      <Box key={i} sx={{
                        display: 'flex', gap: 1.5, alignItems: 'flex-start',
                        p: 1.75, borderRadius: 1.5,
                        bgcolor: isDark ? cfg.color + '15' : cfg.bg,
                        border: `1px solid ${cfg.color}30`,
                      }}>
                        <Box sx={{
                          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          bgcolor: cfg.color + '20', color: cfg.color,
                        }}>
                          {cfg.icon}
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: 11, fontWeight: 700, color: cfg.color, mb: 0.25, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            {cfg.label}
                          </Typography>
                          <Typography sx={{ fontSize: 13.5, lineHeight: 1.65, color: isDark ? '#ddd' : '#1a1a1a' }}>
                            {note.text}
                          </Typography>
                        </Box>
                      </Box>
                  );
                })}
              </Box>
            </Section>
        )}

        {/* ── Validation CTA ── */}
        <Divider sx={{ my: 4 }} />
        <Box sx={{
          p: { xs: 2.5, sm: 3 },
          borderRadius: 3,
          border: isCompleted ? '1.5px solid #22C55E44' : `1.5px solid ${levelColor}33`,
          bgcolor: isCompleted
              ? (isDark ? '#22C55E12' : '#F0FDF4')
              : (isDark ? levelColor + '08' : levelColor + '06'),
          mb: 4,
          textAlign: 'center',
        }}>
          {isCompleted ? (
              <>
                <CheckCircleRounded sx={{ fontSize: 40, color: '#22C55E', mb: 1 }} />
                <Typography variant="h6" fontWeight={700} mb={0.5}>
                  Tu as déjà validé cette leçon !
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2.5}>
                  Les XP ne sont accordés qu'une seule fois. Tu peux relire autant que tu veux.
                </Typography>
                <Button
                    variant="outlined"
                    onClick={handleValidate}
                    disabled={validating}
                    startIcon={validating ? <CircularProgress size={16} /> : <ReplayRounded />}
                    sx={{
                      borderColor: '#22C55E', color: '#22C55E',
                      '&:hover': { bgcolor: '#22C55E12', borderColor: '#22C55E' },
                    }}
                >
                  {validating ? 'Enregistrement…' : 'Marquer comme relu'}
                </Button>
              </>
          ) : (
              <>
                <BoltRounded sx={{ fontSize: 40, color: '#F59E0B', mb: 1 }} />
                <Typography variant="h6" fontWeight={700} mb={0.5}>
                  Tu as terminé la leçon ?
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2.5}>
                  Valide-la pour gagner <strong>+{lesson.xpReward} XP</strong> et suivre ta progression.
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleValidate}
                    disabled={validating}
                    startIcon={validating ? <CircularProgress size={16} color="inherit" /> : <CheckCircleRounded />}
                    sx={{
                      py: 1.4, px: 4, fontWeight: 700, borderRadius: 2.5, fontSize: 15,
                      background: `linear-gradient(135deg, ${levelColor} 0%, ${levelColor}cc 100%)`,
                      boxShadow: `0 8px 24px ${levelColor}40`,
                      '&:hover': { boxShadow: `0 12px 32px ${levelColor}55` },
                    }}
                >
                  {validating ? 'Validation…' : 'Valider la leçon'}
                </Button>
              </>
          )}
        </Box>

        {/* Navigation prev/next */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          {prevLesson ? (
              <Button
                  variant="outlined"
                  onClick={() => navigate(`/lessons/${prevLesson.slug}`)}
                  startIcon={<ArrowBackRounded />}
                  sx={{ flex: 1, maxWidth: 280, justifyContent: 'flex-start' }}
              >
                <Box sx={{ textAlign: 'left', overflow: 'hidden' }}>
                  <Typography variant="caption" color="text.disabled" display="block">Précédent</Typography>
                  <Typography variant="body2" fontWeight={600} noWrap>{prevLesson.title}</Typography>
                </Box>
              </Button>
          ) : <Box sx={{ flex: 1 }} />}

          {nextLesson ? (
              <Button
                  variant="contained"
                  onClick={() => navigate(`/lessons/${nextLesson.slug}`)}
                  endIcon={<ArrowBackRounded sx={{ transform: 'scaleX(-1)' }} />}
                  sx={{ flex: 1, maxWidth: 280, justifyContent: 'flex-end' }}
              >
                <Box sx={{ textAlign: 'right', overflow: 'hidden' }}>
                  <Typography variant="caption" sx={{ opacity: 0.75 }} display="block">Suivant</Typography>
                  <Typography variant="body2" fontWeight={600} noWrap>{nextLesson.title}</Typography>
                </Box>
              </Button>
          ) : (
              <Button
                  variant="contained"
                  onClick={() => navigate('/lessons')}
                  sx={{ flex: 1, maxWidth: 280 }}
              >
                Retour aux leçons
              </Button>
          )}
        </Box>

        {/* Snackbar feedback */}
        <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} variant="filled" sx={{ fontWeight: 600 }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
  );
}

function Section({ title, icon, children, mb }) {
  return (
      <Box sx={{ mb: mb ? 4 : 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography sx={{ fontSize: 18 }}>{icon}</Typography>
          <Typography variant="h6" fontWeight={700} sx={{ fontSize: 16 }}>{title}</Typography>
        </Box>
        {children}
      </Box>
  );
}