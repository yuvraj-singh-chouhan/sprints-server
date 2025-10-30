# SprintGear Server

A TypeScript Node.js REST API for an e-commerce platform. Built with Express and Sequelize (PostgreSQL), featuring modular domain structure, JWT-based auth, validation, i18n, and Swagger documentation.

## Tech Stack
- Node.js + TypeScript
- Express
- Sequelize (PostgreSQL)
- JWT authentication
- Joi validation
- i18n (localization)
- Jest + Supertest (tests)
- Swagger (OpenAPI) docs

## Prerequisites
- Node.js 18+
- PostgreSQL 13+

## Getting Started
1. Clone the repo
   ```bash
   git clone <repo-url>
   cd SprintGear-server
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Configure environment
   - The app loads env from `src/.env.dev` via `src/config/config.ts`.
   - Create a file at `src/.env.dev` with the following variables:
     ```env
     NODE_ENV=development
     port=4000

     db_name=sprintgear
     db_user=postgres
     db_password=postgres
     db_host=127.0.0.1
     db_port=5432

     jwt_secret=your_jwt_secret_here
     password_reset_secret_key=your_password_reset_secret_here
     ```
4. Run database
   - Ensure PostgreSQL is running and the database `db_name` exists (or create it).
5. Start the server
   - Development (with nodemon):
     ```bash
     npm run dev
     ```
   - Production-like (ts-node):
     ```bash
     npm start
     ```

On startup, the server will:
- Connect to PostgreSQL
- Load all Sequelize models in `src/modules/**/Model.ts`
- Run `sequelize.sync({ alter: true })` to sync schemas
- Start the Express app

## NPM Scripts
- `npm start`: Run server with ts-node (`src/index.ts`)
- `npm run dev`: Run with nodemon for live-reload
- `npm test`: Run Jest tests in band

## API Docs
- Aggregate Swagger: `swagger.json` at project root
- Per-module specs: `src/modules/**/Swagger.json`
- You can mount Swagger UI using `swagger-ui-express` in your Express config if not already exposed.

## Authentication
- JWT-based auth
- `Authorization` header is required for protected routes
- Token generation/verification implemented in `src/modules/Users/Service.ts`

## Project Structure
```text
SprintGear-server/
├─ jest.config.ts
├─ package.json
├─ tsconfig.json
├─ swagger.json
├─ src/
│  ├─ index.ts
│  ├─ config/
│  │  ├─ config.ts            # Loads env from src/.env.dev
│  │  ├─ express.ts           # Express app/bootstrap
│  │  └─ sequelize.ts         # Sequelize init, model auto-loader
│  ├─ locales/
│  │  ├─ en.json
│  │  └─ hi.json
│  ├─ modules/
│  │  ├─ Base/                # Base abstractions
│  │  │  ├─ Controller.ts
│  │  │  ├─ MainValidator.ts
│  │  │  └─ Repository.ts
│  │  ├─ Admins/
│  │  ├─ Authentication/
│  │  ├─ Cart/
│  │  ├─ Category/
│  │  ├─ Orders/
│  │  ├─ Product/
│  │  ├─ Roles/
│  │  ├─ Users/
│  │  ├─ UsersManagement/
│  │  ├─ Variant/
│  │  ├─ Vendor/
│  │  └─ Wishlist/
│  │      # Each module typically contains:
│  │      # Controller.ts, Model.ts, Routes.ts, Service.ts,
│  │      # Validator.ts, Swagger.json, plus types/Repository as needed
│  ├─ services/
│  │  ├─ Global/
│  │  │  ├─ common.ts         # Common helpers/response handling
│  │  │  └─ constant.ts       # Constants and HTTP codes
│  │  ├─ middlewares/
│  │  │  ├─ auth.ts           # JWT auth middleware
│  │  │  └─ ErrorMiddleWare.ts
│  │  └─ Seed.ts
│  ├─ tests/
│  │  ├─ index.test.ts
│  │  └─ modules/
│  │     └─ Category/
│  │        └─ Category.test.ts
│  ├─ types/
│  │  ├─ constantTypes.ts
│  │  ├─ errorTypes.ts
│  │  ├─ express.d.ts         # Express type augmentation
│  │  ├─ requestTypes.ts
│  │  └─ userType.ts
│  └─ Utils/
│     └─ Errors.ts
```

## Development Notes
- Environment file path is pinned to `src/.env.dev`. Adjust `src/config/config.ts` if you prefer `.env` at the project root.
- Sequelize auto-loads models from `src/modules/**/Model.ts` and runs any exported `associate` methods to link relations.
- i18n translations live in `src/locales/*`. Response messages likely map to keys there.

## Testing
```bash
npm test
```

## License
MIT
