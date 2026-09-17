import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = "https://yxmgiwiwsvcrjyhteqzq.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_6B9UOtASWAzc2jvPuOrskg_xWoFObEB";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);