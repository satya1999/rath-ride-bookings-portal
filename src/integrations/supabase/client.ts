
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jbqogluecqzzfuvfnaso.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpicW9nbHVlY3F6emZ1dmZuYXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MTgwNDgsImV4cCI6MjA1OTk5NDA0OH0.qlEe-wH_fXSgYR_fr22B7bZHuSaaVDLLqtJi4gj8ApM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'bus-booking-auth',
  }
});
