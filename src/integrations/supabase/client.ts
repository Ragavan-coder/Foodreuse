
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kwbgfedwjjaszipncxpu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3YmdmZWR3amphc3ppcG5jeHB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNjg1NDAsImV4cCI6MjA2Mjg0NDU0MH0.uwPxEMlAlw3ZhqzJrrAFEYWEAYcHeY_nXjRlE8QYgqk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
