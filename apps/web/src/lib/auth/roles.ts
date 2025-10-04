// Role hierarchy and permissions system

export const ROLES = {
  MASTER_ADMIN: 'master_admin',
  COMPANY_ADMIN: 'company_admin',
  RECRUITER: 'recruiter',
  VIEWER: 'viewer',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete' | 'manage')[];
}

// Role definitions with permissions
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.MASTER_ADMIN]: [
    { resource: 'all', actions: ['create', 'read', 'update', 'delete', 'manage'] },
  ],
  [ROLES.COMPANY_ADMIN]: [
    { resource: 'jobs', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'candidates', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'interviews', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'recruiters', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'viewers', actions: ['create', 'read', 'delete'] },
    { resource: 'company', actions: ['read', 'update'] },
  ],
  [ROLES.RECRUITER]: [
    { resource: 'jobs', actions: ['read'] },
    { resource: 'candidates', actions: ['create', 'read', 'update'] },
    { resource: 'interviews', actions: ['read', 'update'] },
  ],
  [ROLES.VIEWER]: [
    { resource: 'jobs', actions: ['read'] },
    { resource: 'candidates', actions: ['read'] },
    { resource: 'interviews', actions: ['read'] },
  ],
};

export function hasPermission(
  userRole: Role,
  resource: string,
  action: 'create' | 'read' | 'update' | 'delete' | 'manage'
): boolean {
  const permissions = ROLE_PERMISSIONS[userRole];
  
  // Master admin has all permissions
  if (userRole === ROLES.MASTER_ADMIN) {
    return true;
  }
  
  return permissions.some(
    (perm) =>
      (perm.resource === resource || perm.resource === 'all') &&
      perm.actions.includes(action)
  );
}

export function canManageUsers(userRole: Role): boolean {
  return userRole === ROLES.MASTER_ADMIN || userRole === ROLES.COMPANY_ADMIN;
}

export function getMaxRecruiters(userRole: Role): number {
  if (userRole === ROLES.COMPANY_ADMIN) return 10;
  if (userRole === ROLES.MASTER_ADMIN) return Infinity;
  return 0;
}
