import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, IconButton, Divider, Link, useTheme,
} from '@mui/material';
import {
    SchoolRounded, HomeRounded, MenuBookRounded,
    BarChartRounded, GitHub, EmailRounded, OpenInNewRounded,
} from '@mui/icons-material';

const YEAR = new Date().getFullYear();

const NAV_LINKS = [
    { label: 'Home',     path: '/',         icon: <HomeRounded sx={{ fontSize: 14 }} /> },
    { label: 'Lessons',  path: '/lessons',  icon: <MenuBookRounded sx={{ fontSize: 14 }} /> },
    { label: 'Quiz',     path: '/quiz',     icon: <SchoolRounded sx={{ fontSize: 14 }} /> },
    { label: 'Progress', path: '/progress', icon: <BarChartRounded sx={{ fontSize: 14 }} /> },
];

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const LEVEL_COLORS = {
    A1: '#22C55E', A2: '#84CC16', B1: '#F59E0B',
    B2: '#F97316', C1: '#EF4444', C2: '#8B5CF6',
};

export default function Footer() {
    const theme = useTheme();
    const navigate = useNavigate();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box
            component="footer"
            sx={{
                mt: 'auto',
                borderTop: `1px solid ${theme.palette.divider}`,
                bgcolor: isDark ? 'background.paper' : '#FAFAFA',
                pt: 5, pb: 3,
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr 1fr' },
                        gap: { xs: 4, sm: 6 },
                        mb: 4,
                    }}
                >
                    {/* Colonne 1 — Brand */}
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <Box sx={{
                                width: 32, height: 32, borderRadius: '9px',
                                background: 'linear-gradient(135deg, #1A6EFF 0%, #0D4FC2 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <SchoolRounded sx={{ color: 'white', fontSize: 18 }} />
                            </Box>
                            <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: -0.5 }}>
                                English<span style={{ color: '#1A6EFF' }}>Up</span>
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 260, lineHeight: 1.7, mb: 2 }}>
                            A free platform to learn English through interactive quizzes and lessons — from A1 to C2.
                        </Typography>

                        {/* Niveaux */}
                        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                            {LEVELS.map((lvl) => (
                                <Box
                                    key={lvl}
                                    sx={{
                                        px: 1, py: 0.25,
                                        borderRadius: '6px',
                                        fontSize: 11,
                                        fontWeight: 700,
                                        bgcolor: LEVEL_COLORS[lvl] + '18',
                                        color: LEVEL_COLORS[lvl],
                                        border: `1px solid ${LEVEL_COLORS[lvl]}33`,
                                    }}
                                >
                                    {lvl}
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    {/* Colonne 2 — Navigation */}
                    <Box>
                        <Typography
                            variant="caption"
                            fontWeight={700}
                            color="text.secondary"
                            sx={{ textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 1.5 }}
                        >
                            Navigation
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {NAV_LINKS.map((item) => (
                                <Box
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        display: 'flex', alignItems: 'center', gap: 1,
                                        color: 'text.secondary',
                                        fontSize: 14,
                                        cursor: 'pointer',
                                        width: 'fit-content',
                                        transition: 'color 0.15s',
                                        '&:hover': { color: 'primary.main' },
                                    }}
                                >
                                    {item.icon}
                                    {item.label}
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    {/* Colonne 3 — Contact & liens */}
                    <Box>
                        <Typography
                            variant="caption"
                            fontWeight={700}
                            color="text.secondary"
                            sx={{ textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 1.5 }}
                        >
                            Contact
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link
                                href="mailto:contact@amarsyll.pro"
                                underline="none"
                                sx={{
                                    display: 'flex', alignItems: 'center', gap: 1,
                                    color: 'text.secondary', fontSize: 14,
                                    '&:hover': { color: 'primary.main' },
                                }}
                            >
                                <EmailRounded sx={{ fontSize: 14 }} />
                               amar05syll@gmail.com
                            </Link>
                            <Link
                                href="https://github.com/Amar1921"
                                target="_blank"
                                rel="noopener noreferrer"
                                underline="none"
                                sx={{
                                    display: 'flex', alignItems: 'center', gap: 1,
                                    color: 'text.secondary', fontSize: 14,
                                    '&:hover': { color: 'primary.main' },
                                }}
                            >
                                <GitHub sx={{ fontSize: 14 }} />
                                github.com
                            </Link>
                            <Link
                                href="https://amarsyll.pro"
                                target="_blank"
                                rel="noopener noreferrer"
                                underline="none"
                                sx={{
                                    display: 'flex', alignItems: 'center', gap: 1,
                                    color: 'text.secondary', fontSize: 14,
                                    '&:hover': { color: 'primary.main' },
                                }}
                            >
                                <OpenInNewRounded sx={{ fontSize: 14 }} />
                                amarsyll.pro
                            </Link>
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ mb: 2.5 }} />

                {/* Bottom bar */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1,
                }}>
                    <Typography variant="caption" color="text.secondary">
                        © {YEAR} EnglishUp — Built by{' '}
                        <Link
                            href="https://amarsyll.pro"
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                            sx={{ color: 'text.secondary', fontWeight: 600 }}
                        >
                            Amar Syll
                        </Link>
                        . All rights reserved.
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                        Free & open access · No ads
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}