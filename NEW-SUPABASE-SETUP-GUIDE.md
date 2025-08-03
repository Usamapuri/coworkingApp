# 🚀 New Supabase Database Setup Guide

## 🎯 **Quick Start**

### 1. **Create New Supabase Project**
1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Name: `calmkaaj-local-test`
4. Choose region and set database password
5. Wait for creation (2-3 minutes)

### 2. **Get Your Credentials**
1. Go to **Settings** → **API**
2. Copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key

### 3. **Set Up Local Environment**

Create `.env.local` file:

```bash
# New Supabase Database
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgres://postgres.your-project-id:your-password@your-project-id.supabase.co:5432/postgres?sslmode=require

# Local Development
NODE_ENV=development
PORT=3001
```

### 4. **Create RPC Function**

1. Go to your Supabase **SQL Editor**
2. Run the contents of `create-rpc-function.sql`
3. This creates the `exec_sql` function needed for the setup script

### 5. **Set Environment Variables for Setup**

```bash
export NEW_SUPABASE_URL="https://your-project-id.supabase.co"
export NEW_SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 6. **Run Database Setup**

```bash
npm run setup-new-db
```

### 7. **Test Locally**

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

## 🔧 **Manual Setup (If Script Fails)**

### Step 1: Create RPC Function
Run this in Supabase SQL Editor:

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

GRANT EXECUTE ON FUNCTION exec_sql(text) TO authenticated;
GRANT EXECUTE ON FUNCTION exec_sql(text) TO anon;
GRANT EXECUTE ON FUNCTION exec_sql(text) TO service_role;
```

### Step 2: Run Schema
1. Copy contents of `supabase_migration_clean.sql`
2. Paste in Supabase SQL Editor
3. Click "Run"

### Step 3: Import Data
1. Copy contents of `supabase_data_import_final.sql`
2. Paste in Supabase SQL Editor
3. Click "Run"

## 📊 **Verify Setup**

Check these tables have data:
- `announcements` (should have records)
- `menu_categories` (should have records)
- `menu_items` (should have records)
- `meeting_rooms` (should have records)
- `users` (should have admin users)

## 🎯 **Expected Results**

After successful setup:
- ✅ Database schema created
- ✅ Sample data imported
- ✅ Local development working
- ✅ API endpoints functional
- ✅ Frontend connecting to database

## 🚀 **Next Steps**

1. **Test Application**: Verify all features work locally
2. **Update Railway**: Replace old database with new one
3. **Deploy**: Push to Railway with new database
4. **Monitor**: Check logs and performance

## 🔍 **Troubleshooting**

### Connection Issues
- Check environment variables
- Verify project URL and keys
- Ensure database password is correct

### RPC Function Missing
- Run `create-rpc-function.sql` in SQL Editor
- Check function permissions

### Data Not Imported
- Check SQL execution logs
- Verify table structure
- Run manual SQL import

## 📝 **Files Created**

- `setup-new-supabase.js` - Automated setup script
- `create-rpc-function.sql` - RPC function creation
- `NEW-SUPABASE-SETUP-GUIDE.md` - This guide
- `.env.local` - Local environment config

---

**🎉 Once setup is complete, you'll have a fresh, working database for local testing!** 