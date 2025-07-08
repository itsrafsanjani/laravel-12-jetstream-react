# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Backend (Laravel)
- `composer dev` - Run full development server with queue, logs, and Vite
- `composer test` - Run PHP tests with configuration clearing
- `php artisan test` - Run specific test files
- `vendor/bin/pint` - Format PHP code (Laravel Pint)
- `vendor/bin/phpstan analyse` - Run static analysis

### Frontend (React/TypeScript)
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint with auto-fix
- `npm run types` - TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting without changes

## Project Architecture

### Stack Overview
- **Backend**: Laravel 12 with Jetstream (Inertia stack)
- **Frontend**: React 19 with TypeScript
- **Authentication**: Laravel Sanctum with Jetstream teams
- **Database**: SQLite (development)
- **Build**: Vite
- **Testing**: Pest (PHP), PHPUnit configuration
- **Styling**: Tailwind CSS v4 with shadcn/ui components

### Key Architectural Decisions

#### Laravel 12 Structure
- Uses new Laravel 11+ bootstrapping (`bootstrap/app.php`, not old Kernel files)
- Middleware registration in `bootstrap/app.php`
- Command scheduling in `routes/console.php`
- Service providers only in `AppServiceProvider` (avoid creating new ones)
- Auto-registered commands in `app/Console/Commands/`

#### Jetstream Configuration
- Teams feature enabled with invitations
- Account deletion enabled
- Profile photos, API tokens, and terms/privacy disabled
- Uses Sanctum guard for authentication

#### Frontend Structure
- Inertia.js for React integration with Laravel
- TypeScript with strict type checking
- Component structure: Pages, Components, Layouts
- Custom hooks in `Hooks/` directory
- Shared types in `types/index.d.ts`
- shadcn/ui components in `Components/ui/`

#### Database & Models
- SQLite for development
- Jetstream models: User, Team, TeamInvitation, Membership
- Uses factories for User and Team
- Pest configuration with RefreshDatabase trait

#### Asset Pipeline
- Vite configuration with React and Tailwind plugins
- Path aliases: `@/` maps to `resources/js/`
- CSS in `resources/css/app.css`

## Development Guidelines

### PHP Standards
- Use dependency injection and service containers
- Use `php artisan make:{type}` for generating files
- Never use `env()` directly - use `config()` functions
- Use eager loading to prevent N+1 queries
- Apply strict typing: `declare(strict_types=1)`
- Use modern PHP 8.2+ syntax (`match`, nullsafe operators)
- Use Laravel collections over arrays
- Use Form Request validation classes
- Follow snake_case for database/private methods, camelCase for properties
- Resource controllers with standard methods only
- Try to keep controllers clean, moving logic to models or services
- Write complete up/down migration methods

### React/TypeScript Standards
- Use TypeScript with strict type checking
- Define types in `resources/js/types/index.d.ts`
- Prefer `type` over `interface` for definitions
- Use Tailwind CSS for styling
- Follow existing component patterns in `Components/`

### Testing
- Write feature tests for new functionality
- Use Pest syntax with existing configuration
- Run tests before marking tasks complete
- Tests use in-memory SQLite database

## File Structure Highlights

### Backend Key Directories
- `app/Actions/` - Jetstream action classes
- `app/Http/Controllers/` - Standard controllers + Auth, Settings
- `app/Models/` - Eloquent models with Team/User relationships
- `app/Policies/` - Authorization policies
- `routes/` - Separated route files (web, auth, jetstream, settings)
- `config/` - Configuration files including jetstream.php, inertia.php

### Frontend Key Directories
- `resources/js/Pages/` - Inertia pages (Auth, Profile, Teams, Settings)
- `resources/js/Components/` - Reusable React components
- `resources/js/Layouts/` - Page layouts (App, Auth, Settings)
- `resources/js/Hooks/` - Custom React hooks
- `resources/js/lib/` - Utility functions

## Notes
- Uses pnpm as package manager
- Appearance/theme system implemented with custom hooks
- Comprehensive TypeScript definitions for Jetstream features
- Auto-formatting with Prettier and ESLint configuration
- When using any package or library, use context7 to find the latest documentation.
