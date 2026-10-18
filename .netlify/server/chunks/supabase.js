import { n as PUBLIC_SUPABASE_URL, t as PUBLIC_SUPABASE_ANON_KEY } from "./public.js";
import { createClient } from "@supabase/supabase-js";
var supabase = createClient(PUBLIC_SUPABASE_URL.replace(/\/+$/, "").replace(/\/rest\/v1\/?$/, ""), PUBLIC_SUPABASE_ANON_KEY, { auth: {
	persistSession: true,
	autoRefreshToken: true
} });
//#endregion
export { supabase as t };
