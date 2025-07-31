# Force Fresh Deployment Guide

## The Problem
Your Vercel deployment is "Ready" but still using the old environment variables with the wrong hostname (`api.dtwrnpoqfvensnrvchkr.supabase.co` instead of `db.dtwrnpoqfvensnrvchkr.supabase.co`).

## Solution: Force a Fresh Deployment

### Step 1: Verify Environment Variables
1. Go to **Vercel Dashboard** → **Settings** → **Environment Variables**
2. Confirm `DATABASE_URL` is set to:
   ```
   postgresql://postgres:calmkaaj7874@db.dtwrnpoqfvensnrvchkr.supabase.co:5432/postgres
   ```

### Step 2: Force Redeploy
**Option A: Via Git Push**
```bash
# Make a small change to trigger deployment
echo "# Force redeploy" >> README.md
git add README.md
git commit -m "Force redeploy with correct environment variables"
git push origin main
```

**Option B: Via Vercel Dashboard**
1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Or go to **Settings** → **General** → **Redeploy**

### Step 3: Wait for New Deployment
- Watch the **Deployments** tab for a new deployment
- Make sure it shows **"Ready"** status
- The deployment should use the updated environment variables

### Step 4: Test Login
Once the new deployment is ready, try logging in again.

## Why This Happens
Vercel sometimes caches environment variables or uses cached deployments. A fresh deployment ensures the latest environment variables are used.

## Alternative: Check Runtime Logs
If the issue persists:
1. Go to **Runtime Logs** in your deployment
2. Look for the actual error messages
3. Verify which hostname is being used in the logs 