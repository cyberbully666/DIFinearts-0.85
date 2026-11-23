import { createClient } from "@supabase/supabase-js";

// These two values are safe to keep in the website code.
// (Never put the Supabase "secret" / "service_role" key here.)
const SUPABASE_URL = "https://upkobskqbzeqhdzjimtj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_dMMEhwzbBqLS88iqJ2-pAg_46qyuut2";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export const ARTWORK_BUCKET = "artworks";
export const ENQUIRY_EMAIL = "difinearts.official@gmail.com";

export function artworkImageUrl(path) {
  if (!path) return "";
  return supabase.storage.from(ARTWORK_BUCKET).getPublicUrl(path).data.publicUrl;
}
