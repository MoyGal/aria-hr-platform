export type UserRole = 'master' | 'company_admin' | 'recruiter' | 'candidate';

export const DEFAULT_USER_ROLE: UserRole = 'recruiter';

export function isMasterRole(role: UserRole | undefined | null): boolean {
  return role === 'master';
}

export function isCompanyAdmin(role: UserRole | undefined | null): boolean {
  return role === 'company_admin' || role === 'master';
}

export function canManageInterviewers(role: UserRole | undefined | null): boolean {
  return role === 'recruiter' || role === 'company_admin' || role === 'master';
}

export function canAccessAdminPanel(role: UserRole | undefined | null): boolean {
  return role === 'master';
}

export function canAccessDashboard(role: UserRole | undefined | null): boolean {
  if (!role) return false;
  return role === 'master' || role === 'company_admin' || role === 'recruiter';
}

export function resolveMasterUids(): Set<string> {
  const raw = process.env.NEXT_PUBLIC_MASTER_UID ?? '';
  return new Set(
    raw
      .split(',')
      .map(value => value.trim())
      .filter(Boolean)
  );
}

export function enforceRoleConsistency(uid: string, currentRole: UserRole | undefined | null): UserRole {
  const masterUids = resolveMasterUids();
  if (masterUids.has(uid)) {
    return 'master';
  }
  if (!currentRole) {
    return DEFAULT_USER_ROLE;
  }
  return currentRole;
}
