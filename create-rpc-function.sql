-- Create the exec_sql RPC function for Supabase
-- This function allows executing raw SQL statements via the REST API

CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION exec_sql(text) TO authenticated;

-- Grant execute permission to anon users (if needed)
GRANT EXECUTE ON FUNCTION exec_sql(text) TO anon;

-- Grant execute permission to service_role (for admin operations)
GRANT EXECUTE ON FUNCTION exec_sql(text) TO service_role; 