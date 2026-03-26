// src/services/mailService.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'ssl0.ovh.net',
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const APP_NAME = process.env.APP_NAME || 'EnglishUp';
const FROM = `"${APP_NAME}" <${process.env.SMTP_USER}>`;

// ─── Templates ───────────────────────────────────────────────────────────────

function baseTemplate(title, content) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #f4f6fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a2e; }
    .wrapper { max-width: 560px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1A6EFF 0%, #0D4FC2 100%); padding: 32px 40px; text-align: center; }
    .header h1 { color: white; font-size: 22px; font-weight: 700; letter-spacing: -0.3px; }
    .header p  { color: rgba(255,255,255,0.75); font-size: 13px; margin-top: 4px; }
    .body { padding: 36px 40px; }
    .body p { font-size: 15px; line-height: 1.65; color: #444; margin-bottom: 16px; }
    .code-box { background: #f0f5ff; border: 2px dashed #1A6EFF; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
    .code { font-size: 38px; font-weight: 800; letter-spacing: 12px; color: #1A6EFF; font-family: 'Courier New', monospace; }
    .code-hint { font-size: 13px; color: #888; margin-top: 8px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #1A6EFF 0%, #0D4FC2 100%); color: white !important; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 15px; margin: 20px 0; }
    .footer { background: #f8f9fb; padding: 20px 40px; text-align: center; font-size: 12px; color: #aaa; border-top: 1px solid #eee; }
    .warning { background: #fff8e1; border-left: 4px solid #f59e0b; border-radius: 6px; padding: 12px 16px; font-size: 13px; color: #7a5c00; margin-top: 8px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🎓 ${APP_NAME}</h1>
      <p>Your English learning companion</p>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} ${APP_NAME} · This email was sent automatically, please do not reply.
    </div>
  </div>
</body>
</html>`;
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export async function sendVerificationEmail(to, name, code) {
  const html = baseTemplate('Verify your email', `
    <p>Hi <strong>${name}</strong> 👋</p>
    <p>Welcome to ${APP_NAME}! To complete your registration, please enter the verification code below on the app:</p>
    <div class="code-box">
      <div class="code">${code}</div>
      <div class="code-hint">This code expires in <strong>15 minutes</strong></div>
    </div>
    <p>If you did not create an account, you can safely ignore this email.</p>
    <div class="warning">⚠️ Never share this code with anyone.</div>
  `);

  await transporter.sendMail({
    from: FROM,
    to,
    subject: `${code} — Your ${APP_NAME} verification code`,
    html,
  });
}

export async function sendPasswordResetEmail(to, name, code) {
  const html = baseTemplate('Reset your password', `
    <p>Hi <strong>${name}</strong>,</p>
    <p>We received a request to reset the password for your ${APP_NAME} account. Use the code below:</p>
    <div class="code-box">
      <div class="code">${code}</div>
      <div class="code-hint">This code expires in <strong>15 minutes</strong></div>
    </div>
    <p>Enter this code in the app to set a new password.</p>
    <div class="warning">⚠️ If you did not request a password reset, please ignore this email. Your password will not change.</div>
  `);

  await transporter.sendMail({
    from: FROM,
    to,
    subject: `${code} — Reset your ${APP_NAME} password`,
    html,
  });
}
