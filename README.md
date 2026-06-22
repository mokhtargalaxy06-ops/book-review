# Leaf & Lore — Book Review Application

A full-stack book discovery and review application built with a Laravel JSON API and a React TypeScript SPA.

## Stack

- Laravel 11.54, PHP 8.2+, MySQL, Sanctum stateful SPA authentication
- React 18, Vite 5, TypeScript, React Router 6
- TanStack Query, Axios, React Hook Form, Zod
- Tailwind CSS, Lucide icons, Sonner notifications

> **Laravel 11 support notice:** Laravel 11 reached the end of its security-fix window before this project was generated. Composer reports security advisories against the framework. It is pinned to Laravel 11 because that version was explicitly requested. Upgrade to a supported Laravel major before exposing the application to production traffic.

The application does not use temporary signed URLs and explicitly rejects CR/LF characters in email inputs, reducing exposure to the currently reported Laravel 11 issues, but upgrading the framework remains the proper fix.

## Project layout

```text
bookreview/
├── backend/   Laravel REST API
└── frontend/  React SPA
```

## Backend setup

Requirements: PHP 8.2+, Composer, MySQL, and the PHP extensions required by Laravel.

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
```

Create a MySQL database named `bookreview`, then update these values in `backend/.env`:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bookreview
DB_USERNAME=root
DB_PASSWORD=
```

Run the schema, sample data, and public-storage link:

```bash
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

The API runs at `http://localhost:8000`. Seeded login:

```text
Email: demo@example.com
Password: password123
```

For production, set `APP_ENV=production`, `APP_DEBUG=false`, HTTPS cookie settings, the real `APP_URL`, `FRONTEND_URL`, `SANCTUM_STATEFUL_DOMAINS`, and suitable cache/session/queue stores. Run `php artisan optimize` during deployment.

## Frontend setup

Node 18+ is supported by the pinned Vite 5 toolchain.

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The SPA runs at `http://localhost:5173`. Its environment file should contain:

```dotenv
VITE_BACKEND_URL=http://localhost:8000
```

For a production build:

```bash
npm run build
npm run preview
```

Serve `frontend/dist` through your web server and configure SPA fallback routing to `index.html`.

`npm audit --omit=dev` reports no production dependency vulnerabilities. The pinned Node-18-compatible Vite 5 development server has upstream advisories; do not expose `npm run dev` publicly. Move to Node 20.19+ and a current Vite major when upgrading the toolchain.

## Sanctum SPA authentication

The frontend first requests `/sanctum/csrf-cookie`, then sends credentials to `/api/login` or `/api/register`. Axios is configured with credentials and XSRF support. The backend enables Sanctum's stateful API middleware, credentialed CORS, database sessions, and trusted frontend domains.

The frontend and API must share the same top-level domain in a typical production deployment. Configure:

```dotenv
APP_URL=https://api.example.com
FRONTEND_URL=https://app.example.com
SANCTUM_STATEFUL_DOMAINS=app.example.com
SESSION_DOMAIN=.example.com
SESSION_SECURE_COOKIE=true
```

## Main API routes

Public:

- `GET /api/books` — pagination, search, genre/year/rating/featured filters, sorting
- `GET /api/books/{book}` — book details and reviews
- `GET /api/books/genres`
- `POST /api/register`
- `POST /api/login`

Authenticated with `auth:sanctum`:

- `POST /api/logout`
- `GET|PUT /api/profile`
- `GET /api/profile/reviews`
- `POST|PATCH|DELETE /api/books`
- `POST /api/books/{book}/reviews`
- `PATCH|DELETE /api/reviews/{review}`

Book updates/deletes are restricted to the user who created the book. Review updates/deletes are restricted to the review author. Review creation is limited to five requests per minute and one review per user per book.

## Verification

Backend:

```bash
cd backend
vendor/bin/pint --test
php artisan test
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

The included backend suite covers stateful registration/login/logout, public discovery, book ownership policies, review uniqueness, and review ownership.
