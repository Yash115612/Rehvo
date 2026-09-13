import { AdminRole } from './admin';

export type PermissionModule =
  | 'dashboard'
  | 'properties'
  | 'property_edit'
  | 'property_approval'
  | 'property_delete'
  | 'users'
  | 'owners'
  | 'flatmates'
  | 'pg_hostels'
  | 'commercial'
  | 'society'
  | 'payments'
  | 'refunds'
  | 'kyc'
  | 'chats'
  | 'visits'
  | 'showreels'
  | 'cms'
  | 'notifications'
  | 'ai'
  | 'support'
  | 'analytics'
  | 'staff'
  | 'security'
  | 'settings';

export interface ModulePermissions {
  view: boolean;
  create?: boolean;
  edit?: boolean;
  approve?: boolean;
  delete?: boolean;
  export?: boolean;
}

export type RolePermissionConfig = Record<PermissionModule, ModulePermissions>;

export interface StaffPermissionProfile {
  staffId: string;
  role: AdminRole;
  customOverrides?: Partial<RolePermissionConfig>;
}
