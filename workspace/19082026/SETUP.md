# AI Prompt Research Lab - Setup Guide

## Database Connection String

The `DATABASE_URL` in your `.env.local` and `.env` files currently contains a placeholder password:
```
DATABASE_URL=postgresql://postgres.rtpnslediqjspaphtqqu:<Kosongkan2026$?>@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
```

### To Fix the Connection:

1. **Get your actual Supabase database password:**
   - Go to https://supabase.com/dashboard
   - Select your project: `research-lab-ai` (rtpnslediqjspaphtqqu)
   - Navigate to Settings → Database
   - Look for "Connection string" and copy the password from the URI
   - OR go to Settings → Database → Password to reset/change it

2. **Update the DATABASE_URL with your actual password:**
   - Replace `<Kosongkan2026$?>` with your actual password
   - If your password contains special characters, URL-encode them:
     - `@` → `%40`
     - `#` → `%23`
     - `$` → `%24`
     - `%` → `%25`
     - `&` → `%26`
     - `+` → `%2B`
     - `:` → `%3A`
     - `/` → `%2F`

3. **Example with URL-encoded password:**
   ```
   DATABASE_URL=postgresql://postgres.rtpnslediqjspaphtqqu:YourPassword123%21@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
   ```

4. **After updating the password, run:**
   ```bash
   npx prisma db push
   ```

## Current Project Structure

### ✅ Completed:
- Next.js 14+ App Router with TypeScript
- Tailwind CSS with dark mode support
- Design system (ASEAN blue #0369A1)
- Prisma schema with all models (18 tables)
- Provider adapter architecture ready
- Environment configuration files

### ⚠️ Pending:
- Database connection (needs correct password)
- Prisma schema validation (full schema may have minor issues)
- Frontend implementation

## Next Steps

1. Update `DATABASE_URL` with your actual Supabase password
2. Run `npx prisma db push` to create database tables
3. Run `npm run dev` to start the development server
4. Complete frontend implementation based on the PRD

## Database Schema

The Prisma schema includes these main models:
- User, Organization, Role
- Assistant, AssistantVersion
- Prompt, PromptVersion, PromptCategory
- Provider, Model, ModelRun
- Experiment, ExperimentRun, ExperimentCase, ExperimentResult
- Evaluation, EvaluationRubric
- Finding
- SecurityTest, SecurityResult
- Document, Source
- LibraryItem
- Plan, Subscription
- AuditLog

## Contact

If you continue to have database connection issues, please check:
- Supabase project is active
- Database password is correct
- Network/firewall isn't blocking connection
- Supabase region matches your connection string
