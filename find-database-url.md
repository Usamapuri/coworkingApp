# How to Find Your DATABASE_URL in Supabase

## Step 1: Go to Supabase Dashboard
1. Visit: https://supabase.com/dashboard
2. Select your project

## Step 2: Go to Database Settings
1. Click on **Settings** (gear icon) in the left sidebar
2. Click on **Database**

## Step 3: Find Connection String
1. Scroll down to **Connection string** section
2. Look for **URI** format (not the individual parameters)
3. It should look like:
   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

## Step 4: Copy the URI
- Click the **Copy** button next to the URI
- This is your DATABASE_URL

## Step 5: Use in Vercel
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Add: `DATABASE_URL` = [the URI you copied]
- Set Environment to "Production"

## Example:
If your Supabase URI is:
```
postgresql://postgres.dtwrnpoqfvensnrvchkr:8gVOFtb6Fsm7uHyT@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

Then in Vercel, set:
```
DATABASE_URL=postgresql://postgres.dtwrnpoqfvensnrvchkr:8gVOFtb6Fsm7uHyT@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Note:** The DATABASE_URL I provided earlier might be correct, but you should verify it matches what's in your Supabase dashboard. 