# Create New Supabase Project for Local Testing

## 🎯 **Objective**
Create a fresh Supabase database and set it up with the CalmKaaj schema and data for local testing.

## 📋 **Step-by-Step Instructions**

### 1. **Create New Supabase Project**

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `calmkaaj-local-test`
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to you
6. Click "Create new project"
7. Wait for the project to be created (2-3 minutes)

### 2. **Get Project Credentials**

1. Go to your new project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

### 3. **Set Environment Variables**

Create a `.env.local` file in your project root:

```bash
# New Supabase Database Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgres://postgres.your-project-id:your-db-password@your-project-id.supabase.co:5432/postgres?sslmode=require

# Local Development
NODE_ENV=development
PORT=3001
```

### 4. **Run Database Setup Script**

Add this script to your `package.json`:

```json
{
  "scripts": {
    "setup-new-db": "node setup-new-supabase.js"
  }
}
```

Then run:

```bash
npm run setup-new-db
```

### 5. **Alternative: Manual SQL Execution**

If the script doesn't work, you can manually execute the SQL:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the contents of `supabase_migration_clean.sql`
4. Then run the contents of `supabase_data_import_final.sql`

### 6. **Test Locally**

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3001](http://localhost:3001)

3. Test the application functionality

## 🔧 **Troubleshooting**

### If RPC Function Doesn't Exist
The `exec_sql` RPC function might not exist. In that case:

1. Go to Supabase SQL Editor
2. Create the function:
   ```sql
   CREATE OR REPLACE FUNCTION exec_sql(sql text)
   RETURNS void
   LANGUAGE plpgsql
   SECURITY DEFINER
   AS $$
   BEGIN
     EXECUTE sql;
   END;
   $$;
   ```

### If Connection Fails
1. Check your environment variables
2. Verify the project URL and keys
3. Make sure the database password is correct
4. Check if your IP is allowed (if using IP restrictions)

## 📝 **Files Created**

- `.env.local` - Local environment configuration
- `setup-new-supabase.js` - Database setup script

## 🎯 **Expected Result**

After setup, you should have:
- ✅ Fresh Supabase database with CalmKaaj schema
- ✅ All tables created and populated with data
- ✅ Local development environment working
- ✅ Application fully functional for testing

## 🚀 **Next Steps**

1. Test all application features locally
2. Verify database connections work
3. Update Railway environment variables with new database
4. Deploy to Railway with the new database 