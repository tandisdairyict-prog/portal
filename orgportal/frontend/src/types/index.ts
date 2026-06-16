export interface Company {
  id: number; name: string; shortName?: string; logoUrl?: string; isActive: boolean; createdAt: string;
}

export interface Department {
  id: number; companyId: number; companyName: string; parentDepartmentId?: number; name: string; code: string; isActive: boolean;
}

export interface Position {
  id: number; departmentId: number; departmentName: string; parentPositionId?: number; parentPositionTitle?: string;
  title: string; description?: string; level: number; isActive: boolean; roles: Role[]; assignedUsers: UserSummary[];
}

export interface PositionTree {
  id: number; title: string; level: number; isActive: boolean; assignedUsers: UserSummary[]; children: PositionTree[];
}

export interface User {
  id: number; username: string; email: string; firstName: string; lastName: string; fullName: string;
  personnelNumber?: string; nationalId?: string; phoneNumber?: string; avatarUrl?: string;
  isActive: boolean; isAdUser: boolean; createdAt: string; lastLoginAt?: string; positions: UserPosition[];
}

export interface UserSummary { id: number; fullName: string; avatarUrl?: string; personnelNumber?: string; }

export interface UserPosition {
  positionId: number; positionTitle: string; departmentName: string; companyName: string; isPrimary: boolean; isActive: boolean;
}

export interface Role {
  id: number; name: string; description?: string; isActive: boolean; createdAt: string; permissions: Permission[];
}

export interface Permission {
  id: number; applicationId: number; applicationCode: string; applicationName: string;
  name: string; module: string; action: string; description?: string;
}

export interface PermissionTree {
  appCode: string; appName: string; modules: PermissionModule[];
}

export interface PermissionModule { module: string; actions: PermissionAction[]; }
export interface PermissionAction { id: number; action: string; fullName: string; isGranted: boolean; }

export interface Application {
  id: number; name: string; code: string; description?: string; iconClass?: string; url?: string; isActive: boolean; order: number;
}

export interface LoginResponse {
  token: string; refreshToken: string; expiresAt: string; user: User;
}

export interface Manager { userId: number; fullName: string; positionTitle: string; }
