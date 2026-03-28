import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fvxiyxmyjpahghtvxufm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eGl5eG15anBhaGdodHZ4dWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MjExNjMsImV4cCI6MjA5MDE5NzE2M30.DzehuCrqFRxR81xnheqCO77CxL5tPraEu5dz3q8vQuY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
