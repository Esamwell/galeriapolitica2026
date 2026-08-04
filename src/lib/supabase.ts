import { createClient } from "@supabase/supabase-js";

// Variáveis com fallback seguro para não quebrar a compilação do Next.js quando o Supabase não estiver configurado
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-politica2026.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
