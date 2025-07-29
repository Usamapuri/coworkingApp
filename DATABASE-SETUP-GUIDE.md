# Database Setup Guide for CalmKaaj

This guide will help you set up the database connection for the CalmKaaj application.

## Quick Setup

1. **Run the setup script:**
   ```bash
   npm run setup
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Test the connection:**
   ```bash
   npm run test:db
   ```

## Manual Setup

### 1. Create Environment File

Create a `.env` file in the root directory with the following content:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# Session Configuration
SESSION_SECRET=your-secret-key-here

# Email Configuration (Optional)
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@calmkaaj.com

# Push Notifications (Optional)
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key

# Environment
NODE_ENV=development
```

### 2. Get Your Supabase Connection String

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** > **Database**
4. Copy the **Connection string** (use the pooler connection for better reliability)
5. Replace the placeholder in your `.env` file

### 3. Database Schema Setup

If you need to set up the database schema:

```bash
npm run db:push
```

## Troubleshooting

### Common Issues

#### 1. "DATABASE_URL environment variable is not set"

**Solution:** Make sure you have a `.env` file in the root directory with the correct `DATABASE_URL`.

#### 2. "fetch failed" Error

**Causes:**
- Missing `DATABASE_URL` environment variable
- Network connectivity issues
- Incorrect connection string format

**Solutions:**
- Verify your `.env` file exists and contains the correct `DATABASE_URL`
- Check your internet connection
- Use the pooler connection string from Supabase
- Ensure your Supabase project is active

#### 3. "ENOTFOUND" Error

**Causes:**
- DNS resolution issues
- Incorrect hostname in connection string
- Supabase project is inactive

**Solutions:**
- Verify your Supabase project is active
- Check the connection string hostname
- Use the pooler connection instead of direct connection

#### 4. "authentication" Error

**Causes:**
- Incorrect password
- Wrong username
- Expired credentials

**Solutions:**
- Check your database password in Supabase
- Verify the username is correct
- Regenerate your database password if needed

### Testing Your Connection

Run the connection test:

```bash
npm run test:db
```

This will:
- Check if `DATABASE_URL` is set
- Validate the connection string format
- Test the actual database connection
- Provide specific error messages for troubleshooting

### Production Deployment

For production deployment on Vercel:

1. Set environment variables in your Vercel project settings
2. Use the pooler connection string for better reliability
3. Ensure all required environment variables are configured

### Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Supabase PostgreSQL connection string |
| `SESSION_SECRET` | Yes | Secret key for session encryption |
| `SENDGRID_API_KEY` | No | API key for email notifications |
| `FROM_EMAIL` | No | Default sender email address |
| `VAPID_PUBLIC_KEY` | No | Public key for push notifications |
| `VAPID_PRIVATE_KEY` | No | Private key for push notifications |
| `NODE_ENV` | No | Environment (development/production) |

## Support

If you continue to experience issues:

1. Check the Supabase project status
2. Verify your connection string format
3. Test with the provided connection test script
4. Check the application logs for detailed error messages 