"use client";
import { createBrowserClient } from "@supabase/ssr";

// Safe to use in the browser — the anon key is public by design.
// Real access control happens via Supabase Auth sessions + Storage
// policies + our own ADMIN_EMAIL check on the server, not this key.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
