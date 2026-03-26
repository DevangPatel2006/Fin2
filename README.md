# FinLanza — AI-Powered Personal Finance Platform

A full-stack MERN application for tracking income/expenses, managing financial goals, getting AI-powered insights, and optimizing Indian tax planning.

**Live:** https://finlanza.vercel.app/

---

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, shadcn/ui
- **Backend:** Node.js, Express.js v5, MongoDB, Mongoose
- **Auth:** JWT, bcryptjs
- **AI:** Google Gemini 2.5 Flash API
- **Validation:** Zod (client + server)
- **Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas

---

## Features

- **AI Financial Advisor** — Chat with Gemini using your real financial data injected as context. Gets actual balance, spending categories, goal progress, and monthly trends per message.
- **Dashboard** — Live income/expense aggregation, savings rate, recent transactions, goal progress bars.
- **AI Insights** — Month-over-month spending comparison, savings rate benchmark, goal timeline prediction, investment opportunity calculator.
- **Indian Tax Advisor** — Old vs New regime comparison, HRA/80C/80D/NPS calculations, tax health score, deduction recommendations.
- **Goal Management** — CRUD goals with on-track detection, monthly contribution tracking, deadline management.
- **Settings** — Profile update, password change, account deletion (cascades to all user data).


---

## Setup

```bash
# Backend
cd backend
npm install
# Add .env: MONGO_URI, JWT_SECRET, GEMINI_API_KEY
npm run dev

# Frontend
cd client
npm install
npm run dev
```

---

## Data Models

**User** — name, email, password (bcrypt hashed)

**Transaction** — userId, type (income/expense), category, amount, note, date

**Goal** — userId, name, current, target, deadline, monthlyContribution, status

---

Built solo as a full-stack project demonstrating React, Node.js, MongoDB, and AI integration.
