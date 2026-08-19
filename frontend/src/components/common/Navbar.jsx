import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Bell, LogOut, User as UserIcon, Settings as SettingsIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import Avatar from './Avatar';
import Dropdown, { DropdownItem } from './Dropdown';
import { useAuth } from '../../hooks/useAuth';
import { useDebounce } from '../../hooks/useDebounce';

const Navbar = ({ onSearch, onQuickAdd }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { unreadCount } = useSelector((state) => state.notification);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-3">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="Search workspace..."
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary-500 focus:bg-white focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onQuickAdd}
          className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          <Plus size={16} />
          Quick Add
        </button>

        <button
          onClick={() => navigate(`notifications`)}
          className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </button>

        <Dropdown
          align="right"
          trigger={<Avatar user={user} size="sm" className="cursor-pointer" showStatus />}
        >
          <div className="border-b border-gray-100 px-4 py-2">
            <p className="text-sm font-semibold text-gray-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="truncate text-xs text-gray-500">{user?.email}</p>
          </div>
          <DropdownItem icon={UserIcon} onClick={() => navigate('settings')}>
            Profile
          </DropdownItem>
          <DropdownItem icon={SettingsIcon} onClick={() => navigate('settings')}>
            Settings
          </DropdownItem>
          <DropdownItem icon={LogOut} danger onClick={handleLogout}>
            Log out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
};

export default Navbar;
