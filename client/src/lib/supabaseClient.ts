import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dtwrnpoqfvensnrvchkr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d3JucG9xZnZlbnNucnZjaGtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MjMyMDAsImV4cCI6MjA2ODQ5OTIwMH0.4aYpUHQyz__eIt_r72qn8GDemfVMITwVaOuuUizQLOI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 