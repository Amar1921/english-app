# EnglishUp

**Plateforme interactive d'apprentissage de l'anglais — A1 → C2**

> Quiz adaptatifs, leçons de grammaire/vocabulaire/expressions, suivi de progression XP par niveau, classement.

**Stack** · Node.js + Express + Prisma (MySQL) · React 18 + Redux Toolkit + MUI · JWT · Rate Limiting

🌐 **[learn.amarsyll.pro](https://learn.amarsyll.pro)**

---

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Structure du projet](#structure-du-projet)
- [Installation](#installation)
- [Variables d'environnement](#variables-denvironnement)
- [API Reference](#api-reference)
- [Déploiement (VPS)](#déploiement-vps)

---

## Fonctionnalités

### Authentification
- Inscription / Connexion avec JWT (HS256)
- Restauration automatique de session au refresh
- Redirection automatique sur expiration du token (intercepteur Axios)

### Quiz
- Questions QCM (choix A/B/C/D) et réponses ouvertes
- Filtres par niveau (A1→C2), catégorie (Grammar, Vocabulary, Reading, Listening) et nombre de questions
- Feedback immédiat avec explication, score XP gagné et progression de session
- Récapitulatif de fin de session : précision, stats par catégorie, révision des erreurs

### Leçons
- Contenu statique JSON (bundlé via Vite — zéro requête réseau)
- 16 leçons A1→C2 : grammaire, vocabulaire thématique, expressions idiomatiques
- Chaque leçon : explication en français, exemples bilingues FR/EN, tableau de conjugaison, exceptions signalées, notes importantes
- Navigation précédent / suivant, estimation de durée et récompense XP

### Progression
- Système XP : points gagnés sur les quiz et à la complétion des leçons
- Suivi par leçon : `NOT_STARTED` / `IN_PROGRESS` / `COMPLETED` persisté en MySQL
- Statistiques quiz : précision globale, répartition par catégorie et par niveau, activité récente
- Leaderboard top 10 par XP

### UI / UX
- Thème clair / sombre (persisté en localStorage)
- Navbar responsive : menu hamburger mobile avec Drawer MUI
- Barre de progression segmentée par question (vert = correct, rouge = incorrect)
- Footer complet avec navigation, liens sociaux et mentions légales

---

## Structure du projet

```
english-app/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # User, Question, Attempt, UserProgress
│   └── src/
│       ├── index.js               # Express server, rate limiters, CORS
│       ├── prisma.js              # Prisma client singleton
│       ├── seed.js                # Seeder — questions A1→C2
│       ├── routes/
│       │   ├── auth.js
│       │   ├── quiz.js
│       │   └── progress.js        # GET /, GET /leaderboard, PATCH /:lessonId
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── quizController.js
│       │   └── progressController.js  # getProgress, updateProgress, getLeaderboard
│       └── middleware/
│           └── auth.js            # Vérification JWT
└── frontend/
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── data/
        │   └── lessons.json       # 16 leçons statiques A1→C2
        ├── theme/
        │   └── theme.js           # MUI light/dark theme
        ├── utils/
        │   └── api.js             # Axios instance + intercepteurs JWT
        ├── store/
        │   ├── index.js
        │   └── slices/
        │       ├── authSlice.js
        │       ├── quizSlice.js
        │       ├── progressSlice.js   # fetchProgress, updateProgress
        │       └── themeSlice.js
        ├── components/
        │   ├── Layout.jsx         # Navbar responsive + Drawer mobile + Footer
        │   └── Footer.jsx         # Footer complet
        └── pages/
            ├── AuthPage.jsx
            ├── DashboardPage.jsx
            ├── QuizPage.jsx           # Setup visuel, barre segmentée, summary
            ├── /lessons/LessonsPage.jsx        # Liste filtrables par niveau/thème
            ├── /lessons/LessonDetail.jsx       # Leçon complète avec tableaux et notes
            └── ProgressPage.jsx       # Stats, graphiques, leaderboard
```

---

## Installation

### Prérequis

- Node.js 18+
- MySQL 8+

### 1. Base de données

```sql
CREATE DATABASE english_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Renseigner DATABASE_URL et JWT_SECRET dans .env

npm install
npx prisma db push
node src/seed.js     # charge les questions A1→C2
npm run dev          # écoute sur :4000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev          # écoute sur :5173
```

Le proxy Vite redirige automatiquement `/api` → `http://localhost:4000`.

---

## Variables d'environnement

### `backend/.env`

```env
DATABASE_URL="mysql://user:password@localhost:3306/english_app"
JWT_SECRET="votre_secret_jwt"
PORT=4000
```

---

## API Reference

### Auth

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| `POST` | `/api/auth/register` | — | Créer un compte |
| `POST` | `/api/auth/login` | — | Obtenir un token JWT |
| `GET` | `/api/auth/me` | ✓ | Utilisateur courant |

### Quiz

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| `GET` | `/api/quiz` | ✓ | Questions filtrées (`?level=B1&category=GRAMMAR&limit=10`) |
| `POST` | `/api/quiz/submit` | ✓ | Soumettre une réponse |

### Progression

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| `GET` | `/api/progress` | ✓ | Stats quiz + suivi leçons de l'utilisateur |
| `GET` | `/api/progress/leaderboard` | ✓ | Top 10 par XP |
| `PATCH` | `/api/progress/:lessonId` | ✓ | Mettre à jour le statut d'une leçon |

#### `PATCH /api/progress/:lessonId` — Body

```json
{
  "status": "COMPLETED",
  "xpEarned": 30
}
```

#### Réponse

```json
{
  "lessonId": "present-simple",
  "status": "COMPLETED",
  "xpEarned": 30,
  "completedAt": "2026-03-26T10:00:00.000Z",
  "userXp": 280,
  "userLevel": "A2"
}
```

> Les XP ne sont crédités qu'une seule fois par leçon — les completions suivantes sont ignorées.

### Schéma Prisma

```prisma
model UserProgress {
  id          Int            @id @default(autoincrement())
  userId      Int            @map("user_id")
  lessonId    String         @map("lesson_id") @db.VarChar(100)
  status      ProgressStatus @default(NOT_STARTED)
  xpEarned    Int            @default(0)    @map("xp_earned")
  completedAt DateTime?      @map("completed_at")
  updatedAt   DateTime       @updatedAt     @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, lessonId])
  @@map("user_progress")
}

enum ProgressStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
}
```

---

## Rate Limiting

| Périmètre | Limite |
|-----------|--------|
| Global | 200 req / 15 min |
| Auth (`/register`, `/login`) | 10 req / 15 min |

---

## Déploiement (VPS)

### Backend — PM2

```bash
npm install -g pm2
cd backend
npm install --omit=dev
npx prisma generate
pm2 start src/index.js --name english-backend
pm2 save
pm2 startup
```

### Frontend — Build Vite

```bash
cd frontend
npm run build
# Copier dist/ dans /var/www/english-app/frontend
```

### Apache VHost

```apache
<VirtualHost *:80>
    ServerName learn.amarsyll.pro
    RewriteEngine On
    RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]
</VirtualHost>

<VirtualHost *:443>
    ServerName learn.amarsyll.pro

    SSLEngine on
    SSLCertificateFile    /etc/letsencrypt/live/learn.amarsyll.pro/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/learn.amarsyll.pro/privkey.pem

    DocumentRoot /var/www/english-app/frontend

    <Directory /var/www/english-app/frontend>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    ProxyPreserveHost On
    ProxyPass        /api/ http://127.0.0.1:4000/api/
    ProxyPassReverse /api/ http://127.0.0.1:4000/api/

    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"

    ErrorLog  ${APACHE_LOG_DIR}/learn.amarsyll.pro-error.log
    CustomLog ${APACHE_LOG_DIR}/learn.amarsyll.pro-access.log combined
</VirtualHost>
```

> Le `<Directory>` doit pointer sur le même chemin que `DocumentRoot` pour que le fallback SPA fonctionne au refresh.

---

## Licence

MIT