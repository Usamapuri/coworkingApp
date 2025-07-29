-- Create sessions table for PostgreSQL session store
-- This table is required for production session management

CREATE TABLE IF NOT EXISTS "sessions" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX IF NOT EXISTS "IDX_sessions_expire" ON "sessions" ("expire");

-- Grant necessary permissions
GRANT ALL ON TABLE "sessions" TO "postgres";
GRANT ALL ON TABLE "sessions" TO "authenticated";
GRANT ALL ON TABLE "sessions" TO "anon"; 