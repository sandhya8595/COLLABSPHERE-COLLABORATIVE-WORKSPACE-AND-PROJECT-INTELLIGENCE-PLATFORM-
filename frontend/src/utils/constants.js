export const TASK_PRIORITIES = ['low', 'medium', 'high', 'urgent'];

export const PRIORITY_COLORS = {
  low: 'bg-blue-100 text-blue-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

export const ROLE_LABELS = {
  super_admin: 'Super Admin',
  org_admin: 'Org Admin',
  workspace_admin: 'Admin',
  project_manager: 'Project Manager',
  member: 'Member',
  guest: 'Guest',
};

export const NAV_ITEMS = [
  { key: 'home', label: 'Home', path: '', icon: 'Home' },
  { key: 'projects', label: 'Projects', path: 'projects', icon: 'LayoutGrid' },
  { key: 'documents', label: 'Documents', path: 'documents', icon: 'FileText' },
  { key: 'chat', label: 'Chat', path: 'chat', icon: 'MessageSquare' },
  { key: 'files', label: 'Files', path: 'files', icon: 'Folder' },
  { key: 'analytics', label: 'Analytics', path: 'analytics', icon: 'BarChart3' },
  { key: 'settings', label: 'Settings', path: 'settings', icon: 'Settings' },
];
