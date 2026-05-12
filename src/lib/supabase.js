import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hdrizybwxovnaykffley.supabase.co";
const supabaseAnonKey = "sb_publishable_mDHo1O5oiC4LisAPNBXvuw_g0iT9F2R";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);