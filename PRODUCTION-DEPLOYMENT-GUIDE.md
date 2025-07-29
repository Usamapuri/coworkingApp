# Production Deployment Guide

This guide will help you fix the authentication issues and deploy your CalmKaaj application to production.

## Issues Identified from Vercel Logs

Based on the Vercel monitoring dashboard, the following issues were found:

1. **401 Unauthorized** errors on `/api/auth/me` requests
2. **400 Bad Request** errors on `/api/auth/login` requests  
3. **MemoryStore warning** - Using in-memory session store in production
4. **Database connectivity** issues

## Quick Fix Commands

### 1. Test Current Setup
```bash
npm run test:quick
```

### 2. Fix Production Issues
```bash
npm run fix:production
```

### 3. Test Database Connection
```bash
npm run test:db
```

## Step-by-Step Fix Process

### Step 1: Environment Variables

Set these environment variables in your Vercel project:

**Required:**
```
DATABASE_URL=postgresql://postgres.dtwrnpoqfvensnrvchkr:8gVOFtb6Fsm7uHyT@aws-0-us-east-1.pooler.supabase.com:6543/postgres
SESSION_SECRET=your-strong-secret-key-here
NODE_ENV=production
```

**Optional:**
```
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@calmkaaj.com
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
```

### Step 2: Database Setup

1. **Run the sessions table migration:**
   ```sql
   -- Execute this in your Supabase SQL editor
   CREATE TABLE IF NOT EXISTS "sessions" (
     "sid" varchar NOT NULL COLLATE "default",
     "sess" json NOT NULL,
     "expire" timestamp(6) NOT NULL
   );
   
   ALTER TABLE "sessions" ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("sid");
   CREATE INDEX "IDX_sessions_expire" ON "sessions" ("expire");
   ```

2. **Or use the provided migration file:**
   ```bash
   # Copy the contents of supabase_migration_sessions.sql to your Supabase SQL editor
   ```

### Step 3: Network Connectivity

If you're experiencing "fetch failed" errors:

1. **Try a different network** (mobile hotspot, VPN)
2. **Check Supabase project status** - ensure it's active
3. **Verify connection string** - use the pooler connection for Vercel

### Step 4: Deploy to Vercel

1. **Push your changes:**
   ```bash
   git add .
   git commit -m "Fix production authentication and session issues"
   git push
   ```

2. **Set environment variables in Vercel:**
   - Go to your Vercel project dashboard
   - Navigate to Settings > Environment Variables
   - Add all required environment variables

3. **Redeploy:**
   - Trigger a new deployment in Vercel
   - Monitor the logs for any remaining issues

## What Was Fixed

### 1. Session Management
- ✅ **Replaced MemoryStore** with PostgreSQL session store for production
- ✅ **Added sessions table** migration
- ✅ **Configured secure cookies** for production
- ✅ **Added proper session configuration**

### 2. Authentication
- ✅ **Fixed session persistence** across serverless function calls
- ✅ **Added proper CORS configuration**
- ✅ **Improved error handling** for authentication failures

### 3. Database Connectivity
- ✅ **Added environment variable loading**
- ✅ **Created connection testing tools**
- ✅ **Added production-ready session store**

## Monitoring and Debugging

### Check Application Health
```bash
# Test database connection
npm run test:db

# Quick health check
npm run test:quick

# Full production check
npm run fix:production
```

### Vercel Logs to Monitor
- **401 errors** should be resolved with proper session management
- **400 errors** should be resolved with proper authentication flow
- **MemoryStore warnings** should be gone with PostgreSQL session store

### Expected Behavior After Fix
1. ✅ Users can log in successfully
2. ✅ Sessions persist across requests
3. ✅ No more MemoryStore warnings
4. ✅ Database connections work reliably

## Troubleshooting

### If Authentication Still Fails
1. Check that `SESSION_SECRET` is set and strong
2. Verify `NODE_ENV=production` is set
3. Ensure sessions table exists in database
4. Check Vercel environment variables are properly set

### If Database Connection Fails
1. Test with `npm run test:db`
2. Try different network (mobile hotspot)
3. Check Supabase project is active
4. Verify connection string format

### If Sessions Don't Persist
1. Ensure sessions table exists
2. Check PostgreSQL session store is initialized
3. Verify secure cookie settings
4. Check CORS configuration

## Support

If issues persist:
1. Run `npm run fix:production` for detailed diagnostics
2. Check Vercel function logs for specific error messages
3. Verify all environment variables are set correctly
4. Test database connectivity from your local environment 