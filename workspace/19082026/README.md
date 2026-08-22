# AI Prompt Research Lab

AI Assistant Builder & Prompt Experimentation Platform

## Overview

This project implements the ASEAN AI internship requirements with a platform that has two integrated sides:

1. **Assistant Studio / Academic Side** - Build user-defined AI assistants with structured system prompts using the AUTOMAT(E) framework
2. **Prompt Research Lab / Product Side** - Experiment with prompts, compare models, analyze behavior, and maintain a curated library

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + React + TypeScript
- **Styling**: Tailwind CSS + Dark Mode Support
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma 5
- **Icons**: Lucide React

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.local` and update the database password:

```bash
# Edit .env.local and replace <Kosongkan2026$?> with your actual Supabase password
DATABASE_URL=postgresql://postgres.rtpnslediqjspaphtqqu:YOUR_PASSWORD_HERE@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
```

### 3. Run Database Migrations

```bash
npx prisma db push
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
ai-research-lab/
├── prisma/
│   └── schema.prisma          # Prisma database schema
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Main layout with header/sidebar
│   │   ├── page.tsx           # Landing page
│   │   ├── dashboard/         # Dashboard
│   │   ├── assistant/
│   │   │   └── builder/       # AUTOMAT(E) Builder
│   │   ├── research/
│   │   │   └── experiments/   # Research Lab
│   │   └── library/           # Prompt Library
│   ├── components/
│   │   ├── Header.tsx         # Navigation header
│   │   └── Sidebar.tsx        # Sidebar navigation
│   └── lib/
│       ├── prisma/            # Prisma client
│       ├── ai-providers/      # AI provider adapters
│       └── auth/              # Authentication utilities
└── .env.local                 # Environment variables
```

## Features

### AUTOMAT(E) Builder
Structured system prompt construction with 8 components:
- **A**ct As - Role/Expertise
- **U**ser & Audience - Who uses the assistant
- **T**argeted Action - The exact task
- **O**utput Definition - Format and structure
- **M**ode/Tone/Style - Language and style
- **A**typical Cases - Edge case handling
- **T**opic Whitelisting - Scope definition
- **E**xamples - Few-shot examples

### Research Lab
- Prompt experiments
- Model comparison (OpenAI, DeepSeek, Qwen, Yandex, Claude)
- Sycophancy, bias, consistency, and truthfulness analysis
- Security testing (prompt injection resistance)

### Prompt Library
- Public prompts (free)
- Research prompts (researcher account)
- Premium prompts (premium account)

## Development

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint

# Prisma commands
npx prisma studio          # Open Prisma Studio
npx prisma db push         # Push schema to database
npx prisma generate        # Generate Prisma Client
```

## Database Schema

The Prisma schema includes:
- Users and Organizations
- Assistants with versioning
- Prompts with versioning
- Experiments and Results
- Evaluations and Findings
- Security Tests
- Library Items
- Plans and Subscriptions
- Audit Logs

## Next Steps

1. Update `DATABASE_URL` in `.env.local` with your Supabase password
2. Run `npx prisma db push` to create database tables
3. Complete frontend implementation
4. Add AI provider integrations (OpenAI, DeepSeek, Qwen, Yandex, Claude)
5. Implement authentication (NextAuth.js or Clerk)
6. Deploy to Vercel and Supabase

## License

MIT