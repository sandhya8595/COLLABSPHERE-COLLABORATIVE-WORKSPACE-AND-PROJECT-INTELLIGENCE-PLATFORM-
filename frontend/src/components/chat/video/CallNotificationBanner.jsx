import { Video, Users } from 'lucide-react';

const CallNotificationBanner = ({ activeCount = 1, onJoinCall }) => {
  return (
    <div className="flex items-center justify-between border-b border-indigo-100 bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 px-5 py-2.5 text-white shadow-inner">
      <div className="flex items-center gap-3">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
        </span>
        <div className="flex items-center gap-2">
          <Video size={18} className="text-indigo-200" />
          <span className="font-semibold text-xs tracking-wide">Video Call in Progress</span>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-indigo-700/60 px-2.5 py-0.5 text-[11px] font-medium text-indigo-100 border border-indigo-500/30">
          <Users size={12} />
          <span>{activeCount} {activeCount === 1 ? 'member' : 'members'} active</span>
        </span>
      </div>

      <button
        onClick={onJoinCall}
        className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1 text-xs font-semibold text-gray-950 shadow hover:bg-emerald-400 active:scale-95 transition-all"
      >
        <Video size={14} />
        <span>Join Call</span>
      </button>
    </div>
  );
};

export default CallNotificationBanner;
