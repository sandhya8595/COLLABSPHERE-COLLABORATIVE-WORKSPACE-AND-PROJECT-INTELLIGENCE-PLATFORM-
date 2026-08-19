const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ORG_ADMIN: 'org_admin',
  WORKSPACE_ADMIN: 'workspace_admin',
  PROJECT_MANAGER: 'project_manager',
  MEMBER: 'member',
  GUEST: 'guest',
};

const ROLE_HIERARCHY = [
  ROLES.SUPER_ADMIN,
  ROLES.ORG_ADMIN,
  ROLES.WORKSPACE_ADMIN,
  ROLES.PROJECT_MANAGER,
  ROLES.MEMBER,
  ROLES.GUEST,
];

const PERMISSIONS = {
  MANAGE_USERS: 'manage_users',
  MANAGE_PROJECTS: 'manage_projects',
  INVITE_MEMBERS: 'invite_members',
  DELETE_WORKSPACE: 'delete_workspace',
  EDIT_DOCUMENTS: 'edit_documents',
  UPLOAD_FILES: 'upload_files',
  VIEW_ANALYTICS: 'view_analytics',
  CONFIGURE_SETTINGS: 'configure_settings',
};

const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.ORG_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.WORKSPACE_ADMIN]: [
    PERMISSIONS.MANAGE_PROJECTS,
    PERMISSIONS.INVITE_MEMBERS,
    PERMISSIONS.EDIT_DOCUMENTS,
    PERMISSIONS.UPLOAD_FILES,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.CONFIGURE_SETTINGS,
  ],
  [ROLES.PROJECT_MANAGER]: [
    PERMISSIONS.MANAGE_PROJECTS,
    PERMISSIONS.EDIT_DOCUMENTS,
    PERMISSIONS.UPLOAD_FILES,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
  [ROLES.MEMBER]: [PERMISSIONS.EDIT_DOCUMENTS, PERMISSIONS.UPLOAD_FILES],
  [ROLES.GUEST]: [],
};

const NOTIFICATION_TYPES = {
  TASK_ASSIGNED: 'task_assigned',
  TASK_UPDATED: 'task_updated',
  MENTION: 'mention',
  DOCUMENT_EDITED: 'document_edited',
  FILE_UPLOADED: 'file_uploaded',
  CHAT_MESSAGE: 'chat_message',
  WORKSPACE_INVITATION: 'workspace_invitation',
  DUE_DATE_REMINDER: 'due_date_reminder',
};

const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

const AUDIT_ACTIONS = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  FILE_UPLOAD: 'file_upload',
  TASK_DELETE: 'task_delete',
  DOCUMENT_RESTORE: 'document_restore',
  ROLE_UPDATE: 'role_update',
  PERMISSION_CHANGE: 'permission_change',
};

module.exports = {
  ROLES,
  ROLE_HIERARCHY,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  NOTIFICATION_TYPES,
  TASK_PRIORITY,
  AUDIT_ACTIONS,
};
