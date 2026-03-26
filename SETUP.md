# ─── Variables d'environnement à ajouter dans .env ───────────────────────────

SMTP_USER=support@syllamar.pro
SMTP_PASS=your_password_here
APP_NAME=EnglishUp

# ─── Migration Prisma ─────────────────────────────────────────────────────────

# 1. Remplacer prisma/schema.prisma par le fichier fourni
# 2. Lancer la migration :

npx prisma migrate dev --name add_email_verification_and_reset

# Ou en production :
npx prisma migrate deploy

# ─── Dépendance à installer ───────────────────────────────────────────────────

npm install nodemailer
