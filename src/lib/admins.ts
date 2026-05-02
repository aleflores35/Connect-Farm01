// Source-of-truth for admin email allowlist.
// firestore.rules duplicates this list (Firestore rules can't import TS) —
// keep them in sync.
export const ADMIN_EMAILS = [
  'alessandro.flores16@gmail.com',
  'rodrigo@connectfarm.com.br',
] as const;

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return (ADMIN_EMAILS as readonly string[]).includes(email);
}
