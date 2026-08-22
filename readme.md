# AI Research Lab

Platform penelitian dan pengembangan AI untuk membangun, menguji, dan mengevaluasi model AI serta asisten virtual.

## Tentang Sistem

AI Research Lab adalah aplikasi web yang dirancang untuk peneliti dan pengembang AI guna melakukan eksperimen terhadap model bahasa, membangun asisten AI dengan framework terstruktur, serta menguji keamanan sistem AI dari berbagai serangan.

Sistem ini menyediakan lingkungan terintegrasi untuk:
- Membuat asisten AI menggunakan framework **AUTOMAT(E)**
- Menjalankan eksperimen perilaku model (kebenaran, bias, sycophancy, konsistensi)
- Menguji keamanan AI dari serangan prompt injection dan eksploitasi data
- Mengelola multiple AI provider (OpenAI-compatible API)
- Membangun library prompt dan framework yang dapat dibagikan

## Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Database | PostgreSQL (Supabase) |
| AI Integration | OpenAI-compatible API |
| Internationalization | next-intl |
| Language | TypeScript |

## Arsitektur

```
ai-research-lab/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── [locale]/                 # Locale-based routing
│   │   │   └── (app)/               # Main application layout
│   │   │       ├── dashboard/        # Dashboard utama
│   │   │       ├── assistant/        # AUTOMAT(E) builder
│   │   │       ├── research/         # Eksperimen penelitian
│   │   │       ├── library/          # Library prompt & tools
│   │   │       ├── security/         # Security testing
│   │   │       ├── settings/         # Provider management
│   │   │       └── help/             # Dokumentasi
│   │   └── api/                      # Backend API routes
│   │       ├── experiments/          # CRUD eksperimen
│   │       ├── assistants/           # CRUD asisten
│   │       ├── providers/            # AI provider management
│   │       ├── generate/             # Text generation
│   │       ├── library/              # Library management
│   │       ├── activity/             # Activity logging
│   │       └── security/run/         # Security test execution
│   ├── components/                   # Reusable UI components
│   │   └── ui/                       # Base UI components
│   ├── lib/                          # Core utilities
│   │   ├── ai/                       # AI integration (OpenAI-compatible)
│   │   ├── db/                       # Database connection (pg pool)
│   │   └── utils.ts                  # Helper functions
│   ├── i18n/                         # Internationalization config
│   ├── providers/                    # Theme provider
│   └── types/                        # TypeScript types
├── messages/                         # i18n translations
│   ├── en.json
│   ├── id.json
│   └── zh.json
└── public/                           # Static assets
```

## Fitur Utama

### 1. AUTOMAT(E) Builder
Framework terstruktur untuk membuat system prompt AI:
- **A**ct As - Definisikan peran dan identitas AI
- **U**ser Audience - Target pengguna
- **T**argeted Action - Aksi utama yang dijalankan
- **O**utput Definition - Format dan definisi output
- **M**ode & Tone - Gaya komunikasi
- **A**typical Cases - Penanganan kasus edge
- **T**opic Whitelisting - Topik yang diizinkan
- **E**xamples - Contoh interaksi

### 2. Research Lab
Platform eksperimen untuk menguji perilaku model:
- Kategori: Truthfulness, Sycophancy, Bias, Consistency, Injection, Limitation
- Run experiment dengan logging otomatis
- Analisis hasil per run
- Export hasil eksperimen

### 3. Security Testing
Suite pengujian keamanan AI:
- **Direct Injection** - System override, jailbreak, role hijack
- **Indirect Injection** - Document payload, web retrieval poisoning
- **Scope Violation** - Off-topic escalation, function abuse
- **Data Exposure** - Secret disclosure, PII harvesting

### 4. Provider Management
Manajemen multiple AI providers:
- Support semua OpenAI-compatible API
- Import/Export provider configuration
- Test koneksi provider
- Activate/deactivate provider

### 5. Library
Koleksi prompt, framework, dan tools:
- Filter berdasarkan akses (Public, Research, Premium)
- Search dan kategori
- Download dan share items
- Rating dan download counter

### 6. Internationalization
Dukungan multi-bahasa:
- English (en)
- Indonesian (id)
- Chinese (zh)

## Database Schema

Tabel utama yang digunakan:
- `experiments` - Data eksperimen penelitian
- `assistants` - Asisten AI dengan system prompt
- `providers` - Konfigurasi AI provider
- `activity_logs` - Log aktivitas sistem
- `library_items` - Item library (prompt, framework, tools)
- `experiment_runs` - Hasil setiap run eksperimen

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase atau self-hosted)

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local dengan DATABASE_URL Anda

# Run development server
npm run dev
```

### Environment Variables

```env
DATABASE_URL=postgresql://username:password@host:port/database
```

## API Endpoints

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/experiments` | GET/POST | List/create eksperimen |
| `/api/experiments/[id]` | GET | Detail eksperimen dan runs |
| `/api/assistants` | GET/POST | List/create asisten |
| `/api/providers` | GET/POST | List/create provider |
| `/api/providers/[id]` | PATCH/DELETE | Update/delete provider |
| `/api/providers/test` | POST | Test koneksi provider |
| `/api/generate` | POST | Generate text dengan AI |
| `/api/library` | GET/POST | List/create library items |
| `/api/security/run` | POST | Jalankan security tests |
| `/api/activity` | GET | Activity logs |

## Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint check
npm run typecheck  # TypeScript check
```

## License

Private - Untuk penggunaan internal
