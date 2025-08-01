# CalmKaaj - Coworking Space Management App

A comprehensive coworking space management application built with Express.js, React, and Supabase.

## Features

- User authentication and authorization
- Organization management
- Cafe order management
- Meeting room bookings
- Announcements system
- Real-time notifications

## Tech Stack

- **Backend**: Express.js with TypeScript
- **Frontend**: React with TypeScript
- **Database**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM
- **Authentication**: Passport.js with session management
- **Deployment**: Vercel

## Environment Variables

The following environment variables are required:

```
POSTGRES_URL=postgres://postgres.dtwrnpoqfvensnrvchkr:calmkaaj7874@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x
SESSION_SECRET=your-secret-key-here
NODE_ENV=production
```

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run development server: `npm run dev`
5. Build for production: `npm run build`

## Database Setup

The application uses Supabase as the database provider. Make sure to:

1. Set up your Supabase project
2. Configure the correct connection string
3. Run database migrations if needed

## Deployment

The app is configured for deployment on Vercel with automatic environment variable management.

---
*Last updated: January 2024 - Database connection fixed*