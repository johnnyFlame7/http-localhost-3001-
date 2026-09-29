import { createClient } from "@/lib/supabase/server";

// Confirms this request comes from a logged-in Supabase Auth user whose
// email matches YOUR ADMIN_EMAIL (set in environment variables). This is
// the only account treated as the store owner — no hardcoded password
// anywhere in the code, and no one else can reach admin data even if they
// create their own Supabase account on your project.
export async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) return null;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || user.email.toLowerCase() !== adminEmail.toLowerCase()) return null;
  return user;
}
