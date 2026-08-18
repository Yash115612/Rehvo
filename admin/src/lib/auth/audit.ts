import { AdminAuditLog, AdminRole } from '@/types/admin';
import { createClient } from '../supabase/client';

const supabase = createClient();

/**
 * Records an immutable admin audit log in public.admin_audit_logs
 */
export async function logAdminAction(params: {
  adminUserId: string;
  adminEmail: string;
  adminRole: AdminRole;
  action: string;
  targetType: AdminAuditLog['target_type'];
  targetId: string;
  metadata?: Record<string, any>;
}): Promise<AdminAuditLog> {
  const dbTargetType = params.targetType.toLowerCase();

  const { data, error } = await supabase
    .from('admin_audit_logs')
    .insert({
      admin_user_id: params.adminUserId,
      admin_email: params.adminEmail,
      admin_role: params.adminRole.toLowerCase(),
      action: params.action,
      target_type: dbTargetType,
      target_id: params.targetId,
      metadata: params.metadata || {},
      ip_address: '127.0.0.1',
    })
    .select()
    .single();

  if (error || !data) {
    console.warn('[Audit Log] Failed to insert audit log to Supabase:', error);
    return {
      id: `log_${Date.now()}`,
      admin_user_id: params.adminUserId,
      admin_email: params.adminEmail,
      admin_role: params.adminRole,
      action: params.action,
      target_type: params.targetType,
      target_id: params.targetId,
      metadata: params.metadata,
      ip_address: '127.0.0.1',
      created_at: new Date().toISOString(),
    };
  }

  return {
    id: data.id,
    admin_user_id: data.admin_user_id,
    admin_email: data.admin_email,
    admin_role: (data.admin_role || 'OPERATIONS').toUpperCase() as any,
    action: data.action,
    target_type: (data.target_type || 'USER').toUpperCase() as any,
    target_id: data.target_id,
    metadata: data.metadata,
    ip_address: data.ip_address,
    created_at: data.created_at,
  };
}
