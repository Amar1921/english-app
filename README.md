# EnglishUp — Full Stack English Learning App

Stack: Node.js + Express + Prisma (MySQL) · React + Redux Toolkit + MUI · Axios · JWT Auth · Rate Limiting

## Project structure

```
english-app/
├── backend/
│   ├── prisma/schema.prisma
│   ├── src/
│   │   ├── index.js               # Express server, rate limiters
│   │   ├── prisma.js              # Prisma client singleton
│   │   ├── seed.js                # DB seeder (18 questions A1→C1)
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── quiz.js
│   │   │   └── progress.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── quizController.js
│   │   │   └── progressController.js
│   │   └── middleware/
│   │       └── auth.js            # JWT middleware
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── theme/theme.js         # MUI light/dark theme
    │   ├── utils/api.js           # Axios instance + interceptors
    │   ├── store/
    │   │   ├── index.js
    │   │   └── slices/
    │   │       ├── authSlice.js
    │   │       ├── quizSlice.js
    │   │       ├── progressSlice.js
    │   │       └── themeSlice.js
    │   ├── components/
    │   │   └── Layout.jsx         # Navbar + theme toggle
    │   └── pages/
    │       ├── AuthPage.jsx       # Login / Register
    │       ├── DashboardPage.jsx  # Home with stats
    │       ├── QuizPage.jsx       # QCM + open questions
    │       └── ProgressPage.jsx   # Stats, charts, leaderboard
    └── package.json
```

## Setup

### 1. Database (MySQL)
```sql
CREATE DATABASE english_app CHARACTER SET utf8mb4;
```

### 2. Backend
```bash
cd backend
cp .env.example .env
# Edit .env: set DATABASE_URL, JWT_SECRET

npm install
npx prisma db push
node src/seed.js    # loads 18 questions
npm run dev         # runs on :4000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev         # runs on :5173
```

Vite proxies `/api` → `http://localhost:4000` automatically.

## API endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Get JWT token |
| GET | /api/auth/me | Yes | Current user |
| GET | /api/quiz | Yes | Get questions (?level=B1&category=GRAMMAR&limit=10) |
| POST | /api/quiz/submit | Yes | Submit answer |
| GET | /api/progress | Yes | User stats |
| GET | /api/progress/leaderboard | Yes | Top 10 |

## Rate limiting

- Global: 200 requests / 15 min
- Auth routes: 10 requests / 15 min (register + login)

## Features

- JWT authentication (register / login / auto-restore on refresh)
- Dark / light mode toggle (persisted in localStorage)
- QCM with A/B/C/D choices + visual feedback
- Open-answer questions with text input
- XP system — earn points on correct answers
- Progress tracking by level and category
- SVG accuracy gauge on progress page
- Leaderboard (top 10 users by XP)
- Prisma ORM with MySQL (easy to swap to PostgreSQL)
- Axios interceptors — auto-attach JWT, redirect on 401

## Production deployment (Apache + pm2)

```bash
# Backend
npm install -g pm2
pm2 start src/index.js --name english-backend
pm2 save

# Frontend
npm run build
# serve dist/ via Apache or Nginx

# Apache vhost example
<VirtualHost *:443>
  ServerName english.yourdomain.com
  DocumentRoot /var/www/english-app/frontend/dist

  ProxyPass /api http://localhost:4000/api
  ProxyPassReverse /api http://localhost:4000/api
</VirtualHost>
```
