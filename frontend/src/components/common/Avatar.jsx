import { getInitials } from '../../utils/validators';

const SIZE_MAP = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-14 w-14 text-lg',
};

const STATUS_COLOR = {
  online: 'bg-emerald-500',
  away: 'bg-amber-500',
  offline: 'bg-gray-300',
};

const Avatar = ({ user, size = 'md', showStatus = false, className = '' }) => {
  const sizeClasses = SIZE_MAP[size] || SIZE_MAP.md;
  const initials = getInitials(user?.firstName, user?.lastName);

  const getAvatarUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('/uploads')) {
      const baseUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
      return `${baseUrl}${url}`;
    }
    return url;
  };

  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      {user?.avatar ? (
        <img
          src={getAvatarUrl(user.avatar)}
          alt={`${user.firstName} ${user.lastName || ''}`}
          className={`${sizeClasses} rounded-full object-cover ring-2 ring-white`}
        />
      ) : (
        <div
          className={`${sizeClasses} flex items-center justify-center rounded-full bg-primary-600 font-semibold text-white ring-2 ring-white`}
        >
          {initials}
        </div>
      )}
      {showStatus && (
        <span
          className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-white ${
            STATUS_COLOR[user?.status || 'offline']
          }`}
        />
      )}
    </div>
  );
};

export default Avatar;
