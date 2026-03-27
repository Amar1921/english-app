import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js'; // Assurez-vous d'utiliser un seul fichier
import quizRoutes from './routes/quiz.js';
import progressRoutes from './routes/progress.js';
import lessonsRoutes from './routes/lessons.js';
import userRoutes from './routes/user.js';

const app = express();
const PORT = process.env.PORT || 4005;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// ==================== CONFIGURATION ====================

// IMPORTANT: Configurer trust proxy AVANT le rate limiter
// En production derrière Nginx, activer trust proxy
if (IS_PRODUCTION) {
  app.set('trust proxy', 1); // Faire confiance au premier proxy
} else {
  // En développement, désactiver ou configurer différemment
  app.set('trust proxy', false);
}

// ==================== MIDDLEWARES SÉCURITÉ ====================

// Helmet avec configuration optimisée
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts: IS_PRODUCTION ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
}));

// CORS
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Parser JSON avec limite
app.use(express.json({ limit: '10mb' }));

// ==================== RATE LIMITING ====================

// Limiteur global - Note: trust proxy doit être configuré AVANT
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: IS_PRODUCTION,
  message: { error: 'Too many requests, please try again later.' },
  // Ajouter validate: false pour ignorer les warnings en développement
  validate: { trustProxy: false },
});

app.use(globalLimiter);

// ==================== ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    clientIp: req.ip // Pour debug
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/user', userRoutes);

// ==================== GESTION DES ERREURS ====================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  if (IS_PRODUCTION) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${err.message}`);
  } else {
    console.error(err.stack);
  }

  // Gestion des erreurs de validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const status = err.status || 500;
  const message = status === 500 && IS_PRODUCTION
      ? 'Internal server error'
      : err.message || 'Internal server error';

  res.status(status).json({ error: message });
});

// ==================== DÉMARRAGE ====================

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📡 Listening on http://localhost:${PORT}`);
  console.log(`🌐 CORS enabled for: ${corsOptions.origin}`);
  console.log(`🔒 Trust proxy: ${app.get('trust proxy')}`);
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('🛑 Received shutdown signal, closing server...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('⚠️ Force shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default app;