import { useEffect, useRef } from 'react';
import { MicOff, Monitor, Pin, PinOff } from 'lucide-react';

const VideoTile = ({
  stream,
  user,
  isLocal = false,
  isMuted = false,
  isVideoOff = false,
  isScreenSharing = false,
  isPinned = false,
  onPin,
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Team Member'
    : 'Team Member';

  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <div
      className={`group relative flex items-center justify-center overflow-hidden rounded-2xl bg-gray-900 shadow-xl transition-all duration-300 ${
        isPinned ? 'col-span-full row-span-2 h-full' : 'h-full min-h-[220px]'
      }`}
    >
      {/* Video Stream Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          isVideoOff ? 'opacity-0 hidden' : 'opacity-100 block'
        } ${isLocal && !isScreenSharing ? '-scale-x-100' : ''}`}
      />

      {/* Video Off Fallback Avatar Tile */}
      {isVideoOff && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 p-4">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={displayName}
              className="h-20 w-20 rounded-full object-cover ring-4 ring-indigo-500/40 shadow-lg"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600 font-bold text-2xl text-white ring-4 ring-indigo-500/40 shadow-lg">
              {initials}
            </div>
          )}
          <span className="mt-3 font-medium text-sm text-gray-300">{displayName}</span>
        </div>
      )}

      {/* Top Badges (Pin, Muted, Screen Sharing) */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        {onPin && (
          <button
            onClick={onPin}
            className="pointer-events-auto rounded-lg bg-gray-900/60 p-2 text-white opacity-0 backdrop-blur-md transition-opacity duration-200 hover:bg-gray-800/80 group-hover:opacity-100"
            title={isPinned ? 'Unpin video' : 'Pin video'}
          >
            {isPinned ? <PinOff size={16} /> : <Pin size={16} />}
          </button>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {isScreenSharing && (
            <span className="flex items-center gap-1 rounded-md bg-indigo-600/80 px-2 py-1 text-xs text-white backdrop-blur-md">
              <Monitor size={12} />
              <span>Presenting</span>
            </span>
          )}

          {isMuted && (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600/80 text-white backdrop-blur-md shadow-sm">
              <MicOff size={14} />
            </span>
          )}
        </div>
      </div>

      {/* Bottom Display Name Overlay */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-gray-950/70 px-3 py-1.5 backdrop-blur-md border border-white/10 text-white shadow-md">
        <span className="font-medium text-xs tracking-wide">
          {displayName} {isLocal ? '(You)' : ''}
        </span>
      </div>
    </div>
  );
};

export default VideoTile;
