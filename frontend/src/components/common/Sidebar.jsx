import { NavLink, useParams } from 'react-router-dom';
import {
  Home,
  LayoutGrid,
  FileText,
  MessageSquare,
  Folder,
  BarChart3,
  Settings,
  Boxes,
  UserPlus,
} from 'lucide-react';
import { NAV_ITEMS } from '../../utils/constants';

const ICON_MAP = { Home, LayoutGrid, FileText, MessageSquare, Folder, BarChart3, Settings };

const Sidebar = ({ workspace, onInviteClick }) => {
  const { workspaceId } = useParams();

  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col border-r border-gray-100 bg-white">
      <div className="flex items-center gap-2 px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
          <Boxes size={18} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">CollabSphere</h1>
          <p className="text-xs uppercase tracking-wide text-gray-400">
            {workspace?.name || 'Enterprise Workspace'}
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ key, label, path, icon }) => {
          const Icon = ICON_MAP[icon];
          const to = `/workspaces/${workspaceId}${path ? `/${path}` : ''}`;
          return (
            <NavLink
              key={key}
              to={to}
              end={path === ''}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 p-3">
        <button
          onClick={onInviteClick}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-50 px-3 py-2.5 text-sm font-semibold text-primary-700 hover:bg-primary-100"
        >
          <UserPlus size={16} />
          Invite Members
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
