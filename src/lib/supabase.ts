import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = "https://yxmgiwiwsvcrjyhteqzq.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4bWdpd2l3c3Zjcmp5aHRlcXpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2Mjk0NzYsImV4cCI6MjEwNTIwNTQ3Nn0.F3MbK8q77Jeiy4x5niM6amXuPyiD5TkE5cQe76x1XsQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);