const PERMISSION_ROWS = [
  { label: 'Manage users', key: 'manage_users' },
  { label: 'Manage projects', key: 'manage_projects' },
  { label: 'Invite members', key: 'invite_members' },
  { label: 'Delete workspace', key: 'delete_workspace' },
  { label: 'Edit documents', key: 'edit_documents' },
  { label: 'Upload files', key: 'upload_files' },
  { label: 'View analytics', key: 'view_analytics' },
  { label: 'Configure settings', key: 'configure_settings' },
];

const ROLE_COLUMNS = ['workspace_admin', 'project_manager', 'member', 'guest'];

const ROLE_PERMISSION_MAP = {
  workspace_admin: ['manage_projects', 'invite_members', 'edit_documents', 'upload_files', 'view_analytics', 'configure_settings'],
  project_manager: ['manage_projects', 'edit_documents', 'upload_files', 'view_analytics'],
  member: ['edit_documents', 'upload_files'],
  guest: [],
};

const ROLE_LABELS_SHORT = {
  workspace_admin: 'Admin',
  project_manager: 'PM',
  member: 'Member',
  guest: 'Guest',
};

const Permissions = () => {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6">
      <h3 className="mb-1 text-lg font-semibold text-gray-900">Permissions</h3>
      <p className="mb-5 text-sm text-gray-500">
        Review what each role can do across this workspace.
      </p>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
            <th className="pb-2 font-medium">Permission</th>
            {ROLE_COLUMNS.map((role) => (
              <th key={role} className="pb-2 text-center font-medium">
                {ROLE_LABELS_SHORT[role]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PERMISSION_ROWS.map((perm) => (
            <tr key={perm.key} className="border-b border-gray-50 last:border-0">
              <td className="py-3 font-medium text-gray-700">{perm.label}</td>
              {ROLE_COLUMNS.map((role) => (
                <td key={role} className="text-center">
                  {ROLE_PERMISSION_MAP[role].includes(perm.key) ? (
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                  ) : (
                    <span className="inline-block h-2 w-2 rounded-full bg-gray-200" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Permissions;
