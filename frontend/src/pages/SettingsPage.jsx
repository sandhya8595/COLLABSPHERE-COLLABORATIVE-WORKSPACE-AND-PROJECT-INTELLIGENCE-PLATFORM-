import { useState } from 'react';
import { useDispatch } from 'react-redux';
import ProfileSettings from '../components/settings/ProfileSettings';
import WorkspaceBrand from '../components/settings/WorkspaceBrand';
import TeamMembers from '../components/settings/TeamMembers';
import Permissions from '../components/settings/Permissions';
import Security from '../components/settings/Security';
import Billing from '../components/settings/Billing';
import { fetchMyWorkspaces } from '../store/workspaceSlice';

const TABS = [
  { key: 'profile', label: 'Profile' },
  { key: 'team', label: 'Team Members' },
  { key: 'permissions', label: 'Permissions' },
  { key: 'security', label: 'Security' },
  { key: 'billing', label: 'Billing' },
];

const SettingsPage = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('profile');

  const refreshWorkspace = () => dispatch(fetchMyWorkspaces());

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Workspace Settings</h1>
      <p className="mt-1 text-sm text-gray-500">
        Manage your administrative controls, team members, and security policies.
      </p>

      <div className="mt-6 border-b border-gray-100">
        <nav className="flex gap-6">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6 space-y-6">
        {activeTab === 'profile' && (
          <>
            <ProfileSettings />
            <WorkspaceBrand />
          </>
        )}
        {activeTab === 'team' && <TeamMembers onRefresh={refreshWorkspace} />}
        {activeTab === 'permissions' && <Permissions />}
        {activeTab === 'security' && <Security />}
        {activeTab === 'billing' && <Billing />}
      </div>
    </div>
  );
};

export default SettingsPage;
