# SWC Platform

A full-stack monorepo built with NestJS, Next.js, and Prisma, managed with PNPM.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PNPM 8+
- Docker & Docker Compose (for local database)

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <your-repo-url>
   cd swc-platform
   pnpm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   cp apps/api/.env.example apps/api/.env.local
   cp apps/web/.env.example apps/web/.env.local
   ```

3. **Start the database with Docker**
   ```bash
   docker-compose up -d
   ```

4. **Run database migrations**
   ```bash
   cd packages/db
   pnpm install
   npx prisma generate
   npx prisma db push
   cd ../..
   ```

5. **Start development servers**
   ```bash
   pnpm dev
   ```

This will start:
- API server on http://localhost:3001
- Web app on http://localhost:3000

## 📁 Project Structure

```
swc-platform/
├── apps/
│   ├── api/              # NestJS API server
│   └── web/              # Next.js web application
├── packages/
│   └── db/               # Prisma database package
├── .github/workflows/    # CI/CD configuration
├── docker-compose.yml    # Database services
└── README.md
```

## 🛠️ Available Scripts

### Root Level
- `pnpm dev` - Start all applications in development mode
- `pnpm build` - Build all packages and applications
- `pnpm lint` - Run linting across all packages
- `pnpm test` - Run tests for all packages
- `pnpm type-check` - Run TypeScript type checking
- `pnpm clean` - Clean all build outputs

### API (NestJS)
- `pnpm --filter @swc/api dev` - Start API server in watch mode
- `pnpm --filter @swc/api build` - Build API server
- `pnpm --filter @swc/api test` - Run API tests
- `pnpm --filter @swc/api lint` - Lint API code

### Web (Next.js)
- `pnpm --filter @swc/web dev` - Start Next.js development server
- `pnpm --filter @swc/web build` - Build Next.js application
- `pnpm --filter @swc/web start` - Start Next.js production server
- `pnpm --filter @swc/web lint` - Lint Next.js code

### Database (Prisma)
- `cd packages/db && pnpm build` - Build database package
- `cd packages/db && npx prisma generate` - Generate Prisma client
- `cd packages/db && npx prisma studio` - Open Prisma Studio
- `cd packages/db && npx prisma db push` - Push schema to database

## 🗄️ Database

### Local Development

The project includes Docker Compose configuration for local development:

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- pgAdmin on port 5050

### pgAdmin Access

- URL: http://localhost:5050
- Email: admin@swc.com  
- Password: admin123

### Database Schema

The Prisma schema is located in `packages/db/prisma/schema.prisma`. After making changes:

```bash
cd packages/db
npx prisma generate
npx prisma db push
```

## 🔧 Development

### Adding New Dependencies

When adding dependencies to packages or apps, use the workspace syntax:

```bash
# Add to a specific package
pnpm --filter @swc/api add <package-name>
pnpm --filter @swc/web add <package-name>
pnpm --filter @swc/db add <package-name>

# Add as dev dependency
pnpm --filter @swc/api add -D <package-name>
```

### TypeScript Path Mapping

The project uses path mapping for clean imports:
- `@swc/api/*` maps to `apps/api/src/*`
- `@swc/web/*` maps to `apps/web/src/*`
- `@swc/db/*` maps to `packages/db/src/*`

## 📦 CI/CD

The project includes GitHub Actions workflows for:
- Multi-Node version testing (18.x, 20.x)
- Linting and type checking
- Building all packages and applications
- Running test suites

Push to `main` or create a pull request to trigger the CI pipeline.

## 🔍 Code Quality

### ESLint & Prettier

The project uses:
- ESLint for code linting
- Prettier for code formatting
- Husky for pre-commit hooks
- lint-staged for staged file processing

Pre-commit hooks will automatically lint and format your code before each commit.

### Type Safety

Full TypeScript strict mode is enabled across the monorepo. Run type checking with:
```bash
pnpm type-check
```

## 🚀 Deployment

### API Deployment

```bash
pnpm --filter @swc/api build
cd apps/api
npm run start:prod
```

### Web Deployment

```bash
pnpm --filter @swc/web build
cd apps/web
npm run start
```

## 🐛 Troubleshooting

### Port Already in Use
If you get port conflicts:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Database Connection Issues
1. Ensure Docker is running
2. Check database credentials in `.env` files
3. Verify PostgreSQL is accessible on port 5432

### PNPM Store Issues
If you encounter PNPM store issues:
```bash
pnpm store prune
rm -rf node_modules
pnpm install
```

## 📝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Ensure all tests pass: `pnpm test`
4. Run linting: `pnpm lint`
5. Commit with conventional commit messages
6. Push and create a pull request

## 📄 License

This project is private and proprietary.
